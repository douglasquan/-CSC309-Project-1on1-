from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Contact

User = get_user_model()

class ContactSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)

    class Meta:
        model = Contact
        fields = ['id', 'user', 'added_at', 'removed', 'email']
        read_only_fields = ('id', 'user', 'added_at')

    def create(self, validated_data):
        # During the creation of a new contact, the email is used to look up an existing user. 
        # If a user with the given email does not exist, it raises a validation error.
        email = validated_data.pop('email', None)
        user = User.objects.filter(email=email).first()
        if not user:
            raise serializers.ValidationError({"email": "User with this email does not exist."})
        validated_data['user'] = user
        return super(ContactSerializer, self).create(validated_data)
