import os
import time

import requests
import sentry_sdk
from exponent_server_sdk import (
    DeviceNotRegisteredError,
    PushClient,
    PushMessage,
    PushServerError,
    PushTicketError,
)
from requests.exceptions import ConnectionError, HTTPError

# Optionally providing an access token within a session if you have enabled push security
session = requests.Session()
session.headers.update(
    {
        "Authorization": f"Bearer {os.getenv('EXPO_TOKEN')}",
        "accept": "application/json",
        "accept-encoding": "gzip, deflate",
        "content-type": "application/json",
    }
)

# Constants in seconds
MAX_RETRIES = 3
INITIAL_RETRY_DELAY = 30


# Function to calculate exponential backoff delay
def calculate_backoff_delay(retry_count):
    return INITIAL_RETRY_DELAY * (2**retry_count)


# Basic arguments. You should extend this function with the push features you
# want to use, or simply pass in a `PushMessage` object.
def send_push_message(token, message, extra=None):
    retries = 0
    successful = False

    while retries < MAX_RETRIES and not successful:
        try:
            response = PushClient(session=session).publish(
                PushMessage(to=token, body=message, data=extra)
            )
            successful = True
            return response

        except PushServerError as exc:
            # Encountered some likely formatting/validation error.
            with sentry_sdk.push_scope() as scope:
                scope.set_extra("token", token)
                scope.set_extra("message", message)
                scope.set_extra("extra", extra)
                scope.set_extra("errors", exc.errors)
                scope.set_extra("response_data", exc.response_data)
                sentry_sdk.capture_exception(exc)
                raise

        except (ConnectionError, HTTPError) as exc:
            # Encountered some Connection or HTTP error - retry a few times in
            # case it is transient.
            with sentry_sdk.push_scope() as scope:
                scope.set_extra("token", token)
                scope.set_extra("message", message)
                scope.set_extra("extra", extra)
                sentry_sdk.capture_exception(exc)

            backoff_delay = calculate_backoff_delay(retries)

            time.sleep(backoff_delay)
            retries += 1

        try:
            # We got a response back, but we don't know whether it's an error yet.
            # This call raises errors so we can handle them with normal exception
            # flows.
            response.validate_response()

        except DeviceNotRegisteredError:
            # Mark the push token as inactive
            break

        except PushTicketError as exc:
            # Encountered some other per-notification error.
            with sentry_sdk.push_scope() as scope:
                scope.set_extra("token", token)
                scope.set_extra("message", message)
                scope.set_extra("extra", extra)
                scope.set_extra("push_response", exc.push_response._asdict())
                sentry_sdk.capture_exception(exc)

            backoff_delay = calculate_backoff_delay(retries)

            time.sleep(backoff_delay)
            retries += 1
