from django.db import transaction


def set_as_default(self, model_name: str) -> None:
    """
    Sets current (card or transfer recipient) instance as the default model instance.

    Args:
        model_name (str): 'transfer_recipient' or 'user_card' depending on the model
        the function will be used in.
    """

    if model_name == "transfer_recipient":
        model_manager = self.user.transfer_recipients
    elif model_name == "user_card":
        model_manager = self.user.cards
    else:
        raise ValueError("Invalid model name")

    if not self.is_default:
        with transaction.atomic():
            model_manager.update(is_default=False)
            self.is_default = True
            self.save(update_fields=["is_default"])
