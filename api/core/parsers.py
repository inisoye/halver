from django.conf import settings
from django.http import QueryDict
from djangorestframework_camel_case.util import underscoreize
from rest_framework.parsers import FormParser


class CamelCaseFormParser(FormParser):
    """
    Custom FormParser for converting incoming form data from camelCase to snake_case.

    This class is a custom implementation of the FormParser from the Django Rest
    Framework. It overrides the default `parse` method to convert incoming form data
    from camelCase to snake_case.

    It has been added to the project mainly to allow `post` requests to recieve data in
    camelCase
    """

    def parse(self, stream, media_type=None, parser_context=None):
        """
        Converts incoming form data from camelCase to snake_case.

        Args:
            stream (str): The incoming form data stream.
            media_type (str, optional): The media type of the incoming data.
            parser_context (dict, optional): A dictionary containing information
            about the parsing context.

        Returns:
            dict: A dictionary of form data with keys in snake_case format.
        """

        # Get the parser context or use an empty dictionary if it's not specified
        parser_context = parser_context or {}

        # Get the encoding to use for the data, defaulting to the value in the settings
        encoding = parser_context.get("encoding", settings.DEFAULT_CHARSET)

        # Read the stream into a QueryDict and set the encoding
        data = QueryDict(stream.read(), encoding=encoding)

        # Convert the keys in the data from camelCase to snake_case and return it
        return underscoreize(data)
