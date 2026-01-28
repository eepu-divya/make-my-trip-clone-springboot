package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.services.CurrencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/currency")
@CrossOrigin(origins = "*")
public class CurrencyController {

    @Autowired
    private CurrencyService currencyService;

    @GetMapping("/convert")
    public ResponseEntity<Map<String, Object>> convertCurrency(@RequestParam double amount,
                                                               @RequestParam String from,
                                                               @RequestParam String to) {
        try {
            double convertedAmount = currencyService.convertCurrency(amount, from, to);
            String formatted = currencyService.formatCurrency(convertedAmount, to);

            Map<String, Object> response = new HashMap<>();
            response.put("originalAmount", amount);
            response.put("originalCurrency", from);
            response.put("convertedAmount", convertedAmount);
            response.put("targetCurrency", to);
            response.put("formatted", formatted);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/rates")
    public ResponseEntity<Map<String, Double>> getAllRates() {
        Map<String, Double> rates = currencyService.getAllRates();
        return ResponseEntity.ok(rates);
    }
}