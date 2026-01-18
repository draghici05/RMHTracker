import React from "react";
import { Link } from "react-router-dom";
import "./home.css";

function Home() {
  return (
    <div className="home-content">
      <section className="hero">
        <div className="hero-text">
          <h1>Welcome to RMHTrack</h1>
          <p>
            Your all-in-one solution for managing event attendance with ease and efficiency.
          </p>

          <div className="hero-actions">
            <Link to="/dashboard" className="btn primary">Go to Dashboard</Link>
            <Link to="/events" className="btn">View available events</Link>
          </div>
        </div>

        <div className="hero-visual">
            <div className="hero-card">
            <h3>Attendance Tracking</h3>
            <p>RMHTrack is an application developed by alegz-copyright to manage the attendance of events efficiently
                with several features such as the ones below.
            </p>
            </div>
          <div className="hero-card">
            <h3>Events</h3>
            <p>Browse and manage your events.</p>
          </div>

          <div className="hero-card">
            <h3>Check-in</h3>
            <p>Quick and easy participant check-in process.</p>
          </div>

          <div className="hero-card">
            <h3>Reports</h3>
            <p>Download csv reports of attendance data.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
