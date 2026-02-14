package com.fancyfy.accessories.dao;

import com.fancyfy.accessories.model.Product;

import java.sql.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class ProductDao {
    private final String jdbcURL = System.getenv().getOrDefault("FANCYFY_DB_URL", "jdbc:oracle:thin:@localhost:1521:orcl");
    private final String jdbcUsername = System.getenv().getOrDefault("FANCYFY_DB_USERNAME", "system");
    private final String jdbcPassword = System.getenv().getOrDefault("FANCYFY_DB_PASSWORD", "password");

    private static final String SELECT_ALL_PRODUCTS = "SELECT * FROM products";
    private static final String SELECT_PRODUCT_BY_ID = "SELECT * FROM products WHERE id = ?";
    private static final String INSERT_PRODUCT_SQL = "INSERT INTO products (id, name, description, price, image_urls, quantity) VALUES (?, ?, ?, ?, ?, ?)";
    private static final String DELETE_PRODUCT_SQL = "DELETE FROM products WHERE id = ?";
    private static final String UPDATE_PRODUCT_QUANTITY_SQL = "UPDATE products SET quantity = ? WHERE id = ?";

    private static final Map<Integer, Product> IN_MEMORY_PRODUCTS = new ConcurrentHashMap<>();

    static {
        addSeedProduct(new Product(1001, "Crystal Layer Necklace", "Elegant layered necklace with crystal details.", 899.0,
                Arrays.asList("images/logo.jpg", "images/logo.jpg"), 25));
        addSeedProduct(new Product(1002, "Rose Gold Hoop Set", "Minimal hoop earrings with rose gold finish.", 649.0,
                Arrays.asList("images/logo.jpg", "images/logo.jpg"), 40));
        addSeedProduct(new Product(1003, "Pearl Charm Bracelet", "Adjustable bracelet with pearl accents.", 799.0,
                Arrays.asList("images/logo.jpg", "images/logo.jpg"), 30));
    }

    private static void addSeedProduct(Product product) {
        IN_MEMORY_PRODUCTS.put(product.getId(), product);
    }

    protected Connection getConnection() {
        try {
            Class.forName("oracle.jdbc.driver.OracleDriver");
            return DriverManager.getConnection(jdbcURL, jdbcUsername, jdbcPassword);
        } catch (SQLException | ClassNotFoundException e) {
            return null;
        }
    }

    public List<Product> selectAllProducts() {
        Connection connection = getConnection();
        if (connection == null) {
            return new ArrayList<>(IN_MEMORY_PRODUCTS.values());
        }

        List<Product> products = new ArrayList<>();
        try (Connection ignored = connection;
             PreparedStatement preparedStatement = connection.prepareStatement(SELECT_ALL_PRODUCTS)) {
            ResultSet rs = preparedStatement.executeQuery();
            while (rs.next()) {
                int id = rs.getInt("id");
                String name = rs.getString("name");
                String description = rs.getString("description");
                double price = rs.getDouble("price");
                String imageUrls = rs.getString("image_urls");
                int quantity = rs.getInt("quantity");
                List<String> imageUrlList = List.of(imageUrls.split(","));
                products.add(new Product(id, name, description, price, imageUrlList, quantity));
            }
        } catch (SQLException e) {
            return new ArrayList<>(IN_MEMORY_PRODUCTS.values());
        }
        return products;
    }

    public Product selectProductById(int id) {
        Connection connection = getConnection();
        if (connection == null) {
            return IN_MEMORY_PRODUCTS.get(id);
        }

        Product product = null;
        try (Connection ignored = connection;
             PreparedStatement preparedStatement = connection.prepareStatement(SELECT_PRODUCT_BY_ID)) {
            preparedStatement.setInt(1, id);
            ResultSet rs = preparedStatement.executeQuery();
            if (rs.next()) {
                String name = rs.getString("name");
                String description = rs.getString("description");
                double price = rs.getDouble("price");
                String imageUrls = rs.getString("image_urls");
                int quantity = rs.getInt("quantity");
                List<String> imageUrlList = List.of(imageUrls.split(","));
                product = new Product(id, name, description, price, imageUrlList, quantity);
            }
        } catch (SQLException e) {
            return IN_MEMORY_PRODUCTS.get(id);
        }
        return product;
    }

    public void insertProduct(Product product) {
        Connection connection = getConnection();
        if (connection == null) {
            IN_MEMORY_PRODUCTS.put(product.getId(), product);
            return;
        }

        try (Connection ignored = connection;
             PreparedStatement preparedStatement = connection.prepareStatement(INSERT_PRODUCT_SQL)) {
            preparedStatement.setInt(1, product.getId());
            preparedStatement.setString(2, product.getName());
            preparedStatement.setString(3, product.getDescription());
            preparedStatement.setDouble(4, product.getPrice());
            preparedStatement.setString(5, String.join(",", product.getImageUrls()));
            preparedStatement.setInt(6, product.getQuantity());
            preparedStatement.executeUpdate();
        } catch (SQLException e) {
            IN_MEMORY_PRODUCTS.put(product.getId(), product);
        }
    }

    public void deleteProductById(int id) {
        Connection connection = getConnection();
        if (connection == null) {
            IN_MEMORY_PRODUCTS.remove(id);
            return;
        }

        try (Connection ignored = connection;
             PreparedStatement preparedStatement = connection.prepareStatement(DELETE_PRODUCT_SQL)) {
            preparedStatement.setInt(1, id);
            preparedStatement.executeUpdate();
        } catch (SQLException e) {
            IN_MEMORY_PRODUCTS.remove(id);
        }
    }

    public void updateProductQuantity(int id, int quantity) {
        Connection connection = getConnection();
        if (connection == null) {
            Product product = IN_MEMORY_PRODUCTS.get(id);
            if (product != null) {
                product.setQuantity(quantity);
            }
            return;
        }

        try (Connection ignored = connection;
             PreparedStatement preparedStatement = connection.prepareStatement(UPDATE_PRODUCT_QUANTITY_SQL)) {
            preparedStatement.setInt(1, quantity);
            preparedStatement.setInt(2, id);
            preparedStatement.executeUpdate();
        } catch (SQLException e) {
            Product product = IN_MEMORY_PRODUCTS.get(id);
            if (product != null) {
                product.setQuantity(quantity);
            }
        }
    }
}
