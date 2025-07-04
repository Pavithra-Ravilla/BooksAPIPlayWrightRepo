FROM mcr.microsoft.com/playwright:v1.44.0-jammy

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Copy .env file into the container
COPY .env .env

CMD ["npx", "playwright", "test"]