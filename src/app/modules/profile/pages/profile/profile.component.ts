import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ModalStandardComponent } from '@app/common/components/ui/modals/modal-standard/modal-standard.component';
import { ModalService } from '@app/common/services/modal.service';
import { selectCurrentUser } from '@app/modules/auth/store/selectors/auth.selector';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PerfilFormularioComponent } from '../../components/perfil-formulario/perfil-formulario.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [AsyncPipe, ModalStandardComponent, PerfilFormularioComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProfileComponent {
  private store = inject(Store);
  private modalService = inject(ModalService);

  public user$ = this.store.select(selectCurrentUser);

  openModal(id: string) {
    this.modalService.open(id);
  }

  getModalInstaceState(id: string): Observable<boolean> {
    return this.modalService.isOpen$(id);
  }
}
