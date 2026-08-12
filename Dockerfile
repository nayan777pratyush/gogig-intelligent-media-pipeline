FROM node:20-slim

# Install OpenSSL for Prisma and build tools for sharp/tesseract
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code and prisma schema
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Create upload directory
RUN mkdir -p uploads sample-images

EXPOSE 3000

CMD ["npm", "start"]
