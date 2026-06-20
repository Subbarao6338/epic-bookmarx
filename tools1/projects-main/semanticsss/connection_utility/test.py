"""COPYRIGHT NOTICE
=============================================================================
© Copyright HCL Technologies Ltd. 2021, 2022
Proprietary and confidential. All information contained herein is, and
remains the property of HCL Technologies Limited. Copying or reproducing the
contents of this file, via any medium is strictly prohibited unless prior
written permission is obtained from HCL Technologies Limited.
"""
# install required library and mention in requirements.txt
import base64
from base64 import b64encode
from typing import Tuple
import os
import hashlib
import hmac


def hash_new_password(password: str) -> Tuple[bytes, bytes]:
    """
    Hash the provided password with a randomly-generated salt and return the
    salt and hash to store in the database.
    """
    salt = os.urandom(16)
    pw_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000)
    return salt, pw_hash


def is_correct_password(salt: bytes, pw_hash: bytes, password: str) -> bool:
    """
    Given a previously-stored salt and hash, and a password provided by a user
    trying to log in, check whether the password is correct.
    """
    return hmac.compare_digest(
        pw_hash,
        hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000)
    )


# Example usage:
salt, pw_hash = hash_new_password('admin@123')
str_salt = b64encode(salt).decode("utf-8")
str_pw_hash = b64encode(pw_hash).decode("utf-8")
print(str_salt)
print(str_pw_hash)

# Store both in db salt and password

# Check if it is working from below code
str_salt_bytes = str_salt.encode('utf-8')
use_salt = base64.b64decode(str_salt_bytes)

str_password_bytes = str_pw_hash.encode('utf-8')
use_password = base64.b64decode(str_password_bytes)
print(salt, use_salt)
print(pw_hash, use_password)
print(is_correct_password(use_salt, use_password, 'Tr0ub4dor&3'))
print(is_correct_password(use_salt, use_password, 'rosebud'))
print(is_correct_password(use_salt, use_password, 'admin@123'))
