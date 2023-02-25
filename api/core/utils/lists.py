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


def sum_list_of_dictionary_values(data, value_key):
    """Sums up the numeric values associated with a given key in a list of
    dictionaries.

    Args:
        data (list): A list of dictionaries whose values are numeric.
        value_key (hashable): The key in the dictionaries whose values should be
        summed up.

    Returns:
        float: The sum of the numeric values associated with the key in the list
        of dictionaries.
    """

    total = 0.0
    for item in data:
        if value_key in item:
            try:
                total += float(item[value_key])
            except (TypeError, ValueError):
                pass
    return total
