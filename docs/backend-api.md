# 备忘录应用后端API文档

## 概述

- **基础URL**: `https://tuwlxfdvhngr.sealoshzh.site`
- **API版本**: v1
- **数据格式**: JSON
- **字符编码**: UTF-8
- **鉴权方式**: JWT Bearer Token

## 通用约定

### 请求头
- `Content-Type: application/json` (除文件上传外)
- `Authorization: Bearer <token>` (需要鉴权的接口)

### 响应格式
```json
{
  "code": 200,
  "message": "success",
  "data": { ... }
}
```

### 错误响应格式
```json
{
  "code": 4001,
  "message": "错误描述",
  "errors": {
    "field": ["错误信息"]
  }
}
```

### 分页参数
- `page`: 页码 (从1开始，默认1)
- `per_page`: 每页数量 (默认20)

### 时间格式
ISO 8601 格式: `2026-04-05T08:00:00.000Z`

---

## 认证接口

### 1. 用户注册
**接口**: `POST /api/auth/register`

**描述**: 创建新用户账号

**请求体**:
```json
{
  "username": "string (必填，唯一)",
  "password": "string (必填)",
  "email": "string (必填，唯一)"
}
```

**成功响应 (201)**:
```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "token": "string"
}
```

**错误响应**:
- `400`: 用户名或邮箱已存在
- `422`: 参数校验失败

**示例**:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"P@ssw0rd","email":"a@b.com"}'
```

### 2. 用户登录
**接口**: `POST /api/auth/login`

**描述**: 用户登录获取访问令牌

**请求体**:
```json
{
  "username": "string (必填)",
  "password": "string (必填)"
}
```

**成功响应 (200)**:
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string"
  }
}
```

**错误响应**:
- `400`: 用户名或密码错误

**示例**:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"P@ssw0rd"}'
```

### 3. 获取当前用户信息
**接口**: `GET /api/auth/me`

**描述**: 获取当前登录用户的信息

**鉴权**: 需要

**成功响应 (200)**:
```json
{
  "id": "string",
  "username": "string",
  "email": "string"
}
```

**错误响应**:
- `401`: Token无效或过期

**示例**:
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/auth/me
```

### 4. 用户登出
**接口**: `POST /api/auth/logout`

**描述**: 用户登出 (客户端清除token即可)

**鉴权**: 需要

**成功响应 (200)**:
```json
{
  "message": "登出成功"
}
```

---

## 备忘录接口

### 5. 获取备忘录列表
**接口**: `GET /api/notes`

**描述**: 获取用户的备忘录列表，支持分页和搜索

**鉴权**: 需要

**查询参数**:
- `page`: number (页码，默认1)
- `per_page`: number (每页数量，默认20)
- `q`: string (搜索关键词，匹配标题和内容，可选)
- `sort`: string (排序字段，如 `-updatedAt` 倒序，默认 `-updatedAt`)

**成功响应 (200)**:
```json
{
  "data": [
    {
      "id": "string",
      "title": "string",
      "preview": "string",
      "updatedAt": "2026-04-05T08:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 42
  }
}
```

**示例**:
```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3000/api/notes?page=1&per_page=10&q=测试"
```

### 6. 获取单个备忘录
**接口**: `GET /api/notes/{id}`

**描述**: 获取指定备忘录的详细信息

**鉴权**: 需要 (仅限本人)

**路径参数**:
- `id`: string (备忘录ID)

**成功响应 (200)**:
```json
{
  "id": "string",
  "userId": "string",
  "title": "string",
  "content": "string",
  "preview": "string",
  "createdAt": "2026-04-05T08:00:00.000Z",
  "updatedAt": "2026-04-05T08:00:00.000Z"
}
```

**错误响应**:
- `404`: 备忘录不存在或无权限

**示例**:
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/notes/60f7b3b3b3b3b3b3b3b3b3b3
```

### 7. 创建备忘录
**接口**: `POST /api/notes`

**描述**: 创建新的备忘录

**鉴权**: 需要

**请求体**:
```json
{
  "title": "string (必填)",
  "content": "string (必填)"
}
```

**成功响应 (201)**:
```json
{
  "id": "string",
  "userId": "string",
  "title": "string",
  "content": "string",
  "preview": "string",
  "createdAt": "2026-04-05T08:00:00.000Z",
  "updatedAt": "2026-04-05T08:00:00.000Z"
}
```

**错误响应**:
- `422`: 参数校验失败

**示例**:
```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"新备忘录","content":"备忘录内容"}'
```

### 8. 更新备忘录
**接口**: `PUT /api/notes/{id}`

**描述**: 更新指定备忘录的内容

**鉴权**: 需要 (仅限本人)

**路径参数**:
- `id`: string (备忘录ID)

**请求体** (部分更新):
```json
{
  "title": "string (可选)",
  "content": "string (可选)"
}
```

**成功响应 (200)**:
```json
{
  "id": "string",
  "userId": "string",
  "title": "string",
  "content": "string",
  "preview": "string",
  "createdAt": "2026-04-05T08:00:00.000Z",
  "updatedAt": "2026-04-05T08:00:00.000Z"
}
```

**错误响应**:
- `404`: 备忘录不存在或无权限
- `422`: 参数校验失败

**示例**:
```bash
curl -X PUT http://localhost:3000/api/notes/60f7b3b3b3b3b3b3b3b3b3b3 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"更新标题","content":"更新内容"}'
```

### 9. 删除备忘录
**接口**: `DELETE /api/notes/{id}`

**描述**: 删除指定备忘录 (软删除)

**鉴权**: 需要 (仅限本人)

**路径参数**:
- `id`: string (备忘录ID)

**成功响应 (204)**: 无内容

**错误响应**:
- `404`: 备忘录不存在或无权限

**示例**:
```bash
curl -X DELETE http://localhost:3000/api/notes/60f7b3b3b3b3b3b3b3b3b3b3 \
  -H "Authorization: Bearer <token>"
```

---

## 附件接口

### 10. 上传附件
**接口**: `POST /api/notes/{noteId}/attachments`

**描述**: 为指定备忘录上传附件文件

**鉴权**: 需要

**路径参数**:
- `noteId`: string (备忘录ID)

**请求体**: `multipart/form-data`
- `file`: File (必填，附件文件)

**成功响应 (201)**:
```json
{
  "id": "string",
  "noteId": "string",
  "url": "string",
  "filename": "string",
  "mimeType": "string",
  "size": number,
  "createdAt": "2026-04-05T08:00:00.000Z"
}
```

**错误响应**:
- `400`: 未上传文件
- `404`: 备忘录不存在

**示例**:
```bash
curl -X POST http://localhost:3000/api/notes/60f7b3b3b3b3b3b3b3b3b3b3/attachments \
  -H "Authorization: Bearer <token>" \
  -F "file=@example.jpg"
```

### 11. 删除附件
**接口**: `DELETE /api/attachments/{id}`

**描述**: 删除指定附件

**鉴权**: 需要

**路径参数**:
- `id`: string (附件ID)

**成功响应 (204)**: 无内容

**错误响应**:
- `404`: 附件不存在

**示例**:
```bash
curl -X DELETE http://localhost:3000/api/attachments/60f7b3b3b3b3b3b3b3b3b3b3 \
  -H "Authorization: Bearer <token>"
```

---

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 1000 | 未知错误 |
| 4000 | 参数错误 |
| 4001 | 认证失败/Token无效 |
| 4003 | 权限不足 |
| 4040 | 资源未找到 |
| 4220 | 校验失败 |

## 数据模型

### User (用户)
```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "createdAt": "2026-04-05T08:00:00.000Z",
  "updatedAt": "2026-04-05T08:00:00.000Z"
}
```

### Note (备忘录)
```json
{
  "id": "string",
  "userId": "string",
  "title": "string",
  "content": "string",
  "preview": "string",
  "createdAt": "2026-04-05T08:00:00.000Z",
  "updatedAt": "2026-04-05T08:00:00.000Z",
  "deleted": false
}
```

### Attachment (附件)
```json
{
  "id": "string",
  "noteId": "string",
  "url": "string",
  "filename": "string",
  "mimeType": "string",
  "size": number,
  "createdAt": "2026-04-05T08:00:00.000Z"
}
```

---

## 注意事项

1. 所有时间字段均为UTC时间
2. 备忘录删除为软删除，可从数据库恢复
3. 附件URL为相对路径，需拼接完整URL访问
4. Token有过期时间，过期后需重新登录
5. 密码传输使用HTTPS加密
6. 文件上传大小限制由服务器配置决定