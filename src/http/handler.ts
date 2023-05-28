import { Config } from "../config";
import guid from "../data/guid";
import { ForkCloneBuildDeployAction } from "../data";
import { requestToGitHubRepository } from "../data";
import { BadRequest, WorkflowInit, InternalServerError, corsResponse } from "./response";
import { extractJobId, hasDownloadLogsHeaderSet } from "./header";

export default async function (req: Request, config: Config): Promise<Response> {
    if (req.method === 'OPTIONS') {
        return Promise.resolve(corsResponse(req));
    }

    const jobStepRunId = guid();

    const action = new ForkCloneBuildDeployAction(config.githubToken, config.forkOrg, config.actionRepoOwner, config.actionRepoName, config.actionWorkflowId, config.actionRefBranch);

    if (hasDownloadLogsHeaderSet(req.headers)) {
        const jobId = Number.parseInt(extractJobId(req.headers) ?? '0');

        const logs = await action.getWorkflowRunLogs(config.actionRepoOwner, config.actionRepoName, jobId);

        if (logs instanceof Error) {
            return Promise.resolve(new BadRequest(logs.message).toResponse());
        }

        return Promise.resolve(new Response(logs, {
            headers: {
                'access-control-expose-headers': '*',
                'Access-Control-Allow-Origin': '*'
            }
        }));
    }

    const githubRepo = requestToGitHubRepository(req);

    if (githubRepo instanceof Error) {
        return Promise.resolve(new BadRequest(githubRepo.message).toResponse());
    }

    action.createWorkflowDispatch(githubRepo.owner, githubRepo.name, jobStepRunId);

    await sleep(15000);

    const workflow = await action.getWorkflowRun(jobStepRunId);

    if (workflow instanceof Error) {
        return Promise.resolve(new InternalServerError(workflow.message).toResponse());
    }

    const response = <WorkflowInit>{
        runUrl: workflow,
        deployUrl: action.getDeployUrl(githubRepo.owner, githubRepo.name),
    };

    return Promise.resolve(Response.json(response, {
        headers: {
            'access-control-expose-headers': '*',
            'Access-Control-Allow-Origin': '*'
        }
    }));
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
