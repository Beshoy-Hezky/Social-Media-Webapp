from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from .models import User, Post
from django.core.paginator import Paginator
import json
from django.http import JsonResponse

def index(request):
    getposts = Post.objects.all()
    # Reverse order by reverse id
    ordered_posts = getposts.order_by("id").reverse()
    # To apply pagination
    paginator = Paginator(ordered_posts, 10)
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)
    return render(request, "network/index.html", {
        "posts": page_obj
    })


def visit_profile(request, id):
    user = User.objects.get(id=id)
    getposts = Post.objects.filter(author=user)
    ordered_posts = getposts.order_by("id").reverse()
    return render(request, "network/profile.html", {
        "posts": ordered_posts,
        "user_of_profile": user
    })


def follow_unfollow(request):
    if request.method == "POST":
        # User who made the request
        requestor = User.objects.get(id=request.user.id)
        # User who is going to get followed or unfollowed
        profile_id = request.POST["id"]
        profile = User.objects.get(id=profile_id)
        # To check if the request is to follow or unfollow
        action = request.POST["button"]
        if action == "follow":
            requestor.following.add(profile)
        elif action == "unfollow":
            requestor.following.remove(profile)
        return HttpResponseRedirect(reverse("visit_profile", args=[profile_id]))


def new_post(request):
    if request.method == "POST":
        content = request.POST["content"]
        if len(content) != 0:
            thepost = Post(content=content, author=request.user)
            thepost.save()
        return HttpResponseRedirect(reverse("index"))


def following_posts(request):
    user = request.user
    # Filter the posts
    getposts = Post.objects.filter(author__in=user.following.all())
    # Reverse order by reverse id
    ordered_posts = getposts.order_by("id").reverse()
    # To apply pagination
    paginator = Paginator(ordered_posts, 10)
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)
    return render(request, "network/followingposts.html", {
        "posts": page_obj,
        "user_of_profile": user
    })


def edit(request, id):
    if request.method == "POST":
        info = json.loads(request.body)
        post = Post.objects.get(id=id)
        post.content = info["new_content"]
        post.save()
    return JsonResponse({"message": "successful EDIT"})


def add_like(request, id):
    if request.method == "POST":
        info = json.loads(request.body)
        post = Post.objects.get(id=id)
        liker_id = info["person_id"]
        liker = User.objects.get(id=liker_id)
        post.user_liked.add(liker)
        post.save()
    return JsonResponse({"message": "successful LIKE"})


def remove_like(request, id):
    if request.method == "POST":
        info = json.loads(request.body)
        post = Post.objects.get(id=id)
        hater_id = info["person_id"]
        hater = User.objects.get(id=hater_id)
        post.user_liked.remove(hater)
        post.save()
    return JsonResponse({"message": "successful UNLIKE"})


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
