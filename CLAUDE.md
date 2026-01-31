[根目录](../CLAUDE.md) > **RuoYi-Vue3**

---

# 若依前端模块

> 模块路径: `RuoYi-Vue3/`
> 模块类型: 前端
> 语言: JavaScript
> 框架: Vue 3.5.26
> 构建工具: Vite 6.4.1
> 版本: 3.9.1

---

## 模块职责

若依管理系统前端，基于Vue 3 + Vite + Element Plus的前后端分离版本，提供用户管理、角色权限、部门管理、菜单管理、字典管理、参数管理、通知公告、操作日志、登录日志、在线用户、定时任务、代码生成、系统接口、服务监控、缓存监控等功能。

---

## 入口与启动

| 属性 | 值 |
|------|------|
| 入口文件 | `src/main.js` |
| 开发端口 | 80 (vite.config.js中配置） |
| 后端API代理 | `http://localhost:8080` (vite.config.js中配置） |

**启动命令**：
```bash
# 安装依赖
npm install

# 开发环境
npm run dev

# 构建生产环境
npm run build:prod

# 构建测试环境
npm run build:stage

# 预览构建结果
npm run preview
```

---

## 对外接口（页面组件）

### 核心页面

| 页面 | 路由 | 说明 |
|------|------|------|
| 登录页 | `/login` | `views/login.vue` |
| 注册页 | `/register` | `views/register.vue` |
| 首页 | `/index` | `views/index.vue` |
| 仪表盘 | `/index` | `views/index.vue` |

### 系统管理页面

| 页面 | 路径 | 文件路径 |
|------|------|----------|
| 用户管理 | `/system/user` | `views/system/user/index.vue` |
| 角色管理 | `/system/role` | `views/system/role/index.vue` |
| 菜单管理 | `/system/menu` | `views/system/menu/index.vue` |
| 部门管理 | `/system/dept` | `views/system/dept/index.vue` |
| 岗位管理 | `/system/post` | `views/system/post/index.vue` |
| 字典管理 | `/system/dict` | `views/system/dict/index.vue` |
| 参数管理 | `/system/config` | `views/system/config/index.vue` |
| 通知公告 | `/system/notice` | `views/system/notice/index.vue` |
| 个人中心 | `/system/user/profile` | `views/system/user/profile/index.vue` |

### 系统监控页面

| 页面 | 路径 | 文件路径 |
|------|------|----------|
| 操作日志 | `/monitor/operlog` | `views/monitor/operlog/index.vue` |
| 登录日志 | `/monitor/logininfor` | `views/monitor/logininfor/index.vue` |
| 在线用户 | `/monitor/online` | `views/monitor/online/index.vue` |
| 定时任务 | `/monitor/job` | `views/monitor/job/index.vue` |
| 任务日志 | `/monitor/job/log` | `views/monitor/job/log.vue` |
| 服务监控 | `/monitor/server` | `views/monitor/server/index.vue` |
| 缓存监控 | `/monitor/cache` | `views/cache/index.vue` |
| Druid监控 | `/monitor/druid` | `views/monitor/druid/index.vue` |

### 系统工具页面

| 页面 | 路径 | 文件路径 |
|------|------|----------|
| 表单构建器 | `/tool/build` | `views/tool/build/index.vue` |
| 代码生成 | `/tool/gen` | `views/tool/gen/index.vue` |
| Swagger接口 | `/tool/swagger` | `views/tool/swagger/index.vue` |

---

## 关键依赖与配置

### npm依赖

| 依赖 | 版本 | 说明 |
|------|------|------|
| Vue | 3.5.26 | 核心框架 |
| Vite | 6.4.1 | 构建工具 |
| Element Plus | 2.13.1 | UI组件库 |
| Vue Router | 4.6.4 | 路由管理 |
| Pinia | 3.0.4 | 状态管理 |
| Axios | 1.13.2 | HTTP客户端 |
| js-cookie | 3.0.5 | Cookie操作 |
| @element-plus/icons-vue | 2.3.2 | 图标库 |
| echarts | 5.6.0 | 图表库 |

### 配置文件

| 文件 | 说明 |
|------|------|
| `vite.config.js` | Vite构建配置 |
| `package.json` | 项目依赖配置 |
| `.env.development` | 开发环境变量 |
| `.env.production` | 生产环境变量 |
| `.env.staging` | 测试环境变量 |

---

## 数据模型

### Pinia Store

| Store | 说明 |
|-------|------|
| `useUserStore` | 用户信息存储 |
| `useSettingsStore` | 系统设置存储 |
| `useTagsViewStore` | 标签页存储 |
| `usePermissionStore` | 权限存储 |
| `useDictStore` | 字典数据存储 |

---

## 测试与质量

### 开发工具

- **热重载**: Vite HMR
- **代理**: 开发环境API代理到后端
- **构建优化**: Gzip压缩、代码分割

---

## 常见问题 (FAQ)

1. **如何修改API代理地址？**
   - 修改 `vite.config.js` 中的 `proxy` 配置

2. **如何修改端口号？**
   - 修改 `vite.config.js` 中的 `server.port` 配置

3. **如何启用TypeScript？**
   - 使用 `RuoYi-Vue3-TypeScript` 分支

---

## 目录结构

```
RuoYi-Vue3/
├── package.json
├── vite.config.js
├── index.html
├── .env.development
├── .env.production
├── .env.staging
├── public/                          # 静态资源
│   └── favicon.ico
├── src/
│   ├── main.js                       # 入口文件
│   ├── App.vue                       # 根组件
│   ├── api/                          # API请求封装
│   │   ├── login.js
│   │   ├── menu.js
│   │   ├── monitor/
│   │   │   ├── cache.js
│   │   │   ├── job.js
│   │   │   ├── jobLog.js
│   │   │   ├── logininfor.js
│   │   │   ├── online.js
│   │   │   ├── operlog.js
│   │   │   └── server.js
│   │   ├── system/
│   │   │   ├── config.js
│   │   │   ├── dept.js
│   │   │   ├── dict/
│   │   │   │   ├── data.js
│   │   │   │   └── type.js
│   │   │   ├── menu.js
│   │   │   ├── notice.js
│   │   │   ├── post.js
│   │   │   ├── role.js
│   │   │   └── user.js
│   │   └── tool/
│   │       └── gen.js
│   ├── assets/                       # 静态资源
│   │   ├── 401_images/
│   │   ├── 404_images/
│   │   ├── icons/svg/
│   │   ├── logo.png
│   │   └── styles/
│   ├── components/                   # 公共组件
│   │   ├── Breadcrumb/
│   │   ├── Crontab/
│   │   ├── DictTag/
│   │   ├── Editor/
│   │   ├── FileUpload/
│   │   ├── Hamburger/
│   │   ├── HeaderSearch/
│   │   ├── IconSelect/
│   │   ├── ImagePreview/
│   │   ├── ImageUpload/
│   │   ├── Pagination/
│   │   ├── ParentView/
│   │   ├── RightToolbar/
│   │   ├── RuoYi/
│   │   ├── Screenfull/
│   │   ├── SvgIcon/
│   │   ├── TopNav/
│   │   └── iFrame/
│   ├── directive/                    # 自定义指令
│   ├── layout/                       # 布局组件
│   │   ├── components/
│   │   └── index.vue
│   ├── plugins/                      # 插件
│   ├── router/                       # 路由配置
│   │   └── index.js
│   ├── stores/                       # Pinia状态管理
│   │   ├── modules/
│   │   └── index.js
│   ├── utils/                        # 工具函数
│   │   ├── auth.js
│   │   ├── dict.js
│   │   ├── permission.js
│   │   ├── request.js
│   │   ├── ruoyi.js
│   │   └── validate.js
│   └── views/                        # 页面组件
│       ├── error/
│       │   ├── 401.vue
│       │   └── 404.vue
│       ├── login.vue
│       ├── register.vue
│       ├── index.vue
│       ├── redirect/
│       ├── monitor/
│       │   ├── cache/
│       │   ├── druid/
│       │   ├── job/
│       │   ├── logininfor/
│       │   ├── online/
│       │   ├── operlog/
│       │   └── server/
│       ├── system/
│       │   ├── config/
│       │   ├── dept/
│       │   ├── dict/
│       │   ├── menu/
│       │   ├── notice/
│       │   ├── post/
│       │   ├── role/
│       │   └── user/
│       └── tool/
│           ├── build/
│           ├── gen/
│           └── swagger/
└── bin/                             # 脚本
    ├── build.bat
    ├── package.bat
    └── run-web.bat
```

---

## 变更记录 (Changelog)

| 日期 | 变更内容 |
|------|----------|
| 2026-01-31 | 初始化模块文档 |
