<script setup lang="ts">
import { onBeforeMount, ref, type Ref } from 'vue';
import ListItem from './ListItem.vue';
import { openDB } from '@/utils/indexedDB';

type Todo = {
  id: number;
  title: string;
  checked: boolean;
};

const dbOk = ref(false);
const todoList: Ref<Todo[]> = ref([]);
const newTaskTitle = ref('');

const updateTodoInDB = async (item: Todo) => {
  try {
    const db = await openDB();
    if (db) {
      const transaction = db.transaction('todos', 'readwrite');
      const todoStore = transaction.objectStore('todos');

      await new Promise<void>((resolve, reject) => {
        const updateReq = todoStore.put({ ...item });
        updateReq.onsuccess = () => {
          console.log('Todo item updated successfully');
          resolve();
        };
        updateReq.onerror = () => {
          console.error('Error updating todo item');
          reject(updateReq.error);
        };
      });
    }
  } catch (error) {
    console.error('Database error:', error);
  }
};

// Update the check state of a Todo
const handleCheck = async (item: Todo) => {
  item.checked = !item.checked;
  await updateTodoInDB(item);
};

// Update the content of a todo
const handleUpdate = async (item: Todo, newTitle: string) => {
  item.title = newTitle;
  await updateTodoInDB(item);
};

// Delete a task
const handleDelete = async (item: Todo) => {
  try {
    const db = await openDB();
    if (db) {
      const transaction = db.transaction('todos', 'readwrite');
      const todoStore = transaction.objectStore('todos');

      await new Promise<void>((resolve, reject) => {
        const deleteReq = todoStore.delete(item.id);
        deleteReq.onsuccess = () => {
          todoList.value = todoList.value.filter((v) => v.id !== item.id);
          console.log('Todo item deleted successfully');
          resolve();
        };
        deleteReq.onerror = () => {
          console.error('Error deleting todo item');
          reject(deleteReq.error);
        };
      });
    }
  } catch (error) {
    console.error('Database error:', error);
  }
};

// Handle add new task
const handleAddTask = async () => {
  try {
    const db = await openDB();
    if (db) {
      const transaction = db.transaction('todos', 'readwrite');
      const todoStore = transaction.objectStore('todos');

      const genId = (): number => {
        let max = 1;
        todoList.value.forEach((item) => {
          if (max < item.id) {
            max = item.id;
          }
        });
        return max + 1;
      };

      const newItem: Todo = { id: genId(), title: newTaskTitle.value, checked: false };

      await new Promise<void>((resolve, reject) => {
        const addReq = todoStore.add(newItem);
        addReq.onsuccess = () => {
          todoList.value.push(newItem);
          newTaskTitle.value = '';
          console.log('Todo item added successfully');
          resolve();
        };
        addReq.onerror = () => {
          console.error('Error adding todo item');
          reject(addReq.error);
        };
      });
    }
  } catch (error) {
    console.error('Database error:', error);
  }
};

onBeforeMount(async () => {
  try {
    const db = await openDB();

    if (db !== undefined) {
      dbOk.value = true;
      const transaction = db?.transaction('todos', 'readonly');
      const todoStore = transaction.objectStore('todos');

      const getAllReq = todoStore.getAll();
      getAllReq.onsuccess = (e) => {
        todoList.value = (e.target as IDBRequest).result;
      };
    }
  } catch (e) {
    console.error(e);
  }
});
</script>

<template>
  <div class="todo_container">
    <h2>Get Things Done!</h2>
    <div v-if="dbOk">
      <div class="add_task_input">
        <input type="text" placeholder="What is the task today?" v-model="newTaskTitle" @keyup.enter="handleAddTask" />
        <button @click="handleAddTask">Add Task</button>
      </div>

      <template v-if="todoList.length != 0">
        <ul class="todo_list">
          <li v-for="item in todoList" :key="item.id">
            <ListItem
              :is-checked="item.checked"
              :title="item.title"
              @check="handleCheck(item)"
              @update="handleUpdate(item, $event)"
              @delete="handleDelete(item)"
            />
          </li>
        </ul>
      </template>
      <template v-else>
        <p class="no_tasks_message">No tasks there! Yay!</p>
      </template>
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

.no_tasks_message {
  margin-top: 20px;
  color: #98d2c0;
  font-size: 1.5rem;
  text-align: center;
}
</style>
