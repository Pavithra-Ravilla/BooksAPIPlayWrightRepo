import * as dotenv from 'dotenv';

dotenv.config();


export const config = {

    baseUrl: process.env.BASE_URL,
    userName: process.env.USERNAME,
    passWord: process.env.PASSWORD

}