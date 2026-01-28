package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.models.TravelPackage;
import com.makemytrip.makemytrip.services.TravelPackageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/packages")
@CrossOrigin(origins = "*")
public class TravelPackageController {

    @Autowired
    private TravelPackageService packageService;

    @PostMapping("/create")
    public ResponseEntity<TravelPackage> createPackage(@RequestBody TravelPackage travelPackage) {
        try {
            TravelPackage created = packageService.createPackage(travelPackage);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<TravelPackage>> getAllActivePackages() {
        List<TravelPackage> packages = packageService.getAllActivePackages();
        return ResponseEntity.ok(packages);
    }

    @GetMapping("/type/{packageType}")
    public ResponseEntity<List<TravelPackage>> getPackagesByType(@PathVariable String packageType) {
        List<TravelPackage> packages = packageService.getPackagesByType(packageType);
        return ResponseEntity.ok(packages);
    }

    @GetMapping("/destination/{destination}")
    public ResponseEntity<List<TravelPackage>> getPackagesByDestination(@PathVariable String destination) {
        List<TravelPackage> packages = packageService.getPackagesByDestination(destination);
        return ResponseEntity.ok(packages);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TravelPackage> getPackageById(@PathVariable String id) {
        return packageService.getPackageById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<TravelPackage> updatePackage(@PathVariable String id,
                                                       @RequestBody TravelPackage travelPackage) {
        try {
            TravelPackage updated = packageService.updatePackage(id, travelPackage);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePackage(@PathVariable String id) {
        packageService.deletePackage(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<TravelPackage> deactivatePackage(@PathVariable String id) {
        try {
            TravelPackage deactivated = packageService.deactivatePackage(id);
            return ResponseEntity.ok(deactivated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}