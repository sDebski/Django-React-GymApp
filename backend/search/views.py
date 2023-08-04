from django.shortcuts import render
from django.conf import settings
from rest_framework import generics, views, permissions, status, viewsets
from rest_framework.response import Response
from . import client


class SearchHelloView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, *args, **kwargs):
        return Response({"msg": "Welcome to search engine!"}, status=status.HTTP_200_OK)


# Create your views here.
class SearchExerciseListView(views.APIView):
    index_prefix = settings.ALGOLIA.get("INDEX_PREFIX")
    permission_classes = (permissions.AllowAny,)
    index_name = f"{index_prefix}_Exercise"

    def get(self, request, *args, **kwargs):
        query = request.GET.get("q")
        if not query:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        results = client.perform_search(query=query, index_name=self.index_name)
        return Response(results, status=status.HTTP_200_OK)


class SearchUsersListView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)
    index_prefix = settings.ALGOLIA.get("INDEX_PREFIX")
    index_name = f"{index_prefix}_User"

    def get(self, request, *args, **kwargs):
        query = request.GET.get("q")
        return Response(
            {"msg": f"query: {query}", "index_name": self.index_name},
            status=status.HTTP_200_OK,
        )
        # if not query:
        #     return Response(status=status.HTTP_400_BAD_REQUEST)
        # results = client.perform_search(query=query)
        # return Response(results, status=status.HTTP_200_OK)
