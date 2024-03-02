

class WdRequest {
  constructor(config) {
    this.config = config
  }

  /**
   * 
   * @param {object} config 
   * @returns 
   */
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
