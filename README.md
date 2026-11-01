# Git & GitHub Workshop

A visual, hands-on beginner guide to Git and GitHub. One HTML file, no install, works offline.

**Live:** https://gitgithubworkshop-ten.vercel.app/

Made for our workshop by **Nishita, Vasu, Yashieta, Abhinav and Aryan**.

## Quick start

Download or clone this repo and open `index.html` in Chrome or Edge. That's it.

```bash
git clone https://github.com/nishik2811-cell/Git-GitHub-Workshop.git
```

## What you'll learn

| # | Topic | Covers |
|---|-------|--------|
| 1 | Introduction | What Git and GitHub are, and why they matter |
| 2 | Repository management | What a repo is (hands-on toy), core commands, push, pull, clone, remotes |
| 3 | Branching & collaboration | Branches, merging, pull requests, conflicts, forking |
| 4 | Repository maintenance | `.gitignore`, READMEs, best practices |
| 5 | Practice lab | A terminal you can type real Git commands into |

### The practice lab

- **Git Bash terminal:** type real commands like `git init`, `add`, `commit`, `switch`, `merge` and `push`.
- **Guided stories:** the pasta recipe (branching and a merge conflict), deleting files, and using `.gitignore`.
- **17 free practice missions** with a "Type it for me" button when you get stuck.
- **VS Code window:** a small floating editor that stays with you as you scroll. Drag it, resize it from the corner, or press `_` to tuck it away.
  - Click the **New File** icon next to EXPLORER, name the file, and type your code straight into it.
  - Then use the terminal to `git add`, `git commit` and `git push` what you wrote.
  - The Explorer colours files like VS Code: green **U** for new, orange **M** for changed, red **!** for a conflict.
  - During a merge conflict it shows VS Code's conflict view: **Accept Current / Incoming / Both Changes**.
- **Real GitHub mode (optional):** send your commands to an actual GitHub repo.

## Real GitHub mode

> ⚠️ Use a separate demo repo you don't mind wiping. Never use it on a repo with real work.

1. Create an empty demo repo on GitHub.
2. Create a [classic token](https://github.com/settings/tokens/new): tick the **repo** box, click **Generate token** and copy it. (Fine-grained tokens can fail here, so use a classic one.)
3. Open `index.html` from your computer (some embedded previews block GitHub requests).
4. Paste the repo link and token into the practice lab. The token stays in the tab's memory and is never saved.
5. **Delete everything in this repo** resets the demo repo so you can run it again.

Never commit a token, and revoke it after the workshop.

## Host your own copy

It's a single static file, so any static host works.

- **Vercel:** import the repo at [vercel.com/new](https://vercel.com/new) and deploy with the default settings. Every push to `main` redeploys.
- **GitHub Pages:** **Settings → Pages → Source: Deploy from a branch → `main` / `(root)` → Save**. It goes live at `https://<your-username>.github.io/<repo-name>/`.

Don't see your changes? Press **Ctrl + Shift + R** to skip the browser cache.

## Rebuilding from source

`src/` has the generator (Python + Pillow) plus the CSS and JS. You only need this to change the content.

```bash
cd src
pip install pillow
python3 pixart.py && python3 gen4.py && python3 build4.py
cp git_github_scrapbook_blue.html ../index.html
```

`build4.py` embeds fonts from `src/fontpkg/node_modules/@fontsource/` (Jersey 10, Nunito, Fira Code), which isn't committed. Install them first:

```bash
cd src && mkdir -p fontpkg && cd fontpkg && npm install @fontsource/jersey-10 @fontsource/nunito @fontsource/fira-code
```
