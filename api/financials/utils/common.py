from django.db import transaction


def get_model_manager(model_instance, model_name: str):
    """Get the appropriate manager for the model instance and model name.

    Args:
        model_instance: A model (card or transfer recipient) instance.
        model_name (str): The name of the model.

    Returns:
        The appropriate model manager for the given model instance and model name.

    Raises:
        ValueError: If the `model_name` is not 'transfer_recipient' or 'user_card'.
    """

    if model_name == "transfer_recipient":
        return model_instance.user.transfer_recipients

    elif model_name == "user_card":
        return model_instance.user.cards

    else:
        raise ValueError("Invalid model name")


def set_as_default(self, model_name: str) -> None:
    """Sets the current (card or transfer recipient) instance as the default
    instance for the given model.

    Args:
        model_name (str): 'transfer_recipient' or 'user_card' depending on the model
        that the function will be used in.
    """

    model_manager = get_model_manager(self, model_name)

    if not self.is_default:
        with transaction.atomic():
            model_manager.update(is_default=False)
            self.is_default = True
            self.save(update_fields=["is_default"])


def delete_and_set_newest_as_default(self, model_name: str) -> None:
    """Deletes the current card or transfer recipient instance. If the deleted
    instance was the default instance, the newest of the remaining instances
    will be set as the new default.

    Args:
        model_name (str): 'transfer_recipient' or 'user_card' depending on the model
        that the function will be used in.
    """

    self.delete()

    model_manager = get_model_manager(self, model_name)

    are_any_instances_left = model_manager.exists()

    if self.is_default and are_any_instances_left:
        next_newest = model_manager.latest("created")
        next_newest.set_as_default_recipient()
