import axios from "axios";
const url = "http://localhost:8080/";
const api = axios.create({
  baseURL: url,
});
// Hàm kiểm tra xem data có phải là FormData không
function isFormData(data) {
  return data instanceof FormData;
}

function checkToKenParam(config) {
  const token = process.env.REACT_APP_TOKEN_KEY;

  if (token) {
    config.headers.Authorization = `${token}`;
  }
  config.headers["Content-Type"] = "multipart/form-data";
  // Chuyển đổi HTML entities cho các tham số
  if (config.params !== undefined) {
    config.params = convertParamsToHtmlEntities(config.params);
  } else if (config.data !== undefined && !isFormData(config.data)) {
    config.data = convertDataToHtmlEntities(config.data);
  }
}
// Set token vào header trước khi gọi API
api.interceptors.request.use(
  (config) => {
    checkToKenParam(config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Hàm chuyển đổi HTML entities cho object params
function convertParamsToHtmlEntities(params) {
  const convertedParams = {};
  for (const key in params) {
    if (Object.hasOwnProperty.call(params, key)) {
      convertedParams[key] = convertToHtmlEntities(params[key]);
    }
  }
  return convertedParams;
}

// Hàm chuyển đổi HTML entities cho body data
function convertDataToHtmlEntities(data) {
  if (typeof data !== "object") {
    return convertToHtmlEntities(data);
  }

  if (Array.isArray(data)) {
    return data.map(convertDataToHtmlEntities);
  }

  const convertedData = {};
  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      convertedData[key] = convertDataToHtmlEntities(data[key]);
    }
  }
  return convertedData;
}

// Hàm chuyển đổi HTML entities cho một string
function convertToHtmlEntities(str) {
  const map = {
    "<": "&lt;",
    ">": "&gt;",
  };
  return String(str).replace(/[<>]/g, (m) => map[m]);
}

export { api };
const instance = axios.create({
  baseURL: url,
  responseType: "blob", // Thêm option responseType với giá trị là 'blob
});
instance.interceptors.request.use(
  (config) => {
    checkToKenParam(config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    // Trả về response data dưới dạng blob
    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });
    return Object.assign({}, response, { data: blob });
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
