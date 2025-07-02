import test, { expect } from '@playwright/test';
import { signUpAndLoginTokenAPI } from 'pages/signUpAndLoginTokenAPI';
import { writeDataToJsonFile } from 'utils/helperUtils';

test('@positive Should signup with valid user - Success', async ({ request }) => {
  const signUpAndLoginToken = new signUpAndLoginTokenAPI(request);

  const id = Number(Date.now().toString().substring(8));
  console.log('Dynamic Id --->', id);

  const email = `user_${id}@mail.com`;
  console.log('userEmail--->', email);

  const password = 'Test@1212';//load password from secrets - will do later

  await writeDataToJsonFile(id,email,password);
  const response = await signUpAndLoginToken.authAPIRequest('signup',id, email, password);

  const body = await response.json();
  expect(response.status()).toBe(200);
  expect(body.message).toBe('User created successfully');
});
