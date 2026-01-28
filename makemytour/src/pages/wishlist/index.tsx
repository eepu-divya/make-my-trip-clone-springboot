import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getUserWishlists, createWishlist, removeFromWishlist } from '@/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, Trash2, Plus, Bell, BellOff } from 'lucide-react';

export default function WishlistPage() {
  const user = useSelector((state: any) => state.user.user);
  const [wishlists, setWishlists] = useState([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?._id) {
      loadWishlists();
    }
  }, [user]);

  const loadWishlists = async () => {
    if (!user?._id) return;
    try {
      const data = await getUserWishlists(user._id);
      setWishlists(data);
    } catch (error) {
      console.error('Error loading wishlists:', error);
    }
  };

  const handleCreateWishlist = async () => {
    if (!newFolderName.trim()) {
      alert('Please enter a folder name');
      return;
    }
    if (!user?._id) {
      alert('Please login to create a wishlist');
      return;
    }
    
    setLoading(true);
    try {
      await createWishlist(user._id, newFolderName);
      setNewFolderName('');
      loadWishlists();
      alert('Wishlist created successfully!');
    } catch (error: any) {
      console.error('Error creating wishlist:', error);
      alert(error.response?.data?.message || 'Failed to create wishlist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (wishlistId: string, itemId: string) => {
    try {
      await removeFromWishlist(wishlistId, itemId);
      loadWishlists();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Please Login</CardTitle>
            <CardDescription>You need to be logged in to view your wishlists</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Wishlists</h1>
          <p className="text-gray-600">Save your favorite flights and hotels</p>
        </div>

        {/* Create New Wishlist */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create New Wishlist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Enter folder name..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateWishlist()}
              />
              <Button onClick={handleCreateWishlist} disabled={loading}>
                Create
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Wishlists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlists.map((wishlist: any) => (
            <Card key={wishlist._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                    {wishlist.folderName}
                  </span>
                  {wishlist.priceDropAlert && (
                    <Bell className="w-4 h-4 text-blue-500" />
                  )}
                </CardTitle>
                <CardDescription>
                  {wishlist.items?.length || 0} items
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {wishlist.items?.map((item: any) => (
                    <div
                      key={item.itemId}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.itemType}</p>
                        <p className="text-xs text-gray-500">
                          ${item.currentPrice}
                          {item.originalPrice !== item.currentPrice && (
                            <span className="ml-2 text-green-600">
                              (${(item.originalPrice - item.currentPrice).toFixed(2)} off!)
                            </span>
                          )}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(wishlist._id, item.itemId)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                  {(!wishlist.items || wishlist.items.length === 0) && (
                    <p className="text-center text-gray-400 py-4">No items yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {wishlists.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No wishlists yet
              </h3>
              <p className="text-gray-500">
                Create your first wishlist to start saving your favorite trips!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}