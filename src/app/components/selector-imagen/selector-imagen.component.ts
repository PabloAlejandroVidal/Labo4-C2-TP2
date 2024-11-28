import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CancelOverlayDirective } from '../../directives/cancel-overlay.directive';
import { CommonModule } from '@angular/common';
import { UploadOverlayDirective } from '../../directives/upload-overlay';


@Component({
  selector: 'app-selector-imagen',
  templateUrl: './selector-imagen.component.html',
  styleUrl: './selector-imagen.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    CancelOverlayDirective,
    UploadOverlayDirective,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectorImagenComponent),
      multi: true,
    }
  ]
})
export class SelectorImagenComponent implements ControlValueAccessor{
  @Input() required: boolean = false;
  selectedImage: string | ArrayBuffer | null = null;
  selectedFileName: string | null = null;
  public file: File | null = null;
  onChange: (file: File | null | string) => void = () => {};
  onTouched: () => void = () => {};

  resetFileInput(event: Event, fileInput: HTMLInputElement) {
    fileInput.value = '';
    this.onFileSelected(event);
  }

  writeValue(value: File | null = null): void {
    this.file = value;
    this.previewImage();
  }

  registerOnChange(fn: (file: File | string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Implement if needed
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    this.file = files && files.length > 0 ? files[0] : null;
    this.selectedFileName = this.file?.name || null;

    // Genera la vista previa de la imagen en Base64
    this.previewImage();

    // Emite el archivo original
  }

  private previewImage() {
    if (this.file) {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        this.selectedImage = event.target?.result as string || null;
        this.onChange(this.selectedImage);
        // Aquí puedes emitir la imagen en formato Base64
      };
      reader.readAsDataURL(this.file); // Convierte el archivo a una URL de datos (Base64)
    } else {
      this.selectedImage = null;
    }
  }


}
