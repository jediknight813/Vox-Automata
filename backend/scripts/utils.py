import os
from cryptography.fernet import Fernet
from dotenv import load_dotenv
load_dotenv()
from Crypto.Random import get_random_bytes
from base64 import b64encode, b64decode
from Crypto.Cipher import AES


MESSAGE_ENCRYPTION_KEY = os.environ.get("MESSAGE_ENCRYPTION_KEY")
key_bytes = bytes.fromhex(MESSAGE_ENCRYPTION_KEY)


def encrypt_message(plain_text):
    cipher = AES.new(key_bytes, AES.MODE_EAX)
    nonce = cipher.nonce
    ciphertext, tag = cipher.encrypt_and_digest(plain_text.encode('utf-8'))
    return b64encode(nonce + ciphertext + tag).decode('utf-8')

def decrypt_message(ciphertext):

    print(ciphertext)

    ciphertext = b64decode(ciphertext.encode('utf-8'))
    nonce = ciphertext[:16]
    tag = ciphertext[-16:]
    ciphertext = ciphertext[16:-16]
    cipher = AES.new(key_bytes, AES.MODE_EAX, nonce=nonce)
    decrypted_text = cipher.decrypt_and_verify(ciphertext, tag)
    print(decrypted_text.decode('utf-8'))
    return decrypted_text.decode('utf-8')

