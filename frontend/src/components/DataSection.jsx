import React, { useState, useRef, useEffect } from "react";

export default function DataSection({ onExampleClick }) {
  const [open, setOpen] = useState(false);
  const sidebarRef = useRef();

  useEffect(() => {
    const handleOutside = (e) => {
      if (open && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  return (
    <div className="sidebar">
      <button className="sidebar-btn" onClick={() => setOpen(!open)}>
        Available Data
      </button>

      {open && (
        <div className="sidebar-panel" ref={sidebarRef}>
          <button className="close-btn" onClick={() => setOpen(false)}>
            ✕
          </button>

          <h2>📊 About the Database</h2>
            <p className="db-summary">
            This is a music store database that includes information about:
            </p>
            <ul className="db-list">
                <li>🎵 Artists, Albums, Tracks</li>
                <li>🎧 Genres & Media Types</li>
                <li>👤 Customers</li>
                <li>🧾 Invoices & Invoice Items</li>
                <li>🏢 Employees (Sales Reps)</li>
            </ul>

            <h4>💡 Example questions:</h4>
            <ul className="db-list examples">
            <li onClick={() => { onExampleClick("Show total revenue by genre"); setOpen(false); }}>
                Show total revenue by genre
            </li>

            <li onClick={() => { onExampleClick("Which artist has the most albums?"); setOpen(false); }}>
                Which artist has the most albums?
            </li>

            <li onClick={() => { onExampleClick("Top 10 best selling tracks"); setOpen(false); }}>
                Top 10 best selling tracks
            </li>

            <li onClick={() => { onExampleClick("Which country generated the most sales?"); setOpen(false); }}>
                Which country generated the most sales?
            </li>
            </ul>

          <img
            src="/chinook-schema.png"
            alt="Database Schema"
            className="schema-img"
          />
        </div>
      )}
    </div>
  );
}
