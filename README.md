<div align="center">

# Git & GitHub Workshop

**Warning: may cause sudden confidence.**

<img src="docs/screenshots/start-screen.jpg" alt="The start screen: a pixel-art window called GIT-WORKSHOP.EXE with a big green START button" width="420">

### [▶ Open the workshop](https://gitgithubworkshop-ten.vercel.app/)

A beginner's Git and GitHub course on a tiny pixel computer in your browser.<br>
Read a little, try it straight away, and break things on purpose.

</div>

---

## Start in 30 seconds

1. **Open the link** on a laptop, tablet or phone. No account, nothing to install.
2. **Press START.** A little desktop called the **Mini laptop** appears, with the lessons already open.
3. **Read a module, then open the Practice Lab** and type the commands yourself.

<div align="center">
<img src="docs/screenshots/mini-laptop.jpg" alt="The Mini laptop desktop: the Practice Lab window in the middle of the Teammates story, right after git fetch. The terminal said up to date, but the graph now shows origin/main one commit ahead of main, and a VS Code window shows plan.txt still unchanged" width="100%">
</div>

## What's on the Mini laptop

| App | What it's for |
|---|---|
| **Workshop** | The lessons: nine modules from "what is Git?" to working in a team |
| **Practice Lab** | A Git terminal with a live picture of your files, commits and GitHub, plus guided stories |
| **Git Bash / Terminal** | A plain terminal, like on a real computer: log in with a GitHub token once, then `gh repo create`, `git clone`, `git push` |
| **VS Code** | A look-alike of the real editor, with Source Control, merge conflict buttons and undo / redo |
| **Cheat Sheet** | Every command the lab understands, with search, *Try it* and *Copy* |
| **File Explorer and Bin** | Folders, drag and drop, and restoring things you deleted |
| **Browser** | The project's GitHub page, the setup guide website, and a **New repository** page like github.com/new |
| **Setup-Guide.pdf** | Installing Git, Git Bash and VS Code on your own computer |
| **hehehe** | A folder of memes. Its `task.txt` walks you through putting it on GitHub in a new repo, `workshop-demo`, in Git Bash, without leaking the secret key inside |
| **Notepad** | A drawing app, for sketching branches and merges. Save a drawing to your device, or as a file on the Mini laptop to commit and push |

It behaves like a real desktop: windows move, resize, minimise and pin on phones as well as laptops, and the Start menu search finds lessons, files and commands. Try typing *undo*.

## The nine modules

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

Every module has something to click: diagrams you can play with, drawn GitHub screens where you tap a part to learn what it does, code with a *Copy* button, and a short quiz at the end.

## The Practice Lab

Type a command and watch it happen in four boxes: **working folder → staging area → your commits → GitHub**. Git answers the way real Git does, error messages included.

Five guided stories walk you through it:

| Story | What happens |
|---|---|
| Pasta, branch, conflict | You save a recipe, make a branch, and end in a merge conflict you fix |
| Deleting files | You delete a file by mistake and bring it back |
| The .gitignore file | You keep a password out of GitHub with `.gitignore` |
| Teammates: fetch and pull | Someone pushes while you're not looking: see why `git status` still says *up to date* |
| Your own project | No help this time: you type every command yourself |

After each story there are missions to try alone, with a *Type it for me* button if you get stuck.

## Real GitHub mode

When you're ready, the same commands can work on your real GitHub account. All you need is a token:
make one at **github.com/settings/tokens/new**, tick **repo**, set **Expiration** to **7 days**, and copy it.

**In Git Bash / Terminal** (the simplest way): open it, paste the token, press **Log in**. Then use Git like on a real computer:

```bash
gh repo create my-project --public --source=. --remote=origin --push
```

or `git clone https://github.com/your-name/a-repo.git` for a repo you already have.

**In the Practice Lab:** press **Real GitHub mode**, paste the token, and either paste a repo link or type a name under **No repo yet? Make one**. The stories and the four boxes then use your real repo, and **Switch repo** moves to another one without logging out.

What happens on GitHub is what real Git does:

- **One commit on your laptop is one commit on GitHub**, however many files it has. Merges keep both parents.
- **The first push of a branch needs `-u`** (`git push -u origin main`). After that, plain `git push` and `git pull` work.
- **If someone pushed first, your push is rejected** with Git's own message, until you `git pull`.
- **A link to a repo that doesn't exist** gives Git's real "Repository not found".

The token stays in your browser tab and is never saved. Use a throwaway repo, and delete the token after the workshop.

## The commands it understands

| | |
|---|---|
| Start | `init`, `clone`, `config` |
| Save | `status`, `add`, `commit`, `diff`, `show`, `log`, `ls-files` |
| Undo | `restore`, `reset`, `revert`, `stash` |
| Files | `rm`, `mv`, `.gitignore` |
| Branches | `branch` (also `-M` to rename and `--set-upstream-to`), `switch`, `checkout`, `merge`, `rebase`, `tag` |
| GitHub | `remote` (`add`, `set-url`, `remove`, `-v`), `push` (also `--delete` a branch), `fetch`, `pull`, `gh repo create`, `gh auth` |
| Terminal | `ls`, `cd`, `pwd`, `mkdir`, `touch`, `echo`, `cat`, `mv`, `cp`, `rm` |

Remote addresses can be HTTPS (what the lessons use) or SSH, like `git@github.com:you/repo.git`. The Cheat Sheet lists all 102 commands, each with *Try it* and *Copy*.

## Why this one

Tools like *Learn Git Branching* draw the commit graph as you type. This workshop shows the whole picture:

- **All four places at once:** your folder, the staging area, your history and GitHub.
- **Fetch vs pull you can see:** watch `origin/main` move after `git fetch`.
- **The tools you'll really use:** a VS Code look-alike, Git Bash, and your real GitHub account.
- **A whole course, not just a sandbox:** lessons, stories, missions and quizzes.

## Running a workshop with it

- **One link for everyone.** It works on any laptop, tablet or phone.
- **Works offline.** It's a single HTML file, so you can hand it out on a USB stick if the Wi-Fi gives up.
- **Nothing is saved.** Work lives in the browser tab only. The page asks before you close it if you'd lose something.
- **A ready-made exercise.** The hehehe folder's `task.txt` takes everyone from `git init` to a public `workshop-demo` repo with two commits.
- **Going further.** The Setup-Guide.pdf on the desktop gets people set up on their own computer, on Windows or Linux.

## How the project is built

| File | What's in it |
|---|---|
| `index.html` | The whole site. Open it in a browser and it runs. The lesson text lives here. |
| `src/playground.js` | The Git engine: the Practice Lab, Git Bash / Terminal and VS Code |
| `src/desktop.js`, `src/desktop.css` | The Mini laptop desktop and its apps |
| `src/sync.py` | Copies the `src/` files, the PDF and the memes into `index.html` |
| `docs/` | The setup guide PDF, screenshots and the link preview picture |
| `memes/` | The pictures for the hehehe folder |

After changing anything in `src/`, `docs/` or `memes/`, rebuild the page from the project folder:

```bash
python3 src/sync.py
```

---

<div align="center">

Made by **Nishita, Yashieta, Abhinav, Aryan and Vasu**.

*5 friends, 1 workshop, 0 merge conflicts.*

</div>
