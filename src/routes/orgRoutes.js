import { Router} from 'express';
import OrgModel from '../models/OrganizationModel.js';
import orgController from '../controllers/orgController.js';

const { createOrg, loginOrg, getOrgs, getOrg } = new orgController(OrgModel);

const router = Router();

router.route('/')
.get(getOrgs)
.post(createOrg);
router.get('/:oid', getOrg);
router.post('/login', loginOrg);

export default router;