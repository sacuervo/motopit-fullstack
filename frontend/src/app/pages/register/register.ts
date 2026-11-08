import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { mapApiErrors } from '../../utiles/form-errors';

// Mínimo 8 caracteres, 1 minúscula, 1 mayúscula, 1 número y 1 símbolo
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-register',
  styleUrl: './register.scss',
  templateUrl: './register.html',
})
export class Register {
  private readonly fb = inject(FormBuilder);
  private readonly AuthService = inject(AuthService);
  private readonly router = inject(Router);

  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(PASSWORD_PATTERN)]],
  });

  readonly serverErrors = signal<Record<string, string>>({});
  readonly isSubmitting = signal(false);

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.serverErrors.set({});
    this.isSubmitting.set(true);

    this.AuthService.register(this.form.getRawValue()).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        Swal.fire({
          icon: 'success',
          title: 'Registro exitoso',
          text: 'Ahora inicia sesión con tu cuenta.',
        }).then(() => this.router.navigate(['/login']));
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        if (err.status === 400) {
          this.serverErrors.set(mapApiErrors(err));
        } else if (err.status === 0) {
          Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo conectar con el servidor' });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.error?.message ?? 'Ocurrió un error inesperado',
          });
        }
      },
    });
  }
}
