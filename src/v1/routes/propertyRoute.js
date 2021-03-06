import { Router } from 'express';
import PropertyValidator from '../middlewares/propertyValidator';
import propertyController from '../controllers/propertyController';
// import { isAdmin } from '../middlewares/authorization';

const propertyRouter = Router();

// Used for routs that start with /api/v1
// /api/v1/property is already prepended to the route

const { validateProperty, validateParam } = PropertyValidator;
const {
  createProperty,
  updateProperty,
  markAsSold,
  deleteProperty,
  getAllProperty,
  getSpecificProperty,
} = propertyController;


// These routes are only available to agents
propertyRouter.post('/', createProperty);
propertyRouter.patch('/:propertyId', validateParam, updateProperty);
propertyRouter.patch('/:propertyId/sold', validateParam, markAsSold);
propertyRouter.delete('/:propertyId', validateParam, deleteProperty);


// These routes are only available to a logged in users(that is both an agent and a user)
propertyRouter.get('/:propertyId', getSpecificProperty);
propertyRouter.get('/', getAllProperty);

export default propertyRouter;
