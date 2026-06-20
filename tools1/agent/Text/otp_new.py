import string
import random
import json


def is_consecutive(digit1, digit2):
    """Check if two digits are consecutive."""
    return abs(int(digit1) - int(digit2)) == 1


def is_date(otp):
    """Check if the OTP represents a valid date (MMDD or DDMM)."""
    if len(otp) != 4:
        return False
    month, day = int(otp[:2]), int(otp[2:])

    if month < 1 or month > 12 or day < 1 or day > 31:
        return False
    if month in {4, 6, 9, 11} and day == 31:
        return False  # April, June, September, November have 30 days
    if month == 2:
        if day > 29:
            return False  # February has at most 29 days
        if day == 29 and not is_leap_year(2024):  # Check for leap year
            return False  # February has 28 days in non-leap years
    return True


def is_leap_year(year):
    """Check if a year is a leap year."""
    return (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)


def load_config(filename='../Config/otp_config.json'):
    """Load list from a JSON file."""
    with open(filename, 'r') as file:
        config = json.load(file)
    white = set(config.get('whitelist', []))  # Convert to set for faster lookup
    black = set(config.get('blacklist', []))  # Convert to set for faster lookup
    return white, black


def generate_blacklist():
    """Generate a dynamic blacklist including all dates, years, and patterns."""
    blacklist = set()

    # Add all valid dates (MMDD and DDMM)
    for month in range(1, 13):
        for day in range(1, 32):
            if is_date(f"{month:02}{day:02}"):
                blacklist.add(f"{month:02}{day:02}")
                blacklist.add(f"{day:02}{month:02}")

    # Add all years (e.g., 1900 to 2100)
    blacklist.update(str(year) for year in range(1900, 2101))

    # Add sequences of consecutive digits
    for i in range(8):  # 0-7 for three consecutive digits
        blacklist.add(f"{i}{i+1}{i+2}")
        blacklist.add(f"{i+2}{i+1}{i}")

    # Add odd and even sequences
    blacklist.add('13579')  # Odd sequence
    blacklist.add('02468')  # Even sequence

    # Add custom patterns
    patterns = ['pattern1', 'pattern2']
    blacklist.update(patterns)

    return list(blacklist)


def generate_otp(length=6, whitelist=None, blacklist=None):
    """Generates a strong, One-Time Password (OTP) based on specified length, whitelist, and blacklist."""
    if not (1 <= length <= 10):
        raise ValueError("Length must be between 1 and 10.")

    # Create a list of available digits based on whitelist and blacklist
    digits = [d for d in string.digits if (whitelist is None or d in whitelist) and (blacklist is None or d not in blacklist)]

    if len(digits) < length:
        raise ValueError(f"Not enough unique digits available after applying whitelist and blacklist. Available: {len(digits)}, Required: {length}")

    otp = ''
    available_digits = digits.copy()  # Create a copy to modify

    while len(otp) < length:
        digit = random.choice(available_digits)

        # Check if the last digit in OTP is the same as the current digit
        if otp and digit == otp[-1]:
            continue  # Skip if the same digit is consecutive

        # Check if the digit is consecutive with the last digit
        if otp and is_consecutive(digit, otp[-1]):
            continue  # Skip consecutive digits

        otp += digit
        available_digits.remove(digit)  # Remove from available digits to ensure uniqueness

    if is_date(otp):
        raise ValueError("Generated OTP cannot represent a date.")

    return otp


def otp():
    try:
        # Load whitelist and blacklist from JSON
        whitelist, blacklist = load_config()

        # Generate a dynamic blacklist
        dynamic_blacklist = generate_blacklist()

        # Combine the static and dynamic blacklists
        combined_blacklist = blacklist.union(set(dynamic_blacklist))

        # User input for OTP length
        otp_length_input = input("Enter the desired OTP length: ")

        # Validate user input for OTP length
        if not otp_length_input.isdigit():
            raise ValueError("OTP length must be a positive integer.")

        otp_length = int(otp_length_input)

        # Generate the OTP in desired length with whitelist and combined blacklist
        otp = generate_otp(otp_length, whitelist, combined_blacklist)
        print("Your OTP is:", otp)

    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    otp()