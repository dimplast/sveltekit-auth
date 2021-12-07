//import * as cookie from 'cookie';
import {parse} from 'cookie'
//import { connectToDatabase } from '$lib/mongo_db';
import { getSession as getSessionFromApi } from './routes/api/_db'

// Sets context in endpoints
// Try console logging context in your endpoints' HTTP methods to understand the structure
export const handle = async ({ request, resolve }) => {
    // Connecting to DB
    // All database code can only run inside async functions as it uses await
    //const dbConnection = await connectToDatabase();
    //const db = dbConnection.db;

    //console.log('dbConnection',dbConnection)
    //console.log('db',db)

    const cookies = parse(request.headers.cookie || '')

    console.log(cookies)

    if(cookies.session_id){
        const session = await getSessionFromApi(cookies.session_id)
        if (session){
            request.locals.user = {email: session.email}
            return resolve(request)
        }
    }

    request.locals.user =  null
    return resolve(request)
}

export function getSession(request) {
	return request?.locals?.user? {
				user: {
					email: request.locals.user.email,
				},
		  }
		: {};
};


/*import {parse} from 'cookie'
import { getSession as getSessionFromApi } from './routes/api/_db'

export async function handle({request, resolve}){

    const cookies = parse(request.headers.cookie || '')

    console.log(cookies)

    if(cookies.session_id){
        const session = await getSessionFromApi(cookies.session_id)
        if (session){
            request.locals.user = {email: session.email}
            return resolve(request)
        }
    }

    request.locals.user =  null
    return resolve(request)
}

export function getSession(request) {
	return request?.locals?.user? {
				user: {
					email: request.locals.user.email,
				},
		  }
		: {};
}*/