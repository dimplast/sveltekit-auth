import { createSession, getUserByEmail, registerUser } from "./_db";
import {serialize} from 'cookie'
//import { connectToDatabase } from '$lib/db';
import { compare, hash } from "bcryptjs";
import { GraphQLClient, gql } from 'graphql-request'


const GRAPHCMS_ENDPOINT = process.env['GRAPHCMS_ENDPOINT']
const GRAPHCMS_TOKEN = process.env['GRAPHCMS_TOKEN']


export async function post({body:{email,password}}){

    const graphQLClient = new GraphQLClient(GRAPHCMS_ENDPOINT, {
        headers: {
          authorization: `Bearer ${GRAPHCMS_TOKEN}`,
        },
      })

      console.log(graphQLClient)

      const GetUser = gql`
        query GetUser($email: String!) {
            user: myUser(where: { email: $email }, stage: DRAFT) {
                id
				email
                password
            }
        }
        `;
            
      const { user } = await graphQLClient.request(GetUser, { email});  


	if (!user || await compare(user.password, password)) {
		return {
			status: 401,
			body: {
				message: 'Incorrect user or password',
			},
		};
	}
   
   
    //const user = await getUserByEmail(email)
    //const dbConnection = await connectToDatabase();
    //const db = dbConnection.db;

    // Is there a user with such an email?
    //const user = await db.collection('users').findOne({ email: email });

    /*if(user){
        return {
            status:409,
            body: {
                message: 'User already exists'
            }
        }
    }*/

    //await registerUser({email,password})

    /*await db.collection('users').insertOne({
        email: email,
        password: password
    });*/

    
    const { id } = await createSession(email);
	return {
		status: 200,
		headers: {
			'Set-Cookie': serialize('session_id', id, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 * 7, // one week
			}),
		},
		body: {
			message: 'Successfully signed in',
		},
	};
}








/*import { createSession, getUserByEmail } from './_db';
import { serialize } from 'cookie';
//import { connectToDatabase } from '$lib/mongo_db';

export async function post({ body: { email, password } }) {

    //const user = await getUserByEmail(email);
	const dbConnection = await connectToDatabase();
    const db = dbConnection.db;

    const user = await db.collection('users').findOne({ email: email });

	console.log(email)

	if (!user || user.password !== password) {
		return {
			status: 401,
			body: {
				message: 'Incorrect user or password',
			},
		};
	}

	const { id } = await createSession(email);
	return {
		status: 200,
		headers: {
			'Set-Cookie': serialize('session_id', id, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 * 7, // one week
			}),
		},
		body: {
			message: 'Successfully signed in',
		},
	};
}*/