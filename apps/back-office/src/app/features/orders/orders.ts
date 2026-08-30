import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { catchError, finalize, interval, of, startWith, switchMap } from 'rxjs';
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

const POLL_MS = 20_000;

@Component({
  selector: 'app-orders',
  imports: [ReactiveFormsModule, RouterLink, CurrencyPipe, DatePipe, TitleCasePipe, InlineSelectComponent],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class OrdersPage implements OnInit {
  private readonly api = inject(OrdersApi);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly orders = signal<Order[]>([]);
  readonly loading = signal(true);
  readonly updatingId = signal<string | null>(null);
  readonly error = signal('');
  readonly expandedId = signal<string | null>(null);
  readonly orderStatusOptions = ORDER_STATUS_OPTIONS;

  readonly filters = this.fb.nonNullable.group({
    customer_name: [''],
    status: this.fb.nonNullable.control<OrderStatus | ''>(''),
  });

  ngOnInit(): void {
    interval(POLL_MS)
      .pipe(
        startWith(0),
        switchMap(() => this.fetchOrders(this.orders().length === 0)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((rows) => {
        if (rows !== null) {
          this.orders.set(rows);
        }
      });
  }

  reload(): void {
    this.fetchOrders(true).subscribe((rows) => {
      if (rows !== null) {
        this.orders.set(rows);
      }
    });
  }

  private fetchOrders(showLoading: boolean) {
    const value = this.filters.getRawValue();
    if (showLoading) {
      this.loading.set(true);
    }
    this.error.set('');
    return this.api
      .list({
        customer_name: value.customer_name || undefined,
        status: value.status || undefined,
      })
      .pipe(
        catchError((err: unknown) => {
          this.error.set(this.readError(err, 'Could not load orders.'));
          return of(null);
        }),
        finalize(() => this.loading.set(false)),
      );
  }

  toggle(orderId: string): void {
    this.expandedId.update((current) => (current === orderId ? null : orderId));
  }

  setStatus(order: Order, status: OrderStatus): void {
    if (order.status === status || this.updatingId()) {
      return;
    }
    this.updatingId.set(order.id);
    this.error.set('');
    this.api
      .updateStatus(order.id, status)
      .pipe(finalize(() => this.updatingId.set(null)))
      .subscribe({
        next: (updated) => {
          this.orders.update((rows) => rows.map((row) => (row.id === updated.id ? updated : row)));
        },
        error: (err: unknown) => this.error.set(this.readError(err, 'Could not update order status.')),
      });
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

  canConfirm(order: Order): boolean {
    return order.status === 'pending';
  }

  canComplete(order: Order): boolean {
    return order.status === 'pending' || order.status === 'confirmed';
  }

  canCancel(order: Order): boolean {
    return order.status === 'pending' || order.status === 'confirmed';
  }

  private readError(error: unknown, fallback: string): string {
    const detail = (error as { error?: { detail?: string } })?.error?.detail;
    return typeof detail === 'string' && detail.trim() ? detail : fallback;
  }
}
