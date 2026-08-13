import { DatePipe, TitleCasePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { EmployeesApi } from '../../core/employees.api';
import { Employee, EmploymentStatus, EmploymentType } from '../../core/models';
import { InlineSelectComponent, InlineSelectOption } from '../../shared/inline-select/inline-select';

const STATUS_FILTER_OPTIONS: InlineSelectOption[] = [
  { value: '', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'on_leave', label: 'On leave' },
  { value: 'terminated', label: 'Terminated' },
];

const EMPLOYMENT_TYPE_OPTIONS: InlineSelectOption[] = [
  { value: 'full_time', label: 'Full time' },
  { value: 'part_time', label: 'Part time' },
  { value: 'contract', label: 'Contract' },
  { value: 'temporary', label: 'Temporary' },
];

const EMPLOYEE_STATUS_OPTIONS: InlineSelectOption[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'on_leave', label: 'On leave' },
  { value: 'terminated', label: 'Terminated' },
];

@Component({
  selector: 'app-employees',
  imports: [ReactiveFormsModule, DatePipe, TitleCasePipe, InlineSelectComponent],
  templateUrl: './employees.html',
  styleUrl: './employees.scss',
})
export class EmployeesPage implements OnInit {
  private readonly api = inject(EmployeesApi);
  private readonly fb = inject(FormBuilder);

  readonly employees = signal<Employee[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly showForm = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly statusFilter = signal<EmploymentStatus | ''>('');

  readonly statusFilterOptions = STATUS_FILTER_OPTIONS;
  readonly employmentTypeOptions = EMPLOYMENT_TYPE_OPTIONS;
  readonly employeeStatusOptions = EMPLOYEE_STATUS_OPTIONS;

  readonly form = this.fb.nonNullable.group({
    first_name: ['', [Validators.required, Validators.maxLength(80)]],
    last_name: ['', [Validators.required, Validators.maxLength(80)]],
    email: [''],
    phone_local: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    role: ['', [Validators.required, Validators.maxLength(80)]],
    department: ['', [Validators.required, Validators.maxLength(80)]],
    employment_type: this.fb.nonNullable.control<EmploymentType>('full_time', Validators.required),
    status: this.fb.nonNullable.control<EmploymentStatus>('active', Validators.required),
    hire_date: [new Date().toISOString().slice(0, 10), Validators.required],
    salary: [''],
    notes: [''],
  });

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.loading.set(true);
    this.error.set('');
    const status = this.statusFilter();
    this.api
      .list(status ? { status } : undefined)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (rows) => this.employees.set(rows),
        error: (err: unknown) => this.error.set(this.readError(err, 'Could not load employees.')),
      });
  }

  onFilterChange(value: string): void {
    this.statusFilter.set((value || '') as EmploymentStatus | '');
    this.reload();
  }

  openForm(): void {
    this.editingId.set(null);
    this.showForm.set(true);
    this.error.set('');
    this.resetForm();
  }

  openEdit(employee: Employee): void {
    this.editingId.set(employee.id);
    this.showForm.set(true);
    this.error.set('');
    this.form.reset({
      first_name: employee.first_name,
      last_name: employee.last_name,
      email: employee.email ?? '',
      phone_local: localPhone(employee.phone_number),
      role: employee.role,
      department: employee.department,
      employment_type: employee.employment_type,
      status: employee.status,
      hire_date: employee.hire_date?.slice(0, 10) || new Date().toISOString().slice(0, 10),
      salary: employee.salary != null ? String(employee.salary) : '',
      notes: employee.notes ?? '',
    });
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
    this.resetForm();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    const editingId = this.editingId();
    this.saving.set(true);
    this.error.set('');

    if (editingId) {
      this.api
        .update(editingId, {
          first_name: value.first_name.trim(),
          last_name: value.last_name.trim(),
          email: value.email.trim() || null,
          phone_number: `+91${value.phone_local}`,
          role: value.role.trim(),
          department: value.department.trim(),
          employment_type: value.employment_type,
          status: value.status,
          hire_date: value.hire_date,
          salary: value.salary ? Number(value.salary) : null,
          notes: value.notes.trim() || null,
        })
        .pipe(finalize(() => this.saving.set(false)))
        .subscribe({
          next: () => {
            this.closeForm();
            this.reload();
          },
          error: (err: unknown) => this.error.set(this.readError(err, 'Could not update employee.')),
        });
      return;
    }

    this.api
      .create({
        first_name: value.first_name.trim(),
        last_name: value.last_name.trim(),
        email: value.email.trim() || null,
        phone_number: `+91${value.phone_local}`,
        role: value.role.trim(),
        department: value.department.trim(),
        employment_type: value.employment_type,
        status: value.status,
        hire_date: value.hire_date,
        termination_date: null,
        manager_id: null,
        salary: value.salary ? Number(value.salary) : null,
        address: null,
        emergency_contact: null,
        notes: value.notes.trim() || null,
        avatar_url: null,
      })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.closeForm();
          this.reload();
        },
        error: (err: unknown) => this.error.set(this.readError(err, 'Could not create employee.')),
      });
  }

  remove(employee: Employee): void {
    if (!confirm(`Remove ${employee.first_name} ${employee.last_name}?`)) {
      return;
    }
    this.api.remove(employee.id).subscribe({
      next: () => this.reload(),
      error: (err: unknown) => this.error.set(this.readError(err, 'Could not delete employee.')),
    });
  }

  private resetForm(): void {
    this.form.reset({
      first_name: '',
      last_name: '',
      email: '',
      phone_local: '',
      role: '',
      department: '',
      employment_type: 'full_time',
      status: 'active',
      hire_date: new Date().toISOString().slice(0, 10),
      salary: '',
      notes: '',
    });
  }

  private readError(error: unknown, fallback: string): string {
    const detail = (error as { error?: { detail?: string } })?.error?.detail;
    return typeof detail === 'string' && detail.trim() ? detail : fallback;
  }
}

function localPhone(phone: string | null | undefined): string {
  const digits = (phone ?? '').replace(/\D/g, '');
  if (digits.length >= 10) {
    return digits.slice(-10);
  }
  return '';
}
