#!env/bin/python

# import os
# import unittest

from werkzeug.security import check_password_hash, generate_password_hash

# my_pass = generate_password_hash('lolololol')
my_pass = 'pbkdf2:sha1:1000$0w4nW3E9$28451259d2dcfacca8ba9b8edc65cb0dd864bf8e'

print check_password_hash(my_pass, 'lolololol')
