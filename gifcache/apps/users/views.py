from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.core.files.base import ContentFile
from django.contrib.auth.models import User
from ..home.views import check_cookie
from django.http import HttpResponse
from ..home.forms import LoginForm
from django.utils import timezone
from .models import Gif, Profile
from operator import itemgetter
from cStringIO import StringIO
from .forms import AddGifForm
from taggit.models import Tag
from PIL import Image
import requests
import logging
import random
import praw
import uuid
import json
import os


# Log everything, and send it to stderr.
logging.basicConfig(level=logging.DEBUG)


# Returns HTML element type to use for displaying given url
def which_element(url):
    if url.endswith(('mp4', 'webm')):
        return 'video'
    elif url.endswith('gifv'):
        return 'gifv'
    elif 'gfycat' in url:
        return 'gfycat'
    else:
        return 'img'


# Returns number of saved nav gifs in static/img folder
def get_nav_gifs():
    gif_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'static/img/')
    files = []
    for (dirpath, dirnames, filenames) in os.walk(gif_dir):
        files.extend(filenames)
        break
    return len([f for f in files if f.startswith('navgif')])


# Main profile view
def view_profile(request, username):
    can_edit = False
    if request.user.username == username:
        can_edit = True

    message = request.session.get('message')
    if message is not None:
        message = request.session['message']
        request.session['message'] = None

    user = get_object_or_404(User, username=username)
    profile = get_object_or_404(Profile, owner=user)
    gifs = Gif.objects.filter(owner=user)

    tags = list(set(Tag.objects.filter(gif__owner=user)))
    tagged_gifs = []
    for tag in tags:
        temp_gifs = gifs.filter(tags__name__in=[str(tag)])
        tagged_gifs.append([tag.name, temp_gifs, len(temp_gifs)])

    add_gif_form = AddGifForm(initial={'hidden_id': user.id})

    avatar = profile.avatar
    element = which_element(profile.avatar)

    navgif = random.choice(xrange(get_nav_gifs()))

    context = {
        'username': username,
        'name': user.first_name,
        'add_form': add_gif_form,
        'gifs': gifs,
        'tagged_gifs': tagged_gifs,
        'tags': tags,
        'user_id': user.id,
        'gif_number': len(gifs),
        'tag_number': len(tags),
        'can_edit': can_edit,
        'avatar': avatar,
        'element': element,
        'message': message,
        'navgif': navgif,
        'title': username
    }
    return render(request, 'users/view.html', context)


# Per-user viewer for tag name
def view_tag(request, username, tag):
    user = get_object_or_404(User, username=username)
    profile = get_object_or_404(Profile, owner=user)
    gifs = Gif.objects.filter(owner=user, tags__name__in=[tag])
    total_gifs = len(Gif.objects.filter(owner=user))
    element = which_element(profile.avatar)
    context = {
        'navgif': random.choice(xrange(get_nav_gifs())),
        'username': username,
        'title': '%s - View Tag - %s' % (user.first_name, tag),
        'name': user.first_name,
        'avatar': profile.avatar,
        'element': element,
        'tag': tag,
        'tag_number': len(list(set(Tag.objects.filter(gif__owner=user)))),
        'gifs': gifs,
        'gif_number': total_gifs,
        'url': 'gifcache.com/u/%s/tags/%s' % (username, tag)
    }
    return render(request, 'users/view_tag.html', context)


# Per-user viewer for gif ID
def view_gif(request, username, gif_id):
    user = get_object_or_404(User, username=username)
    gif = Gif.objects.filter(id=gif_id)[0]
    profile = get_object_or_404(Profile, owner=user)
    total_gifs = len(Gif.objects.filter(owner=user))
    avatar_element = which_element(profile.avatar)
    context = {
        'navgif': random.choice(xrange(get_nav_gifs())),
        'username': username,
        'title': '%s - View Gif' % user.first_name,
        'name': user.first_name,
        'avatar': profile.avatar,
        'avatar_element': avatar_element,
        'gif': gif,
        'gif_element': which_element(gif.display_url),
        'tag_number': len(list(set(Tag.objects.filter(gif__owner=user)))),
        'gif_number': total_gifs,
        'url': 'gifcache.com/u/%s/gifs/%d' % (username, gif.id)
    }
    return render(request, 'users/view_gif.html', context)


def edit_profile(request, username):
    check_cookie(request)
    logged_in = False
    if request.user.is_authenticated():
        logged_in = True

    user = get_object_or_404(User, username=username)
    profile = get_object_or_404(Profile, owner=user)

    avatar = profile.avatar
    element = which_element(profile.avatar)

    navgif = random.choice(xrange(get_nav_gifs()))

    context = {
        'title': 'Edit Profile',
        'username': user.username,
        'nickname': user.first_name,
        'avatar_url': avatar,
        'element': element,
        'logged_in': logged_in,
        'navgif': navgif
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
            # Checking for valid avatar URLs
            if avatar_url.endswith(('gif', 'mp4', 'webm')):
                avatar_url = avatar_url
            elif avatar_url.endswith('gifv'):
                avatar_url = avatar_url.replace('gifv', 'mp4')
            elif 'gfycat' in avatar_url:
                gfy_name = avatar_url.rsplit('/', 1)[1]
                avatar_url = requests.get('http://gfycat.com/cajax/get/%s' % gfy_name).json()['gfyItem']['mp4Url']
            else:
                avatar_url = ''

            user = get_object_or_404(User, username=username)
            profile = get_object_or_404(Profile, owner=user)
            user.first_name = nickname
            profile.avatar = avatar_url
            user.save()
            profile.save()

            request.session['message'] = 'Your profile was successfully updated!'
            return redirect('/u/%s' % str(username))
        else:
            context = {'message': 'You are trying to edit another user\'s profile!'}
            return render(request, 'home/login.html', context)
    else:
        return redirect('/u/%s' % str(username))


def delete_profile(request, username):
    if request.user.username == username:
        user = get_object_or_404(User, username=username)
        profile = get_object_or_404(Profile, owner=user)
        profile.delete()
        user.delete()
        return redirect('/')
    else:
        context = {
            'title': 'Login',
            'message': 'You are trying to delete another user\'s profile!',
            'form': LoginForm()
        }
        return render(request, 'home/login.html', context)


# Grabs variables from POST, sends to add_gif()
def add_gif_route(request):
    if request.method == 'POST':
        form = AddGifForm(request.POST)
        if form.is_valid():
            label = request.POST['label']
            tags = request.POST['tags'].strip().split(',')
            hidden_id = request.POST['hidden_id']
            url = request.POST['url']
            add_gif(hidden_id, url, label, tags)
        return redirect('/u/%s' % request.user.username)


def edit_gif(request):
    if request.user.is_authenticated():
        username = request.user.username
        if request.method == 'POST':
            label = request.POST['label']
            tags_to_add = request.POST['tags_to_add']
            tags_to_remove = request.POST['tags_to_remove'].split(',')
            gif_id = request.POST['gif_id']

            user = get_object_or_404(User, username=username)
            gif = get_object_or_404(Gif, pk=gif_id, owner=user)
            Gif.objects.filter(pk=gif_id, owner=user).update(label=label)
            active_tags = Tag.objects.filter(gif__owner=user, gif__pk=gif_id)

            if tags_to_add:
                tags = tags_to_add.split(',')
                for tag in tags:
                    gif.tags.add(tag)

            if not str(tags_to_remove[0]) == '':
                for tag in active_tags:
                    for i in tags_to_remove:
                        if str(tag.name) == str(i):
                            gif.tags.remove(tag)

            return redirect('/u/%s' % str(username))
        else:
            return redirect('/u/%s' % str(username))
    else:
        navgif = random.choice(xrange(get_nav_gifs()))
        context = {
            'message': 'You must be logged in to edit GIFs!',
            'navgif': navgif
        }
        return render(request, 'home/login.html', context)


def delete_gif(request):
    if request.user.is_authenticated():
        username = request.user.username
        if request.method == 'POST':
            gif_id = request.POST['gif_id']
            user = get_object_or_404(User, username=username)
            gif = Gif(pk=gif_id, owner=user)
            gif.delete()
            return redirect('/u/%s' % str(username))
    else:
        navgif = random.choice(xrange(get_nav_gifs()))
        context = {
            'message': 'You must be logged in to edit GIFs!',
            'navgif': navgif
        }
        return render(request, 'home/login.html', context)


def rename_tag(request):
    if request.user.is_authenticated():
        if request.method == 'POST':
            username = request.user.username
            user_id = request.POST['user_id']
            current_name = request.POST['current_name']
            new_name = request.POST['new_name']
            user = get_object_or_404(User, pk=user_id)
            gifs = Gif.objects.filter(owner=user, tags__name__in=[current_name])
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
            user = get_object_or_404(User, pk=user_id)
            gifs = Gif.objects.filter(owner=user, tags__name__in=[current_name])
            for gif in gifs:
                gif.tags.remove(current_name)
            return redirect('/u/%s' % str(username))


def add_gif(user_id, url, label, tags):
    display_url = url
    # Logic to format URL for later processing in case it's abnormal (Gfycat, Gifv etc)
    if url.endswith('gif'):
        # Normal GIF Url
        img_procesing_url = url
    elif url.endswith('v'):
        # GifV url
        img_procesing_url = url[:-1]
        display_url = url.replace('.gifv', '.mp4')
    elif url.endswith('mp4'):
        # MP4 Url
        img_procesing_url = url.replace('.mp4', '.gif')
    elif url.endswith('webm'):
        # Webm Url
        img_procesing_url = url.replace('.webm', '.gif')
    elif 'gfycat' in url:
            # Gfycat Url
            gfy_name = url.rsplit('/', 1)[1].replace('.mp4', '')
            img_procesing_url = 'http://thumbs.gfycat.com/%s-thumb100.jpg' % gfy_name
            display_url = requests.get('http://gfycat.com/cajax/get/%s' % gfy_name).json()['gfyItem']['mp4Url']
    else:
        # Not a GIF url
        # Raise an exception here, will be redirected in add_gif_route
        return

    # Creating thumbnail
    size = (150, 100)
    img = requests.get(img_procesing_url)
    img = StringIO(img.content)
    img_file = Image.open(img).convert('RGB').resize(size)
    img_file.thumbnail(size, Image.ANTIALIAS)
    img_temp = StringIO()
    img_file.save(img_temp, 'JPEG')

    user = get_object_or_404(User, id=user_id)
    gif = Gif(owner=user, url=url, display_url=display_url, created=timezone.now(), label=label)
    extra_hash = str(uuid.uuid4())
    gif.thumbnail.save(url + '-' + extra_hash + '.jpg', ContentFile(img_temp.getvalue()))
    gif.save()

    for tag in tags:
        if str(tag) == '':
            pass
        else:
            gif.tags.add(tag)


@csrf_exempt
def bulk_add_gifs(request):
    if request.user.is_authenticated():
        if request.method == 'POST':
            username = request.user.username
            user_id = int(request.POST['user_id'])
            values = unicode(request.POST['values'])
            values = values.split('|')
            results = []
            for value in values:
                value = value.replace("'", "")
                dash1 = value.find('*')
                dash2 = value.rfind('*')
                url = value[:dash1]
                label = value[dash1 + 1:dash2]
                tags = value[dash2 + 1:].split(',')
                tags_final = []
                for tag in tags:
                    tags_final.append(tag.strip())
                results.append([url, label, tags_final])

            for result in results:
                add_gif(user_id, result[0], result[1], result[2])
            return redirect('/u/%s' % str(username))


def bulk_delete(request):
    if request.user.is_authenticated():
        if request.method == 'POST':
            username = request.user.username
            user_id = request.POST['user_id']
            bulk_ids = request.POST['bulk_values'].split(',')
            if str(bulk_ids[0]) == '':
                logging.debug('Trying to bulk delete 0 GIFs, redirecting...')
                return redirect('/u/%s' % str(username))
            else:
                unique_ids = []
                for entry in bulk_ids:
                    if entry in unique_ids:
                        pass
                    else:
                        unique_ids.append(entry)
                user = get_object_or_404(User, pk=user_id)
                for gif in unique_ids:
                    if str(gif) == '':
                        continue
                    else:
                        gif = Gif(pk=int(gif), owner=user)
                        gif.delete()
                return redirect('/u/%s' % str(username))


def bulk_add_tags(request):
    if request.user.is_authenticated():
        if request.method == 'POST':
            username = request.user.username
            user_id = request.POST['user_id']
            tags = request.POST['tags'].split(',')
            bulk_ids = request.POST['bulk_values'].split(',')

            user = get_object_or_404(User, pk=user_id)

            unique_ids = []
            for entry in bulk_ids:
                if entry in unique_ids:
                    pass
                else:
                    unique_ids.append(entry)

            for gif in unique_ids:
                gif = Gif(pk=int(gif), owner=user)
                for tag in tags:
                    if str(tag) == '':
                        pass
                    else:
                        gif.tags.add(tag)
            return redirect('/u/%s' % str(username))


def bulk_remove_tags(request):
    if request.user.is_authenticated():
        if request.method == 'POST':
            username = request.user.username
            user_id = request.POST['user_id']
            tags = str(request.POST['tags']).split(',')
            bulk_ids = request.POST['bulk_values'].split(',')

            user = get_object_or_404(User, pk=user_id)

            unique_ids = []
            for entry in bulk_ids:
                if entry in unique_ids:
                    pass
                else:
                    unique_ids.append(entry)

            for entry in unique_ids:
                gif = Gif(pk=int(entry), owner=user)
                active_tags = Tag.objects.filter(gif__owner=user, gif__pk=int(entry))
                for tag in active_tags:
                    for i in tags:
                        if str(tag.name) == str(i):
                            gif.tags.remove(tag)
            return redirect('/u/%s' % str(username))


def gifgrabber(request):
    logging.debug('Hit /gifgrabber route!')
    if request.method == 'POST':
        subreddit = request.POST['subreddit']
        sort = request.POST['sort']
        try:
            data = scrape_reddit(subreddit, sort)
            response_data = {
                'gifs': data,
                'number_gifs': len(data),
                'subreddit': subreddit,
                'sort': sort
            }
            return HttpResponse(
                json.dumps(response_data),
                content_type='application/json'
            )
        except praw.errors.InvalidSubreddit:
            logging.debug('No subreddit!')
    else:
        return HttpResponse(
            json.dumps({'message': 'Not a POST request!'}),
            content_type='application/json'
        )


def validate(request):
    logging.debug('Hit /validate route!')
    if request.method == 'POST':
        username = request.POST['username']
        results = validate_cache(username)
        response_data = {
            '404s': results['404s'],
            'dupes': results['dupes']
        }
        return HttpResponse(
            json.dumps(response_data),
            content_type='application/json'
        )
    else:
        return HttpResponse(
            json.dumps({'confirm': 'Not a POST request!'}),
            content_type='application/json'
        )


def validate_cache(username):
    user = get_object_or_404(User, username=username)
    gifs = Gif.objects.filter(owner=user)
    connect_timeout = 5
    read_timeout = 1.0
    unique_urls = []
    dupe_urls = []

    dupes = []
    not_found = []
    # Getting list of duplicate URLs
    for gif in gifs:
        if gif.url in unique_urls:
            dupe_urls.append(gif.url)
        else:
            unique_urls.append(gif.url)
    # Checking each GIF object against list of dupe URLs
    for gif in gifs:
        tags = [str(tag) for tag in gif.tags.names()]
        if gif.url in dupe_urls:
            dupes.append([gif.id, gif.url, gif.label, tags, gif.thumbnail.url])
        else:
            try:
                # Some gfycat urls stored without http schema, adding it here for requests
                url = gif.url
                if 'http://' not in url:
                    if 'https://' not in url:
                        url = 'http://' + url
                r = requests.get(url=url, timeout=(connect_timeout, read_timeout))
                if r.status_code in [404, 500]:
                    not_found.append([gif.id, gif.url, gif.label, tags, gif.thumbnail.url])
                # Checking for imgur 'removed' image
                try:
                    if r.headers['Content-Length'] == '503':
                        not_found.append([gif.id, gif.url, gif.label, tags, gif.thumbnail.url])
                except KeyError:
                    continue
            except requests.exceptions.ConnectTimeout as e:
                logging.exception('Connection timed out')
            except requests.exceptions.ReadTimeout as e:
                logging.exception('Too long between bytes')

    results = {
        'dupes': sorted(dupes, key=itemgetter(1)),
        '404s': not_found
    }
    return results


def scrape_reddit(sub, sort):
    allowed = ['.gif', '.gifv', '.webm', '.mp4']
    r = praw.Reddit(user_agent='GifCache Image Grabber by billcrystals')
    if sort == 'hot':
        submissions = r.get_subreddit(sub).get_hot(limit=25)
    elif sort == 'new':
        submissions = r.get_subreddit(sub).get_new(limit=25)
    elif sort == 'week':
        submissions = r.get_subreddit(sub).get_top_from_week(limit=25)
    elif sort == 'month':
        submissions = r.get_subreddit(sub).get_top_from_month(limit=25)
    elif sort == 'year':
        submissions = r.get_subreddit(sub).get_top_from_year(limit=25)
    else:
        submissions = r.get_subreddit(sub).get_top_from_all(limit=25)
    results = []
    for submission in submissions:
        url = submission.url
        extension = url[url.rfind('.'):]
        if extension in allowed:
            results.append([submission.url, extension, submission.title, submission.short_link])
        elif 'gfycat' in submission.url:
            results.append([submission.url, extension, submission.title, submission.short_link])
        else:
            continue
    return results