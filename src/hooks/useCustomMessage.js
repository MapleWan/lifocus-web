// src/composables/useMessage.js
import { createVNode, render } from 'vue'
import MessageItem from './components/message.vue'

let seed = 1

export default function useCustomMessage(elRef) {
  const messages = new Map() // 用于管理多个消息实例（可选，用于手动关闭）

  const createMessage = (options) => {
    const id = `msg_${seed++}`
    const targetNode = elRef ? elRef.value.$el : document.body
    const container = document.createElement('div')
    targetNode.appendChild(container)
    // const container = document.createElement('div')
    // document.body.appendChild(container)

    const props = {
      message: '',
      type: 'info',
      duration: 3000,
      ...options
    }

    const vnode = createVNode(MessageItem, props)

    // 挂载
    render(vnode, container)

    // 自动清理
    const destroy = () => {
      if (messages.has(id)) {
        messages.delete(id)
      }
      render(null, container)
      targetNode.removeChild(container)
    }

    // 设置自动销毁
    if (props.duration > 0) {
      setTimeout(() => {
        destroy()
      }, props.duration + 300)
    }

    messages.set(id, destroy)

    return {
      close: destroy
    }
  }

  return {
    // 便捷方法
    success: (message, duration = 3000) => createMessage({ message, type: 'success', duration }),
    error: (message, duration = 3000) => createMessage({ message, type: 'error', duration }),
    warning: (message, duration = 3000) => createMessage({ message, type: 'warning', duration }),
    info: (message, duration = 3000) => createMessage({ message, type: 'info', duration }),
    // 通用方法
    open: createMessage
  }
}