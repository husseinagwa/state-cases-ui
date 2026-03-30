export interface CaseFile {
  id: string;
  advisorName: string;
  division: "الاستئناف" | "الكليات" | "الجزئيات" | "التنفيذ";
  caseNumber: string;
  year: string;
  plaintiff: string;
  defendant: string;
  displayDate: string;
  headOpinion: string;
  createdAt: string;
}

export type DivisionType = CaseFile["division"];

// Alias for components using different names
export type FileRecord = CaseFile & {
  fileNumber: string; // for compatibility with FileManagementView
  department: string; // for compatibility with FileManagementView
  consultantName: string; // for compatibility with FileManagementView
  receivedDate: string; // for compatibility with FileManagementView
  status: 'نشط' | 'مؤجل' | 'محسوم' | 'تحت الدراسة';
  subject: string;
};

export interface DashboardStats {
  total: number;
  today: number;
  departments: Record<string, number>;
}