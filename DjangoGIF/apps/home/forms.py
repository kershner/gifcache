from django import forms


class SignupForm(forms.Form):
    username = forms.CharField(label='', widget=forms.TextInput(attrs={'placeholder': 'Username'}))
    password = forms.CharField(label='', widget=forms.PasswordInput(attrs={'placeholder': 'Password'}))
    email = forms.CharField(label='', widget=forms.EmailInput(attrs={'placeholder': 'Email'}))
    nickname = forms.CharField(label='', widget=forms.TextInput(attrs={'placeholder': 'Nickname'}))


class LoginForm(forms.Form):
    username = forms.CharField(label='', widget=forms.TextInput(attrs={'placeholder': 'Username'}))
    password = forms.CharField(label='', widget=forms.PasswordInput(attrs={'placeholder': 'Password'}))