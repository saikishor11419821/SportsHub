import { auth, db, dbService } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, deleteUser } from 'firebase/auth';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { User } from '../types';

export const authService = {
    async registerPlayer(email: string, pass: string, name: string): Promise<User> {
        const userCred = await createUserWithEmailAndPassword(auth, email, pass);
        const userId = userCred.user.uid;
        // Persist user details to Firestore
        const userData: User = {
            id: userId,
            name,
            email,
            role: 'player',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
        };
        await setDoc(doc(db, 'users', userId), userData);
        return userData;
    },

    async registerOwner(email: string, pass: string, name: string, licenseId: string, mobile: string): Promise<User> {
        const userCred = await createUserWithEmailAndPassword(auth, email, pass);
        const userId = userCred.user.uid;
        const userData: User = {
            id: userId,
            name,
            email,
            mobile,
            licenseId,
            role: 'owner',
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`
        };
        await setDoc(doc(db, 'users', userId), userData);
        return userData;
    },

    async login(email: string, pass: string): Promise<User> {
        const userCred = await signInWithEmailAndPassword(auth, email, pass);
        const userId = userCred.user.uid;
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data() as User;
        } else {
            // Fallback if data is missing, though register should handle it
            throw new Error("User profile not found. Please contact support.");
        }
    },

    async logout() {
        await signOut(auth);
    },

    async deleteAccount(userId: string) {
        const user = auth.currentUser;
        if (user) {
            // Check user role before deleting
            const userDocRef = doc(db, 'users', userId);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data() as User;
                if (userData.role === 'owner') {
                    // Delete all turfs owned by this user
                    await dbService.deleteTurfsByOwner(userId);
                }
            }

            // Delete from Firestore
            await deleteDoc(userDocRef);
            // Delete from Auth
            await deleteUser(user);
        }
    }
};
