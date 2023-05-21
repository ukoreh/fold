export class GitHubRepository {
    private constructor(private readonly url: string, public readonly owner: string, public readonly name: string) {
    }

    static from(urlString: string | null): GitHubRepository | Error{
        if(!urlString){
            return new Error("URL must not be null");
        }

        const url = new URL(urlString);

        const pathParts = url.pathname.split('/').filter((value) => value && value.trim() !== "");

        if(pathParts.length == 0) {
            return new Error("URL must contain the owner and repository name");
        }
        
        if(pathParts.length <= 1) {
            return new Error("URL must contain the repository name");
        }

        return new GitHubRepository(urlString, pathParts[0], pathParts[1]);
    }
}