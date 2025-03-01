<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
<title>Checkout - Fancyfy Accessories</title>

<!-- Bootstrap CSS -->
<link rel="stylesheet"
	href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">

<!-- Custom Styles -->
<link rel="stylesheet"
	href="${pageContext.request.contextPath}/css/styles.css">

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
		<h1>Checkout</h1>
	</div>

	<div class="container mt-4">
		<h2 class="text-center">Order Summary</h2>
		<div class="row justify-content-center">
			<div class="col-md-8">
				<%-- <c:forEach var="entry" items="${cart.items}">
					<div class="card mb-4">
						<div class="card-body">
							<h5 class="card-title">${entry.key.name}</h5>
							<p class="card-text">${entry.key.description}</p>
							<p>
								<strong>Quantity:</strong> ${entry.value}
							</p>
							<p>
								<strong>Price:</strong> ₹${entry.key.price}
							</p>
							<p>
								<strong>Total:</strong> ₹${entry.key.price * entry.value}
							</p>
						</div>
					</div>
				</c:forEach> --%>
				<div class="card mt-3">
					<div class="card-body">
						<h5 class="card-title">Total Amount</h5>
						<p class="card-text">
							<strong>₹${cart.totalAmount}</strong>
						</p>
						<h5 class="card-title">Shipping Charge</h5>
						<p class="card-text">
							<strong>₹${cart.shippingCharge}</strong>
						</p>
						<h5 class="card-title">Final Amount</h5>
						<p class="card-text">
							<strong>₹${cart.finalAmount}</strong>
						</p>
					</div>
				</div>

				<div class="container text-center mt-4">
					<h3 class="mb-3">Complete Your Payment</h3>
					<p>Scan this UPI QR code or click the link to pay:</p>

					<!-- UPI Payment Link -->
					<a
						href="upi://pay?pa=yourupi@upi&pn=FancyfyAccessories&mc=0000&tid=1234567890&tr=ORDER_ID&tn=Jewelry%20Purchase&am=${cart.finalAmount}&cu=INR"
						class="btn btn-success mb-3"> Click here to pay with UPI apps
					</a>

					<!-- QR Code Image -->
					<div class="mb-4">
						<img src="${pageContext.request.contextPath}/images/qr.jpg"
							alt="Scan to Pay" width="200" class="img-fluid">
					</div>

					<!-- Payment Confirmation Form -->
					<form action="${pageContext.request.contextPath}/order-confirmation" method="post"
						class="w-50 mx-auto">
						<div class="mb-3">
							<label class="form-label">Order ID:</label> <input type="text"
								name="order_id" class="form-control" required>
						</div>

						<div class="mb-3">
							<label class="form-label">Customer Name:</label> <input
								type="text" name="customer_name" class="form-control" required>
						</div>

						<div class="mb-3">
							<label class="form-label">Phone Number:</label> <input
								type="text" name="phone" class="form-control" required>
						</div>

						<button type="submit" class="btn btn-primary w-100">I
							Have Paid</button>
					</form>
				</div>

			</div>
		</div>
	</div>
	<br></br>
	<br></br>
	<br></br>
	<br></br>
	<footer>
		<p>&copy; 2025 Fancyfy Accessories. All rights reserved.</p>
	</footer>

	<!-- Bootstrap Bundle with Popper -->
	<script
		src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>