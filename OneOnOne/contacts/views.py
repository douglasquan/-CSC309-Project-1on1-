from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from .models import Contact
from .serializers import ContactSerializer  # You will need to create this serializer
from django.http import JsonResponse

# For /contacts/add/ endpoint
class ContactListCreateAPIView(APIView):
    # Require authentication for these views
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Retrieve all contacts that have not been removed
        contacts = Contact.objects.filter(removed=False)
        serializer = ContactSerializer(contacts, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ContactSerializer(data=request.data)
        if serializer.is_valid():
            # Set the user before saving
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# For /contacts/view/ endpoint - This could be the same as GET in ContactListCreateAPIView
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def contact_view(request):
    # Retrieve all contacts, regardless of the user
    contacts = Contact.objects.filter(removed=False)
    serializer = ContactSerializer(contacts, many=True)
    return Response(serializer.data)

# For /contacts/<contact-id>/delete/ endpoint
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def contact_delete(request, contact_id):
    contact = get_object_or_404(Contact, id=contact_id)
    
    # Check if the contact belongs to the requesting user
    if contact.user == request.user:
        # Prevent users from deleting their own contact
        return JsonResponse({'detail': 'You cannot delete your own contact.'}, status=status.HTTP_403_FORBIDDEN)
    else:
        # Proceed with deleting (soft delete) the contact
        contact.removed = True
        contact.save()
        return Response(status=status.HTTP_204_NO_CONTENT)