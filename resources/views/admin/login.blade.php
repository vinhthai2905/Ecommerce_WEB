<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
</head>

<body>

    <div class="container">

        <div class="col-md-4 col-md-offset-4">
            <div class="panel panel-info">

                <div class="panel-heading">
                    <h3 class="panel-title">Login Form</h3>
                </div>

                <div class="panel-body">
                    <form action="" method="POST" role="form">
                        @csrf

                        <div class="form-group">
                            <label for="">Email</label>
                            <input type="text" class="form-control" name="email" placeholder="Input email">
                            @error('email') <small>{{ $message }}</small> @enderror
                        </div>

                        <div class="form-group">
                            <label for="">Password</label>
                            <input type="password" class="form-control" name="password" placeholder="Input password">
                            @error('password') <small>{{ $message }}</small> @enderror
                        </div>

                        <button type="submit" class="btn btn-sm btn-primary">Log In</button>
                        <a href="{{ route('admin.register')}}">Register</a>
                    </form>
                </div>

            </div>
        </div>

    </div>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
</body>

</html>