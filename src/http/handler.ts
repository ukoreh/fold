import { Config } from "../config";
import guid from "../data/guid";
import { ForkCloneBuildDeployAction } from "../data";
import { requestToGitHubRepository } from "../data";

export default async function (req: Request, config: Config): Promise<Response> {
    const githubRepo = requestToGitHubRepository(req);
    
    if(githubRepo instanceof Error){
        return Promise.resolve(new Response(`Erro ${githubRepo.message}`));
    }

    const jobRunId = guid();
    
    new ForkCloneBuildDeployAction(config.forkOrg, config.actionRepoOwner, config.actionRepoName, config.actionWorkflowId, config.actionRefBranch).createWorkflowDispatch(config.githubToken, githubRepo.owner, githubRepo.name, jobRunId)

    // get work flow id

    return Promise.resolve(new Response(`The generated guid is ${jobRunId}`));
}