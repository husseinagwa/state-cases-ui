import React from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, CheckCircle2, AlertCircle, TrendingUp, Briefcase } from 'lucide-react';
import { DashboardStats } from '../types';
import { cn } from '../lib/utils';

interface Props {
  stats: DashboardStats;
}

export default function DashboardView({ stats }: Props) {
  const departments = Object.entries(stats.departments);

  return (
    <div className="space-y-8">
      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="إجمالي الملفات" 
          value={stats.total} 
          icon={<FileText className="text-blue-600" />} 
          color="blue"
          trend="+5.2%"
        />
        <StatCard 
          title="ملفات اليوم" 
          value={stats.today} 
          icon={<TrendingUp className="text-green-600" />} 
          color="green"
          trend="نشط"
        />
        <StatCard 
          title="قيد الدراسة" 
          value={Math.floor(stats.total * 0.4)} 
          icon={<AlertCircle className="text-orange-600" />} 
          color="orange"
          trend="24 ساعة"
        />
        <StatCard 
          title="محسومة مؤخراً" 
          value={Math.floor(stats.total * 0.2)} 
          icon={<CheckCircle2 className="text-indigo-600" />} 
          color="indigo"
          trend="+12"
        />
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Briefcase className="text-indigo-600" />
              توزيع الملفات حسب الشعب
            </h3>
          </div>
          <div className="space-y-6">
            {departments.map(([dept, count], index) => (
              <motion.div 
                key={dept}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-slate-700">{dept}</span>
                  <span className="text-indigo-600 font-bold">{count} ملف</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-indigo-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / (stats.total || 1)) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col justify-between overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">تحديثات النظام</h3>
            <p className="text-indigo-200 text-sm mb-6">آخر تحديث للبيانات كان منذ 5 دقائق</p>
            
            <div className="space-y-4">
              <UpdateItem text="تم أرشفة 12 ملف بنجاح" time="10:30 AM" />
              <UpdateItem text="طلب تقرير جديد من فرع دمنهور" time="09:45 AM" />
              <UpdateItem text="تحديث حالة قضية 556/2024" time="09:12 AM" />
            </div>
          </div>
          
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
          
          <button className="mt-8 bg-white/10 hover:bg-white/20 transition-colors w-full py-3 rounded-xl font-medium text-sm backdrop-blur-sm relative z-10">
            مشاهدة سجل النشاطات
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, trend }: { title: string; value: number; icon: React.ReactNode; color: string; trend: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50",
    green: "bg-green-50",
    orange: "bg-orange-50",
    indigo: "bg-indigo-50"
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between">
        <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110", colors[color])}>
          {icon}
        </div>
        <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-full">{trend}</span>
      </div>
      <div className="mt-4">
        <h4 className="text-slate-500 text-sm font-medium">{title}</h4>
        <div className="text-3xl font-black text-slate-900 mt-1">{value}</div>
      </div>
    </div>
  );
}

function UpdateItem({ text, time }: { text: string; time: string }) {
  return (
    <div className="flex gap-3 items-center">
      <div className="w-2 h-2 rounded-full bg-indigo-400" />
      <div>
        <p className="text-sm font-medium">{text}</p>
        <p className="text-[10px] text-indigo-300">{time}</p>
      </div>
    </div>
  );
}