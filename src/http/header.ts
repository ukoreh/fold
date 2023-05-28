const repoUrl = 'x-repo-url'
const jobId = 'x-job-id'
const downloadLogs = 'x-download-logs'

export function extractRepoUrl(headers: Headers): string | null {
    return headers.get(repoUrl);
}

export function extractJobId(headers: Headers): string | null {
    return headers.get(jobId);
}

export function hasDownloadLogsHeaderSet(headers: Headers): boolean {
    return headers.has(downloadLogs);
}