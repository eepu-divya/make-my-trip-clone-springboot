package com.makemytrip.makemytrip.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendBookingConfirmation(String to, String bookingId, String bookingType,
                                        String itemName, String date, double price) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("Booking Confirmation - " + bookingId);

            String htmlContent = buildBookingConfirmationEmail(bookingId, bookingType, itemName, date, price);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            // Log error but don't fail the booking
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }

    public void sendPriceDropAlert(String to, String itemName, double oldPrice, double newPrice) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Price Drop Alert - " + itemName);
            message.setText(String.format(
                    "Good news! The price for %s has dropped from $%.2f to $%.2f.\n\n" +
                            "Book now to save $%.2f!\n\n" +
                            "Visit MakeMyTrip to complete your booking.",
                    itemName, oldPrice, newPrice, (oldPrice - newPrice)
            ));

            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send price alert: " + e.getMessage());
        }
    }

    public void sendCancellationConfirmation(String to, String bookingId, double refundAmount) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Booking Cancellation - " + bookingId);
            message.setText(String.format(
                    "Your booking %s has been cancelled successfully.\n\n" +
                            "Refund Amount: $%.2f\n" +
                            "The refund will be processed within 5-7 business days.\n\n" +
                            "Thank you for using MakeMyTrip.",
                    bookingId, refundAmount
            ));

            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send cancellation email: " + e.getMessage());
        }
    }

    private String buildBookingConfirmationEmail(String bookingId, String bookingType,
                                                 String itemName, String date, double price) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head><style>" +
                "body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }" +
                ".container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                ".header { background: #007bff; color: white; padding: 20px; text-align: center; }" +
                ".content { background: #f9f9f9; padding: 20px; margin: 20px 0; }" +
                ".detail { margin: 10px 0; }" +
                ".label { font-weight: bold; }" +
                ".footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }" +
                "</style></head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'><h1>Booking Confirmed!</h1></div>" +
                "<div class='content'>" +
                "<p>Thank you for booking with MakeMyTrip!</p>" +
                "<div class='detail'><span class='label'>Booking ID:</span> " + bookingId + "</div>" +
                "<div class='detail'><span class='label'>Type:</span> " + bookingType + "</div>" +
                "<div class='detail'><span class='label'>Details:</span> " + itemName + "</div>" +
                "<div class='detail'><span class='label'>Date:</span> " + date + "</div>" +
                "<div class='detail'><span class='label'>Total Price:</span> $" + String.format("%.2f", price) + "</div>" +
                "<p style='margin-top: 20px;'>Your e-ticket has been generated. Please carry a valid ID proof during your journey.</p>" +
                "<p><strong>Cancellation Policy:</strong> Free cancellation up to 24 hours before departure.</p>" +
                "<p><strong>Support:</strong> For any queries, contact us at support@makemytrip.com or call 1-800-123-4567</p>" +
                "</div>" +
                "<div class='footer'>" +
                "<p>This is an automated email. Please do not reply.</p>" +
                "<p>&copy; 2024 MakeMyTrip. All rights reserved.</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }
}