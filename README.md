# HealthConnect - A Next.js Demo App

This is a Next.js application built with Firebase Studio, demonstrating a healthcare appointment booking platform. It features mock user authentication, doctor and lab test browsing, and an AI-powered recommendation system.

## Getting Started

To run this project on your local machine, please follow the steps below.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or newer)
- [npm](https://www.npmjs.com/) (usually included with Node.js)
- [Firebase CLI](https://firebase.google.com/docs/cli)

### 1. Install Dependencies

Navigate to the project's root directory in your terminal and run the following command to install the required packages:

```bash
npm install
```

### 2. Run the Development Server

After the installation is complete, start the local development server:

```bash
npm run dev
```

The application will be available at `http://localhost:9002`. You can open this URL in your web browser to view the app. The server supports hot-reloading, so any changes you make to the code will be automatically reflected in the browser.

### 3. Running Genkit Flows (Optional)

If you are working with the AI features, you will need to run the Genkit development server in a separate terminal:

```bash
npm run genkit:dev
```

This will start the Genkit development UI, typically available at `http://localhost:4000`, where you can inspect and test your AI flows.

## Deploying to Firebase App Hosting

This project is configured for easy deployment to Firebase App Hosting.

### 1. Login to Firebase

If you haven't already, log in to your Firebase account using the CLI:

```bash
firebase login
```

### 2. Select Your Firebase Project

Set the CLI to use your project:

```bash
firebase use studio-9515012891-53352
```

### 3. Deploy the App

Deploy your application to Firebase App Hosting with the following command:

```bash
firebase deploy --only apphosting
```

Once the deployment is complete, the Firebase CLI will provide you with the URL of your live application.
