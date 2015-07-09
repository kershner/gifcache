from django import forms


class EditProfileForm(forms.Form):
    nickname = forms.CharField(label='Nickname', widget=forms.TextInput(attrs={'placeholder': 'First Name'}))
    avatar_url = forms.CharField(label='Avatar URL', widget=forms.TextInput(attrs={'placeholder': 'Avatar URL'}))


class AddGifForm(forms.Form):
    url = forms.URLField(label='', widget=forms.TextInput(attrs={'placeholder': 'URL', 'class': 'main-field add-form-input animate'}))
    label = forms.CharField(label='', required=False, widget=forms.TextInput(attrs={'placeholder': 'Label', 'class': 'main-field add-form-input animate'}))
    tags = forms.CharField(label='', required=False, widget=forms.TextInput(attrs={'placeholder': 'Tags', 'class': 'main-field add-form-input animate'}))
    hidden_id = forms.CharField(label='', widget=forms.TextInput(attrs={'class': 'hidden'}))