# Deployed

| | |
|---|---|
| **THE SEVEN** | https://se7en-omega.vercel.app/ |
| **Index of Unquiet Names** | https://se7en-omega.vercel.app/katalog |
| Vercel project | https://vercel.com/fazyzfaz-3046/se7en |
| GitHub repo | https://github.com/jasur-ai/se7en |

## Pipeline (working, verified)

```
push to main  →  GitHub Actions (.github/workflows/deploy.yml)
              →  npx vercel deploy --prod --token $VERCEL_TOKEN
              →  production alias se7en-omega.vercel.app
```

* Repo secret `VERCEL_TOKEN` is set (Actions → Secrets).
* `.vercel/project.json` pins project `se7en` (`prj_9p9muBWMDzfeXYIrrMx34Mjmi9lC`, org `team_66P4fjrngeXuucmcUOSpvGNe`).
* `vercel.json`: clean URLs (`/katalog`), security headers, `404.html` fallback.
* Deployment Protection (Vercel Authentication) is **off** — links are public.

## Rebuild before pushing

```bash
bash build.sh                 # index.html  from _src/
python3 _gen_dread.py         # _src/04b_dread.js
python3 _gen_plates.py        # _src/04c_plates.js (inline drawer plates)
python3 _build_katalog.py     # katalog.html
git add -A && git commit -m "…" && git push
```

## One-time note

Vercel's native Git integration still needs a GitHub *Login Connection* on the Vercel
account, so deploys run through the Actions workflow instead. Once you connect GitHub in
Vercel → Account Settings → Login Connections, the native integration can be linked too
and the workflow can be deleted — nothing else changes.

## Rotate the tokens

Both tokens were pasted into a chat. When you are done:

* Vercel → Settings → Tokens → revoke the `vcp_…` token, then update the repo secret
  `VERCEL_TOKEN` with the new one (`gh secret set` or Settings → Secrets → Actions).
* GitHub → Settings → Developer settings → Fine-grained tokens → revoke `github_pat_…`.
