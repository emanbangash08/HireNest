// server/src/services/scraperService.ts
import { IScraper, IJobListScraper } from '../interfaces/scraper.interface';
import { AIScraper } from './scrapers/AIScraper';
import { ApifyJobDetailsScraper } from './scrapers/ApifyJobDetailsScraper';
import { ApifyJobListScraper } from './scrapers/ApifyJobListScraper';
import { AdzunaJobListScraper } from './scrapers/AdzunaJobListScraper';
import { JSearchJobListScraper } from './scrapers/JSearchJobListScraper';

/**
 * Scraper service that manages scraper instances and provides factory methods
 * Allows easy swapping of scraper implementations via configuration
 */
export class ScraperService {
    private static jobDescriptionScraper: IScraper | null = null;
    private static jobListScraper: IJobListScraper | null = null;

    /**
     * Get the scraper for job description extraction
     * Defaults to AIScraper (uses user's configured AI provider), but can be configured via SCRAPER_TYPE env variable
     */
    static getJobDescriptionScraper(): IScraper {
        if (!this.jobDescriptionScraper) {
            const scraperType = process.env.SCRAPER_TYPE || 'ai';
            
            switch (scraperType.toLowerCase()) {
                case 'ai':
                case 'gemini': // Keep 'gemini' as alias for backward compatibility
                    this.jobDescriptionScraper = new AIScraper();
                    break;
                case 'apify':
                    this.jobDescriptionScraper = new ApifyJobDetailsScraper();
                    break;
                default:
                    console.warn(`Unknown scraper type: ${scraperType}, defaulting to AI`);
                    this.jobDescriptionScraper = new AIScraper();
            }
        }
        
        return this.jobDescriptionScraper;
    }

    /**
     * Get the scraper for job list retrieval
     * Defaults to ApifyJobListScraper, but can be configured via JOB_LIST_SCRAPER_TYPE env variable
     */
    static getJobListScraper(): IJobListScraper {
        if (!this.jobListScraper) {
            // Auto-detect: prefer explicit env var, otherwise pick based on available keys
            const explicit = process.env.JOB_LIST_SCRAPER_TYPE;
            const scraperType = explicit
                ? explicit
                : process.env.JSEARCH_API_KEY
                    ? 'jsearch'
                    : process.env.ADZUNA_APP_ID && process.env.ADZUNA_APP_KEY
                        ? 'adzuna'
                        : 'apify';

            switch (scraperType.toLowerCase()) {
                case 'jsearch':
                    this.jobListScraper = new JSearchJobListScraper();
                    console.log('[ScraperService] Using JSearch job list scraper (RapidAPI — global coverage)');
                    break;
                case 'adzuna':
                    this.jobListScraper = new AdzunaJobListScraper();
                    console.log('[ScraperService] Using Adzuna job list scraper (free tier)');
                    break;
                case 'apify':
                    this.jobListScraper = new ApifyJobListScraper();
                    console.log('[ScraperService] Using Apify job list scraper');
                    break;
                default:
                    console.warn(`[ScraperService] Unknown job list scraper type: ${scraperType}, defaulting to JSearch`);
                    this.jobListScraper = new JSearchJobListScraper();
            }
        }

        return this.jobListScraper;
    }

    /**
     * Reset scraper instances (useful for testing or reconfiguration)
     */
    static reset(): void {
        this.jobDescriptionScraper = null;
        this.jobListScraper = null;
    }
}

