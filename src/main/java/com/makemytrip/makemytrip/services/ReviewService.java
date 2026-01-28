package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.Review;
import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.models.Hotel;
import com.makemytrip.makemytrip.repositories.ReviewRepository;
import com.makemytrip.makemytrip.repositories.FlightRepository;
import com.makemytrip.makemytrip.repositories.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private HotelRepository hotelRepository;

    public Review createReview(String userId, String userName, String itemId, String itemType,
                               int rating, String title, String comment) {
        if (rating < 1 || rating > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        Review review = new Review();
        review.setUserId(userId);
        review.setUserName(userName);
        review.setItemId(itemId);
        review.setItemType(itemType);
        review.setRating(rating);
        review.setTitle(title);
        review.setComment(comment);
        review.setCreatedAt(LocalDateTime.now());
        review.setUpdatedAt(LocalDateTime.now());
        review.setFlagged(false);
        review.setHelpfulCount(0);

        Review savedReview = reviewRepository.save(review);

        // Update average rating
        updateAverageRating(itemId, itemType);

        return savedReview;
    }

    public List<Review> getReviewsByItem(String itemId, String itemType) {
        return reviewRepository.findByItemIdAndItemType(itemId, itemType);
    }

    public List<Review> getReviewsByItemSortedByHelpful(String itemId) {
        return reviewRepository.findByItemIdOrderByHelpfulCountDesc(itemId);
    }

    public Review markAsHelpful(String reviewId, String userId) {
        Optional<Review> reviewOpt = reviewRepository.findById(reviewId);
        if (!reviewOpt.isPresent()) {
            throw new RuntimeException("Review not found");
        }

        Review review = reviewOpt.get();
        if (!review.getHelpfulByUsers().contains(userId)) {
            review.getHelpfulByUsers().add(userId);
            review.setHelpfulCount(review.getHelpfulCount() + 1);
            return reviewRepository.save(review);
        }
        return review;
    }

    public Review flagReview(String reviewId) {
        Optional<Review> reviewOpt = reviewRepository.findById(reviewId);
        if (!reviewOpt.isPresent()) {
            throw new RuntimeException("Review not found");
        }

        Review review = reviewOpt.get();
        review.setFlagged(true);
        return reviewRepository.save(review);
    }

    public Review addAdminReply(String reviewId, String reply) {
        Optional<Review> reviewOpt = reviewRepository.findById(reviewId);
        if (!reviewOpt.isPresent()) {
            throw new RuntimeException("Review not found");
        }

        Review review = reviewOpt.get();
        review.setAdminReply(reply);
        review.setAdminReplyDate(LocalDateTime.now());
        return reviewRepository.save(review);
    }

    public List<Review> getFlaggedReviews() {
        return reviewRepository.findByFlagged(true);
    }

    private void updateAverageRating(String itemId, String itemType) {
        List<Review> reviews = reviewRepository.findByItemIdAndItemType(itemId, itemType);
        if (reviews.isEmpty()) return;

        double avgRating = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        if ("FLIGHT".equals(itemType)) {
            Optional<Flight> flightOpt = flightRepository.findById(itemId);
            if (flightOpt.isPresent()) {
                Flight flight = flightOpt.get();
                flight.setAverageRating(avgRating);
                flight.setTotalReviews(reviews.size());
                flightRepository.save(flight);
            }
        } else if ("HOTEL".equals(itemType)) {
            Optional<Hotel> hotelOpt = hotelRepository.findById(itemId);
            if (hotelOpt.isPresent()) {
                Hotel hotel = hotelOpt.get();
                hotel.setAverageRating(avgRating);
                hotel.setTotalReviews(reviews.size());
                hotelRepository.save(hotel);
            }
        }
    }

    public void deleteReview(String reviewId) {
        Optional<Review> reviewOpt = reviewRepository.findById(reviewId);
        if (reviewOpt.isPresent()) {
            Review review = reviewOpt.get();
            reviewRepository.deleteById(reviewId);
            updateAverageRating(review.getItemId(), review.getItemType());
        }
    }
}