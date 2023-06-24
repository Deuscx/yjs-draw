import { awareness } from '../y'
import type { User } from '../types'

const USER_COLORS = [
  '#EC5E41',
  '#F2555A',
  '#F04F88',
  '#E34BA9',
  '#BD54C6',
  '#9D5BD2',
  '#7B66DC',
  '#5373E6',
  '#369EFF',
  '#02B1CC',
  '#11B3A3',
  '#39B178',
  '#55B467',
  '#FF802B',
]

const sample = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)]

/**
 * Subscribe to the user's own presence within the provider's awareness API.
 */
export function useUser() {
  const user = ref<User>()

  // Set the initial user's state
  onMounted(() => {
    const _user = {
      id: awareness.clientID,
      point: [0, 0],
      color: sample(USER_COLORS),
      isActive: true,
    } as User

    awareness.setLocalState(_user)
    user.value = awareness.getLocalState()
  })

  // Activate the user (idle -> active)
  const activateUser = () => {
    awareness.setLocalStateField('isActive', true)
    user.value = awareness.getLocalState()
  }

  // Dectivate the user (active -> idle)
  const deactivateUser = () => {
    awareness.setLocalStateField('isActive', false)
    user.value = awareness.getLocalState()
  }

  // Update the user's cursor point
  const updateUserPoint = (point: number[]) => {
    awareness.setLocalStateField('point', point)
    user.value = awareness.getLocalState()
  }

  return { user, updateUserPoint, activateUser, deactivateUser }
}
