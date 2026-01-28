package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.models.Review;
import com.makemytrip.makemytrip.services.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/review")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping("/create")
    public ResponseEntity<Review> createReview(@RequestParam String userId,
                                               @RequestParam String userName,
                                               @RequestParam String itemId,
                                               @RequestParam String itemType,
                                               @RequestParam int rating,
                                               @RequestParam String title,
                                               @RequestParam String comment) {
        try {
            Review review = reviewService.createReview(userId, userName, itemId,
                    itemType, rating, title, comment);
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/item/{itemId}")
    public ResponseEntity<List<Review>> getReviewsByItem(@PathVariable String itemId,
                                                         @RequestParam String itemType) {
        List<Review> reviews = reviewService.getReviewsByItem(itemId, itemType);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/item/{itemId}/sorted")
    public ResponseEntity<List<Review>> getReviewsSortedByHelpful(@PathVariable String itemId) {
        List<Review> reviews = reviewService.getReviewsByItemSortedByHelpful(itemId);
        return ResponseEntity.ok(reviews);
    }

    @PostMapping("/{reviewId}/helpful")
    public ResponseEntity<Review> markAsHelpful(@PathVariable String reviewId,
                                                @RequestParam String userId) {
        try {
            Review review = reviewService.markAsHelpful(reviewId, userId);
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{reviewId}/flag")
    public ResponseEntity<Review> flagReview(@PathVariable String reviewId) {
        try {
            Review review = reviewService.flagReview(reviewId);
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{reviewId}/admin-reply")
    public ResponseEntity<Review> addAdminReply(@PathVariable String reviewId,
                                                @RequestParam String reply) {
        try {
            Review review = reviewService.addAdminReply(reviewId, reply);
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/flagged")
    public ResponseEntity<List<Review>> getFlaggedReviews() {
        List<Review> reviews = reviewService.getFlaggedReviews();
        return ResponseEntity.ok(reviews);
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable String reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.ok().build();
    }
}