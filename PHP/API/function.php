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

            $query = "INSERT INTO users_tbl (username, password, full_name, address, contact_no, email_address, role, created_at) VALUES (?, ?, ?, ?, ?, ?, 'buyer', NOW())";
            $stmt = $con->prepare($query);
            $stmt->bind_param('ssssss',  $username, $password, $fullname, $address, $contact, $email);
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

            $query = "INSERT INTO products_tbl (product_name, category_id, price)
                      VALUES (?, ?, ?)";
            $stmt = $con->prepare($query);
            $stmt->bind_param('sii',  $product_name, $category_id, $price);
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

function addToStock($userInput)
{
    global $con;

    // Check if we have valid input
    if (!isset($userInput['product_id']) || !isset($userInput['quantity'])) {
        return error422('Product ID and quantity are required');
    }

    $product_id = $userInput['product_id'];
    $quantity = (int)$userInput['quantity'];

    // Validation
    if ($quantity <= 0) {
        return error422('Quantity must be a positive number');
    }

    // Check if product exists
    $checkProductQuery = "SELECT * FROM products_tbl WHERE product_id = ?";
    $stmt = $con->prepare($checkProductQuery);
    $stmt->bind_param('s', $product_id);
    $stmt->execute();
    $productResult = $stmt->get_result();
    $stmt->close();

    if ($productResult->num_rows == 0) {
        return error422('Product does not exist');
    }

    // Begin transaction
    mysqli_begin_transaction($con);

    // Check if stock entry exists
    $checkStockQuery = "SELECT * FROM stock_tbl WHERE product_id = ?";
    $stmt = $con->prepare($checkStockQuery);
    $stmt->bind_param('s', $product_id);
    $stmt->execute();
    $stockResult = $stmt->get_result();
    $stmt->close();

    if ($stockResult->num_rows > 0) {
        // Update existing stock
        $stockData = $stockResult->fetch_assoc();
        $newQty = $stockData['qty'] + $quantity;
        $newTotalStock = $stockData['total_stock'] + $quantity;

        $updateQuery = "UPDATE stock_tbl SET qty = ?, total_stock = ? WHERE product_id = ?";
        $stmt = $con->prepare($updateQuery);
        $stmt->bind_param('iis', $newQty, $newTotalStock, $product_id);
        $result = $stmt->execute();
        $stmt->close();
    } else {
        // Create new stock entry
        $insertQuery = "INSERT INTO stock_tbl (product_id, qty, total_stock) VALUES (?, ?, ?)";
        $stmt = $con->prepare($insertQuery);
        $stmt->bind_param('sii', $product_id, $quantity, $quantity);
        $result = $stmt->execute();
        $stmt->close();
    }

    if ($result) {
        mysqli_commit($con);
        return json_encode([
            'status' => 200,
            'message' => 'Stock updated successfully'
        ]);
    } else {
        mysqli_rollback($con);
        return json_encode([
            'status' => 500,
            'message' => 'Failed to update stock'
        ]);
    }
}


function readUserCart($userInput)
{
    global $con;

    if (!isset($userInput['user_id'])) {
        return error422('User ID is required');
    }

    $user_id = $userInput['user_id'];

    // The product_name is already selected here as p.product_name
    $query = "SELECT c.cart_id, c.user_id, c.product_id, p.product_name, p.price, c.created_at
              FROM cart_tbl c
              JOIN products_tbl p ON c.product_id = p.product_id
              WHERE c.user_id = ?
              ORDER BY c.created_at DESC";

    $stmt = $con->prepare($query);
    $stmt->bind_param('s', $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();

    if ($result) {
        $cartItems = [];

        while ($row = mysqli_fetch_assoc($result)) {
            $cartItems[] = $row;
        }

        return json_encode([
            'status' => 200,
            'message' => 'Cart items retrieved successfully',
            'data' => $cartItems,
        ]);
    } else {
        return json_encode([
            'status' => 500,
            'message' => 'Failed to fetch cart items',
        ]);
    }
}

function addToCart($userInput)
{
    global $con;

    // Check if we have valid input
    if (!isset($userInput['user_id']) || !isset($userInput['product_id']) || !isset($userInput['qty'])) {
        return error422('User ID, Product ID, and Quantity are required');
    }

    $user_id = $userInput['user_id'];
    $product_id = $userInput['product_id'];
    $qty = (int)$userInput['qty'];

    // Validation
    if ($qty <= 0) {
        return error422('Quantity must be a positive number');
    }

    // Check if user exists
    $checkUserQuery = "SELECT * FROM users_tbl WHERE user_id = ?";
    $stmt = $con->prepare($checkUserQuery);
    $stmt->bind_param('s', $user_id);
    $stmt->execute();
    $userResult = $stmt->get_result();
    $stmt->close();

    if ($userResult->num_rows == 0) {
        return error422('User does not exist');
    }

    // Check if product exists and get stock info
    $checkProductQuery = "SELECT p.*, s.qty as stock_qty FROM products_tbl p 
                         LEFT JOIN stock_tbl s ON p.product_id = s.product_id 
                         WHERE p.product_id = ?";
    $stmt = $con->prepare($checkProductQuery);
    $stmt->bind_param('s', $product_id);
    $stmt->execute();
    $productResult = $stmt->get_result();
    $stmt->close();

    if ($productResult->num_rows == 0) {
        return error422('Product does not exist');
    }

    $product = $productResult->fetch_assoc();
    if (!isset($product['stock_qty']) || $product['stock_qty'] < $qty) {
        return error422('Not enough stock available');
    }

    // Begin transaction
    mysqli_begin_transaction($con);


    // Insert into cart table
    $insertQuery = "INSERT INTO cart_tbl (user_id, product_id, qty, created_at) VALUES (?, ?, ?, NOW())";
    $stmt = $con->prepare($insertQuery);
    $stmt->bind_param('ssi',  $user_id, $product_id, $qty);
    $result = $stmt->execute();
    $stmt->close();

    if ($result) {
        mysqli_commit($con);
        return json_encode([
            'status' => 200,
            'message' => 'Item added to cart successfully'
        ]);
    } else {
        mysqli_rollback($con);
        return json_encode([
            'status' => 500,
            'message' => 'Failed to add item to cart'
        ]);
    }
}

function readCategories()
{
    global $con;

    $query = "SELECT * FROM category_tbl";
    $result = mysqli_query($con, $query);

    if (!$result) {
        return json_encode([
            'status' => 500,
            'message' => 'Failed to fetch categories',
        ]);
    }

    if (mysqli_num_rows($result) > 0) {
        $categories = [];

        while ($row = mysqli_fetch_assoc($result)) {
            $categories[] = $row;
        }

        return json_encode([
            'status' => 200,
            'message' => 'Categories retrieved successfully',
            'data' => $categories,
        ]);
    } else {
        return json_encode([
            'status' => 404,
            'message' => 'No categories found',
            'data' => [],
        ]);
    }
}

function checkoutCart($userInput)
{
    global $con;

    if (!isset($userInput['user_id'])) {
        return error422('User ID is required');
    }

    $user_id = $userInput['user_id'];

    // Begin transaction
    mysqli_begin_transaction($con);

    try {
        // Get all items in the user's cart and sum the quantities for each product
        $cartQuery = "SELECT product_id, SUM(qty) as total_qty FROM cart_tbl WHERE user_id = ? GROUP BY product_id";
        $stmt = $con->prepare($cartQuery);
        $stmt->bind_param('s', $user_id);
        $stmt->execute();
        $cartResult = $stmt->get_result();
        $stmt->close();

        if (mysqli_num_rows($cartResult) == 0) {
            return json_encode([
                'status' => 404,
                'message' => 'Cart is empty'
            ]);
        }

        $cartItems = [];
        while ($row = mysqli_fetch_assoc($cartResult)) {
            $cartItems[] = $row;
        }

        // Check stock availability for all items
        foreach ($cartItems as $item) {
            $product_id = $item['product_id'];
            $quantity = $item['total_qty'];

            // Check stock availability
            $stockQuery = "SELECT qty FROM stock_tbl WHERE product_id = ?";
            $stmt = $con->prepare($stockQuery);
            $stmt->bind_param('s', $product_id);
            $stmt->execute();
            $stockResult = $stmt->get_result();
            $stmt->close();

            if (mysqli_num_rows($stockResult) == 0) {
                mysqli_rollback($con);
                return json_encode([
                    'status' => 400,
                    'message' => "Product ID $product_id is not in stock"
                ]);
            }

            $stockData = mysqli_fetch_assoc($stockResult);
            if ($stockData['qty'] < $quantity) {
                mysqli_rollback($con);
                return json_encode([
                    'status' => 400,
                    'message' => "Not enough stock available for product ID $product_id"
                ]);
            }
        }

        // Update stock for each product
        foreach ($cartItems as $item) {
            $product_id = $item['product_id'];
            $quantity = $item['total_qty'];

            // Update stock
            $updateStockQuery = "UPDATE stock_tbl SET qty = qty - ? WHERE product_id = ?";
            $stmt = $con->prepare($updateStockQuery);
            $stmt->bind_param('is', $quantity, $product_id);
            $stmt->execute();
            $stmt->close();
        }

        // Remove items from cart
        $deleteCartQuery = "DELETE FROM cart_tbl WHERE user_id = ?";
        $stmt = $con->prepare($deleteCartQuery);
        $stmt->bind_param('s', $user_id);
        $stmt->execute();
        $stmt->close();

        // Commit transaction
        mysqli_commit($con);

        return json_encode([
            'status' => 200,
            'message' => 'Checkout successful'
        ]);
    } catch (Exception $e) {
        mysqli_rollback($con);
        return json_encode([
            'status' => 500,
            'message' => 'Checkout failed: ' . $e->getMessage()
        ]);
    }
}
function ApplySeller($applicationInput)
{
    global $con;

    // Check if user_id is provided
    if (!isset($applicationInput['user_id'])) {
        return error422('User ID is required');
    }

    $user_id = $applicationInput['user_id'];

    // Check if the user exists
    $checkUserQuery = "SELECT * FROM users_tbl WHERE user_id = ?";
    $stmt = $con->prepare($checkUserQuery);
    $stmt->bind_param('s', $user_id);
    $stmt->execute();
    $userResult = $stmt->get_result();
    $stmt->close();

    if ($userResult->num_rows == 0) {
        return error422('User does not exist');
    }

    // Check if all required fields are provided
    if (
        !isset($applicationInput['barangay_clearance']) ||
        !isset($applicationInput['valid_id']) ||
        !isset($applicationInput['business_permit']) ||
        !isset($applicationInput['mayor_permit'])
    ) {
        return error422('All documents are required');
    }

    $barangay_clearance = $applicationInput['barangay_clearance'];
    $valid_id = $applicationInput['valid_id'];
    $business_permit = $applicationInput['business_permit'];
    $mayor_permit = $applicationInput['mayor_permit'];

    // Validate that all fields have content
    if (
        empty(trim($barangay_clearance)) ||
        empty(trim($valid_id)) ||
        empty(trim($business_permit)) ||
        empty(trim($mayor_permit))
    ) {
        return error422('All documents must have content');
    }

    // Begin transaction
    mysqli_begin_transaction($con);

    try {
        // Insert into application_tbl
        $insertQuery = "INSERT INTO application_tbl (user_id, barangay_clearance, valid_id, business_permit, mayor_permit, applied_at) 
                        VALUES (?, ?, ?, ?, ?, NOW())";
        $stmt = $con->prepare($insertQuery);
        $stmt->bind_param('sssss', $user_id, $barangay_clearance, $valid_id, $business_permit, $mayor_permit);
        $insertResult = $stmt->execute();
        $stmt->close();

        if (!$insertResult) {
            throw new Exception("Failed to insert application");
        }

        // Update user role from buyer to seller
        $updateQuery = "UPDATE users_tbl SET role = 'seller' WHERE user_id = ? AND role = 'buyer'";
        $stmt = $con->prepare($updateQuery);
        $stmt->bind_param('s', $user_id);
        $updateResult = $stmt->execute();
        $stmt->close();

        // Commit transaction
        mysqli_commit($con);

        return json_encode([
            'status' => 200,
            'message' => 'Seller application submitted successfully'
        ]);
    } catch (Exception $e) {
        // Rollback transaction on error
        mysqli_rollback($con);
        return json_encode([
            'status' => 500,
            'message' => 'Failed to submit application'
        ]);
    }
}
