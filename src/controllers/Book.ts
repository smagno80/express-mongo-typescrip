import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Book from '../models/Book';

const createBook = async (req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>> => {
    const { title, author } = req.body;

    const book = new Book({
        _id: new mongoose.Types.ObjectId(),
        title,
        author
    });

    return book
        .save()
        .then((book): Response<any, Record<string, any>> => res.status(201).json({ book }))
        .catch((error): Response<any, Record<string, any>> => res.status(500).json({ error }));
};

const readBook = async (req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>> => {
    const bookId = req.params.bookId;

    return Book.findById(bookId)
        .populate('author')
        .select('-__v')
        .then((book): Response<any, Record<string, any>> => (book ? res.status(200).json({ book }) : res.status(404).json({ message: 'Book not found' })))
        .catch((error): Response<any, Record<string, any>> => res.status(500).json({ error }));
};

const readAll = async (req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>> => {
    return Book.find()
        .populate('author')
        .select('-__v')
        .then((books): Response<any, Record<string, any>> => res.status(200).json({ books }))
        .catch((error): Response<any, Record<string, any>> => res.status(500).json({ error }));
};

const updateBook = async (req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined> => {
    const bookId = req.params.bookId;

    return Book.findById(bookId)
        .then((book): Promise<Response<any, Record<string, any>>> | undefined => {
            if (book) {
                book.set(req.body);

                return book
                    .save()
                    .then((book): Response<any, Record<string, any>> => res.status(201).json({ book }))
                    .catch((error): Response<any, Record<string, any>> => res.status(500).json({ error }));
            } else {
                res.status(404).json({ message: 'Book not found' });
            }
        })
        .catch((error): Response<any, Record<string, any>> => res.status(500).json({ error }));
};

const deleteBook = async (req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>> => {
    const bookId = req.params.bookId;

    return Book.findByIdAndDelete(bookId)
        .then((book): Response<any, Record<string, any>> => (book ? res.status(201).json({ message: 'Book deleted' }) : res.status(404).json({ message: 'Book not found' })))
        .catch((error): Response<any, Record<string, any>> => res.status(500).json({ error }));
};

export default { createBook, readBook, readAll, updateBook, deleteBook };
