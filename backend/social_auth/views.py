from django.shortcuts import render
from rest_framework import generics, status, response
from .serializers import (
    GoogleSocialAuthSerializer,
    FacebookSocialAuthSerializer,
)


class GoogleSocialAuthView(generics.GenericAPIView):
    serializer_class = GoogleSocialAuthSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = (serializer.validated_data)["auth_token"]
        return response.Response(data, status=status.HTTP_200_OK)


class FacebookSocialAuthView(generics.GenericAPIView):
    serializer_class = FacebookSocialAuthSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = (serializer.validated_data)["auth_token"]
        return response.Response(data, status=status.HTTP_200_OK)
