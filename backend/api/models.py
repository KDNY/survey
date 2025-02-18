from django.db import models
from django.contrib.auth.models import AbstractUser

class AdminUser(AbstractUser):
    is_admin = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'admin user'
        verbose_name_plural = 'admin users'

    def __str__(self):
        return self.username

# Note: Survey model is now managed by Supabase, not Django



