import os
from dotenv import load_dotenv
load_dotenv()

ENCRYPTION_KEY_MULTIPLICATIVE_KEY = os.environ.get("ENCRYPTION_KEY_MULTIPLICATIVE_KEY")
ENCRYPTION_KEY_ADDITIVE_KEY = os.environ.get("ENCRYPTION_KEY_ADDITIVE_KEY")

def gcd(a, b):
    while b:
        a, b = b, a % b
    return a

def mod_inverse(a, m):
    m0, x0, x1 = m, 0, 1

    while a > 1:
        q = a // m
        m, a = a % m, m
        x0, x1 = x1 - q * x0, x0

    return x1 % m0 if a == 1 else None


def affine_encrypt(text, a, b):
    encrypted_text = ""
    for char in text:
        if char.isalpha():
            is_upper = char.isupper()
            char = char.lower()
            char_num = ord(char) - ord('a')
            encrypted_char_num = (a * char_num + b) % 26
            encrypted_char = chr(encrypted_char_num + ord('a'))
            if is_upper:
                encrypted_char = encrypted_char.upper()
            encrypted_text += encrypted_char
        else:
            encrypted_text += char
    return encrypted_text


def affine_decrypt(text, a, b):
    decrypted_text = ""
    a_inverse = mod_inverse(a, 26)
    if a_inverse is not None:
        for char in text:
            if char.isalpha():
                is_upper = char.isupper()
                char = char.lower()
                char_num = ord(char) - ord('a')
                decrypted_char_num = (a_inverse * (char_num - b)) % 26
                decrypted_char = chr(decrypted_char_num + ord('a'))
                if is_upper:
                    decrypted_char = decrypted_char.upper()
                decrypted_text += decrypted_char
            else:
                decrypted_text += char
    return decrypted_text


def encrypt_messages(messages):
    for message in messages:
        message["message"] = affine_encrypt(message["message"], int(ENCRYPTION_KEY_ADDITIVE_KEY), int(ENCRYPTION_KEY_MULTIPLICATIVE_KEY))
    return messages