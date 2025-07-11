````markdown
# Blockchain-Based E-Voting System

A secure, decentralized e-voting platform built using **Hyperledger Fabric**, **IPFS**, and **Node.js**.

---

## 🧰 Prerequisites

Make sure the following tools are installed on your system:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Go (Golang)](https://golang.org/)

---

## 🚀 Project Setup Instructions

Follow these steps in order to set up and run the system:

### 1. Generate Hyperledger Artifacts

Navigate to the `artifacts/channel` directory and run the script:

```bash
cd artifacts/channel
dos2unix ./create-artifacts.sh
./create-artifacts.sh
```
````

### 2. Start the Docker Network

From the `artifacts` directory, start the Docker containers:

```bash
docker-compose up -d
```

### 3. Create the Channel

Go back to the project root directory and create the channel:

```bash
cd ../../..
dos2unix ./createChannel.sh
./createChannel.sh
```

### 4. Prepare Go Dependencies

Navigate to the chaincode source folder:

```bash
cd artifacts/src
go mod download github.com/hyperledger/fabric
go mod tidy
go mod vendor
```

### 5. Deploy Chaincode

From the project root directory, run the following script step by step:

```bash
cd ../../..
dos2unix ./deployChaincode.sh
./deployChaincode.sh
```

> Refer to the **15th video** in the tutorial series if necessary.

### 6. Generate Connection Profiles

Navigate to the `api-2.0/config` folder:

```bash
cd api-2.0/config
dos2unix ./generate-ccp.sh
./generate-ccp.sh
```

### 7. Start the Backend API

From the `api-2.0` directory:

```bash
cd ..
npm install
npm run dev
```

### 8. Start the hypeledger explorer

From the `Explorer` directory:

```bash
docker-compose up -d
Use localhost:8080 to inspect
```

---

## 📁 Directory Overview

```text
.
├── artifacts/              # Fabric and IPFS-related setup
│   ├── channel/            # Network artifacts and config
│   ├── src/                # Chaincode source code
│
├── api-2.0/                # Node.js backend API
│   ├── config/             # Connection profiles and scripts
│   └── ...
├── createChannel.sh        # Script to create the channel
├── deployChaincode.sh      # Script to deploy the chaincode
└── README.md               # You're reading it
```

---

## ✅ Tips & Notes

- Run all `.sh` scripts with execution permissions (`chmod +x <script>.sh`).
- Make sure Docker is running before executing `docker-compose up`.
- If you face issues with line endings (`^M` or `$'\r'`), convert files using `dos2unix`.

---

## 📜 License

This project is part of a final year research project and is subject to academic and institutional usage rights.

---
