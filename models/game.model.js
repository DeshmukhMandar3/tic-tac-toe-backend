const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  player_1: { type: String, required: true },
  player_2: { type: String, required: true },
  game: {
    type: [[Number]],
    validate: {
      validator: function (arr) {
        return arr.length === 3 && arr.every((row) => row.length === 3);
      },
      message: "The game field must be 3x3 matrix",
    },
  },
});

module.exports = mongoose.model("game", gameSchema);
