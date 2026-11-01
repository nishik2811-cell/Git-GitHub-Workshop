(function(){
  if(!document.getElementById('pg'))return;
  var $=function(i){return document.getElementById(i)};
  var np=document.createElement('div');np.className='notepad';np.id='notepad';
  np.innerHTML='<div class="nph" id="nph"><span class="vdots"><i></i><i></i><i></i></span><span id="fvT" class="npt">Visual Studio Code</span><button id="npMin" aria-label="Minimise" title="Minimise">_</button></div><div class="npb fvb" id="fvB"></div><span class="npr" id="npR" title="Drag to resize" aria-hidden="true"></span>';
  document.body.appendChild(np);
  (function(){var h=$('nph'),ox,oy,drag=false;
    h.addEventListener('pointerdown',function(e){if(e.target.id==='npMin')return;drag=true;var r=np.getBoundingClientRect();ox=e.clientX-r.left;oy=e.clientY-r.top;h.setPointerCapture(e.pointerId)});
    h.addEventListener('pointermove',function(e){if(!drag)return;np.style.left=Math.max(0,Math.min(innerWidth-120,e.clientX-ox))+'px';np.style.top=Math.max(0,Math.min(innerHeight-60,e.clientY-oy))+'px';np.style.right='auto';np.style.bottom='auto'});
    h.addEventListener('pointerup',function(){drag=false});
    np.addEventListener('pointerdown',function(){var r=np.getBoundingClientRect();np.style.left=r.left+'px';np.style.top=r.top+'px';np.style.width=r.width+'px';np.style.right='auto';np.style.bottom='auto'});
    (function(){var g=$('npR'),sx,sy,sw,sh,on=false;
      g.addEventListener('pointerdown',function(e){e.preventDefault();e.stopPropagation();var r=np.getBoundingClientRect();np.style.left=r.left+'px';np.style.top=r.top+'px';np.style.right='auto';np.style.bottom='auto';sx=e.clientX;sy=e.clientY;sw=r.width;sh=r.height;on=true;np.classList.add('sizing');g.setPointerCapture(e.pointerId)});
      g.addEventListener('pointermove',function(e){if(!on)return;var r=np.getBoundingClientRect();np.style.width=Math.max(220,Math.min(innerWidth-r.left-6,sw+e.clientX-sx))+'px';np.style.height=Math.max(90,Math.min(innerHeight-r.top-6,sh+e.clientY-sy))+'px'});
      g.addEventListener('pointerup',function(){on=false;np.classList.remove('sizing')});
    })();
    $('npMin').onclick=function(){np.classList.toggle('min')};
    if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){if(es[0].isIntersecting){np.classList.add('show');io.disconnect()}},{threshold:0});io.observe($('pg'))}else np.classList.add('show');
  })();
  var out=$('pgOut'),inp=$('pgIn'),ps=$('pgPs'),HOME='/home/you',S,busy=false,queue=[],pend=false,scripting=false;
  function fresh(){S={cwd:HOME,dirs:{},files:{},cfg:{},repo:null,hist:[],hi:0,ran:{},uid:3,merged:false,pushed:false,sig:{},n:0,done:{},finished:S&&S.finished};S.dirs[HOME]=1}
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
  function pr(h){var d=document.createElement('div');d.className='ln';d.innerHTML=h;out.appendChild(d);out.scrollTop=out.scrollHeight}
  function pl(t,c){String(t).split('\n').forEach(function(l){pr('<span class="'+(c||'')+'">'+(esc(l)||'&nbsp;')+'</span>')})}
  function perr(t){pl(t,'r')}
  function rid(){S.uid++;var x=(Math.imul(S.uid,2654435761)^(S.uid<<11)^0x5bd1e995)>>>0;return ('0000000'+x.toString(16)).slice(-7)}
  function fullid(id){var s=id,k=0;while(s.length<40){k++;s+=(Math.imul(s.charCodeAt(k)+k*7919,2654435761)>>>0).toString(16)}return s.slice(0,40)}
  function norm(p){if(p==='~')p=HOME;else if(p.indexOf('~/')===0)p=HOME+p.slice(1);var parts=(p[0]==='/'?p:S.cwd+'/'+p).split('/'),o=[];parts.forEach(function(x){if(!x||x==='.')return;if(x==='..')o.pop();else o.push(x)});return '/'+o.join('/')}
  function dirname(p){return p.slice(0,p.lastIndexOf('/'))||'/'}
  function base(p){return p.slice(p.lastIndexOf('/')+1)}
  function copy(o){var r={};for(var k in o)r[k]=o[k];return r}
  function keys(o){return Object.keys(o)}
  function tok(line){var t=[],cur='',q=null,has=false;
    for(var i=0;i<line.length;i++){var ch=line[i];
      if(q){if(ch===q)q=null;else cur+=ch;continue}
      if(ch==='"'||ch==="'"){q=ch;has=true;continue}
      if(ch===' '){if(cur||has){t.push(cur);cur='';has=false}continue}
      if(ch==='>'&&!q){if(cur||has){t.push(cur);cur='';has=false}
        if(line[i+1]==='>'){t.push('>>');i++}else t.push('>');continue}
      cur+=ch}
    if(cur||has)t.push(cur);return t}
  /* ---------- repo helpers ---------- */
  function R(){return S.repo}
  function C(id){return R().cm[id]}
  function headId(){return R().br[R().head]||null}
  function headTree(){var h=headId();return h?C(h).files:{}}
  function rel(abs){var r=R();return abs.indexOf(r.root+'/')===0?abs.slice(r.root.length+1):null}
  function ignored(r){var g=S.files[R().root+'/.gitignore'];if(!g)return false;
    return g.split('\n').some(function(p){p=p.trim();if(!p||p[0]==='#')return false;
      if(p.slice(-1)==='/')return r.indexOf(p)===0;
      if(p[0]==='*')return r.slice(-(p.length-1))===p.slice(1);
      return r===p||r.split('/')[0]===p})}
  function work(){var w={};keys(S.files).forEach(function(f){var r=rel(f);if(r!==null&&r.indexOf('.git/')!==0)w[r]=S.files[f]});return w}
  function anc(id){var set={},st=[id];while(st.length){var x=st.pop();if(!x||set[x])continue;set[x]=1;C(x).p.forEach(function(p){st.push(p)})}return set}
  function lca(a,b){var A=anc(a),B=anc(b),best=null;keys(A).forEach(function(k){if(B[k]&&(!best||C(k).n>C(best).n))best=k});return best}
  function status(){var r=R(),h=headTree(),w=work(),st={staged:[],unstaged:[],untracked:[],conf:keys(r.conf)};
    keys(r.index).forEach(function(f){if(r.conf[f])return;if(!(f in h))st.staged.push([f,'new file']);else if(h[f]!==r.index[f])st.staged.push([f,'modified'])});
    keys(h).forEach(function(f){if(!(f in r.index))st.staged.push([f,'deleted'])});
    keys(r.index).forEach(function(f){if(r.conf[f])return;if(!(f in w))st.unstaged.push([f,'deleted']);else if(w[f]!==r.index[f])st.unstaged.push([f,'modified'])});
    keys(w).forEach(function(f){if(!(f in r.index)&&!ignored(f))st.untracked.push(f)});
    st.staged.sort();st.unstaged.sort();st.untracked.sort();return st}
  function applyTree(nt){var r=R(),old=headTree();
    keys(old).forEach(function(f){if(!(f in nt))delete S.files[r.root+'/'+f]});
    keys(nt).forEach(function(f){S.files[r.root+'/'+f]=nt[f]});r.index=copy(nt)}
  function needRepo(){if(!S.repo){perr('fatal: not a git repository (or any of the parent directories): .git');return false}
    var r=R();if(!(S.cwd===r.root||S.cwd.indexOf(r.root+'/')===0)){perr('fatal: not a git repository (or any of the parent directories): .git');return false}return true}
  function newCommit(msg,parents,files,author){var r=R(),c={id:rid(),msg:msg,p:parents,files:files,br:r.head,n:++S.n,who:author||S.cfg.name||'you'};r.cm[c.id]=c;r.list.push(c);return c}
  function lines(s){return s?s.replace(/\n$/,'').split('\n').length:0}
  function diffStat(oldT,newT){var files=0,ins=0,created=[];keys(newT).forEach(function(f){if(oldT[f]!==newT[f]){files++;ins+=lines(newT[f]);if(!(f in oldT))created.push(f)}});keys(oldT).forEach(function(f){if(!(f in newT))files++});return {files:files,ins:ins,created:created}}
  function statLine(s){return ' '+s.files+' file'+(s.files===1?'':'s')+' changed'+(s.ins?', '+s.ins+' insertion'+(s.ins===1?'':'s')+'(+)':'')}
  function refsOf(id){var r=R(),a=[];keys(r.br).forEach(function(b){if(r.br[b]===id){a.push(b===r.head?'HEAD -> '+b:b)}});
    keys(r.rbr||{}).forEach(function(b){if(r.rbr[b]===id)a.push('origin/'+b)});
    a.sort(function(x,y){return x.indexOf('HEAD')===0?-1:y.indexOf('HEAD')===0?1:0});return a}
  function visible(){return R().list.filter(function(c){return !c.hidden})}
  function reach(tip){var s=anc(tip),a=[];keys(s).forEach(function(k){if(!C(k).hidden)a.push(C(k))});a.sort(function(x,y){return y.n-x.n});return a}
  /* ---------- three way merge ---------- */
  function mergeInto(otherId,label,msg){
    var r=R(),cur=headId(),o=C(otherId),st=status();
    if(st.staged.length||st.unstaged.length){perr('error: Your local changes would be overwritten by merge.\nCommit your changes first.');return false}
    var A=anc(cur);if(A[otherId]){pl('Already up to date.');return true}
    if(anc(otherId)[cur]){pl('Updating '+cur+'..'+otherId+'\nFast-forward','y');var s=diffStat(headTree(),o.files);applyTree(o.files);r.br[r.head]=otherId;pl(statLine(s));S.merged=true;return true}
    var b=lca(cur,otherId),bt=b?C(b).files:{},ot=C(cur).files,tt=o.files,res={},conf=[];
    var all={};keys(bt).concat(keys(ot),keys(tt)).forEach(function(k){all[k]=1});
    keys(all).forEach(function(f){var x=bt[f],a=ot[f],t=tt[f];
      if(a===t){if(a!==undefined)res[f]=a}
      else if(a===x){if(t!==undefined)res[f]=t}
      else if(t===x){if(a!==undefined)res[f]=a}
      else{conf.push(f);res[f]='<<<<<<< HEAD\n'+(a||'')+'=======\n'+(t||'')+'>>>>>>> '+label+'\n'}});
    if(conf.length){
      keys(res).forEach(function(f){S.files[r.root+'/'+f]=res[f]});
      keys(res).forEach(function(f){if(conf.indexOf(f)<0)r.index[f]=res[f]});
      conf.forEach(function(f){r.conf[f]=1});
      r.merge={other:otherId,label:label,msg:msg};
      conf.forEach(function(f){pl('Auto-merging '+f+'\nCONFLICT (content): Merge conflict in '+f,'r')});
      pl('Automatic merge failed; fix conflicts and then commit the result.','r');
      window.gitPop&&window.gitPop('err','WARNING: MERGE CONFLICT','Both branches changed the same line of <b>'+esc(conf[0])+'</b>.<br><br>Open the file (type <code>cat '+esc(conf[0])+'</code>), then replace it with the line you want, for example:<br><code>echo "title = Welcome" &gt; '+esc(conf[0])+'</code><br>Then <code>git add '+esc(conf[0])+'</code> and <code>git commit</code>.');
      return false}
    var c=newCommit(msg,[cur,otherId],res);
    keys(res).forEach(function(f){S.files[r.root+'/'+f]=res[f]});r.index=copy(res);r.br[r.head]=c.id;
    pl("Merge made by the 'ort' strategy.");pl(statLine(diffStat(ot,res)));S.merged=true;return true}
  /* ---------- commands ---------- */
  function git(a){
    var sub=a[0],r;
    if(!sub||sub==='help'){pl('usage: git <command>\n\nstart:   init, clone\nwork:    status, add, commit, restore\nhistory: log\nbranches: branch, switch, merge\nonline:  remote, push, pull, fetch\nsetup:   config');return}
    if(sub==='--version'||sub==='version'){pl('git version 2.43.0');return}
    if(sub==='config'){
      var gi=a.indexOf('--global');if(gi>=0)a.splice(gi,1);
      if(a[1]==='--list'||a[1]==='-l'){pl('user.name='+(S.cfg.name||'')+'\nuser.email='+(S.cfg.email||'')+'\ninit.defaultbranch=main');return}
      if(a[1]==='user.name'||a[1]==='user.email'){var k=a[1].slice(5);if(a.length>2){S.cfg[k]=a[2]}else{pl(S.cfg[k]||'')}return}
      perr('error: only user.name, user.email and --list are supported here');return}
    if(sub==='init'){
      if(S.repo&&S.repo.root===S.cwd){pl('Reinitialized existing Git repository in '+S.cwd+'/.git/');return}
      S.repo={root:S.cwd,head:'main',br:{main:null},cm:{},list:[],index:{},conf:{},merge:null,remote:null,rbr:{}};
      pl('Initialized empty Git repository in '+S.cwd+'/.git/','g');return}
    if(sub==='clone'){
      var url=a[1];if(!url){perr('fatal: You must specify a repository to clone.');return}
      var name=a[2]||base(url).replace(/\.git$/,'');var root=norm(name);
      if(S.dirs[root]){perr("fatal: destination path '"+name+"' already exists and is not an empty directory.");return}
      pl("Cloning into '"+name+"'...");
      S.dirs[root]=1;S.repo={root:root,head:'main',br:{main:null},cm:{},list:[],index:{},conf:{},merge:null,remote:{url:url,br:{},ids:{}},rbr:{}};
      var f1={'README.md':'# '+name+'\n'},f2={'README.md':'# '+name+'\n','index.html':'<h1>Hello</h1>\n'};
      var c1=newCommit('first commit',[],f1,'Meera');var c2=newCommit('add index page',[c1.id],f2,'Meera');
      R().br.main=c2.id;R().remote.br.main=c2.id;R().rbr.main=c2.id;
      keys(f2).forEach(function(f){S.files[root+'/'+f]=f2[f]});R().index=copy(f2);
      pl('remote: Counting objects: 100% (6/6), done.\nReceiving objects: 100% (6/6), done.');pl('Now type: cd '+name,'y');return}
    if(!needRepo())return;r=R();
    if(sub==='status'){
      S.ran.status=1;if(S.files[R().root+'/.gitignore'])S.ran.stat2=1;var st=status(),o=['On branch '+r.head];
      if(!headId())o.push('\nNo commits yet');
      if(r.merge||st.conf.length){o.push('You have unmerged paths.\n  (fix conflicts and run "git commit")');
        if(st.conf.length){o.push('\nUnmerged paths:\n  (use "git add <file>..." to mark resolution)');st.conf.forEach(function(f){o.push('\tboth modified:   '+f)})}}
      if(st.staged.length){o.push('\nChanges to be committed:\n  (use "git restore --staged <file>..." to unstage)');st.staged.forEach(function(x){o.push('\t'+x[1]+':   '+x[0])})}
      if(st.unstaged.length){o.push('\nChanges not staged for commit:\n  (use "git add <file>..." to update what will be committed)');st.unstaged.forEach(function(x){o.push('\t'+x[1]+':   '+x[0])})}
      if(st.untracked.length){o.push('\nUntracked files:\n  (use "git add <file>..." to include in what will be committed)');st.untracked.forEach(function(f){o.push('\t'+f)})}
      if(!st.staged.length&&!st.unstaged.length&&!st.untracked.length&&!st.conf.length)o.push(headId()?'nothing to commit, working tree clean':'nothing to commit (create/copy files and use "git add" to track)');
      else if(!st.staged.length&&!st.conf.length)o.push(st.untracked.length&&!st.unstaged.length?'\nnothing added to commit but untracked files present (use "git add" to track)':'\nno changes added to commit (use "git add" and/or "git commit -a")');
      var txt=o.join('\n');txt.split('\n').forEach(function(l){var c=''; if(/^\t/.test(l)){c=/new file|modified|deleted/.test(l)&&txt.indexOf('Changes to be committed')>=0&&txt.indexOf(l)<txt.indexOf('Changes not staged')+0.1&&false?'':''}
        pr('<span class="'+(/^\t/.test(l)?(statusColor(l,txt)):'')+'">'+(esc(l)||'&nbsp;')+'</span>')});return}
    if(sub==='add'){
      var w=work(),args=a.slice(1);if(!args.length){perr('Nothing specified, nothing added.\nMaybe you wanted to say \'git add .\'?');return}
      var did=false;
      args.forEach(function(x){
        if(x==='.'||x==='-A'||x==='--all'){keys(w).forEach(function(f){if(!ignored(f)||f in r.index){r.index[f]=w[f];did=true}});keys(r.index).forEach(function(f){if(!(f in w)){delete r.index[f];did=true}});keys(r.conf).forEach(function(f){delete r.conf[f]})}
        else{var f=rel(norm(x));
          if(f===null||(!(f in w)&&!(f in r.index))){perr("fatal: pathspec '"+x+"' did not match any files");return}
          if(f in w){r.index[f]=w[f]}else delete r.index[f];delete r.conf[f];did=true}});
      return}
    if(sub==='rm'){
      var tg=a.slice(1).filter(function(x){return x[0]!=='-'});if(!tg.length){perr('usage: git rm [-r] <file>');return}
      var all=tg.indexOf('.')>=0||tg.indexOf('*')>=0,done=0;
      keys(r.index).slice().forEach(function(f){var hit=all||tg.some(function(x){var q=rel(norm(x));return q===f||(q!==null&&f.indexOf(q+'/')===0)});
        if(hit){delete r.index[f];delete S.files[r.root+'/'+f];delete r.conf[f];pl("rm '"+f+"'");done++}});
      if(!done)perr("fatal: pathspec '"+tg[0]+"' did not match any files");else pl('Now run: git commit -m "Remove files"  then  git push','y');return}
    if(sub==='revert'){
      var hh=headId();if(!hh){perr('error: there is no commit to revert');return}
      var cc=C(hh),nt=cc.p.length?copy(C(cc.p[0]).files):{};
      var rc=newCommit('Revert "'+cc.msg+'"',[hh],nt);applyTree(nt);r.br[r.head]=rc.id;S.reverted=1;
      pl('['+r.head+' '+rc.id+'] Revert "'+cc.msg+'"','g');pl(' This commit undoes the one before it. Nothing is lost: both are in the history.');return}
    if(sub==='restore'){
      var stg=a.indexOf('--staged')>=0,fs=a.slice(1).filter(function(x){return x[0]!=='-'});
      fs.forEach(function(x){var f=rel(norm(x));if(f===null)return;
        if(stg){var h=headTree();if(f in h)r.index[f]=h[f];else delete r.index[f]}
        else{if(f in r.index)S.files[r.root+'/'+f]=r.index[f];else perr("error: pathspec '"+x+"' did not match any file(s) known to git")}});return}
    if(sub==='commit'){
      var mi=a.indexOf('-m'),msg=mi>=0?a[mi+1]:null;
      if(!S.cfg.name||!S.cfg.email){
        pl('Author identity unknown\n\n*** Please tell me who you are.\n\nRun\n  git config --global user.email "you@example.com"\n  git config --global user.name "Your Name"','r');
        window.gitPop&&window.gitPop('err','ERROR','Git does not know who you are yet.<br>Run these two commands first:<br><code>git config --global user.name "Your Name"</code><br><code>git config --global user.email "you@example.com"</code>');return}
      if(keys(r.conf).length){perr('error: Committing is not possible because you have unmerged files.\nhint: Fix them up, then use \'git add <file>\' to mark them resolved.');return}
      var st2=status(),merging=!!r.merge;
      if(!msg&&!merging){perr('Aborting commit due to empty commit message.\nTip: use  git commit -m "your message"');return}
      if(!st2.staged.length&&!merging){pl('On branch '+r.head+'\n'+(st2.untracked.length?'nothing added to commit but untracked files present (use "git add" to track)':'nothing to commit, working tree clean'));return}
      var first=!headId(),ot=headTree(),parents=first?[]:[headId()];
      if(merging)parents.push(r.merge.other);
      var m=msg||r.merge.msg,c=newCommit(m,parents,copy(r.index));r.br[r.head]=c.id;r.merge=null;
      var ds=diffStat(ot,c.files);if(merging)S.merged=true;
      pl('['+r.head+(first?' (root-commit) ':' ')+c.id+'] '+m,'g');pl(statLine(ds));ds.created.forEach(function(f){pl(' create mode 100644 '+f)});return}
    if(sub==='log'){
      S.ran.log=1;if(!headId()){perr("fatal: your current branch '"+r.head+"' does not have any commits yet");return}
      var one=a.indexOf('--oneline')>=0,list=reach(headId());
      list.forEach(function(c,i){var refs=refsOf(c.id),rs=refs.length?' ('+refs.join(', ')+')':'';
        if(one){pr('<span class="y">'+c.id+'</span><span class="c">'+esc(rs)+'</span> '+esc(c.msg))}
        else{pr('<span class="y">commit '+fullid(c.id)+'</span><span class="c">'+esc(rs)+'</span>');
          pl('Author: '+c.who+' <'+(c.who==='Meera'?'meera@example.com':(S.cfg.email||'you@example.com'))+'>\nDate:   Sun Nov 1 22:'+(10+c.n%50)+':00 2026\n\n    '+c.msg+(i<list.length-1?'\n':''))}});return}
    if(sub==='branch'){
      var da=a.indexOf('-d')>=0||a.indexOf('-D')>=0,names=a.slice(1).filter(function(x){return x[0]!=='-'});
      if(da){var n=names[0];if(!(n in r.br)){perr("error: branch '"+n+"' not found.");return}
        if(n===r.head){perr("error: Cannot delete branch '"+n+"' checked out");return}
        var tip=r.br[n];if(tip&&!anc(headId())[tip]){perr("error: the branch '"+n+"' is not fully merged.\nIf you are sure, use 'git branch -D "+n+"'.");return}
        delete r.br[n];pl("Deleted branch "+n+" (was "+tip+").");return}
      if(names.length){var nb=names[0];if(nb in r.br){perr("fatal: a branch named '"+nb+"' already exists");return}
        if(!headId()){perr("fatal: not a valid object name: '"+r.head+"'.");return}r.br[nb]=headId();return}
      keys(r.br).sort().forEach(function(b){pr(b===r.head?'<span class="g">* '+esc(b)+'</span>':'  '+esc(b))});return}
    if(sub==='switch'||sub==='checkout'){
      var mk=a.indexOf('-c')>=0||a.indexOf('-b')>=0,tn=a.slice(1).filter(function(x){return x[0]!=='-'})[0];
      if(!tn){perr('fatal: missing branch name');return}
      if(mk){if(tn in r.br){perr("fatal: a branch named '"+tn+"' already exists");return}
        r.br[tn]=headId();r.head=tn;pl("Switched to a new branch '"+tn+"'");return}
      if(!(tn in r.br)){perr("fatal: invalid reference: "+tn);return}
      if(tn===r.head){pl("Already on '"+tn+"'");return}
      var st3=status();if(st3.staged.length||st3.unstaged.length||st3.conf.length){perr('error: Your local changes would be overwritten by checkout.\nPlease commit your changes first.');return}
      var tt=r.br[tn]?C(r.br[tn]).files:{};applyTree(tt);r.head=tn;pl("Switched to branch '"+tn+"'");return}
    if(sub==='merge'){
      if(a[1]==='--abort'){if(!r.merge){perr('fatal: There is no merge to abort (MERGE_HEAD missing).');return}applyTree(headTree());r.conf={};r.merge=null;pl('Merge aborted.');return}
      var on=a[1];if(!on||!(on in r.br)){perr('merge: '+on+' - not something we can merge');return}
      if(!r.br[on]){perr('merge: '+on+' - not something we can merge');return}
      if(on===r.head){pl('Already up to date.');return}
      mergeInto(r.br[on],on,"Merge branch '"+on+"'");return}
    if(sub==='remote'){
      if(a[1]==='add'){if(!a[3]){perr('usage: git remote add <name> <url>');return}if(r.remote){perr("error: remote origin already exists.");return}
        r.remote={url:a[3],br:{},ids:{}};return}
      if(a[1]==='-v'||!a[1]){if(r.remote){if(a[1])pl('origin\t'+r.remote.url+' (fetch)\norigin\t'+r.remote.url+' (push)');else pl('origin')}return}
      perr('error: unsupported remote command');return}
    if(sub==='push'){
      if(!r.remote){perr("fatal: 'origin' does not appear to be a git repository\nfatal: Could not read from remote repository.\n\nTip: connect first with  git remote add origin <url>");return}
      var br=r.head;if(!headId()){perr('error: src refspec '+br+' does not match any\nerror: failed to push some refs (make a commit first)');return}
      var rt=r.remote.br[br],lt=headId();
      if(rt&&rt!==lt&&!anc(lt)[rt]){pl('To '+r.remote.url+'\n ! [rejected]        '+br+' -> '+br+' (fetch first)','r');perr("error: failed to push some refs to '"+r.remote.url+"'\nhint: Updates were rejected because the remote contains work that you do\nhint: not have locally. Run  git pull  first.");
        window.gitPop&&window.gitPop('err','ERROR: PUSH REJECTED','GitHub has new work that you do not have yet.<br>Type <code>git pull</code> first, then push again.');return}
      pl('Enumerating objects: 5, done.\nCounting objects: 100% (5/5), done.\nWriting objects: 100% (3/3), 280 bytes | 280.00 KiB/s, done.');
      if(rt===lt){pl('Everything up-to-date');return}
      pl('To '+r.remote.url);
      pl(rt?' '+rt+'..'+lt+'  '+br+' -> '+br:' * [new branch]      '+br+' -> '+br,'g');
      if(a.indexOf('-u')>=0)pl("branch '"+br+"' set up to track 'origin/"+br+"'.");
      if(RL.on){realPush(br,rt,lt);return}
      r.remote.br[br]=lt;r.rbr[br]=lt;S.pushed=true;return}
    if(sub==='fetch'||sub==='pull'){
      if(!r.remote){perr("fatal: 'origin' does not appear to be a git repository");return}
      var rb=r.remote.br[r.head];
      if(!rb){pl(sub==='pull'?'Already up to date.':'');return}
      if(r.rbr[r.head]!==rb){pl('From '+r.remote.url+'\n   '+(r.rbr[r.head]||'0000000')+'..'+rb+'  '+r.head+'       -> origin/'+r.head)}
      keys(anc(rb)).forEach(function(k){C(k).hidden=false});r.rbr[r.head]=rb;
      if(sub==='fetch')return;
      if(headId()===rb||anc(headId())[rb]){pl('Already up to date.');return}
      mergeInto(rb,'origin/'+r.head,"Merge branch '"+r.head+"' of "+r.remote.url);return}
    perr("git: '"+sub+"' is not a git command here. Try: git help");
  }
  function statusColor(l,txt){var idx=txt.indexOf(l);var sIdx=txt.indexOf('Changes to be committed'),uIdx=txt.indexOf('Changes not staged'),tIdx=txt.indexOf('Untracked files'),mIdx=txt.indexOf('Unmerged paths');
    var pos=idx;
    if(sIdx>=0&&pos>sIdx&&(uIdx<0||pos<uIdx)&&(tIdx<0||pos<tIdx))return 'g';
    return 'r'}
  function shell(t){
    var cmd=t[0];
    switch(cmd){
      case 'pwd':pl(S.cwd);return;
      case 'whoami':pl('you');return;
      case 'ls':{var all=t.indexOf('-a')>=0||t.indexOf('-la')>=0;if(all)S.ran.lsa=1;var dir=norm(t.filter(function(x,i){return i>0&&x[0]!=='-'})[0]||'.');
        if(!S.dirs[dir]){perr("ls: cannot access '"+(t[1]||'')+"': No such file or directory");return}
        var items=[];if(all&&S.repo&&S.repo.root===dir)items.push('<span class="b">.git/</span>');
        keys(S.dirs).forEach(function(d){if(d!==dir&&dirname(d)===dir)items.push('<span class="b">'+esc(base(d))+'/</span>')});
        keys(S.files).forEach(function(f){if(dirname(f)===dir&&(all||base(f)[0]!=='.'))items.push(esc(base(f)))});
        pr(items.length?items.join('&nbsp;&nbsp;'):'&nbsp;');return}
      case 'cd':{var d=norm(t[1]||'~');if(!S.dirs[d]){perr('bash: cd: '+(t[1]||'')+': No such file or directory');return}S.cwd=d;return}
      case 'mkdir':{if(!t[1]){perr('mkdir: missing operand');return}var d2=norm(t[1]);if(S.dirs[d2]){perr("mkdir: cannot create directory '"+t[1]+"': File exists");return}if(!S.dirs[dirname(d2)]){perr("mkdir: cannot create directory '"+t[1]+"': No such file or directory");return}S.dirs[d2]=1;return}
      case 'touch':{if(!t[1]){perr('touch: missing file operand');return}var f=norm(t[1]);if(!S.dirs[dirname(f)]){perr('touch: No such directory');return}if(!(f in S.files))S.files[f]='';return}
      case 'cat':{if(!t[1]){perr('cat: missing file');return}var f2=norm(t[1]);S.ran.cat=1;if(!(f2 in S.files)){perr('cat: '+t[1]+': No such file or directory');return}
        S.files[f2].replace(/\n$/,'').split('\n').forEach(function(l){pr('<span class="'+(/^(<<<<<<<|=======|>>>>>>>)/.test(l)?'p':'')+'">'+(esc(l)||'&nbsp;')+'</span>')});if(!S.files[f2])pr('&nbsp;');return}
      case 'wipe-github':{if(!RL.on){perr('wipe-github only works in Real GitHub mode. Press the green button first.');return}wipeReal();return}
      case 'rm':{var args=t.slice(1).filter(function(x){return x[0]!=='-'}),rec=t.some(function(x){return /^-.*r/i.test(x)});
        if(!args.length){perr('rm: missing operand');return}
        var hit=0;args.forEach(function(x){
          if(x==='*'||x==='.'){keys(S.files).forEach(function(f){if(dirname(f)===S.cwd||(rec&&f.indexOf(S.cwd+'/')===0)){delete S.files[f];hit++}})}
          else{var q=norm(x);if(q in S.files){delete S.files[q];hit++}
            else if(S.dirs[q]){if(!rec){perr("rm: cannot remove '"+x+"': Is a directory (use rm -r)");return}
              keys(S.files).forEach(function(f){if(f.indexOf(q+'/')===0)delete S.files[f]});keys(S.dirs).forEach(function(d){if(d===q||d.indexOf(q+'/')===0)delete S.dirs[d]});hit++}
            else perr("rm: cannot remove '"+x+"': No such file or directory")}});
        if(hit&&S.repo)pl('Files removed from your folder. Now git add . (or git rm) , commit, push.','y');return}
      case 'rm_old':{if(!t[1]){perr('rm: missing operand');return}var f3=norm(t[1]);if(!(f3 in S.files)){perr("rm: cannot remove '"+t[1]+"': No such file or directory");return}delete S.files[f3];return}
      case 'clear':out.innerHTML='';return;
      case 'help':pl('Try these:\n  rm file | rm -r folder | rm *    (delete things)\n  git rm .    (remove all tracked files)\n  wipe-github    (Real mode: delete EVERYTHING in the GitHub repo, start fresh)\n\n  pwd  ls  cd  mkdir  touch  cat  rm  clear\n  echo "text" > file      (make or change a file)\n  git init | status | add | commit | log\n  git branch | switch | merge\n  git remote | push | pull | clone','y');return;
    }
    perr('bash: '+cmd+': command not found');
  }
  function exec(line){
    var t=tok(line),ri=-1;t.forEach(function(x,i){if((x==='>'||x==='>>')&&ri<0)ri=i});
    if(t[0]==='echo'&&ri>=0){var target=t[ri+1];if(!target){perr('bash: syntax error near unexpected token `newline\'');return}
      var p=norm(target);if(!S.dirs[dirname(p)]){perr('bash: '+target+': No such file or directory');return}
      var txt=t.slice(1,ri).join(' ')+'\n';S.files[p]=t[ri]==='>>'?(S.files[p]||'')+txt:txt;return}
    if(t[0]==='echo'){pl(t.slice(1).join(' '));return}
    if(t[0]==='git'){git(t.slice(1));return}
    shell(t);
  }
  /* ---------- prompt + render ---------- */
  function promptHtml(){var d=S.cwd.replace(HOME,'~'),b='';
    if(S.repo&&(S.cwd===S.repo.root||S.cwd.indexOf(S.repo.root+'/')===0))b=' <span class="c">('+esc(S.repo.head)+')</span>';
    return '<span class="g">you@laptop</span> <span class="p">MINGW64</span> <span class="y">'+esc(d)+'</span>'+b+'<br>$ '}
  function setPrompt(){ps.innerHTML=promptHtml().replace('<br>$ ','')}
  function run(line){
    if(!scripting)holdCap=false;
    pr(promptHtml().replace('<br>','')+esc(line));
    line=line.trim();
    if(line){S.hist.push(line);S.hi=S.hist.length;exec(line)}
    setPrompt();render();
  }
  /* ---------- visuals ---------- */
  var LC=['#1d4ba6','#e07a2e','#2f9a5a','#8a5ad6','#d0457a'];
  function chip(n,cls,tag){return '<span class="fchip '+cls+'" data-f="'+esc(n)+'" title="Click to see what is inside"><b>'+tag+'</b>'+esc(n)+'</span>'}
  function zones(){
    var z1='',z2='',z3='',z4='';
    if(!S.repo){
      var fl=keys(S.files).filter(function(f){return dirname(f)===S.cwd}).map(base);
      z1=fl.length?fl.map(function(n){return chip(n,'plain','')}).join(''):'<i class="empty">'+(S.cwd===HOME?'Empty. Try: mkdir recipes':'Empty folder')+'</i>';
      z2='<i class="empty">Not a repo yet. Try: git init</i>';
    }else{
      var r=R(),w=work(),st=status(),h=headTree(),seen={};
      keys(w).sort().forEach(function(f){var cls='clean',tag='&#10003;';
        if(r.conf[f]){cls='conf';tag='!'}
        else if(!(f in r.index)){cls=ignored(f)?'ign':'untracked';tag=ignored(f)?'x':'?'}
        else if(w[f]!==r.index[f]){cls='mod';tag='M'}
        z1+=chip(f,cls,tag)});
      st.unstaged.forEach(function(x){if(x[1]==='deleted')z1+=chip(x[0],'del','D')});
      if(!z1)z1='<i class="empty">No files yet. Try: echo "Pasta" &gt; pasta.txt</i>';
      st.staged.forEach(function(x){z2+=chip(x[0],x[1]==='deleted'?'del':'new',x[1]==='new file'?'A':x[1]==='deleted'?'D':'M')});
      if(!z2)z2='<i class="empty">Nothing staged. Use git add</i>';
    }
    z3=graph();
    if(S.repo&&S.repo.remote){var rm=S.repo.remote;var bs=keys(rm.br);
      z4='<div class="url">'+esc(rm.url)+'</div>'+(bs.length?bs.map(function(b){var tip=rm.br[b];var n=reach(tip).length;var ahead=R().br[b]&&R().br[b]!==tip&&!anc(R().br[b])[tip]?' <span class="tagr">you are behind</span>':'';return '<div class="rb"><b>'+esc(b)+'</b> <span>'+tip+'</span> <small>'+Math.max(n,1)+' commit'+(n===1?'':'s')+'</small>'+ahead+'</div>'}).join(''):'<i class="empty">Connected, but empty. Try: git push -u origin main</i>')}
    else z4='<i class="empty">Not connected. Try: git remote add origin URL</i>';
    return {z1:z1,z2:z2,z3:z3,z4:z4};
  }
  function graph(){
    if(!S.repo)return '<i class="empty">Your commits will be drawn here.</i>';
    var r=R(),cs=visible();if(!cs.length)return '<i class="empty">No commits yet. Try: git add, then git commit -m "..."</i>';
    var bn=keys(r.br).filter(function(b){return r.br[b]}).sort(function(x,y){return x==='main'?-1:y==='main'?1:x<y?-1:1});
    var ln=0,owner={},laneName=[];
    bn.forEach(function(b){var x=r.br[b],mine=false;while(x&&!(x in owner)){if(!C(x).hidden){owner[x]=ln;mine=true}x=C(x).p[0]}if(mine){laneName[ln]=b;ln++}});
    ln=Math.max(ln,1);if(!laneName[0])laneName[0]=r.head;
    var n=cs.length,G=86,W=470,step=n>1?Math.min(84,(W-G-50)/(n-1)):0,mc=Math.max(7,Math.floor(step/6.4)),pad=64,LH=96;
    var X=function(i){return G+20+i*step},Y=function(l){return pad+l*LH},H=Y(ln-1)+58,pos={};
    cs.forEach(function(c,i){var l=owner[c.id];if(l===undefined)l=0;pos[c.id]={x:X(i),y:Y(l),l:l}});
    var s='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Commit graph">';
    for(var l=0;l<ln;l++){var nm=laneName[l]||'';var w=Math.min(78,nm.length*7.4+16);
      s+='<line x1="'+(G-6)+'" y1="'+Y(l)+'" x2="'+(W-8)+'" y2="'+Y(l)+'" stroke="#e1e9fb" stroke-width="2" stroke-dasharray="3 5"/>'
       +'<rect x="6" y="'+(Y(l)-11)+'" width="'+w+'" height="22" rx="5" fill="'+LC[l%5]+'" stroke="#16327a" stroke-width="2"/><text x="'+(6+w/2)+'" y="'+(Y(l)+4)+'" text-anchor="middle" font-size="12" font-weight="800" fill="#fff" font-family="Nunito,sans-serif">'+esc(nm.length>9?nm.slice(0,8)+'…':nm)+'</text>'}
    cs.forEach(function(c){c.p.forEach(function(q){var a=pos[q],b=pos[c.id];if(!a)return;
      if(a.y===b.y)s+='<line x1="'+a.x+'" y1="'+a.y+'" x2="'+b.x+'" y2="'+b.y+'" stroke="'+LC[b.l%5]+'" stroke-width="5" stroke-linecap="round"/>';
      else s+='<path d="M'+a.x+' '+a.y+' C '+(a.x+step*.55)+' '+a.y+' '+(b.x-step*.55)+' '+b.y+' '+b.x+' '+b.y+'" fill="none" stroke="'+LC[Math.max(a.l,b.l)%5]+'" stroke-width="5" stroke-linecap="round"/>'})});
    var tips={};bn.forEach(function(b){var t=r.br[b];if(t&&pos[t])(tips[t]=tips[t]||[]).push(b)});
    var cloud='<path d="M0 6a3 3 0 0 1 4.6-2.5A3.8 3.8 0 0 1 11.8 5a2.5 2.5 0 0 1-.6 4.9H2.4A2.6 2.6 0 0 1 0 6z" fill="#fff" stroke="#16327a" stroke-width="1.2"/>';
    cs.forEach(function(c){var p=pos[c.id],mrg=c.p.length>1;
      var msg=c.msg.length>mc?c.msg.slice(0,mc-1)+'…':c.msg;
      s+='<g class="gn"><circle cx="'+p.x+'" cy="'+p.y+'" r="13" fill="'+LC[p.l%5]+'" stroke="#16327a" stroke-width="3"/>'+(mrg?'<circle cx="'+p.x+'" cy="'+p.y+'" r="5" fill="#fff"/>':'')
       +'<text x="'+p.x+'" y="'+(p.y+31)+'" text-anchor="middle" font-size="11.5" font-weight="800" font-family="Nunito,sans-serif" fill="#16327a">'+esc(msg)+'</text>'
       +'<text x="'+p.x+'" y="'+(p.y+44)+'" text-anchor="middle" font-size="10" font-family="Fira Code,monospace" fill="#7a86b0">'+c.id+'</text></g>';
      var k=0;(tips[c.id]||[]).forEach(function(b){
        var head=b===r.head,up=r.rbr&&r.rbr[b]===c.id,label=(head?'HEAD > ':'')+b,w=label.length*6.9+16+(up?18:0),y=p.y-30-k*24;
        s+='<rect x="'+(p.x-w/2)+'" y="'+(y-14)+'" width="'+w+'" height="21" rx="5" fill="'+(head?'#e8336d':LC[p.l%5])+'" stroke="#16327a" stroke-width="2"/><text x="'+(p.x-w/2+8)+'" y="'+(y+1)+'" font-size="12" font-weight="800" fill="#fff" font-family="Nunito,sans-serif">'+esc(label)+'</text>'
         +(up?'<g transform="translate('+(p.x+w/2-20)+','+(y-9)+')">'+cloud+'</g>':'');k++});
    });
    return s+'</svg><div class="glg">Pink tag = where you are now. Cloud = this commit is also on GitHub.</div>'}
  /* missions */
  var VI={files:'<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>',search:'<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5"/></svg>',scm:'<svg viewBox="0 0 24 24"><circle cx="6" cy="5" r="2.5"/><circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="8" r="2.5"/><path d="M6 7.5v9M18 10.5c0 4-6 3-11 6.5"/></svg>',ext:'<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="14" y="3" width="7" height="7" transform="rotate(15 17.5 6.5)"/></svg>',nf:'<svg viewBox="0 0 24 24"><path d="M13 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9"/><path d="M18 3v6M15 6h6"/></svg>',br:'<svg viewBox="0 0 24 24"><circle cx="6" cy="5" r="2.5"/><circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="7" r="2.5"/><path d="M6 7.5v9M18 9.5c0 4-6 3-12 7"/></svg>'};
  function ficon(f){var e=(f.match(/\.([a-z0-9]+)$/i)||[,''])[1].toLowerCase(),m={md:['M&darr;','#519aba'],html:['&lt;&gt;','#e44d26'],css:['#','#42a5f5'],js:['JS','#cbcb41'],json:['{}','#cbcb41'],py:['py','#3572a5'],gitignore:['&#9670;','#f14e32']}[e]||['&#8801;','#9da5b4'];return '<i class="vsi" style="color:'+m[1]+'">'+m[0]+'</i>'}
  function flang(f){var e=(f.match(/\.([a-z0-9]+)$/i)||[,''])[1].toLowerCase();return {md:'Markdown',html:'HTML',css:'CSS',js:'JavaScript',json:'JSON',py:'Python',gitignore:'Ignore'}[e]||'Plain Text'}
  function vsShell(folder,list,cur,editor,branch,state){
    var dirty=list.filter(function(x){return x[1]}).length;
    var side='<div class="vsside"><div class="vssh"><span>EXPLORER</span><button class="vsnew" data-new="1" title="New File" aria-label="New File">'+VI.nf+'</button></div><div class="vsfold">&#8964; '+esc(folder.toUpperCase())+'</div>'+(S.vsNaming?'<div class="vsname"><input id="vsName" placeholder="name.txt" spellcheck="false" autocomplete="off"></div>':'')+(list.length?list.map(function(x){return '<div class="vsfile'+(x[0]===cur?' on':'')+(x[1]?' g'+x[1]:'')+'" data-f="'+esc(x[0])+'">'+ficon(x[0])+'<span>'+esc(x[0])+'</span>'+(x[1]?'<b>'+(x[1]==='C'?'!':x[1])+'</b>':'')+'</div>'}).join(''):'<div class="vsnone">empty folder</div>')+'</div>';
    var act='<div class="vsact"><i class="on" title="Explorer">'+VI.files+'</i><i title="Search">'+VI.search+'</i><i title="Source Control">'+VI.scm+(dirty?'<em>'+dirty+'</em>':'')+'</i><i title="Extensions">'+VI.ext+'</i></div>';
    var tabs=cur?'<div class="vstabs">'+list.filter(function(x){return x[0]===cur||x[1]==='C'}).concat(list.filter(function(x){return x[0]!==cur&&x[1]!=='C'})).slice(0,3).map(function(x){return '<span class="vstab'+(x[0]===cur?' on':'')+(x[1]==='C'?' cf':'')+'" data-f="'+esc(x[0])+'">'+ficon(x[0])+esc(x[0])+(x[1]==='C'?' &#9888;':'')+'<u>&times;</u></span>'}).join('')+'</div><div class="vscrumb">'+esc(folder)+' &rsaquo; '+ficon(cur)+esc(cur)+'</div>':'';
    var stat='<div class="vsstat'+(branch?'':' nof')+'"><span>'+(branch?VI.br+esc(branch)+(state?' &middot; '+state:''):'no Git repo here')+'</span><span>&#8855; 0 &#9888; 0</span><span class="vsr">'+(cur?'Ln 1, Col 1 &nbsp; UTF-8 &nbsp; '+flang(cur):'')+'</span></div>';
    return '<div class="vsmain">'+act+side+'<div class="vsed">'+tabs+'<div class="vscode">'+editor+'</div></div></div>'+stat}
  function vsEdit(t){t=t||'';var n=Math.max(1,t.replace(/\n$/,'').split('\n').length);var g='';for(var i=1;i<=n;i++)g+=i+'\n';
    return '<div class="vsedit"><pre class="vsgut" id="vsGut">'+g+'</pre><textarea id="vsTa" rows="'+(n+1)+'" spellcheck="false" autocomplete="off" autocapitalize="off" wrap="off" aria-label="File contents" placeholder="Start typing...">'+esc(t)+'</textarea></div>'}
  function vsPath(){return S.repo?R().root+'/'+S.fvf:S.fvf}
  var vsSel=null;
  function vsKeep(){var ta=$('vsTa'),nm=$('vsName');if(nm){nm.focus();return}if(ta&&vsSel&&vsSel.f===S.fvf){ta.focus({preventScroll:true});ta.setSelectionRange(vsSel.s,vsSel.e);ta.scrollTop=vsSel.t;ta.scrollLeft=vsSel.l}vsSel=null}
  $('fvB').addEventListener('input',function(e){if(e.target.id!=='vsTa')return;var ta=e.target,v=ta.value;
    S.files[vsPath()]=v===''||/\n$/.test(v)?v:v+'\n';
    vsSel={f:S.fvf,s:ta.selectionStart,e:ta.selectionEnd,t:ta.scrollTop,l:ta.scrollLeft};render()});
  $('fvB').addEventListener('keydown',function(e){
    if(e.target.id==='vsTa'&&e.key==='Tab'){e.preventDefault();var ta=e.target,s=ta.selectionStart;ta.setRangeText('  ',s,ta.selectionEnd,'end');ta.dispatchEvent(new Event('input',{bubbles:true}))}
    if(e.target.id!=='vsName')return;
    if(e.key==='Escape'){S.vsNaming=0;fvDraw();return}
    if(e.key!=='Enter')return;e.preventDefault();var nm=e.target.value.trim();
    if(!/^[A-Za-z0-9_.-]+$/.test(nm)||nm==='.'||nm==='..'){e.target.classList.add('bad');e.target.title='Use letters, numbers, dots, dashes or underscores. No spaces.';return}
    var abs=S.cwd+'/'+nm;S.vsNaming=0;
    if(S.dirs[abs]){window.gitPop&&window.gitPop('err','Cannot create file','A folder called <b>'+esc(nm)+'</b> already exists here.');fvDraw();return}
    if(!(abs in S.files))S.files[abs]='';
    var rp=S.repo?rel(abs):abs;
    if(S.repo&&rp===null){window.gitPop&&window.gitPop('err','Outside the repo','The terminal is in a folder outside your repo. <code>cd</code> into the repo first.');render();return}
    S.fvf=rp;pr('<span class="c">[VS Code] Created '+esc(nm)+'. Type in it, then use git add and git commit here.</span>');render();var ta=$('vsTa');if(ta)ta.focus({preventScroll:true})});
  $('fvB').addEventListener('focusout',function(e){if(e.target.id==='vsName'&&S.vsNaming){setTimeout(function(){if(S.vsNaming&&document.activeElement.id!=='vsName'){S.vsNaming=0;fvDraw()}},150)}});
  function fvDraw(){
    var T=$('fvT'),B=$('fvB'),w,ks,conf=false,folder=base(S.repo?S.repo.root:S.cwd)||'/',empty='<div class="vsempty">No files yet. Click the <b>New File</b> icon next to EXPLORER, or type in the terminal:<br><code>echo "Pasta" &gt; pasta.txt</code></div>';
    if(!S.repo){var fl=keys(S.files).filter(function(f){return dirname(f)===S.cwd});np.classList.remove('bad');
      if(!fl.length){T.textContent=folder+' - Visual Studio Code';B.innerHTML=vsShell(folder,[],null,empty,null);return}
      S.fvf=S.fvf&&S.files[S.fvf]!==undefined?S.fvf:fl[0];T.textContent=base(S.fvf)+' - '+folder+' - Visual Studio Code';
      B.innerHTML=vsShell(folder,fl.sort().map(function(f){return [base(f),'']}),base(S.fvf),vsEdit(S.files[S.fvf]),null);vsKeep();
      B.querySelectorAll('[data-f]').forEach(function(e){e.setAttribute('data-f',S.cwd+'/'+e.getAttribute('data-f'))});return}
    w=work();ks=keys(w).sort();
    if(!ks.length){np.classList.remove('bad');T.textContent=folder+' - Visual Studio Code';B.innerHTML=vsShell(folder,[],null,empty,R().head);return}
    if(!S.fvf||!(S.fvf in w))S.fvf=ks[0];
    conf=!!R().conf[S.fvf];
    var hT=headTree();
    function st(f){return R().conf[f]?'C':!(f in R().index)?'U':w[f]!==R().index[f]?'M':R().index[f]!==hT[f]?(f in hT?'M':'A'):''}
    var state=conf?'merge conflict':({U:'new file, not tracked',M:(w[S.fvf]!==R().index[S.fvf]?'changed, not staged':'staged'),A:'staged',C:'merge conflict'})[st(S.fvf)]||'saved';
    T.textContent=S.fvf+' - '+folder+' - Visual Studio Code';
    np.classList.toggle('bad',conf);
    if(conf&&!S.conflShown){S.conflShown=1;np.classList.remove('min');np.classList.remove('flash');void np.offsetWidth;np.classList.add('flash')}
    if(!conf)S.conflShown=0;
    var nc=conf?((w[S.fvf].match(/^<<<<<<</gm)||[]).length):0;
    B.innerHTML=vsShell(folder,ks.map(function(f){return [f,st(f)]}),S.fvf,(nc?'<div class="vsconf">'+nc+' conflict'+(nc>1?'s':'')+' &middot; pick a change below, or edit the file yourself</div>'+fvHtml(w[S.fvf]):vsEdit(w[S.fvf]))+(/\.md$/i.test(S.fvf)?mdPrev(w[S.fvf]):'')+(nc?'<div class="vsme"><button data-me="1">Resolve in Merge Editor</button></div>':''),R().head+(R().merge?' (merging)':''),state);vsKeep();
  }
  function mdPrev(t){var h='<div class="mdp"><div class="mdh">How GitHub shows it</div>';t.replace(/\n$/,'').split('\n').forEach(function(l){
      if(/^## /.test(l))h+='<h4>'+esc(l.replace(/^#+ /,''))+'</h4>';else if(/^# /.test(l))h+='<h3>'+esc(l.slice(2))+'</h3>';else if(l.trim())h+='<p>'+esc(l)+'</p>'});return h+'</div>'}
  function fvHtml(t){if(t===''||t===undefined)return '<div class="vsempty">(empty file)</div>';var m=0,o='',n=0;
    t.replace(/\n$/,'').split('\n').forEach(function(l){n++;var c='',extra='';
      if(/^<<<<<<</.test(l)){c='mk cur';m=1;o+='<div class="lens"><a data-act="cur">Accept Current Change</a> | <a data-act="inc">Accept Incoming Change</a> | <a data-act="both">Accept Both Changes</a> | <span>Compare Changes</span></div>';extra=' (Current Change)'}
      else if(/^=======/.test(l)){c='mk mid';m=2}
      else if(/^>>>>>>>/.test(l)){c='mk inc';m=0;extra=' (Incoming Change)'}
      else if(m===1)c='cur2';else if(m===2)c='inc2';
      o+='<div class="fl '+c+'"><span class="ln2">'+n+'</span><span>'+(esc(l)+extra||'&nbsp;')+'</span></div>'});return o}
  function vsAccept(act){
    if(!S.repo||!S.fvf)return;var f=S.fvf,t=work()[f]||'',m=t.match(/<<<<<<<[^\n]*\n([\s\S]*?)=======\n([\s\S]*?)>>>>>>>[^\n]*\n?/);if(!m)return;
    var rpl=act==='cur'?m[1]:act==='inc'?m[2]:m[1]+m[2];S.files[R().root+'/'+f]=t.replace(m[0],rpl);
    pr('<span class="y">[VS Code] '+(act==='cur'?'Accepted Current Change':act==='inc'?'Accepted Incoming Change':'Accepted Both Changes')+' in '+esc(f)+'. File saved. Next: git add '+esc(f)+', then git commit.</span>');render()}
  var TT1=['Make a folder called recipes and go inside it','Turn it into a Git repo and set your name and email','Create a file called pasta.txt','Save it as your first commit','Connect GitHub and push it','Make a branch called feature','Change the file and commit it on the branch','Push the branch to GitHub','Go back to main','Change the same line on main and commit it','Merge feature into main (a conflict will appear)','Read the conflict markers in the file','Fix the file by writing the final line yourself','Mark it fixed and finish the merge','Push the result to GitHub','Add a README file','Look at the history'];
  function hasC(f){return S.repo&&visible().some(function(c){return f in c.files})}
  var PR1=[
   function(){return !!S.dirs[HOME+'/recipes']&&(S.cwd===HOME+'/recipes'||S.cwd.indexOf(HOME+'/recipes/')===0||!!S.repo)},
   function(){return !!(S.repo&&S.cfg.name&&S.cfg.email)},
   function(){return !!(S.repo&&('pasta.txt' in work()||hasC('pasta.txt')))},
   function(){return hasC('pasta.txt')},
   function(){return !!(S.repo&&S.repo.remote&&S.repo.remote.br.main)},
   function(){return !!(S.repo&&('feature' in S.repo.br))},
   function(){return !!(S.repo&&visible().some(function(c){return c.br==='feature'&&c.p.length}))},
   function(){return !!(S.repo&&S.repo.remote&&S.repo.remote.br.feature)},
   function(){return !!(S.repo&&S.repo.head==='main')},
   function(){return !!(S.repo&&visible().filter(function(c){return c.br==='main'}).length>=2&&S.repo.remote&&S.repo.remote.br.main===S.repo.br.main)},
   function(){return !!(S.repo&&(S.repo.merge||S.merged))},
   function(){return !!(S.merged||S.ran.cat)},
   function(){return !!(S.merged||(S.repo&&S.repo.merge&&!/^<<<<<<</m.test(work()['pasta.txt']||'')&&!/<<<<<<</.test(work()['pasta.txt']||'')))},
   function(){return !!S.merged&&!!S.repo&&!S.repo.merge},
   function(){return !!(S.merged&&S.repo.remote&&S.repo.remote.br.main===S.repo.br.main)},
   function(){return !!(S.repo&&'README.md' in headTree())},
   function(){return !!S.ran.log}
  ];
  var TT,PR,ST;
  function prog(){var k=0;while(k<PR.length&&PR[k]())k++;return k}
  function render(){
    fvDraw();
    var z=zones(),ids=['z1','z2','z3','z4'];
    ids.forEach(function(id){var el=$(id),h=z[id];if(S.sig[id]!==h){el.innerHTML=h;if(S.sig[id]!==undefined){el.parentNode.classList.remove('flash');void el.parentNode.offsetWidth;el.parentNode.classList.add('flash')}S.sig[id]=h}});
    si=prog();var n=si,cur=si<ST.length?si:-1;
    $('pgCount').textContent=n+' / '+ST.length+' missions';
    var mc=$('pgMission');
    if(cur<0){mc.innerHTML='<div class="mdone">&#9733; All missions done! You just used Git for real. &#9733;</div>';
      if(!S.finished){S.finished=1;setTimeout(function(){window.gitPop&&window.gitPop('warn','MISSION COMPLETE','You made a repo, saved commits, branched, merged, fixed a conflict and pushed.<br><b>That is the whole Git workflow.</b>',[{t:'Yay!'}])},500)}}
    else{mc.innerHTML='<div class="mnum">MISSION '+(cur+1)+' OF '+ST.length+'</div><div class="mtxt">'+TT[cur]+'</div><div class="mcmd">'+ST[cur].cmds.map(function(c){return '<code>'+esc(c.replace('@URL@',ghUrl()).replace('@FIX@','echo "...your choice..." > pasta.txt').replace('@CH@','your choice'))+'</code>'}).join('')+'</div><button id="pgType" class="greenbtn">Type it for me</button>';
      $('pgType').onclick=function(){sStep()}}
    var l='';TT.forEach(function(t,i){l+='<li class="'+(i<si?'d':i===cur?'c':'')+'">'+t+'</li>'});$('pgList').innerHTML=l;
    if(window.sDraw)sDraw();
  }
  function showFile(e){if(e.target.closest&&e.target.closest('[data-new]')){S.vsNaming=1;fvDraw();return}var ac=e.target.closest&&e.target.closest('[data-act]');if(ac){vsAccept(ac.getAttribute('data-act'));return}if(e.target.closest&&e.target.closest('[data-me]')){window.gitPop&&window.gitPop('warn','Merge Editor','In real VS Code this opens a 3-pane view: <b>Incoming</b> and <b>Current</b> on top, the <b>Result</b> below. You tick the changes you want, then click <b>Complete Merge</b>.<br><br>Here, use the <b>Accept</b> links above the conflict. Then run <code>git add</code> and <code>git commit</code>.');return}var el=e.target.closest&&e.target.closest('.fchip[data-f],.vstab[data-f],.vsfile[data-f]');if(!el)return;S.fvf=el.getAttribute('data-f');fvDraw();np.classList.remove('flash');void np.offsetWidth;np.classList.add('flash')}
  $('fvB').addEventListener('click',showFile);
  $('z1').addEventListener('click',showFile);$('z2').addEventListener('click',showFile);
  /* ---------- typing animation ---------- */
  function scriptRun(cmds,gap,done,speed){
    if(busy)return;busy=true;scripting=true;inp.disabled=true;
    (function next(){
      if(!cmds.length){busy=false;scripting=false;inp.disabled=false;try{inp.focus({preventScroll:true})}catch(z){}if(done)done();return}
      var c=cmds.shift(),i=0;inp.value='';
      var iv=setInterval(function(){i++;inp.value=c.slice(0,i);if(i>=c.length){clearInterval(iv);setTimeout(function(){inp.value='';run(c);setTimeout(function w(){if(pend)setTimeout(w,300);else next()},gap||420)},speed?500:260)}},speed||22);
    })();
  }
  function reset(){fresh();out.innerHTML='';pl('Welcome to your pretend computer! Type  help  to see what you can do.','y');setPrompt();S.sig={};render()}
  inp.addEventListener('keydown',function(e){
    if(e.key==='Enter'){var v=inp.value;inp.value='';run(v)}
    else if(e.key==='ArrowUp'){if(S.hi>0){S.hi--;inp.value=S.hist[S.hi]||'';e.preventDefault()}}
    else if(e.key==='ArrowDown'){if(S.hi<S.hist.length){S.hi++;inp.value=S.hist[S.hi]||'';e.preventDefault()}}
    else if(e.key==='l'&&e.ctrlKey){out.innerHTML='';e.preventDefault()}
  });
  $('pgTerm').addEventListener('click',function(e){if(!window.getSelection().toString())inp.focus({preventScroll:true})});
  function wipeReal(){
    busy=true;inp.disabled=true;reset();pl('Deleting every file in github.com/'+RL.repo+' ...','y');
    gh('GET','/repos/'+RL.repo+'/git/trees/'+encodeURIComponent(RL.def)+'?recursive=1').then(function(t){
      var fl=(t.s===200?t.j.tree:[]).filter(function(x){return x.type==='blob'});
      var go=fl.length?fl.reduce(function(pr,f){return pr.then(function(){
        return gh('DELETE','/repos/'+RL.repo+'/contents/'+f.path.split('/').map(encodeURIComponent).join('/'),{message:'Clear demo: remove '+f.path,sha:f.sha,branch:RL.def}).then(function(x){pl((x.s<300?'deleted ':'could not delete ')+f.path,x.s<300?'g':'r')})})},Promise.resolve()):(pl('No files to delete.','g'),Promise.resolve());
      return go.then(function(){return gh('GET','/repos/'+RL.repo+'/branches')}).then(function(bs){
        var ex=(bs.s===200?bs.j:[]).map(function(b){return b.name}).filter(function(n){return n!==RL.def});
        return ex.reduce(function(pr,n){return pr.then(function(){return gh('DELETE','/repos/'+RL.repo+'/git/refs/heads/'+encodeURIComponent(n)).then(function(x){pl((x.s<300?'deleted branch ':'could not delete branch ')+n,x.s<300?'g':'r')})})},Promise.resolve())})
        .then(function(){pl('Done. The repo is empty and ready for a fresh demo.','y')});
    }).catch(function(){perr('Could not reach GitHub.')}).then(function(){busy=false;inp.disabled=false;inp.focus({preventScroll:true});refreshLive()});
  }
  $('pgReset').onclick=function(){if(busy)return;
    if(RL.on&&window.gitPop)window.gitPop('err','CLEAR EVERYTHING?','This clears the terminal, deletes your pretend files and starts over.<br><br>Also delete every file in <b>github.com/'+esc(RL.repo)+'</b>?',[{t:'Laptop only',fn:reset},{t:'Laptop + GitHub',fn:wipeReal},{t:'Cancel'}]);
    else reset()};
  $('pgReadme').onclick=function(){if(busy)return;
    if(!S.repo||!S.cfg.name){window.gitPop&&window.gitPop('warn','MAKE A REPO FIRST','A README lives inside a repo. Run <code>git init</code> and set your name and email first, or press Start the story.');return}
    var cm=['echo "# My Project" > README.md','echo "What it is: a small demo project." >> README.md','echo "How to use it: open the files and read." >> README.md','git add README.md','git commit -m "Add README"'];
    if(S.repo.remote)cm.push('git push');scriptRun(cm,900,null,true)};
  function ghUrl(){return 'https://github.com/'+(RL.on?RL.repo:'you/recipes')+'.git'}
  /* ---------- guided story ---------- */
  var si=0;
  var ST1=[
   {say:'First we make a <b>new folder</b> for our recipe project and step inside it.',cmds:['mkdir recipes','cd recipes']},
   {say:'<b>git init</b> turns the folder into a Git repository. Git now watches it. Then we tell Git who we are.',cmds:['git init','git config --global user.name "Nishita"','git config --global user.email "you@example.com"']},
   {say:'We write our <b>first recipe</b>: just one line, the word Pasta. Look at the VS Code window at the bottom right: it shows what is inside the file.',cmds:['echo "Pasta" > pasta.txt']},
   {say:'<b>git add</b> puts the file in the staging box. <b>git commit</b> seals the box and saves it as save point number 1.',cmds:['git add pasta.txt','git commit -m "Add pasta recipe"']},
   {say:'We connect our laptop to GitHub and <b>push</b> the save point up to the online copy.',cmds:['git remote add origin @URL@','git push -u origin main']},
   {say:'Now we want to <b>experiment</b> without risking main. So we make a <b>branch</b> called feature.',cmds:['git switch -c feature']},
   {say:'On the feature branch we change line 1 to <b>white sauce</b>, and save it.',cmds:['echo "Pasta with white sauce" > pasta.txt','git add pasta.txt','git commit -m "Add white sauce"']},
   {say:'Push the feature branch to GitHub too.',cmds:['git push -u origin feature']},
   {say:'Go back to <b>main</b>. Look at the VS Code window: pasta.txt says just <b>Pasta</b> again. Each branch has its own version.',cmds:['git switch main']},
   {say:'Meanwhile someone changes the <b>same line on main</b> to red sauce. This is how conflicts start.',cmds:['echo "Pasta with red sauce" > pasta.txt','git add pasta.txt','git commit -m "Add red sauce on main"','git push']},
   {say:'Now we <b>merge</b> feature into main. Both branches changed line 1, so Git cannot choose. It stops and asks us.',cmds:['git merge feature'],stop:true},
   {say:'Open the file. Git wrote <b>both versions</b> between the marker lines. In the VS Code window the top block is the <b>Current Change</b> (from main) and the bottom block is the <b>Incoming Change</b> (from feature).',cmds:['cat pasta.txt']},
   {say:'<b>You</b> decide which line survives: the red sauce (Current), the white sauce (Incoming), or both. In VS Code you would click <b>Accept Current Change</b>, <b>Accept Incoming Change</b> or <b>Accept Both Changes</b>. Try those buttons in the VS Code window, or press Next step to pick here.',cmds:['@FIX@'],choose:true},
   {say:'Tell Git the conflict is fixed with <b>git add</b>, then <b>commit</b> to finish the merge.',cmds:['git add pasta.txt','git commit -m "Resolve conflict: @CH@"']},
   {say:'Push the finished merge to GitHub.',cmds:['git push']},
   {say:'Last touch: add a <b>README.md</b>. It is the front page of the project, GitHub shows it under your files. The # makes a big heading.',cmds:['echo "# Recipes" > README.md','echo "My pasta recipes. Made at the Git workshop." >> README.md','git add README.md','git commit -m "Add README"','git push']},
   {say:'<b>git log</b> shows the whole story. The graph on the right shows the branch splitting off and joining back. You just resolved a merge conflict!',cmds:['git log --oneline']}
  ];
  var sAuto=false,sTimer=null,sBusy=false,holdCap=false,cs=0;
  var TT2=['Make a folder called notes and set up Git','Create three small files','Save them in your first commit','Connect GitHub and push','Delete draft.txt from your folder','Tell Git about the deletion and commit it','Push, so GitHub drops the file too','Bring the file back with git revert','Push the fix and look at the history'];
  var ST2=[
   {say:'We start a new project called <b>notes</b>, with Git switched on.',cmds:['mkdir notes','cd notes','git init','git config --global user.name "Nishita"','git config --global user.email "you@example.com"']},
   {say:'We create <b>three small files</b>. One of them, draft.txt, is the one we will delete later.',cmds:['echo "Monday" > mon.txt','echo "Tuesday" > tue.txt','echo "old draft" > draft.txt']},
   {say:'Put all three in the staging box and save them as the first commit.',cmds:['git add .','git commit -m "Add three notes"']},
   {say:'Push to GitHub, so the online copy has all three files.',cmds:['git remote add origin @URL@','git push -u origin main']},
   {say:'Now we <b>delete draft.txt</b> from our folder. Git notices: it says <b>deleted</b>, but the deletion is not saved yet. GitHub still has the file.',cmds:['rm draft.txt','git status']},
   {say:'<b>git add</b> also records deletions. Then we commit. (<b>git rm draft.txt</b> does the delete and the add in one go.)',cmds:['git add draft.txt','git commit -m "Remove draft"']},
   {say:'Push, so GitHub drops the file as well. Check the GitHub box: only two files are left.',cmds:['git push']},
   {say:'Oops, we needed it! <b>git revert HEAD</b> undoes the last commit by making a <b>new</b> commit. Nothing is ever lost, because history keeps everything.',cmds:['git revert HEAD']},
   {say:'Push the fix. The file is back on GitHub, and <b>git log</b> shows the full story, deletion and undo included.',cmds:['git push','git log --oneline']}
  ];
  var PR2=[
   function(){return !!(S.repo&&S.cfg.name&&S.cfg.email&&S.dirs[HOME+'/notes'])},
   function(){return !!(S.repo&&(keys(work()).length>=3||hasC('draft.txt')))},
   function(){return hasC('draft.txt')},
   function(){return !!(S.repo&&S.repo.remote&&S.repo.remote.br.main)},
   function(){return hasC('draft.txt')&&!('draft.txt' in work())},
   function(){return !!(S.repo&&hasC('draft.txt')&&!('draft.txt' in headTree()))},
   function(){return !!(S.repo&&hasC('draft.txt')&&!('draft.txt' in headTree())&&S.repo.remote&&S.repo.remote.br.main===S.repo.br.main)},
   function(){return !!(S.reverted&&S.repo&&('draft.txt' in headTree()))},
   function(){return !!(S.reverted&&S.ran.log&&S.repo.remote&&S.repo.remote.br.main===S.repo.br.main)}
  ];
  var TT3=['Make a folder called shop and set up Git','Create app.py, .env (a password!) and debug.log','Ask Git what it sees','Create a .gitignore file','Ask Git again and see what changed','Save app.py and .gitignore as a commit','Push to GitHub','Prove the secret is still on your laptop'];
  var ST3=[
   {say:'A new project called <b>shop</b>, with Git switched on.',cmds:['mkdir shop','cd shop','git init','git config --global user.name "Nishita"','git config --global user.email "you@example.com"']},
   {say:'Three files: our code <b>app.py</b>, a <b>.env</b> file that holds a <b>secret password</b>, and <b>debug.log</b>, which is just noise.',cmds:['echo "print(1)" > app.py','echo "PASSWORD=secret123" > .env','echo "debug info" > debug.log']},
   {say:'<b>git status</b> lists all three as untracked. Danger: if we save everything, our password goes to GitHub for the whole world to see.',cmds:['git status']},
   {say:'<b>.gitignore</b> is a list of names Git must pretend it cannot see. We write <b>.env</b> and <b>*.log</b> (the star means any log file).',cmds:['echo ".env" > .gitignore','echo "*.log" >> .gitignore']},
   {say:'Ask again. <b>.env</b> and <b>debug.log</b> are gone from the list. Look at the folder box: they are marked <b>x</b> (ignored). Only app.py and .gitignore remain.',cmds:['git status']},
   {say:'Now it is safe to save everything. <b>git add .</b> skips the ignored files.',cmds:['git add .','git commit -m "Add app and .gitignore"']},
   {say:'Push. GitHub gets <b>app.py</b> and <b>.gitignore</b> only. The password never leaves your laptop.',cmds:['git remote add origin @URL@','git push -u origin main']},
   {say:'<b>ls -a</b> shows hidden files. <b>.env</b> is still here on your laptop, just not tracked by Git.',cmds:['ls -a']}
  ];
  var PR3=[
   function(){return !!(S.repo&&S.cfg.name&&S.cfg.email&&S.dirs[HOME+'/shop'])},
   function(){return !!(S.repo&&('.env' in work()))},
   function(){return !!S.ran.status},
   function(){return !!(S.repo&&('.gitignore' in work()))},
   function(){return !!S.ran.stat2},
   function(){return hasC('app.py')},
   function(){return !!(S.repo&&S.repo.remote&&S.repo.remote.br.main)},
   function(){return !!S.ran.lsa}
  ];
  var STORIES=[{n:'1. Pasta, branch, conflict',h:'GUIDED STORY: PASTA, BRANCH, CONFLICT',ST:ST1,TT:TT1,PR:PR1},{n:'2. Deleting files',h:'GUIDED STORY: DELETING FILES',ST:ST2,TT:TT2,PR:PR2},{n:'3. The .gitignore file',h:'GUIDED STORY: THE .GITIGNORE FILE',ST:ST3,TT:TT3,PR:PR3}];
  STORIES[2].h='GUIDED STORY: THE .gitignore FILE';
  ST=ST1;TT=TT1;PR=PR1;
  (function(){var h='';STORIES.forEach(function(s,k){h+='<button data-k="'+k+'" class="'+(k===0?'on':'')+'">'+s.n+'</button>'});$('stTabs').innerHTML=h;
    $('stTabs').onclick=function(e){var b=e.target.closest('button');if(!b||busy||sBusy)return;var k=+b.getAttribute('data-k');if(k===cs)return;
      cs=k;ST=STORIES[k].ST;TT=STORIES[k].TT;PR=STORIES[k].PR;sAuto=false;clearTimeout(sTimer);holdCap=false;
      Array.prototype.forEach.call($('stTabs').children,function(x,i){x.className=i===k?'on':''});$('stH').textContent=STORIES[k].h;reset()}})();
  function sDraw(){
    var d='';ST.forEach(function(x,k){d+='<i class="'+(k<si?'d':k===si?'c':'')+'"></i>'});$('sDots').innerHTML=d;
    $('stC').textContent=Math.min(si,ST.length)+' / '+ST.length;
    $('stNext').textContent=si===0&&!S.repo?'Start the story':si>=ST.length?'Play again':'Next step';
    $('stAuto').textContent=sAuto?'Pause':'Auto-play';$('stAuto').className=sAuto?'on':'';
    if(!sBusy&&!holdCap){
      if(si>=ST.length)$('stSay').innerHTML='<b>The whole story is done.</b> You can press Play again, or type anything you like in the terminal.';
      else if(si===0&&!S.repo&&!S.dirs[HOME+'/recipes'])$('stSay').innerHTML='Press <b>Start the story</b>. You will watch every command get typed, and a line under it will explain what it does. You can go one step at a time, or press Auto-play. You can also type the commands yourself, and the story moves ahead with you.';
      else $('stSay').innerHTML='<span class="stn">UP NEXT: STEP '+(si+1)+'</span> '+ST[si].say;
    }
  }
  window.sDraw=sDraw;
  var CH={red:['Pasta with red sauce','keep red sauce'],white:['Pasta with white sauce','keep white sauce'],both:['Pasta with red and white sauce','use both sauces']};
  function sStep(){
    if(sBusy||busy)return;clearTimeout(sTimer);
    if(si>=ST.length){reset();si=0}
    var k=si,st=ST[k];
    if(st.choose){
      sAuto=false;sDraw();
      $('stSay').innerHTML='<span class="stn">STEP '+(k+1)+'</span> '+st.say;
      var pick=function(v){return function(){S.choice=v;sRun(k)}};
      window.gitPop('warn','YOU DECIDE','Git cannot choose, so you must.<br>Which line should the final recipe keep?<br><br><code>Pasta with red sauce</code> (from main)<br><code>Pasta with white sauce</code> (from feature)',[{t:'Keep red',fn:pick('red')},{t:'Keep white',fn:pick('white')},{t:'Keep both',fn:pick('both')}]);
      return}
    sRun(k);
  }
  function sRun(k){
    var st=ST[k];sBusy=true;holdCap=true;clearTimeout(sTimer);
    $('stSay').innerHTML='<span class="stn">STEP '+(k+1)+'</span> '+st.say;
    $('stNext').disabled=true;
    var ch=CH[S.choice||'both'];
    var cmds=st.cmds.map(function(c){return c.replace('@URL@',ghUrl()).replace('@FIX@','echo "'+ch[0]+'" > pasta.txt').replace('@CH@',ch[1])});
    setTimeout(function(){
      scriptRun(cmds,1100,function(){
        sBusy=false;$('stNext').disabled=false;render();
        var adv=si>k;
        if(si>=ST.length){sAuto=false;holdCap=false;sDraw();return}
        if(sAuto&&adv&&!st.stop)sTimer=setTimeout(sStep,3600);
        else if(sAuto){sAuto=false;sDraw();if(st.stop)$('stSay').innerHTML+=' <b>Press Next step to continue.</b>'}
      },true);
    },900);
  }
  $('stNext').onclick=function(){sStep()};
  $('stAuto').onclick=function(){sAuto=!sAuto;sDraw();if(sAuto&&!sBusy)sStep();else if(!sAuto)clearTimeout(sTimer)};
  $('stRestart').onclick=function(){if(busy||sBusy)return;sAuto=false;clearTimeout(sTimer);holdCap=false;reset();sDraw()};
  $('pgMate').onclick=function(){
    if(busy)return;var r=S.repo;
    if(!r||!r.remote||!r.remote.br[r.head]){window.gitPop&&window.gitPop('warn','NOT YET','Push something to GitHub first. Finish the missions up to <b>git push</b>, or press Watch a demo then push.');return}
    var tip=r.remote.br[r.head],tf=copy(C(tip).files);tf['from-meera.txt']='Hi from Meera\n';
    var cur=r.head;var c={id:rid(),msg:'Meera adds a note',p:[tip],files:tf,br:cur,n:++S.n,who:'Meera',hidden:true};r.cm[c.id]=c;r.list.push(c);r.remote.br[cur]=c.id;
    pr('<span class="y">[A teammate (Meera) just pushed a commit to GitHub.]</span>');
    window.gitPop&&window.gitPop('warn','NEW ON GITHUB','Meera pushed new work to GitHub.<br>You do not have it yet. Type <code>git pull</code> to bring it down.');render();
  };

  /* ---------- REAL GitHub mode ---------- */
  var RL={on:false,repo:'',tok:'',def:'main',view:'main',seen:{},timer:null};
  var rb=$('realBox'),rbody=$('realB');
  function gh(method,path,body){
    return fetch('https://api.github.com'+path,{method:method,headers:{'Authorization':'Bearer '+RL.tok,'Accept':'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'},body:body?JSON.stringify(body):undefined}).then(function(r){return r.json().catch(function(){return {}}).then(function(j){return {s:r.status,j:j,m:method,u:path,need:r.headers.get('x-accepted-github-permissions')}})});
  }
  function b64(t){return btoa(unescape(encodeURIComponent(t)))}
  function ago(d){var s=Math.max(0,(Date.now()-new Date(d))/1000);return s<60?'just now':s<3600?Math.floor(s/60)+' min ago':Math.floor(s/3600)+' h ago'}
  function setupForm(msg){
    rbody.innerHTML='<ol class="rsteps"><li><b>Make a new empty repo.</b> <a href="https://github.com/new" target="_blank" rel="noopener">Open github.com/new</a>. Give it a name and click <b>Create repository</b>. Then copy its address from the browser bar.</li>'
     +'<li><b>Make a token.</b> <a href="https://github.com/settings/tokens/new" target="_blank" rel="noopener">Open github.com/settings/tokens/new</a>, tick <b>repo</b>, scroll down, click <b>Generate token</b>, and copy it.</li><li><b>Paste both below.</b></li></ol>'
     +'<label class="rf">Repo link<input id="rfRepo" placeholder="https://github.com/your-name/your-repo" value="'+esc(RL.repo)+'"></label>'
     +'<label class="rf">Token (starts with ghp_ or github_pat_)<input id="rfTok" type="password" placeholder="paste the token here" autocomplete="off"></label>'
     +'<p class="empty" style="margin:4px 0 0">The token stays in this tab only. It is never saved.</p>'
     +(msg?'<p class="rerr">'+esc(msg)+'</p>':'')
     +'<div class="btns" style="justify-content:flex-start;margin:8px 0 0"><button class="greenbtn" id="rfGo">Connect</button><button id="rfOff">Back to pretend mode</button></div>';
    $('rfGo').onclick=connect;$('rfOff').onclick=realOff;
  }
  function parseRepo(v){v=v.trim();var m=v.match(/github\.com[\/:]([\w.-]+)\/([\w.-]+?)(?:\.git)?(?:[\/?#].*)?$/);if(m)return m[1]+'/'+m[2];m=v.match(/^([\w.-]+)\/([\w.-]+)$/);return m?m[1]+'/'+m[2].replace(/\.git$/,''):''}
  function connect(){
    var rp=parseRepo($('rfRepo').value),tk=$('rfTok').value.trim();
    if(!rp||!tk){RL.repo=rp;setupForm('Paste the repo link (like https://github.com/you/your-repo) and the token.');return}
    RL.repo=rp;RL.tok=tk;rbody.innerHTML='<p class="empty">Connecting...</p>';
    gh('GET','/repos/'+rp).then(function(x){
      if(x.s!==200){RL.tok='';setupForm('GitHub said '+x.s+': '+(x.j.message||'could not reach the repo')+'. Check the name and token.');return}
      if(x.j.permissions&&!x.j.permissions.push){RL.tok='';setupForm('This token cannot write to that repo. Make a classic token with the repo box ticked.');return}
      RL.def=x.j.default_branch||'main';RL.view=RL.def;RL.on=true;RL.seen={};
      $('pg').classList.add('real');$('pgReal').textContent='Real mode: ON';
      pl('Connected to github.com/'+rp+' for real. Add it as origin and push!','y');
      pl('git remote add origin https://github.com/'+rp+'.git','c');
      refreshLive(true);clearInterval(RL.timer);RL.timer=setInterval(function(){refreshLive()},8000);
    }).catch(function(e){var keep=tk;var inFrame=false;try{inFrame=window.top!==window}catch(z){inFrame=true}
      setupForm('Could not reach GitHub ('+(e&&e.message||'blocked')+'). '+(inFrame?'This page is inside a preview that blocks outside connections. Download the file and open it in Chrome or Edge.':'Check your internet, turn off ad blockers, and open the file directly in Chrome or Edge instead of a preview.'));
      var t=$('rfTok');if(t)t.value=keep;RL.tok=''})
  }
  function realOff(){RL.on=false;RL.tok='';clearInterval(RL.timer);$('pg').classList.remove('real');rb.hidden=true;$('pgReal').textContent='Real GitHub mode'}
  function refreshLive(first){
    if(!RL.on)return;
    var r=R(),v=(r&&r.head&&r.remote&&r.remote.br[r.head])?r.head:RL.view;
    Promise.all([gh('GET','/repos/'+RL.repo+'/commits?sha='+encodeURIComponent(v)+'&per_page=8'),gh('GET','/repos/'+RL.repo+'/contents?ref='+encodeURIComponent(v)),gh('GET','/repos/'+RL.repo+'/branches')]).then(function(a){
      var cm=a[0],ct=a[1],br=a[2],h='';
      h+='<div class="lvh"><a href="https://github.com/'+RL.repo+'" target="_blank" rel="noopener"><b>'+esc(RL.repo)+'</b></a><span class="lvb">'+esc(v)+'</span><span class="lvn">'+Math.max(br.s===200?br.j.length:1,1)+' branch'+((br.s===200&&br.j.length>1)?'es':'')+'</span><button id="rfRef" title="Refresh">&#8635;</button></div>';
      if(cm.s===200&&cm.j.length){
        h+='<div class="lvf">';
        if(ct.s===200)ct.j.forEach(function(f){h+='<div class="lvfile" data-p="'+esc(f.path)+'" data-t="'+f.type+'"><span>'+(f.type==='dir'?'&#128193;':'&#128196;')+'</span> '+esc(f.name)+'</div>'});
        h+='</div><div class="lvc">';
        cm.j.forEach(function(c){var isNew=!first&&!RL.seen[c.sha]&&Object.keys(RL.seen).length>0;RL.seen[c.sha]=1;
          h+='<a class="lvcm'+(isNew?' newc':'')+'" href="'+c.html_url+'" target="_blank" rel="noopener"><b>'+esc(c.commit.message.split('\n')[0])+'</b><small><code>'+c.sha.slice(0,7)+'</code> '+esc(c.commit.author.name)+' &middot; '+ago(c.commit.author.date)+'</small></a>'});
        h+='</div>';
      }else h+='<p class="empty">This repo has no commits on <b>'+esc(v)+'</b> yet. Make a commit and push.</p>';
      h+='<div class="btns" style="justify-content:flex-start;margin:8px 0 0"><button id="rfWipe" class="redbtn">Delete everything in this repo</button><button id="rfOff2">Switch off real mode</button></div>';
      rbody.innerHTML=h;rb.hidden=false;
      var b=$('rfRef');if(b)b.onclick=function(){refreshLive()};$('rfOff2').onclick=realOff;$('rfWipe').onclick=function(){if(busy)return;window.gitPop('err','DELETE EVERYTHING?','This deletes <b>every file and every extra branch</b> in <b>github.com/'+esc(RL.repo)+'</b> and clears the pretend computer too. Use it to reset the repo for the next demo.',[{t:'Yes, delete everything',fn:wipeReal},{t:'Cancel'}])};
    });
  }
  rbody.addEventListener('click',function(e){var el=e.target.closest&&e.target.closest('.lvfile');if(!el||el.getAttribute('data-t')!=='file')return;
    var path=el.getAttribute('data-p'),v=(R()&&R().remote&&R().remote.br[R().head])?R().head:RL.view;
    gh('GET','/repos/'+RL.repo+'/contents/'+path.split('/').map(encodeURIComponent).join('/')+'?ref='+encodeURIComponent(v)).then(function(x){
      var t=x.s===200?decodeURIComponent(escape(atob(x.j.content.replace(/\n/g,'')))):'Could not read this file.';
      window.gitPop&&window.gitPop('warn',path+' (on GitHub, branch '+v+')','<pre class="fpre">'+esc(t)+'</pre>')})});
  function treeDiff(c){var par=c.p.length?C(c.p[0]).files:{},o=[];keys(c.files).forEach(function(f){if(par[f]!==c.files[f])o.push(['put',f,c.files[f]])});keys(par).forEach(function(f){if(!(f in c.files))o.push(['del',f])});return o}
  function seq(items,fn){return items.reduce(function(p,i){return p.then(function(){return fn(i)})},Promise.resolve())}
  function realPush(br,rt,lt){
    var r=R(),list=reach(lt).filter(function(c){return !rt||!anc(rt)[c.id]}).reverse();
    pend=true;busy=true;inp.disabled=true;pl('Sending '+list.length+' commit'+(list.length===1?'':'s')+' to GitHub (this one is real)...','y');
    var ensure=Promise.resolve();
    if(br!==RL.def)ensure=gh('GET','/repos/'+RL.repo+'/git/ref/heads/'+br).then(function(x){if(x.s===200)return;
      return gh('GET','/repos/'+RL.repo+'/git/ref/heads/'+RL.def).then(function(d){if(d.s!==200)return;return gh('POST','/repos/'+RL.repo+'/git/refs',{ref:'refs/heads/'+br,sha:d.j.object.sha})})});
    ensure.then(function(){return seq(list,function(c){return seq(treeDiff(c),function(ch){
      var path='/repos/'+RL.repo+'/contents/'+ch[1].split('/').map(encodeURIComponent).join('/');
      return gh('GET',path+'?ref='+encodeURIComponent(br)).then(function(ex){
        var sha=ex.s===200?ex.j.sha:undefined;
        if(ch[0]==='del'){if(!sha)return;return gh('DELETE',path,{message:c.msg,sha:sha,branch:br}).then(chk)}
        return gh('PUT',path,{message:c.msg,content:b64(ch[2]),sha:sha,branch:br}).then(chk)});
      function chk(x){if(x.s>=300)throw new Error(x.s+' '+(x.j.message||'')+' [on '+x.m+' '+x.u.split('?')[0]+(x.need?'; needs: '+x.need:'')+']')}})})})
    .then(function(){
      pl('To https://github.com/'+RL.repo+'.git');pl(' * '+(rt?'updated':'[new branch]')+'      '+br+' -> '+br,'g');
      r.remote.br[br]=lt;r.rbr[br]=lt;S.pushed=true;
      if(!r.remote.url||r.remote.url.indexOf(RL.repo)<0)r.remote.url='https://github.com/'+RL.repo+'.git';
      window.gitPop&&window.gitPop('warn','PUSHED FOR REAL','Look at the GitHub panel. Your commit is now on github.com/'+esc(RL.repo)+'.');
      refreshLive();
    }).catch(function(e){
      perr('error: GitHub refused: '+e.message);window.gitPop&&window.gitPop('err','ERROR: PUSH FAILED',esc(e.message)+'<br>Check that it is a classic token with the repo box ticked.');
    }).then(function(){pend=false;if(!scripting){busy=false;inp.disabled=false;inp.focus({preventScroll:true})}setPrompt();render()});
  }
  $('pgReal').onclick=function(){if(RL.on){realOff();return}$('pg').classList.add('real');rb.hidden=false;setupForm()};
  reset();
})();
