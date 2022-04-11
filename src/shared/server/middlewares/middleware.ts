import AppError from '@shared/errors/appError';
import authConfig from '@config/auth';

import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function isAutenthicated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    throw new AppError('JWT Token is missing.', 401);
  }
  //Bearer *Token*
  const [, token] = authHeader.split(' ');
  try {
    const decodedToken = verify(token, authConfig.jwt.secret);
    const { sub } = decodedToken as ITokenPayload;
    request.user = {
      id: sub,
    };
    return next();
  } catch (error) {
    throw new AppError('Invalid JWT token', 401);
  }
}
