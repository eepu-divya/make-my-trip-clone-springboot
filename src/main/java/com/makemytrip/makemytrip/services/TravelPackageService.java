package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.TravelPackage;
import com.makemytrip.makemytrip.repositories.TravelPackageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TravelPackageService {

    @Autowired
    private TravelPackageRepository packageRepository;

    public TravelPackage createPackage(TravelPackage travelPackage) {
        travelPackage.setCreatedAt(LocalDateTime.now());
        travelPackage.setUpdatedAt(LocalDateTime.now());
        travelPackage.setActive(true);

        // Calculate final price with discount
        double finalPrice = travelPackage.getBasePrice() * (1 - travelPackage.getDiscountPercentage() / 100);
        travelPackage.setFinalPrice(finalPrice);

        return packageRepository.save(travelPackage);
    }

    public List<TravelPackage> getAllActivePackages() {
        return packageRepository.findByActive(true);
    }

    public List<TravelPackage> getPackagesByType(String packageType) {
        return packageRepository.findByPackageType(packageType);
    }

    public List<TravelPackage> getPackagesByDestination(String destination) {
        return packageRepository.findByDestination(destination);
    }

    public Optional<TravelPackage> getPackageById(String id) {
        return packageRepository.findById(id);
    }

    public TravelPackage updatePackage(String id, TravelPackage updatedPackage) {
        Optional<TravelPackage> existingOpt = packageRepository.findById(id);
        if (!existingOpt.isPresent()) {
            throw new RuntimeException("Package not found");
        }

        TravelPackage existing = existingOpt.get();
        existing.setPackageName(updatedPackage.getPackageName());
        existing.setDescription(updatedPackage.getDescription());
        existing.setDestination(updatedPackage.getDestination());
        existing.setDurationDays(updatedPackage.getDurationDays());
        existing.setFlightIds(updatedPackage.getFlightIds());
        existing.setHotelIds(updatedPackage.getHotelIds());
        existing.setTourActivities(updatedPackage.getTourActivities());
        existing.setBasePrice(updatedPackage.getBasePrice());
        existing.setDiscountPercentage(updatedPackage.getDiscountPercentage());
        existing.setPackageType(updatedPackage.getPackageType());
        existing.setMaxGroupSize(updatedPackage.getMaxGroupSize());
        existing.setCustomizable(updatedPackage.isCustomizable());
        existing.setInclusions(updatedPackage.getInclusions());
        existing.setExclusions(updatedPackage.getExclusions());
        existing.setUpdatedAt(LocalDateTime.now());

        // Recalculate final price
        double finalPrice = existing.getBasePrice() * (1 - existing.getDiscountPercentage() / 100);
        existing.setFinalPrice(finalPrice);

        return packageRepository.save(existing);
    }

    public void deletePackage(String id) {
        packageRepository.deleteById(id);
    }

    public TravelPackage deactivatePackage(String id) {
        Optional<TravelPackage> packageOpt = packageRepository.findById(id);
        if (!packageOpt.isPresent()) {
            throw new RuntimeException("Package not found");
        }

        TravelPackage travelPackage = packageOpt.get();
        travelPackage.setActive(false);
        travelPackage.setUpdatedAt(LocalDateTime.now());
        return packageRepository.save(travelPackage);
    }
}