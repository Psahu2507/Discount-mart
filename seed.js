require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err.message));

const itemSchema = new mongoose.Schema({
    name: String,
    price: Number,
    expiryDate: Date,
    quantity: Number,
    discount: Number,
    discountedPrice: Number,
    photo: String,
    category: String,
    createdAt: { type: Date, default: Date.now }
});
const Item = mongoose.model('Item', itemSchema);

// Discount calculation function
function calculateDiscount(expiryDate) {
    const daysLeft = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24));
    if (expiryDate < new Date()) return 90; // 90% discount for expired items
    if (daysLeft <= 3) return 50;
    if (daysLeft <= 15) return 30;
    if (daysLeft <= 35) return 10;
    if (daysLeft <= 70) return 5;
    return 0;
}

const items = [
    {
        name: "Organic Apples",
        price: 3.49,
        expiryDate: new Date("2025-08-01"),
        quantity: 100,
        photo: "https://tse2.mm.bing.net/th/id/OIP.hu9P6Aw-rzOXOhwSWXKpHAHaEK?pid=Api&P=0&h=220",
        category: "fruits",
        createdAt: new Date("2025-07-14")
    },
    {
        name: "Organic Bananas",
        price: 0.79,
        expiryDate: new Date("2025-07-25"),
        quantity: 120,
        photo: "https://images.heb.com/is/image/HEBGrocery/000377497",
        category: "fruits",
        createdAt: new Date("2025-07-14")
    },
    {
        name: "Fresh Strawberries",
        price: 3.99,
        expiryDate: new Date("2025-07-20"),
        quantity: 80,
        photo: "https://tse1.mm.bing.net/th/id/OIP.CcAbG246bZs_iubeei6xFwHaHa?pid=Api&P=0&h=220",
        category: "fruits",
        createdAt: new Date("2025-07-14")
    },
    {
        name: "Organic Carrots",
        price: 1.89,
        expiryDate: new Date("2025-08-10"),
        quantity: 150,
        photo: "https://www.butter-n-thyme.com/wp-content/uploads/2022/10/DIFFERENT-VARIATIONS-OF-CARROTS-1.jpg",
        category: "vegetables",
        createdAt: new Date("2025-07-14")
    },
    {
        name: "Organic Onions",
        price: 1.29,
        expiryDate: new Date("2025-08-15"),
        quantity: 100,
        photo: "https://tse3.mm.bing.net/th/id/OIP.pOMGM34rh0p_sCq5REC0BAHaEK?pid=Api&P=0&h=220",
        category: "vegetables",
        createdAt: new Date("2025-07-14")
    },
    {
        name: "Fresh Broccoli",
        price: 2.69,
        expiryDate: new Date("2025-07-18"),
        quantity: 90,
        photo: "https://tse2.mm.bing.net/th/id/OIP.CTf9v6L8QunUuoNs7nL4SAHaE8?pid=Api&P=0&h=220",
        category: "vegetables",
        createdAt: new Date("2025-07-14")
    },
    {
        name: "Organic Whole Milk",
        price: 5.29,
        expiryDate: new Date("2025-07-20"),
        quantity: 50,
        photo: "https://horizon.com/wp-content/uploads/horizon-shelf-stable-organic-whole-milk.png",
        category: "dairy",
        createdAt: new Date("2025-07-14")
    },
    {
        name: "Cheddar Cheese",
        price: 6.69,
        expiryDate: new Date("2025-08-15"),
        quantity: 60,
        photo: "https://images.pexels.com/photos/773253/pexels-photo-773253.jpeg",
        category: "dairy",
        createdAt: new Date("2025-07-14")
    },
    {
        name: "Whole Grain Pasta",
        price: 2.99,
        expiryDate: new Date("2026-01-01"),
        quantity: 200,
        photo: "https://tse4.mm.bing.net/th/id/OIP.APh24YNNQjD6d6PWDhQ9BAHaE8?pid=Api&P=0&h=220",
        category: "packed-food",
        createdAt: new Date("2025-07-14")
    },
    {
        name: "Almond Milk",
        price: 3.79,
        expiryDate: new Date("2025-08-01"),
        quantity: 70,
        photo: "https://tse1.mm.bing.net/th/id/OIP.-jtvil8b3alfF_NW06JIRAHaE8?pid=Api&P=0&h=220",
        category: "dairy",
        createdAt: new Date("2025-07-14")
    },
    {
        name: "Fresh Blueberries",
        price: 6.29,
        expiryDate: new Date("2025-07-22"),
        quantity: 80,
        photo: "https://tse1.mm.bing.net/th/id/OIP.urLKYvFetWUp3h9FnZlPfgHaE7?pid=Api&P=0&h=220",
        category: "fruits",
        createdAt: new Date("2025-07-14")
    },
    {
        name: "Grass-Fed Butter",
        price: 5.49,
        expiryDate: new Date("2025-08-10"),
        quantity: 60,
        photo: "https://tse2.mm.bing.net/th/id/OIP.iOUrkEAqMvCXvhWjCJPBLwHaD8?pid=Api&P=0&h=220",
        category: "dairy",
        createdAt: new Date("2025-07-14")
    },
    {
        name: "Organic Spinach",
        price: 2.29,
        expiryDate: new Date("2025-07-18"),
        quantity: 100,
        photo: "https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg",
        category: "vegetables",
        createdAt: new Date("2025-07-14")
    },
    {
        name: "Dark Chocolate Bar",
        price: 3.69,
        expiryDate: new Date("2026-03-01"),
        quantity: 90,
        photo: "https://www.markrinchocolate.com/wp-content/uploads/2021/02/chocolate-bars-dark-chocolate-5.jpg",
        category: "snacks",
        createdAt: new Date("2025-07-14")
    },
    {
        name: "Sourdough Bread",
        price: 5.29,
        expiryDate: new Date("2025-07-25"),
        quantity: 50,
        photo: "https://images.pexels.com/photos/1586947/pexels-photo-1586947.jpeg",
        category: "bakery",
        createdAt: new Date("2025-07-14")
    },
    {
        name: "Organic Quinoa",
        price: 6.99,
        expiryDate: new Date("2026-01-01"),
        quantity: 70,
        photo: "https://tse4.mm.bing.net/th/id/OIP.f2_hpwzaPBDgpOtEs8EJFwHaHa?pid=Api&P=0&h=220",
        category: "packed-food",
        createdAt: new Date("2025-07-14")
    },
    {
        name: "Greek Yogurt",
        price: 4.49,
        expiryDate: new Date("2025-08-01"),
        quantity: 60,
        photo: "https://tse2.mm.bing.net/th/id/OIP.kPCMCgYYoSCPM08AK4qWAgHaHa?pid=Api&P=0&h=220",
        category: "dairy",
        createdAt: new Date("2025-07-14")
    },
    {
        name: "Cherry Tomatoes",
        price: 3.49,
        expiryDate: new Date("2025-07-20"),
        quantity: 80,
        photo: "https://tse1.mm.bing.net/th/id/OIP.hCQBb--zGjOcGBuBYO5RHgHaGQ?pid=Api&P=0&h=220",
        category: "vegetables",
        createdAt: new Date("2025-07-14")
    },
    {
        name: "Almonds (Raw)",
        price: 10.99,
        expiryDate: new Date("2026-03-01"),
        quantity: 50,
        photo: "https://tse4.mm.bing.net/th/id/OIP.ylIPPD8l9_VRbX8qK_5l4gHaEJ?pid=Api&P=0&h=220",
        category: "snacks",
        createdAt: new Date("2025-07-14")
    },
    {
        name: "Orange Juice",
        price: 4.29,
        expiryDate: new Date("2025-08-10"),
        quantity: 60,
        photo: "https://images.pexels.com/photos/158053/fresh-orange-juice-squeezed-refreshing-citrus-158053.jpeg",
        category: "beverages",
        createdAt: new Date("2025-07-14")
    },
    {
        name: "Frozen Pizza",
        price: 9.29,
        expiryDate: new Date("2025-12-01"),
        quantity: 40,
        photo: "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg",
        category: "frozen",
        createdAt: new Date("2025-07-14")
    },
    {
        name: "Organic Eggs",
        price: 4.99,
        expiryDate: new Date("2025-08-01"),
        quantity: 70,
        photo: "https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg",
        category: "dairy",
        createdAt: new Date("2025-07-14")
    },
    {
        name: "Sweet Potatoes",
        price: 1.79,
        expiryDate: new Date("2025-08-15"),
        quantity: 100,
        photo: "https://tse1.mm.bing.net/th/id/OIP.LW0xLQckse5pfdR2UCcVuQHaHa?pid=Api&P=0&h=220",
        category: "vegetables",
        createdAt: new Date("2025-07-14")
    },
    {
        name: "Granola Bars",
        price: 6.49,
        expiryDate: new Date("2026-01-01"),
        quantity: 80,
        photo: "https://tse1.mm.bing.net/th/id/OIP.1nhI1u5LFmGhsukxKUGS7wHaJQ?pid=Api&P=0&h=220",
        category: "snacks",
        createdAt: new Date("2025-07-14")
    },
    {
        name: "Mangoes",
        price: 2.49,
        expiryDate: new Date("2025-07-20"),
        quantity: 90,
        photo: "https://images.pexels.com/photos/918643/pexels-photo-918643.jpeg",
        category: "fruits",
        createdAt: new Date("2025-07-14")
    },
    {
        name: "Olive Oil",
        price: 12.49,
        expiryDate: new Date("2026-06-01"),
        quantity: 50,
        photo: "https://tse4.mm.bing.net/th/id/OIP.y190xUFirbl1mhyViE_4sQHaE8?pid=Api&P=0&h=220",
        category: "packed-food",
        createdAt: new Date("2025-07-14")
    },
    {
        name: "Frozen Berries",
        price: 7.09,
        expiryDate: new Date("2025-12-01"),
        quantity: 60,
        photo: "https://tse1.mm.bing.net/th/id/OIP.71uahIg8BwNBkDhcGZ17DgHaE7?pid=Api&P=0&h=220",
        category: "frozen",
        createdAt: new Date("2025-07-14")
    },
    {
        name: "Bell Peppers",
        price: 2.99,
        expiryDate: new Date("2025-07-25"),
        quantity: 80,
        photo: "https://tse3.mm.bing.net/th/id/OIP.imXaPdL4vFsiQkVhnrCH_gHaHa?pid=Api&P=0&h=220",
        category: "vegetables",
        createdAt: new Date("2025-07-14")
    },
    {
        name: "Coffee Beans",
        price: 9.99,
        expiryDate: new Date("2026-03-01"),
        quantity: 70,
        photo: "https://tse1.mm.bing.net/th/id/OIP.qWsEevNPX12J7yKEjCzIxwHaE1?pid=Api&P=0&h=220",
        category: "beverages",
        createdAt: new Date("2025-07-14")
    },
    {
        name: "Ice Cream",
        price: 7.29,
        expiryDate: new Date("2025-12-01"),
        quantity: 50,
        photo: "https://tse1.mm.bing.net/th/id/OIP.XbNs6H76aOGjnJW3MlGdcQHaEO?pid=Api&P=0&h=220",
        category: "frozen",
        createdAt: new Date("2025-07-14")
    },
    {
        name: "Organic Honey",
        price: 7.99,
        expiryDate: new Date("2026-06-01"),
        quantity: 60,
        photo: "https://tse3.mm.bing.net/th/id/OIP.UMTYK8M7kh9KiylhPnNAnAHaE7?pid=Api&P=0&h=220",
        category: "packed-food",
        createdAt: new Date("2025-07-14")
    },
    {
        name: "Organic Pasta",
        price: 3.59,
        expiryDate: new Date("2026-01-01"),
        quantity: 100,
        photo: "https://sharethepasta.org/wp-content/uploads/2019/09/Whole-Grain-Pastas-resized.jpg",
        category: "packed-food",
        createdAt: new Date("2025-07-14")
    },
    {
        name: "Organic Basmati Rice",
        price: 5.99,
        expiryDate: new Date("2026-03-01"),
        quantity: 80,
        photo: "https://tse3.mm.bing.net/th/id/OIP.Z4JeP6vaC9uZcbXg3F6pkgHaHa?pid=Api&P=0&h=220",
        category: "packed-food",
        createdAt: new Date("2025-07-14")
    },
    {
        name: "Organic Cereal",
        price: 5.39,
        expiryDate: new Date("2026-01-01"),
        quantity: 70,
        photo: "https://tse1.mm.bing.net/th/id/OIP.P5ovDlpWpQC7kn5M9l--5wHaKb?pid=Api&P=0&h=220",
        category: "packed-food",
        createdAt: new Date("2025-07-14")
    },
    {
        name: "Potato Chips",
        price: 2.99,
        expiryDate: new Date("2025-12-01"),
        quantity: 90,
        photo: "https://tse4.mm.bing.net/th/id/OIP.ba7PQqzr988mH2iON00seQHaE8?pid=Api&P=0&h=220",
        category: "snacks",
        createdAt: new Date("2025-07-14")
    },
    {
        name: "Premium Coffee",
        price: 8.99,
        expiryDate: new Date("2026-03-01"),
        quantity: 60,
        photo: "https://tse1.mm.bing.net/th/id/OIP.w0hWKesl_3lWdezrIFirFAHaHa?pid=Api&P=0&h=220",
        category: "beverages",
        createdAt: new Date("2025-07-14")
    },
    // Expired items
    {
        name: "Expired Milk",
        price: 4.99,
        expiryDate: new Date("2025-07-13"),
        quantity: 30,
        photo: "https://tse1.mm.bing.net/th/id/OIP.tUoG2sR2F2Q8h_4Q9gW5MAHaHa?pid=Api&P=0&h=220",
        category: "expired",
        createdAt: new Date("2025-07-14")
    },
    {
        name: "Expired Yogurt",
        price: 3.29,
        expiryDate: new Date("2025-07-12"),
        quantity: 40,
        photo: "https://tse2.mm.bing.net/th/id/OIP.kPCMCgYYoSCPM08AK4qWAgHaHa?pid=Api&P=0&h=220",
        category: "expired",
        createdAt: new Date("2025-07-14")
    },
    {
        name: "Expired Bread",
        price: 4.49,
        expiryDate: new Date("2025-07-10"),
        quantity: 20,
        photo: "https://images.pexels.com/photos/1586947/pexels-photo-1586947.jpeg",
        category: "expired",
        createdAt: new Date("2025-07-14")
    },
    {
        name: "Expired Lettuce",
        price: 1.99,
        expiryDate: new Date("2025-07-11"),
        quantity: 50,
        photo: "https://tse1.mm.bing.net/th/id/OIP.5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z?pid=Api&P=0&h=220",
        category: "expired",
        createdAt: new Date("2025-07-14")
    },
    {
        name: "Expired Cheese",
        price: 5.99,
        expiryDate: new Date("2025-07-13"),
        quantity: 30,
        photo: "https://images.pexels.com/photos/773253/pexels-photo-773253.jpeg",
        category: "expired",
        createdAt: new Date("2025-07-14")
    }
];

// Apply discounts dynamically
items.forEach(item => {
    const discount = calculateDiscount(item.expiryDate);
    item.discount = discount;
    item.discountedPrice = parseFloat((item.price * (1 - discount / 100)).toFixed(2));
});

async function seed() {
    try {
        await Item.deleteMany({});
        await Item.insertMany(items);
        console.log('Database seeded with items');
    } catch (err) {
        console.error('Error seeding database:', err.message);
    } finally {
        mongoose.connection.close();
    }
}

seed();