const express = require("express");
const GameModel = require("../models/game.model");
const LeaderBoardModel = require("../models/leaderboard.model");
const checkWinner = require("../utils/functions");
const PlayerMoves = require("../utils/enums");

const router = express.Router();

router.post("/start-new-game", async (req, res) => {
  const createAnEmptyGrid = () => {
    return Array(3)
      .fill(null)
      .map(() => Array(3).fill(0));
  };
  const data = new GameModel({
    player_1: req.body.player_1,
    player_2: req.body.player_2,
    game: createAnEmptyGrid(),
  });

  try {
    const response = await data.save();
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong while creating a new game",
      error: error.message,
    });
  }
});

router.patch("/play-game/:id", async (req, res) => {
  try {
    const gameStatus = await GameModel.findById(req.params.id);
    if (!gameStatus) return res.status(404).json({ message: "Game not found" });

    const { player, row, column } = req.body;

    // Validate input
    if (!["player_1", "player_2"].includes(player)) {
      return res.status(400).json({ message: "Invalid player" });
    }
    if (row < 0 || row > 2 || column < 0 || column > 2) {
      return res.status(400).json({ message: "Invalid move, out of bounds." });
    }

    let grid = gameStatus.game;

    //Check if the box is already filled
    if (grid[row][column] !== 0) {
      return res.status(200).json({ message: "Invalid Move!" });
    }

    //add the player move
    grid[row][column] = PlayerMoves[player];

    //Check winner
    let status = checkWinner(grid, PlayerMoves[player]);

    let response = await GameModel.findByIdAndUpdate(
      req.params.id,
      { game: grid },
      {
        new: true,
      }
    );

    status = { ...status, game: response._doc.game };

    if (status?.isWinner) {
      status.winner = gameStatus[player];
      //Find by id and update in the leaderboard;
      let currentWinner = await LeaderBoardModel.findOneAndUpdate(
        { name: gameStatus[player] },
        { $inc: { points: 10 } }, //$inc will increment it by 10
        { new: true, upsert: true } //upsert will create new if it won't exist
      );
    }

    res.status(200).json(status);
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong while saving the game state",
      error: error.message,
    });
  }
});

router.get("/get-leaderboard", async (req, res) => {
  try {
    const response = await LeaderBoardModel.find().sort({ points: -1 });
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong while getting the leaderboard data",
      error: error.messages,
    });
  }
});

module.exports = router;
