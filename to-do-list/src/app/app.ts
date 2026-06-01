import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="todo-container">
      <h1>📝 Todo List</h1>
      
      <div class="add-todo">
        <input 
          type="text" 
          [(ngModel)]="newTodoTitle"
          (keyup.enter)="addTodo()"
          placeholder="Enter a new task..."
          class="todo-input"
        />
        <button (click)="addTodo()" class="add-btn">Add</button>
      </div>

      <div class="todo-list">
        <div *ngFor="let todo of todos" class="todo-item">
          <input 
            type="checkbox" 
            [(ngModel)]="todo.completed"
            class="todo-checkbox"
          />
          <span [class.completed]="todo.completed" class="todo-title">
            {{ todo.title }}
          </span>
          <button (click)="deleteTodo(todo.id)" class="delete-btn">🗑️</button>
        </div>
      </div>

      <div class="stats" *ngIf="todos.length > 0">
        <p>Total: {{ todos.length }} | 
           Completed: {{ getCompletedCount() }} | 
           Pending: {{ getPendingCount() }}
        </p>
      </div>
      
      <div class="empty-state" *ngIf="todos.length === 0">
        <p>🎉 No tasks! Add one above to get started.</p>
      </div>
    </div>
  `,
  styles: [`
    .todo-container {
      max-width: 500px;
      margin: 50px auto;
      padding: 20px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: white;
      border-radius: 10px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }
    h1 {
      text-align: center;
      color: #333;
      margin-bottom: 20px;
    }
    .add-todo {
      display: flex;
      gap: 10px;
      margin-bottom: 30px;
    }
    .todo-input {
      flex: 1;
      padding: 12px;
      font-size: 16px;
      border: 1px solid #ddd;
      border-radius: 5px;
      outline: none;
    }
    .todo-input:focus {
      border-color: #4CAF50;
    }
    .add-btn {
      padding: 12px 24px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
      transition: background-color 0.3s;
    }
    .add-btn:hover {
      background-color: #45a049;
    }
    .todo-list {
      margin-bottom: 20px;
      max-height: 400px;
      overflow-y: auto;
    }
    .todo-item {
      display: flex;
      align-items: center;
      padding: 12px;
      margin-bottom: 8px;
      background-color: #f9f9f9;
      border-radius: 5px;
      gap: 10px;
      transition: background-color 0.2s;
    }
    .todo-item:hover {
      background-color: #f0f0f0;
    }
    .todo-checkbox {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
    .todo-title {
      flex: 1;
      font-size: 16px;
      word-break: break-word;
    }
    .todo-title.completed {
      text-decoration: line-through;
      color: #888;
    }
    .delete-btn {
      padding: 5px 10px;
      background-color: #ff4444;
      color: white;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.3s;
    }
    .delete-btn:hover {
      background-color: #cc0000;
    }
    .stats {
      text-align: center;
      padding: 12px;
      background-color: #f0f0f0;
      border-radius: 5px;
      color: #666;
      font-size: 14px;
    }
    .empty-state {
      text-align: center;
      padding: 40px;
      color: #999;
      font-size: 18px;
    }
  `]
})
export class AppComponent {
  todos: Todo[] = [];
  newTodoTitle: string = '';
  private nextId: number = 1;

  addTodo(): void {
    if (this.newTodoTitle.trim()) {
      const newTodo: Todo = {
        id: this.nextId++,
        title: this.newTodoTitle.trim(),
        completed: false
      };
      this.todos.push(newTodo);
      this.newTodoTitle = '';
    }
  }

  deleteTodo(id: number): void {
    this.todos = this.todos.filter(todo => todo.id !== id);
  }

  getCompletedCount(): number {
    return this.todos.filter(todo => todo.completed).length;
  }

  getPendingCount(): number {
    return this.todos.filter(todo => !todo.completed).length;
  }
}