def sum_numeric_dictionary_values(dict):
    """Sums up the numeric values in a dictionary.

    Args:
        d (dict): A dictionary whose values are numeric.

    Returns:
        float: The sum of the numeric values in the dictionary.
    """

    total = 0.0

    for value in dict.values():
        try:
            total += float(value)
        except (TypeError, ValueError):
            pass

    return total
