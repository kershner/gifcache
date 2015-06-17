from django.shortcuts import render, redirect
from .forms import SignupForm, AddGifForm
from .models import Profile, Gif


# Create your views here.
def view_profile(request, profile_id):
    p = Profile.objects.get(id=profile_id)
    form = AddGifForm()
    context = {
        'name': p.name,
        'form': form
    }
    return render(request,
                  'useraccounts/view.html',
                  context)


def signup(request):
    if request.method == 'POST':
        form = SignupForm(request.POST)
        if form.is_valid():
            message = 'Account Created!'
            print message
    else:
        form = SignupForm()
    return render(request,
                  'useraccounts/signup.html',
                  {'form': form})


def create_account(request):
    if request.method == 'POST':
        form = SignupForm(request.POST)
        if form.is_valid():
            name = request.POST['name']
            p = Profile(name=name)
            p.save()
            return redirect('/account/view/%d' % p.id)
    else:
        form = SignupForm()
    return render(request,
                  'useraccounts/signup.html',
                  {'form': form})


def add_gif(request):
    if request.method == 'POST':
        form = AddGifForm(request.POST)
        if form.is_valid():
            url = request.POST['url']
            notes = request.POST['notes']
            print url
            print notes
    else:
        form = AddGifForm()
    return render(request,
                  'useraccounts/view.html',
                  {'form': form})
