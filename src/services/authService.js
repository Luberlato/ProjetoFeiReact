import { 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from './firebase';

const USERS_COLLECTION = 'users';

export async function loginUser(email, password) {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const q = query(
      collection(db, USERS_COLLECTION),
      where('email', '==', cleanEmail)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return { success: false, message: 'Usuário não encontrado. Cadastre-se primeiro!' };
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    if (userData.password !== password) {
      return { success: false, message: 'Senha incorreta.' };
    }

    return { 
      success: true, 
      user: { id: userDoc.id, email: userData.email, name: userData.name || '' } 
    };
  } catch (error) {
    console.log('Erro ao fazer login:', error);
    return { success: false, message: 'Erro ao conectar ao banco de dados.' };
  }
}

export async function registerUser(email, password) {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const q = query(
      collection(db, USERS_COLLECTION),
      where('email', '==', cleanEmail)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return { success: false, message: 'Este e-mail já está cadastrado.' };
    }

    const docRef = await addDoc(collection(db, USERS_COLLECTION), {
      email: cleanEmail,
      password: password,
      role: 'treinador',
      createdAt: new Date().toISOString(),
    });

    return { 
      success: true, 
      user: { id: docRef.id, email: cleanEmail } 
    };
  } catch (error) {
    console.log('Erro ao registrar usuário:', error);
    return { success: false, message: 'Erro ao cadastrar usuário no banco.' };
  }
}

export async function logoutUser() {
  return { success: true };
}
