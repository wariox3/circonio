import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalStandardComponent } from '@app/common/components/ui/modals/modal-standard/modal-standard.component';
import { ModalService } from '@app/common/services/modal.service';
import { updateImageRequest } from '@app/modules/auth/store/actions/perfil.action';
import { selectCurrentUser } from '@app/modules/auth/store/selectors/auth.selector';
import { Store } from '@ngrx/store';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
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
  public isChangingImage = false;
  public imageChangedEvent: any = '';
  public croppedImage = signal<string | null>(null);
  public imagenMuyGrande = signal<boolean>(false);
  public MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

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

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent): void {
    // Check if we have a blob to process
    if (event.blob) {
      // Validate image size
      this.imagenMuyGrande.set(event.blob.size >= this.MAX_IMAGE_SIZE_BYTES);

      if (!this.imagenMuyGrande()) {
        // Convert to JPEG format with better compression
        const convertedBlob = event.blob.slice(0, event.blob.size, 'image/jpeg');

        // Read as data URL asynchronously
        const reader = new FileReader();
        reader.readAsDataURL(convertedBlob);

        reader.onloadend = () => {
          if (reader.result) {
            // Set the base64 string to our signal
            this.croppedImage.set(reader.result as string);
          }
        };
      }
    } else if (event.base64) {
      // Fallback to base64 if blob is not available
      this.croppedImage.set(event.base64);
    }
  }

  loadImageFailed(): void {
    console.error('La imagen no pudo ser cargada');
    // You could show a toast notification here
  }

  cancelImageChange(): void {
    this.imageChangedEvent = null;
    this.croppedImage.set(null);
    this.modalService.close('cambiar-imagen');
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

  saveProfileImage(): void {
    const base64 = this.croppedImage();
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

      this.cancelImageChange();
    }
  }
}
