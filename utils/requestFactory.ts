import { request, APIRequestContext } from '@playwright/test';

export async function createAPIRequestContext():Promise<APIRequestContext> {

    return await request.newContext({
    baseURL: 'http://127.0.0.1:8000',
    extraHTTPHeaders: {
      'Content-Type': 'application/json'
    }
  });
    
}