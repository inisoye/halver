# type: ignore
# Checks are disabled because Pylance does not properly type get_user_model()

from django.contrib.auth import get_user_model
from django.db import IntegrityError
from django.test import TestCase

User = get_user_model()


class CustomUserTests(TestCase):
    def test_create_user(self) -> None:

        user = User.objects.create_user(
            phone="08010191010",
            email="user@email.com",
            username="user",
            password="testpass123",
        )
        self.assertEqual(user.username, "user")
        self.assertEqual(user.email, "user@email.com")
        self.assertEqual(user.phone, "08010191010")
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

        # Test for the creation of duplicate users
        with self.assertRaises(IntegrityError):
            User.objects.create_user(
                phone="08010191010",
                email="user@email.com",
                username="user",
                password="testpass123",
            )

        # Test for a missing email field
        with self.assertRaises(ValueError):
            User.objects.create_user(
                phone="",
                email="user@email.com",
                username="user",
                password="testpass123",
            )

    def test_create_superuser(self) -> None:

        admin_user = User.objects.create_superuser(
            phone="08010191010",
            email="user@email.com",
            username="user",
            password="testpass123",
        )
        self.assertEqual(admin_user.username, "user")
        self.assertEqual(admin_user.email, "user@email.com")
        self.assertEqual(admin_user.phone, "08010191010")
        self.assertTrue(admin_user.is_active)
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)

        # Test for is_superuser field
        with self.assertRaises(ValueError):
            User.objects.create_superuser(
                phone="08010191010",
                email="user@email.com",
                username="user",
                password="testpass123",
                is_superuser=False,
            )

        # Test for is_staff field
        with self.assertRaises(ValueError):
            User.objects.create_superuser(
                phone="08010191010",
                email="user@email.com",
                username="user",
                password="testpass123",
                is_staff=False,
            )

        with self.assertRaises(ValueError):
            User.objects.create_superuser(
                phone="",
                email="user@email.com",
                username="user",
                password="testpass123",
            )
