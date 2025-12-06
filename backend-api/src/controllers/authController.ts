import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { DatabaseService } from '../services/databaseService';

export const verify = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization as string | undefined;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Invalid token format' });

    const decoded = jwt.verify(token, config.jwtSecret);
    return res.json({ valid: true, payload: decoded });
  } catch (err: any) {
    return res.status(401).json({ valid: false, error: err.message || 'Unauthorized' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // For demo purposes, ensure user exists (get or create)
    const name = (req.body.name as string) || email.split('@')[0];
    const userId = await DatabaseService.ensureUserExists(email, name);

    // Sign token
    const token = jwt.sign(
      { userId, email, name },
      config.jwtSecret,
      { expiresIn: '7d' }
    );
    
    return res.json({
      token,
      user: { id: userId.toString(), email, name }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Check if user already exists
    const existingUser = await DatabaseService.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Create new user
    // Create new user (or get existing one if ensureUserExists handles idempotency)
    const userId = await DatabaseService.ensureUserExists(email, name);

    const token = jwt.sign(
      { userId, email, name },
      config.jwtSecret,
      { expiresIn: '7d' }
    );
    
    return res.json({
      message: 'User registered successfully',
      token,
      user: { id: userId.toString(), email, name }
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
};