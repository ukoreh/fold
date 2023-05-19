import { type RequestParameters } from "@octokit/types/dist-types";
import { Octokit } from "@octokit/core";

export interface IGitHubAction{
    createWorkflowDispatch(github_token: string, owner: string, repo: string, run_id: string): void;
}

export abstract class GitHubAction implements IGitHubAction {
    async createWorkflowDispatch(github_token: string, owner: string, repo: string, run_id: string) {
        const octokit = new Octokit({
            auth: github_token
        })
        
       await octokit.request('POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches', this.createWorkflowDispatchParameters(owner, repo, run_id))
    }
    
    protected abstract createWorkflowDispatchParameters(owner: string, repo: string, run_id: string): { owner: string; repo: string; workflow_id: string | number; } & { ref: string; inputs?: { [key: string]: unknown; } | undefined; } & RequestParameters
}