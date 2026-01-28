package com.makemytrip.makemytrip.repositories;

import com.makemytrip.makemytrip.models.TravelPackage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TravelPackageRepository extends MongoRepository<TravelPackage, String> {
    List<TravelPackage> findByActive(boolean active);
    List<TravelPackage> findByPackageType(String packageType);
    List<TravelPackage> findByDestination(String destination);
}