from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from .forms import LoginForm
import random
import os


# Returns number of saved Home GIFs in my static/img folder
def get_home_gifs():
    gif_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'static/img/')
    files = []
    for (dirpath, dirnames, filenames) in os.walk(gif_dir):
        files.extend(filenames)
        break
    return len([f for f in files if f.startswith('homegif')])


# Returns number of saved Nav GIFs in my static/img folder
def get_nav_gifs():
    gif_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'static/img/')
    files = []
    for (dirpath, dirnames, filenames) in os.walk(gif_dir):
        files.extend(filenames)
        break
    return len([f for f in files if f.startswith('navgif')])


# Create your views here.vicon
def error403(request):
    home_gif = random.choice(xrange(get_home_gifs()))
    context = {
        'title': 'Error',
        'home_gif': home_gif
    }
    return render(request, 'home/403.html', context=context)


def error404(request):
    home_gif = random.choice(xrange(get_home_gifs()))
    context = {
        'title': 'Error',
        'home_gif': home_gif
    }
    return render(request, 'home/404.html', context=context)


def error500(request):
    home_gif = random.choice(xrange(get_home_gifs()))
    context = {
        'title': 'Error',
        'home_gif': home_gif
    }
    return render(request, 'home/500.html', context=context)


def index(request):
    logged_in = False
    if request.user.is_authenticated():
        logged_in = True

    home_gif = random.choice(xrange(get_home_gifs()))
    context = {
        'title': 'Home',
        'logged_in': logged_in,
        'username': request.user.username,
        'home_gif': home_gif
        }
    return render(request, 'home/home.html', context)


def login_view(request):
    logged_in = False
    if request.user.is_authenticated():
        logged_in = True
    navgif = random.choice(xrange(get_nav_gifs()))

    context = {
        'title': 'Login',
        'form': LoginForm(),
        'logged_in': logged_in,
        'username': request.user.username,
        'navgif': navgif
        }
    return render(request, 'home/login.html', context)


def logout_view(request):
    logout(request)
    context = {
        'title': 'Home',
        'message': 'You have been succesfully logged out!',
        'home_gif': random.choice(xrange(get_home_gifs()))
    }
    return render(request, 'home/home.html', context)


def authenticate_user(request):
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(username=username, password=password)
    navgif = random.choice(xrange(get_nav_gifs()))
    if user is not None:
        if user.is_active:
            login(request, user)
            return redirect('/u/%s' % str(user.username))
        else:
            context = {
                'title': 'Login',
                'form': LoginForm(),
                'message': 'This account has been deactivated, please create a new one.',
                'navgif': navgif
            }
            return render(request, 'home/login.html', context)
    else:
        context = {
            'title': 'Login',
            'form': LoginForm(),
            'message': 'Invalid Login, please try again.',
            'navgif': navgif
        }
        return render(request, 'home/login.html', context)