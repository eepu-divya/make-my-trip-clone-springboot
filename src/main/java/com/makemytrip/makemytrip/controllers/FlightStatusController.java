package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.models.FlightStatus;
import com.makemytrip.makemytrip.services.FlightStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/flight-status")
@CrossOrigin(origins = "*")
public class FlightStatusController {

    @Autowired
    private FlightStatusService flightStatusService;

    @GetMapping("/flight/{flightId}")
    public ResponseEntity<FlightStatus> getFlightStatus(@PathVariable String flightId) {
        FlightStatus status = flightStatusService.getFlightStatus(flightId);
        return ResponseEntity.ok(status);
    }

    @GetMapping("/number/{flightNumber}")
    public ResponseEntity<FlightStatus> getFlightStatusByNumber(@PathVariable String flightNumber) {
        FlightStatus status = flightStatusService.getFlightStatusByNumber(flightNumber);
        return ResponseEntity.ok(status);
    }

    @PutMapping("/update")
    public ResponseEntity<Void> updateFlightStatus(@RequestParam String flightId,
                                                   @RequestParam String status,
                                                   @RequestParam(defaultValue = "0") int delayMinutes,
                                                   @RequestParam(required = false) String delayReason) {
        try {
            flightStatusService.updateFlightStatus(flightId, status, delayMinutes, delayReason);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}