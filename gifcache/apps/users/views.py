from django.shortcuts import render, redirect, get_object_or_404
from django.core.files.base import ContentFile
from django.contrib.auth.models import User
from django.http import HttpResponse
from ..home.forms import LoginForm
from django.utils import timezone
from .models import Gif, Profile
from cStringIO import StringIO
from .forms import AddGifForm
from taggit.models import Tag
from PIL import Image
import requests
import praw
import uuid
import json


# Create your views here.
def view_profile(request, username):
    logged_in = False
    if request.user.is_authenticated():
        logged_in = True

    can_edit = False
    if request.user.username == username:
        can_edit = True

    message = request.session.get('message')
    if message is not None:
        message = request.session['message']
        request.session['message'] = None

    u = get_object_or_404(User, username=username)
    p = get_object_or_404(Profile, owner=u)
    gifs = Gif.objects.filter(owner=u)

    tags = list(set(Tag.objects.filter(gif__owner=u)))
    tagged_gifs = []
    for tag in tags:
        temp_gifs = gifs.filter(tags__name__in=[str(tag)])
        tagged_gifs.append([tag.name, temp_gifs])

    add_gif_form = AddGifForm(initial={
        'hidden_id': u.id
    })

    avatar = p.avatar
    if p.avatar.endswith('.gif'):
        print 'GIF Avatar'
        element = 'img'
    else:
        extension = p.avatar[p.avatar.rfind('.'):]
        element = 'video'
        avatar = avatar.replace(extension, '.mp4')
        print avatar
    context = {
        'username': request.user.username,
        'name': u.first_name,
        'add_form': add_gif_form,
        'gifs': gifs,
        'tagged_gifs': tagged_gifs,
        'tags': tags,
        'user_id': u.id,
        'gif_number': len(gifs),
        'tag_number': len(tags),
        'can_edit': can_edit,
        'logged_in': logged_in,
        'avatar': avatar,
        'element': element,
        'message': message
    }
    return render(request, 'users/view.html', context)


def edit_profile(request, username):
    logged_in = False
    if request.user.is_authenticated():
        logged_in = True

    u = get_object_or_404(User, username=username)
    p = get_object_or_404(Profile, owner=u)

    avatar = p.avatar
    if p.avatar.endswith('.gif'):
        print 'GIF Avatar'
        element = 'img'
    else:
        extension = p.avatar[p.avatar.rfind('.'):]
        element = 'video'
        avatar = avatar.replace(extension, '.mp4')
        print avatar

    context = {
        'title': 'Edit Profile',
        'username': u.username,
        'nickname': u.first_name,
        'avatar_url': avatar,
        'element': element,
        'logged_in': logged_in
    }
    if request.user.is_authenticated():
        if request.user.username == username:
            return render(request, 'users/edit-profile.html', context)
        else:
            return redirect('/u/%s' % request.user.username)
    else:
        context['message'] = 'You must be logged in to edit a profile!'
        context['form'] = LoginForm()
        return render(request, 'home/login.html', context)


def update_profile(request, username):
    if request.method == 'POST':
        if request.user.username == username:
            nickname = request.POST['nickname']
            avatar_url = request.POST['avatar_url']
            u = get_object_or_404(User, username=username)
            p = get_object_or_404(Profile, owner=u)
            if avatar_url == '/media/avatars/default-user-image.png':
                print 'Default Avatar'
                u.first_name = nickname
                u.save()
            elif avatar_url == '':
                print 'Setting avatar to default!'
                u.first_name = nickname
                p.avatar = '/media/avatars/default-user-image.png'
                u.save()
                p.save()
            else:
                print 'Updating avatar!'
                u.first_name = nickname
                p.avatar = avatar_url
                u.save()
                p.save()

            request.session['message'] = 'Your profile was successfully updated!'
            return redirect('/u/%s' % str(username))
        else:
            context = {
                'message': 'You are trying to edit another user\'s profile!'
            }
            return render(request, 'home/login.html', context)
    else:
        return redirect('/u/%s' % str(username))


def delete_profile(request, username):
    if request.user.username == username:
        u = get_object_or_404(User, username=username)
        p = get_object_or_404(Profile, owner=u)
        p.delete()
        u.delete()
        return redirect('/')
    else:
        context = {
            'title': 'Login',
            'message': 'You are trying to delete another user\'s profile!',
            'form': LoginForm()
        }
        return render(request, 'home/login.html', context)


def add_gif(request):
    if request.method == 'POST':
        form = AddGifForm(request.POST)
        if form.is_valid():
            error = False
            label = request.POST['label']
            tags = request.POST['tags']
            hidden_id = request.POST['hidden_id']
            url = request.POST['url']
            display_url = url

            # Logic to format URL for later processing in case it's abnormal (Gfycat, Gifv etc)
            if url.endswith('gif'):
                img_procesing_url = url
            elif url.endswith('v'):
                print 'Gifv URL'
                img_procesing_url = url[:-1]
                display_url = url.replace('.gifv', '.mp4')
            elif url.endswith('mp4'):
                print 'MP4 Url'
                img_procesing_url = url.replace('.mp4', '.gif')
            elif url.endswith('webm'):
                print 'Webm Url'
                img_procesing_url = url.replace('.webm', '.gif')
            elif 'gfycat' in url:
                    print 'Gfycat URL'
                    if '.mp4' in url:
                        print 'Gfycat MP4 file'
                        error = True
                        gfy_name = url.rsplit('/', 1)[1].replace('.mp4', '')
                        img_procesing_url = 'http://thumbs.gfycat.com/%s-thumb100.jpg' % gfy_name
                        display_url = 'http://giant.gfycat.com/%s.mp4' % gfy_name
                    elif '.webm' in url:
                        print 'Gfycat WebM file'
                        gfy_name = url.rsplit('/', 1)[1].replace('.webm', '')
                        img_procesing_url = 'http://thumbs.gfycat.com/%s-thumb100.jpg' % gfy_name
                        display_url = 'http://giant.gfycat.com/%s.mp4' % gfy_name
                    else:
                        print 'Normal Gfycat URL'
                        gfy_name = url.rsplit('/', 1)[1]
                        img_procesing_url = 'http://thumbs.gfycat.com/%s-thumb100.jpg' % gfy_name
                        display_url = 'http://giant.gfycat.com/%s.mp4' % gfy_name
            else:
                error = True
                request.session['message'] = 'You tried to add a non-GIF file!'
                return redirect('/u/%s' % str(request.user.username))

            if error:
                request.session['message'] = 'Error with image file, please try another!'
                return redirect('/u/%s' % str(request.user.username))
            else:
                print 'Original URL: ', url
                print 'URL for display: ', display_url
                print 'Formatted URL for img processing: ', img_procesing_url
                size = (150, 100)
                img = requests.get(img_procesing_url)
                img = StringIO(img.content)
                img_file = Image.open(img).convert('RGB').resize(size)
                img_file.thumbnail(size, Image.ANTIALIAS)
                img_file.thumbnail(size, Image.ANTIALIAS)
                img_temp = StringIO()
                img_file.save(img_temp, 'JPEG')

                u = get_object_or_404(User, id=hidden_id)
                g = Gif(owner=u, url=url, display_url=display_url, created=timezone.now(), label=label)
                extra_hash = str(uuid.uuid4())
                g.thumbnail.save(url + '-' + extra_hash + '.jpg', ContentFile(img_temp.getvalue()))
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
        context = {
            'message': 'You must be logged in to edit GIFs!'
        }
        return render(request, 'home/login.html', context)


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
        context = {
            'message': 'You must be logged in to edit GIFs!'
        }
        return render(request, 'home/login.html', context)


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
            if str(bulk_ids[0]) == '':
                print 'Trying to bulk delete 0 GIFs, redirecting...'
                return redirect('/u/%s' % str(username))
            else:
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
            tags = request.POST['tags'].split(',')
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


def gifgrabber(request):
    if request.method == 'POST':
        subreddit = request.POST['subreddit']
        max_size = request.POST['max_size']
        if max_size == 'None':
            max_size = 100
        gifs = scrape_reddit(subreddit, max_size)
        response_data = {
            'gifs': gifs
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


def scrape_reddit(sub, max_size):
    r = praw.Reddit(user_agent='GifCache Image Grabber by billcrystals')
    submissions = r.get_subreddit(sub).get_hot(limit=10)
    results = []
    for submission in submissions:
        response = requests.get(submission.url)
        try:
            size = '%.2f' % (float(response.headers['content-length']) / 1048576.0)
            if float(size) > float(max_size):
                continue
            else:
                results.append('%s - %s | %s MB' % (submission.url, submission.title, size))
        except KeyError:
            continue
    return results