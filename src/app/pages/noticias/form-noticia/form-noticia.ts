import { Component, ElementRef, inject, output, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CATEGORIAS, Categoria, Noticia } from '../../../models/noticia';
import { CapitalizarPipe } from '../../../pipes/capitalizar.pipe';
import { NoticiasService } from '../../../services/noticias.service';
import { Validaciones, enfocarPrimerError } from '../../../validators/validaciones';

/**
 * Formulario reactivo para publicar una noticia o restaurar el catálogo original.
 * Emite (publicada) con la noticia creada para que el listado quite los filtros.
 */
@Component({
  selector: 'app-form-noticia',
  imports: [ReactiveFormsModule, RouterLink, CapitalizarPipe],
  templateUrl: './form-noticia.html',
  styleUrl: './form-noticia.css'
})
export class FormNoticia {
  private readonly servicio = inject(NoticiasService);
  private readonly elemento = viewChild.required<ElementRef<HTMLFormElement>>('elementoFormulario');

  readonly categorias = CATEGORIAS;
  readonly publicada = output<Noticia>();

  /** true después del primer intento de envío: desde ahí los errores se ven en vivo. */
  readonly intentado = signal(false);
  /** Última noticia publicada, para el mensaje de confirmación. */
  readonly ultima = signal<Noticia | null>(null);

  readonly formulario = inject(FormBuilder).nonNullable.group({
    titulo: ['', [Validaciones.obligatorio, Validaciones.minimo(10), Validaciones.maximo(120)]],
    categoria: ['' as Categoria | '', Validaciones.obligatorio],
    resumen: ['', [Validaciones.obligatorio, Validaciones.minimo(10), Validaciones.maximo(160)]],
    cuerpo: ['', [Validaciones.obligatorio, Validaciones.minimo(40)]],
    autor: ['', [Validaciones.obligatorio, Validaciones.minimo(3)]],
    imagen: ['', Validaciones.urlOpcional]
  });

  /** ¿Se debe mostrar el error del campo? */
  mostrarError(campo: keyof typeof this.formulario.controls): boolean {
    const control = this.formulario.controls[campo];
    return control.invalid && (this.intentado() || control.touched);
  }

  publicar(): void {
    this.intentado.set(true);
    this.ultima.set(null);
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      enfocarPrimerError(this.elemento().nativeElement);
      return;
    }

    const datos = this.formulario.getRawValue();
    const noticia = this.servicio.crear({ ...datos, categoria: datos.categoria as Categoria });
    this.formulario.reset();
    this.intentado.set(false);
    this.ultima.set(noticia);
    this.publicada.emit(noticia);
  }

  restaurar(): void {
    if (confirm('Se borrarán las noticias que publicaste y volverán las eliminadas. ¿Continuar?')) {
      this.servicio.restaurar();
      this.ultima.set(null);
    }
  }
}
