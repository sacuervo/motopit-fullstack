import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { MotoService } from '../../services/moto.service';
import { AuthService } from '../../services/auth.service';
import { Moto } from '../../interfaces/moto.interface';
import { mapApiErrors } from '../../utiles/form-errors';

@Component({
  imports: [ReactiveFormsModule, DecimalPipe, DatePipe],
  selector: 'app-motos',
  styleUrl: './motos.scss',
  templateUrl: './motos.html',
})
export class Motos implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly motoService = inject(MotoService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly motos = signal<Moto[]>([]);
  readonly selectedMoto = signal<Moto | null>(null);
  readonly editingId = signal<string | null>(null);
  readonly serverErrors = signal<Record<string, string>>({});
  readonly isLoading = signal(false);

  readonly form = this.fb.nonNullable.group({
    placa: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(6)]],
    marca: ['', [Validators.required]],
    modelo: ['', [Validators.required]],
    kilometraje: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnInit(): void {
    this.loadMotos();
  }

  loadMotos(): void {
    this.isLoading.set(true);
    this.motoService.getAll().subscribe({
      next: (motos) => {
        this.motos.set(motos);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.handleError(err);
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.serverErrors.set({});
    const data = this.form.getRawValue();
    const id = this.editingId();

    const request$: Observable<Moto> = id
      ? this.motoService.update(id, data)
      : this.motoService.create(data);

    request$.subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: id ? 'Moto actualizada' : 'Moto registrada',
          showConfirmButton: false,
          timer: 1500,
        });
        this.resetForm();
        this.loadMotos();
      },
      error: (err: HttpErrorResponse) => this.handleError(err),
    });
  }

  startEdit(moto: Moto): void {
    this.editingId.set(moto._id);
    this.serverErrors.set({});
    this.form.patchValue({
      placa: moto.placa,
      marca: moto.marca,
      modelo: moto.modelo,
      kilometraje: moto.kilometraje,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetForm(): void {
    this.form.reset();
    this.editingId.set(null);
    this.serverErrors.set({});
  }

  verDetalle(id: string): void {
    this.selectedMoto.set(null); // Muestra el spinner mientras llega la respuesta
    this.motoService.getById(id).subscribe({
      next: (moto) => this.selectedMoto.set(moto),
      error: (err: HttpErrorResponse) => this.handleError(err),
    });
  }

  eliminar(moto: Moto): void {
    Swal.fire({
      title: `¿Eliminar la moto ${moto.placa}?`,
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.motoService.delete(moto._id).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Moto eliminada',
            showConfirmButton: false,
            timer: 1500,
          });
          this.motos.update((lista) => lista.filter((m) => m._id !== moto._id));
          if (this.editingId() === moto._id) {
            this.resetForm();
          }
        },
        error: (err: HttpErrorResponse) => this.handleError(err),
      });
    });
  }

  private handleError(err: HttpErrorResponse): void {
    switch (err.status) {
      case 401:
        this.authService.logout();
        Swal.fire({
          icon: 'warning',
          title: 'Tu sesión expiró',
          text: 'Inicia sesión de nuevo.',
        });
        this.router.navigate(['/login']);
        break;
      case 400:
        this.serverErrors.set(mapApiErrors(err));
        break;
      case 404:
        Swal.fire({ icon: 'error', title: 'La moto no existe' });
        this.loadMotos();
        break;
      case 0:
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo conectar con el servidor' });
        break;
      default:
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error?.message ?? 'Ocurrió un error inesperado',
        });
    }
  }
}
