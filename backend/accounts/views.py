from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.authentication import TokenAuthentication
from rest_framework import generics
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.generics import ListAPIView
from .serializers import (
    UserSerializer,
    RegisterSerializer,
    UpdateUserSerializer,
    ChangePasswordSerializer
    )
from JobNotebook.models import Column

# Class based view to get user details


class UserDetailAPI(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    # This view gets details of a single user account
    # by user ID and returns the data from UserSerializer instance
    def get(self, request, *args, **kwargs):
        user = User.objects.get(id=request.user.id)
        serializer = UserSerializer(user)
        return Response(serializer.data)

# Class based view to get list of all users


class ListUsersAPI(ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    pagination_class = None

# Class based view to register user


class RegisterUserAPIView(generics.CreateAPIView):
    permission_classes = [AllowAny, ]
    serializer_class = RegisterSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        Column.objects.create(name='Saved', owner=user, order=0)
        Column.objects.create(name='Applied', owner=user, order=1)
        Column.objects.create(name='Followed Up', owner=user, order=2)
        Column.objects.create(name='Interviewing', owner=user, order=3)
        Column.objects.create(name='Offer', owner=user, order=4)
        Column.objects.create(name='Rejected', owner=user, order=5)


# Class based view to login user


class LoginUserAPIView(APIView):
    permission_classes = (AllowAny,)

# This view authenticates user using email and password
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(email=email, password=password)
# If user is authenticated, it returns the token key
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=200)
        else:
            return Response(
                {'error': 'Wrong Credentials'},
                status=status.HTTP_401_UNAUTHORIZED
                )


class LogoutUserAPIView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)
# This view logs out the user by deleting the token key

    def post(self, request):
        request.user.auth_token.delete()
        return Response(
            {'message': 'Successfully Logged Out'},
            status=status.HTTP_200_OK
            )

# Class based view to update user details


class EditUser(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def put(self, request, *args, **kwargs):
        user = User.objects.get(id=request.user.id)
        serializer = UpdateUserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'message': 'User details updated successfully'},
                status=status.HTTP_200_OK
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Class based view to change password


class ChangePasssword(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def put(self, request, *args, **kwargs):
        user = User.objects.get(id=request.user.id)
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            if not user.check_password(serializer.data.get("old_password")):
                return Response(
                    {"old_password": ["Wrong password."]},
                    status=status.HTTP_400_BAD_REQUEST
                    )
            user.set_password(serializer.data.get("new_password"))
            user.save()
            return Response(
                {"message": "Password updated successfully"},
                status=status.HTTP_200_OK
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Class based view to delete user account


class DeleteAccount(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def delete(self, request, *args, **kwargs):
        user = User.objects.get(id=request.user.id)
        user.delete()
        return Response(
            {"message": "Account deleted successfully"},
            status=status.HTTP_200_OK
            )
