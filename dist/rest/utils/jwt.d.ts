import jwt from 'jsonwebtoken';
declare const generateToken: (id: string, adicional?: {}) => string;
declare const verifyToken: (token: string) => string | jwt.JwtPayload;
export { generateToken, verifyToken };
