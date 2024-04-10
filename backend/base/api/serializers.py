from rest_framework.serializers import ModelSerializer
from base.models import Note
from django.contrib.auth.models import User
from rest_framework import serializers



class UserSerializer(ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user