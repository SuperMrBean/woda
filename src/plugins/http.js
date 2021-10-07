import axios, { AxiosInstance } from "axios";

// 超时时间
// axios.defaults.timeout = 5000
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded;";
// response.addHeader( "Cache-Control", "no-cache" );
axios.defaults.headers["Cache-Control"] = "no-cache";

axios.formatForm = (data) => {
  let formData = new FormData();
  Object.keys(data).map((item) => {
    formData.append(item, data[item]);
  });
  return formData;
};

// 文件提交ajax (file upload)
axios.formAjax = axios.create({
  // timeout: 1000,
  headers: { "Content-Type": false },
  withCredentials: true,
});

axios.interceptors.request.use(
  async (config) => {
    config.withCredentials = true; // 允许携带token ,这个是解决跨域产生的相关问题
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    if (response.data.status == 401 || response.data.status === 403) {
      window.location.href = "/";
    }
    return response;
  },
  (error) => {
    if (error.response.status === 403) {
      window.location.href = "/";
      return;
    }
    return Promise.reject(error.response.data); // 返回接口返回的错误信息
  }
);

export default axios;
