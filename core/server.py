from flask import Flask, g, request, jsonify, send_from_directory
import os
from pony.orm import *
from flask_restful import Resource, Api
from personal_data import secret_key, login, password, token
from TgGroup import TgBot
from VKGroup import VKBot
from flask_restful import reqparse
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from itsdangerous import (TimedJSONWebSignatureSerializer
                          as Serializer, BadSignature, SignatureExpired)
from flask_httpauth import HTTPBasicAuth


parser = reqparse.RequestParser()
parser.add_argument('post_id')
parser.add_argument('group_type')
parser.add_argument('login')
parser.add_argument('name')
parser.add_argument('text')
parser.add_argument('username')
parser.add_argument('password')
parser.add_argument('group_id')
app = Flask(__name__)
app.secret_key = secret_key
app.config['UPLOAD_FOLDER'] = "/Users/macbook/Desktop/HSE-lyceum-project/core/photos"
api = Api(app)
auth = HTTPBasicAuth()


tg_bot = None
vk_bot = None


'''
Классы ниже описывают базу данных, каждый класс - отдельная таблица.
'''


db = Database()


class User(db.Entity):
    login = Required(str)
    password = Required(str)
    groups = Set(lambda: Group)
    posts = Set(lambda: Post)

    def check_password(self, value):
        return check_password_hash(self.password, value)

    def generate_auth_token(self, expiration=3000):
        s = Serializer(app.config['SECRET_KEY'], expires_in=expiration)
        return s.dumps({'id': self.id})

    @staticmethod
    def verify_auth_token(token):
        s = Serializer(app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except SignatureExpired:
            return None  # valid token, but expired
        except BadSignature:
            return None  # invalid token
        return User.get(id=data['id'])

    @staticmethod
    def get_by_login(login):
        return User.get(login=login)

    def __repr__(self):
        return '<User {}>'.format(self.login)


class Group(db.Entity):
    group_name = Required(str)
    group_id = Required(str)
    checked = Required(bool)
    group_type = Required(str)
    owner = Required(User)
    posts = Set(lambda: PostOnline)


class Post(db.Entity):
    text = Required(str)
    owner = Required(User)
    files = Set(lambda: File)
    posts = Set(lambda: PostOnline)


class PostOnline(db.Entity):
    post_id = Required(int)
    group = Required(Group)
    post = Required(Post)


class File(db.Entity):
    path = Required(str)
    post = Required(Post)


'''
Классы ниже описывают запросы к сайту, каждый класс - отдельный маршрут, а функции - метод запроса.
'''


@app.route('/create_post', methods=['POST'])
@auth.login_required
@db_session
def create_post():
    r = dict(request.form)
    photos = request.files.getlist("photo[]")
    post = Post(text=r['text'][0], owner=User.get(login=r['login'][0]))
    filenames = []
    for photo in photos:
        filename = secure_filename(photo.filename)
        path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        filenames.append(path)
        photo.save(path)
        File(path=path, post=post)
    for group in r['groups[]']:
        if Group.get(group_id=group).group_type == 'VK':
            data = vk_bot.post({'id': int(group), 'text': r['text'][0], "files": filenames})
            PostOnline(post_id=data['post_id'], group=Group.get(group_id=group), post=post)
        elif Group.get(group_id=group).group_type == 'Telegram':
            data = tg_bot.post({'id': int(group), 'text': r['text'][0], "files": filenames})
            PostOnline(post_id=data['message'].message_id, group=Group.get(group_id=group), post=post)
    return jsonify({"result": '1'})


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'],
                               filename)


class Groups(Resource):
    @auth.login_required
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('login')
        args = parser.parse_args()
        groups = []
        with db_session:
            user = User.get(login=args['login'])
            for group in select(group for group in Group if group.owner == user):
                groups.append({'name': group.group_name, 'checked': group.checked,
                               'id': group.group_id, 'type': group.group_type})
        return groups


class Check(Resource):
    @auth.login_required
    def post(self):
        args = parser.parse_args()
        group_id = args['group_id']
        with db_session:
            group = Group.get(group_id=group_id)
            if group.group_type == 'VK':
                group.checked = vk_bot.check(int(group_id))
            if group.group_type == 'Telegram':
                group.checked = tg_bot.check(int(group_id))
            if group.group_type == 'Facebook':
                group.checked =True


class Delete(Resource):
    @auth.login_required
    def post(self):
        args = parser.parse_args()
        group_id = args['group_id']
        with db_session:
            Group.get(group_id=group_id).delete()


class Add(Resource):
    @auth.login_required
    def post(self):
        args = parser.parse_args()
        group_id = args['group_id']
        group_type = args['group_type']
        group_name = args['name']
        login = args["login"]
        with db_session:
            user = User.get(login=login)
            Group(group_id=group_id, group_type=group_type, group_name=group_name, owner=user, checked=False)


class Change(Resource):
    @auth.login_required
    def post(self):
        args = parser.parse_args()
        group_id = args['group_id']
        group_type = args['group_type']
        group_name = args['name']
        with db_session:
            group = Group.get(group_id=group_id)
            group.group_type = group_type
            group.group_name = group_name


class GetPosts(Resource):
    @auth.login_required
    @db_session
    def get(self):
        args = parser.parse_args()
        login = args['login']
        user = User.get(login=login)
        posts = select(post for post in Post if post.owner== user)
        data =[]
        for post in posts:
            files = [file.path.replace(app.config['UPLOAD_FOLDER'], 'http://localhost:5000/uploads') for file in post.files]
            groups = []
            for post_online in post.posts:
                group_name = post_online.group.group_name
                groups.append((post_online.post_id, group_name))
            data.append({'text': post.text, 'groups': groups, 'photos':files, 'id':post.id})
        return data


class ChangePost(Resource):
    @auth.login_required
    @db_session
    def post(self):
        args = parser.parse_args()
        post_id = args['post_id']
        post = Post.get(id=post_id)
        text = args['text']
        for p in post.posts:
            if p.group.group_type == 'VK':
                vk_bot.change({'id': p.group.group_id, 'post_id': p.post_id, 'text':text})
            if p.group.group_type == 'Telegram':
                tg_bot.change({'id': p.group.group_id, 'message_id': p.post_id, 'text':text})
        post.text = args['text']


class CreateUser(Resource):
    @db_session
    def post(self):
        args = parser.parse_args()
        login = args['login']
        if User.get(login=login):
            print('Пользователь с таким логином уже существует')
            return {'result': 0, 'err': 'Пользователь с таким логином уже существует'}
        password = args['password']
        user = User(login=login, password=generate_password_hash(password))
        g.user = user
        print('Зарегистрирован')
        return {'result': 1, 'err': ''}


class DeletePost(Resource):
    @db_session
    @auth.login_required
    def post(self):
        args = parser.parse_args()
        id = args['post_id']
        post = Post.get(id=id)
        for p in post.posts:
            if p.group.group_type == 'VK':
                vk_bot.delete({'id':p.group.group_id, 'post_id':p.post_id})
            if p.group.group_type == 'Telegram':
                tg_bot.delete({'id':p.group.group_id, 'message_id':p.post_id})
            p.delete()
        for file in post.files:
            file.delete()
        post.delete()


class Login(Resource):
    @db_session
    def post(self):
        args = parser.parse_args()
        login = args['login']
        password = args['password']
        if verify_password(login, password):
            return {'result': 1, 'err': ''}
        else:
            return {'result': 0, 'err': 'Неверный логин или пароль.'}


class AuthToken(Resource):
    @auth.login_required
    def get(self):
        token = g.user.generate_auth_token()
        return {'token': token.decode('ascii')}


api.add_resource(Groups, '/groups')
api.add_resource(Check, '/check')
api.add_resource(Delete, '/delete')
api.add_resource(Add, '/add')
api.add_resource(Change, '/change')
api.add_resource(AuthToken, '/get_token')
api.add_resource(CreateUser, '/create_user')
api.add_resource(Login, '/login')
api.add_resource(GetPosts, '/posts')
api.add_resource(DeletePost, '/delete_post')
api.add_resource(ChangePost, '/change_post')


@auth.verify_password
@db_session
def verify_password(login_or_token, password):
    """Validate user passwords and store user in the 'g' object"""
    # first try to authenticate by token
    user = User.verify_auth_token(login_or_token)
    if not user:
        # try to authenticate with login/password
        user = select(p for p in User if p.login == login_or_token).first()
        if not user or not user.check_password(password):
            return False
    g.user = user
    return True


if __name__ == '__main__':
    vk_bot = VKBot(login, password)
    tg_bot = TgBot(token, {})
    db.bind(provider='sqlite', filename='db.sqlite', create_db=True)
    db.generate_mapping(create_tables=True)
    app.run(debug=True)
