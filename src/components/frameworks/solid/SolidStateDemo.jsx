// Solid.js State Management Demo
import { createSignal, createMemo, createEffect, For } from 'solid-js';

const SolidStateDemo = () => {
  const [todos, setTodos] = createSignal([
    { id: 1, text: 'Learn Solid.js', completed: true },
    { id: 2, text: 'Build reactive UI', completed: false },
    { id: 3, text: 'Deploy to production', completed: false }
  ]);
  
  const [newTodo, setNewTodo] = createSignal('');
  const [filter, setFilter] = createSignal('all'); // all, active, completed
  
  const completedCount = createMemo(() => 
    todos().filter(todo => todo.completed).length
  );
  
  const activeCount = createMemo(() => 
    todos().filter(todo => !todo.completed).length
  );
  
  const filteredTodos = createMemo(() => {
    const filter_type = filter();
    return todos().filter(todo => {
      if (filter_type === 'active') return !todo.completed;
      if (filter_type === 'completed') return todo.completed;
      return true;
    });
  });
  
  createEffect(() => {
    console.log(`Total todos: ${todos().length}, Completed: ${completedCount()}, Active: ${activeCount()}`);
  });
  
  const addTodo = () => {
    const text = newTodo().trim();
    if (text) {
      setTodos(prev => [
        ...prev,
        { id: Date.now(), text, completed: false }
      ]);
      setNewTodo('');
    }
  };
  
  const toggleTodo = (id) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };
  
  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };
  
  const clearCompleted = () => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  };
  
  const markAllComplete = () => {
    const hasIncomplete = todos().some(todo => !todo.completed);
    setTodos(prev => prev.map(todo => ({ ...todo, completed: hasIncomplete })));
  };

  return (
    <div class="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
      <div class="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
        <h3 class="text-2xl font-bold text-white mb-2">Solid.js Todo Manager</h3>
        <p class="text-blue-100">Fine-grained reactivity in action</p>
      </div>
      
      <div class="p-6">
        {/* Add Todo Form */}
        <div class="flex gap-3 mb-6">
          <input
            type="text"
            value={newTodo()}
            onInput={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Add a new todo..."
            class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={addTodo}
            class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add
          </button>
        </div>
        
        {/* Filter Buttons */}
        <div class="flex gap-2 mb-6">
          <For each={['all', 'active', 'completed']}>
            {(filterType) => (
              <button
                onClick={() => setFilter(filterType)}
                class={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 capitalize ${
                  filter() === filterType
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {filterType}
              </button>
            )}
          </For>
        </div>
        
        {/* Todo List */}
        <div class="space-y-2 mb-6">
          <For each={filteredTodos()}>
            {(todo) => (
              <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span
                  class={`flex-1 ${
                    todo.completed
                      ? 'line-through text-gray-500 dark:text-gray-400'
                      : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {todo.text}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  class="px-3 py-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            )}
          </For>
        </div>
        
        {/* Stats and Actions */}
        <div class="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-600">
          <div class="text-sm text-gray-600 dark:text-gray-400">
            <span class="font-medium">{activeCount()}</span> active, 
            <span class="font-medium ml-1">{completedCount()}</span> completed
          </div>
          <div class="flex gap-2">
            <button
              onClick={markAllComplete}
              class="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
            >
              Toggle All
            </button>
            {completedCount() > 0 && (
              <button
                onClick={clearCompleted}
                class="px-3 py-1 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
              >
                Clear Completed
              </button>
            )}
          </div>
        </div>
        
        {/* Reactivity Demo */}
        <div class="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
          <h4 class="font-semibold text-gray-800 dark:text-white mb-2">Reactive Computations:</h4>
          <div class="grid grid-cols-3 gap-4 text-center">
            <div class="p-2 bg-white dark:bg-gray-800 rounded">
              <div class="text-lg font-bold text-blue-600">{todos().length}</div>
              <div class="text-xs text-gray-600 dark:text-gray-400">Total</div>
            </div>
            <div class="p-2 bg-white dark:bg-gray-800 rounded">
              <div class="text-lg font-bold text-green-600">{completedCount()}</div>
              <div class="text-xs text-gray-600 dark:text-gray-400">Done</div>
            </div>
            <div class="p-2 bg-white dark:bg-gray-800 rounded">
              <div class="text-lg font-bold text-orange-600">{activeCount()}</div>
              <div class="text-xs text-gray-600 dark:text-gray-400">Pending</div>
            </div>
          </div>
          <p class="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
            Values update automatically with fine-grained reactivity ⚡
          </p>
        </div>
      </div>
    </div>
  );
};

export default SolidStateDemo;
