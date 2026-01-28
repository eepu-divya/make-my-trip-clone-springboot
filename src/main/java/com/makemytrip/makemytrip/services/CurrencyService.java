package com.makemytrip.makemytrip.services;

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class CurrencyService {

    // Mock exchange rates (base: USD)
    private final Map<String, Double> exchangeRates = new HashMap<>();

    public CurrencyService() {
        exchangeRates.put("USD", 1.0);
        exchangeRates.put("EUR", 0.92);
        exchangeRates.put("GBP", 0.79);
        exchangeRates.put("INR", 83.12);
        exchangeRates.put("AUD", 1.52);
        exchangeRates.put("CAD", 1.36);
        exchangeRates.put("JPY", 149.50);
    }

    public double convertCurrency(double amount, String fromCurrency, String toCurrency) {
        if (!exchangeRates.containsKey(fromCurrency) || !exchangeRates.containsKey(toCurrency)) {
            throw new RuntimeException("Currency not supported");
        }

        // Convert to USD first, then to target currency
        double amountInUSD = amount / exchangeRates.get(fromCurrency);
        return amountInUSD * exchangeRates.get(toCurrency);
    }

    public Map<String, Double> getAllRates() {
        return new HashMap<>(exchangeRates);
    }

    public String formatCurrency(double amount, String currency) {
        Map<String, String> symbols = new HashMap<>();
        symbols.put("USD", "$");
        symbols.put("EUR", "€");
        symbols.put("GBP", "£");
        symbols.put("INR", "₹");
        symbols.put("AUD", "A$");
        symbols.put("CAD", "C$");
        symbols.put("JPY", "¥");

        String symbol = symbols.getOrDefault(currency, currency + " ");
        return symbol + String.format("%.2f", amount);
    }
}