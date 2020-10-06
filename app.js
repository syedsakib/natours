const express = require('express');
const morgan = require('morgan');
const globalErrorController = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');

const app = express();

//MIDDLEWEARS:
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

//ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find "${req.originalUrl}" on this server.`, 404));
});

//
app.use(globalErrorController);

//
module.exports = app;
