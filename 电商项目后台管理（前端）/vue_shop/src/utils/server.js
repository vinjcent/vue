import axios from 'axios'
import qs from 'qs'

const http = axios.create({
    timeout: 1000 * 5,
    baseURL: 'http://localhost:3035/',
    withCredentials: true,
    headers: {
        Accept: '*/*',
        'Content-Type': 'application/json;charset=utf-8',
    }
})

// 配置请求的根路径,后端的接口
// http.defaults.baseURL = 'http://localhost:3035/'


// 请求拦截
http.interceptors.request.use(response => {
    return response
})

// 响应拦截
http.interceptors.response.use(config => {
    // 为请求头对象,添加 Token 验证的 Authorization 字段
    config.headers.Authorization = window.sessionStorage.getItem('token')
    // 在最后必须返回config
    return config
})



/**
 * 请求地址处理
 * @param {*} actionName action方法名称
 */
http.requestUrl = (actionName) => {
    return actionName
}

/**
 * get请求参数处理
 * @param {*} params 参数对象
 * @param {*} openDefultParams 是否开启默认参数?
 */
http.requestParams = (params = {}, openDefaultParams = true) => {

    var defaults = {}

    return openDefaultParams ? defaults : params
}

/**
 * post请求数据处理
 * @param {*} data 数据对象
 * @param {*} openDefultdata 是否开启默认数据?
 * @param {*} contentType 数据格式
 *  json: 'application/json; charset=utf-8'
 *  form: 'application/x-www-form-urlencoded; charset=utf-8'
 */
http.requestData = (data = {}, openDefaultData = true, contentType = 'json') => {
    var defaults = {}
    data = openDefaultData ? defaults : data
    return contentType === 'json' ? JSON.stringify(data) : qs.stringify(data)
}

/**
 * header请求头
 */
http.requestHeaders = (headers = {}, openDefaultDHeaders = true) => {
    var defaults = {
        Accept: '*/*',
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        'AUTHORIZATION': sessionStorage.getItem('token')  // 授权
    }
    return openDefaultDHeaders ? defaults : headers
}

export default http
