import React, { useState } from "react";
import "./Attendance.css";

export default function Attendance() {
  const [events, setEvents] = useState([
    { id: 1, name: "React Workshop", date: "2026-01-06", status: "Planned" },
    { id: 2, name: "JS Meetup", date: "2026-01-07", status: "Planned" },
  ]);

  const [newEventName, setNewEventName] = useState("");
  const [newEventDate, setNewEventDate] = useState("");

  const addEvent = () => {
    if (newEventName && newEventDate) {
      const newEvent = {
        id: Date.now(),
        name: newEventName,
        date: newEventDate,
        status: "Planned",
      };
      setEvents([...events, newEvent]);
      setNewEventName("");
      setNewEventDate("");
    }
  };

  const toggleStatus = (id) => {
    setEvents(events.map(ev =>
      ev.id === id
        ? { ...ev, status: ev.status === "Planned" ? "Done" : "Planned" }
        : ev
    ));
  };

  return (
    <div className="attendance-container">
      <h1 className="page-title"> Event Planner</h1>
      <div className="add-event">
        <input
          type="text"
          placeholder="Event Name"
          value={newEventName}
          onChange={(e) => setNewEventName(e.target.value)}
        />
        <input
          type="date"
          value={newEventDate}
          onChange={(e) => setNewEventDate(e.target.value)}
        />
        <button className="add-btn" onClick={addEvent}>
          Add Event
        </button>
      </div>

      <div className="event-list">
        {events.map((event) => (
          <div key={event.id} className="event-card">
            <div className="event-header">
              <h3>{event.name}</h3>
              <span className={`status ${event.status.toLowerCase()}`}>
                {event.status}
              </span>
            </div>
            <p className="event-date"> {event.date}</p>
            <button className="toggle-btn" onClick={() => toggleStatus(event.id)}>
              Toggle Status
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
