// 临时Mock API - 当后端API不可用时使用
const MOCK_API_ENABLED = true; // 设置为true启用mock API

// Mock数据
const mockUsers = [];
const mockNotes = [];

// Mock API函数
export const mockRequest = async (url, options = {}) => {
  if (!MOCK_API_ENABLED) {
    throw new Error('Mock API未启用');
  }

  const method = (options.method || 'GET').toUpperCase();

  console.log('Mock API请求:', url, method, options);

  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500));

  // 注册
  if (url === '/api/auth/register' && options.method === 'POST') {
    const { username, email, password } = options.data;
    if (mockUsers.find(u => u.username === username || u.email === email)) {
      throw new Error('用户已存在');
    }
    const user = {
      id: Date.now().toString(),
      username,
      email,
      token: 'mock-jwt-token-' + Date.now()
    };
    mockUsers.push(user);
    return { code: 201, data: user };
  }

  // 登录
  if (url === '/api/auth/login' && options.method === 'POST') {
    const { username, password } = options.data;
    const user = mockUsers.find(u => u.username === username);
    if (!user) {
      throw new Error('用户不存在');
    }
    return { code: 200, data: { token: user.token, user } };
  }

  // 获取备忘录列表
  if (url === '/api/notes' || url.startsWith('/api/notes?')) {
    if (method === 'GET') {
      return { code: 200, data: mockNotes };
    }
  }

  // 获取单个备忘录
  if (url.match(/^\/api\/notes\/[^\/]+$/) && method === 'GET') {
    const id = url.split('/').pop();
    const note = mockNotes.find(n => n.id === id);
    if (!note) {
      throw new Error('备忘录不存在');
    }
    return { code: 200, data: note };
  }

  // 创建备忘录
  if (url === '/api/notes' && method === 'POST') {
    const note = {
      id: Date.now().toString(),
      userId: 'mock-user-id',
      ...options.data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockNotes.push(note);
    return { code: 201, data: note };
  }

  // 更新备忘录
  if (url.match(/^\/api\/notes\/[^\/]+$/) && method === 'PUT') {
    const id = url.split('/').pop();
    const noteIndex = mockNotes.findIndex(n => n.id === id);
    if (noteIndex === -1) {
      throw new Error('备忘录不存在');
    }
    const updatedNote = {
      ...mockNotes[noteIndex],
      ...options.data,
      updatedAt: new Date().toISOString()
    };
    mockNotes[noteIndex] = updatedNote;
    return { code: 200, data: updatedNote };
  }

  // 删除备忘录
  if (url.match(/^\/api\/notes\/[^\/]+$/) && method === 'DELETE') {
    const id = url.split('/').pop();
    const noteIndex = mockNotes.findIndex(n => n.id === id);
    if (noteIndex === -1) {
      throw new Error('备忘录不存在');
    }
    mockNotes.splice(noteIndex, 1);
    return { code: 200, data: { message: '删除成功' } };
  }

  // 获取当前用户信息
  if (url === '/api/auth/me' && options.method === 'GET') {
    // 模拟从token获取用户信息
    return { code: 200, data: { id: 'mock-user-id', username: 'mockuser', email: 'mock@example.com' } };
  }

  throw new Error('Mock API: 未实现的接口 - ' + url);
};