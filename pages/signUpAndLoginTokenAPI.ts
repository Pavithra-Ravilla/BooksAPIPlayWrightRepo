import { APIRequestContext } from '@playwright/test';

export class signUpAndLoginTokenAPI {

constructor(private request: APIRequestContext) {}

    async authAPIRequest(requestAPIEndpoint:string, id: number, email: string, password: string) 
    {
        return await this.request.post(`/${requestAPIEndpoint}`, {
            data : { id , email, password}
        });
    }


}