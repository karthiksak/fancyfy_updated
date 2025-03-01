package com.fancyfy.accessories.dao;

import com.fancyfy.accessories.model.Order;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class OrderDao {
    private String jdbcURL = "jdbc:oracle:thin:@localhost:1521:orcl";
    private String jdbcUsername = "system";
    private String jdbcPassword = "password";

    private static final String INSERT_ORDER_SQL = "INSERT INTO orders (full_name, email, address, payment_details) VALUES (?, ?, ?, ?)";

    protected Connection getConnection() {
        Connection connection = null;
        try {
            Class.forName("oracle.jdbc.driver.OracleDriver");
            connection = DriverManager.getConnection(jdbcURL, jdbcUsername, jdbcPassword);
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
        }
        return connection;
    }

    public void insertOrder(Order order) {
        try (Connection connection = getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(INSERT_ORDER_SQL)) {
            preparedStatement.setString(1, order.getFullName());
            preparedStatement.setString(2, order.getEmail());
            preparedStatement.setString(3, order.getAddress());
            preparedStatement.setString(4, order.getPaymentDetails());
            preparedStatement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}