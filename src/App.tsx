import React, { useState, useMemo } from 'react';
import { Layout, FileText, PlusCircle, Search, BarChart3, Settings, LogOut, Menu, X, Printer, Eye, Edit, Trash2, Calendar, User, ChevronLeft, ChevronRight, FileCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { cn } from './lib/utils';
import { FileRecord, Department } from './types';
import DashboardView from './components/DashboardView';
import FileManagementView from './components/FileManagementView';
import FileForm from './components/FileForm';
import './App.css';

const LOGO_URL = "https://storage.googleapis.com/dala-prod-public-storage/generated-images/49fc0b0d-23d5-47bc-92e8-4fdea3533c15/state-lawsuits-authority-logo-f2ca6cb5-1774852788586.webp";

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'files' | 'add'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Mock Data
  const [files, setFiles] = useState<FileRecord[]>([
    {
      id: '1',
      fileNumber: '1234/2023',
      year: '2023',
      department: 'القضايا المدنية',
      consultantName: 'أحمد محمود علي',
      headOpinion: 'يتم السير في الإجراءات',
      receivedDate: '2024-05-15',
      subject: 'نزاع عقاري - دمنهور',
      status: 'نشط',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      fileNumber: '556/2024',
      year: '2024',
      department: 'قضايا الضرائب',
      consultantName: 'محمد ابراهيم',
      headOpinion: 'تحت المراجعة القانونية',
      receivedDate: '2024-05-20',
      subject: 'طعن ضريبي - مصلحة الضرائب',
      status: 'تحت الدراسة',
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      fileNumber: '88/2024',
      year: '2024',
      department: 'القضايا الإدارية',
      consultantName: 'سارة حسن الجزار',
      headOpinion: 'تم التوجيه بالإحالة للمستشار الفني',
      receivedDate: '2024-05-22',
      subject: 'دعوى إلغاء قرار إداري',
      status: 'مؤجل',
      createdAt: new Date().toISOString()
    }
  ]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const departments: Record<string, number> = {
      'القضايا المدنية': 0,
      'القضايا الإدارية': 0,
      'قضايا الضرائب': 0,
      'قضايا العمال': 0,
      'قضايا التعويضات': 0
    };
    
    files.forEach(f => {
      if (departments[f.department] !== undefined) {
        departments[f.department]++;
      }
    });

    return {
      total: files.length,
      today: files.filter(f => f.receivedDate === today).length,
      departments
    };
  }, [files]);

  const handleAddFile = (newFile: Omit<FileRecord, 'id' | 'createdAt'>) => {
    const file: FileRecord = {
      ...newFile,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    setFiles([file, ...files]);
    setActiveTab('files');
    toast.success('تم إضافة الملف بنجاح');
  };

  const handleDeleteFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
    toast.error('تم حذف الملف');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900" dir="rtl">
      <Toaster position="top-center" expand={true} richColors />
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 right-0 h-full bg-white border-l border-slate-200 shadow-xl transition-all duration-300 z-50 print:hidden",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center gap-3 border-b border-slate-100">
            <img src={LOGO_URL} alt="Logo" className="w-10 h-10 object-contain rounded-md" />
            {isSidebarOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-bold text-sm leading-tight text-primary-900"
              >
                هيئة قضايا الدولة<br/>
                <span className="text-xs text-slate-500 font-medium">فرع دمنهور</span>
              </motion.div>
            )}
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <SidebarItem 
              icon={<BarChart3 size={20} />} 
              label="لوحة التحكم" 
              active={activeTab === 'dashboard'} 
              collapsed={!isSidebarOpen}
              onClick={() => setActiveTab('dashboard')}
            />
            <SidebarItem 
              icon={<FileText size={20} />} 
              label="إدارة الملفات" 
              active={activeTab === 'files'} 
              collapsed={!isSidebarOpen}
              onClick={() => setActiveTab('files')}
            />
            <SidebarItem 
              icon={<PlusCircle size={20} />} 
              label="إضافة ملف جديد" 
              active={activeTab === 'add'} 
              collapsed={!isSidebarOpen}
              onClick={() => setActiveTab('add')}
            />
          </nav>

          <div className="p-4 border-t border-slate-100 space-y-2">
             <SidebarItem 
              icon={<Settings size={20} />} 
              label="الإعدادات" 
              collapsed={!isSidebarOpen}
            />
            <button 
              className="flex items-center gap-3 w-full p-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
              {isSidebarOpen && <span className="font-medium text-sm">تصغير القائمة</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "transition-all duration-300 min-h-screen",
        isSidebarOpen ? "pr-0 md:pr-64" : "pr-0 md:pr-20"
      )}>
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-4">
             <button className="md:hidden p-2 hover:bg-slate-100 rounded-lg" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                <Menu size={24} />
             </button>
             <h1 className="text-lg md:text-xl font-bold text-slate-800">
               {activeTab === 'dashboard' && 'نظرة عامة على النظام'}
               {activeTab === 'files' && 'سجل الملفات المركزي'}
               {activeTab === 'add' && 'تسجيل ملف قانوني جديد'}
             </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold">المسؤول الإداري</p>
              <p className="text-xs text-slate-500">فرع دمنهور</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-100">
              M
            </div>
          </div>
        </header>

        {/* View Rendering */}
        <div className="p-4 md:p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <DashboardView stats={stats} />
              </motion.div>
            )}
            {activeTab === 'files' && (
              <motion.div
                key="files"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <FileManagementView files={files} onDelete={handleDeleteFile} />
              </motion.div>
            )}
            {activeTab === 'add' && (
              <motion.div
                key="add"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
                  <div className="p-6 md:p-8 bg-slate-900 text-white flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">إضافة ملف قضائي</h2>
                      <p className="text-slate-400 mt-1">يرجى ملء كافة البيانات المطلوبة بدقة</p>
                    </div>
                    <FileCheck size={40} className="text-indigo-400 opacity-50" />
                  </div>
                  <div className="p-6 md:p-8">
                    <FileForm onSubmit={handleAddFile} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active = false, collapsed = false, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200 group relative",
        active 
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      )}
    >
      <span className={cn(
        "transition-transform duration-200",
        active ? "scale-110" : "group-hover:scale-110"
      )}>
        {icon}
      </span>
      {!collapsed && (
        <span className="font-medium text-sm whitespace-nowrap">{label}</span>
      )}
      {collapsed && active && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-l-full" />
      )}
      {collapsed && (
        <div className="absolute left-full mr-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
          {label}
        </div>
      )}
    </button>
  );
}