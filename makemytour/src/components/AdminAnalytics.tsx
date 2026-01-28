import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar, 
  Download,
  Plane,
  Building2,
  Activity,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { getBookingAnalytics, getPopularHotels, getPopularFlights, getRevenueChart } from '@/api';

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [popularHotels, setPopularHotels] = useState<any[]>([]);
  const [popularFlights, setPopularFlights] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [analyticsData, hotels, flights, revenue] = await Promise.all([
        getBookingAnalytics(),
        getPopularHotels(),
        getPopularFlights(),
        getRevenueChart()
      ]);
      
      setAnalytics(analyticsData);
      setPopularHotels(hotels);
      setPopularFlights(flights);
      setRevenueData(revenue);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => Object.values(item).join(',')).join('\n');
    const csv = `${headers}\n${rows}`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Bookings',
      value: analytics?.totalBookings || 0,
      change: analytics?.bookingsChange || 0,
      icon: Calendar,
      color: 'blue'
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(analytics?.totalRevenue || 0),
      change: analytics?.revenueChange || 0,
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Active Users',
      value: analytics?.activeUsers || 0,
      change: analytics?.usersChange || 0,
      icon: Users,
      color: 'purple'
    },
    {
      title: 'Avg. Booking Value',
      value: formatCurrency(analytics?.avgBookingValue || 0),
      change: analytics?.avgValueChange || 0,
      icon: TrendingUp,
      color: 'orange'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Date Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
          <CardDescription>Monitor your business performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              />
            </div>
            <Button onClick={loadAnalytics}>
              Apply Filter
            </Button>
            <Button variant="outline" className='text-white' onClick={() => exportToCSV(revenueData, 'revenue_report')}>
              <Download className="w-4 h-4 mr-2 " />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.change >= 0;
          const colorClasses = {
            blue: 'bg-blue-100 text-blue-600',
            green: 'bg-green-100 text-green-600',
            purple: 'bg-purple-100 text-purple-600',
            orange: 'bg-orange-100 text-orange-600'
          };

          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-semibold ${
                    isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {Math.abs(stat.change).toFixed(1)}%
                  </div>
                </div>
                <h3 className="text-sm text-gray-600 mb-1">{stat.title}</h3>
                <p className="text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trends</CardTitle>
          <CardDescription>Last 30 days revenue breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {revenueData.length > 0 ? (
              <div className="h-64 relative">
                {/* Simple bar chart visualization */}
                <div className="flex items-end justify-between h-full gap-2">
                  {revenueData.slice(0, 15).map((day: any, index: number) => {
                    const maxRevenue = Math.max(...revenueData.map((d: any) => d.revenue));
                    const height = (day.revenue / maxRevenue) * 100;
                    
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center group">
                        <div
                          className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg transition-all hover:from-blue-600 hover:to-purple-600 cursor-pointer relative"
                          style={{ height: `${height}%`, minHeight: '8px' }}
                          title={`${day.date}: ${formatCurrency(day.revenue)}`}
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {formatCurrency(day.revenue)}
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left">
                          {new Date(day.date).getDate()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Activity className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No revenue data available</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Popular Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Flights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plane className="w-5 h-5" />
              Popular Flights
            </CardTitle>
            <CardDescription>Most booked flights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {popularFlights.length > 0 ? (
                popularFlights.map((flight: any, index: number) => (
                  <div key={flight._id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold">{flight.flightName}</p>
                        <p className="text-sm text-gray-600">
                          {flight.from} → {flight.to}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">{flight.bookingCount}</p>
                      <p className="text-xs text-gray-500">bookings</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">No flight data available</p>
              )}
              <Button
                variant="outline"
                className="w-full text-white"
                onClick={() => exportToCSV(popularFlights, 'popular_flights')}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Flights Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Popular Hotels */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Popular Hotels
            </CardTitle>
            <CardDescription>Most booked hotels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {popularHotels.length > 0 ? (
                popularHotels.map((hotel: any, index: number) => (
                  <div key={hotel._id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold">{hotel.hotelName}</p>
                        <p className="text-sm text-gray-600">{hotel.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{hotel.bookingCount}</p>
                      <p className="text-xs text-gray-500">bookings</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">No hotel data available</p>
              )}
              <Button
                variant="outline"
                className="w-full text-white"
                onClick={() => exportToCSV(popularHotels, 'popular_hotels')}
              >
                <Download className="w-4 h-4 mr-2 text-white" />
                Export Hotels Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>Latest user actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {analytics?.recentActivities?.length > 0 ? (
              analytics.recentActivities.map((activity: any, index: number) => (
                <div key={index} className="flex items-center gap-3 p-3 border-l-4 border-blue-500 bg-gray-50 rounded">
                  <div className="flex-1">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.user}</p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    {new Date(activity.timestamp).toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-gray-500">No recent activities</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}