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

      console.log(graphQLClient)

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
    
   

    
      console.log(newUser)
    
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


    const { id } = await createSession(email)
    
    return {
        status:201,
        headers: {
            'Set-Cookie': serialize('session_id',id, {
                path:'/',
                httpOnly: true,
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7
            })
        },
        body: {
            message : 'Successfully signed'
        }
    }
}



/*import { createSession, getUserByEmail, registerUser } from "./_db";
import {serialize} from 'cookie'

export async function post({body:{email,password}}){
    
    const user = await getUserByEmail(email)

    if(user){
        return {
            status:409,
            body: {
                message: 'User already exists'
            }
        }
    }

    await registerUser({email,password})

    const { id } = await createSession(email)
    
    return {
        status:201,
        headers: {
            'Set-Cookie': serialize('session_id',id, {
                path:'/',
                httpOnly: true,
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7
            })
        },
        body: {
            message : 'Successfully signed'
        }
    }
}*/




