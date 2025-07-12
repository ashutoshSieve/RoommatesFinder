require("dotenv").config("");
const mongoose=require("mongoose");

mongoose.connect(process.env.URL)
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch((error) => console.error("MongoDB connection error:", error));

  
const preferenceSchema = new mongoose.Schema({
  city: String,
  age: String,
  sleepSchedule: String,
  foodHabit: String,
  noiseTolerance: String,
  cleanlinessLevel: String,
  budgetRange: String,
  location: String,
  petsAllowed: Boolean,
  smoking: Boolean,
  foodHabit: String,
  sleepSchedule: String
});

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  gender: String,
  profileImage: String,
  preferences: preferenceSchema
});

module.exports = mongoose.model("User", userSchema);
