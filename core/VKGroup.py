import vk_api
from personal_data import login, password


class VKBot:
    login = ''
    password = ''
    vk = None

    def __init__(self, login, password):
        self.login = login
        self.password = password
        self.authorize()

    def authorize(self):
        """
        Authorizes bot
        """
        vk_session = vk_api.VkApi(self.login, self.password)
        vk_session.auth()
        self.vk = vk_session.get_api()

    def post(self, data):
        """
        Posts a message to a group
        :param data: dict {'text', 'id'}
        :return: dict {'result', 'message'}
        """
        try:
            post_id = self.vk.wall.post(message=data['text'], owner_id=data['id'], from_group=1, v='5.101')
            return {'result': 1, **post_id}
        except vk_api.exceptions.ApiError:
            self.authorize()
            post_id = self.vk.wall.post(message=data['text'], owner_id=data['id'], from_group=1, v='5.101')
            return {'result': 1, **post_id}

    def change(self, data):
        """
        Changes post
        :param data: {'text', 'post_id', 'id'}
        :return: {'result', 'message'}
        """
        try:
            post_id = self.vk.wall.edit(message=data['text'], owner_id=data['id'], post_id=data['post_id'],
                                        v='5.101')
            return {'result': 1, **post_id}
        except vk_api.exceptions.ApiError:
            self.authorize()
            post_id = self.vk.wall.edit(message=data['text'], owner_id=data['id'], post_id=data['post_id'],
                                        v='5.101')
            return {'result': 1, **post_id}

    def delete(self, data):
        """
        deletes post
        :param data: {'post_id', 'id'}
        :return: {'result'}
        """
        try:
            post_id = self.vk.wall.delete(owner_id=data['id'], post_id=data['post_id'], v='5.101')
        except vk_api.exceptions.ApiError:
            self.authorize()
            post_id = self.vk.wall.delete(owner_id=data['id'], post_id=data['post_id'], v='5.101')
        return {'result': 1, **post_id}

    def check(self, id):
        """
        checks if bot is admin of a group
        :param id: group id
        """
        groups = self.vk.groups.get(filter='admin', count=1000, v='5.101')
        for group in groups['items']:
            if abs(group) == abs(id):
                return True
        return False

    def join(self, group_id):
        self.vk.groups.join(group_id)
        return 1


if __name__ == '__main__':
    bot = VKBot(login, password)
    print(bot.check(-187534334))