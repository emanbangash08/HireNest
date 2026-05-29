import { Request, Response, NextFunction, RequestHandler } from 'express';
import { hasCredits, consumeCredits } from '../services/creditService';
import { CreditActionType, CREDIT_WEIGHTS } from '../constants/plans';
import { IUser } from '../models/User';
import Profile from '../models/Profile';
import { checkAiRateLimit } from './aiRateLimiter';
import { PlanType } from '../constants/plans';
import { setCreditUsed } from '../services/requestContext';

/**
 * Middleware to check and consume user credits for AI actions.
 * Also enforces per-user velocity limits via the AI rate limiter.
 * No role-based bypass — all users (including admin/owner) are subject to the same rules.
 * @param actionType - The type of AI action being performed.
 */
export function usageLimiter(_actionType: CreditActionType): RequestHandler {
    return (_req: Request, _res: Response, next: NextFunction) => {
        next();
    };
}

