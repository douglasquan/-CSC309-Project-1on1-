from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.utils.translation import gettext_lazy as _

class UserManager(BaseUserManager):
    """ User manager """

    def _create_user(self, email, password=None, **extra_fields):
        """Creates and returns a new user using an email address"""
        if not email:  # check for an empty email
            raise AttributeError("User must set an email address")
        else:  # normalizes the provided email
            email = self.normalize_email(email)

        # create user
        user = self.model(email=email, **extra_fields)
        user.set_password(password)  # hashes/encrypts password
        user.save(using=self._db)  # safe for multiple databases
        return user

    def create_user(self, email, password=None, **extra_fields):
        """Creates and returns a new user using an email address"""
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_staffuser(self, email, password=None, **extra_fields):
        """Creates and returns a new staffuser using an email address"""
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    # def create_superuser(self, email, password=None, **extra_fields):
    #     """Creates and returns a new superuser using an email address"""
    #     extra_fields.setdefault("is_staff", True)
    #     extra_fields.setdefault("is_superuser", True)
    #     return self._create_user(email, password, **extra_fields)

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        # Check for email in extra_fields if not passed directly
        email = extra_fields.pop("email", None)
        if not email:
            raise ValueError("Superusers must have an email address.")
        if not username:
            raise ValueError("Superusers must have a username.")

        return self._create_user(email=email, password=password, username=username, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    """ Custom user model """
    username = models.CharField(_('Username'), max_length=150, unique=True)
    email = models.EmailField(
        _("Email Address"),
        max_length=255,
        unique=True,
        help_text="Ex: example@example.com",
    )
    is_staff = models.BooleanField(_("Staff status"), default=False)
    is_active = models.BooleanField(_("Active"), default=True)
    date_joined = models.DateTimeField(_("Date Joined"), auto_now_add=True)
    last_updated = models.DateTimeField(_("Last Updated"), auto_now=True)

    objects = UserManager()
    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ['email']
    first_name = models.CharField(_('First name'), max_length=30, blank=True)
    last_name = models.CharField(_('Last name'), max_length=30, blank=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)

    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name=_('groups'),
        blank=True,
        help_text=_(
            'The groups this user belongs to. A user will get all permissions granted to each of their groups.'
        ),
        related_name="user_set_custom",  # Changed related_name
        related_query_name="user_custom",
    )

    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name=_('user permissions'),
        blank=True,
        help_text=_('Specific permissions for this user.'),
        related_name="user_set_custom",  # Changed related_name
        related_query_name="user_custom",
    )

    def __str__(self):
        return self.email