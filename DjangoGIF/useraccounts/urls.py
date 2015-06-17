from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^view/(?P<profile_id>[0-9]+)/$', views.view_profile, name='view-profile'),
    url(r'^add-gif/$', views.add_gif, name='add-gif'),
    url(r'^signup/$', views.signup, name='signup'),
    url(r'^create-account/$', views.create_account, name='create-account'),
]