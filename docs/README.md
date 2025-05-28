---
layout: home
permalink: index.html

# Please update this with your repository name and title
repository-name: e19-4yp-blockchain-based-e-voting-system
title: Blockchain based e-voting system
---

[comment]: # "This is the standard layout for the project, but you can clean this and use your own template"

# Blockchain based e-voting system

#### Team

- e19193, Kanchana Kaushalya, [email](mailto:e19193@eng.pdn.ac.lk)
- e19363, Nimnadi Senevirathne, [email](mailto:e19363@eng.pdn.ac.lk)
- e19375, Dasun Udayanga, [email](mailto:e19375@eng.pdn.ac.lk)

#### Supervisors

- Prof. Manjula Sandirigama, [email](mailto:manjula.sandirigama@eng.pdn.ac.lk)
<!-- 
#### Table of content

1. [Abstract](#abstract)
2. [Related works](#related-works)
3. [Methodology](#methodology)
4. [Experiment Setup and Implementation](#experiment-setup-and-implementation)
5. [Results and Analysis](#results-and-analysis)
6. [Conclusion](#conclusion)
7. [Publications](#publications)
8. [Links](#links)
-->
---

<!-- 
DELETE THIS SAMPLE before publishing to GitHub Pages !!!
This is a sample image, to show how to add images to your page. To learn more options, please refer [this](https://projects.ce.pdn.ac.lk/docs/faq/how-to-add-an-image/)
![Sample Image](./images/sample.png) 
-->


### Abstract 

This project explores the development of a **secure, transparent, and verifiable blockchain-based electronic voting (e-voting) system** aimed at addressing the challenges of traditional paper-based and centralized electronic voting systems. By leveraging blockchain technology, the system ensures **ballot secrecy, voter verifiability, contestability, and auditability**, making elections more secure and resistant to tampering.  

The research involves a **comprehensive analysis of existing e-voting systems**, expert interviews with blockchain and cybersecurity professionals, and case study evaluations to identify potential improvements. A prototype of the e-voting system will be developed and tested with a controlled user group to assess **usability, security, and scalability**.  


#### Key Objectives  

✅ **Enhancing security** by preventing fraud and unauthorized modifications to votes  
✅ **Ensuring transparency** through a decentralized and immutable ledger  
✅ **Providing voter verifiability** without compromising ballot secrecy  
✅ **Analyzing usability and accessibility** through user feedback and expert reviews  

Through this research, we aim to contribute to the **future of digital democracy** by demonstrating the feasibility of blockchain-based e-voting systems while addressing potential challenges and limitations.

#### Evolution of voting
![Screenshot 2025-05-28 145034](https://github.com/user-attachments/assets/bfdbc735-fc95-4320-a18d-f326e9ae7098)

## High-Level System Architecture

There are three system states:

1. **Pre-Election**

   - Voter Registration and Authentication
   - Candidate Registration

2. **During Election**

   - Voting Phase

3. **Post-Election**

   - Result Counting and Publishing

---

### Voter Registration and Authentication

![11](https://github.com/user-attachments/assets/bcf28d20-f7d8-4e89-9a02-1e7091d83447)

The Voter Registration Module verifies voter identities and securely assigns cryptographic voting keys. This module interacts with the election commission database to store voter records securely.

**Components:**

- **Election Commission (EC):** Responsible for verifying and registering voters.
- **Secure Voter Database:** Stores voter details (not on the blockchain).
- **Threshold Cryptography Key Generation:** Splits the voter’s key into two parts.
- **Blockchain:** Stores only the hashed voter key for verification.

**Process Flow:**

1. Voter submits registration details.
2. EC verifies identity and generates a voting key pair using threshold cryptography.
3. One part of the key is sent via registered mail; the other is stored in the database and used at the polling station.
4. The hashed key is stored on the blockchain for verification.

---

### Candidate Registration
![22](https://github.com/user-attachments/assets/cd2fbe85-3fa5-4b2d-8c3f-7589396e87f9)

The Candidate Registration Module ensures only eligible candidates are registered and that their details are securely stored on the blockchain.

**Components:**

- **Election Commission:** Verifies and approves candidate applications.
- **Candidate Database:** Stores candidate details securely.
- **Blockchain:** Stores candidate names, party affiliations, and assigned candidate IDs in the genesis block.

**Process Flow:**

1. Candidates submit their application with the required documents.
2. EC verifies eligibility and assigns a unique candidate ID.
3. Candidate details are added to the private blockchain to ensure immutability.

---

### Voting Process
![33](https://github.com/user-attachments/assets/a8eaffc6-0b87-4085-b8d5-0a921c47754f)

The Voting Module enables voters to cast encrypted votes securely using threshold cryptography and homomorphic encryption. Votes are stored off-chain in IPFS, while only their hashes are recorded on the blockchain.

**Components:**

- **Voter Authentication:** Voters must provide both key parts for authentication.
- **Encrypted Ballot Casting:** Votes are encrypted using homomorphic encryption.
- **IPFS Storage:** Encrypted votes are stored in a decentralized manner.
- **Blockchain:** Stores only the IPFS hash to ensure vote integrity.

**Process Flow:**

1. Voter authenticates using both key parts.
2. Voter selects a candidate.
3. Vote is encrypted using homomorphic encryption and stored on IPFS.
4. The IPFS hash is recorded on the blockchain.

---

### Counting and Result Publication
![44](https://github.com/user-attachments/assets/85cbb6fc-c369-42bf-8910-4e4c0a7043a7)

The Counting & Result Module aggregates encrypted votes off-chain using homomorphic encryption and publishes the final result on the blockchain.

**Components:**

- **Homomorphic Vote Aggregation:** Computes results without decrypting individual votes.
- **Threshold Decryption:** Only the final tally is decrypted using multi-party decryption.
- **Blockchain & IPFS:** Stores final election results and enables public verification.
- **Web Interface:** Displays results in a verifiable and transparent manner.

**Process Flow:**

1. Encrypted votes are retrieved from IPFS.
2. Homomorphic encryption is used to compute vote tallies without decryption.
3. The final tally is decrypted and stored on IPFS; its hash is recorded on the blockchain.
4. The results are displayed via a secure web interface.


### Publications
[//]: # "Note: Uncomment each once you uploaded the files to the repository"

<!-- 1. [Semester 7 report](./) -->
<!-- 2. [Semester 7 slides](./) -->
<!-- 3. [Semester 8 report](./) -->
<!-- 4. [Semester 8 slides](./) -->
<!-- 5. Author 1, Author 2 and Author 3 "Research paper title" (2021). [PDF](./). -->


### Links

[//]: # ( NOTE: EDIT THIS LINKS WITH YOUR REPO DETAILS )

- [Project Repository](https://github.com/cepdnaclk/repository-name)
- [Project Page](https://cepdnaclk.github.io/repository-name)
- [Department of Computer Engineering](http://www.ce.pdn.ac.lk/)
- [University of Peradeniya](https://eng.pdn.ac.lk/)

[//]: # "Please refer this to learn more about Markdown syntax"
[//]: # "https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet"
