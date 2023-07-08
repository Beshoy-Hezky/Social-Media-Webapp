from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    following = models.ManyToManyField('self', symmetrical=False, blank=True, related_name='followers')


class Post(models.Model):
    user_liked = models.ManyToManyField('User', blank=True, related_name='posts_liked')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="users_posts")
    timestamp = models.DateTimeField(auto_now_add=True)
    content = models.CharField(max_length=200)

    def __str__(self):
        return f"Post id: {self.id} by {self.author}"
