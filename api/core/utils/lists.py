def find_first_element(iterable, condition):
    """Finds the first element in the given iterable that satisfies the given
    condition.

    Designed to work similar to JS's Array.find method.

    Args:
        iterable: An iterable object to search for the first element that satisfies the
        condition.
        condition: A function that takes an element of the iterable as its argument and
        returns a boolean indicating whether the element satisfies the condition.

    Returns:
        The first element in the iterable that satisfies the condition, or None if no
        such element is found.
    """

    for element in iterable:
        if condition(element):
            return element

    return None
