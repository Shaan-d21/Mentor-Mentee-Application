from passlib.context import CryptContext
bcrypt_context = CryptContext(schemes=['bcrypt'],deprecated = 'auto')
print('Password: ',bcrypt_context.hash('a1'))