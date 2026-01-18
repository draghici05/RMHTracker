import express from "express";
import AccessCode from "../models/accesscode.js";

const router = express.Router();

router.get("/event/:eventId", async (req, res) => {
    try {
        const row = await AccessCode.findOne({
            where: { eventId: req.params.eventId },
            order: [["id", "DESC"]],
        });

        if (!row) return res.status(404).json({ error: "No access code found" });
        res.json(row);
    } catch (err) {
        console.error("accesscode error:", err);
        res.status(500).json({ error: "Failed to load access code" });
    }
});

export default router;
