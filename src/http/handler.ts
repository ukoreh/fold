import { Config } from "../config";
import guid from "../data/guid";
import { ForkCloneBuildDeployAction } from "../data";
import { requestToGitHubRepository } from "../data";

export default async function (req: Request, config: Config): Promise<Response> {
    const githubRepo = requestToGitHubRepository(req);
    
    if(githubRepo instanceof Error){
        return Promise.resolve(new Response(`Erro ${githubRepo.message}`));
    }

    const jobStepRunId = guid();
    
    const action = new ForkCloneBuildDeployAction(config.githubToken, config.forkOrg, config.actionRepoOwner, config.actionRepoName, config.actionWorkflowId, config.actionRefBranch);

    action.createWorkflowDispatch(githubRepo.owner, githubRepo.name, jobStepRunId);

    await sleep(15000);

    const workflow = await action.getWorkflowRun(jobStepRunId);
    
    if(workflow instanceof Error){
        return Promise.resolve(new Response(`Erro ${workflow.message}`));
    }

    return Promise.resolve(new Response(`The generated guid is ${jobStepRunId}`));
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}