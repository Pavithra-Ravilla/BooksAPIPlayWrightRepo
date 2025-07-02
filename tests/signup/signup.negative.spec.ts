import test, { expect } from '@playwright/test';
import { signUpAndLoginTokenAPI } from 'pages/signUpAndLoginTokenAPI';

test('@negative should throw 400 error with existing email - Throw 400', async ({ request }) => {
  const signUpAndLoginToken = new signUpAndLoginTokenAPI(request);

  const id = Date.now();
//  console.log('Dynamic Id --->', id);

  const email = `test123@gmail.com`;
 // console.log('userEmail--->', email);

  const password = 'Test@123';

  const response = await signUpAndLoginToken.authAPIRequest('signup',id, email, password);

  const body = await response.json();
  expect(response.status()).toBe(400);
  expect(body.detail).toBe('Email already registered');
});


test('@negative Should return 422 with empty payload', async ({ request }) => {
  const response = await request.post('/signup', {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    // Use 'json' not 'data'
    json: {
      id: "", // invalid type
      email: "",
      password: ""
    }
  });

  console.log(`Status: ${response.status()}`);
  const responseBody = await response.json();
  //console.log("response body of 422", JSON.stringify(responseBody, null, 2));

  expect(response.status()).toBe(422);
  expect(Array.isArray(responseBody.detail)).toBe(true);
  expect(responseBody.detail[0].msg).toContain('Field required'); 
});
