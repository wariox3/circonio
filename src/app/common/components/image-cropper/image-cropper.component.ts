import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import {
  ImageCroppedEvent,
  ImageCropperComponent as NgxImageCropperComponent,
} from 'ngx-image-cropper';

@Component({
  selector: 'app-image-cropper',
  standalone: true,
  imports: [NgIf, NgxImageCropperComponent],
  templateUrl: './image-cropper.component.html',
  styleUrl: './image-cropper.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageCropperComponent {
  @Input() maxImageSizeBytes = 2 * 1024 * 1024; // 2MB default

  @Output() imageSaved = new EventEmitter<string>();
  @Output() modalClosed = new EventEmitter<void>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  public isChangingImage = false;
  public imageChangedEvent: any = '';
  public croppedImage = signal<string | null>(null);
  public imagenMuyGrande = signal<boolean>(false);

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent): void {
    // Check if we have a blob to process
    if (event.blob) {
      // Validate image size
      this.imagenMuyGrande.set(event.blob.size >= this.maxImageSizeBytes);

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
    this.modalClosed.emit();
    this.croppedImage.set(null);
  }

  saveImage(): void {
    const base64 = this.croppedImage();
    if (base64) {
      this.imageSaved.emit(base64);
      this.cancelImageChange();
    }
  }

  selectImage(): void {
    this.fileInput.nativeElement.click();
  }
}
