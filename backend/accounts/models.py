from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

"""
This is a custom authentication backend to authenticate user using email
"""


class EmailBackend(ModelBackend):

    # Used to authenticate user using email

    def authenticate(self, request, email=None, password=None, **kwargs):
        UserModel = get_user_model()
        if email:
            email = email.lower()
            try:
                user = UserModel.objects.get(email=email)
                if user.check_password(password):
                    return user
            except UserModel.DoesNotExist:
                return None
        return None

    # Used to get user using user ID

    def get_user(self, user_id):
        UserModel = get_user_model()
        try:
            return UserModel.objects.get(pk=user_id)
        except UserModel.DoesNotExist:
            return None
