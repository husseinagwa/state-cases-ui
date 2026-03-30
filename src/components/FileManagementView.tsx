import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Printer, Eye, Edit, Trash2, Filter, MoreHorizontal, Download } from 'lucide-react';
import { FileRecord } from '../types';
import { cn } from '../lib/utils';
import FileDetailsModal from './FileDetailsModal';

interface Props {
  files: FileRecord[];
  onDelete: (id: string) => void;
}

const LOGO_URL = "https://storage.googleapis.com/dala-prod-public-storage/generated-images/49fc0b0d-23d5-47bc-92e8-4fdea3533c15/state-lawsuits-authority-logo-f2ca6cb5-1774852788586.webp";

export default function FileManagementView({ files, onDelete }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState<FileRecord | null>(null);
  
  const filteredFiles = useMemo(() => {
    return files.filter(f => 
      f.fileNumber.includes(searchTerm) || 
      f.consultantName.includes(searchTerm) ||
      f.subject.includes(searchTerm) ||
      f.department.includes(searchTerm)
    );
  }, [files, searchTerm]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Search and Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm print:hidden">
        <div className="relative w-full md:w-96">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="بحث برقم الملف، اسم المستشار، أو الشعبة..."
            className="w-full pr-12 pl-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={handlePrint}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 font-medium text-sm"
          >
            <Printer size={18} />
            طباعة التقرير
          </button>
          <button className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-600">
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
        {/* Printable Header */}
        <div className="hidden print:flex items-center justify-between p-8 border-b-2 border-slate-900 mb-8">
          <div className="text-right">
            <h1 className="text-2xl font-black">هيئة قضايا الدولة</h1>
            <h2 className="text-xl font-bold">فرع دمنهور</h2>
            <p className="text-sm mt-2">تاريخ التقرير: {new Date().toLocaleDateString('ar-EG')}</p>
          </div>
          <img src={LOGO_URL} alt="Logo" className="w-24 h-24 object-contain" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">رقم الملف / السنة</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">الشعبة</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">المستشار المختص</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">تاريخ الورود</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">الحالة</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider print:hidden text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence>
                {filteredFiles.map((file, idx) => (
                  <motion.tr 
                    key={file.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group hover:bg-indigo-50/30 transition-colors"
                  >
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{file.fileNumber}</span>
                        <span className="text-xs text-slate-400">سنة {file.year}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                        {file.department}
                      </span>
                    </td>
                    <td className="px-6 py-5 font-medium text-slate-700">{file.consultantName}</td>
                    <td className="px-6 py-5 text-sm text-slate-500">{file.receivedDate}</td>
                    <td className="px-6 py-5">
                      <StatusBadge status={file.status} />
                    </td>
                    <td className="px-6 py-5 print:hidden">
                      <div className="flex justify-center gap-2">
                        <ActionButton 
                          icon={<Eye size={16} />} 
                          color="blue" 
                          onClick={() => setSelectedFile(file)}
                          tooltip="عرض التفاصيل"
                        />
                        <ActionButton 
                          icon={<Edit size={16} />} 
                          color="indigo" 
                          tooltip="تعديل البيانات"
                        />
                        <ActionButton 
                          icon={<Trash2 size={16} />} 
                          color="red" 
                          onClick={() => onDelete(file.id)}
                          tooltip="حذف الملف"
                        />
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          
          {filteredFiles.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400">
              <Search size={48} className="mb-4 opacity-20" />
              <p>لا توجد نتائج تطابق بحثك</p>
            </div>
          )}
        </div>
      </div>

      <FileDetailsModal 
        file={selectedFile} 
        onClose={() => setSelectedFile(null)} 
      />
    </div>
  );
}

function StatusBadge({ status }: { status: FileRecord['status'] }) {
  const styles = {
    'نشط': 'bg-green-100 text-green-700 border-green-200',
    'مؤجل': 'bg-amber-100 text-amber-700 border-amber-200',
    'محسوم': 'bg-blue-100 text-blue-700 border-blue-200',
    'تحت الدراسة': 'bg-purple-100 text-purple-700 border-purple-200',
  };

  return (
    <span className={cn("px-3 py-1 rounded-lg text-xs font-bold border", styles[status])}>
      {status}
    </span>
  );
}

function ActionButton({ icon, color, onClick, tooltip }: any) {
  const colors = {
    blue: "text-blue-600 hover:bg-blue-50 border-blue-100",
    indigo: "text-indigo-600 hover:bg-indigo-50 border-indigo-100",
    red: "text-red-600 hover:bg-red-50 border-red-100"
  };

  return (
    <button 
      onClick={onClick}
      className={cn("p-2 rounded-lg border transition-all hover:scale-110", colors[color as keyof typeof colors])}
      title={tooltip}
    >
      {icon}
    </button>
  );
}