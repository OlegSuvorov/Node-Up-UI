import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import { createClient } from 'redis';
import { AppDataSource } from './data-source';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import { authenticateSession } from './middleware/auth';
import cookieParser from 'cookie-parser';

const RedisStore = require('connect-redis')(session);
const app = express();

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});
redisClient.connect().catch(console.error);

const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'session:',
});


app.use(
  session({
    store: redisStore,
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: 'lax',
    },
  }),
);

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  }),
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateSession, userRoutes);

const PORT = process.env.PORT || 3001;

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.log(error));
