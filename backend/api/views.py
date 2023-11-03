from .serializers import FeedbackSerializer, CommentsSerializer
from .models import Feedback, Comments, Upvote
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


class FeedbackCreateView(generics.CreateAPIView):
    serializer_class = FeedbackSerializer
    queryset = Feedback.objects.all()
    permission_classes = [IsAuthenticated, ]


class FeedbackListView(generics.ListAPIView):
    serializer_class = FeedbackSerializer
    queryset = Feedback.objects.all()
    permission_classes = [IsAuthenticated,]


class FeedbackUpvoteView(generics.GenericAPIView):
    serializer_class = FeedbackSerializer
    queryset = Feedback.objects.all()
    permission_classes = [IsAuthenticated,]

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        upvote_count = instance.upvotes_count  # Assuming `upvotes_count` is a property or method on your model
        return Response({'upvote_count': upvote_count})

    def put(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user
        upvote, created = Upvote.objects.get_or_create(user=user, feedback=instance)

        if not created:
            return Response({'detail': 'You have already upvoted this feedback.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class CommentsCreateView(generics.CreateAPIView):
    serializer_class = CommentsSerializer
    queryset = Feedback.objects.all()
    permission_classes = [IsAuthenticated, ]


class CommentsListView(generics.ListAPIView):
    serializer_class = CommentsSerializer
    queryset = Feedback.objects.all()
    permission_classes = [IsAuthenticated,]

    def get_queryset(self):
        feedback_id = self.kwargs['pk']
        return Comments.objects.filter(feedback__id=feedback_id)


class CommentsUpvoteView(generics.GenericAPIView):
    serializer_class = CommentsSerializer
    queryset = Comments.objects.all()  # Updated queryset to Comments
    permission_classes = [IsAuthenticated,]

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        upvote_count = instance.upvotes_count  # Assuming `upvotes_count` is a property or method on your model
        return Response({'upvote_count': upvote_count})

    def put(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user
        upvote, created = Upvote.objects.get_or_create(user=user, comment=instance)

        if not created:
            return Response({'detail': 'You have already upvoted this comment.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(instance)
        return Response(serializer.data)
