/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly PUBLIC_API_BASE_URL?: string;
  readonly REACT_APP_API_BASE_URL?: string;
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 