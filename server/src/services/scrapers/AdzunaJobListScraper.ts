// server/src/services/scrapers/AdzunaJobListScraper.ts
import axios from 'axios';
import { IJobListScraper } from '../../interfaces/scraper.interface';
import { RawJobData, JobSearchOptions } from '../jobAcquisitionService';

const RESULTS_PER_PAGE = 50;
const BASE_URL = 'https://api.adzuna.com/v1/api/jobs';

/**
 * Adzuna-based job list scraper.
 * Free tier: 250 requests/day — no credit card required.
 * Sign up at https://developer.adzuna.com to get APP_ID and APP_KEY.
 */
export class AdzunaJobListScraper implements IJobListScraper {
    async retrieveJobs(options: JobSearchOptions, credentials?: { userId?: string }): Promise<RawJobData[]> {
        const appId = process.env.ADZUNA_APP_ID;
        const appKey = process.env.ADZUNA_APP_KEY;
        const country = process.env.ADZUNA_COUNTRY || 'us';

        if (!appId || !appKey) {
            throw new Error(
                'Adzuna API credentials not configured. Add ADZUNA_APP_ID and ADZUNA_APP_KEY to your .env file. ' +
                'Register free at https://developer.adzuna.com'
            );
        }

        const maxJobs = Math.min(200, Math.max(10, options.maxJobs || 50));
        const totalPages = Math.ceil(maxJobs / RESULTS_PER_PAGE);
        const rawResults: any[] = [];

        for (let page = 1; page <= totalPages; page++) {
            const params: Record<string, string> = {
                app_id: appId,
                app_key: appKey,
                results_per_page: String(RESULTS_PER_PAGE),
                content_type: 'application/json',
            };

            if (options.keywords) params.what = options.keywords.substring(0, 200);
            if (options.location) params.where = options.location.substring(0, 100);

            if (options.datePosted === 'past 24 hours') params.max_days_old = '1';
            else if (options.datePosted === 'past week') params.max_days_old = '7';
            else if (options.datePosted === 'past month') params.max_days_old = '30';

            if (options.jobType?.includes('full-time')) params.full_time = '1';
            if (options.jobType?.includes('part-time')) params.part_time = '1';
            if (options.jobType?.includes('contract')) params.contract = '1';

            try {
                const response = await axios.get(`${BASE_URL}/${country}/search/${page}`, { params });
                const results: any[] = response.data?.results || [];
                rawResults.push(...results);

                if (results.length < RESULTS_PER_PAGE) break;
                if (rawResults.length >= maxJobs) break;
            } catch (err: any) {
                console.error(`[AdzunaJobListScraper] Failed to fetch page ${page}:`, err.message);
                break;
            }
        }

        const jobs: RawJobData[] = rawResults.slice(0, maxJobs).map((item: any) => ({
            jobId: String(item.id || item.__CLASS__ || Math.random()),
            jobTitle: item.title || '',
            companyName: item.company?.display_name || '',
            jobUrl: item.redirect_url || '',
            jobDescriptionText: item.description || '',
            jobPostDate: item.created ? new Date(item.created) : undefined,
        })).filter(j => j.jobTitle && j.jobDescriptionText.length > 20);

        console.log(`[AdzunaJobListScraper] Retrieved ${jobs.length} jobs`);
        return jobs;
    }
}
