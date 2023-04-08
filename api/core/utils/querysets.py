from django.core import serializers


def print_queryset_as_json(queryset, queryset_name=None):
    """
    Prints the given Django queryset as a JSON string.

    Args:
        queryset (QuerySet): The Django queryset to be serialized as JSON.
        queryset_name (str, optional): The name of the queryset to be printed.
    """
    serialized_data = serializers.serialize("json", queryset)

    if queryset_name:
        print(f"{queryset_name}:")

    print(serialized_data)
    print("=" * 50)
