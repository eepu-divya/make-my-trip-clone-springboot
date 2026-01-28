package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.models.Hotel;
import com.makemytrip.makemytrip.repositories.FlightRepository;
import com.makemytrip.makemytrip.repositories.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DynamicPricingService {

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private HotelRepository hotelRepository;

    public void updateFlightPrices() {
        List<Flight> flights = flightRepository.findAll();
        for (Flight flight : flights) {
            if (flight.getBasePrice() == 0) {
                flight.setBasePrice(flight.getPrice());
            }

            double multiplier = calculateDemandMultiplier(flight);
            flight.setDemandMultiplier(multiplier);
            flight.setPrice(flight.getBasePrice() * multiplier);
            flightRepository.save(flight);
        }
    }

    public void updateHotelPrices() {
        List<Hotel> hotels = hotelRepository.findAll();
        for (Hotel hotel : hotels) {
            if (hotel.getBasePricePerNight() == 0) {
                hotel.setBasePricePerNight(hotel.getPricePerNight());
            }

            double multiplier = calculateHotelDemandMultiplier(hotel);
            hotel.setDemandMultiplier(multiplier);
            hotel.setPricePerNight(hotel.getBasePricePerNight() * multiplier);
            hotelRepository.save(hotel);
        }
    }

    private double calculateDemandMultiplier(Flight flight) {
        double multiplier = 1.0;

        // Seat availability factor
        if (flight.getTotalSeats() > 0) {
            double occupancyRate = 1.0 - ((double) flight.getAvailableSeats() / flight.getTotalSeats());
            if (occupancyRate > 0.8) {
                multiplier += 0.3; // 30% increase when 80%+ booked
            } else if (occupancyRate > 0.6) {
                multiplier += 0.2; // 20% increase when 60%+ booked
            } else if (occupancyRate > 0.4) {
                multiplier += 0.1; // 10% increase when 40%+ booked
            }
        }

        // Time-based pricing (holidays, weekends)
        if (isHolidayPeriod()) {
            multiplier += 0.2; // 20% increase during holidays
        }

        if (isWeekend()) {
            multiplier += 0.1; // 10% increase on weekends
        }

        return Math.min(multiplier, 1.5); // Cap at 50% increase
    }

    private double calculateHotelDemandMultiplier(Hotel hotel) {
        double multiplier = 1.0;

        // Room availability factor
        if (hotel.getTotalRooms() > 0) {
            double occupancyRate = 1.0 - ((double) hotel.getAvailableRooms() / hotel.getTotalRooms());
            if (occupancyRate > 0.8) {
                multiplier += 0.25;
            } else if (occupancyRate > 0.6) {
                multiplier += 0.15;
            } else if (occupancyRate > 0.4) {
                multiplier += 0.1;
            }
        }

        // Time-based pricing
        if (isHolidayPeriod()) {
            multiplier += 0.25;
        }

        if (isWeekend()) {
            multiplier += 0.15;
        }

        return Math.min(multiplier, 1.6); // Cap at 60% increase
    }

    private boolean isHolidayPeriod() {
        LocalDate now = LocalDate.now();
        int month = now.getMonthValue();

        // Consider December, January as holiday period
        return month == 12 || month == 1 ||
                // Summer vacation (June-July)
                month == 6 || month == 7;
    }

    private boolean isWeekend() {
        LocalDate now = LocalDate.now();
        int dayOfWeek = now.getDayOfWeek().getValue();
        return dayOfWeek == 6 || dayOfWeek == 7; // Saturday or Sunday
    }

    public Map<String, Object> getPriceHistory(String itemId, String itemType) {
        Map<String, Object> history = new HashMap<>();

        // Mock price history data
        history.put("currentPrice", 0.0);
        history.put("lowestPrice", 0.0);
        history.put("highestPrice", 0.0);
        history.put("averagePrice", 0.0);

        if ("FLIGHT".equals(itemType)) {
            flightRepository.findById(itemId).ifPresent(flight -> {
                history.put("currentPrice", flight.getPrice());
                history.put("basePrice", flight.getBasePrice());
                history.put("lowestPrice", flight.getBasePrice() * 0.9);
                history.put("highestPrice", flight.getBasePrice() * 1.5);
                history.put("averagePrice", flight.getBasePrice() * 1.15);
            });
        } else if ("HOTEL".equals(itemType)) {
            hotelRepository.findById(itemId).ifPresent(hotel -> {
                history.put("currentPrice", hotel.getPricePerNight());
                history.put("basePrice", hotel.getBasePricePerNight());
                history.put("lowestPrice", hotel.getBasePricePerNight() * 0.85);
                history.put("highestPrice", hotel.getBasePricePerNight() * 1.6);
                history.put("averagePrice", hotel.getBasePricePerNight() * 1.2);
            });
        }

        return history;
    }
}