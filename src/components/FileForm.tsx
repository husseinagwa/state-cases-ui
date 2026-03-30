import React, { useState } from 'react';
import { Calendar, User, BookOpen, MessageCircle, Layers, Send } from 'lucide-react';
import { Department, FileRecord } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

interface Props {
  onSubmit: (file: Omit<FileRecord, 'id' | 'createdAt'>) => void;
}

const DEPARTMENTS: Department[] = ['القضايا المدنية', 'القضايا الإدارية', 'قضايا الضرائب', 'قضايا العمال', 'قضايا التعويضات'];
const CONSULTANTS = ['أحمد محمود علي', 'محمد إبراهيم السيد', 'سارة حسن الجزار', 'محمود عبد العزيز', 'فاطمة الزهراء'];
const OPINIONS = ['يتم السير في الإجراءات', 'تحت المراجعة القانونية', 'يتم حفظ الملف مؤقتاً', 'مطلوب استكمال مستندات', 'تم التوجيه بالإحالة'];

export default function FileForm({ onSubmit }: Props) {
  const [formData, setFormData] = useState({
    fileNumber: '',
    year: new Date().getFullYear().toString(),
    department: DEPARTMENTS[0],
    consultantName: '',
    headOpinion: '',
    receivedDate: new Date().toISOString().split('T')[0],
    subject: '',
    status: 'تحت الدراسة' as FileRecord['status']
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* File Number */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <BookOpen size={16} className="text-indigo-500" />
            رقم الملف
          </label>
          <input
            required
            type="text"
            className={cn(
              "w-full px-4 py-3 rounded-xl border bg-slate-50 transition-all outline-none",
              focusedField === 'fileNumber' ? "border-indigo-500 ring-4 ring-indigo-50 shadow-lg" : "border-slate-200"
            )}
            onFocus={() => setFocusedField('fileNumber')}
            onBlur={() => setFocusedField(null)}
            placeholder="مثال: 1234/2024"
            value={formData.fileNumber}
            onChange={e => setFormData({ ...formData, fileNumber: e.target.value })}
          />
        </div>

        {/* Year */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <Calendar size={16} className="text-indigo-500" />
            السنة القضائية
          </label>
          <input
            required
            type="number"
            className={cn(
              "w-full px-4 py-3 rounded-xl border bg-slate-50 transition-all outline-none",
              focusedField === 'year' ? "border-indigo-500 ring-4 ring-indigo-50" : "border-slate-200"
            )}
            onFocus={() => setFocusedField('year')}
            onBlur={() => setFocusedField(null)}
            value={formData.year}
            onChange={e => setFormData({ ...formData, year: e.target.value })}
          />
        </div>

        {/* Department */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <Layers size={16} className="text-indigo-500" />
            الشعبة المختصة
          </label>
          <select
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-4 focus:ring-indigo-50 transition-all"
            value={formData.department}
            onChange={e => setFormData({ ...formData, department: e.target.value as Department })}
          >
            {DEPARTMENTS.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        {/* Consultant Autocomplete Mockup */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <User size={16} className="text-indigo-500" />
            المستشار
          </label>
          <div className="relative">
            <input
              required
              type="text"
              className={cn(
                "w-full px-4 py-3 rounded-xl border bg-slate-50 transition-all outline-none",
                focusedField === 'consultant' ? "border-indigo-500 ring-4 ring-indigo-50" : "border-slate-200"
              )}
              onFocus={() => setFocusedField('consultant')}
              onBlur={() => setTimeout(() => setFocusedField(null), 200)}
              value={formData.consultantName}
              onChange={e => setFormData({ ...formData, consultantName: e.target.value })}
              placeholder="ابحث عن اسم المستشار..."
            />
            {focusedField === 'consultant' && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute z-20 w-full mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden"
              >
                {CONSULTANTS.filter(c => c.includes(formData.consultantName)).map(c => (
                  <button
                    key={c}
                    type="button"
                    className="w-full text-right px-4 py-2 hover:bg-indigo-50 text-sm transition-colors"
                    onClick={() => setFormData({ ...formData, consultantName: c })}
                  >
                    {c}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Head Opinion Autocomplete */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <MessageCircle size={16} className="text-indigo-500" />
            رأي المستشار رئيس الفرع
          </label>
          <div className="relative">
             <input
              required
              type="text"
              className={cn(
                "w-full px-4 py-3 rounded-xl border bg-slate-50 transition-all outline-none",
                focusedField === 'opinion' ? "border-indigo-500 ring-4 ring-indigo-50" : "border-slate-200"
              )}
              onFocus={() => setFocusedField('opinion')}
              onBlur={() => setTimeout(() => setFocusedField(null), 200)}
              value={formData.headOpinion}
              onChange={e => setFormData({ ...formData, headOpinion: e.target.value })}
              placeholder="اختر أو اكتب رأي المستشار رئيس الفرع..."
            />
            {focusedField === 'opinion' && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute z-20 w-full mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden"
              >
                {OPINIONS.map(o => (
                  <button
                    key={o}
                    type="button"
                    className="w-full text-right px-4 py-2 hover:bg-indigo-50 text-sm transition-colors"
                    onClick={() => setFormData({ ...formData, headOpinion: o })}
                  >
                    {o}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Subject */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-bold text-slate-700">موضوع الملف</label>
          <textarea
            required
            rows={3}
            className={cn(
              "w-full px-4 py-3 rounded-xl border bg-slate-50 transition-all outline-none resize-none",
              focusedField === 'subject' ? "border-indigo-500 ring-4 ring-indigo-50" : "border-slate-200"
            )}
            onFocus={() => setFocusedField('subject')}
            onBlur={() => setFocusedField(null)}
            value={formData.subject}
            onChange={e => setFormData({ ...formData, subject: e.target.value })}
          />
        </div>

        {/* Received Date */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">تاريخ الورود</label>
          <input
            type="date"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-4 focus:ring-indigo-50"
            value={formData.receivedDate}
            onChange={e => setFormData({ ...formData, receivedDate: e.target.value })}
          />
        </div>

        {/* Status */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">الحالة الأولية</label>
          <select
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-4 focus:ring-indigo-50"
            value={formData.status}
            onChange={e => setFormData({ ...formData, status: e.target.value as FileRecord['status'] })}
          >
            <option value="تحت الدراسة">تحت الدراسة</option>
            <option value="نشط">نشط</option>
            <option value="مؤجل">مؤجل</option>
          </select>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100">
        <button
          type="submit"
          className="w-full md:w-auto px-12 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-200"
        >
          <Send size={20} />
          تسجيل الملف في النظام
        </button>
      </div>
    </form>
  );
}