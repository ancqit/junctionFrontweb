import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { PlanAccessService } from './core/plan-access.service';

@Component({
  selector: 'app-back-office',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  readonly access = inject(PlanAccessService);

  ngOnInit(): void {
    this.access.refresh().subscribe();
  }
}
