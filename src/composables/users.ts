import type { User } from '../types'
import { awareness } from '../y'

/**
 * Subscribe to the presence of other users within the provider's awareness API.
 */
export function useUsers() {
  const users = ref<User[]>([])
  function updateUsersState() {
    const states = awareness.getStates()
    users.value = Array.from(states.values() as IterableIterator<User>)
  }

  onMounted(() => {
    updateUsersState()
    awareness.on('change', updateUsersState)
  })

  onUnmounted(() => {
    awareness.off('change', updateUsersState)
  })
  return { users }
}
