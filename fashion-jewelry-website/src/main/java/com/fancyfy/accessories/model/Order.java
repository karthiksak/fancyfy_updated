package com.fancyfy.accessories.model;

public class Order {
    private int id;
    private String fullName;
    private String email;
    private String address;
    private String paymentDetails;

    public Order() {
    }

    public Order(String fullName, String email, String address, String paymentDetails) {
        this.fullName = fullName;
        this.email = email;
        this.address = address;
        this.paymentDetails = paymentDetails;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPaymentDetails() {
        return paymentDetails;
    }

    public void setPaymentDetails(String paymentDetails) {
        this.paymentDetails = paymentDetails;
    }
}