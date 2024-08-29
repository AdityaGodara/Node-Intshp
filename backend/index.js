import { initializeApp } from "firebase/app";
import { getFirestore, collection, Timestamp, doc, setDoc, getDocs, getDoc, updateDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
import express from 'express';
import cors from 'cors';
import config from "./config.js";

const eapp = express();

eapp.use(cors());
eapp.use(express.json());

const firebaseConfig = config;

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

eapp.post('/users/register', async (req, res) => {
  try {
    const { id, name, email, age, weight, height, healthGoals } = req.body;
    const createdAt = Timestamp.now();
    
    await setDoc(doc(db, 'users', id), {
      id,
      name,
      email,
      age,
      weight,
      height,
      healthGoals,
      createdAt
    });
    
    res.status(201).send({ message: 'User profile created', id });
    console.log("User added with ID: ", id);
  } catch (error) {
    console.error("Error adding user: ", error);
    res.status(500).send({ message: 'Error creating user', error: error.message });
  }
});

eapp.get('/users', async (req, res) => {
    try {
      const usersCol = collection(db, 'users');
      const querySnapshot = await getDocs(usersCol);
      const users = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
  
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users: ", error);
      res.status(500).json({ message: error.message });
    }
  });

  eapp.get('/users/:id', async (req, res) => {
    try {
      const userRef = doc(db, 'users', req.params.id);
      const userDoc = await getDoc(userRef);
  
      if (!userDoc.exists()) {
        res.status(404).json({ message: 'User not found' });
      } else {
        res.status(200).json({ id: userDoc.id, ...userDoc.data() });
      }
    } catch (error) {
      console.error("Error fetching user: ", error);
      res.status(500).json({ message: error.message });
    }
  });
  

  eapp.put('/users/edit/:id', async (req, res) => {
    try {
      const { name, email, age, weight, height, healthGoals } = req.body;
      
      const userRef = doc(db, 'users', req.params.id);
      await updateDoc(userRef, {
        name,
        email,
        age,
        weight,
        height,
        healthGoals,
        updatedAt: serverTimestamp()
      });
  
      res.status(200).json({ message: 'User profile updated' });
    } catch (error) {
      console.error("Error updating user: ", error);
      res.status(500).json({ message: error.message });
    }
  });

  eapp.delete('/users/:id', async (req, res) => {
    try {
      const userRef = doc(db, 'users', req.params.id);
      await deleteDoc(userRef);
  
      res.status(200).send({ message: 'User profile deleted' });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

const PORT = 5000;
eapp.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});