from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from .forms import SignupForm, AddGifForm, LoginForm
from django.core.files.base import ContentFile
from django.contrib.auth.models import User
from django.utils import timezone
from cStringIO import StringIO
from taggit.models import Tag
from .models import Gif
from PIL import Image
import requests


# Create your views here.
def view_profile(request, username):
    can_edit = False
    if request.user.username == username:
        can_edit = True

    u = get_object_or_404(User, username=username)
    gifs = Gif.objects.filter(owner=u)

    tags = list(set(Tag.objects.filter(gif__owner=u)))

    tagged_gifs = []
    for tag in tags:
        temp_gifs = gifs.filter(tags__name__in=[str(tag)])
        tagged_gifs.append([tag.name, temp_gifs])

    add_gif_form = AddGifForm(initial={
        'hidden_id': u.id
    })
    context = {
        'name': u.first_name,
        'add_form': add_gif_form,
        'gifs': gifs,
        'tagged_gifs': tagged_gifs,
        'tags': tags,
        'user_id': u.id,
        'can_edit': can_edit
    }
    return render(request, 'useraccounts/view.html', context)


def login_view(request):
    context = {'form': LoginForm()}
    return render(request, 'useraccounts/login.html', context)


def logout_view(request):
    logout(request)
    context = {'message': 'You have been succesfully logged out!'}
    return render(request, 'home/home.html', context)


def authenticate_user(request):
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(username=username, password=password)
    if user is not None:
        if user.is_active:
            login(request, user)
            return redirect('/account/view/%s' % str(user.username))
        else:
            context = {
                'form': LoginForm(),
                'message': 'This account has been deactivated, please create a new one.'
            }
            return render(request, 'useraccounts/login.html', context)
    else:
        context = {
            'form': LoginForm(),
            'message': 'Invalid Login, please try again.'
        }
        return render(request, 'useraccounts/login.html', context)


def signup(request):
    print request.user.username
    if request.method == 'POST':
        form = SignupForm(request.POST)
        if form.is_valid():
            message = 'Account Created!'
            print message
    else:
        form = SignupForm()
    return render(request, 'useraccounts/signup.html', {'form': form})


def create_account(request):
    if request.method == 'POST':
        form = SignupForm(request.POST)
        if form.is_valid():
            username = request.POST['username']
            password = request.POST['password']
            email = request.POST['email']
            firstname = request.POST['first_name']
            u = User.objects.create_user(username=username, password=password, email=email, first_name=firstname)
            u.save()
            request.user.username = username
            context = {
                'name': firstname,
                'username': username
            }
            return render(request, 'useraccounts/account_created.html', context)
    else:
        form = SignupForm()
        return render(request, 'useraccounts/signup.html', {'form': form})


def add_gif(request):
    if request.method == 'POST':
        form = AddGifForm(request.POST)
        if form.is_valid():
            hidden_id = request.POST['hidden_id']
            url = request.POST['url']
            label = request.POST['label']
            tags = request.POST['tags']

            img = requests.get(url)
            img_file = Image.open(StringIO(img.content)).convert('RGB')
            img_file.thumbnail((200, 200), Image.ANTIALIAS)
            img_temp = StringIO()
            img_file.save(img_temp, 'JPEG')

            u = get_object_or_404(User, id=hidden_id)
            g = Gif(owner=u, url=url, created=timezone.now(), label=label)
            g.thumbnail.save(url + '-thumb.jpg', ContentFile(img_temp.getvalue()))
            g.save()

            tags = tags.split(',')
            for tag in tags:
                if str(tag) == '':
                    pass
                else:
                    g.tags.add(tag)
            return redirect('/account/view/%s' % str(u.username))
    else:
        form = AddGifForm()
        return render(request, 'useraccounts/view/%s' % request.user.username, {'form': form})


def edit_gif(request):
    if request.user.is_authenticated():
        username = request.user.username
        if request.method == 'POST':
            label = request.POST['label']
            tags_to_add = request.POST['tags_to_add']
            tags_to_remove = request.POST['tags_to_remove'].strip().split(',')
            gif_id = request.POST['gif_id']

            u = get_object_or_404(User, username=username)
            g = get_object_or_404(Gif, pk=gif_id, owner=u)
            Gif.objects.filter(pk=gif_id, owner=u).update(label=label)
            active_tags = Tag.objects.filter(gif__owner=u, gif__pk=gif_id)

            if tags_to_add:
                tags = tags_to_add.split(',')
                for tag in tags:
                    g.tags.add(tag)

            if not tags_to_remove[0] == 'none':
                for tag in active_tags:
                    for i in tags_to_remove:
                        if str(tag.name) == str(i):
                            print tag.name, 'tag is being removed'
                            g.tags.remove(tag)

            return redirect('/account/view/%s' % str(username))
        else:
            return redirect('/account/view/%s' % str(username))
    else:
        context = {'message': 'You must be logged in to edit GIFs!'}
        return render(request, 'home/home.html', context)


def delete_gif(request):
    if request.user.is_authenticated():
        username = request.user.username
        if request.method == 'POST':
            gif_id = request.POST['gif_id']
            u = get_object_or_404(User, username=username)
            g = Gif(pk=gif_id, owner=u)
            g.delete()
            return redirect('/account/view/%s' % str(username))
    else:
        context = {'message': 'You must be logged in to edit GIFs!'}
        return render(request, 'home/home.html', context)


def rename_tag(request):
    if request.user.is_authenticated():
        if request.method == 'POST':
            username = request.user.username
            user_id = request.POST['user_id']
            current_name = request.POST['current_name']
            new_name = request.POST['new_name']
            u = get_object_or_404(User, pk=user_id)
            gifs = Gif.objects.filter(owner=u, tags__name__in=[current_name])
            for gif in gifs:
                gif.tags.remove(current_name)
                gif.tags.add(new_name)
            return redirect('/account/view/%s' % str(username))


def delete_tag(request):
    if request.user.is_authenticated():
        if request.method == 'POST':
            username = request.user.username
            user_id = request.POST['user_id']
            current_name = request.POST['current_name']
            u = get_object_or_404(User, pk=user_id)
            gifs = Gif.objects.filter(owner=u, tags__name__in=[current_name])
            for gif in gifs:
                gif.tags.remove(current_name)
            return redirect('/account/view/%s' % str(username))