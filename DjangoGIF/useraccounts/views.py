from django.shortcuts import render
from .forms import SignupForm
from .models import Profile


# Create your views here.
def view_profile(request, profile_id):
    p = Profile.objects.get(id=profile_id)
    context = {
        'name': p.name
    }
    return render(request, 'useraccounts/view.html',
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
            print 'An account has been created for %s!' % name
    else:
        form = SignupForm()
    return render(request,
                  'useraccounts/signup.html',
                  {'form': form})