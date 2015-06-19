from django.contrib.auth.models import User
from django import forms


class SignupForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'first_name']
        widgets = {
            'password': forms.PasswordInput()
        }


class LoginForm(forms.Form):
    username = forms.CharField(label='', widget=forms.TextInput(attrs={'placeholder': 'Username'}))
    password = forms.CharField(label='', widget=forms.PasswordInput(attrs={'placeholder': 'Password'}))


class AddGifForm(forms.Form):
    url = forms.URLField(label='', widget=forms.TextInput(attrs={'placeholder': 'URL'}))
    label = forms.CharField(label='', required=False, widget=forms.TextInput(attrs={'placeholder': 'Label'}))
    tags = forms.CharField(label='', required=False, widget=forms.TextInput(attrs={'placeholder': 'Tags'}))
    hidden_id = forms.CharField(label='', widget=forms.TextInput(attrs={'class': 'hidden'}))