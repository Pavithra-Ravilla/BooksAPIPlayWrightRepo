import { booksAPI } from 'pages/booksAPI';
import test, { expect } from 'playwright/test';
import { accessJWTToken, readJsonFile } from 'utils/helperUtils';

let jwtToken: string;
let signedUpJsonData: any;

function generateBookPayload() {
  return {
    id: Date.now().toString().substring(8),
    name: 'PlayWright API',
    author: 'Pavithra Ravilla',
    published_year: 2025,
    book_summary: 'Gives you API Automation Test Scripts'
  };
}

test.describe('Books API - Positive and Negative Tests', () => {

  test.beforeEach(async ({ request }) => {
    signedUpJsonData = await readJsonFile('../testData/signedUpUser.json');
    jwtToken = await accessJWTToken(request, signedUpJsonData.id, signedUpJsonData.email, signedUpJsonData.password);
  });

  test('@positive should create book', async ({ request }) => {
    const booksApi = new booksAPI(request);
    const payload = generateBookPayload();
    const response = await booksApi.createBook(jwtToken, payload);
    expect(response.status()).toBe(200);
    const resp = await response.json();
    expect(resp.name).toBe(payload.name);
    expect(resp.author).toBe(payload.author);
    expect(resp.published_year).toBe(payload.published_year);
  });

  test('@negative should throw invalid token or expired token', async ({ request }) => {
    const booksApi = new booksAPI(request);
    const payload = generateBookPayload();
    const response = await booksApi.createBook('invalid_token', payload);
    expect(response.status()).toBe(403);
    const body = await response.json();
    expect(body.detail).toBe('Invalid token or expired token');
  });

  test('@negative should throw internal server error if book already exists', async ({ request }) => {
    const booksApi = new booksAPI(request);
    const payload = generateBookPayload();
    // First creation (should succeed)
    const createResp = await booksApi.createBook(jwtToken, payload);
    expect(createResp.status()).toBe(200);
    // Duplicate creation (should fail)
    const duplicateResp = await booksApi.createBook(jwtToken, payload);
    expect(duplicateResp.status()).toBe(500);
    const text = await duplicateResp.text();
    expect(text).toBe('Internal Server Error');
  });
});
