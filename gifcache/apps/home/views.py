from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from .forms import LoginForm
import random
import os


# Returns number of saved GIFs in my static/img folder
def get_saved_gifs():
    gif_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'static/img/')
    files = []
    for (dirpath, dirnames, filenames) in os.walk(gif_dir):
        files.extend(filenames)
        break
    return len([f for f in files if f.endswith('gif')])


# Create your views here.
def error403(request):
    context = {'title': 'Error'}
    return render(request, 'home/403.html', context=context)


def error404(request):
    context = {'title': 'Error'}
    return render(request, 'home/404.html', context=context)


def error500(request):
    context = {'title': 'Error'}
    return render(request, 'home/500.html', context=context)


def index(request):
    logged_in = False
    if request.user.is_authenticated():
        logged_in = True

    random_gif = random.choice(xrange(get_saved_gifs()))
    context = {
        'title': 'Home',
        'logged_in': logged_in,
        'username': request.user.username,
        'random_gif': random_gif
        }
    return render(request, 'home/home.html', context)


def login_view(request):
    logged_in = False
    if request.user.is_authenticated():
        logged_in = True

    context = {
        'title': 'Login',
        'form': LoginForm(),
        'logged_in': logged_in,
        'username': request.user.username
        }
    return render(request, 'home/login.html', context)


def logout_view(request):
    logout(request)
    context = {
        'title': 'Home',
        'message': 'You have been succesfully logged out!',
        'random_gif': random.choice(xrange(get_saved_gifs()))
    }
    return render(request, 'home/home.html', context)


def authenticate_user(request):
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(username=username, password=password)
    if user is not None:
        if user.is_active:
            login(request, user)
            return redirect('/u/%s' % str(user.username))
        else:
            context = {
                'title': 'Login',
                'form': LoginForm(),
                'message': 'This account has been deactivated, please create a new one.'
            }
            return render(request, 'home/login.html', context)
    else:
        context = {
            'title': 'Login',
            'form': LoginForm(),
            'message': 'Invalid Login, please try again.'
        }
        return render(request, 'home/login.html', context)