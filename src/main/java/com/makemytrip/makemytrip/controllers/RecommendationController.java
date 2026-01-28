package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.models.Hotel;
import com.makemytrip.makemytrip.services.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/recommendations")
@CrossOrigin(origins = "*")
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    @GetMapping("/hotels/{userId}")
    public ResponseEntity<List<Hotel>> getRecommendedHotels(@PathVariable String userId,
                                                            @RequestParam(defaultValue = "10") int limit) {
        List<Hotel> hotels = recommendationService.getRecommendedHotels(userId, limit);
        return ResponseEntity.ok(hotels);
    }

    @GetMapping("/flights/{userId}")
    public ResponseEntity<List<Flight>> getRecommendedFlights(@PathVariable String userId,
                                                              @RequestParam(defaultValue = "10") int limit) {
        List<Flight> flights = recommendationService.getRecommendedFlights(userId, limit);
        return ResponseEntity.ok(flights);
    }

    @GetMapping("/reason")
    public ResponseEntity<Map<String, String>> getRecommendationReason(@RequestParam String itemId,
                                                                       @RequestParam String itemType,
                                                                       @RequestParam String userId) {
        String reason = recommendationService.getRecommendationReason(itemId, itemType, userId);
        Map<String, String> response = new HashMap<>();
        response.put("reason", reason);
        return ResponseEntity.ok(response);
    }
}