import React from 'react';
import { CaseFile } from '../types';
import { FileText, Users, Calendar, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardProps {
  files: CaseFile[];
}

export const Dashboard: React.FC<DashboardProps> = ({ files }) => {
  const today = new Date().toISOString().split('T')[0];
  const filesToday = files.filter(f => f.displayDate === today).length;
  const totalFiles = files.length;

  const divisionStats = {
    'الاستئناف': files.filter(f => f.division === 'الاستئناف').length,
    'الكليات': files.filter(f => f.division === 'الكليات').length,
    'الجزئيات': files.filter(f => f.division === 'الجزئيات').length,
    'التنفيذ': files.filter(f => f.division === 'التنفيذ').length,
  };

  const stats = [
    { label: 'ملفات اليوم', value: filesToday, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'إجمالي الملفات', value: totalFiles, icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'شعبة الاستئناف', value: divisionStats['الاستئناف'], icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'شعبة الكليات', value: divisionStats['الكليات'], icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between"
        >
          <div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <p className="text-3xl font-bold mt-1 text-slate-800">{stat.value}</p>
          </div>
          <div className={`${stat.bg} ${stat.color} p-4 rounded-xl`}>
            <stat.icon size={24} />
          </div>
        </motion.div>
      ))}
    </div>
  );
};