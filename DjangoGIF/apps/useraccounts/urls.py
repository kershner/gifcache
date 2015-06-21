from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^view/(?P<username>[\w.@+-]+)/$', views.view_profile, name='view-profile'),
    url(r'^add-gif/$', views.add_gif, name='add-gif'),
    url(r'^delete-gif/$', views.delete_gif, name='delete-gif'),
    url(r'^edit-gif/$', views.edit_gif, name='edit-gif'),
    url(r'^manage-tags/$', views.manage_tags, name='manage-tags'),
    url(r'^ajax-test/$', views.ajax_test, name='ajax-test'),
    url(r'^signup/$', views.signup, name='signup'),
    url(r'^login/$', views.login_view, name='login'),
    url(r'^logout/$', views.logout_view, name='logout'),
    url(r'^authenticate-user/$', views.authenticate_user, name='authenticate'),
    url(r'^create-account/$', views.create_account, name='create-account'),
]