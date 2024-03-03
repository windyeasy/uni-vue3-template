

class WdRequest {
  /**
    * 添加构造配置
    * @constructor 
    * @param {object} config       
    * @param {string} config.baseUrl            - 请求的公共url地址
    * @param {number} config.timeout            - 请求超时时间
    * @param {object} config.interceptor          - 请求拦截器
    * @param {?function} config.interceptor.requestSuccessFn  - 请求成功拦截器
    * @param {?function} config.interceptor.responseSuccessFn - 响应成功拦截器
    * @returns 
    */
  constructor(config) {
    this.config = config
  }
  request(config) {
    return new Promise((reslove, reject) => {
      config.url = this.config.baseUrl + config.url
      // 实现请求拦截
      if (this.config?.interceptor?.requestSuccessFn) {
        config = this.config.interceptor.requestSuccessFn(config)
      }
      uni.request({
        timeout: this.config.timeout, // 延迟时间
        dataType: 'json',
        responseType: 'json',
        ...config, // 可以通过重写配置覆盖原有配置
        success: (res) => {
          // 实现响应拦截
          if (this.config?.interceptor?.responseSuccessFn) {
            res = this.config.interceptor.responseSuccessFn(res)
          }
          reslove(res)
        },
        fail: (error) => {
          reject(error)
        },
      })
    })
  }
}
export default WdRequest
const request = new WdRequest({ baseUrl, timeout })
