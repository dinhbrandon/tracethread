from django.urls import path
from .views import (
    UserDetailAPI,
    RegisterUserAPIView,
    LoginUserAPIView,
    LogoutUserAPIView,
    ListUsersAPI,
    ChangePasssword,
    EditUser,
    )

urlpatterns = [
  path("user-details", UserDetailAPI.as_view()),
  path('register', RegisterUserAPIView.as_view()),
  path('login', LoginUserAPIView.as_view()),
  path('logout', LogoutUserAPIView.as_view()),
  path('users', ListUsersAPI.as_view()),
  path('edit-user-details', EditUser.as_view()),
  path('change-password', ChangePasssword.as_view()),
]
