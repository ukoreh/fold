import { Config } from "../config";
import guid from "../data/guid";
import { ForkCloneBuildDeployAction } from "../data";
import { requestToGitHubRepository } from "../data";
import { BadRequest, WorkflowInit, InternalServerError } from "./response";

export default async function (req: Request, config: Config): Promise<Response> {
    const githubRepo = requestToGitHubRepository(req);
    
    if(githubRepo instanceof Error){
        return Promise.resolve(new BadRequest(githubRepo.message).toResponse());
    }

    const jobStepRunId = guid();
    
    const action = new ForkCloneBuildDeployAction(config.githubToken, config.forkOrg, config.actionRepoOwner, config.actionRepoName, config.actionWorkflowId, config.actionRefBranch);

    action.createWorkflowDispatch(githubRepo.owner, githubRepo.name, jobStepRunId);

    await sleep(15000);

    const workflow = await action.getWorkflowRun(jobStepRunId);
    
    if(workflow instanceof Error){
        return Promise.resolve(new InternalServerError(workflow.message).toResponse());
    }

    const response = <WorkflowInit>{
        runUrl: workflow,
        deployUrl: action.getDeployUrl(githubRepo.owner, githubRepo.name),
    };

    return Promise.resolve(Response.json(response));
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}