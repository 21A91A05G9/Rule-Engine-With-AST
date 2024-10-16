import express from 'express';
import { createRule, combineRules, evaluateRule } from '../controllers/ruleController.js';

const router = express.Router();

router.post('/create', createRule);
router.post('/combine', combineRules);
router.post('/evaluate', evaluateRule);

export default router;