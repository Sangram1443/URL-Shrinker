require("dotenv").config();
const express = require("express");
const session = require("express-session");
const app = express();
const mongoose = require("mongoose");
const Url = require("./models/Url"); // Mongoose model for the URLs
const PORT = process.env.PORT;

const mongoURI = "mongodb://127.0.0.1:27017/Urls";

// Connect to MongoDB
mongoose
	.connect(mongoURI)
	.then(() => console.log("Connected to MongoDB successfully"))
	.catch((err) => console.error("Error connecting to MongoDB:", err));

app.set("view engine", "ejs");
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(
	session({
		secret: "your-secret-key",
		resave: false,
		saveUninitialized: true,
	})
);

app.get("/:shortUrl", async (req, res) => {
	try {
		const shortUrl = req.params.shortUrl;
		const urlEntry = await Url.findOne({ shortUrl });

		if (urlEntry) {
			res.redirect(urlEntry.fullUrl); // Redirect to the full URL
		} else {
			res.status(404).send("Short URL not found");
		}
	} catch (error) {
		res.status(500).send("Internal Server Error");
	}
});

// Route for form submission
app.post("/urlShortner", async (req, res) => {
	const { fullUrl } = req.body;
	const shortUrl = generateShortUrl(); // Replace with your URL shortening logic

	// Initialize session data if not already present
	if (!req.session.urls) {
		req.session.urls = [];
	}

	// Add the new URL to the session
	req.session.urls.push({ fullUrl, shortUrl });
	const url = new Url({ fullUrl, shortUrl });
	await url.save();

	// Render the updated form and table
	res.redirect("/");
});

// Route to render the form and table
app.get("/", (req, res) => {
	const urls = req.session.urls || [];
	res.render("index", { urls }); // Replace with your template rendering
});

// Function to generate a short URL (placeholder example)
function generateShortUrl() {
	return Math.random().toString(36).substring(2, 8);
}

// Start server
app.listen(PORT, () => {
	console.log("Server running on http://localhost:3000");
});
