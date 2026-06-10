const express = require("express");
const router = express.Router();

const Note = require("../models/Note");

// CREATE NOTE
router.post("/", async (req, res) => {
  try {
    const note = new Note({
      title: req.body.title,
      description: req.body.description,
    });

    const saved = await note.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// GET ALL NOTES
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find();

    res.json(notes);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// DELETE NOTE
router.delete("/:id", async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);

    res.json({
      message: "Note deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;

