// This file is a temporary workaround to break a circular dependency between
// the AI-generated code and the Firebase SDK.
//
// You can import the Firebase services from this file to use them in your code.
//
// For example:
//
// import { firestore } from '@/firebase/client-side-exports';
//
// This file will be removed in a future update.

import { initializeFirebase } from ".";

const { firestore, auth } = initializeFirebase();

export { firestore, auth };
