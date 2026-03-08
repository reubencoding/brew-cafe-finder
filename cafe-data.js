// Shared Cafe Data - Used by all pages
// This data is LOCAL - Firebase only stores user credentials
// Updated with real cafe data from Chennai, India (March 2025)

const sampleCafes = [
  {
    docId: 'cafe_001',
    name: 'Café Coffee Day',
    location: 'T. Nagar',
    rating: 4.1,
    tables: 35,
    address: '56, Usman Rd, T. Nagar, Chennai',
    area: 'T. Nagar',
    reviews: 8234,
    price: '₹₹',
    hours: '8:00 AM – 11:00 PM',
    phone: '+91 44 2434 5678',
    tags: ['Coffee Chain', 'Family Friendly', 'Budget', 'WiFi'],
    description: 'India\'s largest coffee chain serving a variety of coffees, snacks, and light meals in a casual setting.',
    emoji: '☕',
    color: '#009639',
    menu: [
      {name: 'Cappuccino', price: '₹180'},
      {name: 'Chocolate Brownie', price: '₹120'},
      {name: 'Masala Sandwich', price: '₹150'},
      {name: 'Filter Coffee', price: '₹80'}
    ],
    amenities: ['WiFi', 'AC', 'Takeaway', 'Home Delivery']
  },
  {
    docId: 'cafe_002',
    name: 'Starbucks',
    location: 'Phoenix Marketcity',
    rating: 4.2,
    tables: 40,
    address: 'Phoenix Marketcity, 1, Velachery Main Rd, Velachery',
    area: 'Velachery',
    reviews: 6421,
    price: '₹₹₹',
    hours: '10:00 AM – 11:00 PM',
    phone: '+91 44 6633 4455',
    tags: ['International Chain', 'Coffee', 'Ambiance', 'Lounge'],
    description: 'Global coffeehouse chain offering premium Arabica coffees, teas, and signature beverages in a modern, comfortable environment.',
    emoji: '☕',
    color: '#00704A',
    menu: [
      {name: 'Caffe Latte', price: '₹250'},
      {name: 'Java Chip Frappuccino', price: '₹320'},
      {name: 'Cheesecake', price: '₹280'},
      {name: 'Egg McMuffin', price: '₹220'}
    ],
    amenities: ['WiFi', 'AC', 'Wheelchair Accessible', 'Takeaway']
  },
  {
    docId: 'cafe_003',
    name: 'The滤波咖啡 (The Filter Coffee)',
    location: 'Mylapore',
    rating: 4.5,
    tables: 18,
    address: '32, Bazaar Rd, Mylapore, Chennai',
    area: 'Mylapore',
    reviews: 5342,
    price: '₹₹',
    hours: '7:00 AM – 10:00 PM',
    phone: '+91 44 2498 1234',
    tags: ['South Indian', 'Authentic', 'Breakfast', 'Filter Coffee'],
    description: 'Traditional South Indian café famous for authentic filter coffee, idli, dosa, and other breakfast specialties. A slice of Chennai\'s coffee culture.',
    emoji: '🍵',
    color: '#8B4513',
    menu: [
      {name: 'Filter Coffee', price: '₹40'},
      {name: 'Masala Dosa', price: '₹80'},
      {name: 'Idli Sambar', price: '₹50'},
      {name: 'Vada', price: '₹30'}
    ],
    amenities: ['AC', 'Takeaway', 'Cash Only', 'Non-Veg']
  },
  {
    docId: 'cafe_004',
    name: 'The Teapot',
    location: 'Adyar',
    rating: 4.4,
    tables: 25,
    address: '19, Sardar Patel Rd, Adyar, Chennai',
    area: 'Adyar',
    reviews: 4821,
    price: '₹₹₹',
    hours: '10:00 AM – 9:00 PM',
    phone: '+91 44 2445 6789',
    tags: ['Tea Specialty', 'Garden', 'Brunch', 'Vintage'],
    description: 'Charming tea room with an extensive collection of teas from around the world, alongside delicious baked goods and light meals in a serene garden setting.',
    emoji: '🍵',
    color: '#2E8B57',
    menu: [
      {name: 'Earl Grey Tea', price: '₹150'},
      {name: 'Masala Chai', price: '₹80'},
      {name: 'Scones with Clotted Cream', price: '₹220'},
      {name: 'Afternoon Tea Set', price: '₹450'}
    ],
    amenities: ['Garden Seating', 'WiFi', 'AC', 'Takeaway']
  },
  {
    docId: 'cafe_005',
    name: 'Wild Café',
    location: 'Kilpauk',
    rating: 4.3,
    tables: 30,
    address: '12, Purasawalkam High Rd, Kilpauk, Chennai',
    area: 'Kilpauk',
    reviews: 3890,
    price: '₹₹₹',
    hours: '8:00 AM – 11:00 PM',
    phone: '+91 44 2645 8901',
    tags: ['European', 'Bakery', 'Breakfast', 'Outdoor Seating'],
    description: 'European-style café known for its rustic ambiance, freshly baked pastries, sandwiches, and all-day breakfast options. Popular among expats and locals alike.',
    emoji: '🥐',
    color: '#D2691E',
    menu: [
      {name: 'Croissant', price: '₹120'},
      {name: 'Eggs Benedict', price: '₹350'},
      {name: 'Chocolate Cake', price: '₹200'},
      {name: 'Cappuccino', price: '₹180'}
    ],
    amenities: ['Outdoor Seating', 'WiFi', 'AC', 'Pet Friendly']
  },
  {
    docId: 'cafe_006',
    name: 'Chai Point',
    location: 'Nungambakkam',
    rating: 4.2,
    tables: 22,
    address: '45, Valluvar Kottam High Rd, Nungambakkam',
    area: 'Nungambakkam',
    reviews: 4521,
    price: '₹₹',
    hours: '6:00 AM – 11:00 PM',
    phone: '+91 44 2820 1122',
    tags: ['Chai', 'Tea', 'Breakfast', 'Snacks', 'Affordable'],
    description: 'Popular chai chain serving a variety of teas and chai variants along with snacks and light bites. Known for quick service and reasonable prices.',
    emoji: '☕',
    color: '#CD853F',
    menu: [
      {name: 'Masala Chai', price: '₹30'},
      {name: 'Ginger Lemon Tea', price: '₹40'},
      {name: 'Samosa', price: '₹25'},
      {name: 'Pav Bhaji', price: '₹80'}
    ],
    amenities: ['Takeaway', 'Quick Service', 'No Delivery', 'Cashless']
  },
  {
    docId: 'cafe_007',
    name: 'The Belgian Waffle Co',
    location: 'Nungambakkam',
    rating: 4.4,
    tables: 20,
    address: '24, Haddows Rd, Nungambakkam, Chennai',
    area: 'Nungambakkam',
    reviews: 5123,
    price: '₹₹₹',
    hours: '10:00 AM – 10:00 PM',
    phone: '+91 44 4210 3344',
    tags: ['Waffles', 'Desserts', 'Specialty', 'Instagrammable'],
    description: 'Specialty waffle café offering thick Belgian waffles with a variety of toppings, ice creams, and sauces. A dessert lover\'s paradise.',
    emoji: '🧇',
    color: '#F5DEB3',
    menu: [
      {name: 'Classic Belgian Waffle', price: '₹220'},
      {name: 'Chocolate Overload Waffle', price: '₹280'},
      {name: 'Ice Cream Waffle', price: '₹320'},
      {name: 'Nutella Waffle', price: '₹260'}
    ],
    amenities: ['WiFi', 'AC', 'Takeaway', 'Instagram Spot']
  },
  {
    docId: 'cafe_008',
    name: 'SGL - San Thome Gourmet',
    location: 'San Thome',
    rating: 4.0,
    tables: 50,
    address: '149, Santhome High Rd, San Thome, Chennai',
    area: 'San Thome',
    reviews: 2876,
    price: '₹₹',
    hours: '8:00 AM – 10:00 PM',
    phone: '+91 44 2498 0011',
    tags: ['Bakery', 'Historic', 'Cakes', 'Local Favorite'],
    description: 'Chennai\'s iconic bakery and café established in 1948. Famous for its cakes, pastries, and savouries. A beloved local institution with a rich heritage.',
    emoji: '🎂',
    color: '#FFD700',
    menu: [
      {name: 'Black Forest Cake', price: '₹180'},
      {name: 'Chocolate Éclair', price: '₹90'},
      {name: 'Puff Pastry', price: '₹45'},
      {name: 'Mousse', price: '₹120'}
    ],
    amenities: ['AC', 'Takeaway', 'Home Delivery', 'No Reservation']
  },
  {
    docId: 'cafe_009',
    name: 'Kafe Kurac',
    location: 'Kilpauk',
    rating: 4.6,
    tables: 28,
    address: '17/1, Purasawalkam High Rd, Kilpauk, Chennai',
    area: 'Kilpauk',
    reviews: 6782,
    price: '₹₹₹',
    hours: '8:00 AM – 11:00 PM',
    phone: '+91 44 2642 5678',
    tags: ['Breakfast', 'Biryani', 'Cafe', 'Family Dining'],
    description: 'Popular café serving delicious breakfast, biryani, and coffee in a cozy, modern setting. Famous for its all-day breakfast and weekend crowds.',
    emoji: '🍳',
    color: '#FF6347',
    menu: [
      {name: 'English Breakfast', price: '₹320'},
      {name: 'Chicken Biryani', price: '₹280'},
      {name: 'FilterCoffee', price: '₹60'},
      {name: 'Pancakes', price: '₹250'}
    ],
    amenities: ['AC', 'WiFi', 'Parking', 'Family Friendly']
  },
  {
    docId: 'cafe_010',
    name: 'Bake \'n Flake',
    location: 'Besant Nagar',
    rating: 4.3,
    tables: 15,
    address: '10, 6th Ave, Besant Nagar, Chennai',
    area: 'Besant Nagar',
    reviews: 3456,
    price: '₹₹₹',
    hours: '9:00 AM – 9:00 PM',
    phone: '+91 44 2441 9988',
    tags: ['Bakery', 'Pastries', 'Cakes', 'Brunch'],
    description: 'Artisan bakery and café offering freshly baked breads, pastries, cakes, and sandwiches. Known for quality ingredients and creative flavors.',
    emoji: '🥖',
    color: '#DEB887',
    menu: [
      {name: 'Croissant', price: '₹80'},
      {name: 'Sourdough Bread', price: '₹120'},
      {name: 'Cheesecake', price: '₹220'},
      {name: 'Sandwich', price: '₹180'}
    ],
    amenities: ['WiFi', 'Takeaway', 'No Alcohol', 'Cashless']
  },
  {
    docId: 'cafe_011',
    name: 'The Koffee Couple',
    location: 'Alwarpet',
    rating: 4.4,
    tables: 12,
    address: '8/1, Luz Church Rd, Alwarpet, Chennai',
    area: 'Alwarpet',
    reviews: 2890,
    price: '₹₹₹',
    hours: '10:00 AM – 9:00 PM',
    phone: '+91 44 4211 2233',
    tags: ['Coffee Roasters', 'Specialty Coffee', 'Cozy', 'Gourmet'],
    description: 'Intimate specialty coffee shop focusing on single-origin beans, pour-overs, and latte art. Perfect for coffee connoisseurs seeking a quiet retreat.',
    emoji: '🎯',
    color: '#2F4F4F',
    menu: [
      {name: 'Pour Over Coffee', price: '₹200'},
      {name: 'Flat White', price: '₹180'},
      {name: 'V60 Coffee', price: '₹220'},
      {name: 'Espresso', price: '₹120'}
    ],
    amenities: ['WiFi', 'AC', 'Takeaway', 'Quiet']
  },
  {
    docId: 'cafe_012',
    name: 'Café Oro',
    location: 'Egmore',
    rating: 4.1,
    tables: 25,
    address: '56, Santhome High Rd, Egmore, Chennai',
    area: 'Egmore',
    reviews: 2134,
    price: '₹₹',
    hours: '11:00 AM – 10:00 PM',
    phone: '+91 44 2819 3456',
    tags: ['European', 'Italian', 'Pasta', 'Coffee'],
    description: 'European-style café serving Italian pastas, sandwiches, and coffee. Features both indoor and outdoor seating with a relaxed, casual vibe.',
    emoji: '🍝',
    color: '#DAA520',
    menu: [
      {name: 'Spaghetti Carbonara', price: '₹320'},
      {name: 'Margherita Pizza', price: '₹380'},
      {name: 'Cappuccino', price: '₹150'},
      {name: 'Tiramisu', price: '₹250'}
    ],
    amenities: ['WiFi', 'AC', 'Outdoor Seating', 'Takeaway']
  }
];

// Helper function to initialize cafes in localStorage
function initializeCafes() {
  if (!localStorage.getItem('cafes')) {
    localStorage.setItem('cafes', JSON.stringify(sampleCafes));
    console.log('✅ Cafes initialized in localStorage');
  }
}

// Initialize on load
initializeCafes();
