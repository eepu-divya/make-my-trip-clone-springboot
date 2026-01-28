package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.ChatMessage;
import com.makemytrip.makemytrip.repositories.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ChatService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    public ChatMessage saveMessage(String sessionId, String userId, String userName,
                                   String message, String sender) {
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setSessionId(sessionId);
        chatMessage.setUserId(userId);
        chatMessage.setUserName(userName);
        chatMessage.setMessage(message);
        chatMessage.setSender(sender);
        chatMessage.setTimestamp(LocalDateTime.now());
        chatMessage.setSentiment(analyzeSentiment(message));
        chatMessage.setResolved(false);

        return chatMessageRepository.save(chatMessage);
    }

    public ChatMessage getBotResponse(String sessionId, String userId, String userName, String userMessage) {
        // Save user message first
        saveMessage(sessionId, userId, userName, userMessage, "USER");

        // Generate bot response
        String botResponse = generateBotResponse(userMessage);

        ChatMessage botMessage = new ChatMessage();
        botMessage.setSessionId(sessionId);
        botMessage.setUserId(userId);
        botMessage.setUserName("Support Bot");
        botMessage.setMessage(botResponse);
        botMessage.setSender("BOT");
        botMessage.setTimestamp(LocalDateTime.now());
        botMessage.setSentiment("NEUTRAL");
        botMessage.setResolved(false);

        return chatMessageRepository.save(botMessage);
    }

    public List<ChatMessage> getChatHistory(String sessionId) {
        return chatMessageRepository.findBySessionIdOrderByTimestampAsc(sessionId);
    }

    public String createSession() {
        return "SESSION_" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private String generateBotResponse(String userMessage) {
        String message = userMessage.toLowerCase();

        if (message.contains("cancel") || message.contains("refund")) {
            return "To cancel your booking, please go to 'My Bookings' section and click on the 'Cancel' button. " +
                    "Refunds are processed within 5-7 business days. For bookings cancelled more than 24 hours before departure, " +
                    "you'll receive a 100% refund.";
        } else if (message.contains("payment") || message.contains("card")) {
            return "We accept all major credit cards (Visa, Mastercard, Amex). For testing, you can use card number " +
                    "4242 4242 4242 4242. Your payment information is secure and encrypted.";
        } else if (message.contains("booking") || message.contains("book")) {
            return "To make a booking, search for flights or hotels, select your preferred option, and proceed to payment. " +
                    "You'll receive a confirmation email with your booking details and e-ticket.";
        } else if (message.contains("loyalty") || message.contains("points")) {
            return "You earn 1 loyalty point for every $1 spent. Points can be redeemed for discounts (100 points = $1). " +
                    "We have three tiers: Silver, Gold (5000+ points), and Platinum (10000+ points) with increasing benefits!";
        } else if (message.contains("flight status") || message.contains("delay")) {
            return "You can check real-time flight status in the 'Flight Status' section. We'll notify you of any delays " +
                    "or gate changes via email and SMS.";
        } else if (message.contains("help") || message.contains("support")) {
            return "I'm here to help! You can ask me about:\n" +
                    "- Booking flights and hotels\n" +
                    "- Cancellations and refunds\n" +
                    "- Payment methods\n" +
                    "- Loyalty program\n" +
                    "- Flight status\n" +
                    "Or type 'agent' to connect with a live support agent.";
        } else if (message.contains("agent") || message.contains("human")) {
            return "Connecting you to a live agent... Please hold. Our average wait time is 2-3 minutes. " +
                    "In the meantime, you can also email us at support@makemytrip.com or call 1-800-123-4567.";
        } else {
            return "Thank you for your message! I'm here to assist you with bookings, cancellations, payments, and more. " +
                    "Could you please provide more details about what you need help with? Type 'help' to see what I can do.";
        }
    }

    private String analyzeSentiment(String message) {
        String msg = message.toLowerCase();

        // Negative keywords
        if (msg.contains("bad") || msg.contains("terrible") || msg.contains("awful") ||
                msg.contains("hate") || msg.contains("worst") || msg.contains("angry") ||
                msg.contains("frustrated") || msg.contains("disappointed")) {
            return "NEGATIVE";
        }

        // Positive keywords
        if (msg.contains("good") || msg.contains("great") || msg.contains("excellent") ||
                msg.contains("love") || msg.contains("best") || msg.contains("thank") ||
                msg.contains("happy") || msg.contains("amazing")) {
            return "POSITIVE";
        }

        return "NEUTRAL";
    }

    public ChatMessage markAsResolved(String sessionId) {
        List<ChatMessage> messages = chatMessageRepository.findBySessionIdOrderByTimestampAsc(sessionId);
        if (!messages.isEmpty()) {
            ChatMessage lastMessage = messages.get(messages.size() - 1);
            lastMessage.setResolved(true);
            return chatMessageRepository.save(lastMessage);
        }
        return null;
    }
}