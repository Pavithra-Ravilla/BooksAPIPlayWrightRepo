import { booksAPI } from 'pages/booksAPI';
import test, { expect } from '@playwright/test';
import { accessJWTToken, readJsonFile } from 'utils/helperUtils';

let jwtToken: string;
let signedUpUser: any;

function generateBookPayload() {
  return {
    id: Date.now().toString().substring(8),
    name: 'Delete Test Book',
    author: 'Author',
    published_year: 2025,
    book_summary: 'Delete test',
  };
}

test.beforeAll(async ({ request }) => {
  // Read signed-up user details
  signedUpUser = await readJsonFile('../testData/signedUpUser.json');

  // Generate JWT token
  jwtToken = await accessJWTToken(
    request,
    signedUpUser.id,
    signedUpUser.email,
    signedUpUser.password
  );
});

test('@positive should delete book by valid book ID', async ({ request }) => {
  const booksApi = new booksAPI(request);
  const payload = generateBookPayload();
  const createResp = await booksApi.createBook(jwtToken, payload);
  expect(createResp.status()).toBe(200);
  const createdBook = await createResp.json();

  const deleteResp = await booksApi.deleteBookById(jwtToken, createdBook.id);
  expect(deleteResp.status()).toBe(200);
  const deleteBody = await deleteResp.json();
  expect(deleteBody.message).toBe('Book deleted successfully');
});

test('@negative should return 404 when deleting non-existing book', async ({ request }) => {
  const booksApi = new booksAPI(request);
  const deleteResp = await booksApi.deleteBookById(jwtToken, 123);
  expect(deleteResp.status()).toBe(404);
  const body = await deleteResp.json();
  expect(body.detail).toBe('Book not found');
});
