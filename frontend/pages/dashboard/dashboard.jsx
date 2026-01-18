import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './dashboard.css';

const API = 'http://localhost:3000';

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('groups');
    const [groups, setGroups] = useState([]);
    const [activeGroupId, setActiveGroupId] = useState(null);
    const [newGroupName, setNewGroupName] = useState('');
    const [newEventName, setNewEventName] = useState('');
    const [newEventDate, setNewEventDate] = useState('');
    const [accessCode, setAccessCode] = useState("");
    const [eventCodes, setEventCodes] = useState({});
    // const [selectedEventId, setSelectedEventId] = useState(null);


    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get(`${API}/api/auth/me`, { withCredentials: true });
                setUser(res.data.user);
            } catch (error) {
                navigate('/login');
            } finally {
                setLoading(false);
            }
        })();
    }, [navigate]);

    useEffect(() => {
        if (!user || user.role !== "EO") return;

        const loadGroups = async () => {
            try {
                const res = await axios.get(`${API}/api/groups`, {
                    withCredentials: true
                });

                console.log("Loaded groups:", res.data); // DEBUG
                setGroups(res.data);
            } catch (err) {
                console.error("Failed to load groups", err);
            }
        };

        loadGroups();
    }, [user, view]);


    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return d.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    const addGroup = async () => {
        if (!newGroupName) return;

        try {
            await axios.post(
                `${API}/api/groups`,
                { name: newGroupName },
                { withCredentials: true }
            );

            setNewGroupName("");
            const res = await axios.get(`${API}/api/groups`, {
                withCredentials: true
            });
            setGroups(res.data);

            setView("groups");
        } catch (err) {
            alert("Failed to create group");
        }
    };

    const addEventToGroup = async (groupId) => {
        if (!newEventName || !newEventDate) return;

        try {
            const res = await axios.post(
                `${API}/api/groups/${groupId}/events`,
                { name: newEventName, date: newEventDate },
                { withCredentials: true }
            );
            console.log("Created event response:", res.data);
            setEventCodes(prev => ({ ...prev, [res.data.id]: res.data.code }));
            setGroups(prev =>
                prev.map(g =>
                    g.id === groupId
                        ? { ...g, events: [...g.events, res.data] }
                        : g
                )
            );

            setNewEventName("");
            setNewEventDate("");
            setView("groups");
        } catch (err) {
            console.error(err);
            alert(err?.response?.data?.error || "Failed to create event");
        }
    };


    const showAccessCode = async (eventId) => {
        try {
            const res = await axios.get(`${API}/api/accesscode/event/${eventId}`, {
                withCredentials: true
            });

            setEventCodes(prev => ({
                ...prev,
                [eventId]: res.data.code
            }));
        } catch (err) {
            alert("No access code found for this event");
        }
    };

    const viewAttendance = async (eventId) => {
        try {
            const res = await axios.get(`${API}/api/attendance/event/${eventId}`, {
                withCredentials: true
            });
            console.table(res.data);
            alert("Attendance printed in console (F12).");
        } catch (err) {
            alert("Failed to load attendance");
        }
    };

    const exportCSV = async (eventId) => {
        try {
            const res = await axios.get(`${API}/api/attendance/export/${eventId}`, {
                withCredentials: true,
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(res.data);
            const a = document.createElement("a");
            a.href = url;
            a.download = `attendance_event_${eventId}.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch {
            alert("Export failed");
        }
    };



    const getEventState = (event) => {
        const now = new Date();
        const start = new Date(event.startTime);
        const end = new Date(event.endTime);

        if (now < start) return "CLOSED";
        if (now >= start && now <= end) return "OPEN";
        return "CLOSED";
    };

    if (loading) return <div>Loading...</div>;
    if (!user) return null;

    if (user.role === 'EO') {
        return (
            <div className="dashboard">
                <div className="card">
                    <h1>Event Organizer Dashboard</h1>
                    <p>Welcome, {user.name}</p>

                    <div className="actions">
                        <button
                            className={`primary-btn ${view === 'groups' ? 'active-btn' : ''}`}
                            onClick={() => setView('groups')}
                        >
                            Event Groups
                        </button>
                        <button
                            className={`primary-btn ${view === 'create-group' ? 'active-btn' : ''}`}
                            onClick={() => setView('create-group')}>
                            Create Group
                        </button>
                    </div>
                    <hr />
                    {view === 'groups' && (
                        <div className="attendance-container">
                            <div className="event-list">
                                {groups.length === 0 && (
                                    <p style={{ opacity: 0.7 }}>
                                        No groups yet. Create one to get started.
                                    </p>
                                )}
                                {groups.map(group => (
                                    <div
                                        key={group.id}
                                        className={`event-card ${activeGroupId === group.id ? 'active-card' : ''
                                            }`}
                                        onClick={() =>
                                            setActiveGroupId(
                                                activeGroupId === group.id ? null : group.id
                                            )
                                        }
                                    >
                                        <div className="event-header">
                                            <h2>{group.name}</h2>
                                            <button
                                                className="add-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveGroupId(group.id);
                                                    setView('create-event');
                                                }}>
                                                + Add Event
                                            </button>
                                        </div>
                                        {activeGroupId === group.id && (
                                            <div style={{ marginTop: '12px' }}>
                                                {group.events.length === 0 && (
                                                    <p style={{ opacity: 0.6 }}>No events yet</p>
                                                )}
                                                {group.events.map(event => (
                                                    <div
                                                        key={event.id}
                                                        className="event-card"
                                                        style={{ marginLeft: '20px' }}
                                                    >
                                                        <div className="event-header">
                                                            <h3>{event.name}</h3>
                                                            <span
                                                                className={`status ${getEventState(event).toLowerCase()}`}
                                                            >
                                                                {getEventState(event)}
                                                            </span>
                                                        </div>

                                                        <p className="event-date">
                                                            {formatDate(event.date || event.startTime)}
                                                        </p>
                                                        <button
                                                            className="toggle-btn"
                                                            onClick={() => showAccessCode(event.id)}
                                                        >
                                                            Get Access Code
                                                        </button>
                                                        <button
                                                            className="toggle-btn"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                viewAttendance(event.id)
                                                            }
                                                            }>
                                                            View Attendance
                                                        </button>

                                                        <button className="toggle-btn"
                                                            onClick={() => exportCSV(event.id)}>
                                                            Export CSV
                                                        </button>
                                                        {eventCodes[event.id] && (
                                                            <p style={{ marginTop: "10px", color: "#22c55e", fontWeight: 800 }}>
                                                                Access Code:
                                                                <span style={{ letterSpacing: "2px", marginLeft: "6px" }}>
                                                                    {eventCodes[event.id]}
                                                                </span>
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}

                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {view === 'create-group' && (
                        <div className="event-planner">
                            <h2>Create Group</h2>
                            <div className="add-event">
                                <input
                                    type="text"
                                    placeholder="Group Name"
                                    value={newGroupName}
                                    onChange={(e) => setNewGroupName(e.target.value)}
                                    className="planner-input"
                                />
                                <button className="add-btn" onClick={addGroup}>
                                    Add Group
                                </button>
                            </div>
                        </div>
                    )}

                    {view === 'create-event' && activeGroupId && (
                        <div className="event-planner">
                            <h2>Add Event</h2>
                            <div className="add-event">
                                <input
                                    type="text"
                                    placeholder="Event Name"
                                    value={newEventName}
                                    onChange={(e) => setNewEventName(e.target.value)}
                                    className="planner-input"
                                />
                                <input
                                    type="date"
                                    value={newEventDate}
                                    onChange={(e) => setNewEventDate(e.target.value)}
                                    className="planner-input"
                                />
                                <button
                                    className="add-btn"
                                    onClick={() => addEventToGroup(activeGroupId)}
                                >
                                    Add Event
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <div className="card">
                <h1>Participant Dashboard</h1>
                <p>Logged in as: {user.name}</p>

                {/* <div className="actions">
                    <button
                        className="primary-btn"
                        onClick={() => navigate('/participant/events')}
                    >
                        My Events
                    </button>
                </div> */}
                <div className="add-event">
                    <input
                        type="text"
                        placeholder="Enter Access Code"
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value)}
                        className="planner-input"
                    />
                    <button
                        className="add-btn"
                        onClick={async () => {
                            try {
                                const res = await axios.post(
                                    `${API}/api/attendance/confirm`,
                                    {
                                        code: accessCode.trim().toUpperCase(),
                                        participantId: user.id
                                    },
                                    { withCredentials: true }
                                );

                                alert(`Confirmed at ${new Date(res.data.confirmedAt).toLocaleString()}`);
                                setAccessCode("");
                            } catch (err) {
                                alert(err?.response?.data?.error || "Confirm failed");
                            }
                        }}
                    >
                        Confirm Attendance
                    </button>
                </div>
                <hr />
                <p>View and manage your event participation here.</p>
            </div>
        </div>
    );
}
