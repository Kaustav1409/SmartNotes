const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const protect = require("../middleware/authMiddleware");

/*
=================================
CREATE NOTE
POST /api/notes
=================================
*/
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, category, pinned } = req.body;

    // Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ message: "Description is required" });
    }

    const note = new Note({
      user: req.user.id,
      title: title.trim(),
      description: description.trim(),
      category: category || "Personal",
      pinned: pinned || false,
    });

    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (err) {
    console.error("Create note error:", err.message);
    res.status(400).json({ message: err.message });
  }
});

/*
=================================
GET USER'S NOTES
GET /api/notes
=================================
*/
router.get("/", protect, async (req, res) => {
  try {
    // Return pinned notes first, then by newest
    const notes = await Note.find({ user: req.user.id }).sort({
      pinned: -1,
      createdAt: -1,
    });

    res.status(200).json(notes);
  } catch (err) {
    console.error("Fetch notes error:", err.message);
    res.status(500).json({ message: "Failed to fetch notes" });
  }
});

/*
=================================
UPDATE NOTE
PUT /api/notes/:id
=================================
*/
router.put("/:id", protect, async (req, res) => {
  try {
    const { title, description, category, pinned } = req.body;

    // Build update object — only include provided fields
    const updateFields = {};
    if (title !== undefined) updateFields.title = title.trim();
    if (description !== undefined) updateFields.description = description.trim();
    if (category !== undefined) updateFields.category = category;
    if (pinned !== undefined) updateFields.pinned = pinned;

    const updatedNote = await Note.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id, // Ensures user can only edit their own notes
      },
      updateFields,
      { new: true, runValidators: true }
    );

    // FIX: Return 404 instead of 200 with null when note not found
    if (!updatedNote) {
      return res.status(404).json({
        message: "Note not found or you are not authorized to edit it",
      });
    }

    res.status(200).json(updatedNote);
  } catch (err) {
    console.error("Update note error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

/*
=================================
DELETE NOTE
DELETE /api/notes/:id
=================================
*/
router.delete("/:id", protect, async (req, res) => {
  try {
    const deletedNote = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id, // Ensures user can only delete their own notes
    });

    // FIX: Return 404 when note doesn't exist
    if (!deletedNote) {
      return res.status(404).json({
        message: "Note not found or you are not authorized to delete it",
      });
    }

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error("Delete note error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;