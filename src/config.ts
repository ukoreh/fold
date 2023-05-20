export interface Env {
    GITHUB_TOKEN: string;
    FORK_ORG: string;
    ACTION_REPO_OWNER: string;
    ACTION_REPO_NAME: string;
    ACTION_WORKFLOW_ID: string;
    ACTION_REF_BRANCH: string;
}

export interface Config {
    githubToken: string;
    forkOrg: string;
    actionRepoOwner: string;
    actionRepoName: string;
    actionWorkflowId: string;
    actionRefBranch: string;
}

export function fromEnv(env: Env): Config {
    return {
        githubToken: env.GITHUB_TOKEN,
        forkOrg: env.FORK_ORG,
        actionRepoOwner: env.ACTION_REPO_OWNER,
        actionRepoName: env.ACTION_REPO_NAME,
        actionWorkflowId: env.ACTION_WORKFLOW_ID,
        actionRefBranch: env.ACTION_REF_BRANCH,
    }
}