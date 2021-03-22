import mongoose from "mongoose";

mongoose.connect("mongodb://localhost/user_DB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;

db.on("error", (err) => {
  console.log("Error connecting to Data Base", err);
});

db.once("open", () => {
  console.log("Connected to Post Database");
});

const playerSchema = new mongoose.Schema({
  playerID: {
    type: String,
    required: true,
  },
  playerTAG: {
    type: String,
    required: true,
    unique: true,
  },
  strikes: {
    type: String,
    default: "",
  },
  strikeCount: {
    type: Number,
    default: 0,
  },
});

const Player = mongoose.model("Player", playerSchema);

export default Player;
