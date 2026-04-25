import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { AppError } from '@/utils/appError';
import { logger } from '@/utils/logger';

const handleCastErrorDB = (err: any) => {
  const statusCode = httpStatus.BAD_REQUEST;
  const message = `Invalid ${err.path}: ${err.value}!`;
  return new AppError(message, statusCode);
};

const handleDuplicateFields = (err: any) => {
  const statusCode = httpStatus.BAD_REQUEST;
  const value = err.message.match(/(["'])(\\?.)*?\1/)?.[0] || 'Unknown field';
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, statusCode);
};

const handleValidationErrorDB = (err: any) => {
  const statusCode = httpStatus.BAD_REQUEST;
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}!`;
  return new AppError(message, statusCode);
};

const handleJWTError = () => {
  return new AppError('Invalid token! Please log in again.', httpStatus.UNAUTHORIZED);
};

const handleJWTExpiredError = () => {
  return new AppError('Your token has expired! Please log in again.', httpStatus.UNAUTHORIZED);
};

const sendErrorDev = (err: any, req: Request, res: Response) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // RENDERED WEBSITE
  logger.error('ERROR: ', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    message: err.message
  });
};

const sendErrorProd = (err: any, req: Request, res: Response) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    // Operational, trusted error: send message to client!
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    // Programming or other unknown error: don't leak error details to client!
    logger.error('ERROR 💥', err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }

  // RENDERED WEBSITE
  // Operational, trusted error: send message to client!
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      message: err.message,
    });
  }

  // Programming or other unknown error: don't leak error details to client!
  logger.error('ERROR 💥', err);
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).render('error', {
    title: 'Something went wrong!',
    message: 'Please try again later!',
  });
};

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.name = err.name;
    error.message = err.message;
    error.code = err.code;

    // handle error from mongoDB
    if (error.code === 11000) {
      error = handleDuplicateFields(error);
    }

    if (error.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    }

    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
    }

    if (error.name === 'JsonWebTokenError') {
      error = handleJWTError();
    }

    if (error.name === 'TokenExpiredError') {
      error = handleJWTExpiredError();
    }

    sendErrorProd(error, req, res);
  }
};
