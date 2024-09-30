# Default Backend

Welcome to the Default Backend! This project uses Node.js, Express.js, and MongoDB to provide a robust backend service with clean architecture principles. The backend includes user authentication features such as login, logout, registration, password recovery, email verification, and AWS S3 image uploads.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Contributing](#contributing)

## Features

- User Authentication:
  - Register
  - Login
  - Logout
  - Forgot Password
  - Email Verification
- AWS S3 Integration for Image Uploads
- Clean Architecture
- MongoDB for Data Storage


## Installation

To get started with this project, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/Rudra127/default-backend.git
cd default-backend
```
2 .Install the dependencies:
```bash
npm run install:all
```

Running the Project
To run the project, use the following commands:

To start the User Microservice:
```bash
npm run dev:user-ms
```
To start the Gateway:
```bash
npm run dev:gateway
```
To start both the User Microservice and the Gateway concurrently:
```bash
npm run dev:all
```

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.


