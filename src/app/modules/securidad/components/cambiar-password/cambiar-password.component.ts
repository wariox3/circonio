import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { matchFieldsValidator } from '@app/common/validators';
import { LabelComponent } from '@app/common/components/ui/form/label/label.component';
import { InputComponent } from '@app/common/components/ui/form/input/input.component';
import { AdvancedButtonComponent } from '@app/common/components/ui/advanced-button/advanced-button.component';
import { AuthRepository } from '@app/modules/auth/repositories/auth.repository';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '@app/modules/auth/store/selectors/auth.selector';
import { AlertaService } from '@app/common/services/alerta.service';
import { ModalService } from '@app/common/services/modal.service';

@Component({
  selector: 'app-cambiar-password',
  standalone: true,
  imports: [ReactiveFormsModule, LabelComponent, InputComponent, AdvancedButtonComponent],
  templateUrl: './cambiar-password.component.html',
  styleUrl: './cambiar-password.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CambiarPasswordComponent implements OnInit {
  private authRepository = inject(AuthRepository);
  private store = inject(Store);
  private usuario$ = this.store.select(selectCurrentUser);
  private usuarioId: string = '';
  private alertService = inject(AlertaService);
  private modalService = inject(ModalService);

  formularioCambiarPassword = new FormGroup(
    {
      passwordNueva: new FormControl('', [Validators.required, Validators.minLength(3)]),
      passwordConfirmar: new FormControl('', [Validators.required]),
    },
    {
      validators: [matchFieldsValidator('passwordNueva', 'passwordConfirmar')],
    }
  );

  ngOnInit(): void {
    this.usuario$.subscribe(usuario => {
      this.usuarioId = usuario.id;
    });
  }

  onSubmit() {
    if (this.formularioCambiarPassword.invalid) {
      return;
    }

    this.authRepository
      .cambiarPassword({
        usuarioId: this.usuarioId,
        password: this.formularioCambiarPassword.get('passwordNueva')?.value,
      })
      .subscribe(() => {
        this.alertService.mostrarExito('Contraseña cambiada correctamente');
        this.modalService.close('modal-password');
      });
  }
}
