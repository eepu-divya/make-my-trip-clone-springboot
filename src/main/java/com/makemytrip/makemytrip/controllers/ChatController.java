package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.models.ChatMessage;
import com.makemytrip.makemytrip.services.ChatService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/session")
    public Map<String, String> createSession() {
        String sessionId = chatService.createSession();
        Map<String, String> response = new HashMap<>();
        response.put("sessionId", sessionId);
        return response;
    }

    @PostMapping("/message")
    public ChatMessage sendMessage(@RequestParam String sessionId,
                                   @RequestParam String userId,
                                   @RequestParam String userName,
                                   @RequestParam String message) {
        return chatService.getBotResponse(sessionId, userId, userName, message);
    }

    @GetMapping("/history/{sessionId}")
    public List<ChatMessage> getChatHistory(@PathVariable String sessionId) {
        return chatService.getChatHistory(sessionId);
    }

    @PostMapping("/resolve/{sessionId}")
    public ChatMessage markAsResolved(@PathVariable String sessionId) {
        return chatService.markAsResolved(sessionId);
    }

    @MessageMapping("/chat.send")
    @SendTo("/topic/messages")
    public ChatMessage sendWebSocketMessage(ChatMessage message) {
        return chatService.saveMessage(
                message.getSessionId(),
                message.getUserId(),
                message.getUserName(),
                message.getMessage(),
                message.getSender()
        );
    }
}