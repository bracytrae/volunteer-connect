const request = require('supertest');
jest.mock('../src/db', () => ({ query: jest.fn() }));
const db = require('../src/db');
const app = require('../src/app');

beforeEach(() => jest.clearAllMocks());

describe('VolunteerConnect MVP API', () => {
  test('GET /api/health returns OK', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  test('GET /api/opportunities returns events', async () => {
    db.query.mockResolvedValueOnce({ rows: [{ id: 1, title: 'Food Drive', registered: false }] });
    const response = await request(app).get('/api/opportunities');
    expect(response.status).toBe(200);
    expect(response.body.opportunities[0].title).toBe('Food Drive');
  });

  test('POST /api/registrations rejects an invalid ID', async () => {
    const response = await request(app).post('/api/registrations').send({ opportunityId: 'hello' });
    expect(response.status).toBe(400);
    expect(db.query).not.toHaveBeenCalled();
  });

  test('POST /api/registrations creates a registration', async () => {
    db.query
      .mockResolvedValueOnce({ rows: [{ id: 5 }] })
      .mockResolvedValueOnce({ rows: [{ id: 9, student_id: 1, opportunity_id: 5 }] });
    const response = await request(app).post('/api/registrations').send({ opportunityId: 5 });
    expect(response.status).toBe(201);
    expect(response.body.registration.opportunity_id).toBe(5);
  });

  test('POST /api/registrations prevents duplicate registrations', async () => {
    db.query.mockResolvedValueOnce({ rows: [{ id: 5 }] }).mockResolvedValueOnce({ rows: [] });
    const response = await request(app).post('/api/registrations').send({ opportunityId: 5 });
    expect(response.status).toBe(409);
  });

  test('POST /api/hours requires a registered event', async () => {
    db.query.mockResolvedValueOnce({ rows: [] });
    const response = await request(app).post('/api/hours').send({ opportunityId: 4, hours: 2.5 });
    expect(response.status).toBe(400);
  });

  test('POST /api/hours accepts quarter-hour increments', async () => {
    db.query.mockResolvedValueOnce({ rows: [{ id: 2, hours: '2.50' }] });
    const response = await request(app).post('/api/hours').send({ opportunityId: 4, hours: 2.5 });
    expect(response.status).toBe(201);
    expect(response.body.log.hours).toBe(2.5);
  });

  test('POST /api/hours rejects invalid time increments', async () => {
    const response = await request(app).post('/api/hours').send({ opportunityId: 4, hours: 2.3 });
    expect(response.status).toBe(400);
    expect(db.query).not.toHaveBeenCalled();
  });

  test('GET /api/dashboard returns registrations and totals', async () => {
    db.query
      .mockResolvedValueOnce({ rows: [{ id: 1, name: 'Demo Student' }] })
      .mockResolvedValueOnce({ rows: [{ title: 'Park Cleanup', opportunity_id: 2 }] })
      .mockResolvedValueOnce({ rows: [{ hours: '2.50', title: 'Park Cleanup' }] })
      .mockResolvedValueOnce({ rows: [{ total_hours: '2.50' }] });
    const response = await request(app).get('/api/dashboard');
    expect(response.status).toBe(200);
    expect(response.body.totalHours).toBe(2.5);
    expect(response.body.registrations).toHaveLength(1);
  });
});
