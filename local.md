# Running Junction locally

This workspace uses **Nx with Angular Architects Native Federation**:

- `shell` is the host at `http://localhost:4200`.
- `back-office` is the remote at `http://localhost:4201`.
- The backend API is expected at `http://localhost:8000`.

## Install dependencies

Run this once from the `back-web` folder:

```powershell
npm install
```

## Recommended: start the complete MFE

One Nx command starts both Native Federation development servers:

```powershell
npm start
```

The underlying Nx command is:

```powershell
npx nx run-many --target=serve --projects=shell,back-office --parallel=2
```

Open `http://localhost:4200`. Nx serves `back-office` on port `4201` and the shell loads its `remoteEntry.json` through the runtime federation manifest.

## Start through Nx Console

1. Install or enable the **Nx Console** VS Code extension (`nrwl.angular-console`). It is already recommended by this workspace.
2. Open the Nx Console panel.
3. Select **Run Target**.
4. Select **Run Many**.
5. Select target **serve** and projects **shell** and **back-office**.
6. Enable parallel execution and select **Run**.

This is the Nx Console equivalent of the recommended terminal command.

## Start all applications

`start:all` is an alias for the same Native Federation orchestration:

```powershell
npm run start:all
```

The shell and remote are independent Native Federation servers, so Nx `run-many` is the intended workflow.

## Start applications separately

Use two terminals when debugging one server at a time.

Terminal 1:

```powershell
npm run start:back-office
```

Terminal 2:

```powershell
npm run start:shell
```

The direct Nx equivalents are:

```powershell
npx nx serve back-office
npx nx serve shell
```

## Build locally

Build both applications:

```powershell
npm run build
```

Build one application:

```powershell
npm run build:shell
npm run build:back-office
```

View the Nx dependency graph:

```powershell
npx nx graph
```

## Add another MFE later

After adding another remote project, add its URL to `apps/shell/public/federation.manifest.json`, then start all development applications with:

```powershell
npx nx run-many --target=serve --projects=shell,back-office,another-remote --parallel=3
```

## Stop the servers

Press `Ctrl+C` in the terminal running Nx.
