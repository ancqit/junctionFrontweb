import {
  Component,
  ElementRef,
  forwardRef,
  HostListener,
  Input,
  Output,
  EventEmitter,
  inject,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface InlineSelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-inline-select',
  imports: [],
  templateUrl: './inline-select.html',
  styleUrl: './inline-select.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InlineSelectComponent),
      multi: true,
    },
  ],
})
export class InlineSelectComponent implements ControlValueAccessor {
  private readonly host = inject(ElementRef<HTMLElement>);

  @Input() options: InlineSelectOption[] = [];
  @Input() placeholder = 'Select…';
  @Input() set value(v: string | null | undefined) {
    if (!this.usingFormControl) {
      this.selectedValue.set(v ?? '');
    }
  }
  @Output() readonly valueChange = new EventEmitter<string>();

  readonly open = signal(false);
  readonly selectedValue = signal('');
  readonly isDisabled = signal(false);

  private usingFormControl = false;
  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.open()) {
      return;
    }
    const target = event.target as Node | null;
    if (target && !this.host.nativeElement.contains(target)) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }

  writeValue(value: string | null): void {
    this.usingFormControl = true;
    this.selectedValue.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
    if (isDisabled) {
      this.close();
    }
  }

  displayLabel(): string {
    const current = this.selectedValue();
    if (!current) {
      return this.placeholder;
    }
    const match = this.options.find((row) => row.value === current);
    return match?.label ?? current;
  }

  toggle(): void {
    if (this.isDisabled()) {
      return;
    }
    this.open.update((state) => !state);
    if (this.open()) {
      this.onTouched();
    }
  }

  onOptionClick(event: MouseEvent, value: string): void {
    event.preventDefault();
    event.stopPropagation();
    this.select(value);
  }

  select(value: string): void {
    this.selectedValue.set(value);
    this.onChange(value);
    this.valueChange.emit(value);
    this.onTouched();
    this.close();
  }

  close(): void {
    this.open.set(false);
  }

  isSelected(value: string): boolean {
    return this.selectedValue() === value;
  }
}
