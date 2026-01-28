package com.makemytrip.makemytrip.controllers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.makemytrip.makemytrip.models.Users;
import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.models.Hotel;
import com.makemytrip.makemytrip.repositories.UserRepository;
import com.makemytrip.makemytrip.repositories.FlightRepository;
import com.makemytrip.makemytrip.repositories.HotelRepository;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.stream.Collectors;
@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
public class AdminController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private FlightRepository flightRepository;

    @GetMapping("/users")
    public ResponseEntity<List<Users>> getallusers(){
        List<Users> users=userRepository.findAll();
        return ResponseEntity.ok(users);
    }
    @PostMapping("/flight")
    public Flight addflight(@RequestBody Flight flight){
        return flightRepository.save(flight);
    }

    @PostMapping("/hotel")
    public Hotel addhotel(@RequestBody Hotel hotel){
        return hotelRepository.save(hotel);
    }
    @PutMapping("flight/{id}")
    public ResponseEntity<Flight> editflight(@PathVariable String id, @RequestBody Flight updatedFlight){
        Optional<Flight> flightOptional=flightRepository.findById(id);
        if(flightOptional.isPresent()){
            Flight flight = flightOptional.get();
            flight.setFlightName(updatedFlight.getFlightName());
            flight.setFrom(updatedFlight.getFrom());
            flight.setTo(updatedFlight.getTo());
            flight.setDepartureTime(updatedFlight.getDepartureTime());
            flight.setArrivalTime(updatedFlight.getArrivalTime());
            flight.setPrice(updatedFlight.getPrice());
            flight.setAvailableSeats(updatedFlight.getAvailableSeats());
            flightRepository.save(flight);
            return  ResponseEntity.ok(flight);
        }
        return ResponseEntity.notFound().build();
    }
    @PutMapping("hotel/{id}")
    public ResponseEntity<Hotel> editHotel (@PathVariable String id, @RequestBody Hotel updatedHotel){
        Optional<Hotel> hotelOptional=hotelRepository.findById(id);
        if(hotelOptional.isPresent()){
            Hotel hotel = hotelOptional.get();
            hotel.sethotelName(updatedHotel.gethotelName());
            hotel.setLocation(updatedHotel.getLocation());
            hotel.setAvailableRooms(updatedHotel.getAvailableRooms());
            hotel.setPricePerNight(updatedHotel.getPricePerNight());
            hotel.setAmenities(updatedHotel.getAmenities());
            hotelRepository.save(hotel);
            return ResponseEntity.ok(hotel);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/analytics/bookings")
    public ResponseEntity<Map<String, Object>> getBookingAnalytics() {
        List<Users> users = userRepository.findAll();
        int totalBookings = 0;
        double totalRevenue = 0.0;
        int flightBookings = 0;
        int hotelBookings = 0;

        for (Users user : users) {
            for (Users.Booking booking : user.getBookings()) {
                if ("CONFIRMED".equals(booking.getStatus())) {
                    totalBookings++;
                    totalRevenue += booking.getTotalPrice();
                    if ("Flight".equals(booking.getType())) {
                        flightBookings++;
                    } else if ("Hotel".equals(booking.getType())) {
                        hotelBookings++;
                    }
                }
            }
        }

        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalBookings", totalBookings);
        analytics.put("totalRevenue", totalRevenue);
        analytics.put("flightBookings", flightBookings);
        analytics.put("hotelBookings", hotelBookings);
        analytics.put("totalUsers", users.size());

        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/analytics/popular-hotels")
    public ResponseEntity<List<Map<String, Object>>> getPopularHotels() {
        List<Hotel> hotels = hotelRepository.findAll();
        List<Map<String, Object>> popularHotels = new ArrayList<>();

        for (Hotel hotel : hotels) {
            Map<String, Object> hotelData = new HashMap<>();
            hotelData.put("id", hotel.getId());
            hotelData.put("name", hotel.gethotelName());
            hotelData.put("location", hotel.getLocation());
            hotelData.put("averageRating", hotel.getAverageRating());
            hotelData.put("totalReviews", hotel.getTotalReviews());
            hotelData.put("bookings", hotel.getTotalRooms() - hotel.getAvailableRooms());
            popularHotels.add(hotelData);
        }

        popularHotels.sort((a, b) ->
                Integer.compare((Integer) b.get("bookings"), (Integer) a.get("bookings")));

        return ResponseEntity.ok(popularHotels.stream().limit(10).collect(Collectors.toList()));
    }

    @GetMapping("/analytics/popular-flights")
    public ResponseEntity<List<Map<String, Object>>> getPopularFlights() {
        List<Flight> flights = flightRepository.findAll();
        List<Map<String, Object>> popularFlights = new ArrayList<>();

        for (Flight flight : flights) {
            Map<String, Object> flightData = new HashMap<>();
            flightData.put("id", flight.getId());
            flightData.put("name", flight.getFlightName());
            flightData.put("route", flight.getFrom() + " to " + flight.getTo());
            flightData.put("averageRating", flight.getAverageRating());
            flightData.put("totalReviews", flight.getTotalReviews());
            flightData.put("bookings", flight.getTotalSeats() - flight.getAvailableSeats());
            popularFlights.add(flightData);
        }

        popularFlights.sort((a, b) ->
                Integer.compare((Integer) b.get("bookings"), (Integer) a.get("bookings")));

        return ResponseEntity.ok(popularFlights.stream().limit(10).collect(Collectors.toList()));
    }

    @GetMapping("/analytics/revenue-chart")
    public ResponseEntity<Map<String, Object>> getRevenueChart() {
        // Mock revenue data for last 7 days
        Map<String, Object> revenueData = new HashMap<>();
        List<Double> dailyRevenue = new ArrayList<>();

        // Generate mock data
        for (int i = 0; i < 7; i++) {
            dailyRevenue.add(5000.0 + Math.random() * 10000);
        }

        revenueData.put("labels", List.of("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"));
        revenueData.put("data", dailyRevenue);

        return ResponseEntity.ok(revenueData);
    }
}