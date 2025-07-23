require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const sanitizeHtml = require('sanitize-html');
const path = require('path');
const multer = require('multer');

const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'Uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) return cb(null, true);
        cb('Error: File must be JPG or PNG');
    }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'assets')));
app.use('/Uploads', express.static(path.join(__dirname, 'Uploads')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: { secure: false } // Set to true if using HTTPS
}));

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts, please try again later.'
});

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err.message));

const userSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    password: String,
    role: String,
    mfaEnabled: Boolean,
    notifications: String
});
const User = mongoose.model('User', userSchema);

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

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const authMiddleware = (req, res, next) => {
    const token = req.session.token;
    if (!token) return res.redirect('/login');
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.redirect('/login');
    }
};

const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(403).send('Access denied');
    next();
};

const validCategories = ['fruits', 'vegetables', 'dairy', 'packed-food', 'snacks', 'bakery', 'beverages', 'frozen', 'expired', 'beauty'];

app.get('/', (req, res) => res.redirect('/home'));

app.get('/home', async (req, res) => {
    try {
        console.log('Home route query (GET):', req.query);
        const query = sanitizeHtml(req.query.query || '');
        let filter = {};
        if (query) filter.name = { $regex: query, $options: 'i' };

        const items = await Item.find(filter).sort({ createdAt: -1 }).limit(9).lean();
        console.log('Fetched items:', items.length);
        const products = items.map(item => ({
            name: item.name,
            image: item.photo || 'https://via.placeholder.com/300',
            price: item.discountedPrice || item.price,
            oldPrice: item.discount > 0 ? item.price : null,
            category: item.category || ''
        }));

        res.render('home', {
            title: 'FreshCart',
            user: req.session.user || null,
            products,
            selectedCategory: '',
            searchQuery: query,
            error: null
        });
    } catch (err) {
        console.error('Error in /home route (GET):', err.message);
        res.status(500).render('home', {
            title: 'FreshCart',
            user: req.session.user || null,
            products: [],
            selectedCategory: '',
            searchQuery: '',
            error: 'Failed to load products'
        });
    }
});

app.post('/home', async (req, res) => {
    try {
        console.log('Home route query (POST):', req.body);
        const query = sanitizeHtml(req.body.query || '').toLowerCase();
        if (validCategories.includes(query)) {
            return res.redirect(`/todays-deals?category=${encodeURIComponent(query)}`);
        }

        let filter = {};
        if (query) filter.name = { $regex: query, $options: 'i' };

        const items = await Item.find(filter).sort({ createdAt: -1 }).limit(9).lean();
        console.log('Fetched items:', items.length);
        const products = items.map(item => ({
            name: item.name,
            image: item.photo || 'https://via.placeholder.com/300',
            price: item.discountedPrice || item.price,
            oldPrice: item.discount > 0 ? item.price : null,
            category: item.category || ''
        }));

        res.render('home', {
            title: 'FreshCart',
            user: req.session.user || null,
            products,
            selectedCategory: '',
            searchQuery: query,
            error: null
        });
    } catch (err) {
        console.error('Error in /home route (POST):', err.message);
        res.status(500).render('home', {
            title: 'FreshCart',
            user: req.session.user || null,
            products: [],
            selectedCategory: '',
            searchQuery: '',
            error: 'Failed to load products'
        });
    }
});

app.get('/search', async (req, res) => {
    try {
        console.log('Search route query (GET):', req.query);
        const query = sanitizeHtml(req.query.query || '').toLowerCase();
        if (validCategories.includes(query)) {
            return res.redirect(`/todays-deals?category=${encodeURIComponent(query)}`);
        }
        return res.redirect(`/home?query=${encodeURIComponent(query)}`);
    } catch (err) {
        console.error('Error in /search route (GET):', err.message);
        res.redirect('/home');
    }
});

app.get('/todays-deals', async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const query = sanitizeHtml(req.query.query || '');
        const category = sanitizeHtml(req.query.category || '').toLowerCase();
        let filter = { createdAt: { $gte: startOfDay } };
        if (query) filter.name = { $regex: query, $options: 'i' };
        if (category && validCategories.includes(category)) filter.category = category;

        console.log('Todays-deals route query (GET):', { query, category, filter });
        const deals = await Item.find(filter).lean();
        console.log('Fetched deals:', deals.length);
        res.render('todays-deals', {
            title: "Today's Deals",
            deals: deals.map(item => ({
                name: item.name,
                originalPrice: item.price,
                discount: item.discount,
                discountedPrice: item.discountedPrice,
                expiryCountdown: Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)),
                photo: item.photo,
                category: item.category || ''
            })),
            user: req.session.user || null,
            searchQuery: query,
            selectedCategory: category
        });
    } catch (err) {
        console.error('Error in /todays-deals route (GET):', err.message);
        res.status(500).render('todays-deals', {
            title: "Today's Deals",
            deals: [],
            user: req.session.user || null,
            searchQuery: '',
            selectedCategory: '',
            error: 'Failed to load deals'
        });
    }
});

app.post('/todays-deals', async (req, res) => {
    try {
        console.log('Todays-deals route query (POST):', req.body);
        const query = sanitizeHtml(req.body.query || '');
        const category = sanitizeHtml(req.body.category || '').toLowerCase();
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        let filter = { createdAt: { $gte: startOfDay } };
        if (query) filter.name = { $regex: query, $options: 'i' };
        if (category && validCategories.includes(category)) filter.category = category;

        const deals = await Item.find(filter).lean();
        console.log('Fetched deals:', deals.length);
        res.render('todays-deals', {
            title: "Today's Deals",
            deals: deals.map(item => ({
                name: item.name,
                originalPrice: item.price,
                discount: item.discount,
                discountedPrice: item.discountedPrice,
                expiryCountdown: Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)),
                photo: item.photo,
                category: item.category || ''
            })),
            user: req.session.user || null,
            searchQuery: query,
            selectedCategory: category
        });
    } catch (err) {
        console.error('Error in /todays-deals route (POST):', err.message);
        res.status(500).render('todays-deals', {
            title: "Today's Deals",
            deals: [],
            user: req.session.user || null,
            searchQuery: '',
            selectedCategory: '',
            error: 'Failed to load deals'
        });
    }
});

app.get('/login', (req, res) => {
    res.render('login', { title: 'Login', error: null, mfaRequired: false, user: req.session.user || null });
});

app.post('/login', loginLimiter, async (req, res) => {
    const { email, password, mfa } = req.body;
    const sanitizedEmail = sanitizeHtml(email);
    const user = await User.findOne({ email: sanitizedEmail });
    if (!user || !await bcrypt.compare(password, user.password)) {
        return res.render('login', { title: 'Login', error: 'Invalid credentials', mfaRequired: false, user: null });
    }
    if (user.mfaEnabled) {
        if (!mfa) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            req.session.tempOtp = otp;
            req.session.tempUserId = user._id;
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'MFA Code',
                text: `Your MFA code is ${otp}`
            });
            return res.render('login', { title: 'Login', error: null, mfaRequired: true, user: null });
        }
        if (mfa !== req.session.tempOtp) {
            return res.render('login', { title: 'Login', error: 'Invalid MFA code', mfaRequired: true, user: null });
        }
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    req.session.token = token;
    req.session.user = { userId: user._id, role: user.role };
    if (user.role === 'admin') {
        res.redirect('/admin-dashboard');
    } else {
        res.redirect('/todays-deals');
    }
});

app.get('/signup', (req, res) => {
    res.render('signup', { title: 'Sign Up', user: req.session.user || null });
});

app.post('/signup', async (req, res) => {
    const { name, phone, email, password, role } = req.body;
    const sanitizedName = sanitizeHtml(name);
    const sanitizedPhone = sanitizeHtml(phone);
    const sanitizedEmail = sanitizeHtml(email);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        name: sanitizedName,
        phone: sanitizedPhone,
        email: sanitizedEmail,
        password: hashedPassword,
        role: role || 'customer',
        mfaEnabled: false,
        notifications: 'email'
    });
    await user.save();
    res.redirect('/login');
});

app.get('/forgot-password', (req, res) => {
    res.render('forgot-password', { title: 'Reset Password', message: null, resetToken: null, error: null, user: req.session.user || null });
});

app.post('/forgot-password', async (req, res) => {
    const { email, phone } = req.body;
    const sanitizedInput = sanitizeHtml(email || phone);
    const user = await User.findOne(email ? { email: sanitizedInput } : { phone: sanitizedInput });
    if (user) {
        const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset',
            text: `Click to reset your password: http://localhost:${process.env.PORT}/reset-password/${resetToken}`
        });
    }
    res.render('forgot-password', { title: 'Reset Password', message: 'Reset link sent if account exists', resetToken: null, error: null, user: req.session.user || null });
});

app.get('/reset-password/:token', async (req, res) => {
    try {
        const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
        res.render('forgot-password', { title: 'Reset Password', message: null, resetToken: req.params.token, error: null, user: req.session.user || null });
    } catch (err) {
        res.render('forgot-password', { title: 'Reset Password', message: null, resetToken: null, error: 'Invalid or expired reset link', user: req.session.user || null });
    }
});

app.post('/reset-password/:token', async (req, res) => {
    const { newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) {
        return res.render('forgot-password', { title: 'Reset Password', message: null, resetToken: req.params.token, error: 'Passwords do not match', user: req.session.user || null });
    }
    try {
        const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(decoded.userId, { password: hashedPassword });
        res.redirect('/login');
    } catch (err) {
        res.render('forgot-password', { title: 'Reset Password', message: null, resetToken: null, error: 'Invalid or expired reset link', user: req.session.user || null });
    }
});

app.get('/admin-dashboard', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const items = await Item.find().lean();
        const wasteValue = items.reduce((sum, item) => item.expiryDate < new Date() ? sum + (item.price * item.quantity) : sum, 0);
        res.render('admin-dashboard', { title: 'Admin Dashboard', items, wasteValue, user: req.session.user || null, error: null });
    } catch (err) {
        console.error('Error in /admin-dashboard route:', err.message);
        res.status(500).render('admin-dashboard', {
            title: 'Admin Dashboard',
            items: [],
            wasteValue: 0,
            user: req.session.user || null,
            error: 'Failed to load dashboard data'
        });
    }
});

app.get('/admin-profile', authMiddleware, adminMiddleware, async (req, res) => {
    const user = await User.findById(req.user.userId);
    res.render('admin-profile', { title: 'Admin Profile', user: req.session.user || null });
});

app.post('/admin-profile', authMiddleware, adminMiddleware, async (req, res) => {
    const { name, email, mfa, notifications } = req.body;
    await User.findByIdAndUpdate(req.user.userId, {
        name: sanitizeHtml(name),
        email: sanitizeHtml(email),
        mfaEnabled: mfa === 'on',
        notifications
    });
    res.redirect('/admin-profile');
});

app.get('/add-item', authMiddleware, adminMiddleware, (req, res) => {
    res.render('add-item', {
        title: 'Add Item',
        user: req.session.user || null,
        error: null
    });
});

app.post('/add-item', authMiddleware, adminMiddleware, upload.single('photo'), async (req, res) => {
    try {
        console.log('POST /add-item - Form data:', req.body);
        console.log('POST /add-item - File:', req.file);
        const { name, price, expiryDate, quantity, category } = req.body;
        const discount = calculateDiscount(new Date(expiryDate));
        const discountedPrice = parseFloat((price * (1 - discount / 100)).toFixed(2));
        const item = new Item({
            name: sanitizeHtml(name),
            price: parseFloat(price),
            expiryDate: new Date(expiryDate),
            quantity: parseInt(quantity),
            discount,
            discountedPrice,
            photo: req.file ? `/Uploads/${req.file.filename}` : 'https://via.placeholder.com/300',
            category: sanitizeHtml(category),
            createdAt: new Date()
        });
        await item.save();
        console.log('Item saved:', item);
        res.redirect('/todays-deals');
    } catch (err) {
        console.error('Error in /add-item route (POST):', err.message);
        res.status(500).render('add-item', {
            title: 'Add Item',
            user: req.session.user || null,
            error: 'Failed to add item: ' + err.message
        });
    }
});

app.get('/contact-us', (req, res) => {
    res.render('contact-us', { title: 'Contact Us', message: null, error: null, user: req.session.user || null });
});

app.post('/contact-us', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !subject || !message) {
            return res.render('contact-us', {
                title: 'Contact Us',
                message: null,
                error: 'All fields are required',
                user: req.session.user || null
            });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.render('contact-us', {
                title: 'Contact Us',
                message: null,
                error: 'Invalid email address',
                user: req.session.user || null
            });
        }
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `Contact Form: ${sanitizeHtml(subject)}`,
            text: `From: ${sanitizeHtml(name)}\nEmail: ${sanitizeHtml(email)}\nMessage: ${sanitizeHtml(message)}`
        });
        res.render('contact-us', {
            title: 'Contact Us',
            message: 'Message sent successfully',
            error: null,
            user: req.session.user || null
        });
    } catch (err) {
        console.error('Error in /contact-us route (POST):', err.message);
        res.render('contact-us', {
            title: 'Contact Us',
            message: null,
            error: 'Failed to send message',
            user: req.session.user || null
        });
    }
});

app.get('/faq', (req, res) => {
    res.render('faq', { title: 'FAQ', user: req.session.user || null });
});

app.get('/wishlist', (req, res) => res.send('Wishlist Page (Placeholder)'));

app.get('/cart', (req, res) => res.send('Cart Page (Placeholder)'));

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/home');
});

app.get('/audit-log', authMiddleware, adminMiddleware, (req, res) => res.send('Audit Log Page (Placeholder)'));

app.get('/expired', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const items = await Item.find({ expiryDate: { $lt: new Date() } }).lean();
        console.log('Fetched expired items:', items.length);
        res.render('expired', {
            title: 'Expired Items',
            items: items.map(item => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                expiryDate: new Date(item.expiryDate).toLocaleDateString(),
                photo: item.photo || 'https://via.placeholder.com/300',
                category: item.category || ''
            })),
            user: req.session.user || null,
            error: null
        });
    } catch (err) {
        console.error('Error in /expired route:', err.message);
        res.status(500).render('expired', {
            title: 'Expired Items',
            items: [],
            user: req.session.user || null,
            error: 'Failed to load expired items'
        });
    }
});

function calculateDiscount(expiryDate) {
    const daysLeft = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24));
    if (expiryDate < new Date()) return 90;
    if (daysLeft <= 3) return 50;
    if (daysLeft <= 15) return 30;
    if (daysLeft <= 35) return 10;
    if (daysLeft <= 70) return 5;
    return 0;
}

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));