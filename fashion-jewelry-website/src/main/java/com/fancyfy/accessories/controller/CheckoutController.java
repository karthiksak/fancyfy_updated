package com.fancyfy.accessories.controller;

import com.fancyfy.accessories.model.Order;
import com.fancyfy.accessories.dao.OrderDao;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(urlPatterns = { "/checkoutt" })
public class CheckoutController extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private OrderDao orderDao;

	public void init() {
		orderDao = new OrderDao();
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String fullName = request.getParameter("fullName");
		String email = request.getParameter("email");
		String address = request.getParameter("address");
		String paymentDetails = request.getParameter("paymentDetails");

		Order order = new Order(fullName, email, address, paymentDetails);
		orderDao.insertOrder(order);

		response.sendRedirect("thank-you.jsp");
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doPost(request, response);
	}
}