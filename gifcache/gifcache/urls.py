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

from registration.backends.default.views import RegistrationView
from django.contrib.auth.models import User
from django.conf.urls.static import static
from django.conf.urls import include, url
from apps.home.forms import SignupForm
from django.shortcuts import render
from django.contrib import admin
from django.conf import settings


def check_username(request):
    if request.method == 'POST':
        username = request.POST['username']
        if User.objects.filter(username=username).exists():
            print 'Username exists!'
            form = SignupForm(request.POST)
            error = 'The username %s is already taken, please try another!' % username
            context = {
                'form': form,
                'error': error
            }
            return render(request, 'registration/registration_form.html', context)
        else:
            print 'Unique Username!'
            form = SignupForm(request.POST)
            if form.is_valid():
                new_registration = RegistrationView()
                new_registration.register(request, form)
                return render(request, 'registration/registration_complete.html')
    else:
        context = {
            'form': SignupForm()
        }
        return render(request, 'registration/registration_form.html', context)

handler403 = 'apps.home.views.error403'
handler404 = 'apps.home.views.error404'
handler500 = 'apps.home.views.error500'
urlpatterns = [
    url(r'^', include('apps.home.urls', namespace='home')),
    url(r'^u/', include('apps.users.urls', namespace='users')),
    url(r'^accounts/register/$', check_username, name='registration_register'),
    url(r'^accounts/', include('registration.backends.default.urls')),
    url(r'^admin/', include(admin.site.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)