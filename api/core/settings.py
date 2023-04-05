"""Django settings for core project.

Generated by 'django-admin startproject' using Django 4.1.4.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.1/ref/settings/
"""

from datetime import timedelta
from pathlib import Path

from django.core.management.utils import get_random_secret_key
from environs import Env

env = Env()
env.read_env()

""" Default values have been set for virtually all environment variables.
This makes it easy to run collectstatic without failure during the fly build process.
"""

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env.str("SECRET_KEY", default=get_random_secret_key())

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env.bool("DEBUG", default=False)

ALLOWED_HOSTS: list[str] = env.list("ALLOWED_HOSTS", default=[])


# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "whitenoise.runserver_nostatic",
    "django.contrib.staticfiles",
    "django.contrib.sites",
    # 3rd party
    "rest_framework",
    "corsheaders",
    "rest_framework.authtoken",
    "allauth",
    "allauth.account",
    "dj_rest_auth",
    "dj_rest_auth.registration",
    "allauth.socialaccount",
    "allauth.socialaccount.providers.google",
    "drf_spectacular",
    "debug_toolbar",
    "import_export",
    "phonenumber_field",
    # Local
    "accounts.apps.AccountsConfig",
    "financials.apps.FinancialsConfig",
    "bills.apps.BillsConfig",
]

MIDDLEWARE = [
    "debug_toolbar.middleware.DebugToolbarMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


ROOT_URLCONF = "core.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
                "django.template.context_processors.request",
            ],
        },
    },
]

WSGI_APPLICATION = "core.wsgi.application"


# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django_psdb_engine",
        "NAME": env.str("DB_NAME"),
        "HOST": env.str("DB_HOST"),
        "PORT": env.str("DB_PORT"),
        "USER": env.str("DB_USER"),
        "PASSWORD": env.str("DB_PASSWORD"),
        "OPTIONS": {"ssl": {"ca": env.str("MYSQL_ATTR_SSL_CA")}},
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": (
            "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"
        )
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"  # Kept as UTC to prevent validation mishaps.

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/

STATIC_URL = "static/"
STATICFILES_DIRS = [BASE_DIR / "static"]
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# Media Files
# https://docs.djangoproject.com/en/4.0/ref/settings/#media-root

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"


# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# Custom user model
# https://simpleisbetterthancomplex.com/article/2021/07/08/what-you-should-know-about-the-django-user-model.html

AUTH_USER_MODEL = "accounts.CustomUser"


# Specify Allauth in list of auth backends
# https://docs.djangoproject.com/en/4.1/topics/auth/customizing/#specifying-authentication-backends

AUTHENTICATION_BACKENDS = [
    # Needed to login by username in Django admin, regardless of `allauth`
    "django.contrib.auth.backends.ModelBackend",
    # allauth specific authentication methods, such as login by e-mail
    "allauth.account.auth_backends.AuthenticationBackend",
]


# Default region for phone numbers set to Nigeria
# https://django-phonenumber-field.readthedocs.io/en/latest/reference.html#model-field

PHONENUMBER_DEFAULT_REGION = "NG"


# Default currency configuration

DEFAULT_CURRENCY_NAME = "Nigerian Naira"
DEFAULT_CURRENCY_SYMBOL = "₦"
DEFAULT_CURRENCY_CODE = "NGN"


# Rest framework settings
# Camel case renderers and parsers have been added:
# https://github.com/vbabiy/djangorestframework-camel-case#installation

REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework.authentication.TokenAuthentication",
    ],
    "DEFAULT_RENDERER_CLASSES": (
        "djangorestframework_camel_case.render.CamelCaseJSONRenderer",
        "djangorestframework_camel_case.render.CamelCaseBrowsableAPIRenderer",
    ),
    "DEFAULT_PARSER_CLASSES": (
        "djangorestframework_camel_case.parser.CamelCaseFormParser",
        "djangorestframework_camel_case.parser.CamelCaseMultiPartParser",
        "djangorestframework_camel_case.parser.CamelCaseJSONParser",
        "core.parsers.CamelCaseFormParser",
    ),
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 10,
    "JSON_UNDERSCOREIZE": {
        # Prevent the conversion of these as they have uuid keys nested.
        "ignore_fields": ("participants_contribution_index",),
        "ignore_keys": ("participants_contribution_index",),
    },
}


# Allowed CORS origins

CORS_ORIGIN_WHITELIST = env.list("CORS_ORIGIN_WHITELIST", default=[])


# Allowed CSRF origins

CSRF_TRUSTED_ORIGINS = env.list("CSRF_TRUSTED_ORIGINS", default=[])


# Internal IPs. Orginally added for Debug Toolbar

INTERNAL_IPS = [
    "127.0.0.1",
]


# Use console as email backend in dev mode
# https://docs.djangoproject.com/en/4.1/topics/email/#console-backend

if DEBUG:
    EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"


# Allauth configuration
# https://django-allauth.readthedocs.io/en/latest/configuration.html

# Set site id (only because) required by django_allauth
SITE_ID = 2

ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_UNIQUE_EMAIL = True
ACCOUNT_EMAIL_VERIFICATION = "none"
LOGIN_REDIRECT_URL = "/"

SOCIALACCOUNT_ADAPTER = "accounts.adapters.SocialAccountAdapter"

SOCIALACCOUNT_PROVIDERS = {
    "google": {
        "APP": {
            "client_id": env.str(
                "GOOGLE_OAUTH_CLIENT_ID",
                default="default_google_oauth_client_id",
            ),
            "secret": env.str(
                "GOOGLE_OAUTH_CLIENT_SECRET",
                default="default_google_oauth_client_secret",
            ),
            "key": "",
        },
        "SCOPE": [
            "profile",
            "email",
        ],
        "AUTH_PARAMS": {
            "access_type": "online",
        },
        "OAUTH_PKCE_ENABLED": True,
    }
}


# Rest-auth configuration
# https://dj-rest-auth.readthedocs.io/en/2.1.12/configuration.html
# Great guide:
# https://www.rootstrap.com/blog/registration-and-authentication-in-django-apps-with-dj-rest-auth/

REST_AUTH_SERIALIZERS = {
    "USER_DETAILS_SERIALIZER": "accounts.serializers.CustomUserDetailsSerializer",
}

REST_AUTH_REGISTER_SERIALIZERS = {
    "REGISTER_SERIALIZER": "accounts.serializers.CustomRegisterSerializer",
}


# Celery configuration

CELERY_BROKER_URL = env.str("REDIS_URL", default="redis://localhost:6379")
CELERY_RESULT_BACKEND = env.str("REDIS_URL", default="redis://localhost:6379")
CELERY_ACCEPT_CONTENT = ["application/json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"
CELERY_TIMEZONE = TIME_ZONE
CELERY_LOADER = "core.celery.app"
CELERY_IMPORTS = (
    "bills.tasks.actions",
)  # Manually added as Celery is not "autodetecting" it
CELERY_BEAT_SCHEDULE = {
    "update_overdue_statuses": {
        "task": "bills.tasks.actions.update_overdue_statuses",
        "schedule": timedelta(hours=6),
    },
}


# Django Spectacular configuration

SPECTACULAR_SETTINGS = {
    "TITLE": "Halver",
    "DESCRIPTION": "A bill splitting app built on Paystack APIs",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
    "SCHEMA_PATH_PREFIX": r"/api/v[0-9]",
    "SERVE_PERMISSIONS": ["rest_framework.permissions.IsAuthenticated"],
}


# Paystack configuration

PAYSTACK_SECRET_KEY = env.str(
    "PAYSTACK_SECRET_KEY",
    default="default_paystack_secret_key",
)
PAYSTACK_IP_WHITELIST = ["52.31.139.75", "52.49.173.169", "52.214.14.220"]
