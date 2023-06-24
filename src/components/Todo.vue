<script setup lang="ts">
import type * as Y from 'yjs'

const props = defineProps<{
  todo: Y.Map<any>
}>()
const { toggleTodo } = useTodos()
const complete = ref(props.todo.get('complete'))

function handleChange() {
  const todo = props.todo.toJSON()
  complete.value = todo.complete
}
onMounted(() => {
  props.todo.observe(handleChange)
})

onUnmounted(() => {
  props.todo.unobserve(handleChange)
})

function _toggleTodo() {
  toggleTodo(props.todo.get('id'))
}
</script>

<template>
  <label>
    <input v-model="complete" class="toggle" type="checkbox" @change="_toggleTodo">
    {{ todo.get('title') }}
  </label>
</template>
