from django.test import TestCase


# Create your tests here.
class TestHomeViews(TestCase):
    """
    Testing very basic views to see if they return HTTP 200
    """
    def test_index_view(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)

    def test_login_view(self):
        response = self.client.get('/login')
        self.assertEqual(response.status_code, 200)

    def test_logout_view(self):
        response = self.client.get('/logout')
        self.assertEqual(response.status_code, 200)