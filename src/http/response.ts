export interface WorkflowInit {
    runUrl: WorkflowRunURL,
    deployUrl: string
};

export abstract class ErrorResponse {
    constructor(protected readonly message: string, protected readonly status: number){};
    
    toResponse(): Response{
        return Response.json(this, {
            status: this.status,
        });  
    }
};

export class BadRequest extends ErrorResponse {
    constructor(protected readonly message: string){
        super(message, 400);
    }
};

export class InternalServerError extends ErrorResponse {
    constructor(protected readonly message: string){
        super(message, 500);
    }
};