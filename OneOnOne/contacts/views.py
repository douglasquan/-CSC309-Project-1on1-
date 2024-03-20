from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Contact
from .forms import AddContactForm
from django.contrib.auth import get_user_model
from django.contrib import messages  # Import Django's messages framework

User = get_user_model()

@login_required
def contact_list(request):
    contacts = Contact.objects.filter(owner=request.user, removed=False).select_related('contact')
    print("Current logged-in user:", request.user.email)
    return render(request, 'contact_list.html', {'contacts': contacts})

@login_required
def add_contact(request):
    if request.method == "POST":
        form = AddContactForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data.get('email').strip()
            if email == request.user.email:  
                messages.error(request, "You cannot add yourself as a contact.")
                return redirect('add_contact')
            
            contact_user = get_object_or_404(User, email=email)
            if Contact.objects.filter(owner=request.user, contact=contact_user).exists():
                messages.error(request, "This user is already in your contact list.")
                return redirect('add_contact')
            else:
                Contact.objects.create(owner=request.user, contact=contact_user)
                messages.success(request, "Contact added successfully.")  
                return redirect('contact_list')
    else:
        form = AddContactForm()
    return render(request, 'add_contact.html', {'form': form})


@login_required
def remove_contact(request, contact_id):
    contact = get_object_or_404(Contact, id=contact_id, owner=request.user)
    
    if request.method == 'POST':
        contact.removed = True
        contact.save()
        return redirect('contact_list')
    else:
        return render(request, 'delete_contact.html', {'contact': contact})