import React from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import axios from 'axios';
import { TodoItem } from './types';
import { FaCheck, FaTrash } from 'react-icons/fa';

const ToDoList: React.FC = () => {
  // const queryClient = useQueryClient();

  // Define todos as an empty array
  const todos: TodoItem[] = [];

  // Fix the implicit any type error
  // const toggleTodoMutation = useMutation({
  //   mutationFn: async (todoId: number) => {
  //     await axios.patch(`/api/v1/mentor/todos/${todoId}/toggle`);
  //   },
  //   onSuccess: () => {
  //     // queryClient.invalidateQueries({ queryKey: ['todos'] });
  //   },
  // });

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">To-Do List</h3>
      <div className="space-y-3">
        {todos?.map((todo: TodoItem) => (
          <div
            key={todo.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <button
                // onClick={() => toggleTodoMutation.mutate(todo.id)}
                className={`p-2 rounded-full ${
                  todo.completed
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                <FaCheck className="w-4 h-4" />
              </button>
              <div>
                <p
                  className={`text-sm ${
                    todo.completed ? 'text-gray-400 line-through' : 'text-gray-900'
                  }`}
                >
                  {todo.title}
                </p>
                {todo.dueDate && (
                  <p className="text-xs text-gray-500">
                    Due: {new Date(todo.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            <button
              className="p-2 text-red-500 hover:text-red-700"
            >
              <FaTrash className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToDoList; 