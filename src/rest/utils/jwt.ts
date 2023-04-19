import jwt from 'jsonwebtoken';

const generateToken = (id: string, adicional = {}) => {
    return jwt.sign({ id, ...adicional }, process.env.SECRET as string, {
        expiresIn: '30d',
    });
}

const verifyToken = (token: string) => {
    return jwt.verify(token, process.env.SECRET as string);
}

export { generateToken, verifyToken }