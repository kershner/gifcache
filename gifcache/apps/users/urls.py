from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^(?P<username>[\w.@+-]+)$', views.view_profile, name='view-profile'),
    url(r'^add-gif/$', views.add_gif_route, name='add-gif'),
    url(r'^delete-gif/$', views.delete_gif, name='delete-gif'),
    url(r'^edit-gif/$', views.edit_gif, name='edit-gif'),
    url(r'^delete-tag/$', views.delete_tag, name='delete-tag'),
    url(r'^rename-tag/$', views.rename_tag, name='rename-tag'),
    url(r'^bulk-add-gifs/$', views.bulk_add_gifs, name='bulk-add-gifs'),
    url(r'^bulk-delete/$', views.bulk_delete, name='bulk-delete'),
    url(r'^bulk-add-tags/$', views.bulk_add_tags, name='bulk-add-tags'),
    url(r'^bulk-remove-tags/$', views.bulk_remove_tags, name='bulk-remove-tags'),
    url(r'^(?P<username>[\w.@+-]+)/edit-profile/$', views.edit_profile, name='edit-profile'),
    url(r'^(?P<username>[\w.@+-]+)/update-profile/$', views.update_profile, name='update-profile'),
    url(r'^(?P<username>[\w.@+-]+)/delete-profile/$', views.delete_profile, name='delete-profile'),
    url(r'^gifgrabber/$', views.gifgrabber, name='gifgrabber'),
]