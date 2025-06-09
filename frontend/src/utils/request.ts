import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { message } from 'antd';
import { ApiResponse } from '../types';

// 创建axios实例
const request: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config: AxiosRequestConfig | any) => {
    // 从localStorage获取token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const res = response.data;
    
    // 如果响应码不是200，说明出错了
    if (res.code !== 200) {
      message.error(res.message || '请求失败');
      
      // 401: Token过期或未登录
      if (res.code === 401) {
        // 清除token
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        // 跳转到登录页
        window.location.href = '/login';
      }
      
      return Promise.reject(new Error(res.message || '请求失败'));
    }
    
    return response;
  },
  (error: AxiosError) => {
    console.error('请求错误:', error);
    
    if (error.response) {
      const { status, data } = error.response as AxiosResponse<ApiResponse>;
      
      switch (status) {
        case 401:
          message.error('登录已过期，请重新登录');
          // 清除token
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          // 跳转到登录页
          window.location.href = '/login';
          break;
        case 403:
          message.error('没有权限访问该资源');
          break;
        case 404:
          message.error('请求的资源不存在');
          break;
        case 500:
          message.error('服务器内部错误');
          break;
        default:
          message.error(data?.message || `请求失败(${status})`);
      }
    } else if (error.request) {
      message.error('网络错误，请检查网络连接');
    } else {
      message.error('请求配置错误');
    }
    
    return Promise.reject(error);
  }
);

// 封装GET请求
export function get<T = any>(url: string, params?: any): Promise<ApiResponse<T>> {
  return request.get(url, { params }).then(res => res.data);
}

// 封装POST请求
export function post<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
  return request.post(url, data).then(res => res.data);
}

// 封装PUT请求
export function put<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
  return request.put(url, data).then(res => res.data);
}

// 封装DELETE请求
export function del<T = any>(url: string, params?: any): Promise<ApiResponse<T>> {
  return request.delete(url, { params }).then(res => res.data);
}

export default request;