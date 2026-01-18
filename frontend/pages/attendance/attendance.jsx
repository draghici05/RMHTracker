import { useEffect, useState } from "react";
import "./attendance.css";

export default function Profile() {
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const [user, setUser] = useState(null);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState("");

    useEffect(() => async () => {
        let ignore = false;

        async function loadMe() {
            try {
                setLoading(true);
                setErr("");

                const res = await fetch("/api/me", {
                    credentials: "include",
                });

                if (!res.ok) {
                    const text = await res.text().catch(() => "");
                    throw new Error(text || `Failed to load profile (${res.status})`);
                }

                const data = await res.json();
                if (!ignore) setUser(data);
            } catch (e) {
                if (!ignore) setErr(e?.message || "Could not load profile.");
            } finally {
                if (!ignore) setLoading(false);
            }
        }
        const data = await fetchJson("/api/me", { credentials: "include" });
        setUser(data);


        loadMe();
        return () => {
            ignore = true;
        };
    }, []);

    async function fetchJson(url, options) {
        const res = await fetch(url, options);

        const contentType = res.headers.get("content-type") || "";
        const raw = await res.text(); // read once

        if (!res.ok) {
            throw new Error(raw || `Request failed (${res.status})`);
        }

        if (contentType.includes("application/json")) {
            return JSON.parse(raw);
        }

        throw new Error(
            `Expected JSON but got: ${contentType || "unknown content-type"}\n\n${raw.slice(0, 200)}`
        );
    }


    async function handleChangePassword(e) {
        e.preventDefault();
        setSaveMsg("");
        setErr("");

        if (!currentPassword || !newPassword) {
            setErr("Please fill both password fields.");
            return;
        }
        if (newPassword.length < 6) {
            setErr("New password must be at least 6 characters.");
            return;
        }

        try {
            setSaving(true);
            const res = await fetch("/api/me/password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            if (!res.ok) {
                const text = await res.text().catch(() => "");
                throw new Error(text || `Password update failed (${res.status})`);
            }

            setCurrentPassword("");
            setNewPassword("");
            setSaveMsg("Password updated ✅");
        } catch (e) {
            setErr(e?.message || "Could not update password.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="profile-page">
            <div className="profile-header">
                <h1>Profile</h1>
                <p className="muted">Your account details and settings.</p>
            </div>

            {loading && <div className="card">Loading…</div>}

            {!loading && err && <div className="card error">{err}</div>}

            {!loading && !err && user && (
                <>
                    <div className="card">
                        <h2>Account</h2>
                        <div className="grid">
                            <div className="field">
                                <div className="label">Name</div>
                                <div className="value">{user.name ?? "—"}</div>
                            </div>

                            <div className="field">
                                <div className="label">Email</div>
                                <div className="value">{user.email ?? "—"}</div>
                            </div>

                            <div className="field">
                                <div className="label">Role</div>
                                <div className="value tag">{user.role ?? "user"}</div>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <h2>Change password</h2>
                        <form onSubmit={handleChangePassword} className="form">
                            <input
                                type="password"
                                placeholder="Current password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="New password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />

                            <div className="actions">
                                <button type="submit" disabled={saving}>
                                    {saving ? "Saving…" : "Update password"}
                                </button>
                                {saveMsg && <span className="ok">{saveMsg}</span>}
                            </div>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
}
