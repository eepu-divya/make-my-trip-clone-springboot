import { useState } from 'react';
import { getFlightStatusByNumber } from '@/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plane, Clock, AlertCircle, CheckCircle, MapPin } from 'lucide-react';

export default function FlightStatusPage() {
  const [flightNumber, setFlightNumber] = useState('');
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!flightNumber.trim()) return;

    setLoading(true);
    setError('');
    try {
      const data = await getFlightStatusByNumber(flightNumber);
      setStatus(data);
    } catch (err) {
      setError('Flight not found. Please check the flight number and try again.');
      setStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ON_TIME': return 'text-green-600 bg-green-50';
      case 'DELAYED': return 'text-red-600 bg-red-50';
      case 'CANCELLED': return 'text-gray-600 bg-gray-50';
      case 'BOARDING': return 'text-blue-600 bg-blue-50';
      case 'DEPARTED': return 'text-purple-600 bg-purple-50';
      case 'ARRIVED': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ON_TIME':
      case 'ARRIVED':
        return <CheckCircle className="w-6 h-6" />;
      case 'DELAYED':
      case 'CANCELLED':
        return <AlertCircle className="w-6 h-6" />;
      default:
        return <Plane className="w-6 h-6" />;
    }
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Plane className="w-10 h-10 text-blue-500" />
            Flight Status
          </h1>
          <p className="text-gray-600">Check real-time flight status and updates</p>
        </div>

        {/* Search Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Track Your Flight</CardTitle>
            <CardDescription>Enter your flight number to get real-time status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Enter flight number (e.g., FL1234)"
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={loading} className="bg-gradient-to-r from-blue-500 to-purple-500">
                {loading ? 'Searching...' : 'Track Flight'}
              </Button>
            </div>
            {error && (
              <p className="text-red-600 text-sm mt-2">{error}</p>
            )}
          </CardContent>
        </Card>

        {/* Status Display */}
        {status && (
          <div className="space-y-6">
            {/* Status Header */}
            <Card className={`border-2 ${getStatusColor(status.status)}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{status.flightNumber}</h2>
                    <p className="text-gray-600">Flight ID: {status.flightId}</p>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${getStatusColor(status.status)}`}>
                    {getStatusIcon(status.status)}
                    <span className="font-bold text-lg">{status.status.replace('_', ' ')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Flight Times */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-gray-600">Scheduled Departure</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{formatTime(status.scheduledDeparture)}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-gray-600">Scheduled Arrival</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{formatTime(status.scheduledArrival)}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-gray-600">Estimated Arrival</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{formatTime(status.estimatedArrival)}</p>
                  {status.delayMinutes > 0 && (
                    <p className="text-sm text-red-600 mt-1">+{status.delayMinutes} min delay</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Gate and Terminal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    Gate Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Terminal:</span>
                      <span className="font-bold text-xl">{status.terminal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gate:</span>
                      <span className="font-bold text-xl">{status.gate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {status.delayMinutes > 0 && (
                <Card className="bg-red-50 border-red-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-700">
                      <AlertCircle className="w-5 h-5" />
                      Delay Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Delay:</span>
                        <span className="font-bold text-red-700">{status.delayMinutes} minutes</span>
                      </div>
                      {status.delayReason && (
                        <div>
                          <span className="text-gray-700 block mb-1">Reason:</span>
                          <p className="text-sm text-gray-800">{status.delayReason}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {status.actualDeparture && (
                <Card className="bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="w-5 h-5" />
                      Actual Departure
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-green-700">
                      {formatTime(status.actualDeparture)}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Last Updated */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Last Updated
                  </span>
                  <span className="font-medium">
                    {new Date(status.lastUpdated).toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Sample Flight Numbers */}
        {!status && !loading && (
          <Card>
            <CardHeader>
              <CardTitle>Try These Sample Flights</CardTitle>
              <CardDescription>Click on any flight number to check its status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {['FL1234', 'FL5678', 'FL9012'].map((num) => (
                  <Button
                    key={num}
                    variant="outline"
                    className='text-white'
                    onClick={() => {
                      setFlightNumber(num);
                      setTimeout(() => handleSearch(), 100);
                    }}
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}