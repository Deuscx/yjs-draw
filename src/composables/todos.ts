import * as Y from 'yjs'
import { doc, provider, undoManager, yTodos } from '../y'

interface Todo {
  id: string
  title: string
  complete: boolean
}

/**
 * Subscribe to changes in the document's todos and get functions
 * for creating, update, and modifying the document's todos.
 */
export function useTodos() {
  const isSynced = ref(false)
  const todos = ref<Y.Map<any>[]>([])

  // observe the yTodos shared array.
  // When the todos change, update the todos ref.
  function handleChange(e) {
    const _todos = yTodos.toArray()
    todos.value = _todos
  }
  onMounted(() => {
    yTodos.observe(handleChange)
  })

  onUnmounted(() => {
    yTodos.unobserve(handleChange)
  })

  // When the user starts a new line, create a new shared
  // array and add it to the yTodos shared array. Store a
  // ref to the new line so that we can update it later.
  const addTodo = (title: string) => {
    const id = Date.now().toString()
    const yTodo = new Y.Map()

    // Make sure that the next undo starts with the
    // transaction we're about to make.
    undoManager.stopCapturing()

    doc.transact(() => {
      yTodo.set('id', id)
      yTodo.set('title', title)
      yTodo.set('complete', false)
    })

    yTodos.push([yTodo])
  }

  const deleteTodo = (id: string) => {
    const index = yTodos.toArray().findIndex(todo => todo.get('id') === id)
    if (index > -1)
      yTodos.delete(index, 1)
  }

  const toggleTodo = (id: string) => {
    const index = yTodos.toArray().findIndex(todo => todo.get('id') === id)
    if (index > -1) {
      const todo = yTodos.get(index)
      todo.set('complete', !todo.get('complete'))
    }
  }

  // Undo the most recently done line
  const undoTodo = () => {
    undoManager.undo()
  }

  // Redo the most recently undone line
  const redoTodo = () => {
    undoManager.redo()
  }

  function handleConnect() {
    todos.value = yTodos.toArray()
  }

  function handleDisconnect() {
    provider.off('sync', handleConnect)
    provider.disconnect()
  }

  // Handle the provider connection. Include a listener
  // on the window to disconnect automatically when the
  // tab or window closes.
  onMounted(() => {
    window.addEventListener('beforeunload', handleDisconnect)
    provider.on('sync', handleConnect)
    provider.connect()
  })

  onUnmounted(() => {
    handleDisconnect()
    window.removeEventListener('beforeunload', handleDisconnect)
  })

  return {
    isSynced,
    todos,
    addTodo,
    deleteTodo,
    toggleTodo,
    undoTodo,
    redoTodo,
  }
}
