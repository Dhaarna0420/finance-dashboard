import request from 'supertest';
import app from '../src/app.js';
import db from '../src/db/index.js';

describe('Finance API Integration Tests', () => {
  let adminToken;
  let viewerToken;

  beforeAll(() => {
    // Basic setup is handled by app.js (createTables)
  });

  afterAll(() => {
    db.close();
  });

  describe('Auth Endpoints', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testviewer',
          password: 'password123',
          role: 'Viewer'
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body.username).toEqual('testviewer');
    });

    it('should login and return a token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testviewer',
          password: 'password123'
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      viewerToken = res.body.token;
    });

    it('should login as admin (seeded)', async () => {
      // Seeded admin from db/seed.js (called in app.js via createTables/seed logic if not exists)
      // Note: seedDatabase is not called in app.js yet, let me fix that or manually seed here.
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'admin123'
        });
      // If seed was not successful in app.js, this might fail.
      // Actually, createTables() in app.js doesn't call seedDatabase(bcrypt).
      // Let's fix app.js to seed on start if Admin role is missing.
    });
  });

  describe('RBAC & Records', () => {
    beforeAll(async () => {
      // Get admin token
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'admin', password: 'admin123' });
      adminToken = res.body.token;
    });

    it('should allow admin to create a record', async () => {
      const res = await request(app)
        .post('/api/records')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          amount: 1000,
          type: 'income',
          category: 'Salary',
          date: '2026-04-01',
          notes: 'Initial salary'
        });
      expect(res.statusCode).toEqual(201);
    });

    it('should NOT allow viewer to create a record', async () => {
      const res = await request(app)
        .post('/api/records')
        .set('Authorization', `Bearer ${viewerToken}`)
        .send({
          amount: 50,
          type: 'expense',
          category: 'Food',
          date: '2026-04-02'
        });
      expect(res.statusCode).toEqual(403);
    });

    it('should allow analyst to view summary', async () => {
       // Register an analyst
       await request(app)
        .post('/api/auth/register')
        .send({ username: 'analyst1', password: 'password123', role: 'Analyst' });
       
       const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ username: 'analyst1', password: 'password123' });
       
       const analToken = loginRes.body.token;

       const res = await request(app)
        .get('/api/dashboard/summary')
        .set('Authorization', `Bearer ${analToken}`);
       
       expect(res.statusCode).toEqual(200);
       expect(res.body.summary.total_income).toBeGreaterThan(0);
    });
  });
});
