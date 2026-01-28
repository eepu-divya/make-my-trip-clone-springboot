package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.models.Hotel;
import com.makemytrip.makemytrip.models.SearchHistory;
import com.makemytrip.makemytrip.repositories.FlightRepository;
import com.makemytrip.makemytrip.repositories.HotelRepository;
import com.makemytrip.makemytrip.repositories.SearchHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SearchService {

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private SearchHistoryRepository searchHistoryRepository;

    public List<Flight> searchFlights(String userId, String from, String to, Double minPrice,
                                      Double maxPrice, String airline, Integer maxStops) {
        List<Flight> flights = flightRepository.findAll();

        // Apply filters
        List<Flight> filtered = flights.stream()
                .filter(f -> from == null || from.isEmpty() ||
                        f.getFrom().toLowerCase().contains(from.toLowerCase()))
                .filter(f -> to == null || to.isEmpty() ||
                        f.getTo().toLowerCase().contains(to.toLowerCase()))
                .filter(f -> minPrice == null || f.getPrice() >= minPrice)
                .filter(f -> maxPrice == null || f.getPrice() <= maxPrice)
                .filter(f -> airline == null || airline.isEmpty() ||
                        (f.getAirline() != null && f.getAirline().toLowerCase().contains(airline.toLowerCase())))
                .filter(f -> maxStops == null || f.getStops() <= maxStops)
                .collect(Collectors.toList());

        // Save search history
        if (userId != null && !userId.isEmpty()) {
            saveSearchHistory(userId, "FLIGHT", from + " to " + to, from, to, filtered.size());
        }

        return filtered;
    }

    public List<Hotel> searchHotels(String userId, String location, Double minPrice,
                                    Double maxPrice, Double minRating, String amenities) {
        List<Hotel> hotels = hotelRepository.findAll();

        // Apply filters
        List<Hotel> filtered = hotels.stream()
                .filter(h -> location == null || location.isEmpty() ||
                        h.getLocation().toLowerCase().contains(location.toLowerCase()))
                .filter(h -> minPrice == null || h.getPricePerNight() >= minPrice)
                .filter(h -> maxPrice == null || h.getPricePerNight() <= maxPrice)
                .filter(h -> minRating == null || h.getAverageRating() >= minRating)
                .filter(h -> amenities == null || amenities.isEmpty() ||
                        (h.getAmenities() != null && h.getAmenities().toLowerCase().contains(amenities.toLowerCase())))
                .collect(Collectors.toList());

        // Save search history
        if (userId != null && !userId.isEmpty()) {
            saveSearchHistory(userId, "HOTEL", location, location, null, filtered.size());
        }

        return filtered;
    }

    public List<String> getLocationAutocomplete(String query, String type) {
        List<String> suggestions = new ArrayList<>();

        if ("FLIGHT".equals(type)) {
            List<Flight> flights = flightRepository.findAll();
            flights.forEach(f -> {
                if (f.getFrom() != null && f.getFrom().toLowerCase().contains(query.toLowerCase())) {
                    if (!suggestions.contains(f.getFrom())) {
                        suggestions.add(f.getFrom());
                    }
                }
                if (f.getTo() != null && f.getTo().toLowerCase().contains(query.toLowerCase())) {
                    if (!suggestions.contains(f.getTo())) {
                        suggestions.add(f.getTo());
                    }
                }
            });
        } else if ("HOTEL".equals(type)) {
            List<Hotel> hotels = hotelRepository.findAll();
            hotels.forEach(h -> {
                if (h.getLocation() != null && h.getLocation().toLowerCase().contains(query.toLowerCase())) {
                    if (!suggestions.contains(h.getLocation())) {
                        suggestions.add(h.getLocation());
                    }
                }
            });
        }

        return suggestions.stream().limit(10).collect(Collectors.toList());
    }

    public List<SearchHistory> getRecentSearches(String userId, int limit) {
        List<SearchHistory> history = searchHistoryRepository.findByUserIdOrderBySearchDateDesc(userId);
        return history.stream().limit(limit).collect(Collectors.toList());
    }

    private void saveSearchHistory(String userId, String searchType, String query,
                                   String from, String to, int resultCount) {
        SearchHistory history = new SearchHistory();
        history.setUserId(userId);
        history.setSearchType(searchType);
        history.setSearchQuery(query);
        history.setFromLocation(from);
        history.setToLocation(to);
        history.setSearchDate(LocalDateTime.now());
        history.setResultCount(resultCount);
        searchHistoryRepository.save(history);
    }
}