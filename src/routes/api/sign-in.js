import { createSession, GRAPHCMS_ENDPOINT, GRAPHCMS_TOKEN } from "./_db";
import {serialize} from 'cookie'
//import { connectToDatabase } from '$lib/db';
import { compare, hash } from "bcryptjs";
import { GraphQLClient, gql } from 'graphql-request'


export async function post({body:{email,password}}){

    const graphQLClient = new GraphQLClient(GRAPHCMS_ENDPOINT, {
        headers: {
          authorization: `Bearer ${GRAPHCMS_TOKEN}`,
        },
      })


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

	 const isValid = await compare(password, user.password);

	if (!user || !isValid) {

		return {
			status: 401,
			body: {
				message: 'Incorrect user or password',
			},
		};
	}
   
    //const { id } = await createSession(email);
	
	const json = JSON.stringify(user)
    const id = Buffer.from(json).toString('base64')

	return {
		status: 200,
		headers: {
			'Set-Cookie': serialize('jwt', id, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				maxAge: 60 * 60 * 24 * 7, // one week
			}),
		},
		body: {
			message: 'Successfully signed in',
		},
	};

}







