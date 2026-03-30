import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Calendar, User, Briefcase, FileSignature, Clock } from 'lucide-react';
import { FileRecord } from '../types';

interface Props {
  file: FileRecord | null;
  onClose: () => void;
}

export default function FileDetailsModal({ file, onClose }: Props) {
  if (!file) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/50 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-8 text-white relative">
            <button 
              onClick={onClose}
              className="absolute left-6 top-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                <FileText size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-black">تفاصيل ملف {file.fileNumber}</h2>
                <p className="text-indigo-100 font-medium">سنة {file.year}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <DetailItem 
                icon={<Briefcase className="text-indigo-500" />} 
                label="الشعبة" 
                value={file.department} 
              />
              <DetailItem 
                icon={<User className="text-indigo-500" />} 
                label="المستشار المختص" 
                value={file.consultantName} 
              />
              <DetailItem 
                icon={<Calendar className="text-indigo-500" />} 
                label="تاريخ الورود" 
                value={file.receivedDate} 
              />
              <DetailItem 
                icon={<Clock className="text-indigo-500" />} 
                label="تاريخ التسجيل" 
                value={new Date(file.createdAt).toLocaleDateString('ar-EG')} 
              />
            </div>

            <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100">
              <div className="flex items-center gap-2 mb-3">
                <FileSignature size={20} className="text-indigo-600" />
                <h3 className="font-bold text-slate-800">رأي المستشار رئيس الفرع</h3>
              </div>
              <p className="text-slate-600 leading-relaxed font-medium">
                {file.headOpinion}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-slate-800">موضوع القضية</h3>
              <p className="text-slate-600 leading-relaxed">
                {file.subject}
              </p>
            </div>
          </div>

          <div className="p-8 border-t border-slate-100 flex justify-end">
            <button 
              onClick={onClose}
              className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors shadow-lg"
            >
              إغلاق النافذة
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="mt-1">{icon}</div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase mb-1">{label}</p>
        <p className="font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}