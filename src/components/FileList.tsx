import React, { useState, useMemo } from 'react';
import { CaseFile } from '../types';
import { Search, Edit2, Trash2, Eye, Printer, Filter, X, Clock, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, formatDate } from '../lib/utils';

interface FileListProps {
  files: CaseFile[];
  onEdit: (file: CaseFile) => void;
  onDelete: (id: string) => void;
  onPrint: (data: CaseFile[]) => void;
  title?: string;
}

export const FileList: React.FC<FileListProps> = ({ files, onEdit, onDelete, onPrint, title }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState<CaseFile | null>(null);

  const filteredFiles = useMemo(() => {
    return files.filter(f => 
      f.advisorName.includes(searchTerm) ||
      f.caseNumber.includes(searchTerm) ||
      f.plaintiff.includes(searchTerm) ||
      f.defendant.includes(searchTerm) ||
      f.division.includes(searchTerm) ||
      f.headOpinion.includes(searchTerm)
    );
  }, [files, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
        <h2 className="text-2xl font-bold text-slate-800">{title || "سجل الملفات"}</h2>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="بحث في جميع الحقول..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => onPrint(files)}
            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2 text-sm font-medium"
          >
            <Printer size={18} />
            <span className="hidden sm:inline">طباعة الكل</span>
          </button>
          {searchTerm && (
            <button 
              onClick={() => onPrint(filteredFiles)}
              className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl text-blue-600 hover:bg-blue-100 transition-all shadow-sm flex items-center gap-2 text-sm font-medium"
            >
              <Filter size={18} />
              <span className="hidden sm:inline">طباعة النتائج</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-x-auto no-print">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-sm uppercase">
              <th className="px-6 py-4 font-bold">المستشار</th>
              <th className="px-6 py-4 font-bold">الشعبة</th>
              <th className="px-6 py-4 font-bold">رقم الدعوي / السنة</th>
              <th className="px-6 py-4 font-bold">الخصوم</th>
              <th className="px-6 py-4 font-bold">تاريخ العرض</th>
              <th className="px-6 py-4 font-bold text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredFiles.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <Search size={40} className="opacity-20" />
                    <p>لا توجد ملفات تطابق بحثك</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredFiles.map((file) => (
                <motion.tr 
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={file.id} 
                  className="hover:bg-slate-50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800">{file.advisorName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold",
                      file.division === 'الاستئناف' ? "bg-emerald-50 text-emerald-700" :
                      file.division === 'الكليات' ? "bg-blue-50 text-blue-700" :
                      file.division === 'الجزئيات' ? "bg-amber-50 text-amber-700" :
                      "bg-rose-50 text-rose-700"
                    )}>
                      {file.division}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-mono text-slate-600">{file.caseNumber} / {file.year}</p>
                  </td>
                  <td className="px-6 py-4 max-w-[200px]">
                    <p className="text-sm truncate text-slate-600">
                      <span className="font-semibold text-slate-800">ضد:</span> {file.defendant}
                    </p>
                    <p className="text-xs truncate text-slate-400 mt-1">
                      <span className="font-semibold">بواسطة:</span> {file.plaintiff}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-500">{formatDate(file.displayDate)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setSelectedFile(file)}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="عرض التفاصيل"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => onEdit(file)}
                        className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                        title="تعديل"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => onDelete(file.id)}
                        className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="حذف"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selectedFile && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 no-print">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFile(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-lg bg-white/80 backdrop-blur-xl border border-white/20 rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                      <FileText size={28} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800">تفاصيل الملف</h3>
                      <p className="text-slate-500 font-medium">رقم {selectedFile.caseNumber} لسنة {selectedFile.year}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedFile(null)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/50 p-4 rounded-2xl border border-white/40">
                      <p className="text-xs text-slate-400 font-bold mb-1">المستشار</p>
                      <p className="font-bold text-slate-800">{selectedFile.advisorName}</p>
                    </div>
                    <div className="bg-white/50 p-4 rounded-2xl border border-white/40">
                      <p className="text-xs text-slate-400 font-bold mb-1">الشعبة</p>
                      <p className="font-bold text-slate-800">{selectedFile.division}</p>
                    </div>
                  </div>

                  <div className="bg-white/50 p-4 rounded-2xl border border-white/40">
                    <p className="text-xs text-slate-400 font-bold mb-1">المدعي</p>
                    <p className="font-semibold text-slate-800">{selectedFile.plaintiff}</p>
                  </div>

                  <div className="bg-white/50 p-4 rounded-2xl border border-white/40">
                    <p className="text-xs text-slate-400 font-bold mb-1">المدعي عليه</p>
                    <p className="font-semibold text-slate-800">{selectedFile.defendant}</p>
                  </div>

                  <div className="bg-white/50 p-6 rounded-3xl border border-white/40 relative">
                     <div className="absolute top-4 left-4 text-blue-600 opacity-20">
                        <Clock size={40} />
                     </div>
                    <p className="text-xs text-slate-400 font-bold mb-2">رأي المستشار رئيس الفرع</p>
                    <p className="text-slate-700 leading-relaxed italic whitespace-pre-wrap">{selectedFile.headOpinion || "لا يوجد رأي مسجل"}</p>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedFile(null)}
                  className="w-full mt-8 py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all"
                >
                  إغلاق
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};