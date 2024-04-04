
from .models import Contact
from django.http import Http404
from .serializers import ContactSerializer
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status


class ContactListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        contacts = Contact.objects.filter(owner=request.user).select_related('contact')
        serializer = ContactSerializer(contacts, many=True)
        return Response(serializer.data)
    
class AddContactView(APIView):
    def post(self, request, *args, **kwargs):
        contact_email = request.data.get('email')
        try:
            contact_user = User.objects.get(email=contact_email)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        if request.user.id == contact_user.id:
            return Response({'error': 'You cannot add yourself'}, status=status.HTTP_400_BAD_REQUEST)
        
        if Contact.objects.filter(owner=request.user, contact=contact_user).exists():
            return Response({'error': 'Contact already exists'}, status=status.HTTP_409_CONFLICT)
        
        contact = Contact.objects.create(owner=request.user, contact=contact_user)
        return Response(ContactSerializer(contact).data, status=status.HTTP_201_CREATED)

class ContactDeleteView(APIView):
    def get_object(self, pk):
        try:
            return Contact.objects.get(pk=pk)
        except Contact.DoesNotExist:
            raise Http404

    def delete(self, request, pk, format=None):
        contact = self.get_object(pk)
        contact.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)