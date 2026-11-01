# Git & GitHub Workshop

A visual, interactive beginner guide to Git and GitHub, made for our workshop.
Conducted by Nishita, Vasu, Yashieta, Abhinav and Aryan.

## Open it
Open `index.html` in Chrome or Edge. It is a single file and needs no install.

## What is inside
1. Introduction to Git and GitHub
2. Repository management (commands, push, pull, clone, remotes)
3. Branching and collaboration (branches, merge, pull requests, conflicts, forking)
4. Repository maintenance (.gitignore, README, best practices)
5. Practice lab: a Git Bash / Terminal you can type into, with guided stories
   (pasta + branch + conflict, deleting files, the .gitignore file), a VS Code style
   window, and an optional Real GitHub mode.

## Host it free with GitHub Pages
1. Push this folder to a new GitHub repo.
2. Repo Settings > Pages > Source: Deploy from a branch > `main` / `(root)` > Save.
3. After a minute your guide is live at `https://<your-username>.github.io/<repo-name>/`.

## Real GitHub mode (optional)
Use a separate demo repo you do not mind wiping.
1. Create the repo, then make a token at https://github.com/settings/tokens/new
   with access to that repo (Contents: read and write).
2. Paste the repo link and the token into the practice lab. The token stays in the
   browser tab's memory only and is never saved.
3. Open `index.html` from your computer (Chrome or Edge). Some embedded previews block GitHub requests.
4. "Delete everything in this repo" clears the demo repo so you can run it again.
   Never use it on a repo with real work.
Never commit a token. Revoke it after the workshop.

## Rebuild from source
`src/` holds the generator (Python + PIL) and the CSS and JS.
Run `python3 pixart.py && python3 gen4.py && python3 build4.py` inside `src/`.
(Fonts are embedded at build time.)
