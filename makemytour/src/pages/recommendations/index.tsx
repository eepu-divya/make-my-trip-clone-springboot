import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getRecommendedFlights, getRecommendedHotels, getRecommendationReason } from '@/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Plane, Hotel, Info } from 'lucide-react';

export default function RecommendationsPage() {
  const user = useSelector((state: any) => state.user.user);
  const [flights, setFlights] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedReason, setSelectedReason] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?._id) {
      loadRecommendations();
    }
  }, [user]);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const [flightsData, hotelsData] = await Promise.all([
        getRecommendedFlights(user._id, 10),
        getRecommendedHotels(user._id, 10)
      ]);
      setFlights(flightsData);
      setHotels(hotelsData);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const showReason = async (itemId: string, itemType: string) => {
    try {
      const data = await getRecommendationReason(itemId, itemType, user._id);
      setSelectedReason({ itemId, reason: data.reason });
    } catch (error) {
      console.error('Error getting reason:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Please Login</CardTitle>
            <CardDescription>You need to be logged in to view personalized recommendations</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Sparkles className="w-10 h-10 text-purple-500" />
            Recommended For You
          </h1>
          <p className="text-gray-600">Personalized suggestions based on your preferences and booking history</p>
        </div>

        <Tabs defaultValue="flights" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2 border border-gray-500">
            <TabsTrigger value="flights" className="flex items-center gap-2">
              <Plane className="w-4 h-4" />
              Flights
            </TabsTrigger>
            <TabsTrigger value="hotels" className="flex items-center gap-2">
              <Hotel className="w-4 h-4" />
              Hotels
            </TabsTrigger>
          </TabsList>

          {/* Flights Tab */}
          <TabsContent value="flights">
            {loading ? (
              <div className="text-center py-12">Loading recommendations...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {flights.map((flight: any) => (
                  <Card key={flight._id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{flight.flightName}</CardTitle>
                          <CardDescription>{flight.airline}</CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => showReason(flight._id, 'FLIGHT')}
                        >
                          <Info className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{flight.from}</span>
                        <Plane className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{flight.to}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500">Departure</p>
                          <p className="font-medium">{flight.departureTime}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Arrival</p>
                          <p className="font-medium">{flight.arrivalTime}</p>
                        </div>
                      </div>

                      {flight.averageRating > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < Math.floor(flight.averageRating) ? 'text-yellow-400' : 'text-gray-300'}>
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            ({flight.totalReviews} reviews)
                          </span>
                        </div>
                      )}

                      {selectedReason?.itemId === flight._id && (
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <p className="text-sm text-purple-700 flex items-start gap-2">
                            <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            {selectedReason.reason}
                          </p>
                        </div>
                      )}

                      <div className="border-t pt-4 flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-green-600">${flight.price}</p>
                          <p className="text-xs text-gray-500">{flight.stops === 0 ? 'Direct' : `${flight.stops} stop(s)`}</p>
                        </div>
                        <Button className="bg-gradient-to-r from-purple-500 to-blue-500">
                          Book Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Hotels Tab */}
          <TabsContent value="hotels">
            {loading ? (
              <div className="text-center py-12">Loading recommendations...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hotels.map((hotel: any) => (
                  <Card key={hotel._id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{hotel.hotelName}</CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <Hotel className="w-3 h-3" />
                            {hotel.location}
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => showReason(hotel._id, 'HOTEL')}
                        >
                          <Info className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {hotel.averageRating > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < Math.floor(hotel.averageRating) ? 'text-yellow-400' : 'text-gray-300'}>
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            ({hotel.totalReviews} reviews)
                          </span>
                        </div>
                      )}

                      {hotel.amenities && (
                        <div className="flex flex-wrap gap-2">
                          {hotel.amenities.split(',').slice(0, 3).map((amenity: string, index: number) => (
                            <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                              {amenity.trim()}
                            </span>
                          ))}
                        </div>
                      )}

                      {selectedReason?.itemId === hotel._id && (
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <p className="text-sm text-purple-700 flex items-start gap-2">
                            <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            {selectedReason.reason}
                          </p>
                        </div>
                      )}

                      <div className="border-t pt-4 flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-green-600">${hotel.pricePerNight}</p>
                          <p className="text-xs text-gray-500">per night</p>
                        </div>
                        <Button className="bg-gradient-to-r from-purple-500 to-blue-500">
                          Book Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {!loading && flights.length === 0 && hotels.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No recommendations yet
              </h3>
              <p className="text-gray-500">
                Start booking to get personalized recommendations!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}