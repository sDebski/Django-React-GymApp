from django.http import JsonResponse


def error_404(request, exception):
    messsage = "Sorry! The endpoint was not found!"

    response = JsonResponse(data={"message": messsage, "status_code": 404})

    response.status_code = 404
    return response


def error_500(request):
    messsage = "Sorry! An error occured, we will handle it!"

    response = JsonResponse(data={"message": messsage, "status_code": 500})
    response.status_code = 500
    return response
