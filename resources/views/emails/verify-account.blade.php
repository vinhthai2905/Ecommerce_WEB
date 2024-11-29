<!DOCTYPE html>
<html>
<head>
    <title>Account Verification</title>
</head>
<body>
    <h3>Hi {{$account->name}},</h3>
     
    <hr>

    <p>Thank you for registering with our online store. To complete your registration and verify your email address, please click the link below:</p>

    <p>
        <a href="{{ route('account.verify', $account->email) }}">Click here to verify your account</a>
    </p>

    <p>If you did not request this email, please ignore it. We apologize for any inconvenience.</p>

    <p>Thank you for using our online store.</p>

    <p>This email has been automatically sent because you have registered an account with us.</p>

    <p>For inquiries regarding our products and services, please visit our Support Center.</p>

    <p>
        <a href="https://support.yourstore.com">Support Center</a>
    </p>

    <hr>

    <p>Best regards,<br>Bemet Store Team</p>


</body>
</html>