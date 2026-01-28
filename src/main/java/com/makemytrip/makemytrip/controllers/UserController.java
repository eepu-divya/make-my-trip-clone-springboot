package com.makemytrip.makemytrip.controllers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.makemytrip.makemytrip.models.Users;
import com.makemytrip.makemytrip.services.UserServices;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "*")
public class UserController {
    @Autowired
    private UserServices userServices;

    @PostMapping("/login")
    public Users login(@RequestParam String email,@RequestParam String password){
        return userServices.login(email,password);
    }
    @PostMapping("/signup")
    public ResponseEntity<Users> signup(@RequestBody Users user){
        return ResponseEntity.ok(userServices.signup(user));
    }
    @GetMapping("/email")
    public ResponseEntity<Users> getuserbyemail(@RequestParam String email){
        Users user = userServices.getUserByEmail(email);
        if(user != null){
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }
    @PostMapping("/edit")
    public Users editprofile(@RequestParam String id ,@RequestBody Users updatedUser){
        return userServices.editprofile(id,updatedUser);
    }

    @PutMapping("/{userId}/preferences")
    public ResponseEntity<Users> updatePreferences(@PathVariable String userId,
                                                   @RequestParam(required = false) String currency,
                                                   @RequestParam(required = false) String language,
                                                   @RequestParam(required = false) String preferences) {
        Users user = userServices.getUserById(userId);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        if (currency != null) {
            user.setPreferredCurrency(currency);
        }
        if (language != null) {
            user.setPreferredLanguage(language);
        }
        if (preferences != null) {
            user.getTravelPreferences().clear();
            for (String pref : preferences.split(",")) {
                user.getTravelPreferences().add(pref.trim());
            }
        }

        Users updated = userServices.updateUser(user);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<Users> getUserById(@PathVariable String userId) {
        Users user = userServices.getUserById(userId);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }
}