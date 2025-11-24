import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { Trip } from '../types';

// --- KONFIGURASI FIREBASE ---
// SILAKAN TEMPEL (PASTE) CONFIG DARI FIREBASE CONSOLE DI SINI
// Ganti nilai string di bawah ini dengan nilai asli dari akun Firebase kamu
const firebaseConfig = {
  apiKey: "AIzaSyDsCxE3ahY0UG_c4zuJQ8okBcXye7ZI8cc",
  authDomain: "rekap-perjadin.firebaseapp.com",
  projectId: "rekap-perjadin",
  storageBucket: "rekap-perjadin.firebasestorage.app",
  messagingSenderId: "954485745110",
  appId: "1:954485745110:web:e73e72d50960fef0637077"
};

let db: any = null;
let auth: any = null;
let tripsCollectionRef: any = null;

export const initializeFirebase = async (): Promise<string | null> => {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    
    // Menggunakan nama koleksi sederhana untuk database sendiri
    tripsCollectionRef = collection(db, 'perjalanan_dinas');

    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
        if (user) {
          unsubscribe();
          resolve(user.uid);
        } else {
          try {
            // Login Anonim (Pastikan Authentication > Anonymous aktif di Firebase Console)
            await signInAnonymously(auth);
          } catch (err) {
            console.error("Auth failed", err);
            unsubscribe();
            resolve(null);
          }
        }
      });
    });
  } catch (e) {
    console.error('Firebase init error:', e);
    return null;
  }
};

export const subscribeToTrips = (callback: (trips: Trip[]) => void) => {
  if (!db || !tripsCollectionRef) return () => {};

  // Query standar (tanpa index khusus dulu agar tidak error di awal)
  const q = query(tripsCollectionRef); 

  return onSnapshot(q, (snapshot: any) => {
    const trips: Trip[] = [];
    snapshot.forEach((doc: any) => {
      trips.push({ id: doc.id, ...doc.data() } as Trip);
    });
    // Client-side sort untuk memastikan urutan tanggal (Terbaru di atas)
    trips.sort((a, b) => new Date(b.tanggalMulai).getTime() - new Date(a.tanggalMulai).getTime());
    callback(trips);
  });
};

export const addTrip = async (trip: Omit<Trip, 'id'>) => {
  if (!db || !tripsCollectionRef) throw new Error("Database not initialized");
  await addDoc(tripsCollectionRef, trip);
};

export const deleteTrip = async (id: string) => {
  if (!db || !tripsCollectionRef) throw new Error("Database not initialized");
  await deleteDoc(doc(tripsCollectionRef, id));
};