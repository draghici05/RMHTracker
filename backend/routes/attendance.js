import express from "express";
import Attendance from "../models/attendance.js";
import AccessCode from "../models/accesscode.js";
import Events from "../models/events.js";
import User from "../models/user.js";

const router = express.Router();

router.post("/confirm", async (req, res) => {
    try {
        const { code, participantId } = req.body;

        const access = await AccessCode.findOne({ where: { code } });
        if (!access) return res.status(400).json({ error: "Invalid code" });

        const event = await Events.findByPk(access.eventId);
        if (!event) return res.status(404).json({ error: "Event not found" });

        const [row, created] = await Attendance.findOrCreate({
            where: { eventId: event.id, participantId },
            defaults: {
                confirmedAt: new Date(),
                method: "code",
            }
        });

        if (!created) {
            row.confirmedAt = new Date();
            await row.save();
        }

        res.json(row);
    } catch (err) {
        console.error("confirm error:", err);
        res.status(500).json({ error: "Failed to confirm attendance" });
    }
});



router.get("/event/:eventId", async (req, res) => {
    try {
        const rows = await Attendance.findAll({
            where: { eventId: req.params.eventId },
            include: [User],
            order: [["confirmedAt", "ASC"]],
        });
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to load attendance" });
    }
});

router.get("/export/:eventId", async (req, res) => {
    try {
        const rows = await Attendance.findAll({
            where: { eventId: req.params.eventId },
            include: [User],
            order: [["confirmedAt", "ASC"]],
        });

        let csv = "Name,Email,Confirmed At\n";
        rows.forEach(r => {
            const u = r.User || r.user;
            csv += `${u?.name || ""},${u?.email || ""},${r.confirmedAt || ""}\n`;
        });

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename=attendance_${req.params.eventId}.csv`);
        res.send(csv);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to export CSV" });
    }
});

export default router;
