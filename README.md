<div align="center">

# Git & GitHub Workshop

**Warning: may cause sudden confidence.**

<img src="docs/screenshots/start-screen.jpg" alt="The start screen: a pixel-art window called GIT-WORKSHOP.EXE with a big green START button" width="420">

**[Open the workshop in your browser](https://gitgithubworkshop-ten.vercel.app/)**

</div>

## What it is

A complete beginner's course in Git and GitHub that runs on a tiny pixel computer in your browser.

Press **START** and you get a little desktop called the **Mini laptop**. On it you'll find lessons that explain everything from zero, a **Practice Lab** where you type real Git commands, and a **VS Code** look-alike. Whatever you read about, you can try straight away, on a computer you can't break.

It is one HTML file: nothing to install, no account, and it works on laptops, tablets and phones, even offline.

<div align="center">
<img src="docs/screenshots/mini-laptop.jpg" alt="The Mini laptop desktop: the Practice Lab window in the middle of the Teammates story, right after git fetch. The terminal said up to date, but the graph now shows origin/main one commit ahead of main, and a VS Code window shows plan.txt still unchanged" width="100%">
</div>

## How you learn

1. **Read a little.** Every idea gets one plain sentence, a picture and something to click.
2. **Try it.** Type the real commands in the Practice Lab, or click the same buttons you would in VS Code. Git answers the way real Git does, error messages included.
3. **Break things on purpose.** Cause a merge conflict, delete a file, undo it. Nothing leaves your browser unless you choose to.

## What's inside

### 1. The Workshop: nine modules

| | Module | You'll learn |
|---|---|---|
| 1 | Foundational concepts | What Git and GitHub are, where Git came from, centralized vs distributed |
| 2 | Setup and the 4 states | Installing Git, `git config`, the working folder, staging area, local and remote repo |
| 3 | Everyday commands | `init`, `status`, `add`, `commit` and reading the history with `git log` |
| 4 | Ignoring files | `.gitignore`, `git rm --cached` and keeping empty folders with `.gitkeep` |
| 5 | Branches and more | Branches, merging, conflicts, `stash`, rebase vs merge and tags |
| 6 | GitHub | Remotes, push, pull, clone, and fetch vs pull |
| 7 | Git with buttons | VS Code Source Control, Git Graph and GitHub Desktop |
| 8 | Teamwork | Forks, pull requests, issues, branch protection and the three ways to merge |
| 9 | Good habits | Commit messages, small commits, keeping secrets out, and using AI safely |

Each module has diagrams you can play with, drawn GitHub and VS Code screens where you tap a part to learn what it is for, code with a *Copy* button, words you can tap for a definition, and a short quiz at the end.

### 2. The Practice Lab

A terminal, with a live picture beside it that updates with every command: **working folder → staging area → your commits → GitHub**.

- **Five guided stories** that play out step by step:
  1. A pasta recipe that ends in a merge conflict.
  2. A deleted file you bring back.
  3. A password you keep out of GitHub with `.gitignore`.
  4. **Teammates:** someone pushes while you're not looking. You see why `git status` still says *up to date*, and how `git fetch` and `git pull` differ.
  5. **Your own project:** you type every command yourself.
- **Missions** after each story, with a *Type it for me* button if you get stuck.
- **A commit graph** that shows where `origin/main` is. Click a commit to see which files it changed.

### 3. VS Code

A look-alike of the real editor, with the Explorer, Source Control (stage, unstage, commit, switch branches) and the merge conflict buttons. The first time you open the real VS Code, it already looks familiar.

### 4. Real GitHub mode

When you're ready, connect a throwaway GitHub repo with a token, and your `git push`, `git pull` and `git clone` work on real GitHub. Use a token you delete straight after the workshop.

### 5. The rest of the Mini laptop

- **Cheat Sheet:** every command the lab understands, each with a line on what it does, a search box, *Try it* and *Copy*.
- **File Explorer and Bin:** folders, drag and drop, select several things, restore deleted files.
- **Start menu search:** type what you want to do, like *undo* or *upload*, and it suggests the command.
- **Setup guide:** installing Git, Git Bash and VS Code on your own computer, as a PDF and as a website in the Browser.
- **The hehehe folder:** real picture files to `git add` and push, with a practice task: upload it without leaking the secret key hidden inside.
- **Notepad:** a little drawing app, for sketching branches and merges.
- **A real-feeling desktop:** windows you can move, resize, minimise and pin, on a phone as well as a laptop, plus wallpapers and colour themes.

Everything you make lives in your browser tab only. It is gone when you close or reload the page, and the page asks first if you would lose work.

## The commands it understands

| | |
|---|---|
| Start | `init`, `clone`, `config` |
| Save | `status`, `add`, `commit`, `diff`, `show`, `log`, `ls-files` |
| Undo | `restore`, `reset`, `revert`, `stash` |
| Files | `rm`, `mv`, `.gitignore` |
| Branches | `branch`, `switch`, `checkout`, `merge`, `rebase`, `tag` |
| GitHub | `remote`, `push`, `fetch`, `pull` |
| Terminal | `ls`, `cd`, `pwd`, `mkdir`, `touch`, `echo`, `cat`, `mv`, `cp`, `rm` |

Remote addresses can be HTTPS (what the lessons use) or SSH, like `git@github.com:you/repo.git`.

## How it's different

Tools like *Learn Git Branching* draw the commit graph as you type. This workshop shows the whole picture:

- **All four places at once:** your folder, the staging area, your history and GitHub.
- **Fetch vs pull you can see:** watch `origin/main` move after `git fetch`.
- **The tools you'll really use:** a VS Code look-alike and a real GitHub mode.
- **A whole course, not just a sandbox:** lessons, stories, missions and quizzes.

## Running a workshop with it

- Everyone opens the same link, on any laptop, tablet or phone. No accounts, nothing to install.
- It's one HTML file, so it works offline too: hand it out on a USB stick if the Wi-Fi gives up.
- When people want Git on their own computer, the **Setup-Guide.pdf** on the desktop walks them through it, on Windows or Linux.

## How the project is built

- **`index.html`** is the whole site. Open it in a browser and it runs.
- The lesson text lives directly in `index.html`.
- The Practice Lab, the desktop and their styles live in `src/playground.js`, `src/desktop.js` and `src/desktop.css`. After changing them, run this from the project folder to copy them into `index.html`:

  ```bash
  python3 src/sync.py
  ```

- `docs/` holds the setup guide PDF, the screenshots and the link preview picture. `memes/` holds the pictures for the hehehe folder.

---

<div align="center">

Made by **Nishita, Yashieta, Abhinav, Aryan and Vasu**.

*5 friends, 1 workshop, 0 merge conflicts.*

</div>
