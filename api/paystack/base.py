"""
Base scripts for Paystack API features.
Initially based on patterns used by the paystackapi package.
Modified to allow for asynchronous requests.
https://github.com/andela-sjames/paystack-python
"""

from typing import Any, Dict

import aiohttp
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
        query_params = kwargs.get("query_params")

        response = method(
            self.API_BASE_URL + resource_uri,
            json=data,
            headers=self.headers,
            params=query_params,
        )

        return response.json()

    async def _request_async(self, _session, method, endpoint, **kwargs):
        """
        Perform an HTTP method on a resource asynchronously.

        Args:
            session: aiohttp.ClientSession object
            method: aiohttp.ClientSession method (e.g. session.get, session.post,
            or session.put)
            endpoint: resource endpoint

        Raises:
            aiohttp.ClientError

        Returns:
            JSON response
        """

        query_params = kwargs.get("query_params")
        data = kwargs.get("data")

        async with method(
            self.API_BASE_URL + endpoint,
            params=query_params,
            json=data,
            headers=self.headers,
        ) as response:
            return await response.json()

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

    async def get_async(self, endpoint, **kwargs):
        """
        Get a resource asynchronously.

        Args:
            endpoint: resource endpoint.

        Returns:
            JSON response
        """

        async with aiohttp.ClientSession() as session:
            return await self._request_async(
                session,
                session.get,
                endpoint,
                **kwargs,
            )

    def post(self, endpoint, **kwargs):
        """
        Create a resource.

        Args:
            endpoint: resource endpoint.

        Returns:
            JSON response
        """

        return self._request(
            requests.post,
            endpoint,
            **kwargs,
        )

    async def post_async(self, endpoint, **kwargs):
        """
        Post a resource asynchronously.

        Args:
            endpoint: resource endpoint.

        Returns:
            JSON response
        """

        async with aiohttp.ClientSession() as session:
            return await self._request_async(
                session,
                session.post,
                endpoint,
                **kwargs,
            )

    def put(self, endpoint, **kwargs):
        """
        Update a resource.

        Args:
            endpoint: resource endpoint.

        Returns:
            JSON response
        """

        return self._request(
            requests.put,
            endpoint,
            **kwargs,
        )

    async def put_async(self, endpoint, **kwargs):
        """
        Update a resource asynchronously.

        Args:
            endpoint: resource endpoint.

        Returns:
            JSON response
        """

        async with aiohttp.ClientSession() as session:
            return await self._request_async(
                session,
                session.put,
                endpoint,
                **kwargs,
            )

    def delete(self, endpoint, **kwargs):
        """
        Delete a resource.

        Args:
            endpoint: resource endpoint.

        Returns:
            JSON response
        """

        return self._request(
            requests.delete,
            endpoint,
            **kwargs,
        )

    async def delete_async(self, endpoint, **kwargs):
        """
        Delete a resource asynchronously.

        Args:
            endpoint: resource endpoint.

        Returns:
            JSON response
        """

        async with aiohttp.ClientSession() as session:
            return await self._request_async(
                session,
                session.delete,
                endpoint,
                **kwargs,
            )
