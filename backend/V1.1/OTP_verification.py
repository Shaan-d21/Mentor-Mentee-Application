import random
import smtplib
from email.message import EmailMessage

otp = ""
for i in range(6):
    otp += str(random.randint(0,9))

server = smtplib.SMTP('smtp.gmail.com', 587)
server.starttls()

from_mail = 'test@gmail.com'
server.login(from_mail, 'qmqu hydq chld mkog')
to_mail = input("Enter your email: ")

msg = EmailMessage()
msg['Subject'] = "OTP Verification"
msg['From'] = from_mail
msg['To'] = to_mail
msg.set_content("Your OTP is: " +otp)

server.send_message(msg)

input_otp = input("Enter OTP: ")
if input_otp == otp:
    print("OTP Verified")
else:
    print("Invalid OTP")

print("Email sent")