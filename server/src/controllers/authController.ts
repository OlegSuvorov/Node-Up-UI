import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { RefreshToken } from '../entity/RefreshToken';

const userRepository = AppDataSource.getRepository(User);
const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);

// Helper function to generate tokens
const generateTokens = (user: User) => {
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '15m' },
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret-key',
    { expiresIn: '7d' },
  );

  return { accessToken, refreshToken };
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    // Save refresh token to database
    const refreshTokenDoc = refreshTokenRepository.create({
      token: refreshToken,
      user: user,
      isValid: true,
    });
    await refreshTokenRepository.save(refreshTokenDoc);

    // Set both tokens in HTTP-only cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
      domain:
        process.env.NODE_ENV === 'production' ? 'your-domain.com' : 'localhost',
      path: '/',
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      domain:
        process.env.NODE_ENV === 'production' ? 'your-domain.com' : 'localhost',
      path: '/',
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token not found' });
    }

    // Verify token exists and is valid in database
    const savedToken = await refreshTokenRepository.findOne({
      where: { token: refreshToken, isValid: true },
      relations: ['user'],
    });

    if (!savedToken) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Verify JWT
    const payload = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret-key',
    ) as { userId: number };

    // Verify payload userId matches saved token's user
    if (!savedToken.user?.id || payload.userId !== savedToken.user.id) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      savedToken.user,
    );

    // Invalidate old refresh token and save new one
    savedToken.isValid = false;
    await refreshTokenRepository.save(savedToken);

    const newRefreshTokenDoc = refreshTokenRepository.create({
      token: newRefreshToken,
      user: savedToken.user,
      isValid: true,
    });
    await refreshTokenRepository.save(newRefreshTokenDoc);

    // Set new tokens in cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
      domain:
        process.env.NODE_ENV === 'production' ? 'your-domain.com' : 'localhost',
      path: '/',
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      domain:
        process.env.NODE_ENV === 'production' ? 'your-domain.com' : 'localhost',
      path: '/',
    });

    // Send success response
    res.json({ message: 'Tokens refreshed successfully' });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check for existing user
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      isActive: true,
    });

    await userRepository.save(user);

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      domain:
        process.env.NODE_ENV === 'production' ? 'your-domain.com' : 'localhost',
      path: '/',
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      domain:
        process.env.NODE_ENV === 'production' ? 'your-domain.com' : 'localhost',
      path: '/',
    });

    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await refreshTokenRepository.update(
        { token: refreshToken },
        { isValid: false },
      );
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const verify = async (req: Request, res: Response) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({ message: 'No access token' });
    }

    try {
      const payload = jwt.verify(
        accessToken,
        process.env.JWT_SECRET || 'your-secret-key',
      ) as { userId: number; email: string };

      const user = await userRepository.findOne({
        where: { id: payload.userId },
      });

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      return res.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } catch (err) {
      // If access token is expired, try to refresh
      return res.status(401).json({ message: 'Invalid access token' });
    }
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
