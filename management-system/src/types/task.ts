export interface Task {
    id: string; 
    project_id: string; 
    name: string; 
    executor: string; 
    status: 'to-do' | 'in-progress' | 'done'; 
    due_date: string; 
  }
  