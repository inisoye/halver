import re


def remove_underscores(string: str) -> str:
    """
    Removes underscores from a string.

    Args:
        string (str): The string to remove underscores from.

    Returns:
        str: The string with underscores removed.
    """

    return string.replace("_", " ")


def extract_uuidv4s_from_string(string, position=None):
    """Extracts UUIDv4(s) from a string using a regular expression and re.findall().

    Args:
        string (str): The string to search for UUIDv4s.
        position (int): The zero-indexed position of the UUIDv4 to return.
            If None, all UUIDv4s will be returned.

    Returns:
        Union[str, List[str]]: The UUIDv4(s) found in the string.
            If position is not None, the UUIDv4 at the specified position
                is returned as a string.
            If position is None, all UUIDv4s are returned as a list of strings.
            If no UUIDv4s are found, returns None.
    """

    pattern = r"(\w{8}-\w{4}-\w{4}-\w{4}-\w{12})"
    matches = re.findall(pattern, string)

    if matches:
        if position is None:
            return matches
        elif position <= len(matches):
            return matches[position - 1]

    return None
