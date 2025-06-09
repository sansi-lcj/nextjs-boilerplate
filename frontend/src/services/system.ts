import { get, post, put, del } from '../utils/request';

export interface User {
  id: number;
  username: string;
  name: string;
  phone: string;
  email: string;
  org_id: number;
  status: string;
  roles: Array<{
    id: number;
    name: string;
    code: string;
  }>;
  organization: {
    id: number;
    name: string;
  };
}

export interface Role {
  id: number;
  name: string;
  code: string;
  description: string;
  status: string;
}

export interface Organization {
  id: number;
  name: string;
  code: string;
  type: string;
  parent_id: number | null;
  status: string;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  name: string;
  phone: string;
  email: string;
  org_id: number;
  role_ids: number[];
  status: string;
}

export interface UpdateUserRequest {
  name: string;
  phone: string;
  email: string;
  org_id: number;
  role_ids: number[];
  status: string;
}

export const systemService = {
  // 用户管理
  async getUsers(params?: { page?: number; page_size?: number; keyword?: string }) {
    const response = await get('/users', params);
    return response.data;
  },

  async getUser(id: number) {
    const response = await get(`/users/${id}`);
    return response.data;
  },

  async createUser(data: CreateUserRequest) {
    const response = await post('/users', data);
    return response.data;
  },

  async updateUser(id: number, data: UpdateUserRequest) {
    const response = await put(`/users/${id}`, data);
    return response.data;
  },

  async deleteUser(id: number) {
    const response = await del(`/users/${id}`);
    return response.data;
  },

  async resetPassword(id: number, password: string) {
    const response = await put(`/users/${id}/password`, { password });
    return response.data;
  },

  // 角色管理
  async getRoles(params?: { page?: number; page_size?: number }) {
    const response = await get('/roles', params);
    return response.data;
  },

  async getRole(id: number) {
    const response = await get(`/roles/${id}`);
    return response.data;
  },

  async createRole(data: any) {
    const response = await post('/roles', data);
    return response.data;
  },

  async updateRole(id: number, data: any) {
    const response = await put(`/roles/${id}`, data);
    return response.data;
  },

  async deleteRole(id: number) {
    const response = await del(`/roles/${id}`);
    return response.data;
  },

  // 组织管理
  async getOrganizations(params?: { page?: number; page_size?: number }) {
    const response = await get('/organizations', params);
    return response.data;
  },

  async getOrganizationTree() {
    const response = await get('/organizations/tree');
    return response.data;
  },

  async getOrganization(id: number) {
    const response = await get(`/organizations/${id}`);
    return response.data;
  },

  async createOrganization(data: any) {
    const response = await post('/organizations', data);
    return response.data;
  },

  async updateOrganization(id: number, data: any) {
    const response = await put(`/organizations/${id}`, data);
    return response.data;
  },

  async deleteOrganization(id: number) {
    const response = await del(`/organizations/${id}`);
    return response.data;
  },

  // 权限管理
  async getPermissions() {
    const response = await get('/permissions');
    return response.data;
  },

  async getPermissionTree() {
    const response = await get('/permissions/tree');
    return response.data;
  },
};