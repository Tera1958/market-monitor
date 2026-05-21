# Market Monitor - 市场情报追踪系统

AI转录、翻译、商务办公领域的竞品/新品动态及行业新闻追踪平台。

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

## 使用流程

1. 打开 Dashboard 首页查看概览
2. 进入「爬虫管理」页面，点击按钮触发数据采集
3. 在「文章/新闻」页面浏览采集的行业资讯
4. 在「产品/新品」页面浏览产品信息
5. 在「趋势分析」页面查看数据可视化

## 已实现的爬虫

| 爬虫 | 数据源 | 采集内容 |
|------|--------|----------|
| TechCrunch | techcrunch.com (RSS) | 行业新闻 |
| The Verge | theverge.com (RSS) | 科技新闻 |
| Kickstarter | kickstarter.com | 众筹新品 |
| Indiegogo | indiegogo.com | 众筹新品 |
| Amazon (US) | amazon.com | 产品排行 |

## 技术栈

- 后端: Python / FastAPI / SQLAlchemy / httpx / BeautifulSoup4
- 前端: Next.js 16 / React / Tailwind CSS / Recharts / SWR
- 数据库: SQLite (零配置，数据文件自动创建)
