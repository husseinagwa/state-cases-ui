import React from 'react';
import { CaseFile } from '../types';
import { LOGO_URL } from '../lib/utils';

interface PrintTemplateProps {
  files: CaseFile[];
}

export const PrintTemplate: React.FC<PrintTemplateProps> = ({ files }) => {
  const now = new Date().toLocaleString('ar-EG');

  return (
    <div id="print-area" className="p-8 bg-white text-black rtl" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-slate-900 pb-6 mb-8">
        <div className="text-right">
          <h1 className="text-2xl font-bold">هيئة قضايا الدولة</h1>
          <h2 className="text-xl">فرع دمنهور</h2>
          <p className="text-sm mt-2 text-slate-600">تاريخ الطباعة: {now}</p>
        </div>
        <img src={LOGO_URL} alt="Logo" className="w-24 h-24 object-contain" />
      </div>

      <h3 className="text-center text-2xl font-bold mb-8 underline decoration-double">بيان الملفات المعروضة</h3>

      <table className="w-full border-collapse border border-slate-900">
        <thead>
          <tr className="bg-slate-100">
            <th className="border border-slate-900 p-2 text-sm">م</th>
            <th className="border border-slate-900 p-2 text-sm">المستشار</th>
            <th className="border border-slate-900 p-2 text-sm">الشعبة</th>
            <th className="border border-slate-900 p-2 text-sm">رقم الدعوي / السنة</th>
            <th className="border border-slate-900 p-2 text-sm">المدعي</th>
            <th className="border border-slate-900 p-2 text-sm">المدعي عليه</th>
            <th className="border border-slate-900 p-2 text-sm">تاريخ العرض</th>
            <th className="border border-slate-900 p-2 text-sm">رأي رئيس الفرع</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => (
            <tr key={file.id}>
              <td className="border border-slate-900 p-2 text-xs text-center">{index + 1}</td>
              <td className="border border-slate-900 p-2 text-xs font-bold">{file.advisorName}</td>
              <td className="border border-slate-900 p-2 text-xs">{file.division}</td>
              <td className="border border-slate-900 p-2 text-xs text-center">{file.caseNumber} / {file.year}</td>
              <td className="border border-slate-900 p-2 text-xs">{file.plaintiff}</td>
              <td className="border border-slate-900 p-2 text-xs">{file.defendant}</td>
              <td className="border border-slate-900 p-2 text-xs text-center">{file.displayDate}</td>
              <td className="border border-slate-900 p-2 text-[10px] leading-tight">{file.headOpinion}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer */}
      <div className="mt-16 grid grid-cols-2 text-center">
        <div>
          <p className="font-bold">المختص</p>
          <div className="h-12"></div>
          <p>............................</p>
        </div>
        <div>
          <p className="font-bold">رئيس الفرع</p>
          <div className="h-12"></div>
          <p>............................</p>
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          @page {
            size: landscape;
            margin: 1cm;
          }
        }
      `}</style>
    </div>
  );
};