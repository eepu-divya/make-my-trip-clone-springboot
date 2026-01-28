import axios from "axios";

const BACKEND_URL = "http://localhost:8080";

export const login = async (email, password) => {
  if (!BACKEND_URL) throw new Error("API URL not configured");
  try {
    const url = `${BACKEND_URL}/user/login`;
    const res = await axios.post(url, null, { params: { email, password } });
    return res.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const signup = async (
  firstName,
  lastName,
  email,
  phoneNumber,
  password
) => {
  if (!BACKEND_URL) throw new Error("API URL not configured");
  try {
    const res = await axios.post(`${BACKEND_URL}/user/signup`, {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
    });
    return res.data;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};

export const getuserbyemail = async (email) => {
  if (!BACKEND_URL) throw new Error("API URL not configured");
  try {
    const res = await axios.get(`${BACKEND_URL}/user/email`, { params: { email } });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const editprofile = async (
  id,
  firstName,
  lastName,
  email,
  phoneNumber
) => {
  if (!BACKEND_URL) throw new Error("API URL not configured");
  try {
    const res = await axios.post(`${BACKEND_URL}/user/edit`, {
      firstName,
      lastName,
      email,
      phoneNumber,
    }, { params: { id } });
    return res.data;
  } catch (error) {
    console.error("Edit profile error:", error);
    throw error;
  }
};

export const getflight = async () => {
  if (!BACKEND_URL) throw new Error("API URL not configured");
  try {
    const res = await axios.get(`${BACKEND_URL}/flight`);
    return res.data;
  } catch (error) {
    console.error("Get flight error:", error);
    throw error;
  }
};

export const addflight = async (
  flightName,
  from,
  to,
  departureTime,
  arrivalTime,
  price,
  availableSeats
) => {
  if (!BACKEND_URL) throw new Error("API URL not configured");
  try {
    const res = await axios.post(`${BACKEND_URL}/admin/flight`, {
      flightName,
      from,
      to,
      departureTime,
      arrivalTime,
      price,
      availableSeats,
    });
    return res.data;
  } catch (error) {
    console.error("Add flight error:", error);
    throw error;
  }
};

export const editflight = async (
  id,
  flightName,
  from,
  to,
  departureTime,
  arrivalTime,
  price,
  availableSeats
) => {
  if (!BACKEND_URL) throw new Error("API URL not configured");
  try {
    const res = await axios.put(`${BACKEND_URL}/admin/flight/${id}`, {
      flightName,
      from,
      to,
      departureTime,
      arrivalTime,
      price,
      availableSeats,
    });
    return res.data;
  } catch (error) {
    console.error("Edit flight error:", error);
    throw error;
  }
};

export const gethotel = async () => {
  if (!BACKEND_URL) throw new Error("API URL not configured");
  try {
    const res = await axios.get(`${BACKEND_URL}/hotel`);
    return res.data;
  } catch (error) {
    console.error("Get hotel error:", error);
    throw error;
  }
};

export const addhotel = async (
  hotelName,
  location,
  pricePerNight,
  availableRooms,
  amenities
) => {
  if (!BACKEND_URL) throw new Error("API URL not configured");
  try {
    const res = await axios.post(`${BACKEND_URL}/admin/hotel`, {
      hotelName,
      location,
      pricePerNight,
      availableRooms,
      amenities,
    });
    return res.data;
  } catch (error) {
    console.error("Add hotel error:", error);
    throw error;
  }
};

export const edithotel = async (
  id,
  hotelName,
  location,
  pricePerNight,
  availableRooms,
  amenities
) => {
  if (!BACKEND_URL) throw new Error("API URL not configured");
  try {
    const res = await axios.put(`${BACKEND_URL}/admin/hotel/${id}`, {
      hotelName,
      location,
      pricePerNight,
      availableRooms,
      amenities,
    });
    return res.data;
  } catch (error) {
    console.error("Edit hotel error:", error);
    throw error;
  }
};

export const handleflightbooking = async (userId, flightId, seats, price) => {
  if (!BACKEND_URL) throw new Error("API URL not configured");
  try {
    const url = `${BACKEND_URL}/booking/flight`;
    const res = await axios.post(url, null, { params: { userId, flightId, seats, price } });
    return res.data;
  } catch (error) {
    console.error("Flight booking error:", error);
    throw error;
  }
};

export const handlehotelbooking = async (userId, hotelId, rooms, price) => {
  if (!BACKEND_URL) throw new Error("API URL not configured");
  try {
    const url = `${BACKEND_URL}/booking/hotel`;
    const res = await axios.post(url, null, { params: { userId, hotelId, rooms, price } });
    return res.data;
  } catch (error) {
    console.error("Hotel booking error:", error);
    throw error;
  }
};

// ============ WISHLIST APIs ============
export const createWishlist = async (userId, folderName) => {
  if (!BACKEND_URL) throw new Error("API URL not configured");
  try {
    const res = await axios.post(
      `${BACKEND_URL}/wishlist/create`, null, { params: { userId, folderName } }
    );
    return res.data;
  } catch (error) {
    console.error("Wishlist creation error:", error);
    throw error;
  }
};

export const addToWishlist = async (
  wishlistId,
  itemId,
  itemType,
  priceDropAlert = false
) => {
  if (!BACKEND_URL) throw new Error("API URL not configured");
  try {
    const res = await axios.post(
      `${BACKEND_URL}/wishlist/${wishlistId}/add-item`,
      null,
      {
        params: { itemId, itemType, priceDropAlert },
      }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getUserWishlists = async (userId) => {
  if (!BACKEND_URL) throw new Error("API URL not configured");
  try {
    const res = await axios.get(`${BACKEND_URL}/wishlist/user/${userId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const removeFromWishlist = async (wishlistId, itemId) => {
  if (!BACKEND_URL) throw new Error("API URL not configured");
  try {
    const res = await axios.delete(
      `${BACKEND_URL}/wishlist/${wishlistId}/remove-item`,
      {
        params: { itemId },
      }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

// ============ PAYMENT APIs ============
export const processPayment = async (
  userId,
  bookingId,
  amount,
  currency,
  cardNumber,
  bookingType
) => {
  if (!BACKEND_URL) throw new Error("API URL not configured");
  try {
    // Removed candidates loop - straightforward call
    const res = await axios.post(`${BACKEND_URL}/payment/process`, null, {
      params: {
        userId,
        bookingId,
        amount,
        currency,
        cardNumber,
        bookingType,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Payment error:", error);
    throw error;
  }
};

export const getUserPayments = async (userId) => {
  if (!BACKEND_URL) throw new Error("API URL not configured");
  try {
    const res = await axios.get(`${BACKEND_URL}/payment/user/${userId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// ============ BOOKING WITH PAYMENT APIs ============
export const bookFlightWithPayment = async (
  userId,
  flightId,
  seats,
  price,
  cardNumber,
  selectedSeats,
  currency = "USD"
) => {
  if (!BACKEND_URL) throw new Error("API URL not configured");
  try {
    const res = await axios.post(
      `${BACKEND_URL}/booking/flight/with-payment`,
      null,
      {
        params: {
          userId,
          flightId,
          seats,
          price,
          cardNumber,
          selectedSeats,
          currency,
        },
      }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const bookHotelWithPayment = async (
  userId,
  hotelId,
  rooms,
  price,
  cardNumber,
  selectedRooms,
  currency = "USD"
) => {
  if (!BACKEND_URL) throw new Error("API URL not configured");
  try {
    const res = await axios.post(
      `${BACKEND_URL}/booking/hotel/with-payment`,
      null,
      {
        params: {
          userId,
          hotelId,
          rooms,
          price,
          cardNumber,
          selectedRooms,
          currency,
        },
      }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const cancelBooking = async (userId, bookingId, cancellationReason) => {
  if (!BACKEND_URL) throw new Error("API URL not configured");
  try {
    const res = await axios.post(`${BACKEND_URL}/booking/cancel`, null, {
      params: { userId, bookingId, cancellationReason },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// ============ SEARCH APIs ============
export const searchFlights = async (
  userId,
  from,
  to,
  minPrice,
  maxPrice,
  airline,
  maxStops
) => {
  if (!BACKEND_URL) throw new Error("API URL not configured");
  try {
    const res = await axios.get(`${BACKEND_URL}/search/flights`, {
      params: { userId, from, to, minPrice, maxPrice, airline, maxStops },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const searchHotels = async (
  userId,
  location,
  minPrice,
  maxPrice,
  minRating,
  amenities
) => {
  if (!BACKEND_URL) throw new Error("API URL not configured");
  try {
    const res = await axios.get(`${BACKEND_URL}/search/hotels`, {
      params: { userId, location, minPrice, maxPrice, minRating, amenities },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getAutocomplete = async (query, type) => {
  if (!BACKEND_URL) throw new Error("API URL not configured");
  try {
    const res = await axios.get(`${BACKEND_URL}/search/autocomplete`, {
      params: { query, type },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getSearchHistory = async (userId, limit = 10) => {
  if (!BACKEND_URL) throw new Error("API URL not configured");
  try {
    const res = await axios.get(`${BACKEND_URL}/search/history/${userId}`, {
      params: { limit },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// ============ REVIEW APIs ============
export const createReview = async (
  userId,
  userName,
  itemId,
  itemType,
  rating,
  title,
  comment
) => {
  if (!BACKEND_URL) throw new Error("API URL not configured");
  try {
    const res = await axios.post(`${BACKEND_URL}/review/create`, null, {
      params: { userId, userName, itemId, itemType, rating, title, comment },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getReviews = async (itemId, itemType) => {
  if (!BACKEND_URL) throw new Error("API URL not configured");
  try {
    const res = await axios.get(`${BACKEND_URL}/review/item/${itemId}`, {
      params: { itemType },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const markReviewHelpful = async (reviewId, userId) => {
  if (!BACKEND_URL) throw new Error("API URL not configured");
  try {
    const res = await axios.post(
      `${BACKEND_URL}/review/${reviewId}/helpful`,
      null,
      {
        params: { userId },
      }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

// ============ LOYALTY APIs ============
export const getLoyaltyProgram = async (userId) => {
  if (!BACKEND_URL) throw new Error("API URL not configured");
  try {
    const res = await axios.get(`${BACKEND_URL}/loyalty/${userId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const redeemPoints = async (userId, points, description) => {
  if (!BACKEND_URL) throw new Error("API URL not configured");
  try {
    const res = await axios.post(
      `${BACKEND_URL}/loyalty/${userId}/redeem`,
      null,
      {
        params: { points, description },
      }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const calculateDiscount = async (userId, points) => {
  if (!BACKEND_URL) throw new Error("API URL not configured");
  try {
    const res = await axios.get(
      `${BACKEND_URL}/loyalty/${userId}/calculate-discount`,
      {
        params: { points },
      }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

// ============ TRAVEL PACKAGES APIs ============
export const getAllPackages = async () => {
  if (!BACKEND_URL) throw new Error("API URL not configured");
  try {
    // Direct call, no candidates loop.
    const res = await axios.get(`${BACKEND_URL}/packages/all`);
    return res.data;
  } catch (error) {
    console.error("Packages error:", error);
    throw error;
  }
};

export const getPackagesByType = async (packageType) => {
  if (!BACKEND_URL) throw new Error("API URL not configured");
  try {
    const res = await axios.get(`${BACKEND_URL}/packages/type/${packageType}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// ============ FLIGHT STATUS APIs ============
export const getFlightStatus = async (flightId) => {
  if (!BACKEND_URL) throw new Error("API URL not configured");
  try {
    const res = await axios.get(
      `${BACKEND_URL}/flight-status/flight/${flightId}`
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getFlightStatusByNumber = async (flightNumber) => {
  if (!BACKEND_URL) throw new Error("API URL not configured");
  try {
    const res = await axios.get(
      `${BACKEND_URL}/flight-status/number/${flightNumber}`
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

// ============ RECOMMENDATIONS APIs ============
export const getRecommendedHotels = async (userId, limit = 10) => {
  if (!BACKEND_URL) throw new Error("API URL not configured");
  try {
    const res = await axios.get(
      `${BACKEND_URL}/recommendations/hotels/${userId}`,
      {
        params: { limit },
      }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getRecommendedFlights = async (userId, limit = 10) => {
  if (!BACKEND_URL) throw new Error("API URL not configured");
  try {
    const res = await axios.get(
      `${BACKEND_URL}/recommendations/flights/${userId}`,
      {
        params: { limit },
      }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getRecommendationReason = async (itemId, itemType, userId) => {
  if (!BACKEND_URL) throw new Error("API URL not configured");
  try {
    const res = await axios.get(`${BACKEND_URL}/recommendations/reason`, {
      params: { itemId, itemType, userId },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// ============ CURRENCY APIs ============
export const convertCurrency = async (amount, from, to) => {
  if (!BACKEND_URL) throw new Error("API URL not configured");
  try {
    const res = await axios.get(`${BACKEND_URL}/currency/convert`, {
      params: { amount, from, to },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getCurrencyRates = async () => {
  if (!BACKEND_URL) throw new Error("API URL not configured");
  try {
    const res = await axios.get(`${BACKEND_URL}/currency/rates`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// ============ CHAT APIs ============
export const createChatSession = async () => {
  if (!BACKEND_URL) throw new Error("API URL not configured");
  try {
    const res = await axios.post(`${BACKEND_URL}/chat/session`);
    return res.data;
  } catch (error) {
    console.error("Chat session error:", error);
    throw error;
  }
};

export const sendChatMessage = async (sessionId, userId, userName, message) => {
  if (!BACKEND_URL) throw new Error("API URL not configured");
  try {
    const res = await axios.post(`${BACKEND_URL}/chat/message`, null, {
      params: { sessionId, userId, userName, message },
    });
    return res.data;
  } catch (error) {
    console.error("Chat message error:", error);
    throw error;
  }
};

export const getChatHistory = async (sessionId) => {
  if (!BACKEND_URL) throw new Error("API URL not configured");
  try {
    const res = await axios.get(`${BACKEND_URL}/chat/history/${sessionId}`);
    return res.data;
  } catch (error) {
    console.error("Chat history error:", error);
    throw error;
  }
};

// ============ ADMIN ANALYTICS APIs ============
export const getBookingAnalytics = async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/admin/analytics/bookings`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getPopularHotels = async () => {
  try {
    const res = await axios.get(
      `${BACKEND_URL}/admin/analytics/popular-hotels`
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getPopularFlights = async () => {
  try {
    const res = await axios.get(
      `${BACKEND_URL}/admin/analytics/popular-flights`
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getRevenueChart = async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/admin/analytics/revenue-chart`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// ============ USER PREFERENCES APIs ============
export const updateUserPreferences = async (
  userId,
  currency,
  language,
  preferences
) => {
  if (!userId) {
    throw new Error("User ID is required");
  }
  try {
    const res = await axios.put(
      `${BACKEND_URL}/user/${userId}/preferences?currency=${currency}&language=${language}`
    );
    return res.data;
  } catch (error) {
    console.error(
      "Update preferences error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    const res = await axios.get(`${BACKEND_URL}/user/${userId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// ============ TRANSACTION LOG APIs ============
export const getTransactionLog = async (userId) => {
  try {
    const res = await axios.get(
      `${BACKEND_URL}/payment/transactions/${userId}`
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getAllTransactions = async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/admin/transactions`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// ============ EMAIL NOTIFICATION APIs ============
export const sendBookingConfirmationEmail = async (userId, bookingId) => {
  try {
    const res = await axios.post(
      `${BACKEND_URL}/email/booking-confirmation`,
      null,
      {
        params: { userId, bookingId },
      }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

// ============ USER ACTIVITY APIs ============
export const logUserActivity = async (userId, action, details) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/admin/log-activity`, null, {
      params: { userId, action, details },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getUserActivities = async (userId) => {
  try {
    const res = await axios.get(`${BACKEND_URL}/admin/activities/${userId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};