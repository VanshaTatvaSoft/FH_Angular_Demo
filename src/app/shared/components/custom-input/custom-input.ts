import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CustomInputInterface } from '../../../models/custom-input.interface';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-custom-input',
  imports: [MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, MatOptionModule, NgClass],
  templateUrl: './custom-input.html',
  styleUrl: './custom-input.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInput),
      multi: true
    }
  ]
})
export class CustomInput implements ControlValueAccessor {
  @Input() customInput!: CustomInputInterface;
  @Input() formControl!: FormControl;
  @Input() customErrors?: { [Key: string]: string };
  @Output() valueChange = new EventEmitter<string>();

  onChange = (value: any) => { };
  onTouched = () => { };

  writeValue(obj: any): void {
    this.customInput.value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.customInput.disabled = isDisabled ? true : false;
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    this.customInput.value = newValue;
    this.onChange(newValue);
    this.valueChange.emit(newValue);
  }

  onSelect(event: MatSelectChange): void {
    this.customInput.value = event.value;
    this.onChange(event.value);
    this.valueChange.emit(event.value);
  }


  getErrorKeys(): string[] {
    return this.formControl?.errors ? Object.keys(this.formControl.errors) : [];
  }

  getErrorMessage(errorKey: string): string {
    if (this.customErrors && this.customErrors[errorKey]) {
      return this.customErrors[errorKey];
    }

    // fallback defaults
    switch (errorKey) {
      case 'required':
        return 'This field is required.';
      case 'minlength':
        return `Minimum ${this.formControl?.errors?.['minlength'].requiredLength} characters required.`;
      case 'maxlength':
        return `Maximum ${this.formControl?.errors?.['maxlength'].requiredLength} characters allowed.`;
      case 'email':
        return 'Invalid email.';
      case 'pattern':
        return 'Invalid pattern.';
      default:
        return 'Invalid field.';
    }
  }

}
