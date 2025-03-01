<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
    <title>Cart - Fancyfy Accessories</title>
    
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">

    <!-- Custom Styles -->
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/styles.css">
    
    <style>
        body {
            background: #121212;
            font-family: 'Roboto', sans-serif;
            color: #e0e0e0;
        }
        .header {
            background: #1f1f1f;
            color: #ffd700;
            padding: 20px;
            text-align: center;
            position: relative;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5rem;
        }
        .container {
            margin-top: 40px;
        }
        .card {
            background: #1f1f1f;
            color: #e0e0e0;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
            transition: transform 0.3s ease;
        }
        .card:hover {
            transform: scale(1.05);
        }
        .card-title {
            color: #ffd700;
        }
        footer {
            background: #1f1f1f;
            color: #e0e0e0;
            text-align: center;
            padding: 10px 0;
            position: fixed;
            width: 100%;
            bottom: 0;
            left: 0;
        }
        .btn-primary {
            background-color: #ffd700;
            border: none;
        }
        .btn-primary:hover {
            background-color: #e6c200;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Shopping Cart</h1>
    </div>

    <div class="container mt-4">
        <h2 class="text-center">Your Cart</h2>
        <div class="row justify-content-center">
            <div class="col-md-8">
                <c:if test="${not empty cart.items}">
                    <c:forEach var="entry" items="${cart.items}">
                        <div class="card mb-4">
                            <div class="card-body">
                                <h5 class="card-title">${entry.key.name}</h5>
                                <p class="card-text">${entry.key.description}</p>
                                <p><strong>Quantity:</strong> ${entry.value}</p>
                                <p><strong>Price:</strong> ₹${entry.key.price}</p>
                                <p><strong>Total:</strong> ₹${entry.key.price * entry.value}</p>
                            </div>
                        </div>
                    </c:forEach>
                    <div class="card mt-3">
                        <div class="card-body">
                            <h5 class="card-title">Total Amount</h5>
                            <p class="card-text"><strong>₹${cart.totalAmount}</strong></p>
                            <h5 class="card-title">Shipping Charge</h5>
                            <p class="card-text"><strong>₹${cart.shippingCharge}</strong></p>
                            <h5 class="card-title">Final Amount</h5>
                            <p class="card-text"><strong>₹${cart.finalAmount}</strong></p>
                        </div>
                    </div>
                    <div class="text-center mt-4">
                        <form action="${pageContext.request.contextPath}/checkout" method="post">
                            <button type="submit" class="btn btn-primary">Proceed to Checkout</button>
                        </form>
                    </div>
                </c:if>
                <c:if test="${empty cart.items}">
                    <p class="text-center">Your cart is empty.</p>
                </c:if>
            </div>
        </div>
    </div>
<br></br>
<br></br>
<br></br>
<br></br>
<br></br>
    <footer>
        <p>&copy; 2025 Fancyfy Accessories. All rights reserved.</p>
    </footer>

    <!-- Bootstrap Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>