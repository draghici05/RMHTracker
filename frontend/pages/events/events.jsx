import React, { useMemo, useState, useEffect } from "react";
import "./events.css";

export default function Events() {
  const [events] = useState([
    {
      id: 1,
      name: "Game Night",
      location: "Room 204",
      startTime: "2026-01-10T18:00:00",
      endTime: "2026-01-10T21:00:00",
      description: "league of legends all night"
    },
    {
      id: 2,
      name: "Study session",
      location: "Library lounge",
      startTime: null,
      endTime: null,
      description: "Study study"
    },
    {
      id: 3,
      name: "Movie Night",
      location: "Main hall",
      startTime: "2026-01-23T19:30:00",
      endTime: "2026-01-23T22:00:00",
      description: "Halloween movies marathon"
    },
  ]);

  const nowTimes = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getTime() - 30 * 60 * 1000);
    const end = new Date(now.getTime() + 90 * 60 * 1000);
    const toLocalIsoNoZ = (d) => {
      const pad = (n) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
    };
    return { start: toLocalIsoNoZ(start), end: toLocalIsoNoZ(end) };
  }, []);

  const hydratedEvents = useMemo(() => {
    return events.map((ev) => {
      if (ev.id === 2) {
        return { ...ev, startTime: nowTimes.start, endTime: nowTimes.end };
      }
      return ev;
    });
  }, [events, nowTimes]);

  const [filter, setFilter] = useState("all"); 

  const getState = (ev) => {
    const now = new Date();
    const start = new Date(ev.startTime);
    const end = new Date(ev.endTime);

    if (now < start) return "UPCOMING";
    if (now >= start && now <= end) return "OPEN";
    return "CLOSED";
  };

  const formatDateTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const visibleEvents = useMemo(() => {
    const list = hydratedEvents
      .map((ev) => ({ ...ev, state: getState(ev) }))
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

    if (filter === "open") return list.filter((e) => e.state === "OPEN");
    if (filter === "upcoming") return list.filter((e) => e.state === "UPCOMING");
    if (filter === "past") return list.filter((e) => e.state === "CLOSED");
    return list;
  }, [hydratedEvents, filter]);

  useEffect(() => {
    const t = setInterval(() => {
      setFilter((f) => f);
    }, 60 * 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="events-page">
      <div className="events-shell">
        <div className="events-header">
          <div>
            <h1>Events</h1>
            <p>Hardcoded “fun board” with past, present, and future events.</p>
          </div>

          <div className="events-filters">
            <button
              className={`btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`btn ${filter === "open" ? "active" : ""}`}
              onClick={() => setFilter("open")}
            >
              Open now
            </button>
            <button
              className={`btn ${filter === "upcoming" ? "active" : ""}`}
              onClick={() => setFilter("upcoming")}
            >
              Upcoming
            </button>
            <button
              className={`btn ${filter === "past" ? "active" : ""}`}
              onClick={() => setFilter("past")}
            >
              Past
            </button>
          </div>
        </div>

        <div className="events-grid">
          {visibleEvents.map((ev) => (
            <div key={ev.id} className="event-tile">
              <div className="event-tile-top">
                <h3>{ev.name}</h3>
                <span className={`pill ${ev.state.toLowerCase()}`}>{ev.state}</span>
              </div>

              <div className="event-meta">
                <div className="meta-row">
                  <span className="meta-label">Where</span>
                  <span className="meta-value">{ev.location}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Starts</span>
                  <span className="meta-value">{formatDateTime(ev.startTime)}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Ends</span>
                  <span className="meta-value">{formatDateTime(ev.endTime)}</span>
                </div>
              </div>

              <p className="event-desc">{ev.description}</p>

              <div className="event-actions">
                <button className="cta">View details</button>
                <button className="ghost">Save</button>
              </div>
            </div>
          ))}
        </div>

        <div className="events-footer">
          <div className="hint-card">
            <h4>Tip</h4>
            <p>
              You can always choose the first one cus lets be serious who wants to miss the fun (dont mind that its closed)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
