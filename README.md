# Git & GitHub Workshop

A visual, hands-on beginner guide to Git and GitHub. One HTML file, no install, works offline.

**Live:** https://nishik2811-cell.github.io/Git-GitHub-Workshop/

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
| 2 | Repository management | Core commands, push, pull, clone, remotes |
| 3 | Branching & collaboration | Branches, merging, pull requests, conflicts, forking |
| 4 | Repository maintenance | `.gitignore`, READMEs, best practices |
| 5 | Practice lab | A terminal you can type real Git commands into |

### The practice lab

- **Guided stories:** the pasta recipe (branching and a merge conflict), deleting files, and using `.gitignore`.
- **VS Code-style window:** see your files change as you run commands.
- **Real GitHub mode (optional):** send your commands to an actual GitHub repo.

## Real GitHub mode

> ⚠️ Use a separate demo repo you don't mind wiping. Never use it on a repo with real work.

1. Create an empty demo repo on GitHub.
2. Create a [fine-grained token](https://github.com/settings/tokens/new) for that repo only, with **Contents: Read and write**.
3. Open `index.html` from your computer (some embedded previews block GitHub requests).
4. Paste the repo link and token into the practice lab. The token stays in the tab's memory and is never saved.
5. **Delete everything in this repo** resets the demo repo so you can run it again.

Never commit a token, and revoke it after the workshop.

## Host your own copy

1. Fork or push this repo to your GitHub account.
2. Go to **Settings → Pages → Source: Deploy from a branch → `main` / `(root)` → Save**.
3. After a minute it's live at `https://<your-username>.github.io/<repo-name>/`.

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
