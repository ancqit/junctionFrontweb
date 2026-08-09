import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PlanAccessService } from '../../core/plan-access.service';

@Component({
  selector: 'app-activate',
  imports: [RouterLink],
  templateUrl: './activate.html',
  styleUrl: './activate.scss',
})
export class ActivatePage implements OnInit {
  private readonly access = inject(PlanAccessService);

  readonly plan = this.access.plan;
  readonly loading = this.access.loading;

  ngOnInit(): void {
    this.access.refresh().subscribe();
  }
}
