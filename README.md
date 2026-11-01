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
- **VS Code window:** a small floating editor that stays with you as you scroll. Drag it, resize it from the corner, or press `_` to minimise it to the taskbar at the bottom (click its icon there to bring it back). Works on phones too.
  - Click the **New File** or **New Folder** icon next to EXPLORER, name it, and type your code straight into it. Folders open and close with the arrow, and new files go into the folder you selected.
  - Right-click (or long-press on a phone) in the Explorer for **New File, New Folder, Rename and Delete**.
  - Delete a file or folder with the trash icon. It goes to the **Bin** on the desktop, and Git shows it as deleted, ready to `git add` and commit.
  - Then use the terminal to `git add`, `git commit` and `git push` what you wrote.
  - The Explorer colours files like VS Code: green **U** for new, orange **M** for changed, red **!** for a conflict.
  - During a merge conflict it shows VS Code's conflict view: **Accept Current / Incoming / Both Changes**.
  - **Resolve in Merge Editor** opens VS Code's 3-pane Merge Editor (Incoming, Current, Result) with **Complete Merge**.
  - **Source Control panel** (branch icon on the left): Initialize Repository, stage with **+**, unstage with **−**, type a message and **✓ Commit**, and **Merge Branch...**. Click the branch name in the blue status bar to switch or create a branch. Every click shows the matching git command in the terminal, so you can do the whole flow in VS Code or in the terminal.
- **Real GitHub mode (optional):** send your commands to an actual GitHub repo.

### The Mini laptop desktop

- **Start screen:** the site opens on the GIT-WORKSHOP.EXE screen. Press **START** to turn on the Mini laptop.
- **Workshop window:** the lessons open in a window on the right, with the desktop icons still visible on the left. Use **_** to minimise it, **□** for full screen (double-clicking the title bar works too), and drag the title bar or the bottom-right corner to move or resize it. Click it on the taskbar to bring it back. On phones it fills the screen.
- **Desktop icons:** Workshop, VS Code, Browser, Notepad and Bin, plus every file and folder in the Mini laptop's home folder (`~`). Make a folder in the terminal, in VS Code or on the desktop and it shows up in all three. A Git repo folder gets a pink **git** badge.
- **Open things:** double-click (double-tap on a phone) a folder or file to open it in VS Code. Drag icons around, drop one on a folder to move it, on the Bin to delete it, or on VS Code to open it.
- **Right-click the desktop** (long-press on a phone): New folder, New file, Paste, Refresh, Arrange icons, View (large or small icons), Change wallpaper (day, sunset, night) and Personalise (taskbar and window colour).
- **Right-click a file or folder:** Open, Open with VS Code, Cut, Copy, Paste into folder, Rename and Delete. Keyboard: F2 renames, Delete deletes, Ctrl+C / Ctrl+X / Ctrl+V copy, cut and paste.
- **Bin:** things deleted on the desktop or in VS Code land here. **Restore** puts them back (a deleted repo comes back with its history), **Empty Bin** removes them for good. `rm` in the terminal deletes for good, just like real Git Bash.
- **Browser:** the address bar is locked to this repo. **Search** opens it on GitHub in a new tab.
- **Notepad:** draw with the mouse, a pen or your finger. Pen and eraser, six colours, three sizes, Undo, Clear, and **Save** to download your drawing as a picture.
- **Power button:** in the Start menu. It goes back to the start screen, and START picks up where you left off.

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
