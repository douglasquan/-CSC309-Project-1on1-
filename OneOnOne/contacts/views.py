from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from .models import Contact
from .serializers import ContactSerializer  # You will need to create this serializer

# For /contacts/add/ endpoint
class ContactListCreateAPIView(APIView):
    # Require authentication for these views
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Retrieve all contacts that have not been removed
        contacts = Contact.objects.filter(user=request.user, removed=False)
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
    contacts = Contact.objects.filter(user=request.user, removed=False)
    serializer = ContactSerializer(contacts, many=True)
    return Response(serializer.data)

# For /contacts/<contact-id>/delete/ endpoint
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def contact_delete(request, contact_id):
    contact = get_object_or_404(Contact, id=contact_id, user=request.user)
    contact.removed = True  # Soft delete the contact
    contact.save()
    return Response(status=status.HTTP_204_NO_CONTENT)
