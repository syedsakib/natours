// const AppError = require('../utils/appError');

// handleCastErrorDB = (err) => {
//   const message = `Invalid ${err.path}: ${err.value}`;
//   return new AppError(message, 400);
// };

// const handleDuplicateFieldDB = (err) => {
//   const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
//   console.log(value);

//   const message = `Duplicate field value:x. Please use another value!`;
//   return new AppError(message, 400);
// };

// const sendErrorDev = (err, res) => {
//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message,
//     error: { ...err, name: err.name },
//   });
// };

// const sendErrorProd = (err, res) => {
//   if (err.isOperational) {
//     res.status(err.statusCode).json({
//       status: err.status,
//       message: err.message,
//     });
//   } else {
//     res.status(500).json({
//       status: 'error',
//       message: 'Something went wrong!',
//     });
//   }
// };

// module.exports = (err, req, res, next) => {
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || 'ERROR..';

//   if (process.env.NODE_ENV === 'development') {
//     sendErrorDev(err, res);
//   } else if (process.env.NODE_ENV === 'production') {
//     let error = { ...err };
//     console.log(error.name);
//     if (error.name === 'CastError') {
//       error = handleCastErrorDB(error);
//     }
//     if (error.code === 11000) {
//       error = handleDuplicateFieldDB(error);
//     }
//     sendErrorProd(error, res);
//   }
// };

const AppError = require('../utils/appError');

const errorContoller = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  //Mongoose bad ObjectID
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new AppError(message, 404);
  }

  //Mongoose Duplicate key
  if (err.code === 11000) {
    const message = `Dupicate field value entered`;
    error = new AppError(message, 400);
  }

  //Mongoose validationError
  if (err.name == 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new AppError(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

module.exports = errorContoller;
