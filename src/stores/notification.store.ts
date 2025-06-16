import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// 定义通知的类型，方便复用和类型检查
export type NotificationType = 'info' | 'success' | 'error'

// 使用 'notification' 作为 store 的 ID
export const useNotificationStore = defineStore('notification', () => {
  // --- STATE ---
  const show = ref<boolean>(false)
  const message = ref<string>('')
  const type = ref<NotificationType>('info')
  let timeoutId: number | null = null

  // --- GETTERS (as computed) ---
  const styles = computed(() => {
    switch (type.value) {
      case 'error':
        return {
          borderColor: 'border-red-500/50',
          textColor: 'text-red-400',
          shadowColor: 'shadow-red-500/10',
          // 你可以从这里返回一个 SVG path 或者组件名
          icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
        }
      case 'success':
        return {
          borderColor: 'border-green-500/50',
          textColor: 'text-green-400',
          shadowColor: 'shadow-green-500/10',
          icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
        }
      default: // info
        return {
          borderColor: 'border-cyan-500/50',
          textColor: 'text-cyan-400',
          shadowColor: 'shadow-cyan-500/10',
          icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
        }
    }
  })
  
  // --- ACTIONS ---
  function showNotification(
    newMessage: string,
    newType: NotificationType = 'info',
    duration: number = 3000
  ) {
    // 如果有正在计时的通知，先清除
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    message.value = newMessage
    type.value = newType
    show.value = true

    // 设置定时器，在 duration 毫秒后自动隐藏
    timeoutId = window.setTimeout(() => {
      show.value = false
    }, duration)
  }

  return { 
    // State
    show, 
    message, 
    type,
    // Getters
    styles,
    // Actions
    showNotification 
  }
})