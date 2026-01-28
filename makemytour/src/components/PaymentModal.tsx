import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { processPayment } from '@/api';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails: {
    userId: string;
    bookingId: string;
    amount: number;
    currency: string;
    bookingType: string;
    itemName: string;
  };
  onSuccess: (paymentData: any) => void;
}

const TEST_CARDS = [
  { number: '4242424242424242', type: 'Visa', cvv: '123' },
  { number: '5555555555554444', type: 'Mastercard', cvv: '456' },
  { number: '378282246310005', type: 'Amex', cvv: '7890' },
  { number: '6011111111111117', type: 'Discover', cvv: '321' }
];

export default function PaymentModal({ isOpen, onClose, bookingDetails, onSuccess }: PaymentModalProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [paymentData, setPaymentData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted;
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const getCardType = (number: string) => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'Visa';
    if (cleaned.startsWith('5')) return 'Mastercard';
    if (cleaned.startsWith('3')) return 'Amex';
    if (cleaned.startsWith('6')) return 'Discover';
    return 'Unknown';
  };

  const useTestCard = (card: typeof TEST_CARDS[0]) => {
    setCardNumber(formatCardNumber(card.number));
    setCardName('Test User');
    setExpiryDate('12/25');
    setCvv(card.cvv);
  };

  const validateCard = () => {
    const cleaned = cardNumber.replace(/\s/g, '');
    if (cleaned.length < 13 || cleaned.length > 19) {
      setErrorMessage('Invalid card number length');
      return false;
    }
    if (!cardName.trim()) {
      setErrorMessage('Cardholder name is required');
      return false;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      setErrorMessage('Invalid expiry date format (MM/YY)');
      return false;
    }
    if (cvv.length < 3 || cvv.length > 4) {
      setErrorMessage('Invalid CVV');
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    setErrorMessage('');
    
    if (!validateCard()) {
      return;
    }

    setLoading(true);
    setPaymentStatus('processing');

    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const result = await processPayment(
        bookingDetails.userId,
        bookingDetails.bookingId,
        bookingDetails.amount,
        bookingDetails.currency,
        cardNumber.replace(/\s/g, ''),
        bookingDetails.bookingType
      );

      setPaymentData(result);

      if (result.status === 'SUCCESS') {
        setPaymentStatus('success');
        setTimeout(() => {
          onSuccess(result);
          handleClose();
        }, 3000);
      } else {
        setPaymentStatus('failed');
        setErrorMessage(result.message || 'Payment failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentStatus('failed');
      setErrorMessage(error.response?.data?.message || 'Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCardNumber('');
    setCardName('');
    setExpiryDate('');
    setCvv('');
    setPaymentStatus('idle');
    setPaymentData(null);
    setErrorMessage('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <CreditCard className="w-6 h-6" />
            Payment Details
          </DialogTitle>
          <DialogDescription>
            Complete your payment securely
          </DialogDescription>
        </DialogHeader>

        {paymentStatus === 'idle' && (
          <div className="space-y-6">
            {/* Booking Summary */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Booking Summary</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Item:</span>
                    <span className="font-medium">{bookingDetails.itemName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking ID:</span>
                    <span className="font-medium">{bookingDetails.bookingId}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="text-green-600">
                      {bookingDetails.currency} {bookingDetails.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Test Cards */}
            <div>
              <Label className="mb-2 block">Test Cards (Click to use)</Label>
              <div className="grid grid-cols-2 gap-2">
                {TEST_CARDS.map((card, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => useTestCard(card)}
                    className="justify-start text-left h-auto p-3"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <CreditCard className="w-4 h-4" />
                      <div className="flex-1">
                        <div className="text-xs font-semibold">{card.type}</div>
                        <div className="text-xs text-gray-500">
                          {card.number.replace(/(\d{4})/g, '$1 ').trim()}
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                💡 These are test cards for demo purposes. 90% success rate.
              </p>
            </div>

            {/* Card Details Form */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                />
                {cardNumber && (
                  <p className="text-xs text-gray-500 mt-1">
                    Card Type: {getCardType(cardNumber)}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input
                  id="cardName"
                  placeholder="John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                    maxLength={5}
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    type="password"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                    maxLength={4}
                  />
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{errorMessage}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handlePayment}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay ${bookingDetails.currency} ${bookingDetails.amount.toFixed(2)}`
                )}
              </Button>
              <Button variant="outline" onClick={handleClose} disabled={loading}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Processing State */}
        {paymentStatus === 'processing' && (
          <div className="py-12 text-center">
            <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin text-blue-500" />
            <h3 className="text-xl font-semibold mb-2">Processing Payment...</h3>
            <p className="text-gray-600">Please wait while we process your payment</p>
            <div className="mt-6 space-y-2 text-sm text-gray-500">
              <p>✓ Validating card details</p>
              <p>✓ Contacting payment gateway</p>
              <p>✓ Securing transaction</p>
            </div>
          </div>
        )}

        {/* Success State */}
        {paymentStatus === 'success' && paymentData && (
          <div className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h3>
            <p className="text-gray-600 mb-6">Your booking has been confirmed</p>
            
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono font-semibold">{paymentData.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="font-semibold text-green-600">
                    {paymentData.currency} {paymentData.amount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Card:</span>
                  <span className="font-semibold">
                    {paymentData.cardType} •••• {paymentData.last4Digits}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold">
                    {new Date(paymentData.timestamp).toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            <p className="text-sm text-gray-500 mt-4">
              A confirmation email has been sent to your registered email address
            </p>
          </div>
        )}

        {/* Failed State */}
        {paymentStatus === 'failed' && (
          <div className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-red-600 mb-2">Payment Failed</h3>
            <p className="text-gray-600 mb-6">{errorMessage || 'Unable to process your payment'}</p>
            
            <div className="space-y-3">
              <Button
                onClick={() => {
                  setPaymentStatus('idle');
                  setErrorMessage('');
                }}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500"
              >
                Try Again
              </Button>
              <Button variant="outline" onClick={handleClose} className="w-full">
                Cancel
              </Button>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              💡 Tip: Try using one of the test cards provided above
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}