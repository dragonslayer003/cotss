import mongoose from "mongoose";
var link = "mongodb+srv://COC:cocPassword@cluster0.h55gv.mongodb.net/user_DB?retryWrites=true&w=majority"
mongoose.connect(link, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;

db.on("error", (err) => {
  console.log("Error connecting to Data Base", err);
});

db.once("open", () => {
  console.log("Connected to User Database");
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
