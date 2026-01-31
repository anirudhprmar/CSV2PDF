/**
 * CSV File Storage using IndexedDB
 * Stores uploaded CSV files temporarily for preview navigation
 */

const DB_NAME = "csv_viewer_db";
const STORE_NAME = "uploaded_files";
const FILE_KEY = "current_csv";

interface StoredFile {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  content: string;
}

/**
 * Initialize IndexedDB
 */
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

/**
 * Save uploaded CSV file to IndexedDB
 */
export async function saveUploadedFile(file: File): Promise<void> {
  const content = await file.text();
  
  const storedFile: StoredFile = {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
    content,
  };

  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(storedFile, FILE_KEY);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
    
    transaction.oncomplete = () => db.close();
  });
}

/**
 * Retrieve the uploaded CSV file from IndexedDB
 */
export async function getUploadedFile(): Promise<File | null> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(FILE_KEY);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const storedFile = request.result as StoredFile | undefined;
      
      if (!storedFile) {
        resolve(null);
      } else {
        // Reconstruct File object from stored data
        const blob = new Blob([storedFile.content], { type: storedFile.type });
        const file = new File([blob], storedFile.name, {
          type: storedFile.type,
          lastModified: storedFile.lastModified,
        });
        resolve(file);
      }
    };

    transaction.oncomplete = () => db.close();
  });
}

/**
 * Clear the uploaded file from IndexedDB
 */
export async function clearUploadedFile(): Promise<void> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(FILE_KEY);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
    
    transaction.oncomplete = () => db.close();
  });
}
