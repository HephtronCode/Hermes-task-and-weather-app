
import React from "react";
import { Task } from "../types/task";

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const TaskItem = ({ task, onToggleComplete, onDelete, onEdit }: TaskItemProps) => {
  const priorityColors = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isOverdue = () => {
    if (!task.dueDate || task.completed) return false;
    return new Date(task.dueDate) < new Date();
  };

  return (
    <div className={`mb-3 p-4 border rounded-lg shadow-sm transition-all duration-200 
      ${task.completed ? "bg-gray-50 opacity-70" : "bg-white"}
      ${isOverdue() ? "border-red-300" : "border-gray-200"}
      hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start flex-1">
          <div className="mr-3 pt-1">
            <button
              onClick={() => onToggleComplete(task.id)}
              className={`h-5 w-5 rounded-full border flex items-center justify-center
                ${task.completed 
                  ? "bg-green-500 border-green-500 text-white" 
                  : "border-gray-300 hover:border-green-500"}`}
            >
              {task.completed && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
            </button>
          </div>
          <div className="flex-1 pr-2">
            <h3 className={`font-medium text-gray-900 ${task.completed && "line-through text-gray-500"}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className={`text-sm mt-1 ${task.completed ? "text-gray-400" : "text-gray-600"}`}>
                {task.description}
              </p>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
              {task.dueDate && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  isOverdue() 
                    ? "bg-red-100 text-red-800" 
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {isOverdue() ? "Overdue: " : "Due: "}
                  {formatDate(task.dueDate)}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => onEdit(task)}
            className="text-gray-500 hover:text-blue-600 p-1"
            aria-label="Edit task"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-gray-500 hover:text-red-600 p-1"
            aria-label="Delete task"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
