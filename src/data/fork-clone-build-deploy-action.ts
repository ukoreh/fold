import { type RequestParameters } from "@octokit/types/dist-types";
import { GitHubAction } from "./github-action";

export class ForkCloneBuildDeployAction extends GitHubAction {
    constructor(protected readonly githubToken: string, private readonly forkOrg: string, private readonly actionRepoOwner: string, private readonly actionRepoName: string, private readonly actionWorkflowId: string, private readonly actionRefBranch: string) {
        super(githubToken);
    }

    async getWorkflowRun(stepId: string): Promise<WorkflowRunURL | Error> {
        const runs = await this.getLatestWorkflowRuns();
        if (runs) {
            for (const i in runs) {
                const workflowRun = runs[i];

                const jobsUrl = new URL(workflowRun.jobs_url);
                const response = await this.octokit.request(`GET ${jobsUrl.pathname}`);
                const jobs = response.data.jobs;

                const job: string = this.getJobIdWithStep(stepId, jobs);

                if (job && jobs !== "") {
                    return workflowRun.jobs_url
                }
            }
        }
        return new Error("Not able to find the Workflow Run");
    }

    getDeployUrl(owner: string, repo: string): string {
        return `https://${this.forkOrg}.github.io/${owner}-${repo}`;
    }

    async getWorkflowRunLogs(owner: string, repo: string, jobId: number): Promise<string | Error> {
        const response = await this.octokit.request('GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs', {
            owner: this.actionRepoOwner,
            repo: this.actionRepoName,
            job_id: jobId,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            },
        });

        if (response.status === 200) {
            return response.data;
        }

        return new Error("github did not redirect to workflow run logs");
    }


    protected createWorkflowDispatchParameters(owner: string, repo: string, stepId: string): { owner: string; repo: string; workflow_id: string | number; } & { ref: string; inputs?: { [key: string]: unknown; } | undefined; } & RequestParameters {
        return {
            owner: this.actionRepoOwner,
            repo: this.actionRepoName,
            workflow_id: this.actionWorkflowId,
            ref: this.actionRefBranch,
            inputs: {
                'owner': owner,
                'repo': repo,
                'fork-org': this.forkOrg,
                'run-id': stepId
            },
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        }
    }

    private async getLatestWorkflowRuns() {
        const fiveMinsAgo = new Date();
        fiveMinsAgo.setMinutes(fiveMinsAgo.getMinutes() - 5)

        const response = await this.octokit.request('GET /repos/{owner}/{repo}/actions/runs?created=>{time}&branch={branch}&event={trigger}', {
            owner: this.actionRepoOwner,
            repo: this.actionRepoName,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            },
            time: fiveMinsAgo.toISOString(),
            branch: this.actionRefBranch,
            trigger: 'workflow_dispatch',
        });

        return response.data.workflow_runs;
    }

    private getJobIdWithStep(stepName: string, jobs: any): string {
        for (let j in jobs) {
            let job = jobs[j];
            let steps = job.steps;

            if (steps.length > 1) {
                if (steps[1].name == stepName) {
                    return job.run_url;
                }
            }
        }

        return "";
    }
}