# Serializers
from rest_framework import serializers
from .models import Feedback, Comments, Upvote


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'


class CommentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comments
        fields = '__all__'


class UpvoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Upvote
        fields = '__all__'
