import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalStandardComponent } from '@app/common/components/ui/modals/modal-standard/modal-standard.component';
import { ModalService } from '@app/common/services/modal.service';
import { CambiarPasswordComponent } from '../../components/cambiar-password/cambiar-password.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-seguridad',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalStandardComponent, CambiarPasswordComponent],
  templateUrl: './seguridad.component.html',
  styleUrl: './seguridad.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SeguridadComponent {
  private modalService = inject(ModalService);

  openModal(modalId: string) {
    this.modalService.open(modalId);
  }

  getModalInstaceState(id: string): Observable<boolean> {
    return this.modalService.isOpen$(id);
  }
}
