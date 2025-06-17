import React, { useState } from "react";
import "./App.css";

/**
 * EmotiTrack AI MainContainer implements all enabled features:
 * - Habit Tracking & Management
 * - Mood Detection & Analysis
 * - Goal Setting & Management
 * - Gamified Challenges (with simplified logic)
 * - User Management (mocked profile and login)
 * 
 * Color Palette:
 *   Primary:   #cce8b5
 *   Secondary: #ffd9a8
 *   Accent:    #ffb5af
 * 
 * Modern, minimal UI with intuitive navigation.
 */

// PUBLIC_INTERFACE
function App() {
  // ---- User State ----
  const [user, setUser] = useState({
    username: "DemoUser",
    avatar: "",
    loggedIn: true, // If not logged in, show login form
  });

  // ---- Feature State Management ----
  const [habits, setHabits] = useState([
    { id: 1, name: "Drink Water", frequency: "daily", completed: false },
    { id: 2, name: "Exercise", frequency: "daily", completed: true },
  ]);
  const [mood, setMood] = useState({ emoji: "🙂", label: "Neutral", notes: "" });
  const [goals, setGoals] = useState([
    { id: 1, name: "Meditate 10 days", progress: 7, target: 10 },
  ]);
  const [challenges, setChallenges] = useState([
    { id: 1, title: "Morning Routine", reward: "Streak Badge", joined: true },
  ]);
  const [xp, setXP] = useState(120);
  const [activePage, setActivePage] = useState("dashboard");

  // ---- Handlers ----
  // User login (mock)
  function handleLogin(username) {
    setUser({ ...user, username, loggedIn: true });
  }

  function handleLogout() {
    setUser({ ...user, loggedIn: false });
  }

  // Habit CRUD
  function handleAddHabit(name, frequency) {
    setHabits([
      ...habits,
      { id: Date.now(), name, frequency, completed: false },
    ]);
    setXP(xp + 10); // Reward for adding habit
  }

  function handleHabitToggle(id) {
    setHabits(
      habits.map((h) =>
        h.id === id ? { ...h, completed: !h.completed } : h
      )
    );
    setXP(xp + 5);
  }

  function handleDeleteHabit(id) {
    setHabits(habits.filter((h) => h.id !== id));
  }

  // Goal CRUD
  function handleAddGoal(name, target) {
    setGoals([...goals, { id: Date.now(), name, progress: 0, target }]);
  }

  function handleGoalProgress(id) {
    setGoals(
      goals.map((g) =>
        g.id === id && g.progress < g.target
          ? { ...g, progress: g.progress + 1 }
          : g
      )
    );
    setXP(xp + 7);
  }

  // Mood Tracking
  function handleSetMood(emoji, label, notes) {
    setMood({ emoji, label, notes });
    setXP(xp + 3);
  }

  // Gamification
  function claimChallengeReward(id) {
    setXP(xp + 20);
    // Optionally mark challenge as completed
    setChallenges(
      challenges.map((c) => (c.id === id ? { ...c, joined: false } : c))
    );
  }

  // ---- UI Pages ----
  function renderNavigation() {
    const navItems = [
      { id: "dashboard", label: "Dashboard" },
      { id: "habit", label: "Habits" },
      { id: "mood", label: "Mood" },
      { id: "goal", label: "Goals" },
      { id: "challenge", label: "Challenges" },
      { id: "profile", label: "Profile" },
    ];
    return (
      <nav className="et-navbar">
        <div className="et-logo">EmotiTrack AI</div>
        <div className="et-nav-items">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`et-nav-btn${activePage === item.id ? " active" : ""}`}
              onClick={() => setActivePage(item.id)}
              aria-label={item.label}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="et-user-mini">
          <span style={{ marginRight: 8 }}>👤 {user.username}</span>
          <button className="et-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
    );
  }

  // --- Dashboard (Main Overview) ---
  function Dashboard() {
    return (
      <section className="et-dashboard">
        <h2>Welcome back, {user.username}!</h2>
        <div className="et-stats-cards">
          <div className="et-card et-primary">
            <span>Habits</span>
            <strong>{habits.length}</strong>
          </div>
          <div className="et-card et-secondary">
            <span>Goals</span>
            <strong>{goals.length}</strong>
          </div>
          <div className="et-card et-accent">
            <span>XP</span>
            <strong>{xp}</strong>
          </div>
        </div>
        <div className="et-dashboard-rows">
          <div>
            <h4>Your Mood</h4>
            <MoodDisplay mood={mood} />
          </div>
          <div>
            <h4>Today's Habits</h4>
            <ul className="et-list">
              {habits.map((habit) => (
                <li key={habit.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={habit.completed}
                    onChange={() => handleHabitToggle(habit.id)}
                  />{" "}
                  {habit.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    );
  }

  // --- Habits Page ---
  function Habits() {
    const [newHabitName, setNewHabitName] = useState("");
    const [newHabitFreq, setNewHabitFreq] = useState("daily");

    return (
      <section className="et-section">
        <h2>Habit Tracking</h2>
        <form
          className="et-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (newHabitName.trim().length) {
              handleAddHabit(newHabitName, newHabitFreq);
              setNewHabitName("");
              setNewHabitFreq("daily");
            }
          }}
        >
          <input
            className="et-input"
            type="text"
            placeholder="New Habit"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
          />
          <select
            className="et-input"
            value={newHabitFreq}
            onChange={(e) => setNewHabitFreq(e.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
          <button className="et-btn et-accent-bg" type="submit">
            Add Habit
          </button>
        </form>
        <ul className="et-list">
          {habits.map((habit) => (
            <li
              key={habit.id}
              className="et-list-item"
              style={{
                textDecoration: habit.completed ? "line-through" : "none",
                color: habit.completed ? "#bbb" : "",
              }}
            >
              <input
                type="checkbox"
                checked={habit.completed}
                onChange={() => handleHabitToggle(habit.id)}
              />
              <span style={{ marginLeft: 8 }}>{habit.name}</span>
              <span className="et-habit-freq">({habit.frequency})</span>
              <button
                className="et-habit-delete"
                onClick={() => handleDeleteHabit(habit.id)}
                aria-label="Delete habit"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  // --- Mood Page ---
  function Mood() {
    const [emoji, setEmoji] = useState("🙂");
    const [label, setLabel] = useState("Neutral");
    const [notes, setNotes] = useState("");

    const presets = [
      { emoji: "😃", label: "Happy" },
      { emoji: "😐", label: "Neutral" },
      { emoji: "😔", label: "Sad" },
      { emoji: "😠", label: "Angry" },
    ];

    function handleSubmit(e) {
      e.preventDefault();
      handleSetMood(emoji, label, notes);
    }

    return (
      <section className="et-section">
        <h2>Mood Tracking</h2>
        <form className="et-form" onSubmit={handleSubmit}>
          <div className="et-mood-options">
            {presets.map((m) => (
              <button
                type="button"
                key={m.label}
                className={`et-mood-btn${emoji === m.emoji ? " selected" : ""}`}
                onClick={() => {
                  setEmoji(m.emoji);
                  setLabel(m.label);
                }}
                aria-label={m.label}
              >
                {m.emoji}
              </button>
            ))}
          </div>
          <textarea
            className="et-input"
            rows={2}
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <button className="et-btn et-primary-bg" type="submit">
            Save Mood
          </button>
        </form>
        <h4>Today's Mood</h4>
        <MoodDisplay mood={mood} />
      </section>
    );
  }

  function MoodDisplay({ mood }) {
    // PUBLIC_INTERFACE
    return (
      <div className="et-mood-display">
        <span style={{ fontSize: 28, marginRight: 8 }}>{mood.emoji}</span>
        <strong>{mood.label}</strong>
        {mood.notes && (
          <div className="et-mood-notes">{mood.notes}</div>
        )}
      </div>
    );
  }

  // --- Goals Page ---
  function Goals() {
    const [goalName, setGoalName] = useState("");
    const [goalTarget, setGoalTarget] = useState(10);

    return (
      <section className="et-section">
        <h2>Goals</h2>
        <form
          className="et-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (goalName && goalTarget > 0) {
              handleAddGoal(goalName, goalTarget);
              setGoalName("");
              setGoalTarget(10);
            }
          }}
        >
          <input
            className="et-input"
            type="text"
            value={goalName}
            placeholder="Goal (e.g. Run 5km)"
            onChange={(e) => setGoalName(e.target.value)}
          />
          <input
            className="et-input"
            style={{ width: 80 }}
            type="number"
            min={1}
            value={goalTarget}
            onChange={(e) => setGoalTarget(Number(e.target.value))}
          />
          <button className="et-btn et-secondary-bg" type="submit">
            Add Goal
          </button>
        </form>
        <ul className="et-list">
          {goals.map((g) => (
            <li key={g.id} className="et-list-item">
              <div>
                <span>{g.name}</span>
                <span className="et-goal-progress">
                  {" "}
                  {g.progress}/{g.target}
                </span>
              </div>
              <progress
                className="et-progress"
                value={g.progress}
                max={g.target}
              />
              <button
                className="et-goal-btn"
                onClick={() => handleGoalProgress(g.id)}
                disabled={g.progress >= g.target}
              >
                {g.progress < g.target ? "+1" : "Done!"}
              </button>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  // --- Challenges Page ---
  function Challenges() {
    return (
      <section className="et-section">
        <h2>Gamified Challenges</h2>
        <ul className="et-list">
          {challenges.map((ch) => (
            <li key={ch.id} className="et-list-item">
              <div>
                <span>{ch.title}</span>{" "}
                <span className="et-challenge-reward">
                  🎁 {ch.reward}
                </span>
              </div>
              <button
                className="et-btn et-accent-bg"
                style={{
                  opacity: ch.joined ? 1 : 0.5,
                  cursor: ch.joined ? "pointer" : "not-allowed",
                }}
                onClick={() => ch.joined && claimChallengeReward(ch.id)}
                disabled={!ch.joined}
              >
                {ch.joined ? "Claim Reward" : "Claimed"}
              </button>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  // --- User Profile Page ---
  function Profile() {
    return (
      <section className="et-section">
        <h2>User Profile</h2>
        <div className="et-profile-box">
          <div className="et-avatar">{user.avatar || "👤"}</div>
          <div>
            <div>
              <strong>Username:</strong> {user.username}
            </div>
            <div>
              <strong>XP:</strong> {xp}
            </div>
          </div>
        </div>
        <button className="et-btn" onClick={handleLogout}>
          Log out
        </button>
      </section>
    );
  }

  // --- Login Page (simple, no actual authentication) ---
  function Login() {
    const [input, setInput] = useState("");
    return (
      <section className="et-login-section">
        <h2>Welcome to EmotiTrack AI</h2>
        <form
          className="et-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim().length > 0) {
              handleLogin(input);
            }
          }}
        >
          <input
            className="et-input"
            type="text"
            placeholder="Enter username"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="et-btn et-primary-bg" type="submit">
            Login
          </button>
        </form>
        <div className="et-login-info">
          <span>Demo only - no account required.</span>
        </div>
      </section>
    );
  }

  // ---- Routing ----
  function renderPage() {
    if (!user.loggedIn) {
      return <Login />;
    }
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
      case "habit":
        return <Habits />;
      case "mood":
        return <Mood />;
      case "goal":
        return <Goals />;
      case "challenge":
        return <Challenges />;
      case "profile":
        return <Profile />;
      default:
        return <Dashboard />;
    }
  }

  return (
    <div className="et-app">
      {user.loggedIn && renderNavigation()}
      <main className="et-main">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
