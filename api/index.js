const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User.js");
const Place = require("./models/Place.js");
const BookingInfo = require("./models/BookingInfo.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const imageDownloader = require("image-downloader");
const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
require("dotenv").config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "guX9tK7rPGyALZq8";
const bucket = "nigiri-airbnb-clone";

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(
	cors({
		credentials: true,
		origin: "http://localhost:5173",
	})
);
app.get("/api/test", (req, res) => {
	res.send("test OK");
});

async function uploadToS3(path, originalFilename, mimetype) {
	const client = new S3Client({
		region: "eu-north-1",
		credentials: {
			accessKeyId: process.env.S3_ACCESS_KEY,
			secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
		},
	});
	const parts = originalFilename.split(".");
	const ext = parts[parts.length - 1];
	const newFilename = Date.now() + "." + ext;

	await client.send(
		new PutObjectCommand({
			Bucket: bucket,
			Body: fs.readFileSync(path),
			Key: newFilename,
			ContentType: mimetype,
			ACL: "public-read",
		})
	);

	return `https://${bucket}.s3.amazonaws.com/${newFilename}`;
}

app.post("/api/register", async (req, res) => {
	mongoose.connect(process.env.MONGO_URL);

	const { name, email, password } = req.body;
	try {
		const userDoc = await User.create({
			name,
			email,
			password: bcrypt.hashSync(password, bcryptSalt),
		});
		res.json(userDoc);
	} catch (err) {
		res.status(400).json({ message: "User already exists" });
	}
});

app.post("/api/login", async (req, res) => {
	mongoose.connect(process.env.MONGO_URL);

	const { email, password } = req.body;
	const userDoc = await User.findOne({ email });
	if (!userDoc) return res.status(400).json({ message: "User not found" });
	else {
		if (!bcrypt.compareSync(password, userDoc.password))
			res.status(422).json({ message: "Invalid password" });
		else {
			// User authenticated
			jwt.sign(
				{ email: userDoc.email, id: userDoc._id },
				jwtSecret,
				{},
				(err, token) => {
					if (err) return res.status(500).json({ message: "Internal error" });
					res.cookie("token", token).json(userDoc);
				}
			);
		}
	}
});

app.get("/api/profile", async (req, res) => {
	mongoose.connect(process.env.MONGO_URL);

	const { token } = req.cookies;
	if (token) {
		jwt.verify(token, jwtSecret, {}, async (err, userData) => {
			if (err) throw err;

			res.json(await User.findById(userData.id));
		});
	} else {
		res.json(null);
	}
});

app.post("/api/logout", (req, res) => {
	res.cookie("token", "").json({ message: "Logged out" });
});

app.post("/api/upload-by-link", async (req, res) => {
	const { link } = req.body;
	const newName = "photo" + Date.now() + ".jpg";
	try {
		await imageDownloader.image({
			url: link,
			dest: "/tmp/" + newName,
		});

		const url = await uploadToS3("/tmp/" + newName, newName, "image/jpeg");
		res.json({ url });
	} catch (err) {
		res.status(400).json({ message: "Invalid link" });
	}
});

const photosMiddleware = multer({ dest: "/tmp" });
app.post(
	"/api/upload",
	photosMiddleware.array("photos", 100),
	async (req, res) => {
		const uploadedFiles = [];
		for (let i = 0; i < req.files.length; i++) {
			const { path, originalname, mimetype } = req.files[i];
			const url = await uploadToS3(path, originalname, mimetype);
			uploadedFiles.push(url);
		}
		res.json(uploadedFiles);
	}
);

app.post("/api/places", (req, res) => {
	mongoose.connect(process.env.MONGO_URL);

	const {
		title,
		address,
		addedPhotos,
		description,
		extraInfo,
		perks,
		checkIn,
		checkOut,
		maxGuests,
		pricePerNight,
	} = req.body;

	const { token } = req.cookies;

	jwt.verify(token, jwtSecret, {}, async (err, userData) => {
		if (err) throw err;
		const placeDoc = await Place.create({
			owner: userData.id,
			title,
			address,
			photos: addedPhotos,
			description,
			perks,
			extraInfo,
			checkIn,
			checkOut,
			maxGuests,
			pricePerNight,
		});
		res.json(placeDoc);
	});
});

app.get("/api/user-places", (req, res) => {
	mongoose.connect(process.env.MONGO_URL);

	const { token } = req.cookies;
	jwt.verify(token, jwtSecret, {}, async (err, userData) => {
		if (err) throw err;
		const { id } = userData;
		res.json(await Place.find({ owner: id }));
	});
});

app.get("/api/places/:id", async (req, res) => {
	mongoose.connect(process.env.MONGO_URL);

	const { id } = req.params;
	res.json(await Place.findById(id));
});

app.put("/api/places", async (req, res) => {
	mongoose.connect(process.env.MONGO_URL);

	const { token } = req.cookies;
	const {
		id,
		title,
		address,
		addedPhotos,
		description,
		perks,
		extraInfo,
		checkIn,
		checkOut,
		maxGuests,
		pricePerNight,
	} = req.body;

	jwt.verify(token, jwtSecret, {}, async (err, userData) => {
		if (err) throw err;
		const placeDoc = await Place.findById(id);
		if (userData.id === placeDoc.owner.toString()) {
			placeDoc.set({
				title,
				address,
				photos: addedPhotos,
				description,
				perks,
				extraInfo,
				checkIn,
				checkOut,
				maxGuests,
				pricePerNight,
			});
			await placeDoc.save();
			res.json(placeDoc);
		}
	});
});

app.get("/api/places", async (req, res) => {
	mongoose.connect(process.env.MONGO_URL);

	res.json(await Place.find());
});

app.get("/api/users/:id", async (req, res) => {
	mongoose.connect(process.env.MONGO_URL);

	const { id } = req.params;
	res.json(await User.findById(id));
});

app.put("/api/user-profile-photo", async (req, res) => {
	mongoose.connect(process.env.MONGO_URL);

	const { profilePhoto } = req.body;
	const { token } = req.cookies;
	jwt.verify(token, jwtSecret, {}, async (err, userData) => {
		if (err) throw err;
		const userDoc = await User.findById(userData.id);
		userDoc.set({ profilePhoto: profilePhoto[0] });
		await userDoc.save();
		res.json(userDoc);
	});
});

app.put("/api/user/favorites", async (req, res) => {
	mongoose.connect(process.env.MONGO_URL);

	const { placeId } = req.body;
	console.log("placeid", placeId);
	const { token } = req.cookies;
	jwt.verify(token, jwtSecret, {}, async (err, userData) => {
		if (err) throw err;
		const userDoc = await User.findById(userData.id);
		userDoc.set({
			favoritePlaces: [...(userDoc.favoritePlaces ?? []), placeId],
		});
		await userDoc.save();
		res.json(userDoc);
	});
});

app.delete("/api/user/favorites", async (req, res) => {
	mongoose.connect(process.env.MONGO_URL);

	const { placeId } = req.body;
	console.log("placeid", placeId);
	const { token } = req.cookies;
	jwt.verify(token, jwtSecret, {}, async (err, userData) => {
		if (err) throw err;
		const userDoc = await User.findById(userData.id);
		userDoc.set({
			favoritePlaces: userDoc.favoritePlaces.filter(
				(place) => place.toString() !== placeId
			),
		});
		await userDoc.save();
		res.json(userDoc);
	});
});

app.get("/api/account/favorites", async (req, res) => {
	mongoose.connect(process.env.MONGO_URL);

	const { token } = req.cookies;
	jwt.verify(token, jwtSecret, {}, async (err, userData) => {
		if (err) throw err;
		const userDoc = await User.findById(userData.id);
		const favorites = await Place.find({
			_id: { $in: userDoc.favoritePlaces },
		});
		res.json(favorites);
	});
});

app.post("/api/booking", async (req, res) => {
	mongoose.connect(process.env.MONGO_URL);

	const { token } = req.cookies;
	const { data } = req.body;
	jwt.verify(token, jwtSecret, {}, async (err, userData) => {
		if (err) throw err;
		const bookingInfoDoc = await BookingInfo.create({
			user: userData.id,
			place: data.placeId,
			host: data.hostId,
			guests: data.guests,
			enterDate: data.enterDate,
			leaveDate: data.leaveDate,
			nights: data.nights,
			totalPrice: data.totalPrice,
		});
		res.json(bookingInfoDoc);
	});
});

app.delete("/api/booking", async (req, res) => {
	mongoose.connect(process.env.MONGO_URL);

	const { bookingId } = req.body;
	const { token } = req.cookies;
	jwt.verify(token, jwtSecret, {}, async (err, userData) => {
		if (err) throw err;
		const bookingInfoDoc = await BookingInfo.findById(bookingId);
		if (bookingInfoDoc.user.toString() === userData.id) {
			await bookingInfoDoc.deleteOne();
			res.json(bookingInfoDoc);
		}
	});
});

app.get("/api/account/bookings", async (req, res) => {
	mongoose.connect(process.env.MONGO_URL);

	const { token } = req.cookies;
	jwt.verify(token, jwtSecret, {}, async (err, userData) => {
		if (err) throw err;
		const bookings = await BookingInfo.find({ user: userData.id });
		res.json(bookings);
	});
});

app.listen(4000);
