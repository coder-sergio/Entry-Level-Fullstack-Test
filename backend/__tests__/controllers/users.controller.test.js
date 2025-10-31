import { describe, test, expect, beforeAll, afterAll, afterEach, jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import usersController from '../../controllers/users.controller.js';
import db from '../../models/index.js';

const { User, sequelize } = db;

describe('Users Controller', () => {
  let app;

  beforeAll(async () => {
    // Sync database before running tests
    await sequelize.sync({ force: true });

    // Setup express app for testing
    app = express();
    app.use(express.json());
    app.use('/users', usersController);
  });

  afterEach(async () => {
    // Clean up test data after each test
    await User.destroy({ where: {}, truncate: true });
  });

  afterAll(async () => {
    // Close database connection after all tests
    await sequelize.close();
  });

  test('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  test('GET /users should return empty array when no users exist', async () => {
    const response = await request(app).get('/users');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });

  test('GET /users should return list of users', async () => {
    // Create test users
    await User.create({
      email: 'test1@example.com',
      password: 'password123',
      active: true
    });
    await User.create({
      email: 'test2@example.com',
      password: 'password456',
      active: false
    });

    const response = await request(app).get('/users');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
    expect(response.body[0]).toHaveProperty('email');
    expect(response.body[0]).toHaveProperty('active');
  });

  test('GET /users should handle database errors gracefully', async () => {
    // Mock database error by closing connection temporarily
    const originalFindAll = User.findAll;
    User.findAll = jest.fn().mockRejectedValue(new Error('Database error'));

    const response = await request(app).get('/users');

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Failed to fetch users');

    // Restore original method
    User.findAll = originalFindAll;
  });
});
