# 📘 VATTEND — Privacy-Preserving Attendance Tracker

## Project Title

**VATTEND: Privacy-Preserving Attendance Tracker on Algorand**

---

## 📖 Project Description

VATTEND is a decentralized attendance management system that allows students to prove their participation in classes or events without revealing their identity publicly. It leverages blockchain technology on Algorand to create tamper-proof, time-stamped attendance records while preserving user privacy.

The platform ensures:

- Secure attendance verification
- Prevention of proxy attendance
- Transparent audit trails
- Strong privacy protection

---

## 🎯 Problem Statement

Traditional attendance systems:

- Are easy to manipulate
- Allow proxy attendance
- Lack transparency
- Expose personal student data

VATTEND solves these problems by recording attendance proofs on the Algorand blockchain, ensuring authenticity, immutability, and privacy.

---

## 🌐 Live Demo

Live Demo URL: https://four-pointer.vercel.app

---

## 🎥 Demo Video (LinkedIn)

LinkedIn Demo Video: https://drive.google.com/file/d/17iwvyfS51gBublp6Fv4hW3BxbvmFqVGH/view?usp=sharing

---

## 🆔 App ID & Testnet Explorer

- App ID (Testnet): 600011882

## GitHub repo Link:

- GitHub repo link: https\://github.com/codewithyuvi/four_pointer

## 🏗️ Architecture Overview

VATTEND follows a decentralized client–blockchain architecture.

### Components

1. **Frontend (React)**
   - Student Dashboard
   - Instructor Dashboard
   - QR Scanner Interface
   - Attendance History Viewer

2. **Smart Contract Layer (Algorand)**
   - Stores attendance proofs
   - Verifies valid check-ins
   - Issues optional attendance tokens

3. **Algorand Network**
   - Stores immutable attendance records
   - Maintains time-stamped transactions

4. **External APIs**
   - Geolocation API for location verification
   - QR Code Generation & Scanner

### Interaction Flow

1. Instructor creates an event/class
2. System generates QR code / location boundary
3. Student scans QR / verifies location
4. Attendance proof is sent to Algorand
5. Smart contract validates and records transaction
6. Student and instructor dashboards update

---

## 🛠️ Tech Stack

### Blockchain & Smart Contracts

- AlgoKit
- Algorand SDK
- PyTEAL / Beaker / TEALScript (optional)

### Frontend

- React.js
- QR Code Scanner Library
- Tailwind CSS

### APIs & Tools

- Geolocation API
- Wallet Integration
- Testnet Explorer

### Development Tools

- Node.js
- npm
- Git & GitHub

---

## ⚙️ Installation & Setup

### Prerequisites

- Node.js (v16+)
- npm
- AlgoKit
- Algorand Testnet Wallet
- Git

---

### Step 1: Clone Repository

```bash
git clone https://github.com/codewithyuvi/four_pointer
cd vattend
```

---

### Step 2: Install Dependencies

```bash
npm install
```

---

### Step 3: Deploy Smart Contract

```bash
algokit project deploy
```

Save the generated App ID.

---

### Step 4: Run Frontend

```bash
npm run dev
```

Open in browser:

```
http://localhost:3000
```

---

## 📱 Usage Guide

### For Instructors

1. Register/Login
2. Create new class/event
3. Generate QR code
4. Share with students
5. View attendance analytics

---

### For Students

1. Register/Login
2. Open attendance section
3. Scan QR code / verify location
4. Submit attendance proof
5. View attendance history

---

### Screenshots

> Add screenshots here:

- Login Page
- Instructor Dashboard
- Student Dashboard
- QR Scanner
- Analytics Page

---

## 📊 Dashboard Features

### Instructor Dashboard

- Attendance statistics
- Student participation report
- Event management
- Export reports

### Student Dashboard

- Attendance timeline
- Proof verification
- Participation summary
- Profile management

---

## ⚠️ Known Limitations

- Depends on stable internet connection
- Geolocation accuracy varies by device
- Limited scalability on Testnet
- Manual wallet management required
- No biometric verification

---

## 🔐 Security & Privacy

- No public storage of personal identity
- Blockchain-based verification
- Encrypted wallet signatures
- Tamper-proof attendance records
- Decentralized validation

---

## 🚀 Advanced Topics

### 1. Privacy Enhancement

- Zero-knowledge proofs (future)
- Anonymous credential systems

### 2. Smart Contract Optimization

- Gas fee reduction
- Batch attendance recording

### 3. Scalability

- Mainnet deployment
- Layer-2 integration
- Indexer optimization

### 4. Tokenization

- Attendance NFTs
- Participation rewards
- Certification tokens

---

## 💰 Cost Management

- Uses Algorand Testnet (Free)
- Mainnet transaction fees are minimal
- Wallet management required
- Hosting costs depend on provider

---

## 👥 Team Members & Roles

| Name           | Role                  | Responsibility              |
| -------------- | --------------------- | --------------------------- |
| Yuvraj Bansal  | Blockchain Developer  | Smart contracts, deployment |
| Abhinav sharma | Frontend Developer    | UI/UX, React integration    |
| Anurag Thakur  | Backend / Integration | APIs, wallet integration    |

>

---

## 📚 Learning Outcomes

- Building decentralized record systems
- Working with immutable ledgers
- Implementing privacy-first design
- Integrating blockchain with frontend
- Understanding audit trails

---

## 🌍 Real-World Application

VATTEND enables educational institutions and organizations to:

- Automate attendance
- Prevent fraud
- Maintain privacy
- Generate reliable reports
- Ensure compliance

##