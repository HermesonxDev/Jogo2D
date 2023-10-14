from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as login_django, logout
from django.contrib.auth.decorators import login_required
import datetime
from .models import *
# Create your views here.

def index(request):
    data = {}
    return render(request, 'Game/index.html', data)