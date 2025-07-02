import test, { expect } from '@playwright/test';
import { booksAPI } from 'pages/booksAPI';
import { accessJWTToken, readJsonFile } from 'utils/helperUtils';

let jwtToken: string;
let signedUpJsonData: any;

test.beforeAll(async ({ request }) => {
  // Read the test user data (already signed up)
  signedUpJsonData = await readJsonFile('../testData/signedUpUser.json');
  
  // Get JWT token for the user
  jwtToken = await accessJWTToken(
    request,
    signedUpJsonData.id,
    signedUpJsonData.email,
    signedUpJsonData.password
  );
});

test('@positive GET /books/ should return list of books', async ({ request }) => {
const bookApi = new booksAPI(request);
const response =  await bookApi.getBookById(jwtToken,'');
  expect(response.status()).toBe(200);
  const booksList = await response.json();
 // console.log('Books:', booksList);
  // Basic assertions
  expect(Array.isArray(booksList)).toBe(true);

  if (booksList.length > 0) {
    for (const book of booksList) {
      expect(book).toHaveProperty('id');
      expect(book).toHaveProperty('name');
      expect(book).toHaveProperty('author');
      expect(book).toHaveProperty('published_year');
      expect(book).toHaveProperty('book_summary');
    }
  }
});

test('@negative GET /books/ should fail with invalid token', async ({ request }) => {
  const bookApi = new booksAPI(request);
const response =  await bookApi.getBookById('sfd','');

  expect(response.status()).toBe(403);

  const resp = await response.json();
  expect(resp.detail).toBe('Invalid token or expired token');
});
