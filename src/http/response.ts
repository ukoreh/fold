export interface WorkflowInit {
    runUrl: WorkflowRunURL,
    deployUrl: string
};

export function corsResponse(req: Request): Response {
    return new Response(null, { headers: corsHeaders(req.headers) });
}

function corsHeaders(reqHeaders: Headers): Headers {
    return new Headers(
        {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': reqHeaders.get("Access-Control-Request-Headers")!,
            'Allow': 'GET,HEAD,PUT,PATCH,POST,DELETE',
            'Credentials': 'true'
        }
    );
}

export abstract class ErrorResponse {
    constructor(protected readonly message: string, protected readonly status: number){};
    
    toResponse(): Response{
        return Response.json(this, {
            status: this.status,
            headers: {
                'access-control-expose-headers': '*',
                'Access-Control-Allow-Origin': '*'
            }
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