
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("newPost", views.new_post, name="new_post"),
    path("profile/<int:id>", views.visit_profile, name='visit_profile'),
    path("followingPosts/", views.following_posts, name='following_posts'),
    path("follow_unfollow/", views.follow_unfollow, name="follow_unfollow"),
    path("edit/<int:id>", views.edit, name="edit")
]
