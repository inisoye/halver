import os


def get_file_size(file_path):
    """
    Check the size of a file.

    Args:
        file_path (str): The path to the file.

    Returns:
        int: The size of the file in bytes.
    """
    if os.path.isfile(file_path):
        return os.path.getsize(file_path)
    else:
        raise FileNotFoundError("File not found.")
