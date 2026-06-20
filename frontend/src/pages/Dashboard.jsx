import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import "../App.css";

// Helper: return CSS class for category badge
function getCategoryClass(category) {
  switch (category) {
    case "Study":    return "badge-study";
    case "Work":     return "badge-work";
    case "Personal": return "badge-personal";
    case "Ideas":    return "badge-ideas";
    default:         return "badge-default";
  }
}

function Dashboard() {
  const navigate = useNavigate();

  // ─── Auth State ────────────────────────────────────────
  const [user, setUser] = useState(null);

  // ─── Notes State ───────────────────────────────────────
  const [notes, setNotes] = useState([]);        // ALWAYS an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ─── Form State ────────────────────────────────────────
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Personal");
  const [editId, setEditId] = useState(null);    // null = create mode, id = edit mode
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // ─── Filter / Sort State ───────────────────────────────
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  // ─── UI State ──────────────────────────────────────────
  const [darkMode, setDarkMode] = useState(false);

  // ─── On Mount: Load user from localStorage, fetch notes ─
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      fetchNotes();
    } else {
      // No session — ProtectedRoute handles redirect, but safety fallback
      navigate("/login");
    }
  }, []);

  // ─── Fetch Notes ────────────────────────────────────────
  // CRITICAL FIX: was calling "http://localhost:5000" (root) → now /api/notes
  const fetchNotes = async () => {
    setError("");
    try {
      const res = await axiosInstance.get("/api/notes");
      // Defensive: always ensure we store an array
      setNotes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError("Failed to load notes. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Logout ─────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // ─── Add / Update Note ──────────────────────────────────
  const handleSaveNote = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!title.trim() || !description.trim()) {
      setFormError("Please fill in both title and description.");
      return;
    }

    setFormLoading(true);

    try {
      if (editId) {
        // CRITICAL FIX: was "http://localhost:5000" → now /api/notes/:id with actual ID
        await axiosInstance.put(`/api/notes/${editId}`, {
          title: title.trim(),
          description: description.trim(),
          category,
        });
        setEditId(null);
      } else {
        // CRITICAL FIX: was "http://localhost:5000" → now /api/notes
        await axiosInstance.post("/api/notes", {
          title: title.trim(),
          description: description.trim(),
          category,
        });
      }

      // Reset form
      setTitle("");
      setDescription("");
      setCategory("Personal");

      // Refresh list
      await fetchNotes();
    } catch (err) {
      setFormError(
        err.response?.data?.message || "Failed to save note. Please try again."
      );
    } finally {
      setFormLoading(false);
    }
  };

  // ─── Cancel Edit ─────────────────────────────────────────
  const cancelEdit = () => {
    setEditId(null);
    setTitle("");
    setDescription("");
    setCategory("Personal");
    setFormError("");
  };

  // ─── Start Editing a Note ────────────────────────────────
  const startEdit = (note) => {
    setTitle(note.title);
    setDescription(note.description);
    setCategory(note.category || "Personal");
    setEditId(note._id);
    setFormError("");
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ─── Delete Note ─────────────────────────────────────────
  const deleteNote = async (id) => {
    if (!window.confirm("Delete this note?")) return;

    try {
      // CRITICAL FIX: was "http://localhost:5000" (no ID!) → now /api/notes/:id
      await axiosInstance.delete(`/api/notes/${id}`);
      await fetchNotes();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete note.");
    }
  };

  // ─── Toggle Pin ──────────────────────────────────────────
  const togglePin = async (note) => {
    try {
      // CRITICAL FIX: was "http://localhost:5000" (no ID!) → now /api/notes/:id
      await axiosInstance.put(`/api/notes/${note._id}`, {
        title: note.title,
        description: note.description,
        category: note.category,
        pinned: !note.pinned,
      });
      await fetchNotes();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update pin.");
    }
  };

  // ─── Derived: Filtered + Sorted Notes ───────────────────
  const filteredNotes = notes
    .filter((note) => {
      const matchesSearch =
        note.title.toLowerCase().includes(search.toLowerCase()) ||
        note.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        filterCategory === "All" || note.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // Pinned notes always first
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      switch (sortBy) {
        case "Newest":  return new Date(b.createdAt) - new Date(a.createdAt);
        case "Oldest":  return new Date(a.createdAt) - new Date(b.createdAt);
        case "A-Z":     return a.title.localeCompare(b.title);
        case "Z-A":     return b.title.localeCompare(a.title);
        default:        return 0;
      }
    });

  // ─── Stats ───────────────────────────────────────────────
  const totalNotes    = notes.length;
  const pinnedNotes   = notes.filter((n) => n.pinned).length;
  const studyNotes    = notes.filter((n) => n.category === "Study").length;
  const workNotes     = notes.filter((n) => n.category === "Work").length;

  // ─── Render ──────────────────────────────────────────────
  return (
    <div className={`container ${darkMode ? "dark-mode" : ""}`}>

      {/* ── Header ─────────────────────────────────────── */}
      <div className="hero">
        <h1>📝 SmartNotes</h1>
        <p>Organize your ideas efficiently 🚀</p>
        {user && (
          <p className="user-greeting">
            Welcome back, <strong>{user.name}</strong>!
          </p>
        )}

        <div className="hero-actions">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="btn-secondary btn-sm"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="btn-secondary btn-sm"
          >
            👤 Profile
          </button>

          <button
            onClick={logout}
            className="btn-danger btn-sm"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* ── Stats Cards ────────────────────────────────── */}
      <div className="stats">
        <div className="stat-card">
          <h3>{totalNotes}</h3>
          <p>Total</p>
        </div>
        <div className="stat-card">
          <h3>{pinnedNotes}</h3>
          <p>Pinned</p>
        </div>
        <div className="stat-card">
          <h3>{studyNotes}</h3>
          <p>Study</p>
        </div>
        <div className="stat-card">
          <h3>{workNotes}</h3>
          <p>Work</p>
        </div>
      </div>

      {/* ── Error Banner ───────────────────────────────── */}
      {error && (
        <div className="alert alert-error">
          ⚠️ {error}
        </div>
      )}

      {/* ── Add / Edit Form ────────────────────────────── */}
      <div className="form-section">
        <h3>{editId ? "✏️ Edit Note" : "➕ Add New Note"}</h3>

        {formError && (
          <div className="alert alert-error">
            ⚠️ {formError}
          </div>
        )}

        <form onSubmit={handleSaveNote}>
          <div className="form-group" style={{ marginBottom: "12px" }}>
            <input
              type="text"
              placeholder="Note title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={formLoading}
            />
          </div>

          <div className="form-group" style={{ marginBottom: "12px" }}>
            <textarea
              placeholder="Note description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={formLoading}
            />
          </div>

          <div className="form-row">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={formLoading}
            >
              <option value="Study">📚 Study</option>
              <option value="Work">💼 Work</option>
              <option value="Personal">🙋 Personal</option>
              <option value="Ideas">💡 Ideas</option>
            </select>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="submit"
                disabled={formLoading}
                style={{ flex: 1 }}
              >
                {formLoading
                  ? "Saving..."
                  : editId
                  ? "Update Note"
                  : "Add Note"}
              </button>

              {editId && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={cancelEdit}
                  disabled={formLoading}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* ── Filter & Sort ──────────────────────────────── */}
      <div className="filter-section">
        <div className="filter-row">
          <div className="form-group">
            <input
              type="text"
              placeholder="🔍 Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="form-group">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Study">📚 Study</option>
              <option value="Work">💼 Work</option>
              <option value="Personal">🙋 Personal</option>
              <option value="Ideas">💡 Ideas</option>
            </select>
          </div>

          <div className="form-group">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="Newest">Newest First</option>
              <option value="Oldest">Oldest First</option>
              <option value="A-Z">Title A → Z</option>
              <option value="Z-A">Title Z → A</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Notes Section ──────────────────────────────── */}
      <div className="section-header">
        <h2>
          {filteredNotes.length === 0
            ? "No Notes Found"
            : `${filteredNotes.length} Note${filteredNotes.length !== 1 ? "s" : ""}`}
        </h2>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <span>Loading your notes...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredNotes.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <p>
            {search || filterCategory !== "All"
              ? "No notes match your search or filter."
              : "You haven't created any notes yet. Add your first one above!"}
          </p>
        </div>
      )}

      {/* Notes Grid */}
      {!loading && (
        <div className="notes-grid">
          {filteredNotes.map((note) => (
            <div
              key={note._id}
              className={`note-card ${note.pinned ? "pinned" : ""}`}
            >
              {/* Note Header */}
              <div className="note-card-header">
                <h3>{note.title}</h3>
                {note.pinned && (
                  <span className="pin-badge">📌 Pinned</span>
                )}
              </div>

              {/* Category Badge */}
              <span
                className={`category-badge ${getCategoryClass(note.category)}`}
              >
                {note.category || "Personal"}
              </span>

              {/* Description */}
              <p>{note.description}</p>

              {/* Footer: date + actions */}
              <div className="note-footer">
                <small>
                  📅{" "}
                  {new Date(note.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </small>

                <div className="note-actions">
                  <button
                    className="btn-sm btn-warning"
                    onClick={() => togglePin(note)}
                    title={note.pinned ? "Unpin note" : "Pin note"}
                  >
                    {note.pinned ? "📌 Unpin" : "📍 Pin"}
                  </button>

                  {/* FIX: Edit button was completely MISSING — now added */}
                  <button
                    className="btn-sm btn-secondary"
                    onClick={() => startEdit(note)}
                    title="Edit note"
                  >
                    ✏️ Edit
                  </button>

                  <button
                    className="btn-sm btn-danger"
                    onClick={() => deleteNote(note._id)}
                    title="Delete note"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;