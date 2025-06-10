import axios, { 
  AxiosInstance, 
  AxiosRequestConfig, 
  AxiosResponse, 
  AxiosError,
  InternalAxiosRequestConfig 
} from 'axios';
import { message } from 'antd';

// 请求配置接口
export interface RequestConfig extends AxiosRequestConfig {
  skipErrorHandler?: boolean;
  retryCount?: number;
  retryDelay?: number;
  retries?: number;
}

// 响应数据接口
export interface ResponseData<T = any> {
  code: number;
  message: string;
  data: T;
  timestamp?: number;
  traceId?: string;
}

// 错误响应接口
export interface ErrorResponse {
  code: number;
  message: string;
  data?: any;
  errors?: Array<{
    field: string;
    message: string;
  }>;
  timestamp: string;
  path: string;
  traceId: string;
}

// 请求重试配置
interface RetryConfig {
  retries: number;
  retryDelay: number;
  retryCondition: (error: AxiosError) => boolean;
}

// 默认重试配置
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  retries: 3,
  retryDelay: 1000,
  retryCondition: (error: AxiosError) => {
    return !error.response || (error.response.status >= 500 && error.response.status < 600);
  }
};

class HttpClient {
  private instance: AxiosInstance;
  private retryConfig: RetryConfig;

  constructor() {
    this.retryConfig = DEFAULT_RETRY_CONFIG;
    this.instance = axios.create({
      baseURL: '/api/v1',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * 设置拦截器
   */
  private setupInterceptors(): void {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 添加认证token
        const token = this.getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // 添加请求时间戳
        if (config.headers) {
          config.headers['X-Request-Time'] = Date.now().toString();
        }

        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ResponseData>) => {
        const { data } = response;
        
        // 检查业务状态码
        if (data.code === 20000 || data.code === 200) {
          return response;
        }

        // 处理业务错误
        this.handleBusinessError(data);
        return Promise.reject(new Error(data.message));
      },
      async (error: AxiosError<ErrorResponse>) => {
        const config = error.config as RequestConfig;
        
        // 重试逻辑
        if (this.shouldRetry(error, config)) {
          return this.retry(error);
        }

        // 错误处理
        if (!config?.skipErrorHandler) {
          this.handleError(error);
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * 获取存储的token
   */
  private getToken(): string | null {
    return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  }

  /**
   * 处理业务错误
   */
  private handleBusinessError(data: ResponseData): void {
    switch (data.code) {
      case 40001:
        message.error('参数错误');
        break;
      case 40101:
      case 40102:
      case 40103:
        message.error('登录已过期，请重新登录');
        this.handleAuthError();
        break;
      case 40301:
        message.error('没有权限访问该资源');
        break;
      case 40401:
        message.error('请求的资源不存在');
        break;
      case 50000:
        message.error('服务器内部错误');
        break;
      default:
        message.error(data.message || '操作失败');
    }
  }

  /**
   * 处理HTTP错误
   */
  private handleError(error: AxiosError<ErrorResponse>): void {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          if (data?.errors && Array.isArray(data.errors)) {
            // 表单验证错误
            data.errors.forEach(err => {
              message.error(`${err.field}: ${err.message}`);
            });
          } else {
            message.error(data?.message || '请求参数错误');
          }
          break;
        case 401:
          message.error('认证失败，请重新登录');
          this.handleAuthError();
          break;
        case 403:
          message.error('没有权限访问该资源');
          break;
        case 404:
          message.error('请求的资源不存在');
          break;
        case 429:
          message.error('请求过于频繁，请稍后重试');
          break;
        case 500:
          message.error('服务器内部错误');
          break;
        case 502:
          message.error('网关错误');
          break;
        case 503:
          message.error('服务不可用');
          break;
        case 504:
          message.error('网关超时');
          break;
        default:
          message.error(data?.message || `请求失败 (${status})`);
      }
    } else if (error.request) {
      message.error('网络连接失败，请检查网络设置');
    } else {
      message.error('请求配置错误');
    }
  }

  /**
   * 处理认证错误
   */
  private handleAuthError(): void {
    // 清除token
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');

    // 跳转到登录页
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  /**
   * 判断是否应该重试
   */
  private shouldRetry(error: AxiosError, config?: RequestConfig): boolean {
    const retryCount = config?.retryCount || 0;
    const maxRetries = config?.retries || this.retryConfig.retries;
    
    return retryCount < maxRetries && this.retryConfig.retryCondition(error);
  }

  /**
   * 重试请求
   */
  private async retry(error: AxiosError): Promise<AxiosResponse> {
    const config = error.config as RequestConfig;
    config.retryCount = (config.retryCount || 0) + 1;
    
    const delay = config.retryDelay || this.retryConfig.retryDelay;
    await new Promise(resolve => setTimeout(resolve, delay * config.retryCount!));
    
    return this.instance.request(config);
  }

  /**
   * GET 请求
   */
  async get<T = any>(url: string, params?: any, config?: RequestConfig): Promise<T> {
    const response = await this.instance.get<ResponseData<T>>(url, {
      ...config,
      params: params
    });
    return response.data.data;
  }

  /**
   * POST 请求
   */
  async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    const response = await this.instance.post<ResponseData<T>>(url, data, config);
    return response.data.data;
  }

  /**
   * PUT 请求
   */
  async put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    const response = await this.instance.put<ResponseData<T>>(url, data, config);
    return response.data.data;
  }

  /**
   * PATCH 请求
   */
  async patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    const response = await this.instance.patch<ResponseData<T>>(url, data, config);
    return response.data.data;
  }

  /**
   * DELETE 请求
   */
  async delete<T = any>(url: string, config?: RequestConfig): Promise<T> {
    const response = await this.instance.delete<ResponseData<T>>(url, config);
    return response.data.data;
  }

  /**
   * 文件上传
   */
  async upload<T = any>(
    url: string, 
    file: File | FormData, 
    config?: RequestConfig & {
      onUploadProgress?: (progressEvent: any) => void;
    }
  ): Promise<T> {
    const formData = file instanceof FormData ? file : new FormData();
    if (file instanceof File) {
      formData.append('file', file);
    }

    const response = await this.instance.post<ResponseData<T>>(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    });
    
    return response.data.data;
  }

  /**
   * 文件下载
   */
  async download(
    url: string, 
    filename?: string, 
    config?: RequestConfig
  ): Promise<void> {
    const response = await this.instance.get(url, {
      ...config,
      responseType: 'blob',
    });

    // 创建下载链接
    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || this.getFilenameFromResponse(response) || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }

  /**
   * 从响应头获取文件名
   */
  private getFilenameFromResponse(response: AxiosResponse): string | null {
    const contentDisposition = response.headers['content-disposition'];
    if (contentDisposition) {
      const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
      if (matches && matches[1]) {
        return matches[1].replace(/['"]/g, '');
      }
    }
    return null;
  }

  /**
   * 批量请求
   */
  async all<T = any>(requests: Array<Promise<AxiosResponse<T>>>): Promise<T[]> {
    const responses = await Promise.all(requests);
    return responses.map(response => response.data);
  }

  /**
   * 取消请求
   */
  createCancelToken(): {
    token: any;
    cancel: (message?: string) => void;
  } {
    const source = axios.CancelToken.source();
    return {
      token: source.token,
      cancel: source.cancel,
    };
  }

  /**
   * 设置默认配置
   */
  setDefaultConfig(config: Partial<AxiosRequestConfig>): void {
    Object.assign(this.instance.defaults, config);
  }

  /**
   * 设置重试配置
   */
  setRetryConfig(config: Partial<RetryConfig>): void {
    this.retryConfig = { ...this.retryConfig, ...config };
  }

  /**
   * 获取原始axios实例
   */
  getInstance(): AxiosInstance {
    return this.instance;
  }
}

// 创建实例
export const http = new HttpClient();

// 导出默认实例
export default http;

// 便捷方法（向后兼容）
export const get = http.get.bind(http);
export const post = http.post.bind(http);
export const put = http.put.bind(http);
export const patch = http.patch.bind(http);
export const del = http.delete.bind(http);
export const upload = http.upload.bind(http);
export const download = http.download.bind(http);