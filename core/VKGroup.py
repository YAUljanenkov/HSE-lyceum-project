import vk_api
from personal_data import secret_key, login, password, token

class VKBot:
    login = ''
    password = ''
    vk = None
    upload=None

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
        self.upload = vk_api.VkUpload(vk_session)

    def post(self, data):
        """
        Posts a message to a group
        :param data: dict {'text', 'id'}
        :return: dict {'result', 'message'}
        """
        try:
            attachments = ''
            if data.get('files'):

                for file in data['files']:
                    photo = self.upload.photo(
                        file,
                        album_id=self.vk.photos.getAlbums(owner_id=data['id'])['items'][0]['id'],
                        group_id=abs(int(data['id']))
                    )
                    attachments += ',photo{}_{}'.format(photo[0]['owner_id'], photo[0]['id'])
            post_id = self.vk.wall.post(message=data['text'], owner_id=data['id'], attachments=attachments,
                                        from_group=1, v='5.101')
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
        return {'result': 1, "post_id":post_id}

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


if __name__ =='__main__':
    vk_bot = VKBot(login, password)
    photo = vk_bot.upload.photo(
        '/Users/macbook/Desktop/HSE-lyceum-project/core/photos/metro-new-1.jpg',
        album_id=258455213,
        group_id=174487798
    )