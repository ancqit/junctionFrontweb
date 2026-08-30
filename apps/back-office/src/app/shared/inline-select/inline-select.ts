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
  computed,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface InlineSelectOption {
  value: string;
  label: string;
  /** Optional secondary text (e.g. shop type description). */
  hint?: string;
}

@Component({
  selector: 'app-inline-select',
  imports: [FormsModule],
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
  /** Searchable dropdown (category filters, long lists). */
  @Input() searchable = false;
  @Input() searchPlaceholder = 'Search…';
  @Input() allowCustom = false;
  @Input() set value(v: string | null | undefined) {
    if (!this.usingFormControl) {
      this.selectedValue.set(v ?? '');
    }
  }
  @Output() readonly valueChange = new EventEmitter<string>();

  readonly open = signal(false);
  readonly selectedValue = signal('');
  readonly isDisabled = signal(false);
  readonly searchQuery = signal('');

  readonly filteredOptions = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) {
      return this.options;
    }
    return this.options.filter(
      (row) =>
        row.label.toLowerCase().includes(query) ||
        row.value.toLowerCase().includes(query) ||
        (row.hint ?? '').toLowerCase().includes(query),
    );
  });

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
      this.searchQuery.set('');
      this.onTouched();
    }
  }

  onSearchInput(value: string): void {
    this.searchQuery.set(value);
  }

  onOptionClick(event: MouseEvent, value: string): void {
    event.preventDefault();
    event.stopPropagation();
    this.select(value);
  }

  addCustomFromSearch(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const custom = this.searchQuery().trim();
    if (!custom) {
      return;
    }
    this.select(custom);
  }

  select(value: string): void {
    this.selectedValue.set(value);
    this.onChange(value);
    this.valueChange.emit(value);
    this.onTouched();
    this.close();
  }

  clear(event?: MouseEvent): void {
    event?.preventDefault();
    event?.stopPropagation();
    this.select('');
  }

  close(): void {
    this.open.set(false);
    this.searchQuery.set('');
  }

  isSelected(value: string): boolean {
    return this.selectedValue() === value;
  }
}
