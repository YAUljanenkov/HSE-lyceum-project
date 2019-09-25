import vk_api
from personal_data import LOGIN, PASSWORD


class VKBot:
    login = ''
    password = ''
    vk = None

    def __init__(self, login, password):
        self.login = login
        self.password = password
        self.authorize()

    def authorize(self):
        vk_session = vk_api.VkApi(self.login, self.password)
        vk_session.auth()
        self.vk = vk_session.get_api()

    def post(self, data):
        try:
            post_id = self.vk.wall.post(message=data['message'], owner_id=data['id'], from_group=1, v='5.101')
            return {'result': 1, **post_id}
        except vk_api.exceptions.ApiError:
            self.authorize()
            post_id = self.vk.wall.post(message=data['message'], owner_id=data['id'], from_group=1, v='5.101')
            return {'result': 1, **post_id}

    def change(self, data):
        try:
            post_id = self.vk.wall.edit(message=data['message'], owner_id=data['id'], post_id=data['post_id'],
                                        v='5.101')
            return {'result': 1, **post_id}
        except vk_api.exceptions.ApiError:
            self.authorize()
            post_id = self.vk.wall.edit(message=data['message'], owner_id=data['id'], post_id=data['post_id'],
                                        v='5.101')
            return {'result': 1, **post_id}

    def delete(self, data):
        try:
            post_id = self.vk.wall.delete(message=data['message'], owner_id=data['id'], post_id=data['post_id'],
                                          v='5.101')
        except vk_api.exceptions.ApiError:
            self.authorize()
            post_id = self.vk.wall.delete(message=data['message'], owner_id=data['id'], post_id=data['post_id'],
                                          v='5.101')


new_data = {'message': 'lol', 'id': '-174487798'}
bot = VKBot(LOGIN, PASSWORD)
post = bot.post(new_data)['post_id']
input()
new_data = {'message': 'kek', 'id': '-174487798', 'post_id': post}
some_data = bot.change(new_data)
input()
bot.delete(new_data)
