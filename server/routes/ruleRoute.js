import express from 'express';
import { createRule, combineRules, evaluateRule, fetchData } from '../controllers/ruleController.js';

const router = express.Router();

router.post('/create', createRule);
router.post('/combine', combineRules);
router.post('/evaluate', evaluateRule);
router.get('/fetch', fetchData);


export default router;

