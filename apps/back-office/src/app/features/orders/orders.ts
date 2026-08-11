import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Order, OrderStatus } from '../../core/models';
import { OrdersApi } from '../../core/orders.api';
import { InlineSelectComponent, InlineSelectOption } from '../../shared/inline-select/inline-select';

const ORDER_STATUS_OPTIONS: InlineSelectOption[] = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

@Component({
  selector: 'app-orders',
  imports: [ReactiveFormsModule, RouterLink, CurrencyPipe, DatePipe, TitleCasePipe, InlineSelectComponent],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class OrdersPage implements OnInit {
  private readonly api = inject(OrdersApi);
  private readonly fb = inject(FormBuilder);

  readonly orders = signal<Order[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly expandedId = signal<string | null>(null);
  readonly orderStatusOptions = ORDER_STATUS_OPTIONS;

  readonly filters = this.fb.nonNullable.group({
    customer_name: [''],
    status: this.fb.nonNullable.control<OrderStatus | ''>(''),
  });

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    const value = this.filters.getRawValue();
    this.loading.set(true);
    this.error.set('');
    this.api
      .list({
        customer_name: value.customer_name || undefined,
        status: value.status || undefined,
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (rows) => this.orders.set(rows),
        error: (err: unknown) => this.error.set(this.readError(err, 'Could not load orders.')),
      });
  }

  toggle(orderId: string): void {
    this.expandedId.update((current) => (current === orderId ? null : orderId));
  }

  remove(order: Order): void {
    if (!confirm(`Delete order ${order.order_number}?`)) {
      return;
    }
    this.api.remove(order.id).subscribe({
      next: () => this.reload(),
      error: (err: unknown) => this.error.set(this.readError(err, 'Could not delete order.')),
    });
  }

  itemCount(order: Order): number {
    return order.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  private readError(error: unknown, fallback: string): string {
    const detail = (error as { error?: { detail?: string } })?.error?.detail;
    return typeof detail === 'string' && detail.trim() ? detail : fallback;
  }
}
