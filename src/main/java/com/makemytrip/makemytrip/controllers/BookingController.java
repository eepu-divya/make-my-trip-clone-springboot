package com.makemytrip.makemytrip.controllers;
import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.makemytrip.makemytrip.models.Users;
import com.makemytrip.makemytrip.services.BookingService;

@RestController
@RequestMapping("/booking")
public class BookingController {
    @Autowired
    private BookingService bookingService;

    @PostMapping("/flight")
    public Users.Booking bookFlight(@RequestParam String userId,@RequestParam String flightId,@RequestParam int seats,@RequestParam double price){
        return bookingService.bookFlight(userId,flightId,seats,price);
    }
    @PostMapping("/hotel")
    public Users.Booking bookhotel (@RequestParam String userId,@RequestParam String hotelId,@RequestParam int rooms,@RequestParam double price){
        return bookingService.bookhotel(userId,hotelId,rooms,price);
    }

    @PostMapping("/flight/with-payment")
    public Users.Booking bookFlightWithPayment(@RequestParam String userId,
                                               @RequestParam String flightId,
                                               @RequestParam int seats,
                                               @RequestParam double price,
                                               @RequestParam String cardNumber,
                                               @RequestParam(required = false) String selectedSeats,
                                               @RequestParam(defaultValue = "USD") String currency) {
        return bookingService.bookFlightWithPayment(userId, flightId, seats, price,
                cardNumber, selectedSeats, currency);
    }

    @PostMapping("/hotel/with-payment")
    public Users.Booking bookHotelWithPayment(@RequestParam String userId,
                                              @RequestParam String hotelId,
                                              @RequestParam int rooms,
                                              @RequestParam double price,
                                              @RequestParam String cardNumber,
                                              @RequestParam(required = false) String selectedRooms,
                                              @RequestParam(defaultValue = "USD") String currency) {
        return bookingService.bookHotelWithPayment(userId, hotelId, rooms, price,
                cardNumber, selectedRooms, currency);
    }

    @PostMapping("/cancel")
    public Users.Booking cancelBooking(@RequestParam String userId,
                                       @RequestParam String bookingId,
                                       @RequestParam(required = false) String cancellationReason) {
        return bookingService.cancelBooking(userId, bookingId, cancellationReason);
    }
}