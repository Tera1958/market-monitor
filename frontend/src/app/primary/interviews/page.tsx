"use client";

import { useState, useCallback, useEffect } from "react";
import { fetchAPI } from "@/lib/api";
import { Upload, Download, FileText, Loader2, CheckCircle, XCircle, Clock } from "lucide-react";

interface TranscriptRecord {
  id: string;
  title: string;
  status: string;
  created_at: string;
}

const STATUS_CONFIG: Record<string, { label: string; icon: typeof Clock; color: string }> = {
  processing: { label: "处理中", icon: Loader2, color: "text-blue-600" },
  completed: { label: "已完成", icon: CheckCircle, color: "text-green-600" },
  failed: { label: "失败", icon: XCircle, color: "text-red-600" },
  pending: { label: "待处理", icon: Clock, color: "text-gray-500" },
};

export default function InterviewsPage() {
  const [uploading, setUploading] = useState(false);
  const [records, setRecords] = useState<TranscriptRecord[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const loadRecords = useCallback(async () => {
    try {
      const data = await fetchAPI<TranscriptRecord[]>("/primary/interviews");
      setRecords(data);
    } catch {}
  }, []);

  useEffect(() => {
    loadRecords();
    const interval = setInterval(loadRecords, 5000);
    return () => clearInterval(interval);
  }, [loadRecords]);

  const uploadFile = async (file: File) => {
    if (!file.name.endsWith(".docx")) {
      alert("请上传 .docx 格式的逐字稿文件");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      await fetch("http://localhost:8001/api/primary/interviews/transcript/upload", {
        method: "POST",
        body: formData,
      });
      setTimeout(loadRecords, 1000);
    } catch {
      alert("上传失败，请确认后端服务正常运行");
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  };

  const downloadFile = (id: string, title: string) => {
    const link = document.createElement("a");
    link.href = `http://localhost:8001/api/primary/interviews/transcript/download/${id}`;
    link.download = `${title}（清洗后版本）.docx`;
    link.click();
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">访谈管理</h1>
        <p className="text-sm text-gray-500 mt-1">上传访谈逐字稿，AI自动清洗处理</p>
      </div>

      {/* Upload area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors mb-8 ${
          dragOver
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-white hover:border-gray-400"
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={32} className="text-blue-600 animate-spin" />
            <p className="text-sm text-gray-600">正在上传...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload size={32} className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">拖拽 .docx 文件到此处，或</p>
              <label className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer text-sm">
                <FileText size={16} />
                选择文件
                <input
                  type="file"
                  accept=".docx"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </label>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              支持语音转文字工具导出的 .docx 逐字稿（如讯飞听见、飞书妙记等）
            </p>
          </div>
        )}
      </div>

      {/* Processing info */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-8">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">清洗规则说明</h3>
        <ul className="text-xs text-gray-500 space-y-1">
          <li>- 去除自动生成的元数据信息</li>
          <li>- 删除纯应答式回应（嗯、好的、对对对）</li>
          <li>- 删除噪音语气词（呃）</li>
          <li>- 识别并删除废弃重启片段（AI语义分析）</li>
          <li>- 去重复连接词堆叠</li>
          <li>- 插入话题小标题（AI识别话题转换点）</li>
          <li>- 按发言人颜色标注（访谈者红色、受访者黑色）</li>
        </ul>
      </div>

      {/* Records list */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">处理记录</h2>
        </div>

        {records.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">
            暂无处理记录，上传逐字稿开始使用
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {records.map((record) => {
              const config = STATUS_CONFIG[record.status] || STATUS_CONFIG.pending;
              const StatusIcon = config.icon;
              return (
                <div key={record.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{record.title}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(record.created_at).toLocaleString("zh-CN")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1 text-xs ${config.color}`}>
                      <StatusIcon size={14} className={record.status === "processing" ? "animate-spin" : ""} />
                      {config.label}
                    </span>

                    {record.status === "completed" && (
                      <button
                        onClick={() => downloadFile(record.id, record.title)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-md hover:bg-green-100 text-xs font-medium"
                      >
                        <Download size={14} />
                        下载
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
