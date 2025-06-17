import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageCropperComponent } from '@app/common/components/image-cropper/image-cropper.component';
import { ModalStandardComponent } from '@app/common/components/ui/modals/modal-standard/modal-standard.component';
import { ModalService } from '@app/common/services/modal.service';
import {
  removeImageRequest,
  updateImageRequest,
} from '@app/modules/auth/store/actions/perfil.action';
import { selectCurrentUser } from '@app/modules/auth/store/selectors/auth.selector';
import { Store } from '@ngrx/store';
import { PerfilFormularioComponent } from '../../components/perfil-formulario/perfil-formulario.component';
import { ProfileImageService } from '@app/core/services/profile-image.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    ModalStandardComponent,
    PerfilFormularioComponent,
    ImageCropperComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProfileComponent implements OnInit {
  private store = inject(Store);
  private modalService = inject(ModalService);
  private profileImageService = inject(ProfileImageService);
  private sanitizer = inject(DomSanitizer);

  // Observable for template compatibility
  public user$ = this.store.select(selectCurrentUser);
  public currentUser = toSignal(this.store.select(selectCurrentUser));

  // Use the service's profileImageUrl signal
  public profileImage = this.profileImageService.profileImageUrl;

  ngOnInit(): void {
    // No initialization needed as currentUser is already set via toSignal
    this.refreshImageCache();
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  getModalInstaceState(id: string): Observable<boolean> {
    return this.modalService.isOpen$(id);
  }

  // Image cropper methods
  toggleImageChange(): void {
    this.openModal('cambiar-imagen');
  }

  /**
   * Get profile image URL with cache busting
   */
  getProfileImageUrl(): string | null {
    return this.profileImageService.profileImageUrl();
  }

  /**
   * Updates the cache busting timestamp to force image refresh
   */
  refreshImageCache(): void {
    this.profileImageService.refreshImageCache();
  }

  /**
   * Handle the image saved event from the image cropper component
   */
  handleImageSaved(base64: string): void {
    const user = this.currentUser();
    if (base64 && user) {
      // Set temporary profile image for immediate feedback
      this.profileImageService.setTempProfileImage(base64);

      // Dispatch action to update the user profile image in the store
      this.store.dispatch(
        updateImageRequest({
          perfil: {
            imagen: base64,
            usuario_id: user.id,
          },
        })
      );
    }
  }

  eliminarImagenPerfil(): void {
    this.store.dispatch(
      removeImageRequest({
        usuario_id: this.currentUser().id,
      })
    );
  }
}
