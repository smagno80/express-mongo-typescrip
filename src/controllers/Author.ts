import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Author from '../models/Author';

const createAuthor = async (req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>> => {
    const { name } = req.body;

    const author = new Author({
        _id: new mongoose.Types.ObjectId(),
        name
    });

    return author
        .save()
        .then((author): Response<any, Record<string, any>> => res.status(201).json({ author }))
        .catch((error): Response<any, Record<string, any>> => res.status(500).json({ error }));
};

const readAuthor = async (req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>> => {
    const authorId = req.params.authorId;

    return Author.findById(authorId)
        .then((author): Response<any, Record<string, any>> => (author ? res.status(200).json({ author }) : res.status(404).json({ message: 'Author not found' })))
        .catch((error): Response<any, Record<string, any>> => res.status(500).json({ error }));
};

const readAll = async (req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>> => {
    return Author.find()
        .then((authors): Response<any, Record<string, any>> => res.status(200).json({ authors }))
        .catch((error): Response<any, Record<string, any>> => res.status(500).json({ error }));
};

const updateAuthor = async (req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined> => {
    const authorId = req.params.authorId;

    return Author.findById(authorId)
        .then((author): Promise<Response<any, Record<string, any>>> | undefined => {
            if (author) {
                author.set(req.body);

                return author
                    .save()
                    .then((author): Response<any, Record<string, any>> => res.status(201).json({ author }))
                    .catch((error): Response<any, Record<string, any>> => res.status(500).json({ error }));
            } else {
                res.status(404).json({ message: 'Author not found' });
            }
        })
        .catch((error): Response<any, Record<string, any>> => res.status(500).json({ error }));
};

const deleteAuthor = async (req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>> => {
    const authorId = req.params.authorId;

    return Author.findByIdAndDelete(authorId)
        .then((author): Response<any, Record<string, any>> => (author ? res.status(201).json({ message: 'Author deleted' }) : res.status(404).json({ message: 'Author not found' })))
        .catch((error): Response<any, Record<string, any>> => res.status(500).json({ error }));
};

export default { createAuthor, readAuthor, readAll, updateAuthor, deleteAuthor };
