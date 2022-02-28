import express, { NextFunction, Request } from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { config } from './config/config';
import Logging from './library/Logging';
import authorRoutes from './routers/Author';
import bookRoutes from './routers/Book';

const router = express();

/** Connect to Mongo */
mongoose
    .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
    .then((): void => {
        Logging.info('MongoDB connected');
        StartServer();
    })
    .catch((error): void => {
        Logging.error('Unable to connect to MongoDB');
        Logging.error(error);
    });

/** Only start the server if Mongo Connects */
const StartServer = (): void => {
    router.use((req, res, next): void => {
        /** Log the Request */
        Logging.info(`Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

        res.on('finish', (): void => {
            /** Log the Response */
            Logging.info(`Outgoing -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`);
        });

        next();
    });

    router.use(express.urlencoded({ extended: true }));
    router.use(express.json());

    /** Rules of our API */
    router.use((req: Request, res: any, next: NextFunction): any => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Aloow-Headrs', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
            return res.status(200).json({});
        }

        next();
    });

    /** Routes */
    router.use('/authors', authorRoutes);
    router.use('/books', bookRoutes);

    /** Healthcheck */
    router.get('/ping', (req: Request, res: any, next: NextFunction): any => res.status(200).json({ message: 'pong' }));

    /** Error handling */
    router.use((req: Request, res: any, next: NextFunction): any => {
        const error = new Error('Not found');
        Logging.error(error);

        return res.status(404).json({ message: error.message });
    });

    http.createServer(router).listen(config.server.port, (): void => Logging.info(`Server started on port ${config.server.port}.`));
};
