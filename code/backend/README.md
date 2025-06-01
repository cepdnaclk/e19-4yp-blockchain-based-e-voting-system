# Blockchain-based E-Voting System Backend

This is the backend service for the blockchain-based e-voting system, built with Node.js, Express, TypeScript, and Web3.js.

## Environment Variables

Create a `.env` file in the root directory with the following structure:

```env
# Server Configuration
PORT=5000                    # Port number for the server
NODE_ENV=development         # Environment (development/production)

# Database Configuration
DB_HOST=localhost           # Database host
DB_PORT=5432               # Database port
DB_NAME=evoting_db         # Database name
DB_USER=postgres           # Database user
DB_PASSWORD=your_password  # Database password

# Blockchain Configuration
BLOCKCHAIN_NETWORK=localhost  # Blockchain network (localhost/testnet/mainnet)
BLOCKCHAIN_PORT=8545         # Blockchain network port
CONTRACT_ADDRESS=your_contract_address  # Smart contract address
PRIVATE_KEY=your_private_key           # Private key for blockchain transactions

# JWT Configuration
JWT_SECRET=your_jwt_secret_key  # Secret key for JWT token generation
JWT_EXPIRES_IN=24h              # JWT token expiration time

# CORS Configuration
CORS_ORIGIN=http://localhost:3000  # Allowed origin for CORS

# DB migrations
DATABASE_URL = postgres://user_name:password@localhost:port/db_name
```

## Project Structure

```
backend/
├── src/
│   ├── index.ts              # Application entry point
│   ├── routes/              # API routes
│   ├── models/              # Database models
│   ├── controllers/         # Route controllers
│   └── blockchain/          # Blockchain related code
├── package.json
├── tsconfig.json
├── nodemon.json
└── .env                     # Environment variables (create this file)
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on the structure above
4. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev`: Start development server with hot-reload
- `npm start`: Start production server
- `npm run build`: Build TypeScript code
- `npm test`: Run tests

## Security Notes

- Never commit the `.env` file to version control
- Keep your private keys and secrets secure
- Use strong passwords for database and JWT
- In production, use environment-specific values
