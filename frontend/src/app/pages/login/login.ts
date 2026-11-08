import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { mapApiErrors } from '../../utiles/form-errors';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
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

    this.authService.login(this.form.getRawValue()).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.authService.saveSession(res.token, res.user.nombre);
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: `¡Bienvenido, ${res.user.nombre}`,
          showConfirmButton: false,
          timer: 2000,
        });
        this.router.navigate(['/motos']);
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        if (err.status === 400) {
          this.serverErrors.set(mapApiErrors(err));
        } else if (err.status === 401 || err.status === 404) {
          Swal.fire({
            icon: 'error',
            title: 'No pudimos iniciar sesión',
            text: 'Correo o contraseña incorrectos.',
          });
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
