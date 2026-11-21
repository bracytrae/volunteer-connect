const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const DEMO_STUDENT_ID = 1; // MVP only; replace with authenticated users later.

app.disable('x-powered-by');
app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, '..', 'public')));

const handle = (fn) => (req, res, next) => Promise.resolve(fn(req, res)).catch(next);
const validId = (value) => Number.isSafeInteger(value) && value > 0;

app.get('/api/health', (_req, res) => res.json({ status: 'ok', app: 'VolunteerConnect' }));

app.get('/api/opportunities', handle(async (_req, res) => {
  const { rows } = await db.query(`
    SELECT o.id, o.title, o.organization, o.description, o.location,
           o.event_date, o.category,
           EXISTS (
             SELECT 1 FROM registrations r
             WHERE r.opportunity_id = o.id AND r.student_id = $1
           ) AS registered
    FROM opportunities o
    ORDER BY o.event_date ASC, o.id ASC
  `, [DEMO_STUDENT_ID]);
  res.json({ opportunities: rows });
}));

app.post('/api/registrations', handle(async (req, res) => {
  const opportunityId = req.body?.opportunityId;
  if (!validId(opportunityId)) {
    return res.status(400).json({ error: 'A valid opportunityId is required.' });
  }

  const opportunity = await db.query('SELECT id FROM opportunities WHERE id = $1', [opportunityId]);
  if (opportunity.rows.length === 0) {
    return res.status(404).json({ error: 'Opportunity not found.' });
  }

  const result = await db.query(`
    INSERT INTO registrations (student_id, opportunity_id)
    VALUES ($1, $2)
    ON CONFLICT (student_id, opportunity_id) DO NOTHING
    RETURNING id, student_id, opportunity_id
  `, [DEMO_STUDENT_ID, opportunityId]);
  if (result.rows.length === 0) {
    return res.status(409).json({ error: 'You are already registered for this event.' });
  }
  res.status(201).json({ registration: result.rows[0] });
}));

app.get('/api/dashboard', handle(async (_req, res) => {
  const [student, registrations, hourLogs, total] = await Promise.all([
    db.query('SELECT id, name, email FROM students WHERE id = $1', [DEMO_STUDENT_ID]),
    db.query(`
      SELECT r.id AS registration_id, o.id AS opportunity_id,
             o.title, o.organization, o.event_date, o.location
      FROM registrations r
      JOIN opportunities o ON o.id = r.opportunity_id
      WHERE r.student_id = $1
      ORDER BY o.event_date ASC
    `, [DEMO_STUDENT_ID]),
    db.query(`
      SELECT h.id, h.hours, h.service_date, o.title
      FROM service_hours h
      JOIN opportunities o ON o.id = h.opportunity_id
      WHERE h.student_id = $1
      ORDER BY h.logged_at DESC, h.id DESC
      LIMIT 20
    `, [DEMO_STUDENT_ID]),
    db.query('SELECT COALESCE(SUM(hours), 0) AS total_hours FROM service_hours WHERE student_id = $1', [DEMO_STUDENT_ID]),
  ]);
  res.json({
    student: student.rows[0] ?? null,
    registrations: registrations.rows,
    hourLogs: hourLogs.rows.map((log) => ({ ...log, hours: Number(log.hours) })),
    totalHours: Number(total.rows[0]?.total_hours ?? 0),
  });
}));

app.post('/api/hours', handle(async (req, res) => {
  const { opportunityId, hours } = req.body ?? {};
  if (!validId(opportunityId) || typeof hours !== 'number' ||
      !Number.isFinite(hours) || hours <= 0 || hours > 24 ||
      !Number.isInteger(hours * 4)) {
    return res.status(400).json({ error: 'Enter an event and 0.25–24 hours in quarter-hour increments.' });
  }

  // Only allow logs for events the demo student has registered for.
  const result = await db.query(`
    INSERT INTO service_hours (student_id, opportunity_id, hours)
    SELECT $1, $2, $3
    WHERE EXISTS (
      SELECT 1 FROM registrations
      WHERE student_id = $1 AND opportunity_id = $2
    )
    RETURNING id, student_id, opportunity_id, hours, service_date
  `, [DEMO_STUDENT_ID, opportunityId, hours]);
  if (result.rows.length === 0) {
    return res.status(400).json({ error: 'Register for an event before logging hours.' });
  }
  res.status(201).json({ log: { ...result.rows[0], hours: Number(result.rows[0].hours) } });
}));

app.use('/api', (_req, res) => res.status(404).json({ error: 'API route not found.' }));
app.use((err, _req, res, _next) => {
  console.error('API error:', err);
  res.status(500).json({ error: 'Server error. Check the terminal for details.' });
});

module.exports = app;
