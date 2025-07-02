import { APIRequestContext } from "playwright/test";
import fs, { readFile } from 'fs/promises';
import path from 'path';
import { booksAPI } from "pages/booksAPI";

/**
 * Writes user data to a JSON file under /testData folder.
 * @param id - The user ID
 * @param email - The user's email address
 * @param password - The user's password
 */
export async function writeDataToJsonFile(id: number, email: string, password: string): Promise<void> {
  try {
    const data = { id, email, password };
    await writeToJsonFile('../testData/signedUpUser.json',data);
  } catch (error) {
    console.error('Error writing user data to json file:', error);
    throw error; 
  }
}

export async function accessJWTToken(request:APIRequestContext, id: number, email: string, password: string): Promise<any> {
    {
        const tokenResp = await request.post('/login', {
            data : {id, email, password},
        });
        const jwtResponse = await tokenResp.json();
        return jwtResponse.access_token;
    }

}

export async function readJsonFile(relativeFilePath: string): Promise<any> {

    const filePath = path.join(__dirname,relativeFilePath);
    const jsonData = JSON.parse(await readFile(filePath, 'utf-8'));
    return jsonData;
}

export async function writeToJsonFile(relativeFilePath: string, data: any) {
    // Create the file path dynamically
    const filePath = path.join(__dirname, relativeFilePath);
    // Write the JSON file with pretty formatting (2-space indentation)
    await fs.writeFile(filePath, JSON.stringify(data, null, 2),'utf8');
}

export async function createUniqueBook(request: APIRequestContext, jwtToken: string): Promise<any>
{
   let payloadJsonData = await readJsonFile('../testData/createBooksPayload.json');
      payloadJsonData.id = Date.now().toString().substring(8); // dynamic ID
      console.log('THis is the book passing', payloadJsonData.id);
      debugger;
      //Write to json file, because it will be useful for chainging
      const booksApi = new booksAPI(request);
      return await booksApi.createBook(jwtToken,payloadJsonData);    
}