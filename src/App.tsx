import React, { useState, useEffect, useMemo } from 'react';
import { Toaster, toast } from 'sonner';
import { Dashboard } from './components/Dashboard';
import { FileForm } from './components/FileForm';
import { FileList } from './components/FileList';
import { PrintTemplate } from './components/PrintTemplate';
import { CaseFile } from './types';
import { Download, Upload, Plus, FileText, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, LOGO_URL } from './lib/utils';
import './custom.css';

const STORAGE_KEY = 'damanhur_files_v1';

export default function App() {
  const [files, setFiles] = useState<CaseFile[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFile, setEditingFile] = useState<CaseFile | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'files'>('dashboard');
  const [printData, setPrintData] = useState<CaseFile[]>([]);

  // Load files from local storage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setFiles(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse storage", e);
      }
    }
  }, []);

  // Save files to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
    setPrintData(files); // Sync default print data
  }, [files]);

  const handleAddFile = (data: Omit<CaseFile, 'id' | 'createdAt'>) => {
    const newFile: CaseFile = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    } as CaseFile;
    setFiles([newFile, ...files]);
    setIsFormOpen(false);
    toast.success("تم إضافة الملف بنجاح");
  };

  const handleUpdateFile = (data: CaseFile) => {
    setFiles(files.map(f => f.id === data.id ? data : f));
    setEditingFile(null);
    setIsFormOpen(false);
    toast.success("تم تحديث الملف بنجاح");
  };

  const handleDeleteFile = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الملف؟")) {
      setFiles(files.filter(f => f.id !== id));
      toast.info("تم حذف الملف");
    }
  };

  const handleBackup = () => {
    const dataStr = JSON.stringify(files, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `backup_damanhur_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    toast.success("تم تصدير النسخة الاحتياطية بنجاح");
  };

  const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const file = event.target.files?.[0];
    if (!file) return;

    fileReader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          setFiles(parsed);
          toast.success("تم استعادة البيانات بنجاح");
        } else {
          toast.error("ملف غير صالح");
        }
      } catch (err) {
        toast.error("فشل في قراءة الملف");
      }
    };
    fileReader.readAsText(file);
    event.target.value = '';
  };

  const handlePrint = (dataToPrint: CaseFile[]) => {
    setPrintData(dataToPrint);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100" dir="rtl">
      <Toaster position="top-center" richColors />
      
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 md:px-8 py-4 no-print">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100 shadow-sm overflow-hidden">
                <img src={LOGO_URL} alt="Logo" className="w-full h-full object-cover" />
             </div>
             <div>
                <h1 className="text-xl font-bold text-slate-800">هيئة قضايا الدولة</h1>
                <p className="text-xs text-slate-500 font-medium">فرع دمنهور - نظام إدارة الملفات</p>
             </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200",
                activeTab === 'dashboard' ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
              )}
            >
              <LayoutDashboard size={18} />
              <span>الإحصائيات</span>
            </button>
            <button 
              onClick={() => setActiveTab('files')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200",
                activeTab === 'files' ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
              )}
            >
              <FileText size={18} />
              <span>الملفات</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="cursor-pointer bg-white border border-slate-200 p-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm text-slate-600 flex items-center gap-2 text-sm">
              <Upload size={16} />
              <span className="hidden sm:inline">استعادة</span>
              <input type="file" accept=".json" onChange={handleRestore} className="hidden" />
            </label>
            <button 
              onClick={handleBackup}
              className="bg-white border border-slate-200 p-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm text-slate-600 flex items-center gap-2 text-sm"
            >
              <Download size={16} />
              <span className="hidden sm:inline">نسخة احتياطية</span>
            </button>
            <button 
              onClick={() => { setEditingFile(null); setIsFormOpen(true); }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-200 flex items-center gap-2"
            >
              <Plus size={18} />
              <span>إضافة ملف</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 no-print">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Dashboard files={files} />
              <div className="mt-8">
                <FileList 
                  files={files.slice(0, 5)} 
                  onEdit={(f) => { setEditingFile(f); setIsFormOpen(true); }}
                  onDelete={handleDeleteFile}
                  onPrint={handlePrint}
                  title="أحدث الملفات المضافة"
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="files"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FileList 
                files={files} 
                onEdit={(f) => { setEditingFile(f); setIsFormOpen(true); }}
                onDelete={handleDeleteFile}
                onPrint={handlePrint}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <FileForm 
        isOpen={isFormOpen} 
        onClose={() => { setIsFormOpen(false); setEditingFile(null); }}
        onSubmit={editingFile ? handleUpdateFile : handleAddFile}
        initialData={editingFile}
        existingAdvisors={Array.from(new Set(files.map(f => f.advisorName)))}
        existingOpinions={Array.from(new Set(files.map(f => f.headOpinion)))}
      />
      
      <div className="print-only">
        <PrintTemplate files={printData} />
      </div>
    </div>
  );
}