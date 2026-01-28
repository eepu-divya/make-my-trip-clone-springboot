package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.FlightStatus;
import com.makemytrip.makemytrip.repositories.FlightStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Random;

@Service
public class FlightStatusService {

    @Autowired
    private FlightStatusRepository flightStatusRepository;

    private final Random random = new Random();

    public FlightStatus getFlightStatus(String flightId) {
        FlightStatus status = flightStatusRepository.findByFlightId(flightId);
        if (status == null) {
            status = generateMockFlightStatus(flightId);
        }
        return status;
    }

    public FlightStatus getFlightStatusByNumber(String flightNumber) {
        FlightStatus status = flightStatusRepository.findByFlightNumber(flightNumber);
        if (status == null) {
            status = generateMockFlightStatusByNumber(flightNumber);
        }
        return status;
    }

    private FlightStatus generateMockFlightStatus(String flightId) {
        FlightStatus status = new FlightStatus();
        status.setFlightId(flightId);
        status.setFlightNumber("FL" + (1000 + random.nextInt(9000)));

        // Random status
        String[] statuses = {"ON_TIME", "ON_TIME", "ON_TIME", "DELAYED", "BOARDING", "DEPARTED"};
        String randomStatus = statuses[random.nextInt(statuses.length)];
        status.setStatus(randomStatus);

        LocalDateTime now = LocalDateTime.now();
        status.setScheduledDeparture(now.plusHours(2));
        status.setScheduledArrival(now.plusHours(5));

        if ("DELAYED".equals(randomStatus)) {
            int delayMinutes = 30 + random.nextInt(120); // 30-150 minutes
            status.setDelayMinutes(delayMinutes);
            status.setEstimatedArrival(status.getScheduledArrival().plusMinutes(delayMinutes));

            String[] reasons = {
                    "Weather conditions",
                    "Technical maintenance",
                    "Air traffic congestion",
                    "Crew availability",
                    "Previous flight delay"
            };
            status.setDelayReason(reasons[random.nextInt(reasons.length)]);
        } else {
            status.setDelayMinutes(0);
            status.setEstimatedArrival(status.getScheduledArrival());
        }

        if ("DEPARTED".equals(randomStatus)) {
            status.setActualDeparture(now.minusMinutes(30));
        }

        status.setGate("G" + (1 + random.nextInt(50)));
        status.setTerminal("T" + (1 + random.nextInt(3)));
        status.setLastUpdated(LocalDateTime.now());

        return flightStatusRepository.save(status);
    }

    private FlightStatus generateMockFlightStatusByNumber(String flightNumber) {
        FlightStatus status = new FlightStatus();
        status.setFlightNumber(flightNumber);
        status.setFlightId("MOCK_" + flightNumber);

        String[] statuses = {"ON_TIME", "ON_TIME", "DELAYED", "BOARDING"};
        String randomStatus = statuses[random.nextInt(statuses.length)];
        status.setStatus(randomStatus);

        LocalDateTime now = LocalDateTime.now();
        status.setScheduledDeparture(now.plusHours(1));
        status.setScheduledArrival(now.plusHours(4));

        if ("DELAYED".equals(randomStatus)) {
            int delayMinutes = 45 + random.nextInt(90);
            status.setDelayMinutes(delayMinutes);
            status.setEstimatedArrival(status.getScheduledArrival().plusMinutes(delayMinutes));
            status.setDelayReason("Weather conditions");
        } else {
            status.setDelayMinutes(0);
            status.setEstimatedArrival(status.getScheduledArrival());
        }

        status.setGate("G" + (1 + random.nextInt(50)));
        status.setTerminal("T" + (1 + random.nextInt(3)));
        status.setLastUpdated(LocalDateTime.now());

        return flightStatusRepository.save(status);
    }

    public void updateFlightStatus(String flightId, String newStatus, int delayMinutes, String delayReason) {
        FlightStatus status = flightStatusRepository.findByFlightId(flightId);
        if (status == null) {
            throw new RuntimeException("Flight status not found");
        }

        status.setStatus(newStatus);
        status.setDelayMinutes(delayMinutes);
        status.setDelayReason(delayReason);

        if (delayMinutes > 0) {
            status.setEstimatedArrival(status.getScheduledArrival().plusMinutes(delayMinutes));
        }

        status.setLastUpdated(LocalDateTime.now());
        flightStatusRepository.save(status);
    }
}