package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.Payment;
import com.makemytrip.makemytrip.repositories.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    public Payment processPayment(String userId, String bookingId, double amount, String currency,
                                  String cardNumber, String bookingType) {
        Payment payment = new Payment();
        payment.setUserId(userId);
        payment.setBookingId(bookingId);
        payment.setTransactionId("TXN" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        payment.setAmount(amount);
        payment.setCurrency(currency);
        payment.setBookingType(bookingType);
        payment.setPaymentMethod("CARD");
        payment.setTransactionDate(LocalDateTime.now());

        // Store only last 4 digits
        if (cardNumber != null && cardNumber.length() >= 4) {
            payment.setCardNumber("****" + cardNumber.substring(cardNumber.length() - 4));
        }

        // Detect card type
        if (cardNumber != null && cardNumber.startsWith("4")) {
            payment.setCardType("VISA");
        } else if (cardNumber != null && (cardNumber.startsWith("5") || cardNumber.startsWith("2"))) {
            payment.setCardType("MASTERCARD");
        } else {
            payment.setCardType("OTHER");
        }

        // Mock payment validation
        boolean isValidCard = validateMockCard(cardNumber);

        if (isValidCard) {
            payment.setStatus("SUCCESS");
        } else {
            payment.setStatus("FAILED");
            payment.setFailureReason("Invalid card number or insufficient funds");
        }

        return paymentRepository.save(payment);
    }

    private boolean validateMockCard(String cardNumber) {
        // Mock validation - accept test cards
        if (cardNumber == null) return false;

        // Test cards that always succeed
        String[] validTestCards = {
                "4242424242424242", // Visa
                "5555555555554444", // Mastercard
                "378282246310005",  // Amex
                "6011111111111117"  // Discover
        };

        for (String testCard : validTestCards) {
            if (cardNumber.replace(" ", "").equals(testCard)) {
                return true;
            }
        }

        // Simulate 90% success rate for other cards
        return Math.random() > 0.1;
    }

    public List<Payment> getUserPayments(String userId) {
        return paymentRepository.findByUserIdOrderByTransactionDateDesc(userId);
    }

    public Payment getPaymentByTransactionId(String transactionId) {
        return paymentRepository.findByTransactionId(transactionId);
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }
}