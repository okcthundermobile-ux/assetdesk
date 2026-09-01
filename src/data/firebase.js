import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore, collection, doc, getDocs, getDoc, setDoc, addDoc, updateDoc, deleteDoc} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { PARTNERS, KPI, GAMES } from './mockData';

const requiredEnvKeys = [
  'REACT_APP_API_KEY',
  'REACT_APP_AUTH_DOMAIN',
  'REACT_APP_PROJECT_ID',
  'REACT_APP_STORAGE_BUCKET',
  'REACT_APP_MESSAGING_SENDER_ID',
  'REACT_APP_APP_ID',
  'REACT_APP_MEASUREMENT_ID',
];

const firebaseConfig = Object.fromEntries(
  requiredEnvKeys.map((key) => [key.replace('REACT_APP_', '').replace(/_([a-z])/g, (_, ch) => ch.toUpperCase()), process.env[key]])
);

const isFirebaseConfigured = requiredEnvKeys.every((key) => Boolean(process.env[key]));

export const firebaseReady = isFirebaseConfigured;

let app = null;
let db = null;
let auth = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);

  // Analytics could be helpful, don't know if we've implemented that yet.
  try { getAnalytics(app); } catch (_) { }

  db = getFirestore(app);
  auth = getAuth(app);
}

export { app, db, auth };

/**
 * Fetches all partners, or a single partner when partnerID is supplied.
 * Returns an array shaped like the existing PARTNERS mock: [{id, name, short, …}]
 * @param {string|null} partnerID
 * @returns {Promise<Array>}
 */
export const getPartners = async (partnerID = null) => {
  if (!db) {
    const partners = [...PARTNERS];
    partners.sort((a, b) => String(a.id).localeCompare(String(b.id)));
    return partnerID ? partners.filter(p => String(p.id) === String(partnerID)) : partners;
  }

  if (partnerID) {
    const snap = await getDoc(doc(db, 'partners', partnerID));
    return snap.exists() ? [snap.data()] : [];
  }
  const snap = await getDocs(collection(db, 'partners'));
  const partners = snap.docs.map(d => d.data());
  partners.sort((a, b) => String(a.id).localeCompare(String(b.id)));
  return partners;
};

/**
 * Fetches KPI data keyed by partner ID.
 * Returns an object shaped like the existing KPI mock: { '900137': {qi, imp, …}, … }
 * @param {string|null} partnerID
 * @returns {Promise<Object>}
 */
export const getKPIs = async (partnerID = null) => {
  if (!db) {
    const result = { ...KPI };
    if (partnerID) {
      return Object.prototype.hasOwnProperty.call(result, String(partnerID)) ? { [partnerID]: result[partnerID] } : {};
    }
    return result;
  }

  if (partnerID) {
    const snap = await getDoc(doc(db, 'kpis', partnerID));
    return snap.exists() ? { [partnerID]: snap.data() } : {};
  }
  const snap = await getDocs(collection(db, 'kpis'));
  const result = {};
  snap.docs.forEach(d => { result[d.id] = d.data(); });
  return result;
};

/**
 * Fetches all games sorted by date.
 * The ps array stores partner indices for backwards-compatibility with existing panels.
 * @returns {Promise<Array>}
 */
export const getGames = async () => {
  if (!db) {
    const games = [...GAMES];
    games.sort((a, b) => a.d.localeCompare(b.d));
    return games;
  }

  const snap = await getDocs(collection(db, 'games'));
  const games = snap.docs.map(d => d.data());
  games.sort((a, b) => a.d.localeCompare(b.d));
  return games;
};

/**
 * Fetches all campaigns, or those belonging to a specific partner.
 * @param {string|null} partnerID
 * @returns {Promise<Array>}
 */
export const getCampaigns = async (partnerID = null) => {
  if (!db) {
    return [];
  }

  const snap = await getDocs(collection(db, 'campaigns'));
  const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return partnerID ? all.filter(c => String(c.Partner_ID) === String(partnerID)) : all;
};

/**
 * Fetches all activations, or those belonging to a specific partner.
 * @param {string|null} partnerID
 * @returns {Promise<Array>}
 */
export const getActivations = async (partnerID = null) => {
  if (!db) {
    return [];
  }

  const snap = await getDocs(collection(db, 'activations'));
  const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return partnerID ? all.filter(a => String(a.Partner_ID) === String(partnerID)) : all;
};

/**
 * Deletes an activation record.
 * @param {string} activationID
 */
export const deleteActivation = async (activationID) => {
  if (!db) return;
  await deleteDoc(doc(db, 'activations', activationID));
};

/**
 * Fetches all locations (lookup table).
 * @returns {Promise<Array>}
 */
export const getLocations = async () => {
 if (!db) {
   return [];
 }

 const snap = await getDocs(collection(db, 'locations'));
 return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

/**
 * Fetches all asset types (lookup table).
 * @returns {Promise<Array>}
 */
export const getAssets = async () => {
 if (!db) {
   return [];
 }

 const snap = await getDocs(collection(db, 'assets'));
 return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

/**
 * Fetches a user's profile document from the 'users' collection.
 * @param {string} uid  Firebase Auth UID
 * @returns {Promise<Object|null>}
 */
export const getUserProfile = async (uid) => {
  if (!db) {
    return {
      name: 'Demo User',
      email: 'demo@thunder.local',
      role: 'Corporate Partnerships',
      permissions: 'View',
      partnerID: null,
      uid,
    };
  }

  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
};

/**
 * Creates (or overwrites) a user profile document.
 * Called automatically after sign-up.
 * @param {string} uid
 * @param {{ name, email, role, permissions, partnerID }} data
 */
export const createUserProfile = async (uid, data) => {
  if (!db) {
    return;
  }

  await setDoc(doc(db, 'users', uid), data);
};

/**
 * Adds or replaces a partner document. Uses the partner's id as the doc ID.
 * @param {Object} partner  Must include an `id` field
 */
export const addPartner = async (partner) => {
  await setDoc(doc(db, 'partners', String(partner.id)), partner);
};

/**
 * Merges updates into an existing partner document.
 * @param {string} partnerID
 * @param {Object} updates
 */
export const updatePartner = async (partnerID, updates) => {
  await updateDoc(doc(db, 'partners', String(partnerID)), updates);
};

/**
 * Deletes a partner document.
 * @param {string} partnerID
 */
export const deletePartner = async (partnerID) => {
  await deleteDoc(doc(db, 'partners', String(partnerID)));
};

/**
 * Adds or replaces a KPI document. Uses the partner's id as the doc ID.
 * @param {string} partnerID
 * @param {Object} kpiData
 */
export const addKPI = async (partnerID, kpiData) => {
  await setDoc(doc(db, 'kpis', String(partnerID)), kpiData);
};

/**
 * Merges updates into an existing KPI document.
 * @param {string} partnerID
 * @param {Object} updates
 */
export const updateKPI = async (partnerID, updates) => {
  await updateDoc(doc(db, 'kpis', String(partnerID)), updates);
};

/**
 * Adds or replaces a game document. Uses the game date as the doc ID.
 * @param {Object} game  Must include a `d` (date string YYYY-MM-DD) field
 */
export const addGame = async (game) => {
  await setDoc(doc(db, 'games', game.d), game);
};

/**
 * Merges updates into an existing game document.
 * @param {string} gameDate  YYYY-MM-DD
 * @param {Object} updates
 */
export const updateGame = async (gameDate, updates) => {
  await updateDoc(doc(db, 'games', gameDate), updates);
};

/**
 * Deletes a game document.
 * @param {string} gameDate  YYYY-MM-DD
 */
export const deleteGame = async (gameDate) => {
  await deleteDoc(doc(db, 'games', gameDate));
};

/**
 * Adds a new campaign and returns the auto-generated document ID.
 * @param {Object} campaign
 * @returns {Promise<string>} New document ID
 */
export const addCampaign = async (campaign) => {
  const ref = await addDoc(collection(db, 'campaigns'), campaign);
  return ref.id;
};

/**
 * Merges updates into an existing campaign document.
 * @param {string} campaignID
 * @param {Object} updates
 */
export const updateCampaign = async (campaignID, updates) => {
  await updateDoc(doc(db, 'campaigns', campaignID), updates);
};

/**
 * Adds a new activation record and returns the auto-generated document ID.
 * @param {Object} activation
 * @returns {Promise<string>} New document ID
 */
export const addActivation = async (activation) => {
  const ref = await addDoc(collection(db, 'activations'), activation);
  return ref.id;
};

/**
 * Merges updates into an existing activation document.
 * @param {string} activationID
 * @param {Object} updates
 */
export const updateActivation = async (activationID, updates) => {
  await updateDoc(doc(db, 'activations', activationID), updates);
};

/**
 * Adds a new location document.
 * @param {Object} location
 * @returns {Promise<string>} New document ID
 */
export const addLocation = async (location) => {
  const ref = await addDoc(collection(db, 'locations'), location);
  return ref.id;
};

/**
 * Adds a new asset type document.
 * @param {Object} asset
 * @returns {Promise<string>} New document ID
 */
export const addAsset = async (asset) => {
  const ref = await addDoc(collection(db, 'assets'), asset);
  return ref.id;
};

/**
 * Seeds the Firestore database with mock data for partners, KPIs, and games.
 * Can be run without creating duplicates via setDoc
 */
export const seedDatabase = async () => {
  console.group('Thunder Innovations Seeding Firestore');

  // Partners
  for (const partner of PARTNERS) {
    await setDoc(doc(db, 'partners', String(partner.id)), partner);
  }
  console.log(`Partners seeded (${PARTNERS.length} docs)`);

  // KPIs
  for (const [partnerID, kpiData] of Object.entries(KPI)) {
    await setDoc(doc(db, 'kpis', String(partnerID)), kpiData);
  }
  console.log(`KPIs seeded (${Object.keys(KPI).length} docs)`);

  // Games
  for (const game of GAMES) {
    await setDoc(doc(db, 'games', game.d), game);
  }
  console.log(`Games seeded (${GAMES.length} docs)`);

  console.log('Seeding complete!');
  console.groupEnd();
};

// seedDatabase for browser console access
if (process.env.NODE_ENV === 'development') {
  window.seedDatabase = seedDatabase;
}
