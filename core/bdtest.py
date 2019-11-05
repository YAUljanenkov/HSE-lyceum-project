from pony.orm import *


db = Database()


class User(db.Entity):
    name = Required(str)
    posts = Set(lambda: Post)


class Post(db.Entity):
    text = Required(str)
    author = Required(User)
    files = Set(lambda: Photo)


class Photo(db.Entity):
    path = Required(str)
    post = Required(Post)


db.bind(provider='sqlite', filename='db.sqlite', create_db=True)
db.generate_mapping(create_tables=True)

with db_session:
    User(name='Lol')
    Post(text='ksafds', author=User[1])
    Photo(path='1s234', post=Post[1])
    Photo(path='1d3', post=Post[1])
    Photo(path='1d2', post=Post[1])
    print(User[1].posts)
    print(Post[1].files)
    print(User.get(id=1000))