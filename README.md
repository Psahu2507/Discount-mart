FreshCart is a full-stack e-commerce web application designed to promote sustainable shopping by offering discounted groceries nearing their expiry dates, helping to reduce food waste while providing affordable options to customers. Built with Node.js, Express, and EJS, the platform features a clean, responsive user interface with a consistent design across all pages, leveraging modern web technologies and best practices. The application includes user authentication, product browsing, form validation, and an interactive FAQ section, making it a robust solution for both customers and administrators.
Features

This is a youtube link of the working project - https://www.youtube.com/watch?feature=shared&v=ZcNO4UhwXp4

User Authentication: Secure login and signup functionality with form validation, including password visibility toggling and role-based access (Customer or Admin).
Product Catalog: A searchable product listing on the homepage, allowing users to browse discounted grocery items efficiently.
Contact Us: A dedicated customer support page with contact information (phone, email, hours) and a form for submitting inquiries.
Interactive FAQs: An accordion-style FAQ section where users can toggle questions to view answers, enhancing user engagement.
Responsive Design: Fully responsive layouts styled with Jost and Playfair Display fonts, ensuring a consistent and visually appealing experience across devices.
Client-Side Validation: JavaScript-driven validation for forms, including email format checks, password length requirements, and phone number formatting.
CSRF Protection: Secure form submissions with CSRF tokens to prevent cross-site request forgery attacks.

Technologies Used

Backend:
Node.js
Express.js
EJS (Embedded JavaScript) for templating


Frontend:
HTML5, CSS3, JavaScript
Font Awesome for icons
Google Fonts (Jost and Playfair Display)


Other:
MongoDB (assumed for user data and submissions, based on project context)
Multer (for potential file uploads, if integrated)
CSRF middleware for security




views/: Contains EJS templates for rendering pages, with header.ejs and footer.ejs for consistent navigation and footer content.
assets/js/: Client-side JavaScript files for form validation, password toggling, phone number formatting, and FAQ accordion functionality.
index.js: Main server file (assumed) handling routes, middleware, and backend logic.

Installation

Clone the Repository:
git clone https://github.com/your-username/DiscountMart.git
cd DiscountMart


Install Dependencies:
npm install

Ensure you have Node.js and npm installed. Required packages include express, ejs, and others listed in package.json.

Set Up Environment:

Create a .env file for sensitive data (e.g., MongoDB URI, session secrets) if applicable.
Example .env:PORT=3000
MONGODB_URI=mongodb://localhost:27017/discountmart




Run MongoDB:

Ensure MongoDB is running locally or provide a cloud-based MongoDB URI.
Start MongoDB: mongod


Start the Server:
node index.js

The application will run on http://localhost:3000 (or the specified port).

Access the Application:

Open a browser and navigate to http://localhost:3000.
Explore the homepage, login, signup, contact us, and FAQ pages.



Usage

Homepage: Browse discounted grocery items and use the search bar to find specific products.
Login: Access your account with email and password. Toggle password visibility for convenience.
Signup: Create a new account by providing name, phone, email, password, and role (Customer or Admin).
Contact Us: Submit inquiries via the contact form or view support contact details.
FAQs: Click on questions to toggle answers in an accordion-style layout.

Development Notes

Styling: All pages use inline CSS with consistent fonts (Jost for body text, Playfair Display for headings) and a color scheme defined by CSS variables (--primary, --secondary, --text, etc.).
JavaScript:
login.js: Handles password visibility toggling and form validation.
signup.js: Formats phone numbers, validates forms, and adds visual feedback for required fields.
contact-us.js: Validates contact form submissions with email regex checks.
faq.js: Implements accordion functionality for FAQs, toggling answers on click.


EJS Templates: Pages are modularized with header.ejs and footer.ejs for consistent navigation and footer content.
Error Handling: Ensure index.js includes proper middleware for CSRF protection and error handling (e.g., Multer for file uploads, if used).

Debugging Tips

EJS Syntax Errors: If you encounter SyntaxError: Invalid or unexpected token, use ejs-lint to debug:npm install -g ejs-lint
ejs-lint views/faq.ejs


FAQ Toggle Issues: If the FAQ accordion doesn’t work, check the console for errors, verify the Font Awesome CDN, and ensure .faq-question and .faq-answer elements are rendered correctly.
File Encoding: Save all .ejs files in UTF-8 without BOM to avoid parsing issues.
Server Logs: Check server logs for errors related to routes or MongoDB connections.

Contributing
Contributions are welcome! Please follow these steps:



