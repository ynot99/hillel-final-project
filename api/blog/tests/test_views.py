from unittest import skip

from django.urls import reverse
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import (
    APIClient,
    force_authenticate,
    APIRequestFactory,
)

from ..models import Post, Comment


class BlogPostTestCase(TestCase):
    fixtures = {"authors.json", "posts.json"}

    @classmethod
    def setUpClass(cls) -> None:
        super().setUpClass()
        cls.client = APIClient()

    def setUp(self) -> None:
        super().setUp()

        last_post = Post.objects.all().order_by("id").last()
        self.free_pk = 1
        if last_post is not None:
            self.free_pk = last_post.pk

    def test_GET_200(self):
        response = self.client.get(reverse("blog:posts"))

        self.assertEqual(response.status_code, 200)

    def test_GET_200_one(self):
        response = self.client.get(reverse("blog:post", kwargs={"pk": 1}))

        self.assertEqual(response.status_code, 200)

    def test_GET_404_one_wrong_id(self):
        response = self.client.get(
            reverse("blog:post", kwargs={"pk": self.free_pk + 1})
        )

        self.assertEqual(response.status_code, 404)

    @skip("TODO")
    def test_POST_201_authorized(self):
        factory = APIRequestFactory()
        user = get_user_model()
        # user.objects.authenticate() # User.objects.get(username="testuser")
        # view = CustomAuthToken.as_view()

        # request = factory.post(
        #     "token-auth",
        #     data={"username": user.username, "password": user.password},
        # )
        self.client.login(username="testuser", password="")
        # force_authenticate(request=request, user=user, token=user.auth_token)
        # response = view(request)
        # self.client.post(
        #     "token-auth", {"username": "testuser", "password": ""}
        # )
        # print(response)
        response = self.client.post(
            reverse("blog:post_create_authorized"),
            {
                "title": "Test title",
                "body": "Test body",
                "author": 1,
            },
        )

        self.assertEqual(response.status_code, 201)

    def test_POST_401_not_authorized(self):
        response = self.client.post(
            reverse("blog:post_create_authorized"),
            {
                "title": "Test title",
                "body": "Test body",
                "author": 1,
            },
        )

        self.assertEqual(response.status_code, 401)

    def test_GET_200_user_posts(self):
        response = self.client.get(
            reverse("blog:posts_user_profile", kwargs={"pk": 1})
        )

        self.assertEqual(response.status_code, 200)

    def test_GET_404_user_posts_wrong_id(self):
        response = self.client.get(
            reverse("blog:posts_user_profile", kwargs={"pk": self.free_pk + 1})
        )

        self.assertEqual(response.status_code, 404)


class BlogCommentTestCase(TestCase):
    fixtures = {"authors.json", "posts.json"}

    def test_POST_201(self):
        response = self.client.post(
            reverse("blog:comment"),
            data={
                "post": 1,
                "user": 1,
                "content": "Test content",
                "reply_to": "",
                "created_at": "2021-01-01T00:00:00Z",
                "updated_at": "2021-01-01T00:00:00Z",
            },
        )

        print(response.json())

        self.assertEqual(response.status_code, 201)


class BlogUserProfileTestCase(TestCase):
    fixtures = {"authors.json"}

    def setUp(self) -> None:
        super().setUp()

        last_user = get_user_model().objects.all().order_by("id").last()
        self.free_user_pk = 1
        if last_user is not None:
            self.free_user_pk = last_user.pk + 1

    def test_GET_200(self):
        response = self.client.get(
            reverse("blog:user_profile", kwargs={"slug": "test-user"})
        )

        self.assertEqual(response.status_code, 200)

    def test_GET_200_coments(self):
        response = self.client.get(
            reverse("blog:comment_user_profile", kwargs={"pk": 1})
        )

        self.assertEqual(response.status_code, 200)

    def test_GET_404_coments_wrong_pk(self):
        response = self.client.get(
            reverse(
                "blog:comment_user_profile", kwargs={"pk": self.free_user_pk}
            )
        )

        self.assertEqual(response.status_code, 404)
