import jwt from 'jsonwebtoken';

const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.SECRET as string, {
        expiresIn: '30d',
    });
}

const verifyToken = (token: string) => {
    return jwt.verify(token, process.env.SECRET as string);
}

export { generateToken, verifyToken }