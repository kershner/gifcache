from django.contrib.auth.models import User
from django.utils import timezone
from django.test import TestCase
from .models import Gif


# Create your tests here.
class TestUserViews(TestCase):
    """
    Testing very basic profile views to see if they return HTTP 200
    """
    def test_profile_view(self):
        response = self.client.get('/u/kershner25')
        self.assertEqual(response.status_code, 200)

    def test_edit_profile_view_restricted(self):
        # Testing for redirect since not logged in
        response = self.client.get('/u/kershner25/edit-profile')
        self.assertEqual(response.status_code, 301)

    # def test_edit_profile_view(self):
    #     # Create fake user, test that we can get to their edit-profile page
    #     user = User.objects.create_user('test', 'test@test.com', 'test_password')
    #     response = self.client.get('/u/%s/edit-profile' % user.username)
    #     print '#########################'
    #     print response.content
    #     self.assertEqual(response.status_code, 200)

    def test_share_tag_view(self):
        # Create fake user, fake gif with fake tag, test the tag view
        user = User.objects.create_user('test', 'test@test.com', 'test_password')
        gif = Gif(owner=user, url='test_gif.gif', display_url='test_gif.gif', created=timezone.now(),
                  thumbnail='test_thumbnail.jpg', label='Test Gif!')
        gif.save()
        gif.tags.add('test')
        response = self.client.get('/u/%s/tags/%s' % (user.username, 'test'))
        self.assertEqual(response.status_code, 200)

    def test_share_gif_view(self):
        # Create fake user, fake gif, test the gif view
        user = User.objects.create_user('test', 'test@test.com', 'test_password')
        gif = Gif(owner=user, url='test_gif.gif', display_url='test_gif.gif', created=timezone.now(),
                  thumbnail='test_thumbnail.jpg', label='Test Gif!')
        gif.save()
        response = self.client.get('/u/%s/gifs/%d' % (user.username, gif.id))
        self.assertEqual(response.status_code, 200)