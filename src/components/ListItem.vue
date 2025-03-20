<script setup lang="ts">
interface Props {
  isChecked: boolean;
}
defineProps<Props>();

import TrashIcon from './icons/TrashIcon.vue';
import EditIcon from './icons/EditIcon.vue';

const emit = defineEmits(['check', 'delete', 'update']);

const handleCheck = () => {
  emit('check');
};
</script>

<template>
  <div class="list_item">
    <div :class="{ checked: isChecked }">
      <input type="checkbox" class="checkbox" @change="handleCheck" :checked="isChecked" />
      <slot />
    </div>

    <div>
      <EditIcon class="edit_icon" />
      <TrashIcon class="trash_icon" />
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
