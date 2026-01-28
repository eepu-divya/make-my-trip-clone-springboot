import React, { useState, useEffect } from "react";
import {
  User,
  Phone,
  Mail,
  Edit2,
  MapPin,
  Calendar,
  CreditCard,
  X,
  Check,
  LogOut,
  Plane,
  Building2,
  XCircle,
  DollarSign,
  Globe,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { clearUser, setUser } from "@/store";
import { editprofile, cancelBooking, getUserPayments, updateUserPreferences, convertCurrency } from "@/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD'];
const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Hindi', 'Japanese'];

const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);
  const router = useRouter();

  const logout = () => {
    dispatch(clearUser());
    if (typeof window !== 'undefined') {
      router.push("/");
    }
  };
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    firstName: user?.firstName ? user?.firstName : "",
    lastName: user?.lastName ? user?.lastName : "",
    email: user?.email ? user?.email : "",
    phoneNumber: user?.phoneNumber ? user?.phoneNumber : "",
    bookings: user?.bookings || [],
  });

  const [payments, setPayments] = useState<any[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState(user?.preferredCurrency || 'USD');
  const [selectedLanguage, setSelectedLanguage] = useState(user?.preferredLanguage || 'English');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userId = user?._id || user?.id;
    if (userId) {
      loadPayments();
    }
  }, [user]);

  const loadPayments = async () => {
    const userId = user?._id || user?.id;
    if (!userId) return;
    try {
      const data = await getUserPayments(userId);
      setPayments(data);
    } catch (error) {
      console.error('Error loading payments:', error);
    }
  };

  const [editForm, setEditForm] = useState({ ...userData });
  const handleSave = async () => {
    const userId = user?._id || user?.id;
    if (!userId) {
      alert('User session expired. Please login again.');
      return;
    }
    try {
      const data = await editprofile(
        userId,
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.phoneNumber
      );
      dispatch(setUser(data));
      setIsEditing(false);
    } catch (error) {
      setUserData(editForm);
      setIsEditing(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!cancellationReason.trim()) {
      alert('Please provide a cancellation reason');
      return;
    }

    setLoading(true);
    try {
      const userId = user?._id || user?.id;
      await cancelBooking(userId, selectedBooking._id, cancellationReason);
      alert('Booking cancelled successfully! Refund will be processed within 5-7 business days.');
      setCancelDialogOpen(false);
      setCancellationReason('');
      setSelectedBooking(null);
      // Reload user data
      window.location.reload();
    } catch (error: any) {
      console.error('Error cancelling booking:', error);
      alert(error.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setLoading(false);
    }
  };

  const handleCurrencyChange = async (currency: string) => {
    const userId = user?._id || user?.id;
    if (!userId) {
      alert('Please login to update preferences');
      return;
    }
    try {
      await updateUserPreferences(userId, currency, selectedLanguage, null);
      setSelectedCurrency(currency);
      const updatedUser = { ...user, preferredCurrency: currency };
      dispatch(setUser(updatedUser));
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error: any) {
      console.error('Error updating currency:', error);
      alert(error.response?.data?.message || 'Failed to update currency preference');
    }
  };

  const handleLanguageChange = async (language: string) => {
    const userId = user?._id || user?.id;
    if (!userId) {
      alert('Please login to update preferences');
      return;
    }
    try {
      await updateUserPreferences(userId, selectedCurrency, language, null);
      setSelectedLanguage(language);
      const updatedUser = { ...user, preferredLanguage: language };
      dispatch(setUser(updatedUser));
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error: any) {
      console.error('Error updating language:', error);
      alert(error.response?.data?.message || 'Failed to update language preference');
    }
  };

  const getRefundAmount = (booking: any) => {
    if (!booking || (!booking.date && !booking.bookingDate)) return 0;
    const bookingDate = booking.date || booking.bookingDate;
    const hoursUntilBooking = (new Date(bookingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60);
    if (hoursUntilBooking > 24) return booking.totalPrice || 0;
    if (hoursUntilBooking > 12) return (booking.totalPrice || 0) * 0.5;
    return 0;
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS': return 'text-green-600 bg-green-50';
      case 'FAILED': return 'text-red-600 bg-red-50';
      case 'PENDING': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };
  const handleEditFormChange = (field: any, value: any) => {
    setUserData((prevState) => ({
      ...prevState,
      [field]: value, // Update the specific field dynamically
    }));
  };
  // Handle redirects on client-side only
  useEffect(() => {
    if (typeof window !== 'undefined' && !user) {
      router.push('/');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Account</h1>
          <p className="text-gray-600">Manage your profile, bookings, and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6 text-black">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl text-black border border-gray-500">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Profile Section */}
              <div className="md:col-span-1">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-bold  text-black">Profile</h2>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-red-600 flex items-center space-x-1 hover:text-red-700"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={userData.firstName}
                          onChange={(e) => handleEditFormChange("firstName", e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={userData.lastName}
                          onChange={(e) => handleEditFormChange("lastName", e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500  text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={userData.email}
                          onChange={(e) => handleEditFormChange("email", e.target.value)}

                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500  text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={userData.phoneNumber}
                          onChange={(e) => handleEditFormChange("phoneNumber", e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500  text-black"
                        />
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={handleSave}
                          className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <Check className="w-4 h-4" />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setEditForm({ ...user });
                          }}
                          className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                        >
                          <X className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6  text-black">
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="font-medium">
                            {user?.firstName} {user?.lastName}
                          </p>
                          {/* <p className="text-sm text-gray-500">{userData.role}</p> */}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3  text-black">
                        <Mail className="w-5 h-5 text-gray-500 " />
                        <p>{user?.email}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-gray-500" />
                        <p>{user?.phoneNumber}</p>
                      </div>
                      <button
                        className="w-full mt-4 flex items-center justify-center space-x-2 text-red-600 hover:text-red-700"
                        onClick={logout}
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>My Bookings</CardTitle>
                <CardDescription>View and manage your bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {userData.bookings && userData.bookings.length > 0 ? (
                    userData.bookings.filter((booking: any) => booking && (booking.date || booking.bookingDate)).map((booking: any, index: any) => (
                      <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              {booking?.type === "Flight" ? (
                                <div className="bg-blue-100 p-3 rounded-lg">
                                  <Plane className="w-6 h-6 text-blue-600" />
                                </div>
                              ) : (
                                <div className="bg-green-100 p-3 rounded-lg">
                                  <Building2 className="w-6 h-6 text-green-600" />
                                </div>
                              )}
                              <div>
                                <h3 className="font-semibold text-lg">{booking?.type}</h3>
                                <p className="text-sm text-gray-500">
                                  Booking ID: {booking?.bookingId || booking?._id}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-green-600">
                                {selectedCurrency} {booking?.totalPrice?.toFixed(2) || '0.00'}
                              </p>
                              <p className="text-sm text-gray-500">
                                {booking?.status === 'CANCELLED' ? (
                                  <span className="text-red-600 flex items-center gap-1">
                                    <XCircle className="w-4 h-4" />
                                    Cancelled
                                  </span>
                                ) : (
                                  <span className="text-green-600 flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4" />
                                    Confirmed
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{booking?.date || booking?.bookingDate ? formatDate(booking.date || booking.bookingDate) : 'N/A'}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <CreditCard className="w-4 h-4" />
                              <span>Paid</span>
                            </div>
                          </div>
                          {booking?.status !== 'CANCELLED' && (
                            <div className="border-t pt-4">
                              <div className="flex items-center justify-between">
                                <div className="text-sm">
                                  <p className="text-gray-600">Refund Amount:</p>
                                  <p className="font-semibold text-green-600">
                                    {selectedCurrency} {getRefundAmount(booking).toFixed(2)}
                                  </p>
                                </div>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedBooking(booking);
                                    setCancelDialogOpen(true);
                                  }}
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Cancel Booking
                                </Button>
                              </div>
                            </div>
                          )}
                          {booking?.status === 'CANCELLED' && booking?.refundStatus && (
                            <div className="border-t pt-4">
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4 text-yellow-600" />
                                <span>Refund Status: {booking.refundStatus}</span>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">No bookings yet</h3>
                      <p className="text-gray-500 mb-4">Start exploring and book your next adventure!</p>
                      <Button onClick={() => typeof window !== 'undefined' && router.push('/')}>Browse Flights & Hotels</Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>View all your payment transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payments.length > 0 ? (
                    payments.map((payment: any) => (
                      <Card key={payment._id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="bg-blue-100 p-2 rounded-lg">
                                <CreditCard className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-semibold">{payment.cardType} •••• {payment.last4Digits}</p>
                                <p className="text-sm text-gray-500">
                                  {new Date(payment.timestamp).toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-500">Transaction ID: {payment.transactionId}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold">
                                {payment.currency} {payment.amount}
                              </p>
                              <span className={`text-xs px-2 py-1 rounded ${getPaymentStatusColor(payment.status)}`}>
                                {payment.status}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">No payments yet</h3>
                      <p className="text-gray-500">Your payment history will appear here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 ">
                    <DollarSign className="w-5 h-5" />
                    Currency Preference
                  </CardTitle>
                  <CardDescription>Choose your preferred currency for prices</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {CURRENCIES.map((currency) => (
                      <Button
                        key={currency}
                        variant={selectedCurrency === currency ? 'default' : 'outline'}
                        onClick={() => handleCurrencyChange(currency)}
                        className="w-full text-white"
                      >
                        {currency}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 ">
                    <Globe className="w-5 h-5" />
                    Language Preference
                  </CardTitle>
                  <CardDescription>Choose your preferred language</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {LANGUAGES.map((language) => (
                      <Button
                        key={language}
                        variant={selectedLanguage === language ? 'default' : 'outline'}
                        onClick={() => handleLanguageChange(language)}
                        className="w-full text-white"
                      >
                        {language}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Cancel Booking Dialog */}
        <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Booking</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel this booking? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {selectedBooking && (
                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <p className="font-semibold">Refund Information</p>
                    </div>
                    <p className="text-sm text-gray-700">
                      You will receive a refund of <span className="font-bold">{selectedCurrency} {getRefundAmount(selectedBooking).toFixed(2)}</span>
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Refund will be processed within 5-7 business days
                    </p>
                  </CardContent>
                </Card>
              )}
              <div>
                <Label htmlFor="reason">Cancellation Reason *</Label>
                <Textarea
                  id="reason"
                  placeholder="Please tell us why you're cancelling..."
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleCancelBooking}
                  disabled={loading}
                  variant="destructive"
                  className="flex-1"
                >
                  {loading ? 'Cancelling...' : 'Confirm Cancellation'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCancelDialogOpen(false);
                    setCancellationReason('');
                    setSelectedBooking(null);
                  }}
                  className="flex-1"
                >
                  Keep Booking
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};


export default ProfilePage;