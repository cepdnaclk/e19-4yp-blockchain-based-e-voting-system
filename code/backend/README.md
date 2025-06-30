# Blockchain-based E-Voting System Backend

A secure and transparent backend service for a blockchain-based e-voting system built with Node.js, Express, TypeScript, PostgreSQL, and Web3.js. This system provides secure authentication, vote management, and blockchain integration for transparent and tamper-proof voting.

## 🚀 Features

- **Secure Authentication**: JWT-based authentication for administrators and voters
- **Blockchain Integration**: Web3.js integration for transparent vote recording
- **Database Management**: PostgreSQL with migration support
- **RESTful API**: Well-structured API endpoints for voting operations
- **TypeScript**: Full TypeScript support for better development experience
- **Testing**: Jest testing framework with supertest for API testing
- **Hot Reload**: Nodemon for development with automatic restart

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Blockchain**: Web3.js
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcrypt
- **Testing**: Jest + Supertest
- **Development**: Nodemon

## ⚙️ Environment Variables

Create a `.env` file in the root directory with the following configuration:

```env
# Server Configuration
PORT=5000                      # Port number the backend server will run on
NODE_ENV=development           # Application environment (development | production)

# Database Configuration
DB_HOST=localhost              # Hostname of the PostgreSQL server
DB_PORT=5432                   # Port number for PostgreSQL
DB_NAME=voting_system          # Name of the database
DB_USER=dasun                  # Database username
DB_PASSWORD=dasun              # Database password

# JWT Configuration
JWT_ACCESS_SECRET=your_access_secret_key              # Secret key for signing access tokens
JWT_REFRESH_SECRET=your_refresh_secret_key            # Secret key for signing refresh tokens
JWT_ACCESS_TOKEN_EXPIRES_IN=15m                       # Access token expiry (e.g., 15m, 1h)
JWT_REFRESH_TOKEN_EXPIRES_IN=30d                      # Refresh token expiry (e.g., 7d, 30d)

# CORS Configuration
CORS_ORIGIN=http://localhost:5173                     # Frontend origin allowed for CORS

# Blockchain Configuration (optional)
# BLOCKCHAIN_NETWORK=localhost                         # Blockchain network type (localhost/testnet/mainnet)
# BLOCKCHAIN_PORT=8545                                 # Port where blockchain network runs
# CONTRACT_ADDRESS=your_contract_address               # Deployed smart contract address
# PRIVATE_KEY=your_private_key                         # Private key to sign blockchain transactions

# DB Migration Configuration
DATABASE_URL=postgres://dasun:dasun@localhost:5432/voting_system  # Connection string for migration tools

# Admin Registration
ADMIN_REGISTRATION_ALLOWED=true                             # Toggle

# Voter Registration Allowed
VOTER_REGISTRATION_ALLOWED=true  # Allow voter registration

# Cryptography
RANDOM_STRING_LENGTH=128

```

## 📁 Project Structure

```
backend/
├── migrations/                    # Database migrations (node-pg-migrate)
├── src/
│   ├── index.ts                  # Application entry point
│   ├── __test__/                 # Test files
│   ├── blockchain/               # Blockchain integration
│   ├── common/                   # Shared constants and types
│   │   ├── constants/
│   │   └── types/
│   ├── controllers/              # Route controllers
│   │   ├── admin/
│   │   └── auth/
│   ├── middleware/               # Express middleware
│   ├── migrations/               # SQL migration files
│   ├── models/                   # Database models
│   ├── routes/                   # API routes
│   ├── services/                 # Business logic services
│   │   ├── admin/
│   │   ├── auth/
│   │   └── common/
│   └── utils/                    # Utility functions
├── package.json
├── tsconfig.json                 # TypeScript configuration
├── nodemon.json                  # Nodemon configuration
├── jest.config.js               # Jest testing configuration
└── .env                         # Environment variables (create this file)
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment variables**

   - Copy the environment variables template above
   - Create a `.env` file in the root directory
   - Fill in your specific configuration values

4. **Setup database**

   - Create a PostgreSQL database
   - Run migrations:
     ```bash
     npm run migrate up
     ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000` (or your configured PORT).

## 📜 Available Scripts

| Script            | Description                              |
| ----------------- | ---------------------------------------- |
| `npm start`       | Start the production server              |
| `npm run dev`     | Start development server with hot-reload |
| `npm run build`   | Build TypeScript code to JavaScript      |
| `npm test`        | Run Jest tests                           |
| `npm run migrate` | Run database migrations                  |

## 🔌 API Endpoints

The API provides the following main endpoints:

- **Authentication**: `/api/auth/*`
- **Admin Operations**: `/api/admin/*`
- **Voter Operations**: `/api/voter/*`
- **Voting**: `/api/votes/*`
- **General**: `/api/*`

Test the server health at: `http://localhost:5000/api/test`

## 🧪 Testing

This project uses Jest with Supertest for testing:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## 🔧 Development

### Hot Reload Configuration

The development server uses nodemon with the following configuration:

- Watches: `src/` directory
- Extensions: `.ts`, `.js`, `.json`
- Ignores: `src/**/*.spec.ts`
- Executes: `ts-node ./src/index.ts`

### TypeScript Configuration

- Target: ES2020
- Module: CommonJS
- Output: `./dist`
- Source: `./src`
- Strict mode enabled

## 🔒 Security Considerations

- **Environment Variables**: Never commit `.env` files to version control
- **Private Keys**: Keep blockchain private keys secure and use environment variables
- **JWT Secrets**: Use strong, randomly generated JWT secrets
- **Database**: Use strong passwords and consider connection encryption
- **CORS**: Configure CORS origins appropriately for your frontend
- **Production**: Use environment-specific configurations in production

## 🗄️ Database

The application uses PostgreSQL with the following features:

- Migration support via `node-pg-migrate`
- Structured schema for voters, candidates, votes, and voting history
- Admin and user authentication tables

## ⛓️ Blockchain Integration

The system integrates with blockchain through Web3.js for:

- Transparent vote recording
- Immutable vote storage
- Smart contract interaction

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**: Change the PORT in your `.env` file
2. **Database connection issues**: Verify your database credentials and ensure PostgreSQL is running
3. **Migration errors**: Check your DATABASE_URL format and database permissions

### Development Tips

- Use the debug middleware to log request details
- Check the error handling middleware for proper error responses
- Utilize the response handler utility for consistent API responses
