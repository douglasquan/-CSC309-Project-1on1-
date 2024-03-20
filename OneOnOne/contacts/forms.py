from django import forms

class AddContactForm(forms.Form):
    email = forms.EmailField(label="User's email", help_text="Enter the email of the user you want to add.")
