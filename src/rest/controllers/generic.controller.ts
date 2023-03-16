import { Request, Response } from "express";

const okNoResponse = (_req: Request, res: Response) => res.status(201).send()

export {okNoResponse}