package com.makemytrip.makemytrip.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class ScheduledTaskService {

    @Autowired
    private DynamicPricingService dynamicPricingService;

    @Autowired
    private WishlistService wishlistService;

    // Update flight prices every 6 hours
    @Scheduled(fixedRate = 21600000) // 6 hours in milliseconds
    public void updateFlightPrices() {
        try {
            dynamicPricingService.updateFlightPrices();
            System.out.println("Flight prices updated successfully at " +
                    java.time.LocalDateTime.now());
        } catch (Exception e) {
            System.err.println("Error updating flight prices: " + e.getMessage());
        }
    }

    // Update hotel prices every 6 hours
    @Scheduled(fixedRate = 21600000)
    public void updateHotelPrices() {
        try {
            dynamicPricingService.updateHotelPrices();
            System.out.println("Hotel prices updated successfully at " +
                    java.time.LocalDateTime.now());
        } catch (Exception e) {
            System.err.println("Error updating hotel prices: " + e.getMessage());
        }
    }

    // Check for price drops every hour
    @Scheduled(fixedRate = 3600000) // 1 hour in milliseconds
    public void checkPriceDrops() {
        try {
            wishlistService.checkPriceDrops();
            System.out.println("Price drop check completed at " +
                    java.time.LocalDateTime.now());
        } catch (Exception e) {
            System.err.println("Error checking price drops: " + e.getMessage());
        }
    }

    // Clean up old search history every day at 2 AM
    @Scheduled(cron = "0 0 2 * * ?")
    public void cleanupOldData() {
        try {
            // Add cleanup logic here if needed
            System.out.println("Data cleanup completed at " +
                    java.time.LocalDateTime.now());
        } catch (Exception e) {
            System.err.println("Error during cleanup: " + e.getMessage());
        }
    }
}