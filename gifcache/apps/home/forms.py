from django import forms


class SignupForm(forms.Form):
    username = forms.CharField(label='', widget=forms.TextInput(attrs={'placeholder': 'Username', 'class': 'main-field animate'}))
    password = forms.CharField(label='', widget=forms.PasswordInput(attrs={'placeholder': 'Password', 'class': 'main-field animate'}))
    email = forms.CharField(label='', widget=forms.EmailInput(attrs={'placeholder': 'Email', 'class': 'main-field animate'}))
    first_name = forms.CharField(label='', widget=forms.TextInput(attrs={'placeholder': 'Nickname', 'class': 'main-field animate'}))


class LoginForm(forms.Form):
    username = forms.CharField(label='', widget=forms.TextInput(attrs={'placeholder': 'Username', 'class': 'main-field animate'}))
    password = forms.CharField(label='', widget=forms.PasswordInput(attrs={'placeholder': 'Password', 'class': 'main-field animate'}))