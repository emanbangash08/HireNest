// server/src/utils/apiKeyHelpers.ts
import { NotFoundError } from './errors/AppError';

/**
 * Get RapidAPI key (JSEARCH_API_KEY) used for LinkedIn profile scraping and JSearch.
 * @param _userId - Unused, kept for backward-compatibility
 */
export const getApifyToken = async (_userId?: string): Promise<string> => {
  const rapidApiKey = process.env.JSEARCH_API_KEY;

  if (!rapidApiKey) {
    throw new NotFoundError(
      'RapidAPI key (JSEARCH_API_KEY) is not configured on the server. Please contact the administrator.'
    );
  }

  return rapidApiKey;
};
