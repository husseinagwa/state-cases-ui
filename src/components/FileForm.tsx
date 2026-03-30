import React, { useState, useEffect, useRef } from 'react';
import { CaseFile, DivisionType } from '../types';
import { X, Search, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FileFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData: CaseFile | null;
  existingAdvisors: string[];
  existingOpinions: string[];
}

export const FileForm: React.FC<FileFormProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData,
  existingAdvisors,
  existingOpinions
}) => {
  const [formData, setFormData] = useState<Partial<CaseFile>>({
    advisorName: '',
    division: 'الاستئناف',
    caseNumber: '',
    year: new Date().getFullYear().toString(),
    plaintiff: '',
    defendant: '',
    displayDate: new Date().toISOString().split('T')[0],
    headOpinion: '',
  });

  const [advisorSearch, setAdvisorSearch] = useState('');
  const [opinionSearch, setOpinionSearch] = useState('');
  const [showAdvisorList, setShowAdvisorList] = useState(false);
  const [showOpinionList, setShowOpinionList] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setAdvisorSearch(initialData.advisorName);
      setOpinionSearch(initialData.headOpinion);
    } else {
      setFormData({
        advisorName: '',
        division: 'الاستئناف',
        caseNumber: '',
        year: new Date().getFullYear().toString(),
        plaintiff: '',
        defendant: '',
        displayDate: new Date().toISOString().split('T')[0],
        headOpinion: '',
      });
      setAdvisorSearch('');
      setOpinionSearch('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, advisorName: advisorSearch, headOpinion: opinionSearch });
  };

  const filteredAdvisors = existingAdvisors.filter(a => a.includes(advisorSearch));
  const filteredOpinions = existingOpinions.filter(o => o.includes(opinionSearch));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800">
            {initialData ? 'تعديل بيانات الملف' : 'إضافة ملف جديد'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1">المستشار</label>
            <input 
              type="text"
              required
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={advisorSearch}
              onChange={(e) => { setAdvisorSearch(e.target.value); setShowAdvisorList(true); }}
              onFocus={() => setShowAdvisorList(true)}
              placeholder="اكتب اسم المستشار..."
            />
            {showAdvisorList && filteredAdvisors.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-40 overflow-auto">
                {filteredAdvisors.map(name => (
                  <button
                    key={name}
                    type="button"
                    className="w-full text-right px-4 py-2 hover:bg-slate-50 text-slate-700 text-sm border-b border-slate-50 last:border-0"
                    onClick={() => { setAdvisorSearch(name); setShowAdvisorList(false); }}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">الشعبة</label>
            <select 
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.division}
              onChange={(e) => setFormData({...formData, division: e.target.value as any})}
            >
              <option value="الاستئناف">الاستئناف</option>
              <option value="الكليات">الكليات</option>
              <option value="الجزئيات">الجزئيات</option>
              <option value="التنفيذ">التنفيذ</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">تاريخ العرض</label>
            <input 
              type="date"
              required
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.displayDate}
              onChange={(e) => setFormData({...formData, displayDate: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">رقم الدعوي</label>
            <input 
              type="text"
              required
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.caseNumber}
              onChange={(e) => setFormData({...formData, caseNumber: e.target.value})}
              placeholder="مثال: 1234"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">لسنة</label>
            <input 
              type="number"
              required
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.year}
              onChange={(e) => setFormData({...formData, year: e.target.value})}
              placeholder="2024"
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-semibold text-slate-700 mb-1">المدعي</label>
            <input 
              type="text"
              required
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.plaintiff}
              onChange={(e) => setFormData({...formData, plaintiff: e.target.value})}
              placeholder="اسم المدعي"
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-semibold text-slate-700 mb-1">المدعي عليه</label>
            <input 
              type="text"
              required
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.defendant}
              onChange={(e) => setFormData({...formData, defendant: e.target.value})}
              placeholder="اسم المدعي عليه"
            />
          </div>

          <div className="md:col-span-2 relative">
            <label className="block text-sm font-semibold text-slate-700 mb-1">رأي المستشار رئيس الفرع</label>
            <textarea 
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
              value={opinionSearch}
              onChange={(e) => { setOpinionSearch(e.target.value); setShowOpinionList(true); }}
              onFocus={() => setShowOpinionList(true)}
              placeholder="اكتب الرأي القانوني هنا..."
            />
            {showOpinionList && filteredOpinions.length > 0 && (
              <div className="absolute z-10 w-full bottom-full mb-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-40 overflow-auto">
                {filteredOpinions.map(opinion => (
                  <button
                    key={opinion}
                    type="button"
                    className="w-full text-right px-4 py-2 hover:bg-slate-50 text-slate-700 text-sm border-b border-slate-50 last:border-0"
                    onClick={() => { setOpinionSearch(opinion); setShowOpinionList(false); }}
                  >
                    {opinion}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-2 flex gap-3 mt-4">
            <button 
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
            >
              {initialData ? 'حفظ التعديلات' : 'إضافة الملف'}
            </button>
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all"
            >
              إلغاء
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};