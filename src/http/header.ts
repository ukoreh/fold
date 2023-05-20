const repoUrl = 'x-repo-url'

export function extractRepoUrl(headers: Headers): string | null {
    return headers.get(repoUrl);
}