import { type RequestParameters } from "@octokit/types/dist-types";
import { GitHubAction } from "./github-action";

const action_owner: string = "ukoreh"
const action_repo: string = "actions"
const action_workflow_id: string = "fork-clone-build-deploy.yaml"
const action_ref_branch: string = "master"
const fork_org: string = "expensive-garbage"

export class ForkCloneBuildDeployAction extends GitHubAction {
    protected createWorkflowDispatchParameters(owner: string, repo: string, run_id: string): { owner: string; repo: string; workflow_id: string | number; } & { ref: string; inputs?: { [key: string]: unknown; } | undefined; } & RequestParameters {
        return {
            owner: action_owner,
            repo: action_repo,
            workflow_id: action_workflow_id,
            ref: action_ref_branch,
            inputs: {
                'owner': owner,
                'repo': repo,
                'fork-org': fork_org,
                'run-id': run_id
            },
            headers: {
              'X-GitHub-Api-Version': '2022-11-28'
            }
        }
    }

}