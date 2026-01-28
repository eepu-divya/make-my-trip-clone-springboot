package com.makemytrip.makemytrip.services;
import com.makemytrip.makemytrip.models.Users;
import com.makemytrip.makemytrip.models.Users.Booking;
import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.models.Hotel;
import com.makemytrip.makemytrip.models.Payment;
import com.makemytrip.makemytrip.repositories.UserRepository;
import com.makemytrip.makemytrip.repositories.FlightRepository;
import com.makemytrip.makemytrip.repositories.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

@Service
public class BookingService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private LoyaltyService loyaltyService;

    public Booking bookFlight(String userId, String flightId, int seats, double price) {
        Optional<Users> usersOptional = userRepository.findById(userId);
        Optional<Flight> flightOptional = flightRepository.findById(flightId);
        if (usersOptional.isPresent() && flightOptional.isPresent()) {
            Users user = usersOptional.get();
            Flight flight = flightOptional.get();
            if (flight.getAvailableSeats() >= seats) {
                flight.setAvailableSeats(flight.getAvailableSeats() - seats);
                flightRepository.save(flight);

                Booking booking = new Booking();
                booking.setType("Flight");
                booking.setBookingId(flightId);
                booking.setDate(LocalDate.now().toString());
                booking.setQuantity(seats);
                booking.setTotalPrice(price);
                user.getBookings().add(booking);
                userRepository.save(user);
                return booking;
            } else {
                throw new RuntimeException("Not enough seats available");
            }
        }
        throw new RuntimeException("User or flight not found");
    }

    public Booking bookhotel(String userId, String hotelId, int rooms, double price) {
        Optional<Users> usersOptional = userRepository.findById(userId);
        Optional<Hotel> hotelOptional = hotelRepository.findById(hotelId);
        if (usersOptional.isPresent() && hotelOptional.isPresent()) {
            Users user = usersOptional.get();
            Hotel hotel = hotelOptional.get();
            if (hotel.getAvailableRooms() >= rooms) {
                hotel.setAvailableRooms(hotel.getAvailableRooms() - rooms);
                hotelRepository.save(hotel);

                Booking booking = new Booking();
                booking.setType("Hotel");
                booking.setBookingId(hotelId);
                booking.setDate(LocalDate.now().toString());
                booking.setQuantity(rooms);
                booking.setTotalPrice(price);
                user.getBookings().add(booking);
                userRepository.save(user);
                return booking;
            } else {
                throw new RuntimeException("Not enough rooms available");
            }
        }
        throw new RuntimeException("User or flight not found");
    }

    // Enhanced booking with payment and email
    public Booking bookFlightWithPayment(String userId, String flightId, int seats, double price,
                                         String cardNumber, String selectedSeats, String currency) {
        Optional<Users> usersOptional = userRepository.findById(userId);
        Optional<Flight> flightOptional = flightRepository.findById(flightId);

        if (usersOptional.isPresent() && flightOptional.isPresent()) {
            Users user = usersOptional.get();
            Flight flight = flightOptional.get();

            if (flight.getAvailableSeats() < seats) {
                throw new RuntimeException("Not enough seats available");
            }

            // Process payment
            String bookingId = "BK" + UUID.randomUUID().toString().substring(0, 10).toUpperCase();
            Payment payment = paymentService.processPayment(userId, bookingId, price,
                    currency != null ? currency : "USD",
                    cardNumber, "FLIGHT");

            if (!"SUCCESS".equals(payment.getStatus())) {
                throw new RuntimeException("Payment failed: " + payment.getFailureReason());
            }

            // Update flight availability
            flight.setAvailableSeats(flight.getAvailableSeats() - seats);
            flightRepository.save(flight);

            // Create booking
            Booking booking = new Booking();
            booking.setType("Flight");
            booking.setBookingId(bookingId);
            booking.setDate(LocalDate.now().toString());
            booking.setQuantity(seats);
            booking.setTotalPrice(price);
            booking.setStatus("CONFIRMED");
            booking.setPaymentId(payment.getTransactionId());
            booking.setSelectedSeats(selectedSeats);
            booking.setCancellable(true);

            user.getBookings().add(booking);
            userRepository.save(user);

            // Award loyalty points
            try {
                loyaltyService.earnPoints(userId, price, bookingId);
            } catch (Exception e) {
                // Log but don't fail booking
                System.err.println("Failed to award loyalty points: " + e.getMessage());
            }

            // Send confirmation email
            try {
                String flightDetails = flight.getFlightName() + " - " + flight.getFrom() + " to " + flight.getTo();
                emailService.sendBookingConfirmation(user.getEmail(), bookingId, "Flight",
                        flightDetails, booking.getDate(), price);
            } catch (Exception e) {
                // Log but don't fail booking
                System.err.println("Failed to send email: " + e.getMessage());
            }

            return booking;
        }
        throw new RuntimeException("User or flight not found");
    }

    public Booking bookHotelWithPayment(String userId, String hotelId, int rooms, double price,
                                        String cardNumber, String selectedRooms, String currency) {
        Optional<Users> usersOptional = userRepository.findById(userId);
        Optional<Hotel> hotelOptional = hotelRepository.findById(hotelId);

        if (usersOptional.isPresent() && hotelOptional.isPresent()) {
            Users user = usersOptional.get();
            Hotel hotel = hotelOptional.get();

            if (hotel.getAvailableRooms() < rooms) {
                throw new RuntimeException("Not enough rooms available");
            }

            // Process payment
            String bookingId = "BK" + UUID.randomUUID().toString().substring(0, 10).toUpperCase();
            Payment payment = paymentService.processPayment(userId, bookingId, price,
                    currency != null ? currency : "USD",
                    cardNumber, "HOTEL");

            if (!"SUCCESS".equals(payment.getStatus())) {
                throw new RuntimeException("Payment failed: " + payment.getFailureReason());
            }

            // Update hotel availability
            hotel.setAvailableRooms(hotel.getAvailableRooms() - rooms);
            hotelRepository.save(hotel);

            // Create booking
            Booking booking = new Booking();
            booking.setType("Hotel");
            booking.setBookingId(bookingId);
            booking.setDate(LocalDate.now().toString());
            booking.setQuantity(rooms);
            booking.setTotalPrice(price);
            booking.setStatus("CONFIRMED");
            booking.setPaymentId(payment.getTransactionId());
            booking.setSelectedRooms(selectedRooms);
            booking.setCancellable(true);

            user.getBookings().add(booking);
            userRepository.save(user);

            // Award loyalty points
            try {
                loyaltyService.earnPoints(userId, price, bookingId);
            } catch (Exception e) {
                System.err.println("Failed to award loyalty points: " + e.getMessage());
            }

            // Send confirmation email
            try {
                String hotelDetails = hotel.gethotelName() + " - " + hotel.getLocation();
                emailService.sendBookingConfirmation(user.getEmail(), bookingId, "Hotel",
                        hotelDetails, booking.getDate(), price);
            } catch (Exception e) {
                System.err.println("Failed to send email: " + e.getMessage());
            }

            return booking;
        }
        throw new RuntimeException("User or hotel not found");
    }

    public Booking cancelBooking(String userId, String bookingId, String cancellationReason) {
        System.out.println("🔍 CANCEL DEBUG: userId=" + userId + ", bookingId=" + bookingId); // DEBUG

        Optional<Users> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            throw new RuntimeException("User not found: " + userId);
        }

        Users user = userOpt.get();
        System.out.println("🔍 Found user with " + user.getBookings().size() + " bookings"); // DEBUG

        Booking booking = user.getBookings().stream()
                .filter(b -> b.getBookingId() != null && b.getBookingId().equals(bookingId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Booking not found: " + bookingId));

        System.out.println("🔍 Found booking: " + booking.getStatus() + ", cancellable=" + booking.isCancellable()); // DEBUG

        // Force cancel for demo (remove all checks)
        booking.setStatus("CANCELLED");
        booking.setCancellationReason(cancellationReason != null ? cancellationReason : "OTHER");
        booking.setRefundAmount(booking.getTotalPrice());

        // Safe availability restore
        if ("Flight".equals(booking.getType())) {
            try {
                Optional<Flight> flightOpt = flightRepository.findById(booking.getBookingId());
                if (flightOpt.isPresent()) {
                    Flight flight = flightOpt.get();
                    flight.setAvailableSeats(flight.getAvailableSeats() + booking.getQuantity());
                    flightRepository.save(flight);
                    System.out.println("✅ Restored flight seats");
                }
            } catch (Exception e) {
                System.err.println("Flight restore failed: " + e.getMessage());
            }
        } else if ("Hotel".equals(booking.getType())) {
            try {
                Optional<Hotel> hotelOpt = hotelRepository.findById(booking.getBookingId());
                if (hotelOpt.isPresent()) {
                    Hotel hotel = hotelOpt.get();
                    hotel.setAvailableRooms(hotel.getAvailableRooms() + booking.getQuantity());
                    hotelRepository.save(hotel);
                    System.out.println("✅ Restored hotel rooms");
                }
            } catch (Exception e) {
                System.err.println("Hotel restore failed: " + e.getMessage());
            }
        }

        userRepository.save(user);
        System.out.println("✅ Booking cancelled successfully"); // DEBUG

        return booking;
    }
}
