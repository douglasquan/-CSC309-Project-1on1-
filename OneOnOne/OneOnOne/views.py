from django.http import HttpResponse
from django.shortcuts import render

def home(request):
    # Render a template for the home page, or just return a simple HttpResponse
    # return render(request, 'home.html')
    return HttpResponse('Welcome to the home page!')
