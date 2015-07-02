from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name='home'),
    url(r'^signup$', views.signup, name='signup'),
    url(r'^login$', views.login_view, name='login'),
    url(r'^logout$', views.logout_view, name='logout'),
    url(r'^authenticate-user$', views.authenticate_user, name='authenticate'),
    url(r'^create-account$', views.create_account, name='create-account'),
]