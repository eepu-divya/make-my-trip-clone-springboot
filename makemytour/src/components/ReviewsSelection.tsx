import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Star, ThumbsUp, Flag, Image as ImageIcon, Send } from 'lucide-react';
import { createReview, getReviews, markReviewHelpful } from '@/api';

interface ReviewsSectionProps {
  itemId: string;
  itemType: 'FLIGHT' | 'HOTEL';
  itemName: string;
}

export default function ReviewsSection({ itemId, itemType, itemName }: ReviewsSectionProps) {
  const user = useSelector((state: any) => state.user.user);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating'>('recent');

  // Review form state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    loadReviews();
  }, [itemId, itemType]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await getReviews(itemId, itemType);
      setReviews(data);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      alert('Please login to submit a review');
      return;
    }

    const userId = user._id || user.id;
    const userName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Guest';

    if (!userId) {
      console.error('❌ No userId found in Redux user:', user);
      alert('User ID not found. Please login again.');
      return;
    }
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    if (!title.trim() || !comment.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await createReview(
        user.id,
        userName,
        itemId,
        itemType,
        rating,
        title,
        comment
      );

      // Reset form
      setRating(0);
      setTitle('');
      setComment('');
      setPhotos([]);
      setIsDialogOpen(false);

      // Reload reviews
      loadReviews();
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkHelpful = async (reviewId: string) => {
    if (!user) {
      alert('Please login to mark reviews as helpful');
      return;
    }

    try {
      await markReviewHelpful(reviewId, user._id);
      loadReviews();
    } catch (error) {
      console.error('Error marking review helpful:', error);
    }
  };

  const getSortedReviews = () => {
    const sorted = [...reviews];
    switch (sortBy) {
      case 'helpful':
        return sorted.sort((a, b) => b.helpfulCount - a.helpfulCount);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'recent':
      default:
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  };

  const getAverageRating = (): string => {
    if (reviews.length === 0) return '0.0';
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach(review => {
      distribution[review.rating - 1]++;
    });
    return distribution.reverse();
  };

  const renderStars = (rating: number, interactive: boolean = false, size: string = 'w-5 h-5') => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${star <= (interactive ? (hoverRating || rating) : rating)
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-300'
              } ${interactive ? 'cursor-pointer transition-all' : ''}`}
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Reviews & Ratings</CardTitle>
              <CardDescription>{reviews.length} reviews</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-500">
                  Write a Review
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Write Your Review</DialogTitle>
                  <DialogDescription>Share your experience with {itemName}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Your Rating *</Label>
                    <div className="mt-2">
                      {renderStars(rating, true, 'w-8 h-8')}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="title">Review Title *</Label>
                    <Input
                      id="title"
                      placeholder="Summarize your experience"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="comment">Your Review *</Label>
                    <Textarea
                      id="comment"
                      placeholder="Tell us about your experience..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={5}
                    />
                  </div>
                  <div>
                    <Label>Add Photos (Optional)</Label>
                    <div className="mt-2 border-2 border-dashed rounded-lg p-6 text-center">
                      <ImageIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Click to upload photos</p>
                      <p className="text-xs text-gray-400 mt-1">Coming soon</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleSubmitReview}
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Submit Review
                    </Button>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Average Rating */}
            <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
              <div className="text-5xl font-bold text-yellow-600 mb-2">{getAverageRating()}</div>
              {renderStars(Math.round(parseFloat(getAverageRating())), false, 'w-6 h-6')}
              <p className="text-sm text-gray-600 mt-2">Based on {reviews.length} reviews</p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {getRatingDistribution().map((count, index) => {
                const stars = 5 - index;
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="text-sm font-medium w-12">{stars} star</span>
                    <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sort Options */}
      <div className="flex gap-2">
        <Button
          variant={sortBy === 'recent' ? 'default' : 'outline'}
          onClick={() => setSortBy('recent')}
          size="sm"
        >
          Most Recent
        </Button>
        <Button
          variant={sortBy === 'helpful' ? 'default' : 'outline'}
          onClick={() => setSortBy('helpful')}
          size="sm"
        >
          Most Helpful
        </Button>
        <Button
          variant={sortBy === 'rating' ? 'default' : 'outline'}
          onClick={() => setSortBy('rating')}
          size="sm"
        >
          Highest Rating
        </Button>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">Loading reviews...</div>
        ) : getSortedReviews().length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No reviews yet</h3>
              <p className="text-gray-500 mb-4">Be the first to review this {itemType.toLowerCase()}!</p>
              <Button onClick={() => setIsDialogOpen(true)}>Write a Review</Button>
            </CardContent>
          </Card>
        ) : (
          getSortedReviews().map((review) => (
            <Card key={review._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {review.userName?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold">{review.userName || 'Anonymous'}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  {renderStars(review.rating)}
                </div>

                <h3 className="font-semibold text-lg mb-2">{review.title}</h3>
                <p className="text-gray-700 mb-4">{review.comment}</p>

                {review.photos && review.photos.length > 0 && (
                  <div className="flex gap-2 mb-4">
                    {review.photos.map((photo: string, index: number) => (
                      <div key={index} className="w-24 h-24 bg-gray-200 rounded-lg"></div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 pt-4 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMarkHelpful(review._id)}
                    className="flex items-center gap-2"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    Helpful ({review.helpfulCount || 0})
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <Flag className="w-4 h-4" />
                    Report
                  </Button>
                  {review.verifiedPurchase && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      ✓ Verified Purchase
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}