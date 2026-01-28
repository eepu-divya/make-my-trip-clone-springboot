package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.Wishlist;
import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.models.Hotel;
import com.makemytrip.makemytrip.repositories.WishlistRepository;
import com.makemytrip.makemytrip.repositories.FlightRepository;
import com.makemytrip.makemytrip.repositories.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private HotelRepository hotelRepository;

    public Wishlist createWishlist(String userId, String folderName) {
        Wishlist wishlist = new Wishlist();
        wishlist.setUserId(userId);
        wishlist.setFolderName(folderName);
        wishlist.setCreatedAt(LocalDateTime.now());
        wishlist.setUpdatedAt(LocalDateTime.now());
        wishlist.setPriceAlertEnabled(false);
        return wishlistRepository.save(wishlist);
    }

    public Wishlist addItemToWishlist(String wishlistId, String itemId, String itemType, boolean priceDropAlert) {
        Optional<Wishlist> wishlistOpt = wishlistRepository.findById(wishlistId);
        if (!wishlistOpt.isPresent()) {
            throw new RuntimeException("Wishlist not found");
        }

        Wishlist wishlist = wishlistOpt.get();
        Wishlist.WishlistItem item = new Wishlist.WishlistItem();
        item.setItemId(itemId);
        item.setItemType(itemType);
        item.setAddedAt(LocalDateTime.now());
        item.setPriceDropAlert(priceDropAlert);

        // Get item details and price
        if ("FLIGHT".equals(itemType)) {
            Optional<Flight> flightOpt = flightRepository.findById(itemId);
            if (flightOpt.isPresent()) {
                Flight flight = flightOpt.get();
                item.setItemName(flight.getFlightName() + " - " + flight.getFrom() + " to " + flight.getTo());
                item.setOriginalPrice(flight.getPrice());
                item.setCurrentPrice(flight.getPrice());
            }
        } else if ("HOTEL".equals(itemType)) {
            Optional<Hotel> hotelOpt = hotelRepository.findById(itemId);
            if (hotelOpt.isPresent()) {
                Hotel hotel = hotelOpt.get();
                item.setItemName(hotel.gethotelName() + " - " + hotel.getLocation());
                item.setOriginalPrice(hotel.getPricePerNight());
                item.setCurrentPrice(hotel.getPricePerNight());
            }
        }

        wishlist.getItems().add(item);
        wishlist.setUpdatedAt(LocalDateTime.now());
        return wishlistRepository.save(wishlist);
    }

    public Wishlist removeItemFromWishlist(String wishlistId, String itemId) {
        Optional<Wishlist> wishlistOpt = wishlistRepository.findById(wishlistId);
        if (!wishlistOpt.isPresent()) {
            throw new RuntimeException("Wishlist not found");
        }

        Wishlist wishlist = wishlistOpt.get();
        wishlist.getItems().removeIf(item -> item.getItemId().equals(itemId));
        wishlist.setUpdatedAt(LocalDateTime.now());
        return wishlistRepository.save(wishlist);
    }

    public List<Wishlist> getUserWishlists(String userId) {
        return wishlistRepository.findByUserId(userId);
    }

    public void deleteWishlist(String wishlistId) {
        wishlistRepository.deleteById(wishlistId);
    }

    public Wishlist updatePriceAlert(String wishlistId, boolean enabled) {
        Optional<Wishlist> wishlistOpt = wishlistRepository.findById(wishlistId);
        if (!wishlistOpt.isPresent()) {
            throw new RuntimeException("Wishlist not found");
        }

        Wishlist wishlist = wishlistOpt.get();
        wishlist.setPriceAlertEnabled(enabled);
        wishlist.setUpdatedAt(LocalDateTime.now());
        return wishlistRepository.save(wishlist);
    }

    // Method to check price drops (can be called by scheduled task)
    public void checkPriceDrops() {
        List<Wishlist> allWishlists = wishlistRepository.findAll();
        for (Wishlist wishlist : allWishlists) {
            if (wishlist.isPriceAlertEnabled()) {
                for (Wishlist.WishlistItem item : wishlist.getItems()) {
                    double currentPrice = getCurrentPrice(item.getItemId(), item.getItemType());
                    if (currentPrice < item.getCurrentPrice()) {
                        item.setCurrentPrice(currentPrice);
                        // Here you can trigger email notification
                    }
                }
                wishlistRepository.save(wishlist);
            }
        }
    }

    private double getCurrentPrice(String itemId, String itemType) {
        if ("FLIGHT".equals(itemType)) {
            Optional<Flight> flightOpt = flightRepository.findById(itemId);
            return flightOpt.map(Flight::getPrice).orElse(0.0);
        } else if ("HOTEL".equals(itemType)) {
            Optional<Hotel> hotelOpt = hotelRepository.findById(itemId);
            return hotelOpt.map(Hotel::getPricePerNight).orElse(0.0);
        }
        return 0.0;
    }
}