import { useEffect, useRef, useState } from "react";
import { useExpenses } from "../Context";
import { CloseIcon, SearchIcon } from "./Icons";

const DEBOUNCE_MS = 300;

// Keeps typing responsive by holding the text locally and only pushing it into
// global state (which re-filters the whole list) after the user pauses.
const SearchInput = ({ id, placeholder, className = "" }) => {
  const { searchQuery, setSearchQuery } = useExpenses();
  const [value, setValue] = useState(searchQuery);
  const lastSent = useRef(searchQuery);
  const timer = useRef(null);

  // Pick up external changes (e.g. "Reset filters") but ignore our own echo.
  useEffect(() => {
    if (searchQuery !== lastSent.current) {
      lastSent.current = searchQuery;
      setValue(searchQuery);
    }
  }, [searchQuery]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const push = (next) => {
    lastSent.current = next;
    setSearchQuery(next);
  };

  const handleChange = (event) => {
    const next = event.target.value;
    setValue(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => push(next), DEBOUNCE_MS);
  };

  const handleClear = () => {
    clearTimeout(timer.current);
    setValue("");
    push("");
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        id={id}
        aria-label="Search expenses"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className={`w-full pl-10 pr-10 text-sm text-ink placeholder:text-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
      />
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
        <SearchIcon />
      </div>
      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-ink cursor-pointer"
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
