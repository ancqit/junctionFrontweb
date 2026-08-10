import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { EmployeesApi } from '../../core/employees.api';
import { Employee, EmploymentStatus, EmploymentType } from '../../core/models';

@Component({
  selector: 'app-employees',
  imports: [ReactiveFormsModule, DatePipe, TitleCasePipe],
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
  readonly statusFilter = signal<EmploymentStatus | ''>('');

  readonly form = this.fb.nonNullable.group({
    employee_code: ['', [Validators.required, Validators.maxLength(40)]],
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
    this.showForm.set(true);
    this.error.set('');
  }

  closeForm(): void {
    this.showForm.set(false);
    this.form.reset({
      employee_code: '',
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

  create(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.saving.set(true);
    this.error.set('');
    this.api
      .create({
        employee_code: value.employee_code.trim(),
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

  private readError(error: unknown, fallback: string): string {
    const detail = (error as { error?: { detail?: string } })?.error?.detail;
    return typeof detail === 'string' && detail.trim() ? detail : fallback;
  }
}
