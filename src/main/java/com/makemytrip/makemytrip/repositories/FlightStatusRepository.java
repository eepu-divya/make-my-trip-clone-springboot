package com.makemytrip.makemytrip.repositories;

import com.makemytrip.makemytrip.models.FlightStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FlightStatusRepository extends MongoRepository<FlightStatus, String> {
    FlightStatus findByFlightId(String flightId);
    FlightStatus findByFlightNumber(String flightNumber);
}