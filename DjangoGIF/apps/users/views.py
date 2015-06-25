from django.shortcuts import render, redirect, get_object_or_404
from django.core.files.base import ContentFile
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.utils import timezone
from cStringIO import StringIO
from .forms import AddGifForm
from taggit.models import Tag
from .models import Gif
from PIL import Image
import requests
import json


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
    return render(request, 'users/view.html', context)


def add_gif(request):
    if request.method == 'POST':
        form = AddGifForm(request.POST)
        if form.is_valid():
            hidden_id = request.POST['hidden_id']
            url = request.POST['url']
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
        return render(request, 'home/home.html', context)


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