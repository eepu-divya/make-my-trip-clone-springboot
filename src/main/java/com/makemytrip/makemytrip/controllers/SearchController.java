package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.models.Hotel;
import com.makemytrip.makemytrip.models.SearchHistory;
import com.makemytrip.makemytrip.services.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/search")
@CrossOrigin(origins = "*")
public class SearchController {

    @Autowired
    private SearchService searchService;

    @GetMapping("/flights")
    public ResponseEntity<List<Flight>> searchFlights(
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String airline,
            @RequestParam(required = false) Integer maxStops) {

        List<Flight> flights = searchService.searchFlights(userId, from, to,
                minPrice, maxPrice, airline, maxStops);
        return ResponseEntity.ok(flights);
    }

    @GetMapping("/hotels")
    public ResponseEntity<List<Hotel>> searchHotels(
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) String amenities) {

        List<Hotel> hotels = searchService.searchHotels(userId, location,
                minPrice, maxPrice, minRating, amenities);
        return ResponseEntity.ok(hotels);
    }

    @GetMapping("/autocomplete")
    public ResponseEntity<List<String>> getAutocomplete(@RequestParam String query,
                                                        @RequestParam String type) {
        List<String> suggestions = searchService.getLocationAutocomplete(query, type);
        return ResponseEntity.ok(suggestions);
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<List<SearchHistory>> getRecentSearches(@PathVariable String userId,
                                                                 @RequestParam(defaultValue = "10") int limit) {
        List<SearchHistory> history = searchService.getRecentSearches(userId, limit);
        return ResponseEntity.ok(history);
    }
}