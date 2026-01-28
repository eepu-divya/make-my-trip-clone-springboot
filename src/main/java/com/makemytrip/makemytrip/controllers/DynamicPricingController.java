package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.services.DynamicPricingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/pricing")
@CrossOrigin(origins = "*")
public class DynamicPricingController {

    @Autowired
    private DynamicPricingService pricingService;

    @PostMapping("/update-flights")
    public ResponseEntity<String> updateFlightPrices() {
        pricingService.updateFlightPrices();
        return ResponseEntity.ok("Flight prices updated successfully");
    }

    @PostMapping("/update-hotels")
    public ResponseEntity<String> updateHotelPrices() {
        pricingService.updateHotelPrices();
        return ResponseEntity.ok("Hotel prices updated successfully");
    }

    @GetMapping("/history")
    public ResponseEntity<Map<String, Object>> getPriceHistory(@RequestParam String itemId,
                                                               @RequestParam String itemType) {
        Map<String, Object> history = pricingService.getPriceHistory(itemId, itemType);
        return ResponseEntity.ok(history);
    }
}