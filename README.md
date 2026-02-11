# Brand Sentiment Dashboard

**Real-Time Consumer Opinion Analytics**

A visual intelligence dashboard that transforms brand parameters into actionable marketing insights. Input your brand, audience, and keywords -- get back AI-analyzed pain points, emotional breakdowns, trend detection, and ready-to-publish content, all rendered in a step-by-step interactive interface.

---

## About

Brand Sentiment Dashboard 是一個即時品牌輿情與消費者觀點分析儀表板，把分散的聲量與情緒訊號轉成可行動的洞察。適合品牌方與行銷團隊用於監測議題、追蹤口碑變化與產出策略摘要。

## About (EN)

Brand Sentiment Dashboard transforms brand mentions and audience signals into real-time sentiment insights. It helps marketing teams monitor narrative shifts, identify risks, and make faster strategy decisions.

## 📋 Quick Summary

> 📊 這是一款**即時品牌輿情分析儀表板**，讓品牌策略師只需輸入品牌名稱、目標受眾與關鍵字，就能獲得 AI 驅動的深度消費者洞察。🎯 系統透過 LLM 大語言模型自動分析**消費者痛點**（依嚴重程度排序）、**情緒分布**（百分比拆解）、**社群趨勢偵測**與**語言風格建議**。✍️ 更厲害的是，系統會根據分析結果直接生成**平台專屬的行銷內容**，包含完整文案、標題、Hashtag 和圖片生成提示詞。🌐 支援 Dcard、PTT、Instagram、Facebook 四大平台。🛠️ 技術上採用 Next.js 14 + TypeScript + Tailwind CSS 前端，搭配 Express + LLM 後端，提供步驟式引導介面。💰 解決了傳統社群聆聽工具**昂貴且泛化**的問題，專為需要快速、精準品牌情報的行銷人打造。適合**品牌經理、社群操盤手、行銷顧問**使用。

---

## 🤔 Why This Exists

Social listening tools are expensive and generic. This dashboard is built for hands-on brand strategists who need fast, specific intelligence: What are consumers actually feeling? What pain points drive their decisions? What content angles will resonate on which platforms? Brand Sentiment Dashboard answers these questions with LLM-powered analysis and purpose-built visualizations.

## 🏗️ Architecture

```
Brand Configuration (name, tagline, audience, keywords, platform)
        |
        v
  Next.js Frontend (React + TypeScript + Tailwind CSS)
        |
        v
  Crawler API Backend (Express + LLM)
        |
        v
  +----------------+------------------+------------------+
  |                |                  |                  |
  v                v                  v                  v
Pain Point      Emotion           Trend             Content
Analysis        Distribution      Detection         Generation
(severity-      (percentage       (social           (series, copy,
 ranked)         breakdown)        topics)           hashtags, prompts)
        |
        v
  Interactive Step-by-Step Dashboard
  (config --> analysis --> content --> export)
```

### How It Works

1. **Brand Configuration** -- Users input brand name, tagline, description, target audience, platform preference (Dcard, PTT, Instagram, Facebook), search keywords, and desired tone.
2. **AI Analysis** -- The configuration is sent to the backend LLM, which generates a structured analysis: pain points ranked by severity, emotional distribution with percentages, trending social topics, language style recommendations, and marketing action items.
3. **Content Generation** -- Based on the analysis, the system produces platform-specific content series with titles, full copy, hashtags, and image generation prompts.
4. **Interactive Output** -- Results are presented in a guided wizard interface with copy-to-clipboard, download-as-Markdown, and visual breakdowns.

### Dashboard Sections

| Section | What It Delivers |
|---------|-----------------|
| Pain Points | Consumer frustrations ranked by severity (high/medium/low) with real examples |
| Emotion Map | Percentage breakdown of emotional drivers across the audience |
| Trends | Currently active social conversations relevant to the brand |
| Language Style | Recommended communication tone and vocabulary for the target platform |
| Content Output | Ready-to-publish posts with series framing, hashtags, and image prompts |

### Supported Platforms

- **Dcard** -- Taiwan's largest anonymous discussion forum
- **PTT** -- Taiwan's premier bulletin board system
- **Instagram** -- Visual-first social content
- **Facebook** -- Community and fan page engagement

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI**: React 18, Tailwind CSS, Lucide React icons
- **Styling Utilities**: clsx, tailwind-merge
- **AI Backend**: LLM integration (MiniMax / OpenAI-compatible)
- **Data Layer**: Firebase / Firestore
- **Deployment**: Static export ready via `next build`

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Dashboard available at http://localhost:3000

# Production build
npm run build

# Start production server
npm start
```

### Backend Connection

The dashboard connects to the MarketSense Crawler API for AI-powered analysis. Ensure the API server is running:

```bash
# In the companion project
cd ../marketsense-ai/crawler-api
npm install && npm start
# API available at http://localhost:3002
```

Without the backend, the dashboard operates with built-in mock data so you can explore the full interface.

## 📁 Project Structure

```
brand-sentiment-dashboard/
  src/
    app/
      page.tsx             # Main dashboard: config wizard + analysis display
      layout.tsx           # App layout and metadata
      globals.css          # Global styles
  next.config.js           # Next.js configuration
  tailwind.config.js       # Tailwind CSS theme configuration
  postcss.config.js        # PostCSS pipeline
  tsconfig.json            # TypeScript configuration
  firebase.json            # Firebase Hosting configuration
  package.json             # Dependencies and scripts
  out/                     # Static export output
```

---

Built by **Huang Akai (Kai)** -- Founder @ Universal FAW Labs | Creative Technologist | Ex-Ogilvy
