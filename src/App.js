// ============================================================================
// IMPORTS
// ============================================================================
import "./style.css"; // Import CSS styles
import { useState, useEffect } from "react"; // React hooks for state management and side effects
import supabase from "./supabase"; // Supabase client for database operations

// ============================================================================
// CONSTANTS & DATA
// ============================================================================

// Define available categories with their colors for UI styling
const CATEGORIES = [
  { name: "technology", color: "#3b82f6" }, // Blue
  { name: "science", color: "#16a34a" }, // Green
  { name: "finance", color: "#ef4444" }, // Red
  { name: "society", color: "#eab308" }, // Yellow
  { name: "entertainment", color: "#db2777" }, // Pink
  { name: "health", color: "#14b8a6" }, // Teal
  { name: "history", color: "#8b5cf6" }, // Purple
  { name: "news", color: "#f97316" }, // Orange
];

// Sample facts data (fallback when database is not available)
// Note: This is currently unused but kept for potential future use

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Utility function to validate HTTP URLs
function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string); // Try to create URL object
  } catch (_) {
    return false; // Return false if URL is invalid
  }
  return url.protocol === "http:" || url.protocol === "https:"; // Only allow HTTP/HTTPS
}

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

// Main App component - the root component of the application
function App() {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  const [showForm, setShowForm] = useState(false); // Controls form visibility
  const [facts, setFacts] = useState([]); // Stores all facts from database
  const [isLoading, setIsLoading] = useState(false); // Controls loading spinner
  const [currentCategory, setCurrentCategory] = useState("All"); // Current selected category filter
  const [sortBy, setSortBy] = useState("votesInteresting"); // Current sort field
  const [sortOrder, setSortOrder] = useState("desc"); // Current sort order (asc/desc)
  const [searchQuery, setSearchQuery] = useState(""); // Search query for filtering facts
  const [excludeDisputed, setExcludeDisputed] = useState(false); // Whether to exclude disputed facts

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  // Function to filter facts based on search query and disputed status
  const getFilteredFacts = (factsToFilter) => {
    if (!factsToFilter || factsToFilter.length === 0) return factsToFilter;

    let filtered = factsToFilter;

    // Filter out disputed facts if excludeDisputed is true
    if (excludeDisputed) {
      filtered = filtered.filter((f) => !(f.votesFalse > f.votesInteresting));
    }

    // Apply search filter
    const q = searchQuery.trim().toLowerCase();
    if (!q) return filtered;

    return filtered.filter((f) => {
      const text = (f.text || "").toLowerCase();
      const source = (f.source || "").toLowerCase();
      const category = (f.category || "").toLowerCase();
      return text.includes(q) || source.includes(q) || category.includes(q);
    });
  };

  // Function to sort facts based on current sort settings
  const getSortedFacts = (factsToSort) => {
    if (!factsToSort || factsToSort.length === 0) return factsToSort;

    return [...factsToSort].sort((a, b) => {
      const aValue = a[sortBy] || 0;
      const bValue = b[sortBy] || 0;

      if (sortOrder === "asc") {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
  };

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  // useEffect hook runs when component mounts and when currentCategory changes
  useEffect(
    function () {
      // Async function to fetch facts from Supabase database
      async function getFacts() {
        setIsLoading(true); // Show loading spinner

        // Build the database query
        let query = supabase
          .from("Facts") // Select from Facts table
          .select("*") // Select all columns
          .order("votesInteresting", { ascending: false }) // Sort by interesting votes (descending)
          .limit(100); // Limit to 100 facts for performance

        // Only filter by category if it's not "All" (show all facts when "All" is selected)
        if (currentCategory !== "All") {
          query = query.eq("category", currentCategory); // Add category filter
        }

        // Execute the query
        const { data: facts, error } = await query;

        // Handle the response
        if (!error) {
          setFacts(facts); // Update facts state with database results
        } else {
          alert("Error loading facts"); // Show error if query fails
        }
        setIsLoading(false); // Hide loading spinner
      }
      getFacts(); // Call the function immediately
    },
    [currentCategory] // Dependency array - effect runs when currentCategory changes
  );

  // Precompute displayed facts (filter, then sort)
  const displayedFacts = getSortedFacts(getFilteredFacts(facts));

  // ============================================================================
  // RENDER
  // ============================================================================

  // JSX return - the UI structure
  return (
    <>
      {/* Header component with form toggle functionality */}
      <Header showForm={showForm} setShowForm={setShowForm} />

      {/* Conditionally render the form when showForm is true */}
      {showForm ? (
        <NewFactForm setFacts={setFacts} setShowForm={setShowForm} />
      ) : null}

      {/* Main content area */}
      <main className="main">
        {/* Category filter sidebar */}
        <CategoryFilters
          currentCategory={currentCategory}
          setCurrentCategory={setCurrentCategory}
        />

        {/* Facts list - show loader while loading, otherwise show facts */}
        {isLoading ? (
          <Loader />
        ) : (
          <FactsList
            facts={displayedFacts}
            setFacts={setFacts}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={(field, order) => {
              setSortBy(field);
              setSortOrder(order);
            }}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            excludeDisputed={excludeDisputed}
            onExcludeDisputedChange={setExcludeDisputed}
          />
        )}
      </main>
    </>
  );
}

// ============================================================================
// UI COMPONENTS
// ============================================================================

// Loading spinner component
function Loader() {
  return (
    <div className="loader">
      <div className="spinner"></div> {/* CSS animated spinner */}
    </div>
  );
}

// Header component with logo and form toggle button
function Header({ showForm, setShowForm }) {
  const appTitle = "Today I Learned";
  return (
    <header className="header">
      {/* Logo and title */}
      <div className="logo">
        <img src="logo.png" alt="Today I Learned Logo" height="68" width="68" />
        <h1>{appTitle}</h1>
      </div>

      {/* Toggle button - changes text based on form state */}
      <button
        className="btn btn-large btn-toggle-form"
        onClick={() => setShowForm((show) => !show)} // Toggle form visibility
      >
        {showForm ? "Close" : "Share a fact"} {/* Dynamic button text */}
      </button>
    </header>
  );
}

// Form component for adding new facts
function NewFactForm({ setFacts, setShowForm }) {
  // ============================================================================
  // FORM STATE
  // ============================================================================
  const [text, setText] = useState(""); // Fact text
  const [source, setSource] = useState("https://example.com"); // Source URL
  const [category, setCategory] = useState(""); // Selected category
  const textLength = text.length; // Calculate text length for character counter
  const [isUploading, setIsUploading] = useState(false); // Controls uploading state

  // ============================================================================
  // FORM HANDLERS
  // ============================================================================

  // Form submission handler
  async function handleSubmit(e) {
    e.preventDefault(); // Prevent default form submission

    // Validate form inputs
    if (
      text && // Text is not empty
      source && // Source is not empty
      category && // Category is selected
      text.length <= 200 && // Text is within character limit
      isValidHttpUrl(source) // Source is a valid HTTP URL
    ) {
      // Insert new fact into Supabase database
      setIsUploading(true);
      const { data: insertedFacts, error } = await supabase
        .from("Facts")
        .insert({
          text,
          source,
          category,
        })
        .select();

      if (!error && insertedFacts && insertedFacts.length > 0) {
        // Add new fact to the beginning of facts array
        setFacts((facts) => [insertedFacts[0], ...facts]);
        setShowForm(false); // Hide the form
        setIsUploading(false);
      }
    }
    // Reset form fields to initial values
    setText("");
    setSource("https://example.com");
    setCategory("");
  }

  // ============================================================================
  // FORM RENDER
  // ============================================================================

  // Form JSX
  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      {/* Fact text input */}
      <input
        type="text"
        placeholder="Share a fact with the world..."
        value={text}
        onChange={(e) => setText(e.target.value)} // Update text state
      />{" "}
      {/* Character counter */}
      <span>{200 - textLength}</span>
      {/* Source URL input */}
      <input
        type="text"
        placeholder="Source Link..."
        value={source}
        onChange={(e) => setSource(e.target.value)}
        disabled={isUploading} // Disable input while uploading
      />
      {/* Category dropdown */}
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Choose Category</option>
        {/* Map through categories to create options */}
        {CATEGORIES.map((cat) => (
          <option value={cat.name} key={cat.name}>
            {cat.name.toUpperCase()}
          </option>
        ))}
      </select>
      {/* Submit button */}
      <button className="btn btn-large" disabled={isUploading}>
        {isUploading ? "Posting..." : "Post"}
      </button>
    </form>
  );
}

// Category filter sidebar component
function CategoryFilters({ currentCategory, setCurrentCategory }) {
  return (
    <aside className="category-filters">
      <ul className="categories">
        {/* "All" category button */}
        <li className="category">
          <button
            className="btn btn-all-categories"
            onClick={() => setCurrentCategory("All")} // Set category to "All"
          >
            All
          </button>
        </li>

        {/* Map through categories to create filter buttons */}
        {CATEGORIES.map((cat) => (
          <li className="category" key={cat.name}>
            <button
              className="btn btn-category"
              style={{ backgroundColor: cat.color }} // Apply category color
              onClick={() => setCurrentCategory(cat.name)} // Set selected category
            >
              {cat.name.toUpperCase()}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

// Fact sorter component
function FactSorter({
  sortBy,
  sortOrder,
  onSortChange,
  searchQuery,
  onSearchChange,
  excludeDisputed,
  onExcludeDisputedChange,
}) {
  const sortOptions = [
    { value: "votesInteresting", label: "👍 Interesting" },
    { value: "votesMindblowing", label: "🤯 Mind-blowing" },
    { value: "votesFalse", label: "⛔️ False" },
    { value: "createdIn", label: "📅 Year" },
  ];

  const handleSortChange = (field) => {
    if (field === sortBy) {
      // Toggle order if same field is selected
      onSortChange(field, sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set new field with default desc order
      onSortChange(field, "desc");
    }
  };

  return (
    <div className="fact-sorter">
      <h3>Sort:</h3>
      <div className="sort-buttons">
        {sortOptions.map((option) => (
          <button
            key={option.value}
            className={`sort-btn ${sortBy === option.value ? "active" : ""}`}
            onClick={() => handleSortChange(option.value)}
          >
            {option.label}
            {sortBy === option.value && (
              <span className="sort-indicator">
                {sortOrder === "asc" ? " ↑" : " ↓"}
              </span>
            )}
          </button>
        ))}
      </div>
      <button
        className={`sort-btn exclude-disputed ${
          excludeDisputed ? "active" : ""
        }`}
        onClick={() => onExcludeDisputedChange(!excludeDisputed)}
        title="Hide facts marked as disputed"
      >
        {excludeDisputed ? "✅" : "❌"} Disputed
      </button>
      <input
        className="sort-search"
        type="search"
        placeholder="Search facts..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Search facts"
      />
    </div>
  );
}

// Facts list component
function FactsList({
  facts,
  setFacts,
  sortBy,
  sortOrder,
  onSortChange,
  searchQuery,
  onSearchChange,
  excludeDisputed,
  onExcludeDisputedChange,
}) {
  if (facts.length === 0) {
    return (
      <p className="message">
        No facts for this category yet! Create the first one 🚀
      </p>
    );
  }
  return (
    <section className="facts-list">
      {/* Sorting controls */}
      <FactSorter
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={onSortChange}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        excludeDisputed={excludeDisputed}
        onExcludeDisputedChange={onExcludeDisputedChange}
      />

      <ul className="fact-list">
        {/* Map through facts to render individual fact components */}
        {facts.map((fact) => (
          <Fact key={fact.id} fact={fact} setFacts={setFacts} />
        ))}
      </ul>
      {/* Display fact count */}
      <p>There are {facts.length} facts in the database. Add your own!</p>
    </section>
  );
}

// Individual fact component
function Fact({ fact, setFacts }) {
  const [isUpdating, setIsUpdating] = useState(false);
  // Track which vote type was selected for each fact
  const getVoteData = () => {
    try {
      return JSON.parse(sessionStorage.getItem("factVotes") || "{}");
    } catch {
      return {};
    }
  };
  const [currentVote, setCurrentVote] = useState(
    getVoteData()[fact.id] || null
  );
  const isDisputed = fact.votesFalse > fact.votesInteresting;

  async function handleVote(voteType) {
    setIsUpdating(true);

    let updateData = {};
    const voteData = getVoteData();
    const previousVote = voteData[fact.id];

    if (previousVote && previousVote !== voteType) {
      // User is changing their vote - decrease previous vote, increase new vote
      updateData = {
        [previousVote]: Math.max(0, (fact[previousVote] || 0) - 1),
        [voteType]: (fact[voteType] || 0) + 1,
      };
    } else if (previousVote === voteType) {
      // User is clicking the same vote type - remove their vote
      updateData = {
        [voteType]: Math.max(0, (fact[voteType] || 0) - 1),
      };
      voteType = null; // Clear the vote
    } else {
      // User is voting for the first time
      updateData = {
        [voteType]: (fact[voteType] || 0) + 1,
      };
    }

    const { data: updatedFact, error } = await supabase
      .from("Facts")
      .update(updateData)
      .eq("id", fact.id)
      .select();

    setIsUpdating(false);

    if (!error && updatedFact && updatedFact.length > 0) {
      setFacts((facts) =>
        facts.map((f) => (f.id === fact.id ? updatedFact[0] : f))
      );

      // Update session storage
      const newVoteData = { ...voteData };
      if (voteType) {
        newVoteData[fact.id] = voteType;
      } else {
        delete newVoteData[fact.id];
      }
      sessionStorage.setItem("factVotes", JSON.stringify(newVoteData));
      setCurrentVote(voteType);
    }
  }
  return (
    <li className="fact">
      {/* Fact text with source link */}
      <p className="fact-text">
        {isDisputed ? <span className="disputed"> [⛔️DISPUTED] </span> : null}
        {fact.text}
        <a
          className="source"
          href={fact.source}
          target="_blank"
          rel="noreferrer"
        >
          (source)
        </a>
      </p>

      {/* Category tag with color */}
      <div className="tag">
        <span
          className="tag"
          style={{
            backgroundColor: CATEGORIES.find(
              (cat) => cat.name === fact.category // Find matching category
            ).color, // Apply category color
          }}
        >
          {fact.category}
        </span>
      </div>

      {/* Vote buttons */}
      <div className={`vote-buttons${currentVote ? " voted" : ""}`}>
        <button
          onClick={() => handleVote("votesInteresting")}
          disabled={isUpdating}
          className={currentVote === "votesInteresting" ? "active-vote" : ""}
        >
          👍{fact.votesInteresting}
        </button>{" "}
        {/* Interesting votes */}
        <button
          onClick={() => handleVote("votesMindblowing")}
          disabled={isUpdating}
          className={currentVote === "votesMindblowing" ? "active-vote" : ""}
        >
          🤯{fact.votesMindblowing}
        </button>{" "}
        {/* Mind-blowing votes */}
        <button
          onClick={() => handleVote("votesFalse")}
          disabled={isUpdating}
          className={currentVote === "votesFalse" ? "active-vote" : ""}
        >
          ⛔️{fact.votesFalse}
        </button>{" "}
        {/* False votes */}
      </div>
    </li>
  );
}

// ============================================================================
// EXPORT
// ============================================================================

// Export the App component as default
export default App;
