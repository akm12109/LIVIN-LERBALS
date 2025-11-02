
'use client';
import {
  collection,
  onSnapshot,
  query,
  where,
  type DocumentData,
  type Query,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useFirestore } from '../provider';

export function useCollection<T>(path: string): { data: T[]; loading: boolean };
export function useCollection<T>(q: Query<DocumentData> | null): {
  data: T[] | null;
  loading: boolean;
};

export function useCollection<T>(
  pathOrQuery: string | Query<DocumentData> | null
) {
  const firestore = useFirestore();
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firestore || !pathOrQuery) {
        setLoading(false);
        return;
    }

    let unsubscribe = () => {};
    setLoading(true);

    try {
        const queryObj =
        typeof pathOrQuery === 'string'
            ? query(collection(firestore, pathOrQuery))
            : pathOrQuery;
        
        unsubscribe = onSnapshot(queryObj, (querySnapshot) => {
            const data: T[] = [];
            querySnapshot.forEach((doc) => {
                data.push({ id: doc.id, ...doc.data() } as T);
            });
            setData(data);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching collection: ", error);
            setLoading(false);
            setData(null);
        });

    } catch (error) {
      console.error("Error setting up collection listener:", error);
      setLoading(false);
    }
    
    return () => unsubscribe();
  }, [firestore, pathOrQuery]);

  return { data, loading };
}
