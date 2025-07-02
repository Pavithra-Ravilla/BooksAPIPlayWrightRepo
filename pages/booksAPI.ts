
import { APIRequestContext } from '@playwright/test';

export class booksAPI {
  constructor(private request: APIRequestContext) {}

  async createBook(jwtToken: string, bookPayload: any) {
    return await this.request.post('/books', {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
      data: bookPayload,
    });
  }

  async getBookById(token: string, bookId: string | number) {
    return await this.request.get(`/books/${bookId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async deleteBookById(token: string, bookId: string | number) {
    return await this.request.delete(`/books/${bookId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async updateBookById(token: string, bookId: string | number, bookPayload: any) {
    return await this.request.put(`/books/${bookId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: bookPayload,
    });
  }
}
