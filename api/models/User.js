const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = new Schema({
	name: String,
	email: {
		type: String,
		unique: true,
	},
	password: String,
	profilePhoto: String,
	favoritePlaces: [{ type: mongoose.Schema.Types.ObjectId, ref: "Place" }],
});

const UserModel = model("User", UserSchema);

module.exports = UserModel;
