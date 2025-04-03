
import React, { useState, useEffect } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { Task, Priority } from "../types/task";
import {
  getTasks,
  addTask,
  deleteTask,
  toggleTaskCompletion,
  updateTask,
  filterTasks,
  sortTasks,
} from "../utils/taskUtils";
import { toast } from "../components/ui/use-toast";

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [showCompleted, setShowCompleted] = useState(true);
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    setTasks(getTasks());
  }, []);

  // Apply filters and sorting when tasks or filters change
  useEffect(() => {
    const filtered = filterTasks(tasks, showCompleted, priorityFilter);
    const sorted = sortTasks(filtered);
    setFilteredTasks(sorted);
  }, [tasks, showCompleted, priorityFilter]);

  const handleAddTask = (
    title: string,
    description: string,
    priority: Priority,
    dueDate: string | null
  ) => {
    const newTask = addTask(title, description, priority, dueDate);
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setShowTaskForm(false);
    toast({
      title: "Task added",
      description: "Your new task has been created successfully.",
    });
  };

  const handleUpdateTask = (
    title: string,
    description: string,
    priority: Priority,
    dueDate: string | null
  ) => {
    if (!editingTask) return;

    const updatedTask: Task = {
      ...editingTask,
      title,
      description,
      priority,
      dueDate,
    };

    const updatedTasks = updateTask(updatedTask);
    setTasks(updatedTasks);
    setEditingTask(null);
    toast({
      title: "Task updated",
      description: "Your task has been updated successfully.",
    });
  };

  const handleToggleComplete = (id: string) => {
    const updatedTasks = toggleTaskCompletion(id);
    setTasks(updatedTasks);
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    toast({
      variant: "destructive",
      title: "Task deleted",
      description: "Your task has been deleted.",
    });
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setShowTaskForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Manager</h1>
          <p className="text-gray-600">Stay organized and get things done</p>
        </div>

        {/* Task Form Toggle Button */}
        {!editingTask && !showTaskForm && (
          <button
            onClick={() => setShowTaskForm(true)}
            className="w-full md:w-auto flex items-center justify-center space-x-2 mb-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Add New Task</span>
          </button>
        )}

        {/* Task Form (Add/Edit) */}
        {(showTaskForm || editingTask) && (
          <TaskForm
            onSubmit={editingTask ? handleUpdateTask : handleAddTask}
            onCancel={handleCancelEdit}
            initialTask={editingTask || undefined}
            isEditing={!!editingTask}
          />
        )}

        {/* Task List */}
        <TaskList
          tasks={filteredTasks}
          onToggleComplete={handleToggleComplete}
          onDelete={handleDeleteTask}
          onEdit={handleEditTask}
          showCompleted={showCompleted}
          setShowCompleted={setShowCompleted}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
        />
      </div>
    </div>
  );
};

export default Index;
