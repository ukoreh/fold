import { Config } from "../config";
import guid from "../data/guid";
import { Octokit } from "@octokit/core";
import { ForkCloneBuildDeployAction } from "../data/fork-clone-build-deploy-action";

export default async function (req: Request, config: Config): Promise<Response> {
    const jobRunId = guid();
    
    new ForkCloneBuildDeployAction(config.forkOrg, config.actionRepoOwner, config.actionRepoName, config.actionWorkflowId, config.actionRefBranch).createWorkflowDispatch(config.githubToken, "freitas-labs", "flutter-extended-image-crop-info-callback-spike", jobRunId)

    return Promise.resolve(new Response(`The generated guid is ${jobRunId}`));
}