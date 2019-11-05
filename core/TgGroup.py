import telegram
from telegram.ext import Updater
from time import sleep


class TgBot:
    token = None
    bot = None
    REQUEST_ARGS = None

    def __init__(self, token, REQUEST_ARGS):
        self.token = token
        self.REQUEST_ARGS = REQUEST_ARGS
        self.authorize()

    def authorize(self):
        """
        Authorizes bot
        """
        updater = Updater(self.token, )  # request_kwargs=self.REQUEST_KWARGS
        self.bot = updater.bot

    def post(self, data):
        """
        Posts a message to a group
        :param data: dict {'text', 'id'}
        :return: dict {'result', 'message'}
        """
        try:
            m = self.bot.send_message(data['id'], text=data['text'])
            if data.get('files'):
                for file in data['files']:
                    try:
                        photo = open(file, 'rb')
                        self.bot.send_photo(data['id'], photo)
                    except telegram.error.TimedOut:
                        sleep(0.1)
                        photo = open(file, 'rb')
                        self.bot.send_photo(data['id'], photo, timeout=100)
            print(m['message_id'])
            return {'result': 1, "message": m}
        except telegram.error.Unauthorized:
            self.authorize()
            m = self.bot.send_message(data['id'], text=data['text'])
            print(m['message_id'])
            return {'result': 1, "message": m}

    def change(self, data):
        """
        Changes sent message
        :param data: {'text', 'message_id', 'id'}
        :return: {'result', 'message'}
        """
        try:
            m = self.bot.edit_message_text(text=data['text'], chat_id=data['id'], message_id=data['message_id'])
            return {'result': 1, "message": m}
        except telegram.error.Unauthorized:
            self.authorize()
            m = self.bot.edit_message_text(text=data['text'], chat_id=data['id'], message_id=data['message_id'])
            return {'result': 1, "message": m}

    def delete(self, data):
        """
        deletes sent message
        :param data: {'message_id', 'id'}
        :return: {'result'}
        """
        try:
            m = self.bot.delete_message(chat_id=data['id'], message_id=data['message_id'])
            return {'result': m}
        except telegram.error.Unauthorized:
            self.authorize()
            m = self.bot.delete_message(chat_id=data['id'], message_id=data['message_id'])
            return {'result': m}

    def check(self, id):
        """
        checks if bot is admin of a group
        :param id: group id
        """
        try:
            self.authorize()
            bot_id = self.bot.get_me()['id']
            return True if self.bot.get_chat_member(chat_id=id, user_id=bot_id)['can_post_messages'] else False
        except telegram.error.Unauthorized:
            self.authorize()
            bot_id = self.bot.get_me()['id']
            return True if self.bot.get_chat_member(chat_id=id, user_id=bot_id)['can_post_messages'] else False

