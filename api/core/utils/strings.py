def remove_underscores(string: str) -> str:
    """
    Removes underscores from a string.

    Args:
        string (str): The string to remove underscores from.

    Returns:
        str: The string with underscores removed.
    """

    return string.replace("_", " ")
