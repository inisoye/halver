"""
Base scripts for Paystack API features.
Primarily based on patterns used by the paystackapi package.
https://github.com/andela-sjames/paystack-python
"""

from typing import Any, Dict

import requests
from environs import Env

env = Env()
env.read_env()

PAYSTACK_SECRET_KEY = env.str("PAYSTACK_SECRET_KEY")
PAYSTACK_API_BASE_URL = "https://api.paystack.co/"


class Borg:
    """
    Borg class making class attributes global.

    This class holds the state that all instances of the PaystackBase child instance
    would share.
    """

    _shared_state: Dict[str, Any] = {}

    def __init__(self):
        self.__dict__ = self._shared_state


class PaystackBase(Borg):
    """
    Base class used across all subclasses dedicated to Paystack features.
    """

    def __init__(self, **kwargs):
        """
        Initialize Paystack with secret key.
        """

        Borg.__init__(self)

        secret_key = kwargs.get("secret_key", PAYSTACK_SECRET_KEY)
        authorization = kwargs.get("authorization", f"Bearer { secret_key }")

        headers = {
            "Content-Type": "application/json",
            "Authorization": authorization,
        }

        arguments = dict(
            api_base_url=PAYSTACK_API_BASE_URL,
            headers=headers,
        )

        if not hasattr(self, "requests"):
            new_requests_attr = PaystackRequest(**arguments)
            self._shared_state.update(requests=new_requests_attr)


class PaystackRequest(object):
    def __init__(
        self,
        api_base_url="https://api.paystack.co/",
        headers=None,
    ):
        """
        Initialize Paystack Request object for browsing resource.

        Args:
            api_base_url: str
            headers: dict
        """

        self.API_BASE_URL = f"{api_base_url}"
        self.headers = headers

    def _request(self, method, resource_uri, **kwargs):
        """
        Perform a method on a resource.

        Args:
            method: requests.`method`
            resource_uri: resource endpoint

        Raises:
            HTTPError

        Returns:
            JSON Response
        """

        data = kwargs.get("data")
        qs = kwargs.get("qs")

        response = method(
            self.API_BASE_URL + resource_uri,
            json=data,
            headers=self.headers,
            params=qs,
        )

        if response.status_code // 100 == 2:
            return response.json()
        else:
            raise requests.HTTPError(response.status_code)

    def get(self, endpoint, **kwargs):
        """
        Get a resource.

        Args:
            endpoint: resource endpoint.
        """

        return self._request(
            requests.get,
            endpoint,
            **kwargs,
        )

    def post(self, endpoint, **kwargs):
        """
        Create a resource.

        Args:
            endpoint: resource endpoint.
        """

        return self._request(
            requests.post,
            endpoint,
            **kwargs,
        )

    def put(self, endpoint, **kwargs):
        """
        Update a resource.

        Args:
            endpoint: resource endpoint.
        """

        return self._request(
            requests.put,
            endpoint,
            **kwargs,
        )
