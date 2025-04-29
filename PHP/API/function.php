<?php

require __DIR__ . '/../INC/dbcon.php';


function error422($message)
{
    $data = [
        'status' => 422,
        'message' => $message,
    ];
    header("HTTP/1.0 422 Unprocessable Entity");
    echo json_encode($data);
    exit();
}

function register($userInput)
{
    global $con;

    if (isset($userInput['email']) && isset($userInput['password'])) {
        $user_id = 'USER - ' . date('Y-d') . substr(uniqid(), -5);
        $email = $userInput['email'];
        $password = $userInput['password'];
        $fullname = $userInput['fullname'];
        $address = $userInput['address'];
        $contact = $userInput['contact'];
        $username = $userInput['username'];




        if (empty(trim($email))) {
            return error422('Email is required');
        } else if (empty(trim($password))) {
            return error422('Password is required');
        } else if (empty(trim($fullname))) {
            return error422('Username is required');
        } else if (empty(trim($address))) {
            return error422('First name is required');
        } else if (empty(trim($contact))) {
            return error422('Last name is required');
        } else {
            mysqli_begin_transaction($con);
            $verification_code = substr(number_format(time() * rand(), 0, '', ''), 0, 6);
            $verification_expiry = time() + 600;

            $query = "INSERT INTO users_tbl (user_id, username, password, full_name, address, contact_no, email_address, role, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 'buyer', NOW())";
            $stmt = $con->prepare($query);
            $stmt->bind_param('sssssss', $user_id, $username, $password, $fullname, $address, $contact, $email);
            $result = $stmt->execute();
            $stmt->close();

            if ($result) {

                mysqli_commit($con);
                return json_encode([
                    'status' => 200,
                    'message' => 'User registered successfully. Please check your email for verification code.'
                ]);
            } else {
                mysqli_rollback($con);
                $data = [
                    'status' => 422,
                    'message' => 'Unprocessable entity',
                ];
                header("HTTP/1.0 422 Unprocessable Entity");
                return json_encode($data);
            }
        }
    } else {
        return error422('Email and Password are required');
    }
}

function login($userInput)
{
    global $con;

    if (isset($userInput['email']) && isset($userInput['password'])) {
        $email = mysqli_real_escape_string($con, $userInput['email']);
        $password = mysqli_real_escape_string($con, $userInput['password']);

        if (empty(trim($email))) {
            return error422('Email is required');
        } else if (empty(trim($password))) {
            return error422('Password is required');
        } else {

            $query = "SELECT * FROM users_tbl WHERE email_address = ? LIMIT 1";
            $stmt = $con->prepare($query);
            $stmt->bind_param('s', $email);
            $stmt->execute();
            $result = $stmt->get_result();
            $stmt->close();

            if ($result->num_rows == 1) {
                $user = $result->fetch_assoc();
                // Verify password
                if ($password === $user['password']) {
                    // Password matches, login successful
                    // You might want to return user data or generate a session/token here
                    return json_encode([
                        'status' => 200,
                        'message' => 'Login successful.',
                        'user_id' => $user['user_id'], // Example: return user ID
                        'role' => $user['role'] // Example: return user role
                    ]);
                } else {
                    // Password does not match
                    $data = [
                        'status' => 401,
                        'message' => 'Invalid email or password.',
                    ];
                    header("HTTP/1.0 401 Unauthorized");
                    return json_encode($data);
                }
            } else {
                // User not found
                $data = [
                    'status' => 404,
                    'message' => 'User not found.',
                ];
                header("HTTP/1.0 404 Not Found");
                return json_encode($data);
            }
        }
    } else {
        return error422('Email and Password are required');
    }
}

function addProduct($productInput)
{
    global $con;

    if (
        isset($productInput['product_name']) &&
        isset($productInput['category_id']) &&
        isset($productInput['price'])
    ) {
        $product_id = 'PROD-' . date('Ymd') . substr(uniqid(), -5);
        $product_name = trim($productInput['product_name']);
        $category_id = (int)$productInput['category_id'];
        $price = (int)$productInput['price'];

        // Validation
        if (empty($product_name)) {
            return error422('Product name is required');
        } else if ($category_id < 1 || $category_id > 10) {
            return error422('Category ID must be between 1 and 10');
        } else if ($price <= 0) {
            return error422('Price must be a positive number');
        } else {
            // Start transaction
            mysqli_begin_transaction($con);

            $query = "INSERT INTO products_tbl (product_id, product_name, category_id, price)
                      VALUES (?, ?, ?, ?)";
            $stmt = $con->prepare($query);
            $stmt->bind_param('ssii', $product_id, $product_name, $category_id, $price);
            $result = $stmt->execute();
            $stmt->close();

            if ($result) {
                mysqli_commit($con);
                return json_encode([
                    'status' => 200,
                    'message' => 'Product added successfully.',
                ]);
            } else {
                mysqli_rollback($con);
                return json_encode([
                    'status' => 422,
                    'message' => 'Unprocessable entity. Failed to insert product.',
                ]);
            }
        }
    } else {
        return error422('Product name, category ID, and price are required');
    }
}

function readProducts()
{
    global $con;

    $query = "SELECT * FROM products_tbl";
    $result = mysqli_query($con, $query);

    if (!$result) {
        return json_encode([
            'status' => 500,
            'message' => 'Failed to fetch products',
        ]);
    }

    if (mysqli_num_rows($result) > 0) {
        $products = [];

        while ($row = mysqli_fetch_assoc($result)) {
            $products[] = $row;
        }

        return json_encode([
            'status' => 200,
            'message' => 'Products retrieved successfully',
            'data' => $products,
        ]);
    } else {
        return json_encode([
            'status' => 404,
            'message' => 'No products found',
            'data' => [],
        ]);
    }
}
