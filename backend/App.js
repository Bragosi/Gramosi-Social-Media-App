const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');
const AppError = require('./utils/AppError');
const userRouter = require('./routes/UserRoutes');
const postRouter = require('./routes/PostRoutes');
const globalErrorHandler = require('./controllers/ErrorController');

const app = express();


app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname, 'public')));


app.use(cookieParser());
app.use(
  helmet({
    contentSecurityPolicy: false,  
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin: process.env.NODE_ENV === "production"
      ? "https://gramosi-social-media-app.onrender.com"
      : "http://localhost:5173",
    credentials: true,
  })
);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());

// API ROUTES 
app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);

if (process.env.NODE_ENV === 'production') {
  const frontPath = path.join(__dirname, '..', 'frontend', 'dist');

  app.use(express.static(frontPath));

  
  app.get('*', (req, res) => {

    if (req.originalUrl.startsWith('/api/v1') || req.originalUrl.startsWith('/uploads')) {
      return res.status(404).json({ message: 'Route not found' });
    }
    res.sendFile(path.join(frontPath, 'index.html'));
  });
}

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;