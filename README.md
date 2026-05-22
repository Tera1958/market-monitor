# UX Research Workbench - 用户研究工作台

AI转录、翻译、商务办公领域的用户研究一站式工作平台。涵盖桌面研究、一手研究、分析综合、交付管理全流程。

## 平台模块

| 模块 | 说明 | 状态 |
|------|------|------|
| 研究规划 | 项目管理、研究计划、受访者招募 | 开发中 |
| 桌面研究 | 市场情报采集、竞品分析、评论挖掘 | 部分完成 |
| 一手研究 | 访谈逐字稿处理、问卷生成、可用性测试 | 开发中 |
| 分析综合 | 编码标注、亲和图、主题分析、用户画像 | 规划中 |
| 知识库 | 研究报告、洞察库、精华片段 | 规划中 |

## 快速启动

### 1. 启动后端

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

首次启动会自动创建 SQLite 数据库文件 (`market_monitor.db`)，无需额外安装数据库。

### 2. 启动前端

```bash
cd frontend
npm install
npm run dev
```

### 3. 访问

打开浏览器访问 http://localhost:3000

## 技术栈

- 后端: Python / FastAPI / SQLAlchemy / httpx / BeautifulSoup4
- 前端: Next.js 16 / React 19 / Tailwind CSS / Recharts / SWR
- 数据库: SQLite (零配置，数据文件自动创建)
