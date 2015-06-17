from django import forms


class SignupForm(forms.Form):
    name = forms.CharField(label='', widget=forms.TextInput(attrs={'placeholder': 'Name'}), max_length='100')


class AddGifForm(forms.Form):
    url = forms.URLField(label='', widget=forms.TextInput(attrs={'placeholder': 'URL'}))
    notes = forms.CharField(label='', widget=forms.Textarea(attrs={'placeholder': 'Notes'}))