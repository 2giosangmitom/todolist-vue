<script setup lang="ts">
import { onBeforeMount, ref, type Ref } from 'vue';
import ListItem from './ListItem.vue';

type Todo = {
  id: number;
  title: string;
  checked: boolean;
};

const dbOk = ref(false);
const todoList: Ref<Todo[]> = ref([]);

// Update the check state of a Todo
const handleCheck = (item: Todo) => {
  item.checked = !item.checked;

  const request = indexedDB.open('TodoList');

  request.onsuccess = (event) => {
    const db = (event.target as IDBOpenDBRequest).result;
    const transaction = db.transaction('todos', 'readwrite');

    const todoStore = transaction.objectStore('todos');

    const update = todoStore.put({ ...item });

    update.onsuccess = () => {
      console.log('Todo item updated successfully');
    };

    update.onerror = () => {
      console.error('Error updating todo item');
    };
  };
};

// Update the content of a todo
const handleUpdate = (item: Todo, newTitle: string) => {
  item.title = newTitle;

  const request = indexedDB.open('TodoList');

  request.onsuccess = (event) => {
    const db = (event.target as IDBOpenDBRequest).result;
    const transaction = db.transaction('todos', 'readwrite');

    const todoStore = transaction.objectStore('todos');

    const update = todoStore.put({ ...item });

    update.onsuccess = () => {
      console.log('Todo item updated successfully');
    };

    update.onerror = () => {
      console.error('Error updating todo item');
    };
  };
};

onBeforeMount(() => {
  const request = indexedDB.open('TodoList');

  request.onsuccess = (event: Event) => {
    dbOk.value = true;

    const target = event.target as IDBOpenDBRequest;
    const db = target.result;
    const transaction = db.transaction('todos', 'readonly');

    const todoStore = transaction.objectStore('todos');

    const getAllReq = todoStore.getAll();
    getAllReq.onsuccess = (e) => {
      todoList.value = (e.target as IDBRequest).result;
    };
  };

  request.onupgradeneeded = (event: Event) => {
    const target = event.target as IDBOpenDBRequest;
    const db = target.result;

    if (!db.objectStoreNames.contains('todos')) {
      const todoStore = db.createObjectStore('todos', { keyPath: 'id' });

      todoStore.createIndex('title', 'title', { unique: false });
      todoStore.createIndex('checked', 'checked', { unique: false });

      const examples: Todo[] = [
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

  request.onerror = (event: Event) => {
    console.error('Database error:', (event.target as IDBOpenDBRequest).error);
  };
});
</script>

<template>
  <div class="todo_container">
    <h2>Get Things Done!</h2>
    <div v-if="dbOk">
      <div class="add_task_input">
        <input type="text" placeholder="What is the task today?" />
        <button>Add Task</button>
      </div>

      <ul class="todo_list">
        <li v-for="item in todoList" :key="item.id">
          <ListItem
            :is-checked="item.checked"
            :title="item.title"
            @check="handleCheck(item)"
            @update="handleUpdate(item, $event)"
          />
        </li>
      </ul>
    </div>
    <div v-else class="error_message">
      <p>An error was occurred when opening the IndexedDB!</p>
    </div>
  </div>
</template>

<style scoped>
.todo_container {
  background-color: #3d0301;
  padding: 2rem;
  width: 500px;
  margin: auto;
  margin-top: 20px;
}

.todo_container > h2 {
  color: #ffedfa;
  text-align: center;
}

.add_task_input {
  margin-top: 30px;
  display: flex;
}

.add_task_input input {
  padding: 0.5rem;
  border: 3px solid #ffb8e0;
  width: 100%;
}

.add_task_input input:focus {
  outline: 1px dashed #98d2c0;
}

.add_task_input input::placeholder {
  font-size: 14px;
  color: #9f8383;
}

.add_task_input button {
  width: 80px;
  border: none;
  color: #3d0301;
  background-color: #ffb8e0;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
}

.todo_list {
  list-style: none;
}

.todo_list li {
  margin-top: 10px;
}

.error_message {
  color: #bf3131;
  text-align: center;
  margin-top: 10px;
  font-size: 20px;
}
</style>
