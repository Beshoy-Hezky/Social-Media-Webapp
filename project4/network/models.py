from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="users_posts")
    timestamp = models.DateTimeField(auto_now_add=True)
    content = models.CharField(max_length=200)

    def __str__(self):
        return f"Post id: {self.id} by {self.author}"
