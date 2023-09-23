# from bills.utils.fees import calculate_all_transaction_fees

# print(calculate_all_transaction_fees(500))


from core.utils.currency import add_commas_to_amount

print(add_commas_to_amount(value="24000.2839827", decimal_places=2))
