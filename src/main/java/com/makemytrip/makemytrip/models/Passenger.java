package com.makemytrip.makemytrip.models;

public class Passenger {
    private String name;
    private int age;
    private String gender;
    private String seatNumber;
    private boolean hasSpecialAssistance;
    private boolean hasSpecialMeal;
    private String passportNumber; // For international flights
    private String nationality; // For international flights

    public Passenger() {
    }

    public Passenger(String name, int age, String gender, String seatNumber) {
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.seatNumber = seatNumber;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    public boolean isHasSpecialAssistance() {
        return hasSpecialAssistance;
    }

    public void setHasSpecialAssistance(boolean hasSpecialAssistance) {
        this.hasSpecialAssistance = hasSpecialAssistance;
    }

    public boolean isHasSpecialMeal() {
        return hasSpecialMeal;
    }

    public void setHasSpecialMeal(boolean hasSpecialMeal) {
        this.hasSpecialMeal = hasSpecialMeal;
    }

    public String getPassportNumber() {
        return passportNumber;
    }

    public void setPassportNumber(String passportNumber) {
        this.passportNumber = passportNumber;
    }

    public String getNationality() {
        return nationality;
    }

    public void setNationality(String nationality) {
        this.nationality = nationality;
    }
}