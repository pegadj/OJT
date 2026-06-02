<<<<<<< Updated upstream
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
=======
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Main } from './main/main';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, Main],
  template: `
    <app-main></app-main>

    <div class="todo-container">
      <h1> To-do List </h1>
      
      <div class="add-todo">
        <input 
          type="text" 
          [(ngModel)]="newTodoTitle"
          (keyup.enter)="addTodo()"
          placeholder="Enter a new task..."
          class="todo-input"
        />
        <button (click)="addTodo()" class="add-icon-btn" aria-label="Add todo">
          <img 
            src="https://img.icons8.com/?size=100&id=40097&format=png&color=000000" 
            alt="Add"
          />
        </button>
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
          <button (click)="deleteTodo(todo.id)" class="delete-icon-btn" aria-label="Delete todo">
            <img 
              src="https://img.icons8.com/?size=100&id=nerFBdXcYDve&format=png&color=000000" 
              alt="Delete"
            />
          </button>
        </div>
      </div>

      <div class="stats" *ngIf="todos.length > 0">
        <p>Total: {{ todos.length }} | 
           Completed: {{ getCompletedCount() }} | 
           Pending: {{ getPendingCount() }}
        </p>
      </div>
      
      <div class="empty-state" *ngIf="todos.length === 0">
        <p> No tasks! Add one above to get started.</p>
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

    .add-icon-btn {
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;

      display: flex;
      align-items: center;
      justify-content: center;
    }

    .add-icon-btn img {
      width: 32px;
      height: 32px;
    }

    .add-icon-btn:hover img {
      transform: scale(1.1);
    }

    .add-icon-btn img {
      transition: transform 0.2s;
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

    .delete-icon-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-icon-btn img {
  width: 28px;
  height: 28px;
  transition: transform 0.2s;
}

.delete-icon-btn:hover img {
  transform: scale(1.1);
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
>>>>>>> Stashed changes
})
export class App {
  protected readonly title = signal('to-do-list');
}
