'use client'

import { useState, useEffect } from 'react'
import { 
  Zap, 
  Search, 
  BarChart3, 
  FileText, 
  Loader2, 
  ChevronRight,
  Sparkles,
  Target,
  MessageSquare,
  Download,
  Copy,
  Check,
  Battery,
  BatteryCharging,
  Settings
} from 'lucide-react'

// Types
interface ProjectConfig {
  brandName: string
  tagline: string
  description: string
  targetAudience: string
  platform: 'dcard' | 'ptt' | 'instagram' | 'facebook'
  keywords: string[]
  tone: string
  contentCount: number
}

interface AnalysisResult {
  painPoints: { point: string; severity: string; examples: string[] }[]
  emotions: { emotion: string; percentage: number }[]
  trends: string[]
  languageStyle: string[]
  recommendations: string[]
}

interface ContentItem {
  id: number
  series: string
  title: string
  content: string
  hashtags: string[]
  imagePrompt: string
}

type Step = 'config' | 'analysis' | 'content' | 'output'

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>('config')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  
  const [config, setConfig] = useState<ProjectConfig>({
    brandName: '',
    tagline: '',
    description: '',
    targetAudience: '',
    platform: 'dcard',
    keywords: [],
    tone: '溫暖療癒',
    contentCount: 10
  })
  
  const [keywordInput, setKeywordInput] = useState('')
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [contents, setContents] = useState<ContentItem[]>([])
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [apiUrl, setApiUrl] = useState<string>('http://localhost:3002')
  const [showSettings, setShowSettings] = useState(false)

  // 初始化 API URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('apiBaseUrl')
      if (saved) setApiUrl(saved)
    }
  }, [])

  // 儲存 API URL
  const saveApiUrl = (url: string) => {
    setApiUrl(url)
    if (typeof window !== 'undefined') {
      localStorage.setItem('apiBaseUrl', url)
    }
    setShowSettings(false)
  }

  // 新增關鍵字
  const addKeyword = () => {
    if (keywordInput.trim() && !config.keywords.includes(keywordInput.trim())) {
      setConfig({
        ...config,
        keywords: [...config.keywords, keywordInput.trim()]
      })
      setKeywordInput('')
    }
  }

  // 移除關鍵字
  const removeKeyword = (keyword: string) => {
    setConfig({
      ...config,
      keywords: config.keywords.filter(k => k !== keyword)
    })
  }

  // 執行分析
  const runAnalysis = async () => {
    setIsLoading(true)
    setLoadingMessage('正在分析受眾痛點與趨勢...')
    
    try {
      const response = await fetch(`${apiUrl}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })
      
      const data = await response.json()
      setAnalysis(data.analysis)
      setCurrentStep('analysis')
    } catch (error) {
      console.error('Analysis failed:', error)
      alert('分析失敗，請確認 API 伺服器是否運行中')
    } finally {
      setIsLoading(false)
    }
  }

  // 生成內容
  const generateContent = async () => {
    setIsLoading(true)
    setLoadingMessage('AI 正在生成創意內容...')
    
    try {
      const response = await fetch(`${apiUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config, analysis })
      })
      
      const data = await response.json()
      setContents(data.contents)
      setCurrentStep('content')
    } catch (error) {
      console.error('Generation failed:', error)
      alert('生成失敗，請稍後再試')
    } finally {
      setIsLoading(false)
    }
  }

  // 複製內容
  const copyContent = (id: number, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // 下載全部
  const downloadAll = () => {
    const markdown = generateMarkdown()
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${config.brandName}_IG內容策略.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  // 生成 Markdown
  const generateMarkdown = () => {
    let md = `# ${config.brandName} - IG 內容策略\n\n`
    md += `> **品牌標語**：${config.tagline}\n\n`
    md += `---\n\n`
    md += `## 受眾洞察\n\n`
    
    if (analysis) {
      md += `### 痛點分析\n`
      analysis.painPoints.forEach((p, i) => {
        md += `${i + 1}. **${p.point}** (${p.severity})\n`
      })
      md += `\n### 語調風格建議\n`
      analysis.languageStyle.forEach(s => {
        md += `- ${s}\n`
      })
      md += `\n---\n\n`
    }
    
    md += `## 內容企劃 (${contents.length} 篇)\n\n`
    
    contents.forEach((item, i) => {
      md += `### #${item.id} ${item.title}\n`
      md += `**系列**：${item.series}\n\n`
      md += `\`\`\`\n${item.content}\n\n${item.hashtags.join(' ')}\n\`\`\`\n\n`
      md += `🖼️ **圖片建議**：${item.imagePrompt}\n\n`
      md += `---\n\n`
    })
    
    return md
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-cyan-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <BatteryCharging className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl gradient-text">MarketSense AI</h1>
              <p className="text-xs text-gray-500">社群洞察 → 內容生成</p>
            </div>
          </div>
          
          {/* Progress Steps + Settings */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {['config', 'analysis', 'content'].map((step, i) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    currentStep === step 
                      ? 'bg-green-500 text-white' 
                      : ['config', 'analysis', 'content'].indexOf(currentStep) > i
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-400'
                  }`}>
                    {i + 1}
                  </div>
                  {i < 2 && (
                    <ChevronRight className={`w-4 h-4 mx-1 ${
                      ['config', 'analysis', 'content'].indexOf(currentStep) > i
                        ? 'text-green-500'
                        : 'text-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            
            {/* Settings Button */}
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="API 設定"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 animate-fadeIn">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              API 設定
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  爬蟲 API URL
                </label>
                <input
                  type="text"
                  defaultValue={apiUrl || 'http://localhost:3002'}
                  id="api-url-input"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="http://localhost:3002 或 ngrok URL"
                />
                <p className="text-xs text-gray-500 mt-1">
                  本機開發用 localhost:3002，遠端用 ngrok URL
                </p>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    const input = document.getElementById('api-url-input') as HTMLInputElement
                    if (input) saveApiUrl(input.value)
                  }}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  儲存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center animate-fadeIn">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <Battery className="w-20 h-20 text-gray-200" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-8 bg-green-500 rounded battery-charging" />
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-2">AI 正在充電中...</h3>
              <p className="text-gray-500">{loadingMessage}</p>
            </div>
          </div>
        )}

        {/* Step 1: Configuration */}
        {currentStep === 'config' && (
          <div className="animate-fadeIn">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">設定你的專案</h2>
              <p className="text-gray-500">告訴我們你的品牌和目標受眾</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
              {/* Brand Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    品牌/產品名稱 *
                  </label>
                  <input
                    type="text"
                    value={config.brandName}
                    onChange={(e) => setConfig({...config, brandName: e.target.value})}
                    placeholder="例：充電小世界"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    核心標語 *
                  </label>
                  <input
                    type="text"
                    value={config.tagline}
                    onChange={(e) => setConfig({...config, tagline: e.target.value})}
                    placeholder="例：手機有充電的地方，你呢？"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  產品/服務描述
                </label>
                <textarea
                  value={config.description}
                  onChange={(e) => setConfig({...config, description: e.target.value})}
                  placeholder="描述你的產品或服務，以及想要傳達的核心價值..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  目標受眾
                </label>
                <input
                  type="text"
                  value={config.targetAudience}
                  onChange={(e) => setConfig({...config, targetAudience: e.target.value})}
                  placeholder="例：20-35 歲上班族、學生、對生活感到疲憊的年輕人"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  搜尋關鍵字 *
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                    placeholder="輸入關鍵字後按 Enter"
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  />
                  <button
                    onClick={addKeyword}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition font-medium"
                  >
                    新增
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {config.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-2"
                    >
                      {keyword}
                      <button
                        onClick={() => removeKeyword(keyword)}
                        className="hover:text-green-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {config.keywords.length === 0 && (
                    <span className="text-gray-400 text-sm">
                      建議關鍵字：焦慮、療癒、放鬆、壓力大、躺平、好累
                    </span>
                  )}
                </div>
              </div>

              {/* Options */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    語調風格
                  </label>
                  <select
                    value={config.tone}
                    onChange={(e) => setConfig({...config, tone: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  >
                    <option value="溫暖療癒">溫暖療癒</option>
                    <option value="輕鬆幽默">輕鬆幽默</option>
                    <option value="專業權威">專業權威</option>
                    <option value="年輕活潑">年輕活潑</option>
                    <option value="文青質感">文青質感</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    生成數量
                  </label>
                  <select
                    value={config.contentCount}
                    onChange={(e) => setConfig({...config, contentCount: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  >
                    <option value={10}>10 篇（快速體驗）</option>
                    <option value={30}>30 篇（一個月份）</option>
                    <option value={50}>50 篇（標準方案）</option>
                    <option value={100}>100 篇（完整方案）</option>
                  </select>
                </div>
              </div>

              <button
                onClick={runAnalysis}
                disabled={!config.brandName || !config.tagline || config.keywords.length === 0}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-cyan-500 text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                開始 AI 分析
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Analysis Results */}
        {currentStep === 'analysis' && analysis && (
          <div className="animate-fadeIn">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">受眾洞察分析</h2>
              <p className="text-gray-500">基於「{config.keywords.join('、')}」等關鍵字的分析結果</p>
            </div>

            <div className="space-y-6">
              {/* Pain Points */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-red-500" />
                  受眾痛點
                </h3>
                <div className="space-y-3">
                  {analysis.painPoints.map((point, i) => (
                    <div key={i} className="p-4 bg-red-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{point.point}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          point.severity === '高' ? 'bg-red-200 text-red-700' :
                          point.severity === '中' ? 'bg-yellow-200 text-yellow-700' :
                          'bg-gray-200 text-gray-700'
                        }`}>
                          {point.severity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{point.examples.join('、')}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emotions & Trends */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-500" />
                    情緒分佈
                  </h3>
                  <div className="space-y-3">
                    {analysis.emotions.map((e, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{e.emotion}</span>
                          <span className="text-gray-500">{e.percentage}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                            style={{ width: `${e.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-500" />
                    語調建議
                  </h3>
                  <div className="space-y-2">
                    {analysis.languageStyle.map((style, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <span className="text-gray-700">{style}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-gradient-to-br from-green-500 to-cyan-500 rounded-2xl shadow-lg p-6 text-white">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  行銷建議
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {analysis.recommendations.map((rec, i) => (
                    <div key={i} className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                      {rec}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={generateContent}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-cyan-500 text-white rounded-xl font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
              >
                <FileText className="w-5 h-5" />
                生成 {config.contentCount} 篇文案
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Generated Content */}
        {currentStep === 'content' && contents.length > 0 && (
          <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">內容生成完成！</h2>
                <p className="text-gray-500">共 {contents.length} 篇貼文，可逐篇複製或下載全部</p>
              </div>
              <button
                onClick={downloadAll}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-white rounded-xl font-semibold hover:opacity-90 transition flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                下載 Markdown
              </button>
            </div>

            <div className="grid gap-4">
              {contents.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-lg p-6 card-hover">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                        {item.series}
                      </span>
                      <h3 className="font-bold text-lg mt-2">#{item.id} {item.title}</h3>
                    </div>
                    <button
                      onClick={() => copyContent(item.id, `${item.content}\n\n${item.hashtags.join(' ')}`)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <Copy className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4 mb-4 whitespace-pre-wrap text-gray-700">
                    {item.content}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.hashtags.map((tag, i) => (
                      <span key={i} className="text-sm text-blue-500">{tag}</span>
                    ))}
                  </div>
                  
                  <div className="flex items-start gap-2 text-sm text-gray-500">
                    <span className="shrink-0">🖼️</span>
                    <span>{item.imagePrompt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t bg-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-500 text-sm">
          <p>MarketSense AI - 讓數據驅動你的內容策略</p>
          <p className="mt-1">Powered by OpenAI GPT-4</p>
        </div>
      </footer>
    </main>
  )
}
