export interface Todo {
  id: string;
  description: string;
  extra?: string;
  isComplete: boolean;
  dueDate: string;
}
