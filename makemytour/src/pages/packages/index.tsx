import { useState, useEffect } from 'react';
import { getAllPackages, getPackagesByType } from '@/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, MapPin, Calendar, Users, Plane, Hotel, Activity } from 'lucide-react';

export default function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [selectedType, setSelectedType] = useState('ALL');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async (type?: string) => {
    setLoading(true);
    try {
      const data = type && type !== 'ALL'
        ? await getPackagesByType(type)
        : await getAllPackages();
      setPackages(data);
    } catch (error) {
      console.error('Error loading packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    loadPackages(type);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'BEACH': return 'bg-blue-100 text-blue-700';
      case 'ADVENTURE': return 'bg-green-100 text-green-700';
      case 'CULTURAL': return 'bg-purple-100 text-purple-700';
      case 'LUXURY': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Travel Packages</h1>
          <p className="text-gray-600">Discover amazing deals on complete travel packages</p>
        </div>

        {/* Filter Tabs */}
        <Tabs value={selectedType} onValueChange={handleTypeChange} className="mb-8">
          <TabsList className="grid w-full grid-cols-5 border border-gray-500">
            <TabsTrigger value="ALL">All Packages</TabsTrigger>
            <TabsTrigger value="BEACH">Beach</TabsTrigger>
            <TabsTrigger value="ADVENTURE">Adventure</TabsTrigger>
            <TabsTrigger value="CULTURAL">Cultural</TabsTrigger>
            <TabsTrigger value="LUXURY">Luxury</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Packages Grid */}
        {loading ? (
          <div className="text-center py-12">Loading packages...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg: any) => (
              <Card key={pkg._id} className="hover:shadow-xl transition-shadow overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 relative">
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(pkg.packageType)}`}>
                      {pkg.packageType}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-2xl font-bold mb-1">{pkg.packageName}</h3>
                    <p className="flex items-center gap-1 text-sm">
                      <MapPin className="w-4 h-4" />
                      {pkg.destination}
                    </p>
                  </div>
                </div>

                <CardHeader>
                  <CardDescription className="line-clamp-2">{pkg.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Package Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{pkg.durationDays} days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span>Max {pkg.maxGroupSize}</span>
                    </div>
                  </div>

                  {/* Inclusions */}
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-700">Includes:</p>
                    <div className="flex flex-wrap gap-2">
                      {pkg.flightIds?.length > 0 && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                          <Plane className="w-3 h-3" />
                          Flights
                        </span>
                      )}
                      {pkg.hotelIds?.length > 0 && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
                          <Hotel className="w-3 h-3" />
                          Hotels
                        </span>
                      )}
                      {pkg.tourActivities?.length > 0 && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs">
                          <Activity className="w-3 h-3" />
                          {pkg.tourActivities.length} Activities
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="border-t pt-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xs text-gray-500 line-through">${pkg.basePrice}</p>
                        <p className="text-2xl font-bold text-green-600">${pkg.finalPrice}</p>
                        <p className="text-xs text-green-600">Save {pkg.discountPercentage}%</p>
                      </div>
                      <Button className="bg-gradient-to-r from-blue-500 to-purple-500">
                        Book Now
                      </Button>
                    </div>
                  </div>

                  {/* Customizable Badge */}
                  {pkg.customizable && (
                    <div className="text-center">
                      <span className="text-xs text-purple-600 font-semibold">
                        ✨ Customizable Package
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && packages.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No packages found
              </h3>
              <p className="text-gray-500">
                Try selecting a different category
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}