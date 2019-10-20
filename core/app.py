from flask import *
from personal_data import secret_key, login, password, token
from TgGroup import TgBot
from VKGroup import VKBot
from pony.orm import *

app = Flask(__name__)
app.secret_key = secret_key

vk_bot = None
tg_bot = None

db = Database()


class Group(db.Entity):
    group_name = Required(str)
    group_id = Required(str)
    checked = Required(bool)
    group_type = Required(str)


@app.route('/', methods=['POST', 'GET'])
def post():
    groups = []
    with db_session:
        for group in select(p for p in Group if p.checked):
            groups.append({'name': group.group_name, 'checked': group.checked,
                           'id': group.group_id, 'type': group.group_type})
        if request.method == 'POST':
            r = dict(request.form)
            for group in r['groups[]']:
                if Group.get(group_id=group).group_type == 'VK':
                    vk_bot.post({'id': int(group), 'text': r['text'][0]})
                elif Group.get(group_id=group).group_type == 'Telegram':
                    tg_bot.post({'id': int(group), 'text': r['text'][0]})
            return render_template('post.html', message='Отправлено!', groups=groups)
    return render_template('post.html', groups=groups)


@app.route('/groups', methods=['POST', 'GET'])
def groups():
    groups = []
    with db_session:
        for group in Group.select():
            groups.append({'name': group.group_name, 'checked': group.checked,
                           'id': group.group_id, 'type': group.group_type})
    return render_template('groups.html', groups=groups)


@app.route('/posts', methods=['POST', 'GET'])
def posts():
    return render_template('posts.html')


@app.route('/change', methods=['POST'])
def change():
    print(request.form)
    group_id = request.form['group']
    group_type = request.form['group_type']
    group_name = request.form['name']
    with db_session:
        group = Group.get(group_id=group_id)
        group.group_type = group_type
        group.group_name = group_name
    print('Changed', group_name)
    return redirect(url_for('groups'))


@app.route('/delete', methods=['POST'])
def delete():
    group_id = request.form['group']
    with db_session:
        Group.get(group_id=group_id).delete()
    return redirect(url_for('groups'))


@app.route('/check', methods=['POST'])
def check():
    group_id = request.form['group']
    with db_session:
        group = Group.get(group_id=group_id)
        if group.group_type == 'VK':
            group.checked = vk_bot.check(int(group_id))
        if group.group_type == 'Telegram':
            group.checked = tg_bot.check(int(group_id))
    return redirect(url_for('groups'))


@app.route('/add', methods=['POST'])
def add():
    print(request.form)
    group_id = request.form['group']
    group_type = request.form['group_type']
    group_name = request.form['name']
    with db_session:
        Group(group_id=group_id, group_type=group_type, group_name=group_name, checked=False)
    print('Аdded', group_name)
    return redirect(url_for('groups'))


if __name__ == '__main__':
    vk_bot = VKBot(login, password)
    tg_bot = TgBot(token, {})
    db.bind(provider='sqlite', filename='database.sqlite', create_db=True)
    db.generate_mapping(create_tables=True)
    app.run(debug=True)
