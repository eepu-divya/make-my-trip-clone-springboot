package com.makemytrip.makemytrip.repositories;

import com.makemytrip.makemytrip.models.LoyaltyProgram;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LoyaltyProgramRepository extends MongoRepository<LoyaltyProgram, String> {
    LoyaltyProgram findByUserId(String userId);
}