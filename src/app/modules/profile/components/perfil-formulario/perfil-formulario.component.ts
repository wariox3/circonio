import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { InputComponent } from '@app/common/components/ui/form/input/input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LabelComponent } from '@app/common/components/ui/form/label/label.component';
import { PAISES } from '@app/common/constants/paises.constant';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '@app/modules/auth/store/selectors/auth.selector';
import { TelefonoUtilService } from '@app/common/services/telefono-util.service';
import { updateRequest } from '@app/modules/auth/store/actions/perfil.action';

@Component({
  selector: 'app-perfil-formulario',
  standalone: true,
  imports: [InputComponent, ReactiveFormsModule, LabelComponent],
  templateUrl: './perfil-formulario.component.html',
  styleUrl: './perfil-formulario.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerfilFormularioComponent implements OnInit {
  private store = inject(Store);
  public telefonoUtilService = inject(TelefonoUtilService);

  public paises = PAISES;
  public formularioPerfil = new FormGroup({
    id: new FormControl('', []),
    nombre: new FormControl('', [Validators.required]),
    apellido: new FormControl('', [Validators.required]),
    nombreCorto: new FormControl('', [Validators.required]),
    indicativo_pais: new FormControl('', []),
    telefono: new FormControl('', [
      Validators.minLength(3),
      Validators.maxLength(50),
      Validators.pattern(/^[0-9]+$/),
    ]),
    numero_identificacion: new FormControl('', [Validators.required]),
    idioma: new FormControl('', []),
  });

  ngOnInit(): void {
    this.store.select(selectCurrentUser).subscribe(user => {
      if (user) {
        const { indicativo, numero } = this.telefonoUtilService.procesarNumeroTelefono(
          user.telefono
        );
        this.formularioPerfil.setValue({
          id: user.id,
          nombre: user.nombre,
          apellido: user.apellido,
          nombreCorto: user.nombre_corto,
          indicativo_pais: indicativo,
          telefono: numero,
          numero_identificacion: user.numero_identificacion,
          idioma: user.idioma,
        });
      }
    });
  }

  onSubmit() {
    if (this.formularioPerfil.valid) {
      const telefono = this.telefonoUtilService.combinarNumeroTelefono(
        this.formularioPerfil.value.indicativo_pais,
        this.formularioPerfil.value.telefono
      );

      this.store.dispatch(
        updateRequest({
          perfil: {
            id: this.formularioPerfil.value.id,
            nombre: this.formularioPerfil.value.nombre,
            apellido: this.formularioPerfil.value.apellido,
            nombre_corto: this.formularioPerfil.value.nombreCorto,
            telefono,
            numero_identificacion: this.formularioPerfil.value.numero_identificacion,
            idioma: this.formularioPerfil.value.idioma,
          },
        })
      );
    }
  }
}
