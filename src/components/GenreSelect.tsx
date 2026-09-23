import { useEffect, useId, useRef, useState } from "react";
import "./GenreSelect.css";

interface Option {
  value: string;
  label: string;
}

interface GenreSelectProps {
  value: string;
  options: Option[];
  placeholder: string;
  onChange: (value: string) => void;
}

// A styled dropdown with a height limit.
// The browser's own <select> list can't be styled or shortened,
// which is why it stretched to the bottom of the screen.
export default function GenreSelect({
  value,
  options,
  placeholder,
  onChange,
}: GenreSelectProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  const allOptions: Option[] = [{ value: "", label: placeholder }, ...options];
  const selected = allOptions.find((o) => o.value === value) ?? allOptions[0];

  // Close when clicking anywhere outside the dropdown
  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Keep the highlighted option visible while using the arrow keys
  useEffect(() => {
    if (!open) return;
    const item = listRef.current?.children[activeIndex] as
      | HTMLElement
      | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  function openList() {
    const current = allOptions.findIndex((o) => o.value === value);
    setActiveIndex(current === -1 ? 0 : current);
    setOpen(true);
  }

  function choose(index: number) {
    onChange(allOptions[index].value);
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        openList();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, allOptions.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(allOptions.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        choose(activeIndex);
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  }

  return (
    <div className="genre-select" ref={rootRef}>
      <button
        type="button"
        role="combobox"
        className="genre-select-button"
        aria-label="Genre"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${listId}-${activeIndex}` : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={handleKeyDown}
      >
        {selected.label}
      </button>

      {open && (
        <ul
          id={listId}
          ref={listRef}
          role="listbox"
          aria-label="Genre"
          className="genre-select-list"
        >
          {allOptions.map((option, i) => (
            <li
              key={option.value || "all"}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={option.value === value}
              className={
                "genre-select-option" +
                (i === activeIndex ? " is-active" : "") +
                (option.value === value ? " is-selected" : "")
              }
              onMouseEnter={() => setActiveIndex(i)}
              // keep focus on the button so keyboard still works after clicking
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => choose(i)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}