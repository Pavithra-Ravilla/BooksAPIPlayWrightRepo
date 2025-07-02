import test, { expect } from '@playwright/test';
import { signUpAndLoginTokenAPI } from 'pages/signUpAndLoginTokenAPI';
import {  readJsonFile, writeDataToJsonFile } from 'utils/helperUtils';

test('@positive Should signup with valid user and get the access token - Success', async ({ request }) => {
    const signUpAndLoginToken = new signUpAndLoginTokenAPI(request);
    
    //read the user details from json file - It has Signed up user details
    const signedUpUser = await readJsonFile('../testData/signedUpUser.json');
    console.log('Signed Up User Details:', signedUpUser.toString());

    const tokenResponse = await signUpAndLoginToken.authAPIRequest('login',signedUpUser.id, signedUpUser.email, signedUpUser.password);
    expect(tokenResponse.status()).toBe(200);
    const tokenResp = await tokenResponse.json();
    expect(tokenResp.token_type).toBe("bearer");
    expect(tokenResp.access_token.length).toBeGreaterThan(0);

});

test('@negative should throw Incorrect email or password', async ({ request }) => {
  const signUpAndLoginToken = new signUpAndLoginTokenAPI(request);
  
 // Intentionally passing wrong password
  let tokenResponse = await signUpAndLoginToken.authAPIRequest('login', 23, "234@gmailc.com", 'WrongPassword');
  
  expect(tokenResponse.status()).toBe(400);
  const tokenResp = await tokenResponse.json();
  expect(tokenResp.detail).toBe('Incorrect email or password');
});