# Thunder-Innovations-Asset-Desk

## Overview

The Asset Desk is a web application designed to manage and track digital assets for Thunder Innovations.

## Tech Stack

- **React**: UI framework for building the application interface.
- **Firebase**: Database Service:
    - **Firebase Authentication**: Firebase Native User Authentication
    - **Firebase Firestore**: NoSQL cloud database for data storage.
- **React Router**: For client-side routing and navigation.

## Dev Notes

### Firebase setup
1. In Firebase Console, select **Asset Desk Prod** (`asset-desk-production`), enable **Authentication → Email/Password**, and create a Firestore database.
2. Copy `.env.example` to a local `.env` file and paste the Web app configuration from **Project settings → Your apps**. Do not commit `.env`.
3. Deploy the included Hosting and Firestore configuration:
   ```bash
   npm run build
   firebase deploy
   ```
4. Seed the reference data while running locally with Firebase configured:
   ```js
   await seedDatabase()
   ```
   Run this in the browser developer console. It creates the `partners`, `kpis`, and `games` documents from `src/data/mockData.js`.

The included `firestore.rules` require users to sign in. Accounts created through the app can only create their own view-only profile. Provision user access through the Firebase Console or a trusted admin workflow:

- Staff editors: `partnerID: null` and `permissions: "Edit"` or `"Admin"`.
- Partner users: set `partnerID` to that partner's ID. They can manage only their own activation records.

### Local development
- `npm install` to install the app dependencies.
- If you need to sign up an account through the site, set `REACT_APP_ALLOW_SIGNUP=true` in `.env`.
- The app falls back to local demo data when Firebase has not been configured.

### To Run:
- `npm start` - should pull up page on your default browser.
