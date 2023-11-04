# Serializers
from rest_framework import serializers
from .models import Feedback, Comments, Upvote


class FeedbackSerializer(serializers.ModelSerializer):
    has_upvoted = serializers.BooleanField(read_only=True)

    class Meta:
        model = Feedback
        fields = '__all__'  

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['has_upvoted'] = instance.has_upvoted if hasattr(instance, 'has_upvoted') else False
        return representation


class CommentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comments
        fields = '__all__'


class UpvoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Upvote
        fields = '__all__'
