<script setup lang="ts">
import TrashIcon from './icons/TrashIcon.vue';
import EditIcon from './icons/EditIcon.vue';
import { ref } from 'vue';

interface Props {
  isChecked: boolean;
  title: string;
}
const props = defineProps<Props>();

const emit = defineEmits(['check', 'delete', 'update']);

const newTitle = ref('');
const isEditable = ref(false);

const handleEdit = () => {
  isEditable.value = true;
  newTitle.value = props.title;
};

const handleUpdate = () => {
  emit('update', newTitle.value);
  isEditable.value = false;
};
</script>

<template>
  <div class="list_item">
    <div :class="{ checked: isChecked }">
      <template v-if="isEditable">
        <input type="text" v-model="newTitle" @blur="handleUpdate" @keyup.enter="handleUpdate" autofocus />
      </template>
      <template v-else>
        <input type="checkbox" class="checkbox" @change="emit('check')" :checked="isChecked" />
        {{ title }}
      </template>
    </div>

    <div>
      <EditIcon class="edit_icon" @click="handleEdit" />
      <TrashIcon class="trash_icon" @click="emit('delete')" />
    </div>
  </div>
</template>

<style scoped>
.list_item {
  background-color: #b771e5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.5rem;
  border-radius: 3px;
  font-size: 15px;
}

.trash_icon,
.edit_icon {
  cursor: pointer;
}

.checkbox {
  margin-right: 10px;
}

.checked {
  text-decoration: line-through;
}
</style>
