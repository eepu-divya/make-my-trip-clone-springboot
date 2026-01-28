# MakeMyTrip Frontend - Complete Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Backend server running on port 8080

### Installation

```bash
# Navigate to frontend directory
cd makemytour

# Install dependencies
npm install

# Run development server
npm run dev
```

**Frontend will start on:** `http://localhost:3000`

---

## 📦 Project Structure

```
makemytour/
├── src/
│   ├── api/
│   │   └── index.js              # All API functions (40+ endpoints)
│   ├── components/
│   │   ├── ChatSupport.tsx       # Global chat component
│   │   ├── Navbar.tsx            # Enhanced navigation
│   │   ├── Flights/
│   │   ├── Hotel/
│   │   └── ui/                   # Shadcn UI components
│   ├── pages/
│   │   ├── _app.tsx              # App wrapper with ChatSupport
│   │   ├── index.tsx             # Home page
│   │   ├── wishlist/
│   │   │   └── index.tsx         # Wishlist feature
│   │   ├── loyalty/
│   │   │   └── index.tsx         # Loyalty program
│   │   ├── packages/
│   │   │   └── index.tsx         # Travel packages
│   │   ├── recommendations/
│   │   │   └── index.tsx         # AI recommendations
│   │   ├── flight-status/
│   │   │   └── index.tsx         # Flight tracking
│   │   ├── search/
│   │   │   └── index.tsx         # Advanced search
│   │   ├── profile/
│   │   │   └── index.tsx         # User profile
│   │   └── admin/
│   │       └── index.tsx         # Admin dashboard
│   ├── store/
│   │   └── index.js              # Redux store
│   └── styles/
│       └── globals.css           # Global styles
├── public/                       # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.ts
```

---

## 🎯 All Features & Pages

### 1. Home Page (`/`)
- Flight and hotel search
- Featured destinations
- Quick booking

### 2. Search Page (`/search`)
**Features:**
- Advanced flight search with filters
- Advanced hotel search with filters
- Location autocomplete
- Search history
- Real-time results

**Filters:**
- Price range (min/max)
- Airline selection
- Max stops
- Hotel ratings
- Amenities

### 3. Wishlist Page (`/wishlist`)
**Features:**
- Create custom folders
- Add flights/hotels
- Price drop alerts
- Remove items
- Price tracking

**Access:** User menu → Wishlist

### 4. Loyalty Program (`/loyalty`)
**Features:**
- View tier status (Silver/Gold/Platinum)
- Total points display
- Redeem points calculator
- Transaction history
- Progress to next tier

**Access:** User menu → Loyalty Points

### 5. Travel Packages (`/packages`)
**Features:**
- Browse all packages
- Filter by type (Beach, Adventure, Cultural, Luxury)
- View package details
- Discount pricing
- Customizable packages

**Access:** Navigation → Packages

### 6. Recommendations (`/recommendations`)
**Features:**
- Personalized flight suggestions
- Personalized hotel suggestions
- AI-powered recommendations
- Explanation tooltips
- Star ratings

**Access:** Navigation → For You

### 7. Flight Status (`/flight-status`)
**Features:**
- Track flights by number
- Real-time status updates
- Gate and terminal info
- Delay information
- Scheduled vs actual times

**Access:** Navigation → Flight Status

### 8. Profile Page (`/profile`)
**Features:**
- View bookings
- Edit profile
- Booking history
- Cancel bookings (API ready)

**Access:** User menu → Profile

### 9. Admin Dashboard (`/admin`)
**Features:**
- Booking analytics
- Revenue charts
- Popular flights/hotels
- User management
- Add/edit flights and hotels

**Access:** Admin users only

### 10. Chat Support (Global)
**Features:**
- Floating chat button
- Bot responses
- Sentiment analysis
- Message history
- Minimize/maximize

**Access:** Available on all pages

---

## 🔧 Configuration

### Backend URL
Update in `src/api/index.js`:
```javascript
const BACKEND_URL = "http://localhost:8080";
// or your deployed backend URL
```

### Environment Variables (Optional)
Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Then update `src/api/index.js`:
```javascript
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
```

---

## 🎨 Styling & Theming

### Tailwind CSS
All components use Tailwind CSS utility classes.

**Primary Colors:**
- Blue: `blue-500`, `blue-600`, `blue-700`
- Purple: `purple-500`, `purple-600`, `purple-700`
- Green: `green-500`, `green-600` (success)
- Red: `red-500`, `red-600` (errors)

### Gradients
```css
bg-gradient-to-r from-blue-500 to-purple-500
bg-gradient-to-br from-blue-50 to-purple-50
```

### Custom Components
Using Shadcn/UI components:
- Card
- Button
- Input
- Tabs
- Dialog
- Dropdown Menu
- Avatar
- Table
- Scroll Area

---

## 📱 Responsive Breakpoints

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

**Grid Layouts:**
```tsx
// Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
```

---

## 🔐 Authentication Flow

### Login
1. User clicks "Sign Up" button
2. SignupDialog opens
3. User enters credentials
4. API call to `/user/login` or `/user/signup`
5. User data stored in Redux
6. User data persisted in localStorage

### Logout
1. User clicks "Log out" in dropdown
2. Redux state cleared
3. localStorage cleared
4. Redirect to home

### Protected Routes
Check user state:
```tsx
const user = useSelector((state: any) => state.user.user);

if (!user) {
  return <div>Please login</div>;
}
```

---

## 🧪 Testing the Features

### 1. Test Wishlist
```
1. Login
2. Go to /wishlist
3. Create a new folder
4. Add items (need to integrate with flight/hotel pages)
5. Enable price alerts
```

### 2. Test Loyalty Program
```
1. Login
2. Go to /loyalty
3. View your points and tier
4. Try redeeming points
5. Check transaction history
```

### 3. Test Search
```
1. Go to /search
2. Enter "New York" in From field
3. See autocomplete suggestions
4. Add filters (price, airline, etc.)
5. Click "Search Flights"
6. View results
```

### 4. Test Flight Status
```
1. Go to /flight-status
2. Enter "FL1234" (sample flight)
3. View status details
4. Check gate, terminal, delays
```

### 5. Test Chat Support
```
1. Click floating chat button (bottom right)
2. Type "How do I cancel my booking?"
3. See bot response
4. Try other questions
```

### 6. Test Recommendations
```
1. Login
2. Go to /recommendations
3. View personalized flights
4. View personalized hotels
5. Click info icon for explanation
```

### 7. Test Packages
```
1. Go to /packages
2. Filter by type (Beach, Adventure, etc.)
3. View package details
4. See pricing and discounts
```

---

## 🔄 API Integration

### Making API Calls

```tsx
import { searchFlights, getUserWishlists } from '@/api';

// Search flights
const results = await searchFlights(
  userId,
  'New York',
  'London',
  100,  // minPrice
  1000, // maxPrice
  'Delta',
  1     // maxStops
);

// Get wishlists
const wishlists = await getUserWishlists(userId);
```

### Error Handling

```tsx
try {
  const data = await someApiCall();
  setData(data);
} catch (error) {
  console.error('Error:', error);
  // Show error message to user
}
```

---

## 🎯 Common Tasks

### Add a New Page

1. Create file in `src/pages/`:
```tsx
// src/pages/my-page/index.tsx
export default function MyPage() {
  return <div>My Page</div>;
}
```

2. Add navigation link in `Navbar.tsx`:
```tsx
<Link href="/my-page">My Page</Link>
```

### Add a New API Function

1. Add to `src/api/index.js`:
```javascript
export const myNewApi = async (param) => {
  try {
    const res = await axios.get(`${BACKEND_URL}/my-endpoint`, {
      params: { param }
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};
```

2. Use in component:
```tsx
import { myNewApi } from '@/api';

const data = await myNewApi('value');
```

### Add a New UI Component

1. Create in `src/components/`:
```tsx
// src/components/MyComponent.tsx
export default function MyComponent({ prop }) {
  return <div>{prop}</div>;
}
```

2. Import and use:
```tsx
import MyComponent from '@/components/MyComponent';

<MyComponent prop="value" />
```

---

## 🐛 Troubleshooting

### Issue: API calls fail
**Solution:**
- Check backend is running on port 8080
- Verify BACKEND_URL in `src/api/index.js`
- Check browser console for CORS errors

### Issue: Pages not loading
**Solution:**
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### Issue: TypeScript errors
**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Issue: Styles not applying
**Solution:**
- Check Tailwind CSS is configured
- Verify `globals.css` is imported in `_app.tsx`
- Clear browser cache

### Issue: Redux state not persisting
**Solution:**
- Check localStorage in browser DevTools
- Verify `useEffect` in `_app.tsx` is running
- Check Redux store configuration

---

## 📊 Performance Tips

### 1. Optimize Images
```tsx
import Image from 'next/image';

<Image src="/image.jpg" width={500} height={300} alt="Description" />
```

### 2. Lazy Load Components
```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'));
```

### 3. Debounce Search
```tsx
const debouncedSearch = debounce((query) => {
  handleSearch(query);
}, 300);
```

### 4. Memoize Expensive Calculations
```tsx
import { useMemo } from 'react';

const expensiveValue = useMemo(() => {
  return calculateExpensiveValue(data);
}, [data]);
```

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables for Production
Set in Vercel dashboard or `.env.production`:
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

---

## 📚 Additional Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn/UI](https://ui.shadcn.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)

### Icons
- [Lucide Icons](https://lucide.dev/)

### UI Components
All Shadcn/UI components are in `src/components/ui/`

---

## ✅ Feature Checklist

- ✅ Wishlist with folders and price alerts
- ✅ Loyalty program with tier system
- ✅ Travel packages with filtering
- ✅ AI-powered recommendations
- ✅ Flight status tracking
- ✅ Advanced search with autocomplete
- ✅ Real-time chat support
- ✅ Enhanced navigation
- ✅ Responsive design
- ✅ User authentication
- ✅ Admin dashboard
- ✅ Profile management

---

## 🎉 You're All Set!

**Frontend is ready with all 15 features!**

Start the development server and explore:
```bash
npm run dev
```

Then visit: `http://localhost:3000`

**Happy coding! 🚀**
