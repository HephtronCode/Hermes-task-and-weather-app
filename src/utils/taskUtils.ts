
import { Task, Priority } from "../types/task";

// Generate a unique ID for tasks
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Get tasks from local storage
export const getTasks = (): Task[] => {
  const tasksJson = localStorage.getItem("tasks");
  return tasksJson ? JSON.parse(tasksJson) : [];
};

// Save tasks to local storage
export const saveTasks = (tasks: Task[]): void => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Add a new task
export const addTask = (
  title: string,
  description: string,
  priority: Priority,
  dueDate: string | null
): Task => {
  const newTask: Task = {
    id: generateId(),
    title,
    description,
    completed: false,
    priority,
    dueDate,
    createdAt: new Date().toISOString(),
  };

  const tasks = getTasks();
  saveTasks([...tasks, newTask]);
  return newTask;
};

// Delete a task
export const deleteTask = (id: string): void => {
  const tasks = getTasks();
  saveTasks(tasks.filter((task) => task.id !== id));
};

// Toggle task completion status
export const toggleTaskCompletion = (id: string): Task[] => {
  const tasks = getTasks();
  const updatedTasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks(updatedTasks);
  return updatedTasks;
};

// Update a task
export const updateTask = (updatedTask: Task): Task[] => {
  const tasks = getTasks();
  const updatedTasks = tasks.map((task) =>
    task.id === updatedTask.id ? updatedTask : task
  );
  saveTasks(updatedTasks);
  return updatedTasks;
};

// Filter tasks based on completion status and priority
export const filterTasks = (
  tasks: Task[],
  showCompleted: boolean,
  priorityFilter: Priority | "all"
): Task[] => {
  return tasks.filter((task) => {
    const matchesCompletionFilter = showCompleted || !task.completed;
    const matchesPriorityFilter =
      priorityFilter === "all" || task.priority === priorityFilter;
    return matchesCompletionFilter && matchesPriorityFilter;
  });
};

// Sort tasks by due date, priority, and completion status
export const sortTasks = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    // First, sort by completion status
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Then by due date (if available)
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    
    // Tasks with due dates come before tasks without due dates
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;
    
    // Then by priority
    const priorityOrder: Record<Priority, number> = {
      high: 0,
      medium: 1,
      low: 2,
    };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
};
