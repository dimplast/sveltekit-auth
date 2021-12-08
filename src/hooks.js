import { parse } from 'cookie';
import { getSession as getSessionFromApi } from './routes/api/_db';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ request, resolve }) {

	const cookies = parse(request.headers.cookie || '');
	const jwt = cookies.jwt && Buffer.from(cookies.jwt, 'base64').toString('utf-8');
	request.locals.user = jwt ? JSON.parse(jwt) : null;
	return await resolve(request);
}

/** @type {import('@sveltejs/kit').GetSession} */
export function getSession(request) {
	return request?.locals?.user
		? {
				user: {
					email: request.locals.user.email,
				},
		  }
		: {};
}


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