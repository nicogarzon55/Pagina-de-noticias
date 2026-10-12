import { Component, ElementRef, OnInit, inject, input, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Validaciones, enfocarPrimerError } from '../../validators/validaciones';

/** Datos que se muestran en el mensaje de confirmación. */
interface Remitente {
  nombre: string;
  correo: string;
}

/**
 * Contacto: formulario reactivo con validaciones y mensaje de confirmación.
 * No hay servidor, así que el envío se simula.
 */
@Component({
  selector: 'app-contacto',
  imports: [ReactiveFormsModule],
  templateUrl: './contacto.html',
  styleUrl: './contacto.css'
})
export class Contacto implements OnInit {
  private readonly elemento = viewChild.required<ElementRef<HTMLFormElement>>('elementoFormulario');

  /** ?noticia= de la URL: llega cuando se pulsa "Contactar" en el detalle. */
  readonly noticia = input<string | undefined>();

  readonly asuntos = ['Enviar una noticia', 'Solicitar una corrección', 'Sugerencia', 'Otro'];
  readonly intentado = signal(false);
  readonly enviado = signal<Remitente | null>(null);

  readonly formulario = inject(FormBuilder).nonNullable.group({
    nombre: ['', [Validaciones.obligatorio, Validaciones.minimo(3)]],
    correo: ['', [Validaciones.obligatorio, Validaciones.correo]],
    asunto: ['', Validaciones.obligatorio],
    mensaje: ['', [Validaciones.obligatorio, Validaciones.minimo(20)]]
  });

  ngOnInit(): void {
    // Si se llega desde una noticia, se precarga el asunto y el comienzo del mensaje.
    const titulo = this.noticia();
    if (titulo) {
      this.formulario.patchValue({ asunto: 'Solicitar una corrección', mensaje: `Sobre la noticia «${titulo}»: ` });
    }
  }

  mostrarError(campo: keyof typeof this.formulario.controls): boolean {
    const control = this.formulario.controls[campo];
    return control.invalid && (this.intentado() || control.touched);
  }

  enviar(): void {
    this.intentado.set(true);
    this.enviado.set(null);
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      enfocarPrimerError(this.elemento().nativeElement);
      return;
    }

    const { nombre, correo } = this.formulario.getRawValue();
    this.enviado.set({ nombre: nombre.trim(), correo: correo.trim() });
    this.formulario.reset();
    this.intentado.set(false);
  }
}
