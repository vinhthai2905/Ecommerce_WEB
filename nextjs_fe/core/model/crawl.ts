export interface Crawl {
    id: number;
    name: string;
    time_daily_crawl: number;
    last_time: Date;
    created_at: Date;
    updated_at: Date;
}

export interface CrawlStatus {
    id: number;
    name: string;
    created_at: Date;
    updated_at: Date;
}

export interface CrawlLog {
    id: number;
    crawl: Crawl;
    crawl_status: CrawlStatus;
    log_error: string | null;
    slug_crawl: string[];
    time_run: Date;
    created_at: Date;
    updated_at: Date;
}