import { type RequestParameters } from "@octokit/types/dist-types";
import { GitHubAction } from "./github-action";

export class ForkCloneBuildDeployAction extends GitHubAction {
	constructor(private readonly forkOrg: string, private readonly actionRepoOwner: string, private readonly actionRepoName: string, private readonly actionWorkflowId: string, private readonly actionRefBranch: string) {
        super();
    }

    protected createWorkflowDispatchParameters(owner: string, repo: string, run_id: string): { owner: string; repo: string; workflow_id: string | number; } & { ref: string; inputs?: { [key: string]: unknown; } | undefined; } & RequestParameters {
        return {
            owner: this.actionRepoOwner,
            repo: this.actionRepoName,
            workflow_id: this.actionWorkflowId,
            ref: this.actionRefBranch,
            inputs: {
                'owner': owner,
                'repo': repo,
                'fork-org': this.forkOrg,
                'run-id': run_id
            },
            headers: {
              'X-GitHub-Api-Version': '2022-11-28'
            }
        }
    }

}