
import React from "react";
import { Task, Priority } from "../types/task";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  showCompleted: boolean;
  setShowCompleted: (show: boolean) => void;
  priorityFilter: Priority | "all";
  setPriorityFilter: (priority: Priority | "all") => void;
}

const TaskList = ({
  tasks,
  onToggleComplete,
  onDelete,
  onEdit,
  showCompleted,
  setShowCompleted,
  priorityFilter,
  setPriorityFilter,
}: TaskListProps) => {
  const activeTaskCount = tasks.filter(task => !task.completed).length;
  const completedTaskCount = tasks.filter(task => task.completed).length;

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="text-sm text-gray-600">
          <span className="font-medium">{activeTaskCount}</span> active tasks
          {completedTaskCount > 0 && (
            <>, <span className="font-medium">{completedTaskCount}</span> completed</>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as Priority | "all")}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showCompleted}
              onChange={(e) => setShowCompleted(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
            <span className="text-sm text-gray-700">Show completed</span>
          </label>
        </div>
      </div>

      {tasks.length > 0 ? (
        <div>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg bg-gray-50">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
          <p className="mt-1 text-sm text-gray-500">
            {priorityFilter !== "all" || !showCompleted
              ? "Try changing your filters or add a new task"
              : "Get started by creating a new task"}
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskList;
