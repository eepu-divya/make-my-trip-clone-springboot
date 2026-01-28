import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getLoyaltyProgram, redeemPoints, calculateDiscount } from '@/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Award, TrendingUp, Gift, Star } from 'lucide-react';

export default function LoyaltyPage() {
  const user = useSelector((state: any) => state.user.user);
  const [loyaltyData, setLoyaltyData] = useState<any>(null);
  const [redeemAmount, setRedeemAmount] = useState('');
  const [discount, setDiscount] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?._id) {
      loadLoyaltyData();
    }
  }, [user]);

  const loadLoyaltyData = async () => {
    try {
      const data = await getLoyaltyProgram(user._id);
      setLoyaltyData(data);
    } catch (error) {
      console.error('Error loading loyalty data:', error);
    }
  };

  const handleCalculateDiscount = async () => {
    if (!redeemAmount) return;
    try {
      const data = await calculateDiscount(user._id, parseInt(redeemAmount));
      setDiscount(data);
    } catch (error) {
      console.error('Error calculating discount:', error);
    }
  };

  const handleRedeem = async () => {
    if (!redeemAmount) return;
    setLoading(true);
    try {
      await redeemPoints(user._id, parseInt(redeemAmount), 'Booking discount');
      setRedeemAmount('');
      setDiscount(null);
      loadLoyaltyData();
    } catch (error) {
      console.error('Error redeeming points:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'PLATINUM': return 'from-purple-500 to-purple-700';
      case 'GOLD': return 'from-yellow-500 to-yellow-700';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getTierBenefits = (tier: string) => {
    switch (tier) {
      case 'PLATINUM':
        return ['1.5x points earning', 'Priority support', 'Exclusive deals', 'Free upgrades'];
      case 'GOLD':
        return ['1.25x points earning', 'Priority booking', 'Special discounts'];
      default:
        return ['1x points earning', 'Standard benefits'];
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Please Login</CardTitle>
            <CardDescription>You need to be logged in to view your loyalty program</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!loyaltyData) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Loyalty Rewards</h1>
          <p className="text-gray-600">Earn points with every booking and enjoy exclusive benefits</p>
        </div>

        {/* Tier Card */}
        <Card className={`mb-8 bg-gradient-to-r ${getTierColor(loyaltyData.tier)} text-white`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl mb-2">{loyaltyData.tier} Member</CardTitle>
                <CardDescription className="text-white/80">
                  Member since {new Date(loyaltyData.createdAt).toLocaleDateString()}
                </CardDescription>
              </div>
              <Award className="w-16 h-16" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-white/80 text-sm mb-1">Total Points</p>
                <p className="text-4xl font-bold">{loyaltyData.totalPoints.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-white/80 text-sm mb-1">Points Value</p>
                <p className="text-4xl font-bold">${(loyaltyData.totalPoints / 100).toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Tier Benefits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Your Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {getTierBenefits(loyaltyData.tier).map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Redeem Points */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-purple-500" />
                Redeem Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Points to Redeem</label>
                  <Input
                    type="number"
                    placeholder="Enter points..."
                    value={redeemAmount}
                    onChange={(e) => setRedeemAmount(e.target.value)}
                  />
                </div>
                {discount && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Discount Value</p>
                    <p className="text-2xl font-bold text-green-600">${discount.discount}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button onClick={handleCalculateDiscount} variant="outline" className="flex-1">
                    Calculate
                  </Button>
                  <Button onClick={handleRedeem} disabled={loading || !discount} className="flex-1">
                    Redeem
                  </Button>
                </div>
                <p className="text-xs text-gray-500">100 points = $1 discount</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Transaction History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {loyaltyData.transactions?.slice(0, 10).map((transaction: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`font-bold ${transaction.type === 'EARNED' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'EARNED' ? '+' : '-'}{transaction.points}
                  </div>
                </div>
              ))}
              {(!loyaltyData.transactions || loyaltyData.transactions.length === 0) && (
                <p className="text-center text-gray-400 py-8">No transactions yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Next Tier Progress */}
        {loyaltyData.tier !== 'PLATINUM' && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Progress to Next Tier</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{loyaltyData.tier}</span>
                  <span>{loyaltyData.tier === 'SILVER' ? 'GOLD (5,000 pts)' : 'PLATINUM (10,000 pts)'}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all"
                    style={{
                      width: `${Math.min((loyaltyData.totalPoints / (loyaltyData.tier === 'SILVER' ? 5000 : 10000)) * 100, 100)}%`
                    }}
                  />
                </div>
                <p className="text-sm text-gray-600 text-center">
                  {loyaltyData.tier === 'SILVER' ? 5000 - loyaltyData.totalPoints : 10000 - loyaltyData.totalPoints} points to go!
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}