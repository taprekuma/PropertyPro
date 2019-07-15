import passwordHash from 'password-hash';

import Authenticator from '../helpers/Authenticator';
import pool from '../config/connection';

const { generateToken } = Authenticator;

export default class UserController {
  static async formatUserResponse(user) {
    const { id, is_admin: isAdmin } = user;
    const token = await generateToken({ id, isAdmin });

    const { password, ...rest } = user;
    const data = { token, ...rest };
    return data;
  }

  static async getUser(email) {
    const client = await pool.connect();
    try {
      const sqlQuery = 'SELECT * FROM users WHERE email = $1';
      const { rows } = await client.query({ text: sqlQuery, values: [email] });
      const user = rows[0];

      if (user) {
        return user;
      }
      return null;
    } catch (err) {
      return err;
    } finally {
      await client.release();
    }
  }

  static async createAccount(req, res) {
    const client = await pool.connect();
    try {
      const { email } = req.body;
      const existingUser = await UserController.getUser(email);

      if (existingUser) return res.status(409).json({ status: 'error', error: 'User already exists' });
      const {
        first_name, last_name, password, phone_number, is_admin,
      } = req.body;
      const userData = {
        email, first_name, last_name, password, phone_number, is_admin,
      };
      userData.password = await passwordHash.generate(password);
      const columns = Object.keys(userData);
      const values = Object.values(userData);
      const sqlQuery = `INSERT INTO users(${columns.toString()}) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`;
      const { rows, rowCount } = await client.query({ text: sqlQuery, values });

      if (rowCount) {
        const data = await UserController.formatUserResponse(rows[0]);
        return res.status(201).json({ status: 'success', data });
      }
      return res.status(500).json({ status: 'error', error: 'Unable to save user' });
    } catch (err) {
      return res.status(500).json({ status: 'error', error: 'Internal server error Unable to signup new user' });
    } finally {
      await client.release();
    }
  }
}
