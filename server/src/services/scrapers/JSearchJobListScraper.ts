// server/src/services/scrapers/JSearchJobListScraper.ts
import axios from 'axios';
import { IJobListScraper } from '../../interfaces/scraper.interface';
import { RawJobData, JobSearchOptions } from '../jobAcquisitionService';

const BASE_URL = 'https://jsearch.p.rapidapi.com/search';
const RESULTS_PER_PAGE = 10; // JSearch max per request

/**
 * JSearch (RapidAPI) job list scraper.
 * Aggregates LinkedIn, Indeed, Glassdoor, ZipRecruiter.
 * Supports any country/location including Pakistan.
 * Free tier: 200 requests/month.
 * Sign up at https://rapidapi.com and subscribe to JSearch.
 */
export class JSearchJobListScraper implements IJobListScraper {
    async retrieveJobs(options: JobSearchOptions, credentials?: any): Promise<RawJobData[]> {
        const apiKey = process.env.JSEARCH_API_KEY;

        if (!apiKey) {
            throw new Error(
                'JSearch API key not configured. Add JSEARCH_API_KEY to your .env file. ' +
                'Sign up free at https://rapidapi.com and subscribe to JSearch.'
            );
        }

        const maxJobs = Math.min(100, Math.max(10, options.maxJobs || 50));
        const totalPages = Math.ceil(maxJobs / RESULTS_PER_PAGE);
        const rawResults: any[] = [];

        // Build search query — combine keywords and location
        const query = [options.keywords, options.location]
            .filter(Boolean)
            .join(' in ') || 'software developer';

        // Map datePosted to JSearch date_posted param
        let datePosted = 'all';
        if (options.datePosted === 'past 24 hours') datePosted = 'today';
        else if (options.datePosted === 'past week') datePosted = 'week';
        else if (options.datePosted === 'past month') datePosted = 'month';

        // Map jobType
        let employmentType: string | undefined;
        if (options.jobType?.includes('full-time')) employmentType = 'FULLTIME';
        else if (options.jobType?.includes('part-time')) employmentType = 'PARTTIME';
        else if (options.jobType?.includes('contract')) employmentType = 'CONTRACTOR';
        else if (options.jobType?.includes('internship')) employmentType = 'INTERN';

        for (let page = 1; page <= totalPages; page++) {
            const params: Record<string, string> = {
                query,
                page: String(page),
                num_pages: '1',
                date_posted: datePosted,
            };

            if (employmentType) params.employment_types = employmentType;

            // Remote filter
            if (options.jobType?.includes('remote')) params.remote_jobs_only = 'true';

            try {
                const response = await axios.get(BASE_URL, {
                    params,
                    headers: {
                        'X-RapidAPI-Key': apiKey,
                        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
                    },
                    timeout: 15000,
                });

                const results: any[] = response.data?.data || [];
                rawResults.push(...results);

                console.log(`[JSearchJobListScraper] Page ${page}: got ${results.length} jobs`);

                if (results.length < RESULTS_PER_PAGE) break;
                if (rawResults.length >= maxJobs) break;
            } catch (err: any) {
                console.error(`[JSearchJobListScraper] Failed on page ${page}:`, err.message);
                break;
            }
        }

        const jobs: RawJobData[] = rawResults.slice(0, maxJobs).map((item: any) => ({
            jobId: item.job_id || String(Math.random()),
            jobTitle: item.job_title || '',
            companyName: item.employer_name || '',
            jobUrl: item.job_apply_link || item.job_google_link || '',
            jobDescriptionText: item.job_description || '',
            jobPostDate: item.job_posted_at_datetime_utc
                ? new Date(item.job_posted_at_datetime_utc)
                : undefined,
        })).filter(j => j.jobTitle && j.jobDescriptionText.length > 20);

        console.log(`[JSearchJobListScraper] Retrieved ${jobs.length} jobs for query: "${query}"`);
        return jobs;
    }
}
