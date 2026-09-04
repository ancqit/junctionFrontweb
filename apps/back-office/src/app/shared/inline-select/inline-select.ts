import {
  AfterViewChecked,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  computed,
  forwardRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  normalizeSelectValue,
  resolveSelectLabel,
} from '../normalize-select-value';

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
export class InlineSelectComponent implements ControlValueAccessor, AfterViewChecked {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');
  private focusSearchPending = false;

  /** Reactive options — setter so displayLabel recomputes when async catalogs load. */
  private readonly optionsSignal = signal<InlineSelectOption[]>([]);

  @Input()
  set options(value: InlineSelectOption[] | null | undefined) {
    this.optionsSignal.set(value ?? []);
    this.maybeNormalizeSelected();
  }
  get options(): InlineSelectOption[] {
    return this.optionsSignal();
  }

  @Input() placeholder = 'Select…';
  /** Searchable dropdown (category filters, long lists). */
  @Input() searchable = false;
  @Input() searchPlaceholder = 'Search…';
  @Input() allowCustom = false;
  /**
   * When true, match the current control value against option value OR label
   * (case-insensitive) so async-loaded options show the proper label.
   */
  @Input() resolveFromOptions = true;
  /**
   * When true and resolveFromOptions is on, rewrite a label-shaped stored value
   * to the matching option.value (emits via CVA onChange once).
   */
  @Input() allowNormalize = false;
  @Input() set value(v: string | null | undefined) {
    if (!this.usingFormControl) {
      this.selectedValue.set(v ?? '');
      this.maybeNormalizeSelected();
    }
  }
  @Output() readonly valueChange = new EventEmitter<string>();

  readonly open = signal(false);
  readonly selectedValue = signal('');
  readonly isDisabled = signal(false);
  readonly searchQuery = signal('');

  readonly filteredOptions = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const rows = this.optionsSignal();
    if (!query) {
      return rows;
    }
    return rows.filter(
      (row) =>
        row.label.toLowerCase().includes(query) ||
        row.value.toLowerCase().includes(query) ||
        (row.hint ?? '').toLowerCase().includes(query),
    );
  });

  /** Label shown on the closed trigger — reacts to options + selected value. */
  readonly displayLabel = computed(() => {
    const current = this.selectedValue();
    if (!current) {
      return this.placeholder;
    }
    if (!this.resolveFromOptions) {
      const exact = this.optionsSignal().find((row) => row.value === current);
      return exact?.label ?? current;
    }
    return resolveSelectLabel(current, this.optionsSignal(), current);
  });

  private usingFormControl = false;
  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  ngAfterViewChecked(): void {
    if (!this.focusSearchPending) {
      return;
    }
    const input = this.searchInput()?.nativeElement;
    if (!input) {
      return;
    }
    this.focusSearchPending = false;
    input.focus();
  }

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
    this.maybeNormalizeSelected();
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

  toggle(): void {
    if (this.isDisabled()) {
      return;
    }
    this.open.update((state) => !state);
    if (this.open()) {
      this.searchQuery.set('');
      this.focusSearchPending = this.searchable;
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
    this.focusSearchPending = false;
  }

  isSelected(value: string): boolean {
    const current = this.selectedValue();
    if (current === value) {
      return true;
    }
    if (!this.resolveFromOptions) {
      return false;
    }
    return normalizeSelectValue(current, this.optionsSignal()) === value;
  }

  private maybeNormalizeSelected(): void {
    if (!this.resolveFromOptions || !this.allowNormalize) {
      return;
    }
    const current = this.selectedValue();
    if (!current) {
      return;
    }
    const normalized = normalizeSelectValue(current, this.optionsSignal());
    if (!normalized || normalized === current) {
      return;
    }
    this.selectedValue.set(normalized);
    if (this.usingFormControl) {
      this.onChange(normalized);
    } else {
      this.valueChange.emit(normalized);
    }
  }
}
