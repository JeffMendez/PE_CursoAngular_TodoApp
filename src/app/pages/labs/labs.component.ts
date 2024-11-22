import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.css'
})

// Angular Signals es un sistema que rastrea de forma granular cómo y dónde se usa su estado en una aplicación, lo que permite que el marco optimice las actualizaciones de renderizado.
// ¿Qué son las signals? Una signal es un envoltorio alrededor de un valor que notifica a los consumidores interesados ​​cuando ese valor cambia. Las signals pueden contener cualquier valor, desde primitivas simples hasta estructuras de datos complejas.
// El valor de una signal se lee llamando a su función getter, que permite a Angular rastrear dónde se utiliza la signal.
// Las signals pueden ser de escritura o de sólo lectura.

export class LabsComponent {
  welcome = 'Variable dos';
  btnDisable = true;
  imgUrl = 'https://picsum.photos/200';
  person = {
    name: 'Joel',
    age: 18,
    avatar: 'https://picsum.photos/200'
  };

  name = signal('Jeff');
  tasks = signal(['Instalar', 'Componer']);

  colorCtrl = new FormControl();
  widthCtrl = new FormControl();
  nameCtrl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3),
    ]
  });

  constructor() {
    this.colorCtrl.valueChanges.subscribe(value => {
      console.log(value);
    });
  }

  clickHandler() {
    alert('Hola');
  }

  changeHandler(event: Event) {
    const input = event.target as HTMLInputElement;
    const newValue = input.value;

    this.name.set(newValue);
  }

  keydownHandler(event: KeyboardEvent) {
    console.log(event);
  }
}
