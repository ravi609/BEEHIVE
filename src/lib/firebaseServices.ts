import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  Timestamp,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase";

// Types
export interface BlogPost {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  tags?: string[];
  author: string;
  date: string;
  readTime: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface TeamMember {
  id?: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  order?: number;
  social: {
    linkedin?: string;
    twitter?: string;
    dribbble?: string;
  };
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface JobListing {
  id?: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Showreel {
  id?: string;
  title: string;
  category: string;
  video: string;
  poster: string;
  order?: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Category service for autocomplete
export const categoryService = {
  async getAll(): Promise<string[]> {
    const snapshot = await getDocs(collection(db, "categories"));
    return snapshot.docs.map(doc => doc.data().name as string);
  },
  
  async add(name: string): Promise<void> {
    const q = query(collection(db, "categories"));
    const snapshot = await getDocs(q);
    const existing = snapshot.docs.find(doc => doc.data().name === name);
    if (!existing) {
      await addDoc(collection(db, "categories"), { name, createdAt: serverTimestamp() });
    }
  }
};

// Blog Services
export const blogService = {
  async getAll(): Promise<BlogPost[]> {
    const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
  },
  
  async getById(id: string): Promise<BlogPost | null> {
    const docRef = doc(db, "blogs", id);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } as BlogPost : null;
  },
  
  async create(data: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, "blogs"), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  },
  
  async update(id: string, data: Partial<BlogPost>): Promise<void> {
    const docRef = doc(db, "blogs", id);
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
  },
  
  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, "blogs", id));
  }
};

// Team Services
export const teamService = {
  async getAll(): Promise<TeamMember[]> {
    const q = query(collection(db, "team"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeamMember));
  },
  
  async getById(id: string): Promise<TeamMember | null> {
    const docRef = doc(db, "team", id);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } as TeamMember : null;
  },
  
  async create(data: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, "team"), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  },
  
  async update(id: string, data: Partial<TeamMember>): Promise<void> {
    const docRef = doc(db, "team", id);
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
  },
  
  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, "team", id));
  }
};

// Jobs Services
export const jobService = {
  async getAll(): Promise<JobListing[]> {
    const q = query(collection(db, "jobs"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JobListing));
  },
  
  async getById(id: string): Promise<JobListing | null> {
    const docRef = doc(db, "jobs", id);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } as JobListing : null;
  },
  
  async create(data: Omit<JobListing, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, "jobs"), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  },
  
  async update(id: string, data: Partial<JobListing>): Promise<void> {
    const docRef = doc(db, "jobs", id);
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
  },
  
  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, "jobs", id));
  }
};

// Showreel Services
export const showreelService = {
  async getAll(): Promise<Showreel[]> {
    const q = query(collection(db, "showreels"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Showreel));
  },
  
  async getById(id: string): Promise<Showreel | null> {
    const docRef = doc(db, "showreels", id);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } as Showreel : null;
  },
  
  async create(data: Omit<Showreel, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, "showreels"), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  },
  
  async update(id: string, data: Partial<Showreel>): Promise<void> {
    const docRef = doc(db, "showreels", id);
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
  },
  
  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, "showreels", id));
  }
};
