package com.makemytrip.makemytrip.models;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "hotels")
public class Hotel {
    @Id
    private String _id;
    private String hotelName;
    private String location;
    private double pricePerNight;
    private double basePricePerNight; // For dynamic pricing
    private int availableRooms;
    private int totalRooms;
    private String amenities;
    private String[] amenitiesList;
    private double averageRating;
    private int totalReviews;
    private String roomTypeLayout; // JSON string for room configuration
    private double demandMultiplier; // For dynamic pricing
    private String[] roomTypes; // STANDARD, DELUXE, SUITE
    // Getters and Setters
    public String getId() {
        return _id;
    }

    public void setId(String id) {
        this._id = id;
    }

    public void setAmenities(String amenities) {
        this.amenities = amenities;
    }

    public String getAmenities() {
        return amenities;
    }

    public String gethotelName() {
        return hotelName;
    }

    public void sethotelName(String hotelName) {
        this.hotelName = hotelName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public int getAvailableRooms() {
        return availableRooms;
    }

    public void setAvailableRooms(int availableRooms) {
        this.availableRooms = availableRooms;
    }

    public double getPricePerNight() {
        return pricePerNight;
    }

    public void setPricePerNight(double pricePerNight) {
        this.pricePerNight = pricePerNight;
    }

    public double getBasePricePerNight() {
        return basePricePerNight;
    }

    public void setBasePricePerNight(double basePricePerNight) {
        this.basePricePerNight = basePricePerNight;
    }

    public int getTotalRooms() {
        return totalRooms;
    }

    public void setTotalRooms(int totalRooms) {
        this.totalRooms = totalRooms;
    }

    public String[] getAmenitiesList() {
        return amenitiesList;
    }

    public void setAmenitiesList(String[] amenitiesList) {
        this.amenitiesList = amenitiesList;
    }

    public double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(double averageRating) {
        this.averageRating = averageRating;
    }

    public int getTotalReviews() {
        return totalReviews;
    }

    public void setTotalReviews(int totalReviews) {
        this.totalReviews = totalReviews;
    }

    public String getRoomTypeLayout() {
        return roomTypeLayout;
    }

    public void setRoomTypeLayout(String roomTypeLayout) {
        this.roomTypeLayout = roomTypeLayout;
    }

    public double getDemandMultiplier() {
        return demandMultiplier;
    }

    public void setDemandMultiplier(double demandMultiplier) {
        this.demandMultiplier = demandMultiplier;
    }

    public String[] getRoomTypes() {
        return roomTypes;
    }

    public void setRoomTypes(String[] roomTypes) {
        this.roomTypes = roomTypes;
    }
}