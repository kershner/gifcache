from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^view/(?P<profile_id>[0-9]+)/$', views.view_profile, name='view_profile'),
    url(r'^signup/$', views.signup, name='signup'),
    url(r'^create_account/$', views.create_account, name='create_account'),
]