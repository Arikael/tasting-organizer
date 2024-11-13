import createClient from "openapi-fetch";
import type { paths } from "./v1";
import { BACKEND_URL} from '$env/static/private'

const client = createClient<paths>({ baseUrl: BACKEND_URL });

export default client