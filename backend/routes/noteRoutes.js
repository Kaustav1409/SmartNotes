const express = require("express");
const router = express.Router();

const Note = require("../models/Note");
const protect = require("../middleware/authMiddleware");

// CREATE NOTE
router.post("/", protect, async (req, res) => {
  try {
    const note = new Note({
      user: req.user.id,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      pinned: req.body.pinned || false,
    });

    const saved = await note.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// GET USER NOTES
router.get("/", protect, async (req, res) => {
  try {
    const notes = await Note.find({
      user: req.user.id,
    });

    res.json(notes);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// UPDATE NOTE
router.put("/:id", protect, async (req, res) => {
  try {
    const updatedNote =
      await Note.findOneAndUpdate(
        {
          _id: req.params.id,
          user: req.user.id,
        },
        {
          title: req.body.title,
          description:
            req.body.description,
          category: req.body.category,
          pinned: req.body.pinned,
        },
        {
          new: true,
        }
      );

    res.json(updatedNote);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// DELETE NOTE
router.delete(
  "/:id",
  protect,
  async (req, res) => {
    try {
      await Note.findOneAndDelete({
        _id: req.params.id,
        user: req.user.id,
      });

      res.json({
        message: "Note deleted",
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

module.exports = router;