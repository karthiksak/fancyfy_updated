package com.fancyfy.accessories.controller;

import com.fancyfy.accessories.dao.ProductDao;
import com.fancyfy.accessories.model.Cart;
import com.fancyfy.accessories.model.Product;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.servlet.http.Part;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@WebServlet(urlPatterns = { "/products", "/product-detail", "/product-form", "/index", "/add-product",
        "/manage-products", "/delete-product", "/update-quantity", "/add-to-cart", "/view-cart", "/checkout",
        "/place-order","/order-confirmation", "/clear-cart" })
@MultipartConfig(fileSizeThreshold = 1024 * 1024 * 2, // 2MB
		maxFileSize = 1024 * 1024 * 10, // 10MB
		maxRequestSize = 1024 * 1024 * 50) // 50MB
public class ProductController extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private ProductDao productDao;

	public void init() {
		productDao = new ProductDao();
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String action = request.getServletPath();

		switch (action) {
		case "/product-detail":
			showProductDetail(request, response);
			break;
		case "/index":
			index(request, response);
			break;
		case "/product-form":
			showProductForm(request, response);
			break;
		case "/manage-products":
			manageProducts(request, response);
			break;
		case "/view-cart":
			viewCart(request, response);
			break;
		case "/order-confirmation":
			orderconfirmation(request, response);
			break;
		case "/products":
		default:
			listProducts(request, response);
			break;
		}
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String action = request.getServletPath();

        switch (action) {
            case "/index":
                index(request, response);
                break;
            case "/order-confirmation":
                orderconfirmation(request, response);
                break;
            case "/delete-product":
                deleteProduct(request, response);
                break;
            case "/add-product":
                addProduct(request, response);
                break;
            case "/update-quantity":
                updateQuantity(request, response);
                break;
            case "/add-to-cart":
                addToCart(request, response);
                break;
            case "/checkout":
                checkout(request, response);
                break;
            case "/place-order":
                placeOrder(request, response);
                break;
            case "/clear-cart":
                clearCart(request, response);
                break;
        }
    }

	private void listProducts(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		List<Product> productList = productDao.selectAllProducts();

		for (Product product : productList) {
			product.setPrice(product.getPrice());
		}
		request.setAttribute("productList", productList);
		request.getRequestDispatcher("WEB-INF/jsp/products.jsp").forward(request, response);
	}

	private void index(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.getRequestDispatcher("WEB-INF/jsp/index.jsp").forward(request, response);
	}

	private void showProductDetail(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		int id = Integer.parseInt(request.getParameter("id"));
		Product product = productDao.selectProductById(id);

		product.setPrice(product.getPrice());
		request.setAttribute("product", product);
		request.getRequestDispatcher("WEB-INF/jsp/product-detail.jsp").forward(request, response);
	}

	private void showProductForm(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.getRequestDispatcher("WEB-INF/jsp/product-form.jsp").forward(request, response);
	}

	private void addProduct(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String name = request.getParameter("name");
		String description = request.getParameter("description");
		double price = Double.parseDouble(request.getParameter("price"));
		int quantity = Integer.parseInt(request.getParameter("quantity"));

		// Generate a unique ID using the current year and timestamp in seconds
		long timestamp = System.currentTimeMillis() / 1000; // Convert to seconds
		int year = java.time.Year.now().getValue();
		int iddd = Integer.parseInt((year + String.valueOf(timestamp)).substring(2, 10)); // Shortened for int

		// Handle file uploads
		String appPath = request.getServletContext().getRealPath("");
		String savePath = appPath + File.separator + "uploaded_images";
		File fileSaveDir = new File(savePath);
		if (!fileSaveDir.exists()) {
			fileSaveDir.mkdirs();
		}

		List<String> imageUrls = new ArrayList<>();
		for (Part part : request.getParts()) {
			if (part.getName().equals("images") && part.getSize() > 0) {
				String fileName = extractFileName(part);
				String filePath = savePath + File.separator + fileName;
				part.write(filePath);
				imageUrls.add("uploaded_images" + File.separator + fileName);
			}
		}

		Product newProduct = new Product(iddd, name, description, price, imageUrls, quantity);
		productDao.insertProduct(newProduct);
		response.sendRedirect("manage-products");
	}

	private String extractFileName(Part part) {
		String contentDisp = part.getHeader("content-disposition");
		String[] items = contentDisp.split(";");
		for (String s : items) {
			if (s.trim().startsWith("filename")) {
				return s.substring(s.indexOf("=") + 2, s.length() - 1);
			}
		}
		return "";
	}

	private void manageProducts(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		List<Product> productList = productDao.selectAllProducts();

		for (Product product : productList) {
			product.setPrice(product.getPrice());
		}
		request.setAttribute("productList", productList);
		request.getRequestDispatcher("WEB-INF/jsp/manage-products.jsp").forward(request, response);
	}

	private void deleteProduct(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		int id = Integer.parseInt(request.getParameter("id"));
		productDao.deleteProductById(id);
		response.sendRedirect("manage-products");
	}

	private void updateQuantity(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		int id = Integer.parseInt(request.getParameter("id"));
		int quantity = Integer.parseInt(request.getParameter("quantity"));
		productDao.updateProductQuantity(id, quantity);
		response.sendRedirect("manage-products");
	}

	private void addToCart(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		int productId = Integer.parseInt(request.getParameter("productId"));
		int quantity = Integer.parseInt(request.getParameter("quantity"));

		HttpSession session = request.getSession();
		Cart cart = (Cart) session.getAttribute("cart");
		if (cart == null) {
			cart = new Cart();
			session.setAttribute("cart", cart);
		}

		Product product = productDao.selectProductById(productId);
		cart.addProduct(product, quantity);

        response.sendRedirect("products");
    }

    private void viewCart(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession();
        Cart cart = (Cart) session.getAttribute("cart");
        if (cart == null) {
            cart = new Cart();
            session.setAttribute("cart", cart);
        }
        request.getRequestDispatcher("WEB-INF/jsp/cart.jsp").forward(request, response);
    }

	private void orderconfirmation(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.getRequestDispatcher("WEB-INF/jsp/order-confirmation.jsp").forward(request, response);
	}

    private void checkout(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession();
        Cart cart = (Cart) session.getAttribute("cart");
        if (cart == null) {
            cart = new Cart();
            session.setAttribute("cart", cart);
        }
        request.getRequestDispatcher("WEB-INF/jsp/checkout.jsp").forward(request, response);
    }

    private void placeOrder(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession();
        Cart cart = (Cart) session.getAttribute("cart");
        if (cart != null) {
            // Handle order placement logic (e.g., save order details to the database)
            cart.clear();
        }
        request.getRequestDispatcher("WEB-INF/jsp/order-confirmation.jsp").forward(request, response);
    }

    private void clearCart(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession();
        Cart cart = (Cart) session.getAttribute("cart");
        if (cart != null) {
            cart.clear();
        }
        response.sendRedirect("products");
    }
}