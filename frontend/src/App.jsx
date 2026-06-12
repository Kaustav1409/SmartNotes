import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Personal");
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/notes"
      );

      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const addNote = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (editId) {
        await axios.put(
          `http://localhost:5000/api/notes/${editId}`,
          {
            title,
            description,
            category,
          }
        );

        setEditId(null);
      } else {
        await axios.post(
          "http://localhost:5000/api/notes",
          {
            title,
            description,
            category,
          }
        );
      }

      setTitle("");
      setDescription("");
      setCategory("Personal");

      fetchNotes();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/notes/${id}`
      );

      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const editNote = (note) => {
    setTitle(note.title);
    setDescription(note.description);
    setCategory(note.category || "Personal");
    setEditId(note._id);
  };

  const filteredNotes = notes
    .filter((note) => {
      const matchesSearch = note.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        filterCategory === "All" ||
        note.category === filterCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "Newest":
          return (
            new Date(b.createdAt) -
            new Date(a.createdAt)
          );

        case "Oldest":
          return (
            new Date(a.createdAt) -
            new Date(b.createdAt)
          );

        case "A-Z":
          return a.title.localeCompare(b.title);

        case "Z-A":
          return b.title.localeCompare(a.title);

        default:
          return 0;
      }
    });

  return (
  <div
  className={`container ${
    darkMode ? "dark-mode" : ""
  }`}
>
    <div className="hero">
  <h1>SmartNotes</h1>

  <p>
    Organize your ideas efficiently 🚀
  </p>

  <br />

  <button
    onClick={() =>
      setDarkMode(!darkMode)
    }
  >
    {darkMode
      ? "☀️ Light Mode"
      : "🌙 Dark Mode"}
  </button>
</div>

    <div className="stats">
      <div className="stat-card">
        <h3>{notes.length}</h3>
        <p>Total</p>
      </div>

      <div className="stat-card">
        <h3>
          {
            notes.filter(
              (note) => note.category === "Study"
            ).length
          }
        </h3>
        <p>Study</p>
      </div>

      <div className="stat-card">
        <h3>
          {
            notes.filter(
              (note) => note.category === "Work"
            ).length
          }
        </h3>
        <p>Work</p>
      </div>

      <div className="stat-card">
        <h3>
          {
            notes.filter(
              (note) =>
                note.category === "Personal"
            ).length
          }
        </h3>
        <p>Personal</p>
      </div>
    </div>

    <div className="filter-section">
      <input
        type="text"
        placeholder="Search Notes..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <br />
      <br />

      <select
        value={filterCategory}
        onChange={(e) =>
          setFilterCategory(e.target.value)
        }
      >
        <option value="All">
          All Categories
        </option>
        <option value="Study">Study</option>
        <option value="Work">Work</option>
        <option value="Personal">
          Personal
        </option>
        <option value="Ideas">Ideas</option>
      </select>

      <br />
      <br />

      <select
        value={sortBy}
        onChange={(e) =>
          setSortBy(e.target.value)
        }
      >
        <option value="Newest">
          Newest First
        </option>
        <option value="Oldest">
          Oldest First
        </option>
        <option value="A-Z">A-Z</option>
        <option value="Z-A">Z-A</option>
      </select>
    </div>

    <div className="form-section">
      <input
        type="text"
        placeholder="Enter Title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      <br />
      <br />

      <textarea
        placeholder="Enter Description"
        value={description}
        onChange={(e) =>
          setDescription(e.target.value)
        }
      />

      <br />
      <br />

      <select
        value={category}
        onChange={(e) =>
          setCategory(e.target.value)
        }
      >
        <option value="Study">Study</option>
        <option value="Work">Work</option>
        <option value="Personal">
          Personal
        </option>
        <option value="Ideas">Ideas</option>
      </select>

      <br />
      <br />

      <button onClick={addNote}>
        {editId
          ? "Update Note"
          : "Add Note"}
      </button>
    </div>

    <h2>
      Total Notes: {filteredNotes.length}
    </h2>

    {filteredNotes.length === 0 && (
      <p
        style={{
          textAlign: "center",
        }}
      >
        📭 No Notes Found
      </p>
    )}

    {filteredNotes.map((note) => (
      <div
        className="note-card"
        key={note._id}
      >
        <h3>{note.title}</h3>

        <div className="category-badge">
          {note.category || "Personal"}
        </div>

        <p>{note.description}</p>

        <div className="note-footer">
          <small>
            📅{" "}
            {new Date(
              note.createdAt
            ).toLocaleDateString()}
          </small>
        </div>

        <button
          onClick={() =>
            editNote(note)
          }
        >
          Edit
        </button>

        <button
          onClick={() =>
            deleteNote(note._id)
          }
        >
          Delete
        </button>
      </div>
    ))}
  </div>
);
}

export default App;