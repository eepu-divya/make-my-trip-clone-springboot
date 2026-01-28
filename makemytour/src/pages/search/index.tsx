import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { searchFlights, searchHotels, getAutocomplete, getSearchHistory } from '@/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plane, Hotel, Filter, History, Star } from 'lucide-react';

export default function SearchPage() {
  const user = useSelector((state: any) => state.user.user);
  const [searchType, setSearchType] = useState('flights');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [autocomplete, setAutocomplete] = useState([]);

  // Flight filters
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [airline, setAirline] = useState('');
  const [maxStops, setMaxStops] = useState('');

  // Hotel filters
  const [location, setLocation] = useState('');
  const [minRating, setMinRating] = useState('');
  const [amenities, setAmenities] = useState('');

  useEffect(() => {
    if (user?._id) {
      loadSearchHistory();
    }
  }, [user]);

  const loadSearchHistory = async () => {
    try {
      const data = await getSearchHistory(user._id, 5);
      setSearchHistory(data);
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  };

  const handleAutocomplete = async (query: string, type: string) => {
    if (query.length < 2) {
      setAutocomplete([]);
      return;
    }
    try {
      const data = await getAutocomplete(query, type);
      setAutocomplete(data);
    } catch (error) {
      console.error('Error getting autocomplete:', error);
    }
  };

  const handleSearchFlights = async () => {
    setLoading(true);
    try {
      const data = await searchFlights(
        user?._id,
        from,
        to,
        minPrice ? parseFloat(minPrice) : undefined,
        maxPrice ? parseFloat(maxPrice) : undefined,
        airline,
        maxStops ? parseInt(maxStops) : undefined
      );
      setResults(data);
      if (user?._id) loadSearchHistory();
    } catch (error) {
      console.error('Error searching flights:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchHotels = async () => {
    setLoading(true);
    try {
      const data = await searchHotels(
        user?._id,
        location,
        minPrice ? parseFloat(minPrice) : undefined,
        maxPrice ? parseFloat(maxPrice) : undefined,
        minRating ? parseFloat(minRating) : undefined,
        amenities
      );
      setResults(data);
      if (user?._id) loadSearchHistory();
    } catch (error) {
      console.error('Error searching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Search className="w-10 h-10 text-blue-500" />
            Advanced Search
          </h1>
          <p className="text-gray-600">Find the perfect flight or hotel with powerful filters</p>
        </div>

        <Tabs value={searchType} onValueChange={setSearchType} className="space-y-6">
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

          {/* Flight Search */}
          <TabsContent value="flights">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Search Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">From</label>
                    <Input
                      placeholder="Departure city..."
                      value={from}
                      onChange={(e) => {
                        setFrom(e.target.value);
                        handleAutocomplete(e.target.value, 'FLIGHT');
                      }}
                    />
                    {autocomplete.length > 0 && from && (
                      <div className="mt-1 bg-white border rounded-md shadow-lg">
                        {autocomplete.map((item, index) => (
                          <div
                            key={index}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setFrom(item);
                              setAutocomplete([]);
                            }}
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">To</label>
                    <Input
                      placeholder="Arrival city..."
                      value={to}
                      onChange={(e) => {
                        setTo(e.target.value);
                        handleAutocomplete(e.target.value, 'FLIGHT');
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Min Price</label>
                    <Input
                      type="number"
                      placeholder="$0"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Max Price</label>
                    <Input
                      type="number"
                      placeholder="$10000"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Airline</label>
                    <Input
                      placeholder="e.g., Delta"
                      value={airline}
                      onChange={(e) => setAirline(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Max Stops</label>
                    <Input
                      type="number"
                      placeholder="0 for direct"
                      value={maxStops}
                      onChange={(e) => setMaxStops(e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={handleSearchFlights} disabled={loading} className="w-full bg-gradient-to-r from-blue-500 to-purple-500">
                  {loading ? 'Searching...' : 'Search Flights'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hotel Search */}
          <TabsContent value="hotels">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Search Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium mb-2 block">Location</label>
                    <Input
                      placeholder="City or destination..."
                      value={location}
                      onChange={(e) => {
                        setLocation(e.target.value);
                        handleAutocomplete(e.target.value, 'HOTEL');
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Min Price (per night)</label>
                    <Input
                      type="number"
                      placeholder="$0"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Max Price (per night)</label>
                    <Input
                      type="number"
                      placeholder="$1000"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Min Rating</label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="0-5"
                      value={minRating}
                      onChange={(e) => setMinRating(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Amenities</label>
                    <Input
                      placeholder="e.g., WiFi, Pool"
                      value={amenities}
                      onChange={(e) => setAmenities(e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={handleSearchHotels} disabled={loading} className="w-full bg-gradient-to-r from-blue-500 to-purple-500">
                  {loading ? 'Searching...' : 'Search Hotels'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Search History */}
        {user && searchHistory.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Recent Searches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {searchHistory.map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{item.searchQuery}</span>
                    <span className="text-xs text-gray-500">{item.resultCount} results</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Search Results ({results.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((item: any) => (
                <Card key={item._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {item.flightName || item.hotelName}
                    </CardTitle>
                    <CardDescription>
                      {item.from && item.to ? `${item.from} → ${item.to}` : item.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {item.averageRating > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(item.averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">({item.totalReviews})</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-green-600">
                          ${item.price || item.pricePerNight}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.pricePerNight ? 'per night' : item.stops === 0 ? 'Direct' : `${item.stops} stop(s)`}
                        </p>
                      </div>
                      <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500">
                        Book
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}