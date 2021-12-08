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
                password
            }
        }
        `;
    
      const CreateUser = gql`
         mutation CreateUser($email: String!, $password: String!) {
            newUser: createMyUser(data: { email: $email, password: $password }) {
                id
                email
                password
            }
        }
      `;
  
      const { user } = await graphQLClient.request(GetUser, { email,});  

      if(user){
        return {
            status:409,
            body: {
                message: 'User already exists'
            }
        }
      }
   
      const {newUser} = await graphQLClient.request(CreateUser, {email,password: await hash(password,12)})
        
      const json = JSON.stringify(newUser)
      const id = Buffer.from(json).toString('base64')
      
      //const { id } = await createSession(email);

      return {
		status: 201,
		headers: {
			'Set-Cookie': serialize('jwt', id, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 * 7, // one week
			}),
		},
		body: {
			message: 'Successfully signed up',
		},
	};
    }


