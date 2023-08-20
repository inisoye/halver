from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class CustomPageNumberPagination(PageNumberPagination):
    """
    Custom pagination class extending PageNumberPagination.
    Provides paginated response with next and previous page numbers (instead of links).

    Attributes:
        page_size (int): Default items per page.
        page_size_query_param (str): Query parameter for items per page.
        max_page_size (int): Maximum items per page.
        page_query_param (str): Query parameter for page number.
    """

    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100
    page_query_param = "page"

    def get_paginated_response(self, data):
        """
        Generate Response object with pagination metadata and paginated data.

        Args:
            data (list): List of items for the paginated response.
        """

        return Response(
            {
                "next": self.page.next_page_number() if self.page.has_next() else None,
                "previous": self.page.previous_page_number()
                if self.page.has_previous()
                else None,
                "count": self.page.paginator.count,
                "results": data,
            }
        )
