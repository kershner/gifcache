"""DjangoGIF URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""

from apps.home.views import check_username, check_cookie
from django.conf.urls.static import static
from django.conf.urls import include, url
from django.contrib import admin
from django.conf import settings

handler403 = 'apps.home.views.error403'
handler404 = 'apps.home.views.error404'
handler500 = 'apps.home.views.error500'
urlpatterns = [
    url(r'^', include('apps.home.urls', namespace='home')),
    url(r'^u/', include('apps.users.urls', namespace='users')),
    url(r'^cookie/', check_cookie, name='check-cookie'),
    url(r'^accounts/register/$', check_username, name='registration_register'),
    url(r'^accounts/', include('registration.backends.default.urls')),
    url(r'^admin/', include(admin.site.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)