import re,json
from mocks import *
SV=json.load(open('svgs.json'))
def sv(label,w=None):
    s=SV[label]
    return s
_SP=['heart','sparkle','flower','star','cloud','heartb','folder','flower2']
_n=[0]
def card(cid,col,fname,title,body,wide=True):
    sp=_SP[_n[0]%len(_SP)];_n[0]+=1
    return ('<div class="card wide" id="%s"><div class="tbar t-%s"><span>%s</span><i class="sp sp-%s"></i><span class="dots"><i></i><i></i><i></i></span></div>\n<div class="topic"><h3>%s</h3></div>\n<div class="body">%s</div>\n</div>\n'
            %(cid,col,fname,sp,title,body))
_DECO={'p1':'<i class="sp sp-cloud bob"></i><i class="sp sp-sparkle bob2"></i>','p2':'<i class="sp sp-flower bob"></i><i class="sp sp-heart bob2"></i>','p3':'<i class="sp sp-heartb bob"></i><i class="sp sp-sparkle bob2"></i>','p4':'<i class="sp sp-star bob"></i><i class="sp sp-sparkle bob2"></i>'}
def phase(pid,num,cls,title,sub,idx,cards,g2=True):
    chips=''.join('<a href="#%s">%s</a>'%(i,l) for i,l in idx)
    return ('<section class="phase %s" id="%s">\n<div class="banner"><div class="pn">%s</div><div><h2>%s</h2><small>%s</small></div><span class="rule"></span>%s</div>\n<div class="idx">%s</div>\n<div class="grid">\n%s</div></section>\n<div class="grass"></div>\n'
            %(cls,pid,num,title,sub,_DECO[cls],chips,cards))
def term(cmds,title='GIT BASH / TERMINAL'):
    return '<div class="term"><div class="bar"><i></i><span>%s</span></div><pre>%s</pre></div>'%(title,cmds)
def lead(t): return '<p class="lead">%s</p>'%t
def sub(t): return '<p class="sub">%s</p>'%t
def stage(inner): return '<div class="stage">%s</div>'%inner
def trio(items,two=False):
    h='<div class="trio%s">'%(' t2' if two else '')
    for (sp,col,t,d) in items:
        h+='<div class="t m-%s">%s<b>%s</b>%s</div>'%(col,('<i class="sp sp-%s"></i>'%sp) if sp else '',t,d)
    return h+'</div>'
def play(title,inner): return '<div class="play"><div class="ph">TRY IT: %s</div><div class="pb">%s</div></div>'%(title,inner)
def remember(t,sp='star'): return '<div class="remember"><i class="sp sp-%s"></i><span>%s</span><i class="sp sp-%s"></i></div>'%(sp,t,sp)
def wd(title,text,yes,no,yp,np_,kind='warn'):
    return ('<div class="wd"><div class="dh"><span>%s</span><span>x</span></div><div class="db">%s<div class="row"><button data-pop="%s|%s|%s">%s</button><button data-pop="%s|%s|%s">%s</button></div></div></div>'
            %(title,text,kind,yp[0],yp[1],yes,kind,np_[0],np_[1],no))
def srows(items):
    return '<div class="steps">'+''.join('<div class="srow"><div class="n">%d</div><p>%s</p></div>'%(i+1,t) for i,t in enumerate(items))+'</div>'
def irow(n,text,fig=''):
    if not fig: return '<div class="irow nofig"><div class="tx"><div class="n">%d</div><p>%s</p></div></div>'%(n,text)
    return '<div class="irow">%s<div class="tx"><div class="n">%d</div><p>%s</p></div></div>'%(fig,n,text)
def wiz(wid,steps):
    h='<div class="wiz" id="%s"><div class="wnav"><span class="wcount"></span><div class="wbar"><i></i></div></div>'%wid
    for (t,s,body) in steps:
        h+='<div class="ws"><h4>%s</h4>%s%s</div>'%(t,('<p class="sub">%s</p>'%s) if s else '',body)
    h+='<div class="wbtns"><button class="wprev">&lt; Back</button><button class="wnext greenbtn">Next &gt;</button></div></div>'
    return h
def ospicker(tid,prefix,panels):
    h='<div class="btns" id="%s"><button data-os="win" class="on">Windows</button><button data-os="mac">macOS</button><button data-os="lin">Linux</button></div>'%tid
    for k,p in zip(('win','mac','lin'),panels):
        h+='<div id="%s%s"%s>%s</div>'%(prefix,k,'' if k=='win' else ' style="display:none"',p)
    return h

# =============== PHASE 1 ===============
p1=''
p1+=card('t1-1','a','P1_01_WHAT-IS-GIT.TXT','1. What is Git?',
 lead('Git is a <mark>save button</mark> for your whole project.')
 +sub('Think of a video game. You save at a good moment, and if you mess up later, you load that save and carry on. Git does exactly this, but for your files.')
 +trio([('heart','pink','Commit','One save point. It carries a short note like "add results".'),('folder','sun','Repository','Your project folder, being watched by Git. People say "repo".'),('star','sky','History','The list of every save point, newest first.')])
 +play('travel through time','<p style="margin:0 0 8px">Click a save point, or drag the slider, to see what the folder looked like.</p><div class="snaps" id="snaps"></div><input type="range" id="snapSlider" min="0" max="2" value="1" step="1" aria-label="Scrub through save points"><div class="panel" id="snapPanel"></div><p style="margin:10px 0 0;font-size:14px;color:var(--ink2)">Tip: click the broken one and a warning pops up.</p>')
 +'<p class="sub" style="margin-top:22px"><b>What does Git look like?</b> Just a black window where you type short commands:</p>'
 +fig(m_gitlog(),(),'This is <b>Git Bash</b> showing <code>git log</code>. Each line is one save point.')
 +remember('Git is a program on YOUR computer. It works even without internet.','heart'))

p1+=card('t1-2','b','P1_02_WHY-NEED-GIT.GIF','2. Why do we need Git?',
 lead('Because <mark>report_FINAL_really_v3.docx</mark> is not a system.')
 +stage('<div class="pair"><div>'+SV['A messy pile of copied files']+'<span class="cap2">Without Git</span><small>Copies everywhere. Which one is the real one?</small></div><div>'+SV['One file with a tidy history']+'<span class="cap2">With Git</span><small>One file. Every old version is saved inside.</small></div></div>')
 +play('make a mess','<p style="margin:0 0 10px">Save a new file with a name that is already taken:</p><div class="btns"><button id="saveBtn">Save as report_FINAL_really.docx</button></div><p id="saveNote" style="font-size:14.5px;min-height:22px;margin:0"></p>')
 +'<p class="sub" style="margin-top:22px"><b>The second problem:</b> two people, one file.</p>'
 +stage(SV['Two people edit the same file and the last save wins'])
 +trio([('heartb','sky','Go back in time','Broke something? Return to any earlier save.'),('flower','mint','Work together','Many people, one project, no overwriting.'),('sparkle','sun','See who did what','Every change shows who, when and why.')])
 +remember('Git gives you undo, teamwork and a diary of changes.','star'))

p1+=card('t1-3','c','P1_03_WHAT-IS-GITHUB.DOC','3. What is GitHub?',
 lead('Git is the <mark>app on your laptop</mark>. GitHub is the <mark>website</mark> where you share your project.')
 +trio([('pad','lav','Git','Like the notebook where you write and save your work. It stays on your computer.'),('cloud','sky','GitHub','Like a shelf in a public library. You put a copy there so friends can read and add to it.')],True)
 +stage(SV['A laptop with Git connected to the GitHub website, with teammates'])
 +'<p class="sub"><b>This is what a project looks like on GitHub.</b> Look at the numbers:</p>'
 +fig(m_repo(),['The project name: owner / repository','The tabs along the top','The list of files','The green Code button: copy the link to download it','The Fork button: make your own copy'],'A drawn picture of a GitHub project page. The real page looks very similar.')
 +'<div class="note y">Git works fine without GitHub. GitLab and Bitbucket are other websites that do the same job.</div>'
 +remember('Git = the tool. GitHub = the website. You use both together.','cloud'))

p1+=card('t1-4','d','P1_04_CENTRALIZED-VS-DISTRIBUTED.EXE','4. Centralized vs Distributed Version Control Systems',
 lead('Where does the history live? In <mark>one place</mark>, or <mark>everywhere</mark>?')
 +sub('Imagine a library book. In a <b>centralized</b> system there is one copy and everyone must queue for it. In a <b>distributed</b> system everyone owns a full photocopy of the whole book.')
 +'<div class="vcswrap"><div class="pair vcs" id="vcs"><div><span class="cap2">Centralized</span><div id="vcsC"></div><small>One server holds the history. Everyone else has only the latest files.</small></div><div><span class="cap2">Distributed (Git)</span><div id="vcsD"></div><small>Everyone has the full history on their own laptop.</small></div></div>'
 +'<div class="btns" style="justify-content:center"><button id="crashBtn" class="redbtn">Crash the server!</button><button id="fixBtn">Fix it</button></div><p id="vcsMsg" class="note" style="min-height:48px;margin:8px auto 0"></p></div>'
 +'<table><tr><th></th><th>Centralized</th><th>Distributed (Git)</th></tr><tr><td>Server breaks</td><td class="bad">Nobody can save history</td><td class="good">Everyone still has everything</td></tr><tr><td>No internet</td><td class="bad">Very limited</td><td class="good">Keep saving, upload later</td></tr><tr><td>Backups</td><td class="bad">One copy to protect</td><td class="good">Every copy is a backup</td></tr></table>'
 +remember('Git is distributed, so it is safer and works offline.','heartb'))

# ---- setup wizard ----
def term_panel(figh,txt): return '<div class="irow nofig"><div class="tx"><div class="n">&#9733;</div><p>%s</p></div></div>'%txt+figh
w0=ospicker('termTabs','term-',[
 '<p class="sub">Click the Start button, type <b>Git Bash</b> and press Enter. (You will install it in the next step. Until then you can use <b>Command Prompt</b>.)</p>'+fig(m_gitbash(),(),'Git Bash on Windows: a black window with a blinking cursor.'),
 '<p class="sub">Press <b>Cmd + Space</b>, type <b>Terminal</b>, press Enter.</p>'+fig(m_mac(),(),'Terminal on a Mac.'),
 '<p class="sub">Press <b>Ctrl + Alt + T</b>, or search your apps for <b>Terminal</b>.</p>'+fig(m_linux(),(),'Terminal on Linux (Ubuntu).')])
w0+='<div class="trio">'+''.join('<div class="t m-%s"><b>%s</b>%s</div>'%(c,a,b) for (a,b,c) in [('pwd','Which folder am I in?','sky'),('ls','List the files here','mint'),('cd name','Go into a folder','sun')])+'</div>'
w0+=term('<span class="cm"># lines starting with # are notes, do not type them</span>\n$ git --version\n<span class="o">git version 2.xx.x</span>','GIT BASH / TERMINAL')
w0+='<p class="sub" style="margin-top:8px">The <code>$</code> is just the terminal waiting for you. <b>Do not type it.</b> Type the rest and press <b>Enter</b>.</p>'

win=(irow(1,'Go to <a href="https://git-scm.com/download/win">git-scm.com/download/win</a>. The download starts by itself. If not, click "Click here to download".',fig(m_download(),['Click here to download'],''))
 +irow(2,'Open the downloaded file (<code>Git-2.xx.x-64-bit.exe</code>). If Windows asks "Do you want to allow this app to make changes?" click <b>Yes</b>.')
 +irow(3,'You will see many screens. On almost all of them, <b>just click Next</b>. The default choices are fine.',fig(m_inst_next(),['The Next button'],''))
 +irow(4,'One screen is worth reading: <b>"Adjusting the name of the initial branch"</b>. Pick <b>"Override..."</b> and keep the name <code>main</code>.',fig(m_inst_branch(),['Choose this and keep <b>main</b>'],''))
 +irow(5,'Click <b>Install</b>, wait for the green bar, then <b>Finish</b>.')
 +irow(6,'Click Start, type <b>Git Bash</b>, press Enter. That black window is your terminal for the whole workshop.',fig(m_start(),['Git Bash in the Start menu'],'')))
mac=(irow(1,'Open Terminal: <b>Cmd + Space</b>, type <b>Terminal</b>, Enter.')
 +irow(2,'Type <code>git --version</code> and press Enter.',fig(m_mac(),(),''))
 +irow(3,'If a box asks about the <b>command line developer tools</b>, click <b>Install</b> and wait a few minutes.',fig(m_macpopup(),['Click Install'],''))
 +irow(4,'Type <code>git --version</code> again. A version number means you are done.')
 +irow(5,'Optional: if you use Homebrew, <code>brew install git</code> also works.'))
lin=(irow(1,'Open the terminal: <b>Ctrl + Alt + T</b>.')
 +irow(2,'Type <code>sudo apt update</code> and press Enter. Type your password when asked. Nothing shows while you type it, and that is normal.')
 +irow(3,'Type <code>sudo apt install git</code>, press Enter, and type <code>y</code> when it asks. (Fedora: <code>sudo dnf install git</code>.)',fig(m_linux(),(),''))
 +irow(4,'Check with <code>git --version</code>.'))
w1=ospicker('osTabs','os-',[win,mac,lin])
w2=(term('$ git --version\n<span class="o">git version 2.43.0</span>','GIT BASH / TERMINAL')
 +trio([('heart','mint','You see "git version ..."','Perfect! Go to the next step. Your numbers may differ, that is fine.'),('sparkle','pink','You see an error','Close the terminal and open a new one. Still stuck? See the last step.')],True))
w3=(srows(['Go to <a href="https://github.com">github.com</a> and click <b>Sign up</b>.','Type your <b>email</b>, make a <b>password</b>, pick a <b>username</b>.','Solve the small puzzle, then type the code GitHub emails you.','Choose the <b>Free</b> plan. Skip any extra questions.'])
 +fig(m_signup(),['Your email','A password','A username','Click Create account'],'The GitHub sign-up page.')
 +'<div class="note p">Your username is public and appears in your project links, so pick something you are happy to show.</div>')
w4=('<p class="sub">Every save point is signed with a name and email. You do this <b>once</b> per computer. Change the name and email to yours.</p>'
 +term('$ git config --global user.name "Nishita Kumari"\n$ git config --global user.email "you@example.com"\n$ git config --global init.defaultBranch main','GIT BASH / TERMINAL')
 +'<p class="sub" style="margin-top:10px">Nothing is printed when it works. No news is good news. To double check:</p>'
 +term('$ git config --list\n<span class="o">user.name=Nishita Kumari\nuser.email=you@example.com\ninit.defaultbranch=main</span>','GIT BASH / TERMINAL')
 +'<div class="note y">Use the same email as your GitHub account. The first time you upload, a browser window opens to sign in. Click Authorize. Your account password will not work in the terminal.</div>')
w5=('<div class="pair" style="align-items:start"><div><p style="margin:0 0 6px"><b>Tick what you have done</b></p><div class="meter" style="width:100%"><i id="setBar"></i></div><p id="setMsg" style="margin:6px 0;font-size:14px"></p><div id="setList" style="width:100%;text-align:left"></div></div>'
 +'<div style="width:100%;text-align:left"><p style="margin:0 0 6px;text-align:center"><b>Common problems. Click one.</b></p>'
 +'<details><summary>"git is not recognized" / "command not found"</summary><div class="dbody">Close every terminal and open a new one. On Windows use <b>Git Bash</b>. Still failing? Run the installer again with the recommended choices.</div></details>'
 +'<details><summary>"Please tell me who you are"</summary><div class="dbody">You skipped the name and email step. Run the two <code>git config --global</code> commands.</div></details>'
 +'<details><summary>A box asks for developer tools (Mac)</summary><div class="dbody">Normal. Click <b>Install</b> and wait, then run <code>git --version</code>.</div></details>'
 +'<details><summary>The GitHub email never arrived</summary><div class="dbody">Check spam, wait a minute, click <b>Resend</b>, and check the email you typed.</div></details>'
 +'<details><summary>Password rejected when pushing</summary><div class="dbody">Use the browser sign-in window that opens. If there is none, create a personal access token in GitHub Settings, Developer settings.</div></details></div></div>')
p1+=card('t1-5','a','P1_05_SETUP-AND-INSTALLATION.EXE','5. Git and GitHub setup and installation',
 lead('Six small steps. <mark>No experience needed.</mark>')
 +sub('Press Next on each screen, like an installer. Try it before the session. We will also do it together.')
 +wiz('setupWiz',[('Step 1: Meet the terminal','A terminal is a window where you <b>type instructions</b> (called commands) instead of clicking.',w0),
   ('Step 2: Install Git','Pick your computer type and follow the numbers.',w1),
   ('Step 3: Check that it works','Open your terminal and type the command, then press Enter.',w2),
   ('Step 4: Make a GitHub account','This happens in your web browser. It is free.',w3),
   ('Step 5: Tell Git who you are','',w4),
   ('Step 6: Checklist and fixes','Tick everything off. If something went wrong, open a problem box.',w5)]))

# =============== PHASE 2 ===============
p2=''
p2+=card('t2-1','b','P2_01_INTRO-TO-REPOSITORIES.EXE','1. Introduction to repositories',
 lead('A repository is <mark>a folder that remembers</mark>.')
 +'<div class="rvs"><div class="rvs-side"><small>WITHOUT GIT</small><span class="fchip plain">report.docx</span><span class="fchip plain">report_final.docx</span><span class="fchip plain">report_final2.docx</span><span class="fchip plain">report_FINAL_real.docx</span></div><b class="rvs-arrow">&rarr;</b><div class="rvs-side ok"><small>WITH GIT</small><span class="fchip clean"><b>&#10003;</b>report.docx</span><span class="rvs-h">+ every old version, inside <code>.git</code></span></div></div>'
 +play('make a folder remember','<p class="rp-goal" id="rpGoal"></p>'
  +'<div class="rp"><div class="rp-box" id="rpLocal"><div class="rp-h"><span>YOUR LAPTOP</span><em id="rpLtag">just a folder</em></div><div class="rp-b"><div class="rp-dir">my-project/</div><div id="rpFiles"></div><div class="rp-git" id="rpGit"></div></div></div>'
  +'<div class="rp-box rp-cloud" id="rpRemote"><div class="rp-h"><span>GITHUB</span><em id="rpRtag">empty</em></div><div class="rp-b" id="rpCloud"></div></div></div>'
  +'<pre class="rp-cmd" id="rpCmd">$ </pre><p class="rp-say" id="rpSay"></p>'
  +'<div class="btns"><button id="rpInit">git init</button><button id="rpEdit">Edit a file</button><button id="rpSave">Save a snapshot</button><button id="rpPush">Push to GitHub</button><button id="rpDel" class="redbtn">Delete .git</button><button id="rpReset">Start over</button></div>')
 +trio([('folder','sun','Local repo','The repo on your laptop. You work here.'),('cloud','sky','Remote repo','A copy of it online, on GitHub. Your backup and your team\'s meeting point.')],True)
 +remember('Repository = your files + the hidden <code>.git</code> folder that remembers them.','folder'))

p2+=card('t2-2','c','P2_02_CREATING-AND-MANAGING-REPOS.EXE','2. Creating and managing GitHub repositories',
 lead('Let us <mark>make one</mark> in four steps.')
 +wiz('repoWiz',[
  ('Step 1: Find the + button','Sign in to <a href="https://github.com">github.com</a>. Look at the top right.',fig(m_home(),['Click the + at the top right','Choose New repository'],'The GitHub home page.')),
  ('Step 2: Fill in the form','Name it with dashes, no spaces. Public means anyone can see it. Private means only you and people you choose.',fig(m_new(),['Type a name','Public or Private','Tick the README box','Click Create repository'],'The new repository form.')),
  ('Step 3: Look around','Your repo is ready. These are the parts of the page.',fig(m_repo(),['Repository name','The tabs','Files','Code button','Fork button'],'A repository page.')),
  ('Step 4: Learn the tabs','Click a tab name to see what it is for.','<div class="btns" id="tabBtns" style="justify-content:center"><button data-t="code" class="on">Code</button><button data-t="issues">Issues</button><button data-t="prs">Pull requests</button><button data-t="actions">Actions</button><button data-t="settings">Settings</button></div><div class="panel" id="tabPanel" style="min-height:80px;text-align:left"></div>')])
 +remember('A repo on GitHub is just a project page with files, tabs and a clone link.','sparkle'))

p2+=card('t2-3','d','P2_03_BASIC-GIT-COMMANDS.GIF','3. Basic Git commands: git init, add, commit, status, log',
 lead('Think of <mark>packing a parcel</mark>.')
 +trio([('folder','sun','git add','Put things in the box.'),('heart','pink','git commit','Seal the box and write a label on it.'),('star','sky','git log','Look at all the boxes you sealed.')])
 +play('follow a file','<p style="margin:0 0 8px">Press <b>Next step</b> and watch a file travel.</p><div class="zones" id="zones"><div class="zn"><b>Working folder</b><small>where you edit files</small><div class="slot"></div></div><div class="zn"><b>Staging area</b><small>the box, ready to seal</small><div class="slot"></div></div><div class="zn"><b>Local repo</b><small>your saved history</small><div class="slot"></div></div><div class="zn"><b>GitHub</b><small>the online copy</small><div class="slot"></div></div></div><pre id="cmdLine" style="margin:6px auto">$ mkdir recipes</pre><div class="cap" id="cap"></div><div class="btns"><button id="nextBtn" class="greenbtn">Next step</button><button id="resetBtn">Start again</button></div>')
 +'<p class="sub"><b>The five commands.</b> Click a card to flip it.</p>'
 +'<div class="flips">'+''.join('<div class="flip" tabindex="0"><div class="flip-in"><div class="face m-%s"><b>%s</b><small>click to flip</small></div><div class="face back m-%s">%s</div></div></div>'%(c,a,c,b) for (a,b,c) in [('git init','Start watching this folder. Once per project.','lav'),('git status','What changed? What is ready to save?','mint'),('git add','Pick changes for the next save point.','pink'),('git commit -m "note"','Save the picked changes with a note.','sky'),('git log','List all past saves, newest first.','sun')])+'</div>'
 +'<p class="sub" style="margin-top:20px"><b>All together, line by line:</b></p>'
 +term('$ mkdir recipes\n$ cd recipes\n$ git init\n<span class="o">Initialized empty Git repository in recipes/.git/</span>\n$ echo "Pasta" > pasta.txt\n$ git status\n<span class="o">Untracked files:\n    pasta.txt</span>\n$ git add pasta.txt\n$ git commit -m "Add pasta recipe"\n<span class="o">[main a3f9c21] Add pasta recipe\n 1 file changed, 1 insertion(+)</span>\n$ git log --oneline\n<span class="o">a3f9c21 Add pasta recipe</span>','GIT BASH / TERMINAL')
 +'<div class="note b">Why a staging box? You changed five files but only two belong together. Add those two, save them, and the other three wait for their own save.</div>')


p2+=card('t2-4','a','P2_04_PUSH-PULL-AND-CLONE.DOC','4. Push, Pull and Clone',
 lead('Your laptop and GitHub are two copies. <mark>These commands post work between them.</mark>')
 +stage(SV['Laptop and GitHub with arrows for push, pull and clone'])
 +trio([('heart','pink','git push','Post your new commits UP to GitHub.'),('heartb','mint','git pull','Bring new commits DOWN from GitHub.'),('folder','lav','git clone','Download a whole project for the first time.')])
 +'<p class="sub"><b>Your first push, step by step</b></p>'
 +srows(['On GitHub, create a new repo. If your project already has commits, leave "Add a README" <b>unticked</b>.','Click the green <b>Code</b> button and copy the web address.','In your terminal, inside your project folder: <code>git remote add origin PASTE-THE-ADDRESS</code>','Name your branch main: <code>git branch -M main</code>','Upload: <code>git push -u origin main</code>. A browser window may open. Click Authorize.','Refresh the GitHub page. Your files are there!'])
 +'<p class="sub"><b>Cloning</b> is easier. The link comes from the green Code button:</p>'
 +fig(m_clone(),['Copy the web address and paste it after <code>git clone</code>'],'')
 +term('$ git clone https://github.com/user/recipes.git\n<span class="o">Cloning into \'recipes\'... done.</span>\n$ cd recipes\n$ git pull\n<span class="o">Already up to date.</span>','GIT BASH / TERMINAL')
 +remember('Push = upload. Pull = download the latest. Clone = download everything once.','heart'))

p2+=card('t2-5','b','P2_05_UNDERSTANDING-REMOTE-REPOSITORIES.EXE','5. Understanding remote repositories',
 lead('A remote is <mark>the online copy</mark>, saved in your contacts under a nickname.')
 +sub('The usual nickname is <code>origin</code>. Your laptop even remembers where GitHub was the last time you checked, as <code>origin/main</code>.')
 +stage(SV['Your laptop and GitHub, with push and fetch arrows'])
 +trio([('sparkle','sun','git remote -v','Show my remotes and their addresses.'),('cloud','sky','git fetch','Check what is new online, but do not touch my files.'),('heartb','mint','git pull','Fetch, and also bring the new work into my files.')])
 +'<div class="note y"><code>git push -u origin main</code> uploads and remembers the link. After that, plain <code>git push</code> and <code>git pull</code> know where to go.</div>'
 +remember('Remote = the online copy. origin = its nickname.','cloud'))

# =============== PHASE 3 ===============
p3=''
p3+=card('t3-1','c','P3_01_INTRODUCTION-TO-BRANCHES.TXT','1. Introduction to branches',
 lead('A branch is <mark>a draft copy</mark> where you can experiment safely.')
 +sub('You wrote a perfect essay and want to try a risky new ending. You would not edit the only copy. You would make a draft. If the ending is great, you keep it. If not, you throw the draft away.')
 +stage(SV['Main line with a side branch that later rejoins'])
 +trio([('heartb','sky','Safe','Whatever you break on a branch never touches main.'),('flower','mint','Parallel','Each teammate works on their own branch at the same time.')],True)
 +remember('main is the official version. Branches are side roads.','star'))

p3+=card('t3-2','d','P3_02_CREATING-AND-SWITCHING-BRANCHES.GIF','2. Creating and switching branches',
 lead('Three commands. <mark>That is all.</mark>')
 +trio([('star','sun','git branch','List my branches. The * marks where I am.'),('heart','pink','git switch -c name','Make a new branch and move onto it.'),('cloud','sky','git switch name','Move to a branch that already exists.')])
 +term('$ git branch\n<span class="o">* main</span>\n$ git switch -c feature/login\n<span class="o">Switched to a new branch \'feature/login\'</span>\n$ git branch\n<span class="o">* feature/login\n  main</span>\n$ git switch main\n<span class="o">Switched to branch \'main\'</span>','GIT BASH / TERMINAL')
 +'<div class="note y">No spaces in branch names. Use dashes: <code>add-login-page</code>. Older guides use <code>git checkout -b</code>, which does the same job.</div>')

p3+=card('t3-3','a','P3_03_BRANCHING-AND-MERGING.EXE','3. Branching and merging',
 lead('When your branch is ready, you <mark>merge</mark> it back into main.')
 +play('build a branch tree','<p style="margin:0 0 8px">Press the buttons in order: 1, 2, then 3.</p><div class="btns"><button id="bBranch">1 · New branch</button><button id="bFeat">2 · Commit on branch</button><button id="bMain">Commit on main</button><button id="bMerge">3 · Merge</button><button id="bReset">Reset</button></div><svg id="brSvg" viewBox="0 0 680 190" role="img" aria-label="Interactive branch and merge diagram" style="max-width:640px;margin:0 auto"></svg><div class="cap" id="brCap"></div>')
 +term('$ git switch main\n$ git merge feature/login\n<span class="o">Merge made. 2 files changed.</span>\n$ git branch -d feature/login   <span class="cm"># tidy up</span>','GIT BASH / TERMINAL')
 +remember('Go to main first, then merge the branch into it.','heartb'))

p3+=card('t3-4','b','P3_04_PULL-REQUESTS.DOC','4. Pull Requests',
 lead('A pull request says: <mark>"I finished my work. Please check it and add it to main."</mark>')
 +sub('Like handing in homework to a teacher before it counts. Teammates read it, comment, and approve.')
 +'<div class="flowrow"><div class="fstep m-sky"><div class="stk">1</div><b>Push your branch</b><code>git push -u origin feature/login</code></div><div class="arrowx">›</div><div class="fstep m-pink"><div class="stk">2</div><b>Open the PR</b>Click "Compare and pull request".</div><div class="arrowx">›</div><div class="fstep m-sun"><div class="stk">3</div><b>Review</b>Teammates comment and approve.</div><div class="arrowx">›</div><div class="fstep m-mint"><div class="stk">4</div><b>Merge</b>Click "Merge pull request".</div></div>'
 +fig(m_pr(),['Files changed shows exactly what the author changed','Merge pull request, once it is approved'],'A pull request page.')
 +remember('PR = a polite request to review and merge.','sparkle'))

p3+=card('t3-5','c','P3_05_MERGE-CONFLICTS-AND-RESOLUTION.TXT','5. Merge Conflicts and their resolution',
 lead('Two people edit <mark>the same line</mark>. Git asks <mark>you</mark> to choose.')
 +sub('This is normal, not a disaster. Git simply cannot guess whose line is better.')
 +'<div class="pair" style="margin:14px 0"><div><span class="cap2">The file Git shows you</span><pre style="margin:0;text-align:left;width:100%"><span style="color:#ff9ac1">&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</span>\ntitle = "Home"\n<span style="color:#ff9ac1">=======</span>\ntitle = "Welcome"\n<span style="color:#ff9ac1">&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature/login</span></pre><small>Top part = yours. Bottom part = theirs.</small></div><div><span class="cap2">You are the referee</span><div class="btns"><button id="mergeBtn">Merge the two branches</button></div><pre id="resolved" style="margin:0;width:100%;text-align:left">title = ???</pre><small id="resNote">Press the button. A warning pops up and you decide.</small></div></div>'
 +'<p class="sub"><b>How to fix one in real life</b></p>'
 +'<div class="flowrow"><div class="fstep m-pink"><div class="stk">1</div><b>Spot it</b><code>git status</code> lists files that are "both modified".</div><div class="arrowx">›</div><div class="fstep m-sky"><div class="stk">2</div><b>Edit</b>Keep what you want. Delete the three marker lines.</div><div class="arrowx">›</div><div class="fstep m-mint"><div class="stk">3</div><b>Stage</b><code>git add file</code></div><div class="arrowx">›</div><div class="fstep m-sun"><div class="stk">4</div><b>Finish</b><code>git commit</code></div></div>')

p3+=card('t3-6','a','P3_06_FORKING-REPOSITORIES.GIF','6. Forking repositories',
 lead('A fork is <mark>your own copy</mark> of someone else\'s project, on GitHub.')
 +sub('Like photocopying a recipe book to your own shelf. You can improve your copy freely, then suggest your best changes back to the owner with a pull request.')
 +stage(SV['Fork flow: original repo to your fork to your laptop, then a pull request back'])
 +'<p class="sub"><b>Where is the Fork button?</b> Top right of any project page:</p>'
 +fig(m_repo_head(),['Click Fork to make your own copy'],'')
 +remember('Fork = copy on GitHub. Clone = copy on your laptop. Do both, then open a pull request.','flower'))

p3+=card('t3-7','d','P3_07_TEAM-COLLABORATION.EXE','7. Team collaboration using shared repositories',
 lead('For a club or class: <mark>one shared repo</mark>, everyone added as a collaborator.')
 +'<p class="sub"><b>A routine for every task</b></p>'
 +srows(['<code>git pull</code> to get the latest main','<code>git switch -c my-task</code> for your own branch','Work, then <code>git add</code> and <code>git commit</code>','<code>git push -u origin my-task</code>','Open a pull request, get a review, merge','Switch back to main, pull, and repeat'])
 +trio([('heart','sky','Shared repo','Teammates you invite push branches into the same repo. Good for clubs and classes.'),('flower','pink','Fork','Anyone can copy it and send a pull request. Good for open source.')],True)
 +'<div class="note y"><b>Invite a teammate:</b> repo, Settings, Collaborators, Add people. <b>Protect main:</b> turn on branch protection so nobody pushes straight to it.</div>'
 +play('how big should a pull request be?','<p style="margin:0">Slide to change how many files it touches.</p><input type="range" id="prSlider" min="1" max="60" value="4" aria-label="Files changed in the pull request"><p style="margin:0;font-size:15px"><b id="prCount">4</b> files changed</p><div class="pair" style="margin-top:8px"><div><p style="margin:0;font-size:13px;color:var(--ink2)">Review effort</p><div class="meter" style="width:100%"><i id="prEffort"></i></div></div><div><p style="margin:0;font-size:13px;color:var(--ink2)">Chance of a merge conflict</p><div class="meter" style="width:100%"><i id="prConf"></i></div></div></div><div class="note b" id="prMsg" style="margin-top:12px"></div><p style="font-size:12px;color:var(--ink3);margin:6px 0 0">A rough guide for teaching, not a measured result.</p>')
 +remember('One branch per task. Small pull requests get reviewed faster.','heartb'))

# =============== PHASE 4 ===============
p4=''
p4+=card('t4-1','d','P4_01_GITIGNORE.TXT','1. Understanding .gitignore',
 lead('<mark>.gitignore</mark> is the list of things you do <mark>not</mark> pack in the suitcase.')
 +sub('Secret passwords, huge files, junk your tools create. List them in a plain text file named <code>.gitignore</code> and Git pretends they do not exist.')
 +play('ignore some files','<p style="margin:0 0 8px">Click a file to ignore or un-ignore it.</p><div id="ignFiles"></div><pre id="ignText" style="margin:10px auto 0;text-align:left"></pre>')
 +'<table><tr><th>Line</th><th>Meaning</th></tr><tr><td><code>.env</code></td><td>Ignore this exact file</td></tr><tr><td><code>*.log</code></td><td>Ignore every file ending in .log</td></tr><tr><td><code>node_modules/</code></td><td>Ignore this whole folder</td></tr></table>'
 +'<div class="note p">Create it before your first commit. A secret that was already committed stays in the history, even if you delete the file later.</div>')

p4+=card('t4-2','b','P4_02_README.GIF','2. Creating and maintaining a README file',
 lead('The README is <mark>the front cover</mark> of your project.')
 +sub('GitHub shows it on your repo page. It is a file called <code>README.md</code>. The .md means Markdown: headings and lists written with simple symbols.')
 +'<div class="pair"><div><span class="cap2">What you type</span><pre style="margin:0;text-align:left;width:100%"># Recipe Book\nA small collection of recipes.\n\n## How to run\n1. Clone the repo\n2. Open index.html\n\n## Contributing\nOpen a pull request.</pre></div><div><span class="cap2">What people see</span><div class="win" style="width:100%;text-align:left"><div class="bar"><i></i><i></i><i></i><span style="margin-left:8px">README.md</span></div><div class="body"><h4>Recipe Book</h4><p style="margin:0 0 8px;font-size:13.5px">A small collection of recipes.</p><p style="margin:0;font-weight:700;font-size:13.5px">How to run</p><ol style="margin:2px 0 6px;font-size:13px"><li>Clone the repo</li><li>Open index.html</li></ol><p style="margin:0;font-weight:700;font-size:13.5px">Contributing</p><p style="margin:0;font-size:13px">Open a pull request.</p></div></div></div></div>'
 +'<table><tr><th>Type this</th><th>You get</th></tr><tr><td><code># Title</code></td><td>A big heading</td></tr><tr><td><code>## Section</code></td><td>A smaller heading</td></tr><tr><td><code>- item</code></td><td>A bullet point</td></tr><tr><td><code>**bold**</code></td><td><b>bold</b></td></tr></table>'
 +remember('A good README answers three things: what is this, how do I run it, how can I help.','heart'))

p4+=card('t4-3','c','P4_03_BEST-PRACTICES.DOC','3. Repository management best practices',
 lead('Good habits make a project easy for everyone, <mark>including you in six months</mark>.')
 +trio([('heart','pink','Save small and often','One idea per commit, not fifty files at once.'),('star','sky','Write clear messages','Say what changed and why.'),('cloud','mint','Pull before you start','Always get the latest work first.'),('flower','sun','Use branches','Never work straight on main in a team.'),('heartb','lav','Never commit secrets','Passwords and keys go in .gitignore.'),('sparkle','pink','Review each other','Use pull requests so someone checks your work.')])
 +'<table><tr><th>Avoid</th><th>Prefer</th></tr><tr><td class="bad">"fix"</td><td class="good">"Fix login button on mobile"</td></tr><tr><td class="bad">"changes"</td><td class="good">"Add search to recipe page"</td></tr><tr><td class="bad">50 files in one commit</td><td class="good">One idea per commit</td></tr><tr><td class="bad">Committing straight to main</td><td class="good">Branch, then pull request</td></tr></table>')

p4+=card('t4-4','a','P4_04_CLEAN-AND-ORGANISED-REPO.EXE','4. Maintaining a clean and organised repository',
 lead('A tidy repo is <mark>easy to read, easy to share</mark>.')
 +'<div class="pair"><div><span class="cap2" style="color:#a8456f">Messy</span><div class="tree bad" style="width:100%;text-align:left">my-project/<br>├ final_v2_copy.py<br>├ untitled.txt<br>├ Copy of notes (1).docx<br>├ data/ <i>(huge, committed)</i><br>├ .env <i>(passwords!)</i><br>└ stuff/</div></div><div><span class="cap2" style="color:#2a7a4f">Tidy</span><div class="tree good" style="width:100%;text-align:left">my-project/<br>├ README.md<br>├ .gitignore<br>├ src/ <i>(code)</i><br>├ docs/ <i>(notes)</i><br>├ tests/<br>└ requirements.txt</div></div></div>'
 +'<p class="sub" style="margin-top:18px"><b>Delete old branches</b> after they are merged:</p>'
 +term('$ git branch -d feature/login               <span class="cm"># on your laptop</span>\n$ git push origin --delete feature/login   <span class="cm"># on GitHub</span>','GIT BASH / TERMINAL')
 +play('quick self-check: is your repo tidy?','<p id="healthMsg" style="margin:6px 0;font-size:14.5px"></p><div id="healthList" style="text-align:left"></div>'))

p4+=card('t4-5','b','P4_05_GIT-LINKS.EXE','5. Git Links',
 lead('Some websites work on <mark>any</mark> GitHub project just by changing the web address.')
 +play('swap the URL','<input type="text" id="repoIn" value="https://github.com/facebook/react" aria-label="GitHub repository link" spellcheck="false"><div class="btns"><button data-ex="facebook/react">react</button><button data-ex="vercel/next.js">next.js</button><button data-ex="torvalds/linux">linux</button><button data-ex="git/git">git itself</button></div><div id="swapOut" style="text-align:left"></div>')
 +trio([('heart','pink','GitReverse','Turns a repo or website into a prompt you could use to build something similar. gitreverse.com'),('cloud','sky','GitIngest','Squashes a whole repo into one text file, handy for pasting into an AI chat. gitingest.com'),('star','mint','GitDiagram','Draws a diagram of how a project fits together. gitdiagram.com'),('sparkle','sun','DeepWiki','Auto-written docs for a repo, with a chat box. deepwiki.com/owner/repo'),('flower','lav','github.dev','A code editor in your browser. Press the . key on any repo.'),('pad','pink','github1s.com','Read a project\'s code in a browser editor. Swap github.com for github1s.com.'),('folder','sky','github.io','Free websites from a repo (GitHub Pages). username.github.io'),('heartb','mint','git-scm.com/docs','The official Git reference. Every command explained.')])
 +'<div class="note p">These are other people\'s websites, not GitHub\'s. Only paste links to public projects you are happy to share.</div>')

p4+=card('t4-5b','c','P4_05B_MORE-GIT-LINKS.TXT','More Git links to keep',
 '<div class="pair" style="margin-top:14px"><div style="width:100%;text-align:left"><span class="cap2" style="text-align:center">Learn and practise</span><ul class="links" style="list-style:none;padding:0;margin:0"><li><a href="https://git-scm.com/docs">git-scm.com/docs</a><small>Official reference for every command.</small></li><li><a href="https://git-scm.com/book">git-scm.com/book</a><small>Pro Git, the free official book.</small></li><li><a href="https://docs.github.com">docs.github.com</a><small>GitHub\'s own guides.</small></li><li><a href="https://learngitbranching.js.org">learngitbranching.js.org</a><small>Practise branching with drawings.</small></li><li><a href="https://ohmygit.org">ohmygit.org</a><small>Oh My Git!, a game that teaches Git.</small></li><li><a href="https://skills.github.com">skills.github.com</a><small>Short hands-on GitHub courses.</small></li></ul></div>'
 '<div style="width:100%;text-align:left"><span class="cap2" style="display:block;text-align:center">Useful tools for any GitHub project</span><ul class="links" style="list-style:none;padding:0;margin:0"><li><a href="https://www.gitreverse.com">gitreverse.com</a><small>Reverse a repo into a prompt.</small></li><li><a href="https://gitingest.com">gitingest.com</a><small>A repo as one text digest.</small></li><li><a href="https://gitdiagram.com">gitdiagram.com</a><small>A diagram of a repo.</small></li><li><a href="https://github.dev">github.dev</a><small>Browser editor for a repo.</small></li><li><a href="https://github1s.com">github1s.com</a><small>Read code in a browser editor.</small></li><li><a href="https://pages.github.com">github.io</a><small>Free websites from a repo (GitHub Pages).</small></li><li><a href="https://www.toptal.com/developers/gitignore">gitignore.io</a><small>Ready-made .gitignore files.</small></li><li><a href="https://gitmoji.dev">gitmoji.dev</a><small>Emoji for commit messages.</small></li></ul></div></div>'
 +'<p class="sub" style="margin-top:18px"><b>Two kinds of project address</b></p>'
 +trio([('cloud','sky','HTTPS','https://github.com/user/repo.git<br>Works everywhere. Signs you in through the browser.'),('star','mint','SSH','git@github.com:user/repo.git<br>Needs a key set up once, then no sign-in prompts.')],True)
 +wd('WARNING','DO YOU WANT<br>TO FORCE PUSH ?','Yes','No',('err','OH NO','Force push overwrites other people\'s work on GitHub. Teams avoid it. Use a normal push, or pull first.'),('warn','GOOD CHOICE','Right. Pull first, then push normally.'))
 +term('$ git remote -v                        <span class="cm"># see the address</span>\n$ git remote set-url origin NEW-ADDRESS   <span class="cm"># change it</span>','GIT BASH / TERMINAL'))

p4+=card('t4-6','d','WRAP-UP_OUTCOMES.EXE','Wrap-up: can you do all seven?',
 lead('Tick each one when you <mark>feel ready</mark>.')
 +'<div class="meter" style="width:100%"><i id="outBar"></i></div><p id="outMsg" style="margin:6px 0;font-size:14.5px;text-align:center"></p><div class="pair" id="outList" style="text-align:left"></div>'
 +play('four quick questions','<p id="qQ" style="margin:0;font-weight:700"></p><div id="qOpts"></div><p id="qFb" style="font-size:14.5px;min-height:42px;margin:6px 0"></p><div class="btns"><button id="qNext" disabled>Next question</button><span id="qScore" style="font-size:14px;color:var(--ink2)"></span></div>')
 +'<p class="sub"><b>Cheat sheet</b></p><pre>git init                    start a repo           git switch -c name    new branch\ngit status                  what changed?          git switch name       change branch\ngit add .                   pick everything        git merge name        merge into current\ngit commit -m "message"     save a snapshot        git clone url         copy a repo\ngit log --oneline           short history          git push / git pull   sync with GitHub</pre>')

p5=''
p5+=card('t2-3b','c','P5_PRACTICE-TERMINAL.EXE','Practice lab: type real Git commands',
 lead('This is your <mark>Mini laptop</mark>. Type the commands and watch your project change on the right.')
 +'<div class="pg" id="pg"><div class="pgl">'
 +'<div class="story" id="story"><div class="stabs" id="stTabs"></div><div class="sth"><span id="stH">GUIDED STORY: PASTA, BRANCH, CONFLICT</span><b id="stC">0 / 0</b></div><div class="stsay" id="stSay">Press <b>Start the story</b>. You will watch every command get typed, and a line under it will explain what it does. You can go one step at a time, or press Auto-play.</div><div class="sdots" id="sDots"></div><div class="btns"><button id="stNext" class="greenbtn">Start the story</button><button id="stAuto">Auto-play</button><button id="stRestart">Restart story</button></div></div>'
 +'<div class="pgterm" id="pgTerm"><div class="bar"><i></i><span>GIT BASH / TERMINAL</span></div><div class="pgout" id="pgOut"></div><div class="pgline"><div id="pgPs"></div><div class="pgin"><span>$&nbsp;</span><input id="pgIn" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Type a Git command here"></div></div></div>'
 +'</div><div class="pgr">'
 +'<div class="pgrow"><div class="pz"><div class="pzh">1. Working folder</div><div class="pzb" id="z1"></div></div><div class="pz"><div class="pzh">2. Staging area</div><div class="pzb" id="z2"></div></div></div>'
 +'<div class="pz"><div class="pzh">3. Local repo (your saved history)</div><div class="pzb gr" id="z3"></div></div>'
 +'<div class="pz gh" id="z4w"><div class="pzh">4. GitHub (the online copy)</div><div class="pzb" id="z4"></div></div>'
 +'<div class="pz livegh" id="realBox" hidden><div class="pzh">4. REAL GitHub, live</div><div class="pzb rl" id="realB"></div></div>'
 +'<div class="pglg"><span class="fchip untracked"><b>?</b>new file</span><span class="fchip mod"><b>M</b>changed</span><span class="fchip new"><b>A</b>staged</span><span class="fchip clean"><b>&#10003;</b>saved</span><span class="fchip conf"><b>!</b>conflict</span></div>'
 +'<div class="pgm"><div class="pgmh"><span>FREE PRACTICE MISSIONS</span><b id="pgCount">0 / 12 missions</b></div><div id="pgMission"></div><details class="pgall"><summary>See all missions</summary><ol id="pgList"></ol></details></div>'
 +'</div></div>'
 +'<div class="btns pgb"><button id="pgReadme">Add a README</button><button id="pgReal" class="greenbtn">Real GitHub mode</button><button id="pgMate">A teammate pushes</button><button id="pgReset" class="redbtn">Clear all &amp; start over</button></div><i id="pgBar" hidden></i>'
 +'<p class="note">Tip: a small VS Code window floats at the bottom right and stays with you as you scroll. Press _ to tuck it away. Drag its title bar to move it, or its bottom-right corner to resize it. It shows what is written inside your files. Click a file name in the boxes to open it there. Press the up arrow to repeat a command. Errors show up as pop-ups, just like real life.</p>')


phases=''
phases+=phase('p1','1','p1','Introduction to Git and GitHub','Start from zero. We explain every word.',
  [('t1-1','1. What is Git?'),('t1-2','2. Why do we need Git?'),('t1-3','3. What is GitHub?'),('t1-4','4. Centralized vs Distributed'),('t1-5','5. Setup and installation')],p1)
phases+=phase('p2','2','p2','Repository management','Making a project, saving it, and putting it online',
  [('t2-1','1. Repositories'),('t2-2','2. Creating and managing repos'),('t2-3','3. Basic Git commands'),('t2-4','4. Push, Pull and Clone'),('t2-5','5. Remote repositories')],p2)
phases+=phase('p3','3','p3','Branching and collaboration','Working with other people without stepping on toes',
  [('t3-1','1. Branches'),('t3-2','2. Creating and switching'),('t3-3','3. Branching and merging'),('t3-4','4. Pull Requests'),('t3-5','5. Merge Conflicts'),('t3-6','6. Forking'),('t3-7','7. Team collaboration')],p3)
phases+=phase('p4','4','p4','Repository maintenance','Keeping a project tidy for future you',
  [('t4-1','1. .gitignore'),('t4-2','2. README'),('t4-3','3. Best practices'),('t4-4','4. Clean and organised'),('t4-5','5. Git Links'),('t4-6','Wrap-up')],p4)
phases+=phase('p5','5','p4','Practice lab','Type real commands and watch what happens',[('t2-3b','Practice terminal')],p5)
