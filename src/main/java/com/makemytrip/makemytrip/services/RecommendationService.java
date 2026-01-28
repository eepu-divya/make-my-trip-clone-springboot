package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.models.Hotel;
import com.makemytrip.makemytrip.models.Users;
import com.makemytrip.makemytrip.repositories.FlightRepository;
import com.makemytrip.makemytrip.repositories.HotelRepository;
import com.makemytrip.makemytrip.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private HotelRepository hotelRepository;

    public List<Hotel> getRecommendedHotels(String userId, int limit) {
        Optional<Users> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            return getTopRatedHotels(limit);
        }

        Users user = userOpt.get();
        List<Hotel> allHotels = hotelRepository.findAll();

        // Score hotels based on user preferences
        Map<Hotel, Double> hotelScores = new HashMap<>();
        for (Hotel hotel : allHotels) {
            double score = calculateHotelScore(hotel, user);
            hotelScores.put(hotel, score);
        }

        // Sort by score and return top N
        return hotelScores.entrySet().stream()
                .sorted(Map.Entry.<Hotel, Double>comparingByValue().reversed())
                .limit(limit)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }

    public List<Flight> getRecommendedFlights(String userId, int limit) {
        Optional<Users> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            return getTopRatedFlights(limit);
        }

        Users user = userOpt.get();
        List<Flight> allFlights = flightRepository.findAll();

        Map<Flight, Double> flightScores = new HashMap<>();
        for (Flight flight : allFlights) {
            double score = calculateFlightScore(flight, user);
            flightScores.put(flight, score);
        }

        return flightScores.entrySet().stream()
                .sorted(Map.Entry.<Flight, Double>comparingByValue().reversed())
                .limit(limit)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }

    private double calculateHotelScore(Hotel hotel, Users user) {
        double score = 0.0;

        // Rating factor (40% weight)
        score += hotel.getAverageRating() * 8;

        // Price factor (20% weight) - prefer mid-range
        double priceScore = 100 / (1 + Math.abs(hotel.getPricePerNight() - 150));
        score += priceScore * 4;

        // User preference matching (40% weight)
        if (user.getTravelPreferences() != null && !user.getTravelPreferences().isEmpty()) {
            for (String preference : user.getTravelPreferences()) {
                if (hotel.getLocation() != null &&
                        hotel.getLocation().toLowerCase().contains(preference.toLowerCase())) {
                    score += 20;
                }
                if (hotel.getAmenities() != null &&
                        hotel.getAmenities().toLowerCase().contains(preference.toLowerCase())) {
                    score += 10;
                }
            }
        }

        // Booking history factor
        if (user.getBookings() != null) {
            long hotelBookings = user.getBookings().stream()
                    .filter(b -> "Hotel".equals(b.getType()))
                    .count();
            if (hotelBookings > 0) {
                score += Math.min(hotelBookings * 2, 10);
            }
        }

        return score;
    }

    private double calculateFlightScore(Flight flight, Users user) {
        double score = 0.0;

        // Rating factor (40% weight)
        score += flight.getAverageRating() * 8;

        // Price factor (30% weight)
        double priceScore = 1000 / (1 + flight.getPrice() / 100);
        score += priceScore * 6;

        // Stops factor (20% weight) - prefer direct flights
        score += (3 - Math.min(flight.getStops(), 3)) * 10;

        // Booking history factor (10% weight)
        if (user.getBookings() != null) {
            long flightBookings = user.getBookings().stream()
                    .filter(b -> "Flight".equals(b.getType()))
                    .count();
            if (flightBookings > 0) {
                score += Math.min(flightBookings * 2, 10);
            }
        }

        return score;
    }

    private List<Hotel> getTopRatedHotels(int limit) {
        return hotelRepository.findAll().stream()
                .sorted(Comparator.comparingDouble(Hotel::getAverageRating).reversed())
                .limit(limit)
                .collect(Collectors.toList());
    }

    private List<Flight> getTopRatedFlights(int limit) {
        return flightRepository.findAll().stream()
                .sorted(Comparator.comparingDouble(Flight::getAverageRating).reversed())
                .limit(limit)
                .collect(Collectors.toList());
    }

    public String getRecommendationReason(String itemId, String itemType, String userId) {
        Optional<Users> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            return "Highly rated by other travelers";
        }

        Users user = userOpt.get();
        List<String> reasons = new ArrayList<>();

        if ("HOTEL".equals(itemType)) {
            Optional<Hotel> hotelOpt = hotelRepository.findById(itemId);
            if (hotelOpt.isPresent()) {
                Hotel hotel = hotelOpt.get();

                if (hotel.getAverageRating() >= 4.0) {
                    reasons.add("Highly rated (" + String.format("%.1f", hotel.getAverageRating()) + " stars)");
                }

                if (user.getTravelPreferences() != null) {
                    for (String pref : user.getTravelPreferences()) {
                        if (hotel.getLocation() != null &&
                                hotel.getLocation().toLowerCase().contains(pref.toLowerCase())) {
                            reasons.add("Matches your preference for " + pref);
                            break;
                        }
                    }
                }
            }
        } else if ("FLIGHT".equals(itemType)) {
            Optional<Flight> flightOpt = flightRepository.findById(itemId);
            if (flightOpt.isPresent()) {
                Flight flight = flightOpt.get();

                if (flight.getAverageRating() >= 4.0) {
                    reasons.add("Highly rated (" + String.format("%.1f", flight.getAverageRating()) + " stars)");
                }

                if (flight.getStops() == 0) {
                    reasons.add("Direct flight");
                }
            }
        }

        if (reasons.isEmpty()) {
            return "Popular choice among travelers";
        }

        return String.join(", ", reasons);
    }
}