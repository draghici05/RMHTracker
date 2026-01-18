import express from 'express';
import EventGroup from '../models/eventsgroup.js';
import Events from '../models/events.js';
import AccessCode from '../models/accesscode.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const groups = await EventGroup.findAll({
      include: [Events],
      order: [['id']],
    });
    res.json(groups);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load groups' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name } = req.body;

    const group = await EventGroup.create({
      name,
      description: "",
    });

    res.json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create group' });
  }
});

router.post('/:groupId/events', async (req, res) => {
  try {
    const { name, date } = req.body;

    const startTime = `${date}T00:00:00`;
    const endTime = `${date}T23:59:59`;

    const event = await Events.create({
      name,
      startTime,
      endTime,
      groupId: req.params.groupId,
    });

    const code = `E${event.id}${Math.random().toString(36).substring(2, 4).toUpperCase()}`;

    await AccessCode.create({
      code,
      eventId: event.id,
      format: 'text',
    });

    return res.json({ ...event.toJSON(), code });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create event' });
  }
});

export default router;
