package com.makemytrip.makemytrip.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "loyalty_programs")
public class LoyaltyProgram {
    @Id
    private String id;
    private String userId;
    private int totalPoints;
    private String tier; // SILVER, GOLD, PLATINUM
    private List<PointTransaction> transactions = new ArrayList<>();
    private LocalDateTime lastUpdated;
    private LocalDateTime tierExpiryDate;

    public static class PointTransaction {
        private String transactionId;
        private int points;
        private String type; // EARNED, REDEEMED, EXPIRED
        private String description;
        private LocalDateTime date;
        private String bookingId;

        // Getters and Setters
        public String getTransactionId() {
            return transactionId;
        }

        public void setTransactionId(String transactionId) {
            this.transactionId = transactionId;
        }

        public int getPoints() {
            return points;
        }

        public void setPoints(int points) {
            this.points = points;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public LocalDateTime getDate() {
            return date;
        }

        public void setDate(LocalDateTime date) {
            this.date = date;
        }

        public String getBookingId() {
            return bookingId;
        }

        public void setBookingId(String bookingId) {
            this.bookingId = bookingId;
        }
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public int getTotalPoints() {
        return totalPoints;
    }

    public void setTotalPoints(int totalPoints) {
        this.totalPoints = totalPoints;
    }

    public String getTier() {
        return tier;
    }

    public void setTier(String tier) {
        this.tier = tier;
    }

    public List<PointTransaction> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<PointTransaction> transactions) {
        this.transactions = transactions;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public LocalDateTime getTierExpiryDate() {
        return tierExpiryDate;
    }

    public void setTierExpiryDate(LocalDateTime tierExpiryDate) {
        this.tierExpiryDate = tierExpiryDate;
    }
}