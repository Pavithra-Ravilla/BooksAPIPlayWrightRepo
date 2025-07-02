import { booksAPI } from 'pages/booksAPI';
import test, { expect } from '@playwright/test';
import { accessJWTToken, readJsonFile } from 'utils/helperUtils';

let jwtToken: string;
let signedUpUser: any;

function generateBookPayload() {
  return {
    id: Date.now().toString().substring(8),
    name: 'Update Test Book',
    author: 'Author',
    published_year: 2025,
    book_summary: 'Update test'
  };
}

test.beforeAll(async ({ request }) => {
  signedUpUser = await readJsonFile('../testData/signedUpUser.json');
  jwtToken = await accessJWTToken(request, signedUpUser.id, signedUpUser.email, signedUpUser.password);
});

test('@positive should update book by valid ID', async ({ request }) => {
  const booksApi = new booksAPI(request);
  const payload = generateBookPayload();
  const createResp = await booksApi.createBook(jwtToken, payload);
  expect(createResp.status()).toBe(200);
  const createdBook = await createResp.json();

  const updatedPayload = { ...payload, name: 'Updated Book Name' };
  const updateResp = await booksApi.updateBookById(jwtToken, createdBook.id, updatedPayload);
  expect(updateResp.status()).toBe(200);
  const updatedBook = await updateResp.json();
  expect(updatedBook.name).toBe('Updated Book Name');
});

test('@negative should return 404 for updating non-existing book', async ({ request }) => {
  const booksApi = new booksAPI(request);
  const updatedPayload = generateBookPayload();
  const updateResp = await booksApi.updateBookById(jwtToken, 132, updatedPayload);
  expect(updateResp.status()).toBe(404);
  const body = await updateResp.json();
  expect(body.detail).toBe('Book not found');
});

