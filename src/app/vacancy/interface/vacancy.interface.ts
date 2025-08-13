export interface Vacancy {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  tags: string[];
  isActive: boolean;
  firmID: string;
}
