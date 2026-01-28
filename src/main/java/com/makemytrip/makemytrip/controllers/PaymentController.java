package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.models.Payment;
import com.makemytrip.makemytrip.services.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payment")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/process")
    public ResponseEntity<Payment> processPayment(@RequestParam String userId,
                                                  @RequestParam String bookingId,
                                                  @RequestParam double amount,
                                                  @RequestParam(defaultValue = "USD") String currency,
                                                  @RequestParam String cardNumber,
                                                  @RequestParam String bookingType) {
        try {
            Payment payment = paymentService.processPayment(userId, bookingId, amount,
                    currency, cardNumber, bookingType);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Payment>> getUserPayments(@PathVariable String userId) {
        List<Payment> payments = paymentService.getUserPayments(userId);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/transaction/{transactionId}")
    public ResponseEntity<Payment> getPaymentByTransaction(@PathVariable String transactionId) {
        Payment payment = paymentService.getPaymentByTransactionId(transactionId);
        if (payment != null) {
            return ResponseEntity.ok(payment);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/all")
    public ResponseEntity<List<Payment>> getAllPayments() {
        List<Payment> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(payments);
    }
}