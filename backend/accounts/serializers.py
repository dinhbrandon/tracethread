from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password

# Serializer to Get User Details using Django Token Authentication


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            "id",
            "first_name",
            "last_name",
            "username",
            "email",
        ]


# Serializer to Register User
class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
      required=True,
      validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(
      write_only=True,
      required=True,
      validators=[validate_password]
      )
    password2 = serializers.CharField(
        write_only=True,
        required=True
      )
# First name and last name are required fields

    class Meta:
        model = User
        fields = (
                'username',
                'password',
                'password2',
                'email',
                'first_name',
                'last_name'
            )
        extra_kwargs = {
          'first_name': {'required': True},
          'last_name': {'required': True}
        }
# Check if the password and confirm password fields match

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
              {"password": "Password fields didn't match."}
            )

        return attrs
# Create user

    def create(self, validated_data):
        # Remove confirm password field
        validated_data.pop('password2')
        user = User.objects.create(
          username=validated_data['username'],
          email=validated_data['email'].lower(),
          first_name=validated_data['first_name'],
          last_name=validated_data['last_name']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

# Serializer to Change Password


class ChangePasswordSerializer(serializers.Serializer):
    model = User

    """
    Serializer for password change endpoint.
    """
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(
        required=True,
        validators=[validate_password]
        )


# Serializer to Update User Details


class UpdateUserSerializer(serializers.ModelSerializer):
    # Email field is unique, so we need to check if the email is already taken
    email = serializers.EmailField(
      required=True,
      validators=[UniqueValidator(queryset=User.objects.all())]
    )

    class Meta:
        model = User
        fields = (
                'username',
                'email',
                'first_name',
                'last_name'
            )
        extra_kwargs = {
          'first_name': {'required': True},
          'last_name': {'required': True}
        }
# Update user

    def update(self, instance, validated_data):
        instance.username = validated_data.get(
            'username', instance.username)
        instance.email = validated_data.get(
            'email', instance.email)
        instance.first_name = validated_data.get(
            'first_name', instance.first_name)
        instance.last_name = validated_data.get(
            'last_name', instance.last_name)
        instance.save()
        return instance
