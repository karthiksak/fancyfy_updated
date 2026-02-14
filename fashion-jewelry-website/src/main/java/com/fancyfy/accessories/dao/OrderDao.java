package com.fancyfy.accessories.dao;

import com.fancyfy.accessories.model.Order;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class OrderDao {
    private final String jdbcURL = System.getenv().getOrDefault("FANCYFY_DB_URL", "jdbc:oracle:thin:@localhost:1521:orcl");
    private final String jdbcUsername = System.getenv().getOrDefault("FANCYFY_DB_USERNAME", "system");
    private final String jdbcPassword = System.getenv().getOrDefault("FANCYFY_DB_PASSWORD", "password");

    private static final String INSERT_ORDER_SQL = "INSERT INTO orders (full_name, email, address, payment_details) VALUES (?, ?, ?, ?)";
    private static final List<Order> IN_MEMORY_ORDERS = Collections.synchronizedList(new ArrayList<>());

    protected Connection getConnection() {
        try {
            Class.forName("oracle.jdbc.driver.OracleDriver");
            return DriverManager.getConnection(jdbcURL, jdbcUsername, jdbcPassword);
        } catch (SQLException | ClassNotFoundException e) {
            return null;
        }
    }

    public void insertOrder(Order order) {
        Connection connection = getConnection();
        if (connection == null) {
            IN_MEMORY_ORDERS.add(order);
            return;
        }

        try (Connection ignored = connection;
             PreparedStatement preparedStatement = connection.prepareStatement(INSERT_ORDER_SQL)) {
            preparedStatement.setString(1, order.getFullName());
            preparedStatement.setString(2, order.getEmail());
            preparedStatement.setString(3, order.getAddress());
            preparedStatement.setString(4, order.getPaymentDetails());
            preparedStatement.executeUpdate();
        } catch (SQLException e) {
            IN_MEMORY_ORDERS.add(order);
        }
    }
}
