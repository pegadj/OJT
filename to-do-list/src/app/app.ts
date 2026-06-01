import { Component, signal, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Task {
  id: number;
  title: string;
  priority: 'High Priority' | 'Medium Priority' | 'Low Priority';
  completed: boolean;
}

type FilterType = 'All' | 'Completed' | 'Uncompleted';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FormsModule],
  template: `
    <div class="app-wrapper">
      <div class="phone-card">

        <!-- Header -->
        <div class="header">
          <span class="date-label">{{ getFormattedDate() }}</span>
          <h1 class="page-title">To-do List</h1>
        </div>

        <!-- Task List -->
        <div class="task-list">
          <div class="task-card" *ngFor="let task of filteredTasks()">
            <button class="check-btn" (click)="toggleTask(task.id)" [class.checked]="task.completed">
              <svg *ngIf="task.completed" width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div class="task-info">
              <span class="task-title" [class.done]="task.completed">{{ task.title }}</span>
            </div>
            <button class="remove-btn" (click)="removeTask(task.id)">&#x2715;</button>
          </div>

          <div class="empty-state" *ngIf="filteredTasks().length === 0">
            <p>🎉 No tasks! Add one below to get started.</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <button class="create-btn" (click)="openModal()">
            <span class="plus-icon">+</span> Create Task
          </button>
        </div>
      </div>

      <!-- Modal -->
      <div class="modal-overlay" *ngIf="showModal()" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <h2 class="modal-title">New Task</h2>
          <div class="form-group">
            <label class="form-label">Task Name</label>
            <input
              class="form-input"
              type="text"
              placeholder="Enter task name..."
              [value]="newTaskTitle()"
              (input)="updateNewTaskTitle($any($event.target).value)"
            />
          </div>
          <div class="modal-actions">
            <button class="cancel-btn" (click)="closeModal()">Cancel</button>
            <button class="confirm-btn" (click)="createTask()">Add Task</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :host {
      --bg: #d6d6d6;
      --card: #E8F5E9;
      --green: #2E7D32;
      --green-mid: #388E3C;
      --green-light: #A5D6A7;
      --high: #E8453C;
      --medium: #F59E0B;
      --low: #22C55E;
      --check-done: #2E7D32;
      --text: #1B2A1C;
      --sub: #6A8F6C;
      --border: #C8E6C9;
      --shadow: 0 2px 10px rgba(46,125,50,0.10);
      display: block;
      font-family: 'Montserrat', sans-serif;
      background: var(--bg);
      min-height: 100vh;
    }

    .app-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: var(--bg);
    }

    /* ── Card ── */
    .phone-card {
      display: inline-flex;
      flex-direction: column;
      width: 100%;
      max-width: 400px;
      background: var(--card);
      border-radius: 20px;
      padding: 28px 24px 24px;
      box-shadow: 0 8px 32px rgba(46,125,50,0.13);
    }

    /* ── Header ── */
    .header {
      display: flex;
      flex-direction: column;
      gap: 2px;
      margin-bottom: 22px;
    }
    .date-label {
      font-size: 11px;
      font-weight: 600;
      color: var(--sub);
      letter-spacing: 0.4px;
      text-transform: uppercase;
    }
    .page-title {
      font-size: 22px;
      font-weight: 800;
      color: var(--text);
      letter-spacing: -0.3px;
    }

    /* ── Task list ── */
    .task-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    /* ── Task card ── */
    .task-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 12px 12px 12px 14px;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: var(--shadow);
      overflow: hidden;
      animation: slideUp 0.22s ease both;
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .accent-bar {
      width: 4px;
      align-self: stretch;
      border-radius: 0 3px 3px 0;
      flex-shrink: 0;
    }
    .accent-bar.high   { background: var(--high); }
    .accent-bar.medium { background: var(--medium); }
    .accent-bar.low    { background: var(--low); }

    .check-btn {
      width: 20px; height: 20px;
      border-radius: 50%;
      border: 2px solid #C8E6C9;
      background: transparent;
      cursor: pointer; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.17s ease;
    }
    .check-btn:hover { border-color: var(--check-done); }
    .check-btn.checked { background: var(--check-done); border-color: var(--check-done); }

    .task-info { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
    .task-title {
      font-size: 13px; font-weight: 700;
      color: var(--text); line-height: 1.35;
      font-family: 'Montserrat', sans-serif;
    }
    .task-title.done {
      text-decoration: line-through;
      color: var(--sub);
      font-weight: 500;
    }
    .task-sub {
      font-size: 11px; color: var(--sub); font-weight: 500;
      font-family: 'Montserrat', sans-serif;
    }

    .remove-btn {
      background: none; border: none;
      font-size: 11px; color: #B0BEC5;
      cursor: pointer; flex-shrink: 0;
      padding: 4px 8px; line-height: 1;
      transition: color 0.15s; border-radius: 6px;
    }
    .remove-btn:hover { color: #78909C; }

    .empty-state {
      display: flex; align-items: center; justify-content: center;
      padding: 36px 0;
      color: var(--sub); font-size: 12.5px; font-weight: 600;
      font-family: 'Montserrat', sans-serif;
    }

    /* ── Footer ── */
    .footer {
      padding: 20px 0 0;
      display: flex;
      justify-content: center;
    }
    .create-btn {
      display: flex; align-items: center; gap: 6px;
      background: var(--green); color: white;
      border: none; border-radius: 30px;
      padding: 12px 30px;
      font-family: 'Montserrat', sans-serif;
      font-size: 13.5px; font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(46,125,50,0.30);
      transition: background 0.17s, box-shadow 0.17s, transform 0.13s;
      letter-spacing: 0.2px;
    }
    .create-btn:hover {
      background: var(--green-mid);
      box-shadow: 0 6px 20px rgba(46,125,50,0.38);
      transform: translateY(-1px);
    }
    .create-btn:active { transform: translateY(0); }
    .plus-icon { font-size: 17px; line-height: 1; font-weight: 400; }

    /* ── Modal ── */
    .modal-overlay {
      position: fixed; inset: 0;
      background: rgba(15,23,42,0.30);
      backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center;
      z-index: 100;
      animation: fadeIn 0.17s ease;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    .modal {
      background: #fff; border-radius: 22px;
      padding: 28px 24px; width: 90%; max-width: 340px;
      box-shadow: 0 20px 60px rgba(15,23,42,0.14);
      animation: popIn 0.2s cubic-bezier(0.34,1.56,0.64,1);
    }
    @keyframes popIn {
      from { opacity: 0; transform: scale(0.93) translateY(8px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }

    .modal-title {
      font-size: 17px; font-weight: 800; color: var(--text);
      margin-bottom: 20px; font-family: 'Montserrat', sans-serif;
    }
    .form-group  { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
    .form-label  {
      font-size: 10.5px; font-weight: 700; color: var(--sub);
      text-transform: uppercase; letter-spacing: 0.6px;
      font-family: 'Montserrat', sans-serif;
    }
    .form-input, .form-select {
      font-family: 'Montserrat', sans-serif; font-size: 13px; color: var(--text);
      background: #F1F8F1; border: 1.5px solid var(--border);
      border-radius: 10px; padding: 10px 13px;
      outline: none;
      transition: border-color 0.17s, box-shadow 0.17s;
      appearance: none; -webkit-appearance: none;
    }
    .form-input::placeholder { color: #A5C8A7; }
    .form-input:focus, .form-select:focus {
      border-color: var(--green);
      box-shadow: 0 0 0 3px rgba(46,125,50,0.10);
    }

    .modal-actions { display: flex; gap: 10px; margin-top: 22px; }
    .cancel-btn {
      flex: 1; font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 700;
      color: var(--sub); background: #F1F8F1;
      border: none; border-radius: 30px; padding: 11px;
      cursor: pointer; transition: background 0.15s;
    }
    .cancel-btn:hover { background: #C8E6C9; }
    .confirm-btn {
      flex: 1; font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 700;
      color: white; background: var(--green);
      border: none; border-radius: 30px; padding: 11px;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(46,125,50,0.28);
      transition: background 0.17s, box-shadow 0.17s;
    }
    .confirm-btn:hover { background: var(--green-mid); box-shadow: 0 6px 18px rgba(46,125,50,0.36); }
  `]
})
export class App {
  // ── original, untouched ──
  protected readonly title = signal('to-do-list');

  // ── task-list UI state ──
  today = signal(new Date());
  activeFilter = signal<FilterType>('All');
  showModal = signal(false);
  newTaskTitle = signal('');
  newTaskPriority = signal<Task['priority']>('Medium Priority');

  tasks = signal<Task[]>([]);

  filteredTasks = computed(() => {
    const filter = this.activeFilter();
    return this.tasks().filter(t => {
      if (filter === 'Completed') return t.completed;
      if (filter === 'Uncompleted') return !t.completed;
      return true;
    });
  });

  getFormattedDate(): string {
    return this.today().toLocaleDateString('en-GB', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    }).replace(/\//g, '.');
  }

  setFilter(filter: FilterType) { this.activeFilter.set(filter); }
  setFilterFromString(filter: string) { this.activeFilter.set(filter as FilterType); }

  toggleTask(id: number) {
    this.tasks.update(tasks => tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }

  removeTask(id: number) {
    this.tasks.update(tasks => tasks.filter(t => t.id !== id));
  }

  openModal() {
    this.newTaskTitle.set('');
    this.newTaskPriority.set('Medium Priority');
    this.showModal.set(true);
  }

  closeModal() { this.showModal.set(false); }

  createTask() {
    const title = this.newTaskTitle().trim();
    if (!title) return;
    this.tasks.update(tasks => [...tasks, {
      id: Date.now(), title, priority: this.newTaskPriority(), completed: false
    }]);
    this.closeModal();
  }

  updateNewTaskTitle(value: string) { this.newTaskTitle.set(value); }
  updateNewTaskPriority(value: string) { this.newTaskPriority.set(value as Task['priority']); }
}