export interface Env {
    GITHUB_TOKEN: string;
}

export interface Config {
    githubToken: string;
}

export function fromEnv(env: Env): Config {
    return {
        githubToken: env.GITHUB_TOKEN,
    }
}