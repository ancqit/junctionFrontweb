import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-remote-load-error',
  imports: [RouterLink],
  template: `
    <main class="wrap">
      <p class="eyebrow">BACK OFFICE</p>
      <h1>Couldn’t open the app</h1>
      <p>The back-office remote failed to load. You’re still signed in.</p>
      <div class="actions">
        <a class="primary" routerLink="/back-office">Try again</a>
        <a class="ghost" routerLink="/login">Back to login</a>
      </div>
    </main>
  `,
  styles: `
    .wrap {
      max-width: 480px;
      margin: 12vh auto;
      padding: 0 20px;
      font-family: Arial, sans-serif;
      color: #1a281f;
    }
    .eyebrow {
      margin: 0;
      color: #8a6f1f;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.12em;
    }
    h1 {
      margin: 10px 0;
      font: 500 32px Georgia, serif;
    }
    p {
      color: #667069;
      line-height: 1.5;
    }
    .actions {
      display: flex;
      gap: 12px;
      margin-top: 22px;
      flex-wrap: wrap;
    }
    .primary,
    .ghost {
      display: inline-flex;
      align-items: center;
      border-radius: 10px;
      padding: 11px 16px;
      font-weight: 700;
      text-decoration: none;
    }
    .primary {
      color: white;
      background: #1a6541;
    }
    .ghost {
      color: #1a6541;
      background: #eef3ef;
    }
  `,
})
export class RemoteLoadErrorPage {}
