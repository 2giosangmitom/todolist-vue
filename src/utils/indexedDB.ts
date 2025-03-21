export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('TodoList');

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains('todos')) {
        const todoStore = db.createObjectStore('todos', { keyPath: 'id' });
        todoStore.createIndex('title', 'title', { unique: false });
        todoStore.createIndex('checked', 'checked', { unique: false });

        const examples = [
          { id: 1, title: 'Learn JavaScript', checked: false },
          { id: 2, title: 'Learn Database', checked: false },
          { id: 3, title: 'Learn DSA', checked: false },
        ];

        examples.forEach((todo) => {
          todoStore.add(todo);
        });

        console.info('Object store and indexes created successfully');
      }
    };

    request.onsuccess = (event: Event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
}
