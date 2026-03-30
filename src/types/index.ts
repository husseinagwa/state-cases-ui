export type Department = 'القضايا المدنية' | 'القضايا الإدارية' | 'قضايا الضرائب' | 'قضايا العمال' | 'قضايا التعويضات';

export interface FileRecord {
  id: string;
  fileNumber: string;
  year: string;
  department: Department;
  consultantName: string;
  headOpinion: string;
  receivedDate: string;
  subject: string;
  status: 'نشط' | 'مؤجل' | 'محسوم' | 'تحت الدراسة';
  createdAt: string;
}

export interface DashboardStats {
  total: number;
  today: number;
  departments: Record<string, number>;
}