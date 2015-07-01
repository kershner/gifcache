from .forms import AddGifForm, EditProfileForm, LoginForm, SignupForm
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.core.files.base import ContentFile
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.utils import timezone
from .models import Gif, Profile
from cStringIO import StringIO
from taggit.models import Tag
from PIL import Image
import requests
import json


# Create your views here.
def login_view(request):
    context = {'form': LoginForm()}
    return render(request, 'users/login.html', context)


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
            return redirect('/u/%s' % str(user.username))
        else:
            context = {
                'form': LoginForm(),
                'message': 'This account has been deactivated, please create a new one.'
            }
            return render(request, 'users/login.html', context)
    else:
        context = {
            'form': LoginForm(),
            'message': 'Invalid Login, please try again.'
        }
        return render(request, 'users/login.html', context)


def signup(request):
    print request.user.username
    if request.method == 'POST':
        form = SignupForm(request.POST)
        if form.is_valid():
            message = 'Account Created!'
            print message
    else:
        form = SignupForm()
    return render(request, 'users/signup.html', {'form': form})


def create_account(request):
    if request.method == 'POST':
        form = SignupForm(request.POST)
        if form.is_valid():
            username = request.POST['username']
            password = request.POST['password']
            email = request.POST['email']
            firstname = request.POST['first_name']
            u = User.objects.create_user(username=username, password=password, email=email, first_name=firstname)
            p = Profile(owner=u, avatar='http://www.default.biz')
            u.save()
            p.save()
            request.user.username = username
            context = {
                'name': firstname,
                'username': username
            }
            return render(request, 'users/account_created.html', context)
    else:
        form = SignupForm()
        return render(request, 'users/signup.html', {'form': form})


def view_profile(request, username):
    logged_in = False
    if request.user.is_authenticated():
        logged_in = True

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
        'gif_number': len(gifs),
        'tag_number': len(tags),
        'can_edit': can_edit,
        'logged_in': logged_in
    }
    return render(request, 'users/view.html', context)


def edit_profile(request, username):
    u = get_object_or_404(User, username=username)
    p = get_object_or_404(Profile, owner=u)

    form = EditProfileForm(initial={
        'username': u.username,
        'first_name': u.first_name,
        'avatar_url': p.avatar
    })
    context = {
        'form': form,
        'message': ''
    }
    if request.user.is_authenticated():
        if request.user.username == username:
            return render(request, 'users/edit-profile.html', context)
        else:
            return redirect('/u/%s' % request.user.username)
    else:
        context['message'] = 'You must be logged in to edit a profile!'
        context['form'] = LoginForm()
        return render(request, 'users/login.html', context)


def add_gif(request):
    if request.method == 'POST':
        form = AddGifForm(request.POST)
        if form.is_valid():
            hidden_id = request.POST['hidden_id']
            url = request.POST['url']
            if url.endswith('v'):
                url = url[:-1]
            label = request.POST['label']
            tags = request.POST['tags']

            size = (150, 100)
            img = requests.get(url)
            img_file = Image.open(StringIO(img.content)).convert('RGB').resize(size)
            img_file.thumbnail(size, Image.ANTIALIAS)
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
            return redirect('/u/%s' % str(u.username))
        return redirect('/u/%s' % request.user.username)


def edit_gif(request):
    if request.user.is_authenticated():
        username = request.user.username
        if request.method == 'POST':
            label = request.POST['label']
            tags_to_add = request.POST['tags_to_add']
            tags_to_remove = request.POST['tags_to_remove'].replace(' ', '').split(',')
            gif_id = request.POST['gif_id']

            u = get_object_or_404(User, username=username)
            g = get_object_or_404(Gif, pk=gif_id, owner=u)
            Gif.objects.filter(pk=gif_id, owner=u).update(label=label)
            active_tags = Tag.objects.filter(gif__owner=u, gif__pk=gif_id)

            if tags_to_add:
                tags = tags_to_add.split(',')
                for tag in tags:
                    g.tags.add(tag)

            if not str(tags_to_remove[0]) == '':
                for tag in active_tags:
                    for i in tags_to_remove:
                        if str(tag.name) == str(i):
                            print tag.name, 'tag is being removed'
                            g.tags.remove(tag)

            return redirect('/u/%s' % str(username))
        else:
            return redirect('/u/%s' % str(username))
    else:
        context = {'message': 'You must be logged in to edit GIFs!'}
        return render(request, 'users/login.html', context)


def delete_gif(request):
    if request.user.is_authenticated():
        username = request.user.username
        print username
        if request.method == 'POST':
            gif_id = request.POST['gif_id']
            u = get_object_or_404(User, username=username)
            g = Gif(pk=gif_id, owner=u)
            g.delete()
            return redirect('/u/%s' % str(username))
    else:
        context = {'message': 'You must be logged in to edit GIFs!'}
        return render(request, 'users/login.html', context)


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
            return redirect('/u/%s' % str(username))


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
            return redirect('/u/%s' % str(username))


def bulk_delete(request):
    if request.user.is_authenticated():
        if request.method == 'POST':
            username = request.user.username
            user_id = request.POST['user_id']
            bulk_ids = request.POST['bulk_values'].split(',')
            unique_ids = []
            for entry in bulk_ids:
                if entry in unique_ids:
                    pass
                else:
                    unique_ids.append(entry)
            u = get_object_or_404(User, pk=user_id)
            for gif in unique_ids:
                g = Gif(pk=int(gif), owner=u)
                g.delete()
            return redirect('/u/%s' % str(username))


def bulk_add_tags(request):
    if request.user.is_authenticated():
        if request.method == 'POST':
            username = request.user.username
            user_id = request.POST['user_id']
            tags = request.POST['tags'].replace(' ', '').split(',')
            bulk_ids = request.POST['bulk_values'].split(',')

            u = get_object_or_404(User, pk=user_id)

            unique_ids = []
            for entry in bulk_ids:
                if entry in unique_ids:
                    pass
                else:
                    unique_ids.append(entry)

            for gif in unique_ids:
                g = Gif(pk=int(gif), owner=u)
                for tag in tags:
                    if str(tag) == '':
                        pass
                    else:
                        g.tags.add(tag)
            return redirect('/u/%s' % str(username))


def bulk_remove_tags(request):
    if request.user.is_authenticated():
        if request.method == 'POST':
            username = request.user.username
            user_id = request.POST['user_id']
            tags = str(request.POST['tags']).replace(' ', '').split(',')
            bulk_ids = request.POST['bulk_values'].split(',')

            u = get_object_or_404(User, pk=user_id)

            unique_ids = []
            for entry in bulk_ids:
                if entry in unique_ids:
                    pass
                else:
                    unique_ids.append(entry)

            for gif in unique_ids:
                g = Gif(pk=int(gif), owner=u)
                active_tags = Tag.objects.filter(gif__owner=u, gif__pk=int(gif))
                for tag in active_tags:
                    for i in tags:
                        if str(tag.name) == str(i):
                            print tag.name, 'tag is being removed'
                            g.tags.remove(tag)
            return redirect('/u/%s' % str(username))


def ajax_test(request):
    if request.method == 'POST':
        message = request.POST['message']
        print message

        response_data = {
            'message': 'Data successfully sent to and returned from the server!'
        }

        return HttpResponse(
            json.dumps(response_data),
            content_type='application/json'
        )
    else:
        return HttpResponse(
            json.dumps({'message': 'Not a POST request!'}),
            content_type='application/json'
        )