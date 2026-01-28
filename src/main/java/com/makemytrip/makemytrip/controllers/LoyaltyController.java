package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.models.LoyaltyProgram;
import com.makemytrip.makemytrip.services.LoyaltyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/loyalty")
@CrossOrigin(origins = "*")
public class LoyaltyController {

    @Autowired
    private LoyaltyService loyaltyService;

    @GetMapping("/{userId}")
    public ResponseEntity<LoyaltyProgram> getLoyaltyProgram(@PathVariable String userId) {
        LoyaltyProgram program = loyaltyService.getLoyaltyProgram(userId);
        return ResponseEntity.ok(program);
    }

    @PostMapping("/{userId}/redeem")
    public ResponseEntity<LoyaltyProgram> redeemPoints(@PathVariable String userId,
                                                       @RequestParam int points,
                                                       @RequestParam String description) {
        try {
            LoyaltyProgram program = loyaltyService.redeemPoints(userId, points, description);
            return ResponseEntity.ok(program);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{userId}/calculate-discount")
    public ResponseEntity<Map<String, Object>> calculateDiscount(@PathVariable String userId,
                                                                 @RequestParam int points) {
        double discount = loyaltyService.calculateDiscount(userId, points);
        Map<String, Object> response = new HashMap<>();
        response.put("points", points);
        response.put("discount", discount);
        return ResponseEntity.ok(response);
    }
}