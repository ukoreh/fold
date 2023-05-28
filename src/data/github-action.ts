import { type RequestParameters } from "@octokit/types/dist-types";
import { Octokit } from "@octokit/core";

export interface IGitHubAction {
    createWorkflowDispatch(owner: string, repo: string, stepId: string): void;
    getWorkflowRun(stepId: string): Promise<WorkflowRunURL | Error>;
    getDeployUrl(owner: string, repo: string): string;
    getWorkflowRunLogs(owner: string, repo: string, jobId: number): Promise<string | Error>;
}

export abstract class GitHubAction implements IGitHubAction {
    protected octokit: Octokit;

    constructor(protected readonly githubToken: string) {
        this.octokit = new Octokit({
            auth: this.githubToken
        })
    }

    async createWorkflowDispatch(owner: string, repo: string, stepId: string) {
        await this.octokit.request('POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches', this.createWorkflowDispatchParameters(owner, repo, stepId))
    }

    abstract getWorkflowRun(stepId: string): Promise<WorkflowRunURL | Error>;

    abstract getDeployUrl(owner: string, repo: string): string;

    abstract getWorkflowRunLogs(owner: string, repo: string, jobId: number): Promise<string | Error>;

    protected abstract createWorkflowDispatchParameters(owner: string, repo: string, stepId: string): { owner: string; repo: string; workflow_id: string | number; } & { ref: string; inputs?: { [key: string]: unknown; } | undefined; } & RequestParameters
}