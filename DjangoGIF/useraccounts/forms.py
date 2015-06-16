from django import forms


class SignupForm(forms.Form):
    name = forms.CharField(label='', widget=forms.TextInput(attrs={'placeholder': 'Name'}), max_length='100')