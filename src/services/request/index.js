export function objectToQueryString(obj) {
  return Object.keys(obj)
    .map((key) => {
      return encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]);
    })
    .join("&");
}

class WdRequest {
  config;
  url;

  constructor(config) {
    this.config = config;
  }

  _fetchUrl(url) {
    if (url.includes("http")) {
      this.url = url;
    } else {
      this.url = this.config.baseURL + url;
    }
    return this.url;
  }

  request(config) {
  
    return new Promise((resolve, reject) => {
      config.url = this._fetchUrl(config.url);

      // 实现全局请求拦截
      if (this.config?.interceptor?.requestSuccessFn) {
        config = this.config.interceptor.requestSuccessFn(config);
      }
      // 实现局部请求拦截
      if (config.interceptor?.requestSuccessFn) {
        config = config.interceptor.requestSuccessFn(config);
      }

      // 解析query方法
      if (config.query) {
        const queryStr = objectToQueryString(config.query);
        if (config.url.includes("?")) {
          config.url += `&${queryStr}`;
        } else {
          config.url += `?${queryStr}`;
        }
      }
      
      uni.request({
        timeout: this.config.timeout, // 延迟时间
        dataType: "json",
        url: config.url,
        ...config,
        success: (res) => {
          // 有可能在执行的过程出现异常后抛出异常
          try {
            // 实现全局响应拦截
            if (this.config?.interceptor?.responseSuccessFn) {
              res = this.config.interceptor.responseSuccessFn(res);
            }
            // 实现局部响应拦截
            if (config?.interceptor?.responseSuccessFn) {
              res = config.interceptor.responseSuccessFn(res);
            }
            resolve(res);
          } catch (error) {
            reject(error);
          }
        },
        fail: (error) => {
          if (this.config?.interceptor?.responseErrorFn) {
            error = this.config.interceptor.responseErrorFn(error);
          }
          if (config?.interceptor?.responseErrorFn) {
            error = config?.interceptor?.responseErrorFn(error);
          }
          reject(error);
        },
      });
    });
  }

  get(url, data, config) {
    return this.request({
      url,
      method: "GET",
      data,
      ...config,
    });
  }

  post(url, data, config) {
    return this.request({
      url,
      method: "POST",
      data,
      ...config,
    });
  }

  put(url, data, config) {
    return this.request({
      url,
      method: "POST",
      data,
      ...config,
    });
  }

  delete(url, data, config) {
    return this.request({
      url,
      method: "DELETE",
      data,
      ...config,
    });
  }

  // 文件上传
  uploadFile(config) {
    return new Promise((resolve, reject) => {
      config.url = this._fetchUrl(config.url);

      // 实现全局请求拦截
      if (this.config?.interceptor?.requestSuccessFn) {
        config = this.config.interceptor.requestSuccessFn(config);
      }
      // 实现局部请求拦截
      if (config.interceptor?.requestSuccessFn) {
        config = config.interceptor.requestSuccessFn(config);
      }

      // 解析query方法
      if (config.query) {
        const queryStr = objectToQueryString(config.query);
        if (config.url.includes("?")) {
          config.url += `&${queryStr}`;
        } else {
          config.url += `?${queryStr}`;
        }
      }

      uni.uploadFile({
        ...config,
        success: (res) => {
          res.data = JSON.parse(res.data);
          // 实现全局响应拦截
          if (this.config?.interceptor?.responseSuccessFn) {
            res = this.config.interceptor.responseSuccessFn(res);
          }
          // 实现局部响应拦截
          if (config?.interceptor?.responseSuccessFn) {
            res = config.interceptor.responseSuccessFn(res);
          }
          resolve(res);
        },
        fail: (error) => {
          if (this.config?.interceptor?.responseErrorFn) {
            error = this.config.interceptor.responseErrorFn(error);
          }
          if (config?.interceptor?.responseErrorFn) {
            error = config?.interceptor?.responseErrorFn(error);
          }
          reject(error);
        },
      });
    });
  }
}
export default WdRequest;
