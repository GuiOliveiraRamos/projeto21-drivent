import { Router } from 'express';

const hotelsRouter = Router();

hotelsRouter.get('/hotels').get('/hotel/:hotelId');

export { hotelsRouter };
