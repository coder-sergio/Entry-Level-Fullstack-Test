import { describe, test, expect, beforeAll, afterAll, afterEach } from '@jest/globals';
import * as usersService from '../../services/users.service.js';
import db from '../../models/index.js';

const { User, sequelize } = db;

describe('Users Service', () => {
  beforeAll(async () => {
    // Sync database before running tests
    await sequelize.sync({ force: true });
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
    expect(usersService.getUsers).toBeDefined();
  });

  test('getUsers should return empty array when no users exist', async () => {
    const users = await usersService.getUsers();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBe(0);
  });

  test('getUsers should return list of users', async () => {
    // Create test users
    await User.create({
      email: 'test1@example.com',
      password: 'password123',
      active: true
    });
    await User.create({
      email: 'test2@example.com',
      password: 'password456',
      active: true
    });

    const users = await usersService.getUsers();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBe(2);
    expect(users[0].email).toBe('test1@example.com');
    expect(users[1].email).toBe('test2@example.com');
  });

  test('getUsers should include inactive users', async () => {
    // Create active and inactive users
    await User.create({
      email: 'active@example.com',
      password: 'password123',
      active: true
    });
    await User.create({
      email: 'inactive@example.com',
      password: 'password456',
      active: false
    });

    const users = await usersService.getUsers();
    expect(users.length).toBe(2);
    expect(users.some(u => u.active === true)).toBe(true);
    expect(users.some(u => u.active === false)).toBe(true);
  });
});
