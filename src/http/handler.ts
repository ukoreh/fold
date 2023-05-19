import { Config } from "../config";
import guid from "../data/guid";

export default async function (req: Request, config: Config): Promise<Response> {
    const jobRunId = guid();

    return Promise.resolve(new Response(`Hello ${config.awesomeSecret}. The generated guid is ${jobRunId}`));
}