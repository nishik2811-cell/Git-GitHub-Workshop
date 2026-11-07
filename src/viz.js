/* Visual walkthroughs for Aryan's seven lessons.
   The presenter types the real commands in their own VS Code; this only shows what each
   command changes, one step at a time: the commit graph (HEAD and every branch), the files,
   the three zones, the file's contents, or the GitHub page.
   Keys while one is focused: Right / Space / PageDown = next, Left / PageUp = back,
   Home = first, F = big view. A presentation clicker sends PageUp / PageDown.

   Edit the steps in MODS below, then run  python3 src/sync.py  from the repo root.

   Step fields:
     c    the command(s) for this step (a string or a list), shown above the picture
     a    what you do, for steps without a command (edit a file, click a button)
     cap  one line saying what changed       d   lines of a diff to show (+ added, - removed)
     v    changes to the picture:
          tree  files, two spaces per level. "name:ST" where ST is
                U untracked, A staged (new), S staged (modified), M modified, X conflict, I ignored, G .git
                add * for danger (red) and ^ to highlight the row
          edit  the file's contents {f:file, l:[lines], hl:[new line numbers]} or null
          g     graph changes: add [[id,msg,lane,[extra parents]]], b {branch:id|null|"HEAD"},
                L {branch:lane}, head "branch", ren [old,new], ghost [ids], init "branch"
          gh    a GitHub page (see ghPage)          show  panels: tree, zones, graph, sees  */
(function(){
  var hosts=document.querySelectorAll('.tp[data-tp]');if(!hosts.length)return;

  var MODS={
  m1:{title:"Single user setup & core flow",
    init:{"show":["tree","zones","graph"],"tree":[]},
    steps:[
    {"c":"mkdir my-first-repo && cd my-first-repo","cap":"An ordinary folder. Git knows nothing about it yet.","v":{"tree":["my-first-repo/^"]}},
    {"c":"git init","cap":"git init adds a hidden .git folder: that is where Git keeps every snapshot.","v":{"tree":["my-first-repo/","  .git/:G^"],"g":{"init":"main"}}},
    {"c":"git status","cap":"Nothing to commit: there are no files yet."},
    {"a":"Create index.html, type a heading, save with Ctrl + S","cap":"A new file. U = untracked: Git can see it but is not saving it.","v":{"tree":["my-first-repo/","  .git/:G","  index.html:U^"],"edit":{"f":"index.html","l":["<h1>My first repo</h1>"],"hl":[0]}}},
    {"c":"git status","cap":"git status lists index.html under \"Untracked files\".","v":{"tree":["my-first-repo/","  .git/:G","  index.html:U"]}},
    {"c":"git add .","cap":"git add moves index.html into the staging area, ready for the next snapshot.","v":{"tree":["my-first-repo/","  .git/:G","  index.html:A^"]}},
    {"c":"git status","cap":"Now it is listed under \"Changes to be committed\".","v":{"tree":["my-first-repo/","  .git/:G","  index.html:A"]}},
    {"c":"git commit -m \"initial commit\"","cap":"Snapshot saved as commit 3f8a1c2. You can always come back to this point.","k":1,"v":{"tree":["my-first-repo/","  .git/:G","  index.html"],"g":{"add":[["3f8a1c2","initial commit"]]}}},
    {"a":"Edit index.html: add a paragraph, save","cap":"M = modified: the file changed since the last snapshot.","v":{"tree":["my-first-repo/","  .git/:G","  index.html:M^"],"edit":{"f":"index.html","l":["<h1>My first repo</h1>","<p>Hello from the Git workshop</p>"],"hl":[1]}}},
    {"c":"git status","cap":"Modified, but not staged yet: still only in the working folder.","v":{"tree":["my-first-repo/","  .git/:G","  index.html:M"]}},
    {"c":["git add .","git commit -m \"add paragraph\""],"cap":"Second snapshot. The history grows upwards, newest on top.","v":{"tree":["my-first-repo/","  .git/:G","  index.html"],"edit":{"f":"index.html","l":["<h1>My first repo</h1>","<p>Hello from the Git workshop</p>"]},"g":{"add":[["9bd04e7","add paragraph"]]}}},
    {"c":"git log --oneline","cap":"git log --oneline lists the same commits as the graph, newest first."}]},
  m2:{title:".gitignore",
    init:{"show":["tree","sees","graph"],"tree":["my-first-repo/","  .git/:G","  index.html"],"g":{"init":"main","add":[["3f8a1c2","initial commit"],["9bd04e7","add paragraph"]]}},
    steps:[
    {"c":["echo \"API_KEY=sk-live-12345\" > .env","mkdir node_modules && touch node_modules/react.js","touch debug.log .DS_Store"],"cap":"Four files that should never be shared: a secret, dependencies, a log and OS junk.","v":{"tree":["my-first-repo/","  .git/:G","  node_modules/:U^","    react.js:U","  .DS_Store:U^","  .env:U*^","  debug.log:U^","  index.html"]}},
    {"c":"git status","cap":"git status wants to track all of them, even the secret .env.","v":{"tree":["my-first-repo/","  .git/:G","  node_modules/:U","    react.js:U","  .DS_Store:U","  .env:U*^","  debug.log:U","  index.html"]}},
    {"a":"Create .gitignore, write one rule per line, save","cap":".gitignore lists them, and they turn grey: Git now ignores them.","v":{"tree":["my-first-repo/","  .git/:G","  node_modules/:I","    react.js:I","  .DS_Store:I","  .env:I","  .gitignore:U^","  debug.log:I","  index.html"],"edit":{"f":".gitignore","l":["# secrets",".env","","# dependencies","node_modules/","","# logs and OS junk","*.log",".DS_Store"],"hl":[1,4,7,8]}}},
    {"c":"git status","cap":"Only .gitignore is left for Git to see. The ignored files are still on your disk.","v":{"tree":["my-first-repo/","  .git/:G","  node_modules/:I","    react.js:I","  .DS_Store:I","  .env:I","  .gitignore:U","  debug.log:I","  index.html"]}},
    {"c":["git add .","git commit -m \"add gitignore\""],"cap":".gitignore itself is committed, so the whole team shares the same rules.","v":{"tree":["my-first-repo/","  .git/:G","  node_modules/:I","    react.js:I","  .DS_Store:I","  .env:I","  .gitignore","  debug.log:I","  index.html"],"edit":{"f":".gitignore","l":["# secrets",".env","","# dependencies","node_modules/","","# logs and OS junk","*.log",".DS_Store"]},"g":{"add":[["c71e5a0","add gitignore"]]}}}]},
  m3:{title:".gitkeep",
    init:{"show":["tree","sees","graph"],"tree":["my-first-repo/","  .git/:G","  .gitignore","  index.html"],"g":{"init":"main","add":[["3f8a1c2","initial commit"],["9bd04e7","add paragraph"],["c71e5a0","add gitignore"]]}},


      
    {"c":"touch uploads/.gitkeep","cap":"A tiny empty .gitkeep file goes inside.","v":{"tree":["my-first-repo/","  .git/:G","  uploads/:U","    .gitkeep:U^","  .gitignore","  index.html"]}},
    {"c":"git status","cap":"Now the folder has a file, so Git sees uploads/.","v":{"tree":["my-first-repo/","  .git/:G","  uploads/:U","    .gitkeep:U","  .gitignore","  index.html"]}},
   
  m4:{title:"Branching",
    init:{"show":["graph","tree"],"tree":["git-club/","  .git/:G","  index.html"],"edit":{"f":"index.html","l":["<h1>Git Club</h1>","<p>Welcome!</p>"]},"g":{"init":"master","add":[["a1b2c3d","initial commit"],["b2c4e61","add homepage"]]}},
    steps:[
    {"c":"git branch","cap":"One branch, master. HEAD (the ring) marks where you are."},
    {"c":"git branch -M main","cap":"Same commits, new name: master becomes main.","v":{"g":{"ren":["master","main"]}}},
    {"c":"git branch feature","cap":"A new label, feature, on the same commit. HEAD stays on main.","v":{"g":{"b":{"feature":"HEAD"},"L":{"feature":1}}}},
    {"c":"git switch feature","cap":"HEAD moves to feature. No files are copied: a branch is just a label.","v":{"g":{"head":"feature"}}},
    {"c":["git add .","git commit -m \"add navbar\""],"cap":"The new commit goes on feature. main does not move.","v":{"edit":{"f":"index.html","l":["<nav>Home | Events | Join</nav>","<h1>Git Club</h1>","<p>Welcome!</p>"],"hl":[0]},"g":{"add":[["d4f9a10","add navbar"]]}}},
    {"c":"git switch main","cap":"HEAD back on main: the file goes back to main's version, no navbar.","v":{"g":{"head":"main"},"edit":{"f":"index.html","l":["<h1>Git Club</h1>","<p>Welcome!</p>"]}}},
    {"c":"git checkout -b hotfix","cap":"checkout -b creates hotfix and moves HEAD onto it in one go.","v":{"g":{"b":{"hotfix":"HEAD"},"L":{"hotfix":2},"head":"hotfix"}}},
    {"c":"git branch","cap":"Three labels. The * in git branch is where HEAD is."},
    {"c":"git checkout main","cap":"git checkout main: the older way to switch.","v":{"g":{"head":"main"}}},
    {"c":"git merge feature","cap":"Fast-forward: main's label just slides up to feature's commit. The navbar is in main now.","v":{"g":{"b":{"main":"d4f9a10"}},"edit":{"f":"index.html","l":["<nav>Home | Events | Join</nav>","<h1>Git Club</h1>","<p>Welcome!</p>"],"hl":[0]}}},
    {"c":["git branch -d feature","git branch -d hotfix"],"cap":"The labels are deleted. The commits stay.","v":{"g":{"b":{"feature":null,"hotfix":null}},"edit":{"f":"index.html","l":["<nav>Home | Events | Join</nav>","<h1>Git Club</h1>","<p>Welcome!</p>"]}}},
    {"c":"git branch","cap":"Only main is left, with all the work."}]},
  m5:{title:"Merging & conflicts",
    init:{"show":["graph","tree"],"tree":["git-club/","  .git/:G","  index.html"],"edit":{"f":"index.html","l":["<h1>Hello</h1>","<p>Learning Git</p>"]},"g":{"init":"main","add":[["a1b2c3d","initial commit"],["b2c4e61","add homepage"]]}},
    steps:[
    {"c":"git switch -c redesign","cap":"switch -c creates redesign and moves HEAD onto it in one go.","v":{"g":{"b":{"redesign":"HEAD"},"L":{"redesign":1},"head":"redesign"}}},
    {"c":"git commit -am \"new heading on redesign\"","cap":"redesign gets its own commit changing the heading.","v":{"edit":{"f":"index.html","l":["<h1>Welcome to Git Club</h1>","<p>Learning Git</p>"],"hl":[0]},"g":{"add":[["e5f6a7b","new heading on redesign"]]}}},
    {"c":["git switch main","git commit -am \"new heading on main\""],"cap":"main changes the same line differently. The history splits in two.","v":{"edit":{"f":"index.html","l":["<h1>Hello Workshop</h1>","<p>Learning Git</p>"],"hl":[0]},"g":{"head":"main","add":[["f1e2d3c","new heading on main"]]}}},
    {"c":"git diff redesign","cap":"git diff redesign: the - line is in redesign, the + line is what you have on main.","d":["-<h1>Welcome to Git Club</h1>","+<h1>Hello Workshop</h1>"," <p>Learning Git</p>"],"v":{"edit":{"f":"index.html","l":["<h1>Hello Workshop</h1>","<p>Learning Git</p>"]}}},
    {"c":"git merge redesign","cap":"Both branches changed the same line: CONFLICT. Git writes both versions into the file.","v":{"pb":"main|MERGING","tree":["git-club/","  .git/:G","  index.html:X^"],"edit":{"f":"index.html","l":["<<<<<<< HEAD","<h1>Hello Workshop</h1>","=======","<h1>Welcome to Git Club</h1>",">>>>>>> redesign","<p>Learning Git</p>"],"acts":1}}},
    {"c":"git status","cap":"git status: index.html is \"both modified\".","v":{"tree":["git-club/","  .git/:G","  index.html:X"]}},
    {"a":"Point at the three markers in the editor","cap":"Between <<<<<<< HEAD and ======= is yours. Between ======= and >>>>>>> redesign is theirs."},
    {"a":"Resolve: keep what you want, delete every marker line, save","cap":"Fixed by hand: all three markers deleted, one final line kept.","v":{"edit":{"f":"index.html","l":["<h1>Hello Workshop, welcome to Git Club</h1>","<p>Learning Git</p>"],"hl":[0]}}},
    {"c":"git add index.html","cap":"git add marks the conflict as resolved.","v":{"tree":["git-club/","  .git/:G","  index.html:S^"],"edit":{"f":"index.html","l":["<h1>Hello Workshop, welcome to Git Club</h1>","<p>Learning Git</p>"]}}},
    {"c":"git commit -m \"merge redesign\"","cap":"The merge commit has two parents: both histories join.","v":{"pb":null,"tree":["git-club/","  .git/:G","  index.html"],"g":{"add":[["6a7b8c9","merge redesign",0,["e5f6a7b"]]]}}}]},
  m6:{title:"Undoing with reset",
    init:{"show":["zones","tree","graph"],"tree":["git-club/","  .git/:G","  index.html","  style.css"],"g":{"init":"main","add":[["1a2b3c4","initial commit"],["4d5e6f7","add navbar"],["8a9b0c1","add footer"],["2d3e4f5","add contact link"],["6f7a8b9","try new colors"]]}},
    steps:[
    {"c":["git add .","git status"],"cap":"Both files changed and staged.","v":{"tree":["git-club/","  .git/:G","  index.html:S","  style.css:S"]}},
    {"c":"git reset style.css","cap":"style.css is taken out of the staging area. Its change is still in the folder.","v":{"tree":["git-club/","  .git/:G","  index.html:S","  style.css:M^"]}},
    {"c":"git reset","cap":"The staging area is emptied. Both changes are still in the folder.","v":{"tree":["git-club/","  .git/:G","  index.html:M^","  style.css:M"]}},
    {"c":["git add .","git commit -m \"update styles\""],"cap":"Both changes committed as 0c1d2e3.","v":{"tree":["git-club/","  .git/:G","  index.html","  style.css"],"g":{"add":[["0c1d2e3","update styles"]]}}},
    {"c":"git reset HEAD~1","cap":"HEAD~1: that commit is undone and its changes come back to the working folder.","v":{"tree":["git-club/","  .git/:G","  index.html:M^","  style.css:M^"],"g":{"b":{"main":"6f7a8b9"},"ghost":["0c1d2e3"]}}},
    {"c":"git log --oneline","cap":"Pick the hash to go back to: 8a9b0c1 (add footer).","v":{"tree":["git-club/","  .git/:G","  index.html:M","  style.css:M"]}},
    {"c":"git reset 8a9b0c1","cap":"main jumps back two commits. Their work stays in the folder, unstaged.","v":{"g":{"b":{"main":"8a9b0c1"},"ghost":["2d3e4f5","6f7a8b9"]}}},
    {"c":"git reset --hard 4d5e6f7","cap":"--hard: main goes back to 4d5e6f7 AND the changes in your files are deleted.","v":{"tree":["git-club/","  .git/:G","  index.html","  style.css"],"g":{"b":{"main":"4d5e6f7"},"ghost":["8a9b0c1"]}}},
    {"c":"git log --oneline","cap":"Only two commits are left in the history."}]},
  m7:{title:"Issues, assignees & pull requests",
    init:{"gh":{"page":"issues","hot":""},"tree":[],"g":{"init":"main","add":[["9f8e7d6","add footer links"]]}},
    steps:[
    {"a":"Open the Issues tab, click New issue","cap":"Issues is the project's to-do list. Click New issue.","v":{"gh":{"page":"issues","hot":"new"}}},
    {"a":"Write a clear title and description, click Create","cap":"Write a clear title and description, then Create. It becomes #12.","v":{"gh":{"page":"newissue","hot":"submit"}}},
    {"a":"In the sidebar, set Assignees to a teammate and add a label","cap":"Assign a teammate and add a label, so everyone knows who owns it.","v":{"gh":{"page":"issue","hot":"assign"}}},
    {"c":["git switch -c dark-mode","git commit -am \"add dark mode toggle\"","git push -u origin dark-mode"],"cap":"The teammate pushes the dark-mode branch. GitHub offers \"Compare & pull request\".","v":{"gh":{"page":"repo","hot":"compare"}}},
    {"a":"Click Compare & pull request, write \"Closes #12\", add a reviewer, Create pull request","cap":"The pull request: main <- dark-mode, and \"Closes #12\" in the description.","v":{"gh":{"page":"newpr","hot":"create"}}},
    {"a":"Reviewer: open Files changed, read the diff, Review changes → Approve","cap":"The reviewer reads the diff, then Review changes > Approve.","v":{"gh":{"page":"pr","tab":"files","hot":"review"}}},
    {"a":"On Conversation, click Merge pull request → Confirm merge","cap":"Approved and no conflicts: Merge pull request.","v":{"gh":{"page":"pr","tab":"conv","approved":1,"hot":"merge"}}},
    {"a":"Merged! Click Delete branch: issue #12 closes itself","cap":"Merged. Delete the branch.","v":{"gh":{"page":"pr","tab":"conv","approved":1,"merged":1,"hot":"delete"}}},
    {"c":["git switch main","git pull"],"cap":"Issue #12 closed by itself. Everyone runs git pull to get the new main.","v":{"gh":{"page":"issue","closed":1,"hot":""}}}]}
  };

  /* ---------------- helpers ---------------- */
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function arr(x){return x==null?[]:(Array.isArray(x)?x:[x])}
  function clone(o){return JSON.parse(JSON.stringify(o))}
  var LANE=['#1d4ba6','#d0722e','#a8456f','#2a7a4f'];

  /* ---------------- graph model ---------------- */
  function gApply(G,op){
    if(op.init){G={c:[],b:{},L:{},head:op.init};G.L[op.init]=0}
    if(!G)return G;G=clone(G);
    if(op.ren){var o=op.ren[0],n=op.ren[1];if(o in G.b){G.b[n]=G.b[o];delete G.b[o]}G.L[n]=G.L[o]||0;delete G.L[o];if(G.head===o)G.head=n}
    if(op.L)for(var l in op.L)G.L[l]=op.L[l];
    if(op.b)for(var k in op.b){var v=op.b[k];if(v===null)delete G.b[k];else G.b[k]=v==='HEAD'?G.b[G.head]:v}
    if(op.head)G.head=op.head;
    arr(op.add).forEach(function(t){var tip=G.b[G.head];var ps=tip?[tip]:[];arr(t[3]).forEach(function(x){ps.push(x)});
      var lane=t[2]!=null?t[2]:(G.L[G.head]||0);G.c.push({id:t[0],m:t[1],l:lane,p:ps});G.b[G.head]=t[0]});
    arr(op.ghost).forEach(function(id){G.c.forEach(function(c){if(c.id===id)c.x=1})});
    return G}

  function gSvg(G){
    if(!G)return '<p class="tp-sees"><span class="none">Not a Git repository yet.</span></p>';
    var n=G.c.length;
    if(!n)return '<p class="tp-sees"><span class="none">HEAD &rarr; '+esc(G.head)+'. No commits yet.</span></p>';
    var RH=34,T=20,CW=26,X0=16,idx={},maxL=0;
    G.c.forEach(function(c,i){idx[c.id]=i;if(c.l>maxL)maxL=c.l});
    function X(c){return X0+c.l*CW}function Y(i){return T+(n-1-i)*RH}
    var tx=X0+maxL*CW+20,labels={};
    Object.keys(G.b).forEach(function(b){(labels[G.b[b]]=labels[G.b[b]]||[]).push(b)});
    var s='',w=0;
    G.c.forEach(function(c,i){c.p.forEach(function(pid){var j=idx[pid];if(j==null)return;var p=G.c[j];
      var x1=X(c),y1=Y(i),x2=X(p),y2=Y(j),col=LANE[Math.max(c.l,p.l)%LANE.length],ds=(c.x||p.x)?' stroke-dasharray="4 4" opacity=".45"':'';
      s+=x1===x2?'<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+col+'" stroke-width="3.5"'+ds+'/>'
       
    var headTip=G.b[G.head];
    G.c.forEach(function(c,i){var x=X(c),y=Y(i),col=LANE[c.l%LANE.length],t=tx;
      if(c.x)s+='<circle cx="'+x+'" cy="'+y+'" r="8" fill="#fff" stroke="'+col+'" stroke-width="2" stroke-dasharray="3 2" opacity=".55"/>';
      else{if(c.id===headTip)s+='<circle cx="'+x+'" cy="'+y+'" r="12.5" fill="none" stroke="#ffd36e" stroke-width="4.5"/>';
        s+='<circle cx="'+x+'" cy="'+y+'" r="8" fill="'+col+'" stroke="#16327a" stroke-width="2"/>'}
      s+='<text x="'+t+'" y="'+(y+4.5)+'" font-family="Fira Code,monospace" font-size="12.5" fill="'+(c.x?'#93a5d6':'#b8860b')+'" style="font-variant-ligatures:none">'+esc(c.id)+'</text>';t+=66;
      (labels[c.id]||[]).sort(function(a,b){return (b===G.head)-(a===G.head)}).forEach(function(b){var h=b===G.head,txt=(h?'HEAD → ':'')+b,pw=txt.length*7+14;
        s+='<rect x="'+t+'" y="'+(y-10)+'" width="'+pw+'" height="20" rx="10" fill="'+(h?'#ffd36e':'#e6ecff')+'" stroke="'+LANE[(G.L[b]||0)%LANE.length]+'" stroke-width="2"/>'
          +'<text x="'+(t+pw/2)+'" y="'+(y+4.5)+'" text-anchor="middle" font-family="Fira Code,monospace" font-size="11.5" font-weight="700" fill="#16327a" style="font-variant-ligatures:none">'+esc(txt)+'</text>';t+=pw+6});
      var msg=c.x?c.m+'  (undone)':c.m;
      s+='<text x="'+t+'" y="'+(y+4.5)+'" font-family="Nunito,sans-serif" font-size="13.5" font-weight="700" fill="'+(c.x?'#93a5d6':'#16327a')+'"'+(c.x?' text-decoration="line-through"':'')+'>'+esc(msg)+'</text>';
      w=Math.max(w,t+msg.length*7.4+8)});
    var H=T+(n-1)*RH+18;
    return '<svg viewBox="0 0 '+Math.max(280,Math.ceil(w))+' '+H+'" style="max-width:'+Math.max(280,Math.ceil(w))*1.15+'px" role="img" aria-label="Commit graph, newest commit on top">'+s+'</svg>'}

  /* ---------------- files ---------------- */
  function parseTree(list){return arr(list).map(function(raw){var d=(raw.match(/^ */)[0].length)/2,t=raw.trim(),f='';
    while(/[*^]$/.test(t)){f+=t.slice(-1);t=t.slice(0,-1)}
    var m=t.match(/^(.*?)(?::([UASMXIG]))?$/);return {d:d,n:m[1],st:m[2]||'',dir:/\/$/.test(m[1]),danger:f.indexOf('*')>=0,hot:f.indexOf('^')>=0}})}
  var STL={U:'U',A:'A',S:'M',M:'M',X:'!',I:'',G:''},STT={U:'untracked',A:'staged (new)',S:'staged',M:'modified',X:'conflict',I:'ignored',G:'Git\'s memory'};
  function treeHtml(list){var t=parseTree(list);if(!t.length)return '<div class="tp-tree"><div class="empty">no folder yet</div></div>';
    var h='<div class="tp-tree">',seen={};
    t.forEach(function(e,i){var ic=e.dir?(e.n==='.git/'?'⚙':'📁'):'📄';
      h+='<div class="'+e.st+(e.hot?' hot':'')+(e.danger?' danger':'')+'" style="padding-left:'+(4+e.d*16)+'px" title="'+esc(STT[e.st]||'committed, clean')+'"><i>'+ic+'</i><b>'+esc(e.n)+(e.danger?'  ⚠ secret':'')+(e.st==='G'?'  (hidden)':'')+(e.st==='I'?'  (ignored)':'')+'</b><u>'+(STL[e.st]||'')+'</u></div>';
      if(e.st)seen[e.st]=1;
      if(e.dir&&e.n!=='.git/'&&!(t[i+1]&&t[i+1].d>e.d))h+='<div class="empty" style="padding-left:'+(24+e.d*16)+'px">(empty)</div>'});
    var leg=['U','A','S','M','X'].filter(function(k){return seen[k]}).map(function(k){return '<b>'+STL[k]+'</b> '+STT[k]});
    return h+'</div>'+(leg.length?'<p class="tp-leg">'+leg.join(' &middot; ')+'</p>':'')}
  function base(e){return e.n.replace(/\/$/,'')}
  function fullPaths(t){var stack=[],out=[];t.forEach(function(e){stack[e.d]=base(e);stack.length=e.d+1;out.push({e:e,p:stack.slice(1).join('/')})});return out}
  function zonesHtml(S){var t=parseTree(S.tree),W=[],St=[];
    fullPaths(t).forEach(function(x){var e=x.e;if(e.dir||!x.p)return;
      if(e.st==='U'||e.st==='M'||e.st==='X')W.push('<span class="tp-chip '+e.st+'">'+esc(x.p)+'</span>');
      if(e.st==='A'||e.st==='S')St.push('<span class="tp-chip">'+esc(x.p)+'</span>')});
    var G=S.g,live=G?G.c.filter(function(c){return !c.x}):[],R=live.slice(-2).reverse().map(function(c){return '<span class="tp-chip hash">'+esc(c.id)+'</span>'});
    return '<div class="tp-zones"><div class="tp-zn"><b>Working folder</b><small>your edits</small>'+(W.join('')||'<small>clean</small>')+'</div>'
      +'<div class="tp-zn"><b>Staging area</b><small>git add puts it here</small>'+(St.join('')||'<small>empty</small>')+'</div>'
      +'<div class="tp-zn"><b>Repository</b><small>'+(G?live.length+' commit'+(live.length===1?'':'s'):'no .git yet')+'</small>'+R.join('')+'</div></div>'}
  function seesHtml(S){var t=parseTree(S.tree),fp=fullPaths(t),h='',skip=null;
    fp.forEach(function(x,i){var e=x.e;if(!x.p)return;if(skip&&x.p.indexOf(skip)===0)return;skip=null;if(e.st==='I'||e.st==='G')return;
      /* a new folder Git has never seen is listed as one line, like git status does */
      if(e.dir&&e.st==='U'){skip=x.p+'/';h+='<span>'+esc(x.p)+'/ <em class="U">(untracked folder)</em></span>';return}
      if(e.dir){var kids=t[i+1]&&t[i+1].d>e.d;if(!kids)h+='<span class="none">'+esc(x.p)+'/ is empty, so Git cannot see it</span>';return}
      h+='<span>'+esc(x.p)+(e.st?' <em class="'+e.st+'">('+STT[e.st]+')</em>':'')+'</span>'});
    return '<div class="tp-sees">'+(h||'<span class="none">nothing</span>')+'</div>'}

  /* ---------------- a file's contents ---------------- */
  function fileHtml(E){var hl={},inO=0,inT=0;arr(E.hl).forEach(function(i){hl[i]=1});
    var h='<div class="tp-lines">';
    E.l.forEach(function(l,i){var c='';
      if(/^<{7}/.test(l)){c='mk';inO=1}else if(/^={7}$/.test(l)){c='mk';inO=0;inT=1}else if(/^>{7}/.test(l)){c='mk';inT=0}
      else if(inO)c='ours';else if(inT)c='theirs';else if(/^#/.test(l))c='cmt';
      if(hl[i])c+=' new';h+='<div data-n="'+(i+1)+'" class="'+c+'">'+(esc(l)||' ')+'</div>'});
    return h+'</div>'}
  function diffHtml(d){return '<div class="tp-lines tp-dl">'+d.map(function(l){var c=/^\+/.test(l)?'add':(/^-/.test(l)?'del':'');return '<div class="'+c+'">'+esc(l)+'</div>'}).join('')+'</div>'}

  /* ---------------- GitHub pages ---------------- */
  var REPO='git-club / workshop-site';
  function hot(on,html){return on?'<span class="tp-hot">'+html+'<span class="tp-cursor"></span></span>':html}
  function ghPage(P){
    var tab=P.page==='pr'||P.page==='newpr'?'pulls':(P.page==='repo'?'code':'issues'),
      url={issues:'github.com/git-club/workshop-site/issues',newissue:'github.com/git-club/workshop-site/issues/new',issue:'github.com/git-club/workshop-site/issues/12',
        repo:'github.com/git-club/workshop-site',newpr:'github.com/git-club/workshop-site/compare/main...dark-mode',pr:'github.com/git-club/workshop-site/pull/13'+(P.tab==='files'?'/files':'')}[P.page];
    var openIss=P.closed||P.merged?2:3,openPr=P.page==='pr'&&!P.merged?1:0;
    var h='<div class="shot"><div class="chrome"><i></i><i></i><i></i><span class="url">'+url+'</span></div>'
      +'<div class="ghbar"><span class="logo"></span><span class="search">Type / to search</span><span class="sp"></span><span class="av"></span></div>'
      +'<div class="ghbody" style="padding-bottom:4px"><b style="font-size:14px">'+REPO+'</b> <span class="btn-gray" style="border-radius:20px;font-size:10.5px;padding:0 7px">Public</span></div>'
      +'<div class="tp-ghtabs"><span'+(tab==='code'?' class="act"':'')+'>&lt;&gt; Code</span><span'+(tab==='issues'?' class="act"':'')+'>Issues<span class="ct">'+(P.page==='issues'?2:openIss)+'</span></span><span'+(tab==='pulls'?' class="act"':'')+'>Pull requests<span class="ct">'+openPr+'</span></span><span>Actions</span><span>Settings</span></div><div class="ghbody">';
    var me='<span class="tp-av" style="background:#bcd8ff"></span>aryan',vasu='<span class="tp-av"></span>vasu';
    if(P.page==='issues'){
      h+='<div style="display:flex;gap:8px;align-items:center;margin-bottom:8px"><span class="tp-field" style="flex:1;margin:0">is:issue is:open</span>'+hot(P.hot==='new','<span class="btn-g">New issue</span>')+'</div>'
        +'<div class="tp-glist" style="border:1px solid #d0d7de;border-radius:6px"><div><span class="tp-dot"></span><b>Footer links are broken</b> <span class="tp-lbl bug">bug</span></div><div><span class="tp-dot"></span><b>Add an events page</b> <span class="tp-lbl enh">enhancement</span></div></div>'}
    else if(P.page==='newissue'){
      h+='<h5>Create new issue</h5><div class="tp-ghrow"><div class="tp-ghmain"><small>Add a title</small><div class="tp-field">Add a dark mode toggle</div><small>Add a description</small><div class="tp-field big">The site is too bright at night. Add a button that switches to dark colours.</div><div style="text-align:right">'+hot(P.hot==='submit','<span class="btn-g">Create</span>')+'</div></div>'
        +'<div class="tp-ghside"><div><b>Assignees &#9881;</b><p>No one</p></div><div><b>Labels &#9881;</b><p>None yet</p></div></div></div>'}
    else if(P.page==='issue'){
      h+='<h5>Add a dark mode toggle <span>#12</span></h5><div style="margin-bottom:6px"><span class="tp-state '+(P.closed?'closed':'open')+'">'+(P.closed?'&#10003; Closed':'&#9673; Open')+'</span></div>'
        +'<div class="tp-ghrow"><div class="tp-ghmain"><div class="tp-cmt"><b>'+me+' opened this issue</b><p>The site is too bright at night. Add a button that switches to dark colours.</p></div>'
        +(P.closed?'<p style="margin:4px 0;color:#57606a">'+vasu+' closed this as completed in <b>#13</b></p>':'<p style="margin:4px 0;color:#57606a">'+me+' assigned vasu and added the <span class="tp-lbl enh">enhancement</span> label</p>')+'</div>'
        +'<div class="tp-ghside">'+hot(P.hot==='assign','<div><b>Assignees &#9881;</b><p>'+vasu+'</p></div>')+'<div><b>Labels &#9881;</b><p><span class="tp-lbl enh">enhancement</span></p></div>'+(P.closed?'<div><b>Development</b><p>#13 merged</p></div>':'')+'</div></div>'}
    else if(P.page==='repo'){
      h+='<div class="tp-banner"><span><b>dark-mode</b> had recent pushes less than a minute ago</span>'+hot(P.hot==='compare','<span class="btn-g">Compare &amp; pull request</span>')+'</div>'
        +'<div class="tp-glist" style="border:1px solid #d0d7de;border-radius:6px"><div><b>vasu</b> <small>add footer links &middot; 9f8e7d6</small></div><div>&#128196; index.html</div><div>&#128196; style.css</div></div>'}
    else if(P.page==='newpr'){
      h+='<h5>Open a pull request</h5><div class="tp-field" style="background:#fff">base: <b>main</b> &larr; compare: <b>dark-mode</b> &nbsp;<span style="color:#1f883d">&#10003; Able to merge.</span></div>'
        +'<div class="tp-ghrow"><div class="tp-ghmain"><div class="tp-field">Add a dark mode toggle</div><div class="tp-field big">Adds a moon button in the navbar that switches the colours.<br><b>Closes #12</b></div><div style="text-align:right">'+hot(P.hot==='create','<span class="btn-g">Create pull request</span>')+'</div></div>'
        +'<div class="tp-ghside"><div><b>Reviewers</b><p>'+me+'</p></div><div><b>Assignees</b><p>'+vasu+'</p></div><div><b>Development</b><p>#12</p></div></div></div>'}
    else if(P.page==='pr'){
      h+='<h5>Add a dark mode toggle <span>#13</span></h5><div style="margin-bottom:6px;color:#57606a"><span class="tp-state '+(P.merged?'merged':'open')+'">'+(P.merged?'Merged':'Open')+'</span> <b>vasu</b> '+(P.merged?'merged':'wants to merge')+' 1 commit into <code>main</code> from <code>dark-mode</code></div>'
        +'<div class="tp-ghtabs" style="padding:0;margin-bottom:8px"><span'+(P.tab!=='files'?' class="act"':'')+'>Conversation</span><span>Commits<span class="ct">1</span></span><span'+(P.tab==='files'?' class="act"':'')+'>Files changed<span class="ct">2</span></span></div>';
      if(P.tab==='files'){
        h+='<div style="display:flex;justify-content:flex-end">'+hot(P.hot==='review','<span class="btn-g">Review changes &#9662;</span>')+'</div>'
          +(P.hot==='review'?'<div class="tp-cmt" style="margin-left:auto;max-width:230px"><b>Finish your review</b><p>( ) Comment<br><strong>(&#8226;) Approve</strong><br>( ) Request changes</p></div>':'')
          +'<div class="tp-diff"><b>style.css</b><div class="a">+ body.dark { background: #111; color: #eee; }</div><div class="a">+ .moon { cursor: pointer; }</div></div>'
          +'<div class="tp-diff"><b>index.html</b><div class="d">- &lt;nav&gt;Home | Events&lt;/nav&gt;</div><div class="a">+ &lt;nav&gt;Home | Events &lt;button class="moon"&gt;&#9789;&lt;/button&gt;&lt;/nav&gt;</div></div>'}
      else{
        h+='<div class="tp-cmt"><b>vasu commented</b><p>Adds a moon button in the navbar. Closes #12</p></div>'
          +(P.approved?'<p style="margin:4px 0;color:#57606a"><span style="color:#1f883d">&#10003;</span> '+me+' approved these changes</p>':'')
          +(P.merged?'<p style="margin:4px 0;color:#57606a">'+vasu+' merged commit <code>e1f2a3b</code> into main</p><div class="tp-mergebox"><b style="color:#8250df">Pull request successfully merged and closed</b><span>The dark-mode branch can be safely deleted.</span><div>'+hot(P.hot==='delete','<span class="btn-gray">Delete branch</span>')+'</div></div>'
            :'<div class="tp-mergebox"><span class="ok">&#10003; Changes approved</span><span class="ok">&#10003; This branch has no conflicts with the base branch</span><div>'+hot(P.hot==='merge','<span class="btn-g">Merge pull request</span>')+'</div></div>')}}
    return h+'</div></div>'}

  /* ---------------- one walkthrough ---------------- */
  function build(host){
    var M=MODS[host.getAttribute('data-tp')];if(!M)return;
    var S=[],cur={show:M.init.show||['tree','graph'],tree:M.init.tree||[],edit:M.init.edit||null,gh:M.init.gh||null,g:M.init.g?gApply(null,M.init.g):null};
    S.push(cur);
    M.steps.forEach(function(st){var v=st.v||{},n={};for(var k in cur)n[k]=cur[k];
      /* highlights belong to the step that made them: carried-over rows and lines lose them */
      if(!('tree' in v))n.tree=arr(n.tree).map(function(t){return t.replace(/\^/g,'')});
      if(!('edit' in v)&&n.edit&&n.edit.hl)n.edit={f:n.edit.f,l:n.edit.l};
      if(!('gh' in v)&&n.gh)n.gh=Object.assign({},n.gh,{hot:''});
      for(var k2 in v){if(k2==='g')n.g=gApply(n.g,v.g);else if(k2!=='pb')n[k2]=v[k2]}
      S.push(n);cur=n});
    var N=M.steps.length,at=0;
    host.tabIndex=0;host.setAttribute('role','region');host.setAttribute('aria-label','Step-by-step picture: '+M.title);
    host.innerHTML='<div class="tp-hd"><b>&#9654; SEE IT HAPPEN</b><span class="tp-sp"></span><span class="tp-keys">&larr; &rarr; keys or a clicker</span><button type="button" class="tp-fsb" title="Big view for the projector (F)">&#9974; Big view</button></div>'
      +'<div class="tp-ctl"><button type="button" class="tp-prev">&lt; Back</button><span class="tp-n"></span><div class="tp-dots"></div><button type="button" class="tp-next greenbtn">Next &gt;</button><button type="button" class="tp-again" title="Back to the start">&#8634;</button></div>'
      +'<div class="tp-now"><div class="tp-cmdl"></div><p class="tp-cap" aria-live="polite"></p></div>'
      +'<div class="tp-vb"></div>';
    function q(s){return host.querySelector(s)}
    var vb=q('.tp-vb'),dots=q('.tp-dots');
    dots.innerHTML='<button type="button" data-i="0" title="Start">0</button>'+M.steps.map(function(st,i){return '<button type="button" data-i="'+(i+1)+'" title="'+esc(st.c?arr(st.c).join(' ; '):st.a)+'">'+(i+1)+'</button>'}).join('');
    dots.addEventListener('click',function(e){var b=e.target.closest('button');if(b)go(+b.getAttribute('data-i'))});

    function box(t,note,html,cls){return '<div class="tp-box'+(cls?' '+cls:'')+'"><small>'+t+(note?'<em>'+note+'</em>':'')+'</small>'+html+'</div>'}
    function viz(St,st){
      if(St.gh){vb.className='tp-vb tp-gh';vb.innerHTML=ghPage(St.gh);return}
      vb.className='tp-vb';
      /* wide panels (graph, zones) that come first in "show" go on top, then the small ones side by side, then the other wide ones */
      var lead=[],half=[],rest=[],seenHalf=false;
      St.show.forEach(function(k){var p;
        if(k==='graph')p=box('COMMIT GRAPH','newest on top &middot; ring = HEAD','<div class="tp-graph">'+gSvg(St.g)+'</div>','wide');
        else if(k==='zones')p=box('THE THREE ZONES','',zonesHtml(St),'wide');
        else if(k==='tree')p=box('FILES','',treeHtml(St.tree));
        else if(k==='sees')p=box('WHAT GIT CAN SEE','git status lists these',seesHtml(St));
        if(/ wide/.test(p))(seenHalf?rest:lead).push(p);else{half.push(p);seenHalf=true}});
      if(st&&st.d)half.push(box('git diff redesign','- in redesign &middot; + in main',diffHtml(st.d)));
      else if(St.edit)half.push(box(esc(St.edit.f),St.edit.l.some(function(l){return /^<{7}/.test(l)})?'conflict!':'',fileHtml(St.edit),'file'));
      if(half.length%2)half[half.length-1]=half[half.length-1].replace('class="tp-box','class="tp-box wide');
      vb.innerHTML=lead.join('')+half.join('')+rest.join('')}

    function go(i){
      i=Math.max(0,Math.min(N,i));at=i;
      var St=S[i],st=M.steps[i-1];
      viz(St,st);
      q('.tp-cmdl').innerHTML=st?(st.c?arr(st.c).map(function(c){return '<code><span>$</span> '+esc(c)+'</code>'}).join(''):'<span class="tp-act">'+esc(st.a)+'</span>'):'<span class="tp-act">Start</span>';
      q('.tp-cap').innerHTML=st?(st.k?'&#9733; ':'')+esc(st.cap):'Press <b>Next</b> (or &rarr;) each time you run the next command in your terminal.';
      q('.tp-cap').classList.toggle('key',!!(st&&st.k));
      q('.tp-n').textContent=i?i+' / '+N:'0 / '+N;
      [].forEach.call(dots.children,function(b,j){b.className=j<i?'done':(j===i?'on':'')});
      q('.tp-prev').disabled=i===0;q('.tp-next').disabled=i===N;q('.tp-next').innerHTML=i===N?'Done!':'Next &gt;'}
    q('.tp-prev').onclick=function(){go(at-1)};
    q('.tp-next').onclick=function(){go(at+1)};
    q('.tp-again').onclick=function(){go(0)};
    function fs(){var d=document;
      if(d.fullscreenElement===host||host.classList.contains('tp-fs')){if(d.fullscreenElement)d.exitFullscreen();host.classList.remove('tp-fs');return}
      if(host.requestFullscreen)host.requestFullscreen().catch(function(){host.classList.add('tp-fs')});else host.classList.add('tp-fs');host.focus({preventScroll:true})}
    q('.tp-fsb').onclick=fs;
    host.addEventListener('keydown',function(e){if(e.target.closest('button')&&(e.key===' '||e.key==='Enter'))return;
      var k=e.key;if(k==='ArrowRight'||k==='PageDown'||k===' '){e.preventDefault();go(at+1)}
      else if(k==='ArrowLeft'||k==='PageUp'){e.preventDefault();go(at-1)}
      else if(k==='Home'){e.preventDefault();go(0)}else if(k==='End'){e.preventDefault();go(N)}
      else if(k==='f'||k==='F'){e.preventDefault();fs()}
      else if(k==='Escape'&&host.classList.contains('tp-fs'))host.classList.remove('tp-fs')});
    go(0)}
  [].forEach.call(hosts,build);
})();
