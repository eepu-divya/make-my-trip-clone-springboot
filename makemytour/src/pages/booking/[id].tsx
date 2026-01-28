import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PaymentModal from '@/components/PaymentModal';
import { bookFlightWithPayment, bookHotelWithPayment, getflight, gethotel } from '@/api';
import { Plane, Hotel, Users, Calendar, MapPin, Check } from 'lucide-react';

export default function BookingPage() {
  const router = useRouter();
  const { id, type } = router.query;
  const user = useSelector((state: any) => state.user.user);

  const [itemData, setItemData] = useState<any>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);

  // Seat map for flights (example: 6 rows, 6 seats per row)
  const seatRows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const seatNumbers = Array.from({ length: 20 }, (_, i) => i + 1);

  // Room types for hotels
  const roomTypes = [
    { id: '101', type: 'Standard', price: 100, available: true, features: ['Queen Bed', 'WiFi', 'TV'] },
    { id: '102', type: 'Standard', price: 100, available: true, features: ['Queen Bed', 'WiFi', 'TV'] },
    { id: '201', type: 'Deluxe', price: 150, available: true, features: ['King Bed', 'WiFi', 'TV', 'Mini Bar'] },
    { id: '202', type: 'Deluxe', price: 150, available: false, features: ['King Bed', 'WiFi', 'TV', 'Mini Bar'] },
    { id: '301', type: 'Suite', price: 250, available: true, features: ['King Bed', 'WiFi', 'TV', 'Mini Bar', 'Jacuzzi', 'Balcony'] },
    { id: '302', type: 'Suite', price: 250, available: true, features: ['King Bed', 'WiFi', 'TV', 'Mini Bar', 'Jacuzzi', 'Balcony'] },
  ];

  useEffect(() => {
    if (id && type) {
      loadItemData();
    }
  }, [id, type]);

  useEffect(() => {
    calculateTotal();
  }, [selectedSeats, selectedRooms, itemData]);

  const loadItemData = async () => {
    try {
      if (type === 'flight') {
        const flights = await getflight();
        const flight = flights.find((f: any) => f._id === id);
        setItemData(flight);
      } else if (type === 'hotel') {
        const hotels = await gethotel();
        const hotel = hotels.find((h: any) => h._id === id);
        setItemData(hotel);
      }
    } catch (error) {
      console.error('Error loading item:', error);
    }
  };

  const calculateTotal = () => {
    if (!itemData) return;

    if (type === 'flight') {
      const basePrice = itemData.price || 0;
      const premiumSeats = selectedSeats.filter(s => s.includes('A') || s.includes('F')).length;
      const regularSeats = selectedSeats.length - premiumSeats;
      setTotalPrice(basePrice * selectedSeats.length + premiumSeats * 50);
    } else if (type === 'hotel') {
      const roomsTotal = selectedRooms.reduce((sum, roomId) => {
        const room = roomTypes.find(r => r.id === roomId);
        return sum + (room?.price || 0);
      }, 0);
      setTotalPrice(roomsTotal);
    }
  };

  const toggleSeat = (seat: string) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const toggleRoom = (roomId: string) => {
    const room = roomTypes.find(r => r.id === roomId);
    if (!room?.available) return;

    if (selectedRooms.includes(roomId)) {
      setSelectedRooms(selectedRooms.filter(r => r !== roomId));
    } else {
      setSelectedRooms([...selectedRooms, roomId]);
    }
  };

  const getSeatClass = (seat: string) => {
    const isSelected = selectedSeats.includes(seat);
    const isPremium = seat.includes('A') || seat.includes('F');
    const isOccupied = Math.random() > 0.7; // Simulate some occupied seats

    if (isOccupied && !isSelected) {
      return 'bg-gray-300 cursor-not-allowed';
    }
    if (isSelected) {
      return 'bg-green-500 text-white';
    }
    if (isPremium) {
      return 'bg-purple-100 hover:bg-purple-200 border-purple-300';
    }
    return 'bg-blue-100 hover:bg-blue-200 border-blue-300';
  };

  const handleProceedToPayment = () => {
    if (type === 'flight' && selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }
    if (type === 'hotel' && selectedRooms.length === 0) {
      alert('Please select at least one room');
      return;
    }
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    try {
      setLoading(true);
      // Booking is already created by the payment process
      alert('Booking confirmed! Check your email for details.');
      router.push('/profile');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Please Login</CardTitle>
            <CardDescription>You need to be logged in to make a booking</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/')} className="w-full">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!itemData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Complete Your Booking</h1>
          <p className="text-gray-600">Select your preferences and proceed to payment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Selection Area */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {type === 'flight' ? <Plane className="w-5 h-5" /> : <Hotel className="w-5 h-5" />}
                  {type === 'flight' ? 'Select Your Seats' : 'Select Your Rooms'}
                </CardTitle>
                <CardDescription>
                  {type === 'flight' 
                    ? 'Choose your preferred seats. Window seats (A, F) have a premium charge of $50.'
                    : 'Choose your preferred rooms. Different room types have different prices.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {type === 'flight' ? (
                  <div className="space-y-6">
                    {/* Legend */}
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 border border-blue-300 rounded"></div>
                        <span>Available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-100 border border-purple-300 rounded"></div>
                        <span>Premium (+$50)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-500 rounded"></div>
                        <span>Selected</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-300 rounded"></div>
                        <span>Occupied</span>
                      </div>
                    </div>

                    {/* Seat Map */}
                    <div className="bg-white p-6 rounded-lg border">
                      <div className="text-center mb-4 text-sm font-semibold text-gray-600">
                        ✈️ Front of Aircraft
                      </div>
                      <div className="space-y-2">
                        {seatNumbers.map(num => (
                          <div key={num} className="flex items-center gap-2">
                            <span className="w-8 text-sm text-gray-500 font-semibold">{num}</span>
                            <div className="flex gap-2">
                              {seatRows.slice(0, 3).map(row => {
                                const seat = `${num}${row}`;
                                return (
                                  <button
                                    key={seat}
                                    onClick={() => toggleSeat(seat)}
                                    className={`w-10 h-10 rounded border-2 text-xs font-semibold transition-all ${getSeatClass(seat)}`}
                                    disabled={getSeatClass(seat).includes('cursor-not-allowed')}
                                  >
                                    {row}
                                  </button>
                                );
                              })}
                              <div className="w-6"></div>
                              {seatRows.slice(3).map(row => {
                                const seat = `${num}${row}`;
                                return (
                                  <button
                                    key={seat}
                                    onClick={() => toggleSeat(seat)}
                                    className={`w-10 h-10 rounded border-2 text-xs font-semibold transition-all ${getSeatClass(seat)}`}
                                    disabled={getSeatClass(seat).includes('cursor-not-allowed')}
                                  >
                                    {row}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {roomTypes.map(room => (
                      <Card
                        key={room.id}
                        className={`cursor-pointer transition-all ${
                          selectedRooms.includes(room.id)
                            ? 'ring-2 ring-green-500 bg-green-50'
                            : room.available
                            ? 'hover:shadow-lg'
                            : 'opacity-50 cursor-not-allowed'
                        }`}
                        onClick={() => toggleRoom(room.id)}
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{room.type}</CardTitle>
                            {selectedRooms.includes(room.id) && (
                              <Check className="w-5 h-5 text-green-600" />
                            )}
                          </div>
                          <CardDescription>Room {room.id}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <p className="text-2xl font-bold text-green-600">${room.price}/night</p>
                            <div className="space-y-1">
                              {room.features.map((feature, idx) => (
                                <p key={idx} className="text-sm text-gray-600 flex items-center gap-1">
                                  <Check className="w-3 h-3 text-green-500" />
                                  {feature}
                                </p>
                              ))}
                            </div>
                            <p className={`text-sm font-semibold ${room.available ? 'text-green-600' : 'text-red-600'}`}>
                              {room.available ? 'Available' : 'Occupied'}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">
                    {type === 'flight' ? itemData.flightName : itemData.hotelName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {type === 'flight' 
                      ? `${itemData.from} → ${itemData.to}`
                      : itemData.location}
                  </p>
                </div>

                <div className="border-t pt-4 space-y-2">
                  {type === 'flight' ? (
                    <>
                      <div className="flex justify-between text-sm">
                        <span>Selected Seats:</span>
                        <span className="font-semibold">{selectedSeats.length}</span>
                      </div>
                      {selectedSeats.length > 0 && (
                        <div className="text-xs text-gray-600">
                          {selectedSeats.join(', ')}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between text-sm">
                        <span>Selected Rooms:</span>
                        <span className="font-semibold">{selectedRooms.length}</span>
                      </div>
                      {selectedRooms.length > 0 && (
                        <div className="text-xs text-gray-600 space-y-1">
                          {selectedRooms.map(roomId => {
                            const room = roomTypes.find(r => r.id === roomId);
                            return (
                              <div key={roomId} className="flex justify-between">
                                <span>{room?.type} ({roomId})</span>
                                <span>${room?.price}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-green-600">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={handleProceedToPayment}
                  disabled={
                    (type === 'flight' && selectedSeats.length === 0) ||
                    (type === 'hotel' && selectedRooms.length === 0)
                  }
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500"
                >
                  Proceed to Payment
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Secure payment powered by MakeMyTrip
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <PaymentModal
          isOpen={showPayment}
          onClose={() => setShowPayment(false)}
          bookingDetails={{
            userId: user._id,
            bookingId: `BK${Date.now()}`,
            amount: totalPrice,
            currency: 'USD',
            bookingType: type === 'flight' ? 'FLIGHT' : 'HOTEL',
            itemName: type === 'flight' ? itemData.flightName : itemData.hotelName
          }}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}