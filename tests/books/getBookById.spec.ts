import { booksAPI } from 'pages/booksAPI';
import test, { expect } from '@playwright/test';
import { accessJWTToken, readJsonFile } from 'utils/helperUtils';

let jwtToken: string;
let signedUpUser: any;

function generateBookPayload() {
  return {
    id: Date.now().toString().substring(8),
    name: 'Get Test Book',
    author: 'Author',
    published_year: 2025,
    book_summary: 'Get test'
  };
}

test.beforeAll(async ({ request }) => {
  signedUpUser = await readJsonFile('../testData/signedUpUser.json');
  jwtToken = await accessJWTToken(request, signedUpUser.id, signedUpUser.email, signedUpUser.password);
});

test('@positive should get book by valid ID', async ({ request }) => {
  const booksApi = new booksAPI(request);
  const payload = generateBookPayload();
  const createResp = await booksApi.createBook(jwtToken, payload);
  expect(createResp.status()).toBe(200);
  const createdBook = await createResp.json();

  const getResp = await booksApi.getBookById(jwtToken, createdBook.id);
  expect(getResp.status()).toBe(200);
  const book = await getResp.json();
  expect(book.id).toBe(createdBook.id);
  expect(book.name).toBe(payload.name);
});

test('@negative should return 404 for non-existing book', async ({ request }) => {
  const booksApi = new booksAPI(request);
  const getResp = await booksApi.getBookById(jwtToken, 123);
  expect(getResp.status()).toBe(404);
  const body = await getResp.json();
  expect(body.detail).toBe('Book not found');
});

