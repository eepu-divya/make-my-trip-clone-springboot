package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.models.Wishlist;
import com.makemytrip.makemytrip.services.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/wishlist")
@CrossOrigin(origins = "*")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @PostMapping("/create")
    public ResponseEntity<Wishlist> createWishlist(@RequestParam String userId,
                                                   @RequestParam String folderName) {
        try {
            Wishlist wishlist = wishlistService.createWishlist(userId, folderName);
            return ResponseEntity.ok(wishlist);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{wishlistId}/add-item")
    public ResponseEntity<Wishlist> addItem(@PathVariable String wishlistId,
                                            @RequestParam String itemId,
                                            @RequestParam String itemType,
                                            @RequestParam(defaultValue = "false") boolean priceDropAlert) {
        try {
            Wishlist wishlist = wishlistService.addItemToWishlist(wishlistId, itemId, itemType, priceDropAlert);
            return ResponseEntity.ok(wishlist);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{wishlistId}/remove-item")
    public ResponseEntity<Wishlist> removeItem(@PathVariable String wishlistId,
                                               @RequestParam String itemId) {
        try {
            Wishlist wishlist = wishlistService.removeItemFromWishlist(wishlistId, itemId);
            return ResponseEntity.ok(wishlist);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Wishlist>> getUserWishlists(@PathVariable String userId) {
        List<Wishlist> wishlists = wishlistService.getUserWishlists(userId);
        return ResponseEntity.ok(wishlists);
    }

    @DeleteMapping("/{wishlistId}")
    public ResponseEntity<Void> deleteWishlist(@PathVariable String wishlistId) {
        wishlistService.deleteWishlist(wishlistId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{wishlistId}/price-alert")
    public ResponseEntity<Wishlist> updatePriceAlert(@PathVariable String wishlistId,
                                                     @RequestParam boolean enabled) {
        try {
            Wishlist wishlist = wishlistService.updatePriceAlert(wishlistId, enabled);
            return ResponseEntity.ok(wishlist);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}