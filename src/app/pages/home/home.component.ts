import { CommonModule } from '@angular/common';
import { Component, computed, effect, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { Task } from '../../models/task.model';
import { take } from 'rxjs';

export enum Filters {
  All = 'All',
  Completed = 'Completed',
  Pending = 'Pending',
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {

  constructor() {
    // El effect es similar al computed, pero este no retorna nada. El computed crea otra signal
    effect(() => {
      console.log('Hola 2');
      const tasks = this.tasks();
      localStorage.setItem('tasks', JSON.stringify(tasks));
    })
  }

  ngOnInit() {
    console.log('Hola 1');
    const storageTasks = localStorage.getItem('tasks');
    if (storageTasks) {
      const tasks = JSON.parse(storageTasks);
      this.tasks.set(tasks);
    }
  }

  newTaskCtrl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3),
    ]
  });

  optionsFilter = Filters;
  filter = signal(Filters.All);

  // Todas las signals que esten en el computed, cuando cambien se va a ejecutar este codigo
  // Esto crea un nuevo signal, cuando otras cambien
  tasks = signal<Task[]>([]);
  tasksByFilter = computed(() => {
    const filter = this.filter();
    const tasks = this.tasks();

    switch(filter) {
      case this.optionsFilter.Pending:
        return tasks.filter(task => !task.completed);
      case this.optionsFilter.Completed:
        return tasks.filter(task => task.completed);
      default:
        return tasks;
    }
  });

  changeHandler() {
    const { valid, value } = this.newTaskCtrl;
    
    if (valid && value.trim() !== '') {
      this.addTask(value);
      this.newTaskCtrl.setValue('');
    }
  }

  addTask(title: string) {
    const newTask = {
      id: Date.now(), 
      title, 
      completed: false,
    };

    this.tasks.update((tasks) => [...tasks, newTask]);
  }

  changeFilter(newFilter: Filters) {
    this.filter.set(newFilter);
  }

  toogleStateTask(idTask: number) {
    this.tasks.update((tasks) => 
      tasks.map((task) => {
        if (task.id === idTask) {
          task.completed = !task.completed;
        };
        return task;
      })
    );
  }

  deleteTask(idTask: number) {
    this.tasks.update((tasks) => tasks.filter((task) => task.id !== idTask));
  }

  updateTaskEditMode(idTask: number) {
    this.tasks.update((tasks) => 
      tasks.map((task) => {
        if (task.id === idTask && !task.completed) {
          return {
            ...task,
            editing: true
          };
        };
        return {
          ...task,
          editing: false
        };
      })
    );
  }

  updateTaskText(idTask: number, event: Event) {
    const input = event.target as HTMLInputElement;
    this.tasks.update((tasks) => 
      tasks.map((task) => {
        if (task.id === idTask && !task.completed) {
          return {
            ...task,
            title: input.value,
            editing: false,
          };
        };
        return task;
      })
    );
  }
}
