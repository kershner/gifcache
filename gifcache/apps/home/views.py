from registration.backends.default.views import RegistrationView
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from .forms import LoginForm, SignupForm
from django.http import HttpResponse
import random
import json
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
    response = render(request, 'home/home.html', context)
    response.delete_cookie('logged_in')
    return response


def authenticate_user(request):
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(username=username, password=password)
    navgif = random.choice(xrange(get_nav_gifs()))
    if user is not None:
        if user.is_active:
            u = get_object_or_404(User, username=username)
            login(request, user)
            response = redirect('/u/%s' % str(user.username))
            response.set_cookie('logged_in', True)
            response.set_cookie('user_id', u.id)
            return response
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


def check_username(request):
    if request.method == 'POST':
        username = request.POST['username']
        if User.objects.filter(username=username).exists():
            print 'Username exists!'
            form = SignupForm(request.POST)
            error = 'The username %s is already taken, please try another!' % username
            context = {
                'form': form,
                'error': error
            }
            return render(request, 'registration/registration_form.html', context)
        else:
            print 'Unique Username!'
            form = SignupForm(request.POST)
            if form.is_valid():
                new_registration = RegistrationView()
                new_registration.register(request, form)
                return render(request, 'registration/registration_complete.html')
    else:
        context = {
            'form': SignupForm()
        }
        return render(request, 'registration/registration_form.html', context)


def check_cookie(request):
    if 'logged_in' in request.COOKIES:
        response_data = {
            'message': 'User is logged in!'
        }
        return HttpResponse(
            json.dumps(response_data),
            content_type='application/json'
        )
    else:
        response_data = {
            'message': 'User is not logged in!'
        }
        return HttpResponse(
            json.dumps(response_data),
            content_type='application/json'
        )