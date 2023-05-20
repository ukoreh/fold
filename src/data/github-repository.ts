export class GitHubRepository {
    private constructor(private readonly url: string, public readonly owner: string, public readonly name: string) {
    }

    static from(url: string | null): GitHubRepository | Error{
        if(!url){
            return new Error("URL must not be null");
        }

        const urlParts = url.split('/');

        if(urlParts.length < 4) {
            return new Error("URL must contain the owner and repository name");
        }
        
        if(urlParts.length < 5) {
            return new Error("URL must contain the repository name");
        }

        return new GitHubRepository(url, urlParts[3], urlParts[4])
    }
}