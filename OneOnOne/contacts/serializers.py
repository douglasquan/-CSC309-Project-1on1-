from rest_framework import serializers
from .models import Contact

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['id', 'user', 'added_at', 'removed']
        read_only_fields = ('id', 'user', 'added_at')  # These fields should not be editable by the API

    def create(self, validated_data):
        # Custom create method to add the user from the request user
        validated_data['user'] = self.context['request'].user
        return super(ContactSerializer, self).create(validated_data)
