# API Testing Guide - MakeMyTrip Clone

## Complete API Endpoint Reference

### Base URL
```
http://localhost:8080
```

---

## 1. User Management

### Sign Up
```http
POST /user/signup
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phoneNumber": "+1234567890",
  "role": "USER"
}
```

### Login
```http
POST /user/login?email=john@example.com&password=password123
```

### Get User by Email
```http
GET /user/email?email=john@example.com
```

### Update User Preferences
```http
PUT /user/{userId}/preferences?currency=USD&language=EN&preferences=BEACH,ADVENTURE
```

---

## 2. Wishlist Management

### Create Wishlist
```http
POST /wishlist/create?userId={userId}&folderName=Summer%20Vacation
```

### Add Item to Wishlist
```http
POST /wishlist/{wishlistId}/add-item?itemId={flightId}&itemType=FLIGHT&priceDropAlert=true
```

### Get User Wishlists
```http
GET /wishlist/user/{userId}
```

### Remove Item
```http
DELETE /wishlist/{wishlistId}/remove-item?itemId={itemId}
```

---

## 3. Search & Filters

### Search Flights
```http
GET /search/flights?userId={userId}&from=New%20York&to=London&minPrice=200&maxPrice=1000&airline=Delta&maxStops=1
```

### Search Hotels
```http
GET /search/hotels?userId={userId}&location=Paris&minPrice=100&maxPrice=500&minRating=4.0&amenities=WiFi
```

### Location Autocomplete
```http
GET /search/autocomplete?query=New&type=FLIGHT
```

### Recent Searches
```http
GET /search/history/{userId}?limit=10
```

---

## 4. Booking

### Book Flight (Simple)
```http
POST /booking/flight?userId={userId}&flightId={flightId}&seats=2&price=500
```

### Book Flight with Payment
```http
POST /booking/flight/with-payment
  ?userId={userId}
  &flightId={flightId}
  &seats=2
  &price=500
  &cardNumber=4242424242424242
  &selectedSeats=12A,12B
  &currency=USD
```

### Book Hotel with Payment
```http
POST /booking/hotel/with-payment
  ?userId={userId}
  &hotelId={hotelId}
  &rooms=1
  &price=300
  &cardNumber=4242424242424242
  &selectedRooms=101
  &currency=USD
```

### Cancel Booking
```http
POST /booking/cancel?userId={userId}&bookingId={bookingId}&cancellationReason=Change%20of%20plans
```

---

## 5. Payment

### Process Payment
```http
POST /payment/process
  ?userId={userId}
  &bookingId={bookingId}
  &amount=500
  &currency=USD
  &cardNumber=4242424242424242
  &bookingType=FLIGHT
```

### Get User Payments
```http
GET /payment/user/{userId}
```

### Get Payment by Transaction
```http
GET /payment/transaction/{transactionId}
```

---

## 6. Reviews & Ratings

### Create Review
```http
POST /review/create
  ?userId={userId}
  &userName=John%20Doe
  &itemId={flightId}
  &itemType=FLIGHT
  &rating=5
  &title=Excellent%20Service
  &comment=Great%20flight%20experience
```

### Get Reviews
```http
GET /review/item/{itemId}?itemType=FLIGHT
```

### Mark as Helpful
```http
POST /review/{reviewId}/helpful?userId={userId}
```

### Flag Review
```http
POST /review/{reviewId}/flag
```

### Admin Reply
```http
POST /review/{reviewId}/admin-reply?reply=Thank%20you%20for%20your%20feedback
```

---

## 7. Loyalty Program

### Get Loyalty Details
```http
GET /loyalty/{userId}
```

### Redeem Points
```http
POST /loyalty/{userId}/redeem?points=500&description=Discount%20on%20booking
```

### Calculate Discount
```http
GET /loyalty/{userId}/calculate-discount?points=1000
```

---

## 8. Travel Packages

### Create Package
```http
POST /packages/create
Content-Type: application/json

{
  "packageName": "Bali Beach Paradise",
  "description": "7 days in beautiful Bali",
  "destination": "Bali",
  "durationDays": 7,
  "flightIds": ["flight1", "flight2"],
  "hotelIds": ["hotel1"],
  "tourActivities": ["Beach tour", "Temple visit"],
  "basePrice": 2000,
  "discountPercentage": 15,
  "packageType": "BEACH",
  "maxGroupSize": 10,
  "customizable": true,
  "inclusions": ["Flights", "Hotel", "Breakfast"],
  "exclusions": ["Lunch", "Dinner"]
}
```

### Get All Packages
```http
GET /packages/all
```

### Get by Type
```http
GET /packages/type/BEACH
```

---

## 9. Flight Status

### Get Flight Status
```http
GET /flight-status/flight/{flightId}
```

### Get by Flight Number
```http
GET /flight-status/number/FL1234
```

### Update Status (Admin)
```http
PUT /flight-status/update
  ?flightId={flightId}
  &status=DELAYED
  &delayMinutes=45
  &delayReason=Weather%20conditions
```

---

## 10. Recommendations

### Get Hotel Recommendations
```http
GET /recommendations/hotels/{userId}?limit=10
```

### Get Flight Recommendations
```http
GET /recommendations/flights/{userId}?limit=10
```

### Get Recommendation Reason
```http
GET /recommendations/reason?itemId={itemId}&itemType=HOTEL&userId={userId}
```

---

## 11. Dynamic Pricing

### Update Flight Prices
```http
POST /pricing/update-flights
```

### Update Hotel Prices
```http
POST /pricing/update-hotels
```

### Get Price History
```http
GET /pricing/history?itemId={itemId}&itemType=FLIGHT
```

---

## 12. Currency Conversion

### Convert Currency
```http
GET /currency/convert?amount=100&from=USD&to=EUR
```

### Get All Rates
```http
GET /currency/rates
```

---

## 13. Chat Support

### Create Chat Session
```http
POST /chat/session
```

### Send Message
```http
POST /chat/message
  ?sessionId={sessionId}
  &userId={userId}
  &userName=John%20Doe
  &message=How%20do%20I%20cancel%20my%20booking?
```

### Get Chat History
```http
GET /chat/history/{sessionId}
```

### Mark as Resolved
```http
POST /chat/resolve/{sessionId}
```

---

## 14. Admin Analytics

### Get Booking Analytics
```http
GET /admin/analytics/bookings
```

### Popular Hotels
```http
GET /admin/analytics/popular-hotels
```

### Popular Flights
```http
GET /admin/analytics/popular-flights
```

### Revenue Chart
```http
GET /admin/analytics/revenue-chart
```

---

## 15. Admin Management

### Get All Users
```http
GET /admin/users
```

### Add Flight
```http
POST /admin/flight
Content-Type: application/json

{
  "flightName": "Delta 123",
  "airline": "Delta",
  "from": "New York",
  "to": "London",
  "departureTime": "2024-12-01T10:00:00",
  "arrivalTime": "2024-12-01T22:00:00",
  "price": 800,
  "basePrice": 800,
  "availableSeats": 150,
  "totalSeats": 180,
  "stops": 0,
  "amenities": ["WiFi", "Meals", "Entertainment"]
}
```

### Add Hotel
```http
POST /admin/hotel
Content-Type: application/json

{
  "hotelName": "Grand Plaza",
  "location": "Paris",
  "pricePerNight": 200,
  "basePricePerNight": 200,
  "availableRooms": 50,
  "totalRooms": 100,
  "amenities": "WiFi, Pool, Gym, Restaurant",
  "amenitiesList": ["WiFi", "Pool", "Gym"],
  "roomTypes": ["STANDARD", "DELUXE", "SUITE"]
}
```

### Update Flight
```http
PUT /admin/flight/{id}
Content-Type: application/json

{
  "flightName": "Delta 123",
  "from": "New York",
  "to": "London",
  "price": 850
}
```

---

## Test Data Examples

### Valid Test Cards
```
Visa: 4242424242424242
Mastercard: 5555555555554444
Amex: 378282246310005
Discover: 6011111111111117
```

### Sample User IDs
After signup, use the returned `_id` field

### Sample Booking Flow
1. Sign up user
2. Search flights/hotels
3. Add to wishlist (optional)
4. Book with payment
5. Check loyalty points
6. View booking in user profile

---

## Response Formats

### Success Response (200 OK)
```json
{
  "id": "123abc",
  "status": "SUCCESS",
  "data": { ... }
}
```

### Error Response (400 Bad Request)
```json
{
  "timestamp": "2024-01-01T10:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid parameters"
}
```

---

## Postman Collection

Import this collection for easy testing:

1. Create new collection in Postman
2. Add environment variables:
   - `baseUrl`: http://localhost:8080
   - `userId`: (set after signup)
   - `flightId`: (set after creating flight)
   - `hotelId`: (set after creating hotel)

3. Use `{{baseUrl}}/user/signup` format for all requests

---

## WebSocket Testing (Chat)

### Using JavaScript
```javascript
const socket = new SockJS('http://localhost:8080/ws-chat');
const stompClient = Stomp.over(socket);

stompClient.connect({}, function(frame) {
    console.log('Connected: ' + frame);
    
    stompClient.subscribe('/topic/messages', function(message) {
        console.log('Received: ' + message.body);
    });
    
    stompClient.send("/app/chat.send", {}, JSON.stringify({
        'sessionId': 'SESSION_123',
        'userId': 'user123',
        'userName': 'John',
        'message': 'Hello',
        'sender': 'USER'
    }));
});
```

---

## Common Issues & Solutions

### Issue: Email not sending
**Solution:** Configure Gmail app password in `application.properties`

### Issue: MongoDB connection failed
**Solution:** Check MongoDB URI in `application.properties`

### Issue: Payment always fails
**Solution:** Use test card numbers provided above

### Issue: CORS error
**Solution:** All endpoints have CORS enabled with `*` origin

---

## Performance Testing

### Load Testing Endpoints
- `/search/flights` - High traffic expected
- `/booking/flight/with-payment` - Critical path
- `/recommendations/hotels/{userId}` - Computation intensive

### Recommended Tools
- Apache JMeter
- Postman Runner
- K6

---

**Happy Testing! 🚀**
