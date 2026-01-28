package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.LoyaltyProgram;
import com.makemytrip.makemytrip.models.Users;
import com.makemytrip.makemytrip.repositories.LoyaltyProgramRepository;
import com.makemytrip.makemytrip.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class LoyaltyService {

    @Autowired
    private LoyaltyProgramRepository loyaltyProgramRepository;

    @Autowired
    private UserRepository userRepository;

    public LoyaltyProgram initializeLoyaltyProgram(String userId) {
        LoyaltyProgram existing = loyaltyProgramRepository.findByUserId(userId);
        if (existing != null) {
            return existing;
        }

        LoyaltyProgram program = new LoyaltyProgram();
        program.setUserId(userId);
        program.setTotalPoints(0);
        program.setTier("SILVER");
        program.setLastUpdated(LocalDateTime.now());
        program.setTierExpiryDate(LocalDateTime.now().plusYears(1));
        return loyaltyProgramRepository.save(program);
    }

    public LoyaltyProgram earnPoints(String userId, double amountSpent, String bookingId) {
        LoyaltyProgram program = loyaltyProgramRepository.findByUserId(userId);
        if (program == null) {
            program = initializeLoyaltyProgram(userId);
        }

        // Earn 1 point per $1 spent
        int pointsEarned = (int) amountSpent;

        // Tier bonus
        if ("GOLD".equals(program.getTier())) {
            pointsEarned = (int) (pointsEarned * 1.25); // 25% bonus
        } else if ("PLATINUM".equals(program.getTier())) {
            pointsEarned = (int) (pointsEarned * 1.5); // 50% bonus
        }

        program.setTotalPoints(program.getTotalPoints() + pointsEarned);

        // Add transaction
        LoyaltyProgram.PointTransaction transaction = new LoyaltyProgram.PointTransaction();
        transaction.setTransactionId("PT" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        transaction.setPoints(pointsEarned);
        transaction.setType("EARNED");
        transaction.setDescription("Earned from booking");
        transaction.setDate(LocalDateTime.now());
        transaction.setBookingId(bookingId);
        program.getTransactions().add(transaction);

        // Update tier
        updateTier(program);

        program.setLastUpdated(LocalDateTime.now());

        // Update user loyalty points
        Optional<Users> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            Users user = userOpt.get();
            user.setLoyaltyPoints(program.getTotalPoints());
            user.setLoyaltyTier(program.getTier());
            userRepository.save(user);
        }

        return loyaltyProgramRepository.save(program);
    }

    public LoyaltyProgram redeemPoints(String userId, int points, String description) {
        LoyaltyProgram program = loyaltyProgramRepository.findByUserId(userId);
        if (program == null) {
            throw new RuntimeException("Loyalty program not found");
        }

        if (program.getTotalPoints() < points) {
            throw new RuntimeException("Insufficient points");
        }

        program.setTotalPoints(program.getTotalPoints() - points);

        // Add transaction
        LoyaltyProgram.PointTransaction transaction = new LoyaltyProgram.PointTransaction();
        transaction.setTransactionId("PT" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        transaction.setPoints(points);
        transaction.setType("REDEEMED");
        transaction.setDescription(description);
        transaction.setDate(LocalDateTime.now());
        program.getTransactions().add(transaction);

        program.setLastUpdated(LocalDateTime.now());

        // Update user loyalty points
        Optional<Users> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            Users user = userOpt.get();
            user.setLoyaltyPoints(program.getTotalPoints());
            userRepository.save(user);
        }

        return loyaltyProgramRepository.save(program);
    }

    public double calculateDiscount(String userId, int pointsToRedeem) {
        // 100 points = $1 discount
        return pointsToRedeem / 100.0;
    }

    public LoyaltyProgram getLoyaltyProgram(String userId) {
        LoyaltyProgram program = loyaltyProgramRepository.findByUserId(userId);
        if (program == null) {
            return initializeLoyaltyProgram(userId);
        }
        return program;
    }

    private void updateTier(LoyaltyProgram program) {
        int points = program.getTotalPoints();
        String newTier;

        if (points >= 10000) {
            newTier = "PLATINUM";
        } else if (points >= 5000) {
            newTier = "GOLD";
        } else {
            newTier = "SILVER";
        }

        if (!newTier.equals(program.getTier())) {
            program.setTier(newTier);
            program.setTierExpiryDate(LocalDateTime.now().plusYears(1));
        }
    }
}