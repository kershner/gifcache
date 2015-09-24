from .views import scrape_reddit, validate_cache, get_nav_gifs, which_element
from django.contrib.auth.models import User
from django.utils import timezone
from .models import Gif, Profile
from django.test import TestCase
import os


# Create your tests here.
class TestUserViews(TestCase):
    """
    Testing very basic profile views to see if they return HTTP 200
    """
    def setUp(self):
        # Create fake user, fake gif with fake tag
        self.user = User.objects.create_user(username='test',
                                             email='test@test.com',
                                             password='test_password')
        self.gif = Gif(owner=self.user,
                       url='test_gif.gif',
                       display_url='test_gif.gif',
                       created=timezone.now(),
                       thumbnail='test_thumbnail.jpg',
                       label='Test Gif!')
        self.gif.save()
        self.gif.tags.add('test')

    def test_profile_view(self):
        response = self.client.get('/u/kershner25')
        self.assertEqual(response.status_code, 200)

    def test_edit_profile_view_restricted(self):
        # Testing for redirect since not logged in
        response = self.client.get('/u/kershner25/edit-profile')
        self.assertEqual(response.status_code, 301)

    def test_share_tag_view(self):
        response = self.client.get('/u/%s/tags/%s' % (self.user.username, 'test'))
        self.assertEqual(response.status_code, 200)

    def test_share_gif_view(self):
        response = self.client.get('/u/%s/gifs/%d' % (self.user.username, self.gif.id))
        self.assertEqual(response.status_code, 200)


class TestSiteFunctionality(TestCase):
    """
    Testing basic site operations
    """
    def setUp(self):
        # Create fake user
        self.user = User.objects.create_user(username='testuser',
                                             email='test@test.com',
                                             password='test_password',
                                             first_name='Crazy Random String!')

    def test_edit_profle(self):
        # Testing that changes to profile model will appear on user profile page
        test_case = True
        response = self.client.get('/u/testuser')
        if 'Crazy Random String!' not in response.content:
            test_case = False
        elif 'http://www.test.com/test.gif' in response.content:
            test_case = False
        elif 'Tyler' in response.content:
            test_case = False
        profile = Profile.objects.get(owner=self.user)
        self.user.first_name = 'Tyler'
        profile.avatar = 'http://www.test.com/test.gif'
        self.user.save()
        profile.save()
        response = self.client.get('/u/testuser')
        if 'Crazy Random String!' in response.content:
            test_case = False
        elif 'http://www.test.com/test.gif' not in response.content:
            test_case = False
        elif 'Tyler' not in response.content:
            test_case = False
        self.assertEqual(test_case, True)

    def test_add_gif(self):
        # Testing to see if thumbnail appears in user profile after gif was added
        test_case = False
        url = 'http://www.test.com/test.gif'
        label = 'Here\'s a test label!'
        thumbnail = 'thumbnail.jpg'
        gif = Gif(owner=self.user, url=url, display_url=url, created=timezone.now(), label=label, thumbnail=thumbnail)
        gif.save()
        response = self.client.get('/u/%s' % self.user.username).content
        if thumbnail in response:
            test_case = True
        self.assertEqual(test_case, True)

    def test_delete_gif(self):
        # Testing to see if thumbnail disappears in user profile after gif is deleted
        test_case = False
        url = 'http://www.test.com/test.gif'
        label = 'Here\'s a test label!'
        thumbnail = 'thumbnail.jpg'
        gif = Gif(owner=self.user, url=url, display_url=url, created=timezone.now(), label=label, thumbnail=thumbnail)
        gif.save()
        response = self.client.get('/u/%s' % self.user.username).content
        if thumbnail in response:
            test_case = True
        gif_to_delete = Gif.objects.get(id=gif.id)
        gif_to_delete.delete()
        response = self.client.get('/u/%s' % self.user.username).content
        if thumbnail in response:
            test_case = False
        self.assertEqual(test_case, True)


class TestCustomFunctions(TestCase):
    """
    Testing custom functions used throughout GifCache.com
    """
    def setUp(self):
        # Create fake user, fake gif with fake tag
        self.user = User.objects.create_user(username='test',
                                             email='test@test.com',
                                             password='test_password')

    def test_reddit_scraper(self):
        results = scrape_reddit('gifs', 'hot')
        test_case = False
        if len(results) > 1:
            test_case = True
        self.assertEqual(test_case, True)

    def test_validate_success(self):
        # Checking if validate function successfully validates known gifs
        path = 'http://www.gifcache.com/static/img/homegif'
        for x in xrange(5):
            temp_gif = Gif(owner=self.user,
                           url='%s%d.gif' % (path, x),
                           display_url='%d.gif' % x,
                           created=timezone.now(),
                           thumbnail='test_thumbnail%d.jpg' % x,
                           label='Test Gif %d!' % x)
            temp_gif.save()
        results = validate_cache(self.user.username)
        test_case = False
        if not results['404s']:
            test_case = True
        self.assertEqual(test_case, True)

    def test_validate_fail(self):
        # Checking if validate function successfully catches 404'd gifs
        temp_gif = Gif(owner=self.user,
                       url='http://www.kershner.org/not-a-gif.gif',
                       display_url='not-a-gif.gif',
                       created=timezone.now(),
                       thumbnail='not-a-thumbnail.jpg',
                       label='Not a Gif!')
        temp_gif.save()
        results = validate_cache(self.user.username)
        test_case = False
        if results['404s']:
            test_case = True
        self.assertEqual(test_case, True)

    def test_validate_dupes(self):
        # Checking if validate function successfully catches duped gifs
        temp_gif_1 = Gif(owner=self.user,
                         url='http://www.gifcache.com/static/img/homegif0.gif',
                         display_url='testgif1.gif',
                         created=timezone.now(),
                         thumbnail='testgif1.jpg',
                         label='Test Gif 1!')
        temp_gif_2 = Gif(owner=self.user,
                         url='http://www.gifcache.com/static/img/homegif0.gif',
                         display_url='testgif2.gif',
                         created=timezone.now(),
                         thumbnail='testgif2.gif',
                         label='Test Gif 2!')
        temp_gif_1.save()
        temp_gif_2.save()
        results = validate_cache(self.user.username)
        test_case = False
        if results['dupes']:
            test_case = True
        self.assertEqual(test_case, True)

    def test_nav_gif(self):
        # Test to see if this function returns correct number of 'nav gifs'
        gif_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'static/img/')
        files = []
        for (dirpath, dirnames, filenames) in os.walk(gif_dir):
            files.extend(filenames)
            break
        test_number = len([f for f in files if f.startswith('navgif')])
        self.assertEqual(get_nav_gifs(), test_number)

    def test_which_element_success(self):
        # Tseting my 'which element' function
        test_url_1 = 'http://www.gif.com/gif.mp4'
        test_url_2 = 'http://www.gif.com/gif.gif'
        test_url_3 = 'http://www.gfycat.com/gfyname'
        test_url_4 = 'http://www.gif.com/gif.gifv'
        test_case = True
        if which_element(test_url_1) != 'video':
            test_case = False
        if which_element(test_url_2) != 'img':
            test_case = False
        if which_element(test_url_3) != 'gfycat':
            test_case = False
        if which_element(test_url_4) != 'gifv':
            test_case = False
        self.assertEqual(test_case, True)