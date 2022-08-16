import { Message } from 'element-ui';

// 提示的方法
export default {
    warningMessage: (msg) => {
        return Message({
            showClose: true,
            message: msg,
            type: 'warning',
            duration: 1500
        })
    },
    errorMessage: (msg) => {
        return Message({
            showClose: true,
            message: msg,
            type: 'error',
            duration: 1500
        })
    },
    successMessage: (msg) => {
        return Message({
            showClose: true,
            message: msg,
            type: 'success',
            duration: 1500
        })
    },
    infoMessage: (msg) => {
        return Message({
            showClose: true,
            message: msg,
            type: 'info',
            duration: 1500
        })
    },
    warningClose() {
        return Message.closeAll();  // 全局删除Message语句的方法
    }
}