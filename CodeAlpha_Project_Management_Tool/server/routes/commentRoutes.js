import express from 'express'
import { addComments, getTaskComments } from '../controllers/commentController.js'

const commentRouter = express.Router()

commentRouter.post('/',addComments);
commentRouter.get('/:taskId',getTaskComments);

export default commentRouter;

