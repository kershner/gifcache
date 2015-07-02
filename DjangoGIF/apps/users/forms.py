from django import forms


class EditProfileForm(forms.Form):
    username = forms.CharField(label='', widget=forms.TextInput(attrs={'placeholder': 'Username'}))
    first_name = forms.CharField(label='', widget=forms.TextInput(attrs={'placeholder': 'First Name'}))
    avatar_url = forms.CharField(label='', widget=forms.URLInput(attrs={'placeholder': 'Avatar URL'}))


class AddGifForm(forms.Form):
    url = forms.URLField(label='', widget=forms.TextInput(attrs={'placeholder': 'URL', 'class': 'add-form-input'}))
    label = forms.CharField(label='', required=False, widget=forms.TextInput(attrs={'placeholder': 'Label', 'class': 'add-form-input'}))
    tags = forms.CharField(label='', required=False, widget=forms.TextInput(attrs={'placeholder': 'Tags', 'class': 'add-form-input'}))
    hidden_id = forms.CharField(label='', widget=forms.TextInput(attrs={'class': 'hidden'}))