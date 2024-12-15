export interface Project {
    id: string;
    name: string;
    description: string;
    taskCount: number;
    status: 'active' | 'complete'; 
    created_at: string; 
  }
  