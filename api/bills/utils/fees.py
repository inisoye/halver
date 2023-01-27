from decimal import Decimal
from typing import TypedDict, Union


def calculate_paystack_transaction_fee(
    price: Union[int, Decimal],
    decimal_fee=Decimal("0.015"),
    flat_fee=100,
    fee_cap=2000,
) -> Decimal:
    """
    Calculate the final amount for Paystack's transaction fee
    based on the given price, decimal fee, flat fee, and fee cap.

    Calculation and variable names culled from Paystack's guidelines:
    1.https://support.paystack.com/hc/en-us/articles/360009973579-Can-I-pass-the-transaction-charges-to-my-customers-
    2.https://paystack.com/pricing

    Parameters:
        price (Decimal): The price.
        decimal_fee (Decimal): The decimal fee.
        flat_fee (Decimal): The flat fee.
        fee_cap (Decimal): The fee cap.

    Returns:
        final fee: The difference between the (inclusive) final amount
        and the original price.
    """

    FLAT_FEE_WAIVER_BARRIER = 2500

    if price >= FLAT_FEE_WAIVER_BARRIER:
        applicable_fees = (decimal_fee * price) + flat_fee

        if applicable_fees > fee_cap:
            final_amount = price + fee_cap
        else:
            final_amount = ((price + flat_fee) / (1 - decimal_fee)) + Decimal("0.01")

    else:
        applicable_fees = decimal_fee * price

        if applicable_fees > fee_cap:
            final_amount = price + fee_cap
        else:
            final_amount = (price / (1 - decimal_fee)) + Decimal("0.01")

    return final_amount - price


def calculate_paystack_transfer_fee(transfer_amount: Union[int, Decimal]) -> Decimal:
    """
    Calculate the transfer fee based on the given transfer amount.

    Calculation and variable names culled from Paystack's guidelines:
    1.https://support.paystack.com/hc/en-us/articles/360012276559-Transfers
    2.https://paystack.com/pricing

    Parameters:
        transfer_amount (Decimal): The transfer amount.

    Returns:
        Decimal: The transfer fee.
    """
    if transfer_amount <= 5000:
        transfer_fee = 10
    elif transfer_amount <= 50000:
        transfer_fee = 25
    else:
        transfer_fee = 50

    return Decimal(transfer_fee)


class AllTransactionFees(TypedDict):
    paystack_transaction_fee: Decimal
    paystack_transfer_fee: Decimal
    halver_fee: Decimal
    total_fee: Decimal


def calculate_all_transaction_fees(amount: Union[int, Decimal]):
    """
    Calculate the Halver transaction fee in addition to the Paystack fees.

    The Halver fee is equivalent to the total amount sent to Paystack.
    As a result, the total fee is double whatever is remitted to Paystack.

    Parameters:
        amount (Decimal): The original transaction amount.

    Returns:
        dict[str, Decimal]: Paystack and Halver fees in a dictionary.
    """

    paystack_transaction_fee = calculate_paystack_transaction_fee(amount)
    paystack_transfer_fee = calculate_paystack_transfer_fee(amount)
    total_paystack_fee = paystack_transaction_fee + paystack_transfer_fee

    halver_fee = total_paystack_fee

    total_fee = total_paystack_fee + halver_fee

    card_addition_refund = Decimal(amount) - total_fee

    all_transaction_fees = {
        "paystack_transaction_fee": paystack_transaction_fee,
        "paystack_transfer_fee": paystack_transfer_fee,
        "halver_fee": halver_fee,
        "total_fee": total_fee,
        "card_addition_refund": card_addition_refund,
    }

    return all_transaction_fees
