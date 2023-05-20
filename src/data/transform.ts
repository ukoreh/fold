import { extractRepoUrl } from "../http";
import { GitHubRepository } from "./github-repository";

export function requestToGitHubRepository(req: Request): GitHubRepository | Error {
    const url = extractRepoUrl(req.headers);
    
    return GitHubRepository.from(url);
}