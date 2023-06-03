import io

from PIL import Image


def convert_image_to_byte_array(image: Image) -> bytes:
    """
    Convert an image object to a byte array.

    Args:
        image (PIL.Image.Image): The input image object.

    Returns:
        bytes: The byte array representation of the image.
    """

    imgByteArr = io.BytesIO()
    image.save(imgByteArr, format=image.format, optimize=True)

    return imgByteArr.getvalue()
