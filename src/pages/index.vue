<script lang="ts" setup>
const { todos, addTodo, toggleTodo, deleteTodo } = useTodos()
const newTodo = ref('')
</script>

<template>
  <div>
    <input
      v-model="newTodo" class="new-todo" autofocus autocomplete="off" placeholder="What needs to be done?"
      @keyup.enter="() => addTodo(newTodo)"
    >
    <ul class="todo-list">
      <li v-for="todo in todos" :key="todo.get('id')" class="todo">
        <div class="view">
          <label>
            <Todo :todo="todo" />
          </label>
          <button class="destroy" @click="() => deleteTodo(todo.get('id'))">
            Delete
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped></style>
