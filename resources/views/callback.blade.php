<html>
<head>
    <meta charset="utf-8">
    <title>TSC Shop</title>
    <script>
        var responseData = @json($response);
        window.opener.postMessage({ response: responseData }, "http://localhost:3000/");
        window.close();
    </script>
</head>
<body>
</body>
</html>
