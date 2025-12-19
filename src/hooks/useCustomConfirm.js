// src/hooks/useConfirm.js
import { createVNode, render } from 'vue'
import ConfirmComponent from './components/ConfirmBox.vue'

export default function useConfirm(elRef) {
  let confirmInstance = null

  const createConfirm = (options) => {
    // 如果已经存在一个确认框，则不重复创建
    if (confirmInstance) {
      return Promise.reject(new Error('A confirm dialog is already open'))
    }

    return new Promise((resolve, reject) => {
      const targetNode = elRef ? elRef.value.$el : document.body
      const container = document.createElement('div')
      targetNode.appendChild(container)

      const props = {
        title: '确认',
        content: '',
        confirmText: '确定',
        cancelText: '取消',
        ...options,
        onConfirm: () => {
          resolve(true)
          close()
        },
        onCancel: () => {
          resolve(false)
          close()
        }
      }

      const vnode = createVNode(ConfirmComponent, props)

      const close = () => {
        if (confirmInstance) {
          render(null, container)
          targetNode.removeChild(container)
          confirmInstance = null
        }
      }

      confirmInstance = {
        vnode,
        close
      }

      render(vnode, container)
    })
  }

  return {
    confirm: createConfirm
  }
}