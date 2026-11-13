import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION_NAME = 'players';

// Nota = média aritmética dos atributos dividida por 10 (escala 0 a 10)
export function calculateRating(stats = {}) {
  const values = [stats.pace, stats.passing, stats.shooting, stats.physical].map(
    (v) => Number(v) || 0
  );
  const average = values.reduce((acc, v) => acc + v, 0) / values.length;
  return Number((average / 10).toFixed(1));
}

// Garante que a nota exibida sempre reflita os atributos atuais
const withRating = (player) => ({ ...player, rating: calculateRating(player.stats) });

const INITIAL_PLAYERS = [
  {
    name: 'Lucas Silva',
    number: 10,
    position: 'Meio-Campo',
    age: 22,
    foot: 'Destro',
    photoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400',
    stats: { pace: 82, passing: 88, shooting: 79, physical: 74 },
    rating: 8.5,
    matches: 12,
    goals: 6,
    assists: 8,
  },
  {
    name: 'Gabriel Santos',
    number: 9,
    position: 'Atacante',
    age: 24,
    foot: 'Destro',
    photoUrl: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?w=400',
    stats: { pace: 89, passing: 72, shooting: 88, physical: 80 },
    rating: 8.8,
    matches: 14,
    goals: 11,
    assists: 3,
  },
  {
    name: 'Rodrigo Costa',
    number: 4,
    position: 'Defensor',
    age: 26,
    foot: 'Canhoto',
    photoUrl: 'https://images.unsplash.com/photo-1570498839593-e565b3d4f6fa?w=400',
    stats: { pace: 75, passing: 74, shooting: 55, physical: 86 },
    rating: 7.9,
    matches: 15,
    goals: 1,
    assists: 1,
  },
  {
    name: 'Matheus Oliveira',
    number: 1,
    position: 'Goleiro',
    age: 25,
    foot: 'Destro',
    photoUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400',
    stats: { pace: 65, passing: 68, shooting: 40, physical: 84 },
    rating: 8.2,
    matches: 15,
    goals: 0,
    assists: 0,
  }
];

export async function getPlayers() {
  try {
    const q = query(collection(db, COLLECTION_NAME));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      await seedInitialData();
      return INITIAL_PLAYERS.map((p, idx) => withRating({ id: `init_${idx}`, ...p }));
    }

    const players = [];
    snapshot.forEach(docSnap => {
      players.push(withRating({ id: docSnap.id, ...docSnap.data() }));
    });
    return players;
  } catch (error) {
    console.log('Erro ao buscar jogadores:', error);
    return INITIAL_PLAYERS.map((p, idx) => withRating({ id: `local_${idx}`, ...p }));
  }
}

export async function getPlayerById(id) {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return withRating({ id: docSnap.id, ...docSnap.data() });
    }
    const found = INITIAL_PLAYERS.find((_, idx) => `init_${idx}` === id || `local_${idx}` === id);
    return found ? withRating({ id, ...found }) : null;
  } catch (error) {
    console.log('Erro ao buscar jogador:', error);
    const found = INITIAL_PLAYERS.find((_, idx) => `init_${idx}` === id || `local_${idx}` === id);
    return found ? withRating({ id, ...found }) : null;
  }
}

export async function addPlayer(playerData) {
  const newPlayer = {
    ...playerData,
    number: Number(playerData.number) || 0,
    age: Number(playerData.age) || 20,
    matches: 0,
    goals: 0,
    assists: 0,
    photoUrl: playerData.photoUrl || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400',
    stats: {
      pace: Number(playerData.pace) || 70,
      passing: Number(playerData.passing) || 70,
      shooting: Number(playerData.shooting) || 70,
      physical: Number(playerData.physical) || 70,
    },
    createdAt: new Date().toISOString(),
  };
  newPlayer.rating = calculateRating(newPlayer.stats);

  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), newPlayer);
    return { id: docRef.id, ...newPlayer };
  } catch (error) {
    console.log('Erro ao adicionar jogador no Firestore:', error);
    return { id: `local_${Date.now()}`, ...newPlayer };
  }
}

export async function updatePlayer(id, updatedFields) {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const fields = updatedFields.stats
      ? { ...updatedFields, rating: calculateRating(updatedFields.stats) }
      : updatedFields;
    await updateDoc(docRef, fields);
    return true;
  } catch (error) {
    console.log('Erro ao atualizar jogador:', error);
    return false;
  }
}

export async function deletePlayer(id) {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.log('Erro ao excluir jogador:', error);
    return false;
  }
}

export async function registerMatchScout(playerId, matchData) {
  try {
    const player = await getPlayerById(playerId);
    if (!player) return false;

    const newMatches = (player.matches || 0) + 1;
    const newGoals = (player.goals || 0) + (Number(matchData.goals) || 0);
    const newAssists = (player.assists || 0) + (Number(matchData.assists) || 0);

    const updated = {
      matches: newMatches,
      goals: newGoals,
      assists: newAssists,
    };

    await updatePlayer(playerId, updated);
    return true;
  } catch (error) {
    console.log('Erro ao registrar scout de partida:', error);
    return false;
  }
}

async function seedInitialData() {
  try {
    for (const player of INITIAL_PLAYERS) {
      await addDoc(collection(db, COLLECTION_NAME), {
        ...player,
        createdAt: new Date().toISOString(),
      });
    }
  } catch (err) {
    console.log('Seed não pôde ser salvo no Firestore remoto:', err.message);
  }
}
