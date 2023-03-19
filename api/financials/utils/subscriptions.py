def format_disable_subscriptions_payloads(bill_actions):
    """
    Formats a list of bill actions into a list of payloads to disable
    Paystack subscriptions.

    Args:
        bill_actions (list): A list of bill actions with the subscriptions to be
            disabled.

    Returns:
        list: A list of payloads to disable Paystack subscriptions, where each payload
            is a dictionary with two keys: "code" and "token".
    """

    disable_subscriptions_payloads = []

    for action in bill_actions:
        has_subscription = (
            hasattr(action, "paystack_subscription")
            and action.paystack_subscription is not None
        )

        if has_subscription:
            paystack_subscription = action.paystack_subscription
            paystack_subscription_code = (
                paystack_subscription.paystack_subscription_code
            )
            paystack_email_token = paystack_subscription.paystack_email_token

            disable_subscriptions_payloads.append(
                {
                    "code": paystack_subscription_code,
                    "token": paystack_email_token,
                }
            )

    return disable_subscriptions_payloads


def get_action_ids_to_be_ignored(disable_subscriptions_responses, bill_actions):
    """
    Returns a list of IDs of bill actions that are associated with subscriptions that
    were not successfully disabled.

    Args:
        disable_subscriptions_responses (list): A list of responses from Paystack API
            for disabling subscriptions.
        bill_actions (list): A list of bill actions.

    Returns:
        list: A list of IDs of bill actions that are associated with subscriptions
            that were not successfully disabled.
    """

    action_ids_to_be_ignored = []

    for index, disable_subscription_response in enumerate(
        disable_subscriptions_responses
    ):
        action = bill_actions[index]

        if not disable_subscription_response["status"]:
            action_ids_to_be_ignored.append(action.id)

    return action_ids_to_be_ignored
