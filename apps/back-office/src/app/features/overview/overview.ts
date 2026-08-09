import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EmployeesApi } from '../../core/employees.api';
import { ProductsApi } from '../../core/products.api';

@Component({
  selector: 'app-overview',
  imports: [RouterLink],
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
})
export class OverviewPage implements OnInit {
  private readonly employeesApi = inject(EmployeesApi);
  private readonly productsApi = inject(ProductsApi);

  readonly productCount = signal(0);
  readonly employeeCount = signal(0);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.productsApi.list().subscribe({
      next: (products) => this.productCount.set(products.length),
      error: () => this.productCount.set(0),
    });
    this.employeesApi.list().subscribe({
      next: (employees) => {
        this.employeeCount.set(employees.length);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  todayLabel(): string {
    return new Intl.DateTimeFormat('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(new Date());
  }
}
