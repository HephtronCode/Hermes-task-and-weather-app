
import React, { useState, useEffect } from "react";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import { Task, Priority } from "@/types/task";
import { addTask, getTasks, deleteTask, toggleTaskCompletion, updateTask, filterTasks, sortTasks } from "@/utils/taskUtils";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showCompleted, setShowCompleted] = useState(true);
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { toast } = useToast();

  // Load tasks on mount
  useEffect(() => {
    setTasks(getTasks());
  }, []);

  // Filter and sort tasks
  const filteredTasks = sortTasks(
    filterTasks(tasks, showCompleted, priorityFilter)
  );

  const handleAddTask = (title: string, description: string, priority: Priority, dueDate: string | null) => {
    const newTask = addTask(title, description, priority, dueDate);
    setTasks([...tasks, newTask]);
    setIsFormVisible(false);
    toast({
      title: "Task added",
      description: "Your new task has been created",
    });
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
    setTasks(tasks.filter((task) => task.id !== id));
    toast({
      title: "Task deleted",
      description: "The task has been removed",
    });
  };

  const handleToggleComplete = (id: string) => {
    const updatedTasks = toggleTaskCompletion(id);
    setTasks(updatedTasks);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormVisible(true);
  };

  const handleUpdateTask = (title: string, description: string, priority: Priority, dueDate: string | null) => {
    if (!editingTask) return;

    const updatedTask = {
      ...editingTask,
      title,
      description,
      priority,
      dueDate,
    };

    const updatedTasks = updateTask(updatedTask);
    setTasks(updatedTasks);
    setEditingTask(null);
    setIsFormVisible(false);
    toast({
      title: "Task updated",
      description: "The task has been updated successfully",
    });
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setIsFormVisible(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
          {!isFormVisible && (
            <button
              onClick={() => setIsFormVisible(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add New Task
            </button>
          )}
        </div>

        {isFormVisible && (
          <TaskForm
            onSubmit={editingTask ? handleUpdateTask : handleAddTask}
            onCancel={handleCancelEdit}
            initialTask={editingTask || undefined}
            isEditing={!!editingTask}
          />
        )}

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
