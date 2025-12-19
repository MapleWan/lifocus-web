import { ElMessage } from 'element-plus'
export default function useElMessage() {
    const createMessage = (type, message) => {
        return `<div class="lf-message-${type}">${message}</div>`
    }
    return {
        success: (message) => ElMessage({
            type: 'success',
            message: createMessage('success', message),
            customClass: 'lf-message-container',
            dangerouslyUseHTMLString: true,
            grouping: true,
            showIcon: false
        }),
        error: (message) => ElMessage({
            type: 'error',
            message: createMessage('error', message),
            customClass: 'lf-message-container',
            grouping: true,
            dangerouslyUseHTMLString: true
        }),
        warning: (message) => ElMessage({
            type: 'warning',
            message: createMessage('warning', message),
            customClass: 'lf-message-container',
            grouping: true,
            dangerouslyUseHTMLString: true
        }),
        info: (message) => ElMessage({
            type: 'info',
            message: createMessage('info', message),
            customClass: 'lf-message-container',
            grouping: true,
            dangerouslyUseHTMLString: true
        }),
    }
}