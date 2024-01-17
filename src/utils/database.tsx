import { WordData } from 'constants/wordsData';
import { wordsdb } from '../firebase';
import { CollectionReference, DocumentData, QueryFieldFilterConstraint, collection, documentId, getDocs, limit, query, where } from 'firebase/firestore';

const wordsCollection = collection(wordsdb, 'words');
const sentencesCollection = collection(wordsdb, 'sentences');

const getDataById = async (
  id: string,
  collectionRef: CollectionReference<DocumentData, DocumentData>,
  key?: string | null,
  limitVal?: number,
  miniWord?: boolean,
) => {
  const fieldPath = key ? key : documentId();
  const queryRef = limitVal ?
    query(collectionRef, where(fieldPath, '==', id), limit(limitVal)) :
    query(collectionRef, where(fieldPath, '==', id));
  const querySnapshot = await getDocs(queryRef);

  if (limitVal && limitVal > 1) {
    return querySnapshot.docs.map((doc) => doc.data());
  } else {
    if (miniWord) {
      const { word, translation } = querySnapshot.docs[0].data();
    
      return {
        id,
        word,
        translation,
      };
    }
    return querySnapshot.docs[0].data();
  }
};

// Function to generate a random alphanumeric ID
const generateRandomId = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomId = '';

  for (let i = 0; i < 20; i++) {
    randomId += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return randomId;
};

const getRandomData = async (
  collectionRef: CollectionReference<DocumentData, DocumentData>,
  conditions: QueryFieldFilterConstraint[],
  key?: string | null,
  limitVal?: number,
) => {
  const randomId = generateRandomId();
  const fieldPath = key ? key : documentId();
  const queryRef = limitVal ?
    query(collectionRef, where(fieldPath, '>=', randomId), ...conditions, limit(limitVal)) :
    query(collectionRef, where(fieldPath, '>=', randomId), ...conditions);
  const querySnapshot = await getDocs(queryRef);

  if (!querySnapshot.empty) {
    if (limitVal && limitVal > 1) {
      return querySnapshot.docs.map((doc) => doc.data());
    } else {
      return {
        ...querySnapshot.docs[0].data(),
        id: querySnapshot.docs[0].id,
      };
    }
  } else {
    return null;
  }
};

const getSemanticsByIds = async (synonymsIds: string[], antonymsIds: string[]) => {
  const synonymsPromises: any = (synonymsIds || []).map((synonym) => getDataById(synonym.toString(), wordsCollection, null, 1, true));
  const antonymsPromises: any = (antonymsIds || []).map((antonym) => getDataById(antonym.toString(), wordsCollection, null, 1, true));

  const [synonyms, antonyms] = await Promise.all([Promise.all(synonymsPromises), Promise.all(antonymsPromises)]);

  return {
    synonyms,
    antonyms,
  };
};

const getWordById = async (wordId: string, needExtras = false) => {
  const wordData = await getDataById(wordId, wordsCollection) as WordData;

  if (wordData) {
    if (needExtras) {
      const sentences = await getDataById(wordId, sentencesCollection, 'word_id', 3);
      const { synonyms, antonyms } = await getSemanticsByIds(
        wordData.synonyms as string[],
        wordData.antonyms as string[],
      );

      return {
        ...wordData,
        id: wordId,
        sentences,
        synonyms,
        antonyms,
      } as WordData;
    } else {
      return {
        ...wordData,
        id: wordId,
      } as WordData;
    }
  } else {
    console.log('No such document!');
    return null;
  }
};

const getRandomWord: () => Promise<WordData> = async () => {
  // get random word from wordsCollection from firestore
  const wordData = await getRandomData(wordsCollection, [where('status', '==', 'active')], null, 1) as WordData;

  if (wordData) {
    const wordId = wordData.id;
    if (wordId) {
      const sentences = await getDataById(wordId, sentencesCollection, 'word_id', 3);
      const { synonyms, antonyms } = await getSemanticsByIds(
        wordData.synonyms as string[], 
        wordData.antonyms as string[],
      );
  
      return {
        ...wordData,
        id: wordId,
        sentences,
        synonyms,
        antonyms,
      } as WordData;
    }
    return {};
  } else {
    console.log('No such document!');
    return {};
  }
};

export {
  wordsCollection,
  sentencesCollection,
  getDataById,
  getRandomData,
  getSemanticsByIds,
  getWordById,
  getRandomWord,
};