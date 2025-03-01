package com.fancyfy.accessories.model;

import java.util.HashMap;
import java.util.Map;

public class Cart {
	private Map<Product, Integer> items = new HashMap<>();


	public void addProduct(Product product, int quantity) {
		items.put(product, items.getOrDefault(product, 0) + quantity);
	}

	public void removeProduct(Product product) {
		items.remove(product);
	}

	public Map<Product, Integer> getItems() {
		return items;
	}

	public double getTotalAmount() {
		return items.entrySet().stream()
				.mapToDouble(entry -> entry.getKey().getPrice() * entry.getValue()).sum();
	}

	public double getShippingCharge() {
		return getTotalAmount() > 499 ? 0 : 100;
	}

	public double getFinalAmount() {
		return getTotalAmount() + getShippingCharge();
	}

	public void clear() {
		items.clear();
	}
}