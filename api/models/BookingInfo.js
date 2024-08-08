const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const BookingInfoSchema = new Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	place: { type: mongoose.Schema.Types.ObjectId, ref: "Place" },
	host: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	guests: Number,
	enterDate: String,
	leaveDate: String,
	nights: Number,
	totalPrice: Number,
});

const BookingInfoModel = model("BookingInfo", BookingInfoSchema);
module.exports = BookingInfoModel;
