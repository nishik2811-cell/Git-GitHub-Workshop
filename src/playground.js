(function(){
  if(!document.getElementById('pg'))return;
  var $=function(i){return document.getElementById(i)};
  var np=document.createElement('div');np.className='notepad';np.id='notepad';
  np.innerHTML='<div class="nph" id="nph"><span class="vdots"><i></i><i></i><i></i></span><span id="fvT" class="npt">Visual Studio Code</span><button id="npMin" aria-label="Minimise" title="Minimise">_</button></div><div class="npb fvb" id="fvB"></div><button type="button" tabindex="-1" class="npr" id="npR" title="Drag to resize" aria-hidden="true"></button>';
  document.body.appendChild(np);
  (function(){var h=$('nph'),ox,oy,drag=false;
    var vsh=null;
    h.addEventListener('pointerdown',function(e){if(e.target.closest&&e.target.closest('button'))return;
      e.preventDefault();drag=true;var r=np.getBoundingClientRect();ox=e.clientX-r.left;oy=e.clientY-r.top;try{h.setPointerCapture(e.pointerId)}catch(z){}});
    h.addEventListener('pointermove',function(e){if(vsh){var hh=Math.max(120,Math.min(innerHeight-48-8,vsh.h+(vsh.y-e.clientY)));np.style.maxHeight='none';np.style.height=Math.round(hh)+'px';np.style.top='auto';np.style.bottom='';return}
      if(!drag)return;var nw=np.offsetWidth;np.style.left=Math.round(Math.max(Math.min(0,80-nw),Math.min(innerWidth-80,e.clientX-ox)))+'px';np.style.top=Math.round(Math.max(0,Math.min(innerHeight-38-36,e.clientY-oy)))+'px';np.style.right='auto';np.style.bottom='auto'});
    ['pointerup','pointercancel'].forEach(function(n){h.addEventListener(n,function(){drag=false;vsh=null})});
    np.addEventListener('pointerdown',function(){var r=np.getBoundingClientRect();np.style.left=r.left+'px';np.style.top=r.top+'px';np.style.width=r.width+'px';np.style.right='auto';np.style.bottom='auto'});
    (function(){var g=$('npR'),sx,sy,sw,sh,on=false;
      g.addEventListener('pointerdown',function(e){e.preventDefault();e.stopPropagation();var r=np.getBoundingClientRect();np.style.left=r.left+'px';np.style.top=r.top+'px';np.style.right='auto';np.style.bottom='auto';np.style.maxHeight='none';sx=e.clientX;sy=e.clientY;sw=r.width;sh=r.height;on=true;np.classList.add('sizing');g.setPointerCapture(e.pointerId)});
      g.addEventListener('pointermove',function(e){if(!on)return;var r=np.getBoundingClientRect();np.style.width=Math.max(220,Math.min(innerWidth-r.left-6,sw+e.clientX-sx))+'px';np.style.height=Math.max(90,Math.min(innerHeight-r.top-6,sh+e.clientY-sy))+'px'});
      g.addEventListener('pointerup',function(){on=false;np.classList.remove('sizing')});
    })();
    var tkb=document.createElement('button');tkb.className='tk tkvs';tkb.id='tkVS';tkb.hidden=true;tkb.title='Visual Studio Code';
    tkb.innerHTML='<i aria-hidden="true"></i><span>Visual Studio Code</span>';
    var tbar=document.getElementById('taskbar'),tray=tbar&&tbar.querySelector('.tray');if(tbar)tbar.insertBefore(tkb,tray);
    window.vsDock=function(on){np.classList.toggle('docked',on);tkb.classList.toggle('on',!on);if(!on){np.classList.remove('flash');void np.offsetWidth;np.classList.add('flash')}};
    $('npMin').onclick=function(){vsDock(true)};
    np.querySelector('.vdots i:nth-child(2)').onclick=function(e){e.stopPropagation();vsDock(true)};
    tkb.onclick=function(){vsDock(!np.classList.contains('docked'))};
    if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){if(es[0].isIntersecting){np.classList.add('show');tkb.hidden=false;tkb.classList.add('on');io.disconnect()}},{threshold:0});io.observe($('pg'))}else{np.classList.add('show');tkb.hidden=false;tkb.classList.add('on')}
  })();
  (function(){var rb0=$('realBox');if(rb0&&!$('pgTrk')){var d=document.createElement('div');d.id='pgTrk';d.className='pgtrk';d.hidden=true;d.setAttribute('role','status');rb0.parentNode.insertBefore(d,rb0.nextSibling)}})();
  var out=$('pgOut'),inp=$('pgIn'),ps=$('pgPs'),HOME='/home/you',S,busy=false,queue=[],pend=false,scripting=false;
  /* two terminals share this one Git engine: the Practice Lab (stories, boxes) and the Terminal app (a plain Git Bash).
     Each keeps its own screen, current folder, command history and GitHub login; the files on the Mini laptop are shared. */
  var labIn=inp,TV={lab:{out:out,inp:inp,ps:ps,cwd:null,hist:null,hi:0,rl:null}},tvCur='lab';
  var RLK=['on','tok','repo','def','view','login','seen','blobs','up','onPushed','trunc'];
  function tvUse(k){if(tvCur===k||!TV[k])return;var a=TV[tvCur],n=TV[k];
    a.cwd=S.cwd;a.hist=S.hist;a.hi=S.hi;a.rl={};RLK.forEach(function(x){a.rl[x]=RL[x]});
    out=n.out;inp=n.inp;ps=n.ps;tvCur=k;
    if(n.cwd&&S.dirs[n.cwd])S.cwd=n.cwd;else if(n.cwd)S.cwd=HOME;
    if(n.hist){S.hist=n.hist;S.hi=n.hi}
    var r=n.rl||{on:false,tok:'',repo:'',def:'main',view:'main',login:'',seen:{},blobs:{},up:{},onPushed:null,trunc:false};RLK.forEach(function(x){RL[x]=r[x]});
    setPrompt()}
  function fresh(){S={vsEmpty:true,cwd:HOME,dirs:{},files:{},cfg:{},repos:{},hist:[],hi:0,ran:{},uid:3,merged:false,pushed:false,sig:{},n:0,done:{},finished:S&&S.finished};S.dirs[HOME]=1;
    /* every folder can hold its own repo (like real Git); S.repo is the one for the folder you are in */
    if(window.mlSeed)try{window.mlSeed(S)}catch(z){}
    Object.defineProperty(S,'repo',{configurable:true,get:function(){if(S.forceRepo)return S.forceRepo;return repoOf(S.cwd)},set:function(v){if(v)S.repos[v.root]=v}})}
  /* pictures and other binary files: the file's contents are a marker ("\0BIN:key"), the real bytes are kept in BIN.
     Two files with the same picture have the same marker, so Git sees them as equal, like real Git does with identical bytes. */
  var BIN={};
  function isBin(t){return typeof t==='string'&&t.indexOf('\u0000BIN:')===0}
  function binInfo(t){return isBin(t)?BIN[t.slice(5)]:null}
  function binReg(key,b64,mime,name){if(!BIN[key])BIN[key]={b64:b64.replace(/\s+/g,''),mime:mime||'application/octet-stream',name:name||key,url:null};return '\u0000BIN:'+key}
  /* a big file (like a presentation in resources/) that is not packed into the page: the bytes are fetched from src when needed */
  function binLazy(key,src,mime,name,size){if(!BIN[key])BIN[key]={b64:null,src:src,size:size||0,mime:mime||'application/octet-stream',name:name||key,url:null};return '\u0000BIN:'+key}
  function binLoad(t){var b=binInfo(t);if(!b)return Promise.reject(new Error('not a binary file'));if(b.b64!=null)return Promise.resolve(b.b64);
    return fetch(b.src).then(function(r){if(!r.ok)throw new Error(r.status);return r.arrayBuffer()}).then(function(buf){var u=new Uint8Array(buf),s3='';for(var i=0;i<u.length;i+=32768)s3+=String.fromCharCode.apply(null,u.subarray(i,i+32768));b.b64=btoa(s3);return b.b64})
      .catch(function(){throw new Error('could not read '+b.name+'. Open the workshop from its website (not as a file on your computer) to upload it.')})}
  function binUrl(t){var b=binInfo(t);if(!b)return '';if(b.b64==null)return b.src||'';if(!b.url){try{var s2=atob(b.b64),a=new Uint8Array(s2.length);for(var i=0;i<s2.length;i++)a[i]=s2.charCodeAt(i);b.url=URL.createObjectURL(new Blob([a],{type:b.mime}))}catch(e){b.url=''}}return b.url}
  function binSize(t){var b=binInfo(t);if(b&&b.b64==null)return b.size||0;return b?Math.floor(b.b64.length*3/4)-(/==$/.test(b.b64)?2:/=$/.test(b.b64)?1:0):0}
  function isPic(t){var b=binInfo(t);return !!b&&/^image\//.test(b.mime)}
  function repoOf(path){var best=null;keys(S.repos||{}).forEach(function(rt){if(under(path,rt)&&(!best||rt.length>best.length))best=rt});return best?S.repos[best]:null}
  /* makes text safe to put in the page. Quotes too: a file name from GitHub like  a" onmouseover="...  must not break out of data-f="..." */
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')}
  function pr(h){var d=document.createElement('div');d.className='ln';d.innerHTML=h;out.appendChild(d);out.scrollTop=out.scrollHeight}
  function pl(t,c){String(t).split('\n').forEach(function(l){pr('<span class="'+(c||'')+'">'+(esc(l)||'&nbsp;')+'</span>')})}
  function perr(t){pl(t,'r')}
  function rid(){S.uid++;var x=(Math.imul(S.uid,2654435761)^(S.uid<<11)^0x5bd1e995)>>>0;return ('0000000'+x.toString(16)).slice(-7)}
  var FULLID={};
  function fullid(id){if(FULLID[id])return FULLID[id];var s=id,k=0;while(s.length<40){k++;s+=(Math.imul(s.charCodeAt(k)+k*7919,2654435761)>>>0).toString(16)}return s.slice(0,40)}
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
  function headId(){var r=R();return r.det||r.br[r.head]||null}
  /* move HEAD: the branch you are on, or HEAD itself when it is detached */
  function setH(r,id){if(r.det)r.det=id;else r.br[r.head]=id}
  /* what Git calls where you are: the branch name, or "detached HEAD" */
  function hName(r){return r.det?'detached HEAD':r.head}
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
  function notRepo(){perr('fatal: not a git repository (or any of the parent directories): .git');
    pl('You are not inside a repo folder ('+(S.cwd===HOME?'~':S.cwd.replace(HOME,'~'))+'). cd into your project folder, or run  git init  there first.','y')}
  function needRepo(){if(!S.repo){notRepo();return false}
    var r=R();if(!(S.cwd===r.root||S.cwd.indexOf(r.root+'/')===0)){notRepo();return false}return true}
  /* a commit's id is the SHA-1 of what it holds (its tree, parents, author and time, message), exactly like real Git;
     the short id is the first 7 characters */
  function cfin(c){var ts=c.ts||Math.floor(Date.now()/1000),tz=c.tz||tzs(),em=c.email||(c.who==='Roli'?'roli@example.com':(S.cfg.email||'you@example.com')),who=c.who+' <'+em+'> '+ts+' '+tz;
    var tx='tree '+gtree(c.files)+'\n'+c.p.map(function(q){return 'parent '+fullid(q)+'\n'}).join('')+'author '+who+'\ncommitter '+who+'\n\n'+c.msg+'\n',body=u8(tx),h=sha1(cat8([u8('commit '+body.length+'\u0000'),body]));
    c.ts=ts;c.tz=tz;c.email=em;c.full=h;c.id=h.slice(0,7);FULLID[c.id]=h;GOBJ[h]={t:'commit',body:body,z:null};c.gobj=h;return c}
  /* the date line real Git prints: Fri Nov 6 12:40:01 2026 +0530 */
  function gdate(c){if(!c.ts)return 'Sun Nov 1 22:'+(10+c.n%50)+':00 2026 +0000';var d=new Date(c.ts*1000),D=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],M=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],z=function(n){return ('0'+n).slice(-2)};
    return D[d.getDay()]+' '+M[d.getMonth()]+' '+d.getDate()+' '+z(d.getHours())+':'+z(d.getMinutes())+':'+z(d.getSeconds())+' '+d.getFullYear()+' '+(c.tz||'+0000')}
  function newCommit(msg,parents,files,author){var r=R(),c={id:'',msg:msg,p:parents,files:files,br:r.head,n:++S.n,who:author||S.cfg.name||'you'};cfin(c);r.cm[c.id]=c;r.list.push(c);return c}
  function lines(s){return s?s.replace(/\n$/,'').split('\n').length:0}
  /* lines added and removed between two versions of a file, counted like real Git (longest common subsequence) */
  function lineCount(o,n){if(isBin(o)||isBin(n))return {ins:0,del:0};var A=o==null||o===''?[]:o.replace(/\n$/,'').split('\n'),B=n==null||n===''?[]:n.replace(/\n$/,'').split('\n'),L=[];
    for(var i=A.length;i>=0;i--){L[i]=[];for(var j=B.length;j>=0;j--)L[i][j]=i===A.length||j===B.length?0:A[i]===B[j]?L[i+1][j+1]+1:Math.max(L[i+1][j],L[i][j+1])}
    return {ins:B.length-L[0][0],del:A.length-L[0][0]}}
  function lcsLen(A,B){var prev=new Array(B.length+1).fill(0);for(var i=1;i<=A.length;i++){var cur=[0];for(var j=1;j<=B.length;j++)cur[j]=A[i-1]===B[j-1]?prev[j-1]+1:Math.max(prev[j],cur[j-1]);prev=cur}return prev[B.length]}
  function statTrees(o,n,only){if(only){var o2={},n2={};keys(o).forEach(function(f){if(only.indexOf(f)>=0)o2[f]=o[f]});keys(n).forEach(function(f){if(only.indexOf(f)>=0)n2[f]=n[f]});o=o2;n=n2}var all={},rows=[],ins=0,del=0;keys(o).concat(keys(n)).forEach(function(f){all[f]=1});
    keys(all).sort().forEach(function(f){var a0=f in o?o[f]:null,b0=f in n?n[f]:null;if(a0===b0)return;
      if(isBin(a0)||isBin(b0)){rows.push([f,'Bin']);return}
      var A=a0==null||a0===''?[]:a0.replace(/\n$/,'').split('\n'),B=b0==null||b0===''?[]:b0.replace(/\n$/,'').split('\n'),l=lcsLen(A,B),pl1=B.length-l,mi=A.length-l;ins+=pl1;del+=mi;rows.push([f,pl1,mi])});
    if(!rows.length)return;var w=Math.max.apply(null,rows.map(function(x){return x[0].length})),nw=Math.max.apply(null,rows.map(function(x){return x[1]==='Bin'?3:String(x[1]+x[2]).length})),big=Math.max.apply(null,rows.map(function(x){return x[1]==='Bin'?0:x[1]+x[2]})),sc=big>40?40/big:1;
    rows.forEach(function(x){var nm=' '+esc(x[0])+new Array(w-x[0].length+1).join(' ')+' | ';if(x[1]==='Bin'){pr(nm+'Bin');return}
      var t=String(x[1]+x[2]);pr(nm+new Array(nw-t.length+1).join(' ')+t+' <span class="g">'+new Array(Math.round(x[1]*sc)+1).join('+')+'</span><span class="r">'+new Array(Math.round(x[2]*sc)+1).join('-')+'</span>')});
    pl(' '+rows.length+' file'+(rows.length>1?'s':'')+' changed'+(ins||!del?', '+ins+' insertion'+(ins===1?'':'s')+'(+)':'')+(del?', '+del+' deletion'+(del===1?'':'s')+'(-)':''))}
  function diffStat(oldT,newT){var files=0,ins=0,del=0,created=[],deleted=[];
    keys(newT).forEach(function(f){if(oldT[f]!==newT[f]){files++;var c=lineCount(oldT[f],newT[f]);ins+=c.ins;del+=c.del;if(!(f in oldT))created.push(f)}});
    keys(oldT).forEach(function(f){if(!(f in newT)){files++;del+=lineCount(oldT[f],null).del;deleted.push(f)}});return {files:files,ins:ins,del:del,created:created,deleted:deleted}}
  /* the file lines real Git prints after a merge or pull: the stat, then create / delete mode */
  function mergeStat(o,n){var d=diffStat(o,n);if(!d.files)return;statTrees(o,n);d.created.sort().forEach(function(f){pl(' create mode 100644 '+f)});(d.deleted||[]).sort().forEach(function(f){pl(' delete mode 100644 '+f)})}
  function statLine(s){return ' '+s.files+' file'+(s.files===1?'':'s')+' changed'+(s.ins?', '+s.ins+' insertion'+(s.ins===1?'':'s')+'(+)':'')+(s.del?', '+s.del+' deletion'+(s.del===1?'':'s')+'(-)':'')}
  function refsOf(id){var r=R(),a=[];if(r.det&&r.det===id)a.push('HEAD');keys(r.br).forEach(function(b){if(r.br[b]===id){a.push(b===r.head&&!r.det?'HEAD -> '+b:b)}});
    keys(r.rbr||{}).forEach(function(b){if(r.rbr[b]===id)a.push('origin/'+b)});
    keys(r.tags||{}).sort().forEach(function(t){if(r.tags[t].id===id)a.push('tag: '+t)});
    a.sort(function(x,y){return x.indexOf('HEAD')===0?-1:y.indexOf('HEAD')===0?1:0});return a}
  /* how your branch compares with origin/<branch>: your laptop's memory of GitHub (only fetch, pull and push update it) */
  function track(){var r=R();if(!r||!r.remote||!r.rbr||r.det)return null;var o=r.rbr[r.head],h=headId();if(!o||!h)return null;
    var A=anc(h),B=anc(o),ah=0,bh=0;keys(A).forEach(function(k){if(!B[k])ah++});keys(B).forEach(function(k){if(!A[k])bh++});return {ah:ah,bh:bh,o:'origin/'+r.head}}
  function cmt(n){return n+' commit'+(n===1?'':'s')}
  /* SSH addresses work just like HTTPS ones (as if this laptop has an SSH key set up):
     git@github.com:you/repo.git and ssh://git@github.com/you/repo point at the same repo as https://github.com/you/repo */
  function asHttps(u){u=String(u||'').trim();var m=u.match(/^(?:ssh:\/\/)?git@([\w.-]+)[:\/](.+)$/);return m?'https://'+m[1]+'/'+m[2]:u}
  function ghKey(u){return asHttps(u).replace(/\.git$/,'').replace(/\/+$/,'').toLowerCase()}
  function ancIn(cm,id){var set={},st=[id];while(st.length){var x=st.pop();if(!x||set[x]||!cm[x])continue;set[x]=1;cm[x].p.forEach(function(q){st.push(q)})}return set}
  /* copy GitHub's side of repo `from` into repo `to` (the commits stay hidden in `to` until it fetches them) */
  function ghCopy(from,to){keys(from.remote.br).forEach(function(b){var tip=from.remote.br[b];
      keys(ancIn(from.cm,tip)).forEach(function(id){if(to.cm[id])return;var c=from.cm[id],n={id:c.id,msg:c.msg,p:c.p.slice(),files:c.files,br:c.br,n:c.n,who:c.who,hidden:true};to.cm[id]=n;to.list.push(n)});
      to.remote.br[b]=tip});keys(from.remote.tags||{}).forEach(function(t){var id=from.remote.tags[t];if(!from.cm[id])return;
      if(!to.cm[id]){var c=from.cm[id];to.cm[id]={id:c.id,msg:c.msg,p:c.p.slice(),files:c.files,br:c.br,n:c.n,who:c.who,hidden:true};to.list.push(to.cm[id])}(to.remote.tags||(to.remote.tags={}))[t]=id});to.list.sort(function(x,y){return x.n-y.n})}
  /* after something lands on the pretend GitHub, every other local repo pointing at the same address can see it there */
  function ghShare(r){if(RL.on||!r||!r.remote)return;var k=ghKey(r.remote.url);keys(S.repos).forEach(function(rt){var q=S.repos[rt];if(q!==r&&q.remote&&ghKey(q.remote.url)===k)ghCopy(r,q)})}
  function ghSource(url,not){var k=ghKey(url),best=null;keys(S.repos).forEach(function(rt){var q=S.repos[rt];if(q!==not&&q.remote&&ghKey(q.remote.url)===k&&(!best||keys(q.remote.br).length>keys(best.remote.br).length))best=q});return best}
  function visible(){return R().list.filter(function(c){return !c.hidden})}
  function reach(tip){var s=anc(tip),a=[];keys(s).forEach(function(k){if(!C(k).hidden)a.push(C(k))});a.sort(function(x,y){return y.n-x.n});return a}
  /* ---------- three way merge ---------- */
  /* git push refused, worded exactly like real Git: "fetch first" when GitHub has commits you never downloaded,
     "non-fast-forward" when you downloaded them but have not merged them in yet (for example, mid-conflict) */
  function pushRejected(url,br,fetched){var r=R();S.pushRej=true;if(S.mate2)S.ran.rej2=1;
    pl('To '+url+'\n ! [rejected]        '+br+' -> '+br+(fetched?' (non-fast-forward)':' (fetch first)'),'r');
    perr("error: failed to push some refs to '"+url+"'\n"+(fetched?"hint: Updates were rejected because the tip of your current branch is behind\nhint: its remote counterpart. If you want to integrate the remote changes,\nhint: use 'git pull' before pushing again.":"hint: Updates were rejected because the remote contains work that you do not\nhint: have locally. This is usually caused by another repository pushing to\nhint: the same ref. If you want to integrate the remote changes, use\nhint: 'git pull' before pushing again.")+"\nhint: See the 'Note about fast-forwards' in 'git push --help' for details.");
    if(window.gitPop&&!scripting){if(r&&r.merge)window.gitPop('err','ERROR: PUSH REJECTED','You are in the middle of a merge.<br>Fix the conflict, then <code>git add</code> and <code>git commit</code> to finish it. Then push.');
      else window.gitPop('err','ERROR: PUSH REJECTED','GitHub has work that you do not have yet.<br>Type <code>git pull</code> first, then push again.')}}
  /* real Git refuses to start another merge or pull while one is unfinished */
  function mergeBlocked(what){var r=R();if(!r||!r.merge)return false;
    if(keys(r.conf).length)perr('error: '+what+" is not possible because you have unmerged files.\nhint: Fix them up in the work tree, and then use 'git add/rm <file>'\nhint: as appropriate to mark resolution and make a commit.\nfatal: Exiting because of an unresolved conflict.");
    else perr('error: You have not concluded your merge (MERGE_HEAD exists).\nhint: Please, commit your changes before merging.\nfatal: Exiting because of unfinished merge.');
    return true}
  /* the second half of git fetch / git pull, once GitHub's commits are known (pretend or real) */
  function syncPull(sub,allowU,res,reb){var r=R();if(!r||!r.remote)return;
    if(res&&res.err){perr(res.err);return}
    var rb=r.remote.br[r.head];
    if(!rb){if(sub==='pull'){perr("fatal: couldn't find remote ref "+r.head);pl('GitHub does not have the branch '+r.head+' yet. Push it first:  git push -u origin '+r.head,'y')}return}
    if(r.rbr[r.head]!==rb){pl('From '+r.remote.url+'\n   '+(r.rbr[r.head]||'0000000')+'..'+rb+'  '+r.head+'       -> origin/'+r.head)}
    keys(anc(rb)).forEach(function(k){C(k).hidden=false});r.rbr[r.head]=rb;
    r.tags=r.tags||{};keys(r.remote.tags||{}).forEach(function(t){if(!r.tags[t]&&r.cm[r.remote.tags[t]]){r.tags[t]={id:r.remote.tags[t]};C(r.tags[t].id).hidden=false;pl(' * [new tag]         '+t+'       -> '+t)}});
    if(sub==='fetch')return;
    if(S.mate2&&S.ran.rej2)S.ran.pc2=1;
    var cur=headId();
    if(S.ran.f1&&!S.mate2&&cur&&cur!==rb&&!anc(cur)[rb])S.ran.p1=1; // only when the pull really brings something new
    if(!cur){var s0=diffStat({},C(rb).files);applyTree(C(rb).files);setH(r,rb);pl('Fast-forward','y');pl(statLine(s0));return}
    if(cur===rb||anc(cur)[rb]){pl('Already up to date.');return}
    if(!anc(rb)[cur]&&!lca(cur,rb)&&!allowU){perr('fatal: refusing to merge unrelated histories');pl("Your laptop's history and GitHub's started separately (for example, the repo was created with a README on GitHub). To join them, type:  git pull origin "+r.head+" --allow-unrelated-histories",'y');return}
    if(reb){rebaseOnto(rb,'origin/'+r.head);return}
    mergeInto(rb,'origin/'+r.head,"Merge branch '"+r.head+"' of "+r.remote.url)}
  /* ---------- git rebase: replay your commits, one by one, on top of another branch (new commits, new ids) ---------- */
  function merge3(bt,ot,tt,lo,lt){var res={},conf=[],all={};keys(bt).concat(keys(ot),keys(tt)).forEach(function(k){all[k]=1});
    keys(all).forEach(function(f){var x=bt[f],a=ot[f],t=tt[f];
      if(a===t){if(a!==undefined)res[f]=a}else if(a===x){if(t!==undefined)res[f]=t}else if(t===x){if(a!==undefined)res[f]=a}
      else if(isBin(a)||isBin(t)){conf.push(f);res[f]=a!==undefined?a:t}
      else{conf.push(f);res[f]='<<<<<<< '+lo+'\n'+(a||'')+'=======\n'+(t||'')+'>>>>>>> '+lt+'\n'}});return {res:res,conf:conf}}
  function setWork(files){var r=R(),old={};keys(r.index).concat(keys(headTree())).forEach(function(f){old[f]=1});
    keys(old).forEach(function(f){if(!(f in files))delete S.files[r.root+'/'+f]});
    keys(files).forEach(function(f){S.files[r.root+'/'+f]=files[f];var d=dirname(r.root+'/'+f);while(d!==r.root&&!S.dirs[d]){S.dirs[d]=1;d=dirname(d)}});r.index=copy(files);r.conf={}}
  function rebaseOnto(up,upName){var r=R(),cur=headId();
    if(!cur){perr('fatal: your current branch \''+r.head+'\' does not have any commits yet');return}
    if(cur===up||anc(cur)[up]){pl('Current branch '+r.head+' is up to date.');return}
    if(anc(up)[cur]){setWork(copy(C(up).files));setH(r,up);pl('Successfully rebased and updated '+(r.det?'detached HEAD':'refs/heads/'+r.head)+'.');S.ran.rebase=1;return}
    var A=anc(up),todo=keys(anc(cur)).filter(function(k){return !A[k]&&C(k).p.length<2}).map(C).sort(function(x,y){return x.n-y.n}).map(function(c){return c.id});
    r.rebase={orig:cur,onto:up,name:upName,todo:todo,cur:null};setH(r,up);setWork(copy(C(up).files));rebaseNext()}
  function rebaseNext(){var r=R(),rb=r.rebase;
    while(rb.todo.length){var id=rb.todo.shift(),c=C(id),tip=headId(),m=merge3(c.p.length?C(c.p[0]).files:{},C(tip).files,c.files,'HEAD','('+id+' ('+c.msg+'))');
      if(m.conf.length){rb.cur=id;keys(m.res).forEach(function(f){S.files[r.root+'/'+f]=m.res[f]});keys(C(tip).files).forEach(function(f){if(!(f in m.res))delete S.files[r.root+'/'+f]});
        keys(m.res).forEach(function(f){if(m.conf.indexOf(f)<0)r.index[f]=m.res[f]});m.conf.forEach(function(f){r.conf[f]=1;pl('Auto-merging '+f+'\nCONFLICT (content): Merge conflict in '+f,'r')});
        perr('error: could not apply '+id+'... '+c.msg+'\nhint: Resolve all conflicts manually, mark them as resolved with\nhint: "git add/rm <conflicted_files>", then run "git rebase --continue".\nhint: You can instead skip this commit: run "git rebase --skip".\nhint: To abort and get back to the state before "git rebase", run "git rebase --abort".');
        pl('Could not apply '+id+'... '+c.msg);return}
      var same=keys(m.res).length===keys(C(tip).files).length&&keys(m.res).every(function(f){return C(tip).files[f]===m.res[f]});
      if(same)continue; /* already there: real Git drops it too */
      var nc=newCommit(c.msg,[tip],m.res,c.who);setH(r,nc.id);setWork(copy(m.res))}
    r.rebase=null;S.ran.rebase=1;pl('Successfully rebased and updated '+(r.det?'detached HEAD':'refs/heads/'+r.head)+'.')}
  function mergeInto(otherId,label,msg){
    var r=R(),cur=headId(),o=C(otherId),st=status(),hh=headTree(),w0=work(),dirty={};
    var A=anc(cur);if(A[otherId]){pl('Already up to date.');return true}
    st.staged.forEach(function(x){dirty[x[0]]=1});st.unstaged.forEach(function(x){dirty[x[0]]=1});
    function blockOn(t2){var ov=keys(dirty).filter(function(f){return hh[f]!==t2[f]}).sort();
      if(ov.length){perr('error: Your local changes to the following files would be overwritten by merge:\n'+ov.map(function(f){return '\t'+f}).join('\n')+'\nPlease commit your changes or stash them before you merge.\nAborting');return true}
      var un=st.untracked.filter(function(f){return (f in t2)&&!(f in hh)&&w0[f]!==t2[f]}).sort();
      if(un.length){perr('error: The following untracked working tree files would be overwritten by merge:\n'+un.map(function(f){return '\t'+f}).join('\n')+'\nPlease move or remove them before you merge.\nAborting');return true}return false}
    function put(f,v){if(dirty[f])return;if(v===undefined){delete S.files[r.root+'/'+f];return}S.files[r.root+'/'+f]=v;var d=dirname(r.root+'/'+f);while(d!==r.root&&!S.dirs[d]){S.dirs[d]=1;d=dirname(d)}}
    if(anc(otherId)[cur]){if(blockOn(o.files))return false;pl('Updating '+cur+'..'+otherId+'\nFast-forward');
      var u0={};keys(hh).concat(keys(o.files)).forEach(function(f){u0[f]=1});keys(u0).forEach(function(f){if(dirty[f])return;put(f,o.files[f]);if(f in o.files)r.index[f]=o.files[f];else delete r.index[f]});
      setH(r,otherId);mergeStat(hh,o.files);S.merged=true;return true}
    if(st.staged.length){perr('error: Your local changes to the following files would be overwritten by merge:\n'+st.staged.map(function(x){return '  '+x[0]}).sort().join('\n')+'\nMerge with strategy ort failed.');return false}
    var b=lca(cur,otherId),bt=b?C(b).files:{},ot=C(cur).files,tt=o.files,res={},conf=[];
    var all={};keys(bt).concat(keys(ot),keys(tt)).forEach(function(k){all[k]=1});
    keys(all).forEach(function(f){var x=bt[f],a=ot[f],t=tt[f];
      if(a===t){if(a!==undefined)res[f]=a}
      else if(a===x){if(t!==undefined)res[f]=t}
      else if(t===x){if(a!==undefined)res[f]=a}
      else if(isBin(a)||isBin(t)){conf.push(f);res[f]=a!==undefined?a:t;pl('warning: Cannot merge binary files: '+f+' (HEAD vs. '+label+')','y')}
      else{conf.push(f);res[f]='<<<<<<< HEAD\n'+(a||'')+'=======\n'+(t||'')+'>>>>>>> '+label+'\n'}});
    if(blockOn(res))return false;
    if(conf.length){
      keys(ot).forEach(function(f){if(!(f in res))put(f,undefined)});keys(res).forEach(function(f){put(f,res[f])});
      keys(res).forEach(function(f){if(conf.indexOf(f)<0)r.index[f]=res[f]});
      conf.forEach(function(f){r.conf[f]=1});
      r.merge={other:otherId,label:label,msg:msg};
      conf.forEach(function(f){pl('Auto-merging '+f+'\nCONFLICT (content): Merge conflict in '+f,'r')});
      pl('Automatic merge failed; fix conflicts and then commit the result.','r');
      window.gitPop&&window.gitPop('err','WARNING: MERGE CONFLICT','Both branches changed the same line of <b>'+esc(conf[0])+'</b>.<br><br>Open the file (type <code>cat '+esc(conf[0])+'</code>), then replace it with the line you want, for example:<br><code>echo "title = Welcome" &gt; '+esc(conf[0])+'</code><br>Then <code>git add '+esc(conf[0])+'</code> and <code>git commit</code>.');
      return false}
    var c=newCommit(msg,[cur,otherId],res);
    keys(ot).forEach(function(f){if(!(f in res))put(f,undefined)});keys(res).forEach(function(f){put(f,res[f])});r.index=copy(res);setH(r,c.id);
    pl("Merge made by the 'ort' strategy.");mergeStat(ot,res);S.merged=true;return true}
  /* ---------- commands ---------- */
  function git(a){
    var sub=a[0],r;
    if(S.repo&&under(S.cwd,S.repo.root+'/.git')&&/^(status|add|commit|diff|restore|rm|mv|switch|checkout|merge|stash|reset|pull|revert|rebase|clean)$/.test(sub||'')){perr('fatal: this operation must be run in a work tree');return}
    if(!sub||sub==='help'){pl('usage: git <command>\n\nstart:    init, clone\nwork:     status, add, commit, diff, restore, rm, mv\nundo:     restore, reset, revert, stash\nhistory:  log, show, tag, ls-files\nbranches: branch, switch, checkout, merge, rebase\nonline:   remote, push, pull, fetch\nsetup:    config, --version');return}
    if(sub==='--version'||sub==='version'){pl('git version 2.43.0');return}
    if(sub==='config'){
      var gi=a.indexOf('--global');if(gi>=0)a.splice(gi,1);
      S.cfg.x=S.cfg.x||{};var gi2=a.indexOf('--get');if(gi2>=0)a.splice(gi2,1);var un=a.indexOf('--unset');if(un>=0)a.splice(un,1);
      if(a[1]==='--list'||a[1]==='-l'){var ls=[];if(S.cfg.name)ls.push('user.name='+S.cfg.name);if(S.cfg.email)ls.push('user.email='+S.cfg.email);keys(S.cfg.x).forEach(function(k){ls.push(k+'='+S.cfg.x[k])});pl(ls.join('\n'));return}
      var ck=(a[1]||'').toLowerCase();if(!ck){perr('usage: git config [--global] <name> [<value>]');return}
      if(ck.indexOf('.')<1||/\.$/.test(ck)){perr('error: key does not contain a section: '+a[1]);return}
      if(ck==='user.name'||ck==='user.email'){var k=ck.slice(5);if(un>=0){delete S.cfg[k];return}if(a.length>2){S.cfg[k]=a.slice(2).join(' ')}else if(S.cfg[k])pl(S.cfg[k]);return}
      if(un>=0){delete S.cfg.x[ck];return}
      if(a.length>2){S.cfg.x[ck]=a.slice(2).join(' ')}else if(ck in S.cfg.x)pl(S.cfg.x[ck]);return}
    if(sub==='init'){
      if(S.repo&&S.repo.root===S.cwd){pl('Reinitialized existing Git repository in '+S.cwd+'/.git/');return}
      S.repo={root:S.cwd,head:'main',br:{main:null},cm:{},list:[],index:{},conf:{},merge:null,remote:null,rbr:{}};
      pl('Initialized empty Git repository in '+S.cwd+'/.git/','g');return}
    if(sub==='clone'){
      var url=a[1];if(!url){perr('fatal: You must specify a repository to clone.\n\nusage: git clone <repo> [<dir>]');return}
      var name=a[2]||base(url.replace(/\/+$/,'')).replace(/\.git$/,'');var root=norm(name);
      if(exists(root)&&!(S.dirs[root]&&!keys(S.files).some(function(f){return under(f,root)})&&!keys(S.dirs).some(function(d){return d!==root&&under(d,root)}))){perr("fatal: destination path '"+name+"' already exists and is not an empty directory.");return}
      var isUrl=/^(https?:\/\/|git@|ssh:\/\/)/.test(url),loc=!isUrl&&S.repos[norm(url)];
      if(!isUrl&&!loc){perr("fatal: repository '"+url+"' does not exist");return}
      pl("Cloning into '"+name+"'...");
      function made(){S.dirs[root]=1;var nr={root:root,head:'main',br:{},cm:{},list:[],index:{},conf:{},merge:null,remote:{url:url,br:{},ids:{}},rbr:{}};S.repos[root]=nr;return nr}
      /* check out GitHub's default branch, and remember every GitHub branch as origin/<name> */
      function checkout(nr,def){var tip=nr.remote.br[def];keys(nr.remote.br).forEach(function(b){nr.rbr[b]=nr.remote.br[b]});nr.tags={};keys(nr.remote.tags||{}).forEach(function(t){nr.tags[t]={id:nr.remote.tags[t]}});
        nr.list.forEach(function(c){c.hidden=false});if(!tip){nr.head=def||'main';nr.br[nr.head]=null;pl('warning: You appear to have cloned an empty repository.','y');return}
        nr.head=def;nr.br[def]=tip;nr.up={};nr.up[def]=1;var fl=nr.cm[tip].files;keys(fl).forEach(function(f){S.files[root+'/'+f]=fl[f];var d=dirname(root+'/'+f);while(d!==root&&!S.dirs[d]){S.dirs[d]=1;d=dirname(d)}});nr.index=copy(fl);pl('Now type: cd '+name,'y')}
      if(RL.on&&!loc){
        /* Real GitHub mode: any GitHub repo your token can read (every public repo, and your own private ones) */
        var m=asHttps(url).match(/^https?:\/\/(?:www\.)?github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+?)(?:\.git)?\/?$/);
        if(!m){perr("fatal: repository '"+url+"' not found");pl('Real GitHub mode can only clone from github.com, like https://github.com/owner/repo (or git@github.com:owner/repo.git)','y');return}
        var full=m[1]+'/'+m[2];pend=true;busy=true;inp.disabled=true;
        /* the terminal stays locked until every branch has arrived, like a real clone */
        function unlock(){pend=false;if(!scripting){busy=false;inp.disabled=false;try{inp.focus({preventScroll:true})}catch(z){}}setPrompt()}
        var DEPTH=50,nr=null;
        gh('GET','/repos/'+full).then(function(info){
          if(info.s===404||info.s===403||info.s===401){perr("remote: Repository not found.\nfatal: repository 'https://github.com/"+full+"/' not found");unlock();render();return}
          if(info.s!==200){perr('fatal: unable to access \'https://github.com/'+full+'/\': GitHub said '+info.s);unlock();render();return}
          var def=info.j.default_branch||'main';full=info.j.full_name||full;
          nr=made();nr.ghRepo=full;nr.ghDef=def;nr.remote.url=/^(git@|ssh:\/\/)/.test(url)?url:'https://github.com/'+full+'.git';S.forceRepo=nr;RL.trunc=false;
          return gh('GET','/repos/'+full+'/branches?per_page=100').then(function(x){return x.s===200&&x.j.length?x.j.map(function(b){return b.name}):[def]},function(){return [def]}).then(function(list){
            list.sort(function(x,y){return x===def?-1:y===def?1:0});list=list.slice(0,20);var i=0,bad=null,shallow=false;
            (function next(){if(i>=list.length||bad||(shallow&&i>0)){done();return}S.forceRepo=nr;realFetch(list[i++],function(res){S.forceRepo=nr;if(res&&res.err)bad=res.err;if(res&&res.shallow)shallow=true;next()},true,DEPTH)})();
            function done(){S.forceRepo=nr;
              if(bad){perr(bad);delete S.repos[root];fsDelete(root);S.forceRepo=null;unlock();render();return}
              var n=nr.list.length;if(n)pl('remote: Enumerating objects: '+n+', done.\nReceiving objects: 100% ('+n+'/'+n+'), done.');
              if(shallow)pl('This repo has a long history: cloned the newest '+DEPTH+' commits of '+def+' only, like  git clone --depth '+DEPTH,'y');
              if(RL.trunc)pl('Big repo: the Mini laptop shows the first 200 files of each commit.','y');
              checkout(nr,nr.remote.br[def]?def:keys(nr.remote.br)[0]);S.forceRepo=null;unlock();render()}})
        }).catch(function(e){perr('fatal: could not read from GitHub ('+((e&&e.message)||'network error')+')');if(nr){delete S.repos[root];fsDelete(root)}S.forceRepo=null;unlock();render()});
        return}
      var src=loc?{cm:loc.cm,remote:{br:loc.br}}:ghSource(url,null),nr2;
      if(loc)url=loc.root;
      if(src){nr2=made();ghCopy(src,nr2)}
      else if(ghKey(url)==='https://github.com/octocat/hello-world'){nr2=made();
        /* GitHub's own tiny public sample repo (it really exists, so the same command works in Real GitHub mode too) */
        var h1={id:rid(),msg:'first commit',p:[],files:{'README':'Hello World!\n'},br:'master',n:++S.n,who:'The Octocat'};nr2.cm[h1.id]=h1;nr2.list.push(h1);nr2.remote.br.master=h1.id}
      else if(ghKey(url)==='https://github.com/roli/website'){nr2=made();
        /* a public demo repo that always exists on the pretend GitHub */
        var f1={'README.md':'# website\nRoli\'s first website.\n'},f2={'README.md':'# website\nRoli\'s first website.\n','index.html':'<h1>Hello</h1>\n'};
        var c1=cfin({id:'',msg:'first commit',p:[],files:f1,br:'main',n:++S.n,who:'Roli'}),c2=cfin({id:'',msg:'add index page',p:[c1.id],files:f2,br:'main',n:++S.n,who:'Roli'});
        [c1,c2].forEach(function(c){nr2.cm[c.id]=c;nr2.list.push(c)});nr2.remote.br.main=c2.id}
      else if(S.ghMade&&S.ghMade[ghKey(url)]){nr2=made()}
      else{perr("remote: Repository not found.\nfatal: repository '"+url.replace(/\/+$/,'')+"/' not found");pl('On this Mini laptop, GitHub only has the repos you made (gh repo create, or Browser > New repository) or pushed to, plus public samples: git clone https://github.com/octocat/Hello-World','y');return}
      var cnt=nr2.list.length;if(cnt)pl('remote: Enumerating objects: '+cnt+', done.\nremote: Counting objects: 100% ('+cnt+'/'+cnt+'), done.\nReceiving objects: 100% ('+cnt+'/'+cnt+'), done.');
      checkout(nr2,nr2.remote.br.main?'main':keys(nr2.remote.br)[0]);return}
    if(!needRepo())return;r=R();
    /* ---------- names for commits, like real Git: HEAD, HEAD~2, HEAD^, main, origin/main, v1.0, or the start of an id ---------- */
    function rev(ref){if(!ref)return null;var m=ref.match(/^(.*?)((?:[~^]\d*)*)$/),b=m[1]||'HEAD',suf=m[2],id=null;
      if(b==='HEAD'||b==='@')id=headId();else if(b in r.br)id=r.br[b];else if(b.indexOf('origin/')===0&&r.rbr&&r.rbr[b.slice(7)])id=r.rbr[b.slice(7)];
      else if(r.tags&&r.tags[b])id=r.tags[b].id;
      else if(/^[0-9a-f]{4,40}$/.test(b)){var hit=r.list.filter(function(c){return !c.hidden&&c.id.indexOf(b.slice(0,7))===0});if(hit.length===1)id=hit[0].id}
      var re=/([~^])(\d*)/g,q;while(id&&(q=re.exec(suf))){var n=q[2]===''?1:+q[2];
        if(q[1]==='~'){for(var i=0;i<n&&id;i++)id=C(id).p[0]||null}else id=n===0?id:(C(id).p[n-1]||null)}
      return id}
    function badRev(x){perr("fatal: ambiguous argument '"+x+"': unknown revision or path not in the working tree.\nUse '--' to separate paths from revisions, like this:\n'git <command> [<revision>...] -- [<file>...]'")}
    function bh(t){if(t==null)return '0000000';var h=2166136261;for(var i=0;i<t.length;i++){h^=t.charCodeAt(i);h=Math.imul(h,16777619)>>>0}return ('0000000'+h.toString(16)).slice(-7)}
    /* a real line-by-line diff (longest common subsequence), shown in hunks with 3 lines of context */
    function diffOne(f,o,n){
      if(isBin(o)||isBin(n)){pr('<b>diff --git a/'+esc(f)+' b/'+esc(f)+'</b>');if(o==null)pr('<b>new file mode 100644</b>');if(n==null)pr('<b>deleted file mode 100644</b>');
        pr('<b>index '+bh(o)+'..'+bh(n)+(o!=null&&n!=null?' 100644':'')+'</b>');pl('Binary files '+(o==null?'/dev/null':'a/'+f)+' and '+(n==null?'/dev/null':'b/'+f)+' differ');return}
      var A=o==null?[]:o.replace(/\n$/,'').split('\n'),B=n==null?[]:n.replace(/\n$/,'').split('\n');if(o==='')A=[];if(n==='')B=[];
      var L=[];for(var i=A.length;i>=0;i--){L[i]=[];for(var j=B.length;j>=0;j--)L[i][j]=i===A.length||j===B.length?0:A[i]===B[j]?L[i+1][j+1]+1:Math.max(L[i+1][j],L[i][j+1])}
      var ops=[],x=0,y=0;while(x<A.length||y<B.length){if(x<A.length&&y<B.length&&A[x]===B[y]){ops.push([' ',A[x],x,y]);x++;y++}else if(x<A.length&&(y===B.length||L[x+1][y]>=L[x][y+1])){ops.push(['-',A[x],x,y]);x++}else{ops.push(['+',B[y],x,y]);y++}}
      pr('<b>diff --git a/'+esc(f)+' b/'+esc(f)+'</b>');
      if(o==null)pr('<b>new file mode 100644</b>');if(n==null)pr('<b>deleted file mode 100644</b>');
      pr('<b>index '+bh(o)+'..'+bh(n)+(o!=null&&n!=null?' 100644':'')+'</b>');pr('<b>--- '+(o==null?'/dev/null':'a/'+esc(f))+'</b>');pr('<b>+++ '+(n==null?'/dev/null':'b/'+esc(f))+'</b>');
      var ch=[];ops.forEach(function(op,k){if(op[0]!==' ')ch.push(k)});var hunks=[],k0=0;
      while(k0<ch.length){var st=Math.max(0,ch[k0]-3),en=ch[k0];while(k0+1<ch.length&&ch[k0+1]-en<=7){k0++;en=ch[k0]}en=Math.min(ops.length-1,en+3);hunks.push([st,en]);k0++}
      hunks.forEach(function(h){var seg=ops.slice(h[0],h[1]+1),oa=seg.filter(function(q){return q[0]!=='+'}).length,nb=seg.filter(function(q){return q[0]!=='-'}).length,os=seg[0][2]+1,ns=seg[0][3]+1;
        pr('<span class="c">@@ -'+(oa?os:os-1)+(oa===1?'':','+oa)+' +'+(nb?ns:ns-1)+(nb===1?'':','+nb)+' @@</span>');
        seg.forEach(function(q){pr(q[0]===' '?' '+esc(q[1]):'<span class="'+(q[0]==='+'?'g':'r')+'">'+q[0]+esc(q[1])+'</span>')})});
      if(o!=null&&n!=null&&o!==''&&n!==''){if(!/\n$/.test(o)||!/\n$/.test(n)){}}}
    function diffTrees(o,n,only){var all={};keys(o).concat(keys(n)).forEach(function(f){all[f]=1});
      keys(all).sort().forEach(function(f){if(only&&only.indexOf(f)<0)return;if(o[f]!==n[f])diffOne(f,f in o?o[f]:null,f in n?n[f]:null)})}
    function showCommit(c){var refs=refsOf(c.id),rs=refs.length?' ('+refs.join(', ')+')':'';
      pr('<span class="y">commit '+fullid(c.id)+'</span><span class="c">'+esc(rs)+'</span>');
      if(c.p.length>1)pl('Merge: '+c.p.join(' '));
      pl('Author: '+c.who+' <'+(c.who==='Roli'?'roli@example.com':(S.cfg.email||'you@example.com'))+'>\nDate:   '+gdate(c)+'\n\n    '+c.msg+'\n')}
    function tracked(){var o={};keys(r.index).forEach(function(f){o[f]=1});keys(headTree()).forEach(function(f){o[f]=1});return o}
    /* make the files on disk match a commit's files (tracked files only; untracked files are left alone) */
    function hardTo(files){var w=work();keys(tracked()).forEach(function(f){if(!(f in files))delete S.files[r.root+'/'+f]});
      keys(files).forEach(function(f){S.files[r.root+'/'+f]=files[f];var d=dirname(r.root+'/'+f);while(d!==r.root&&!S.dirs[d]){S.dirs[d]=1;d=dirname(d)}});r.index=copy(files);r.conf={};r.merge=null}
    if(sub==='rebase'){
      if(a.indexOf('-i')>=0||a.indexOf('--interactive')>=0){perr('error: this Mini laptop has no text editor for git rebase -i (interactive rebase).');pl('Plain  git rebase <branch>  works here.','y');return}
      if(a[1]==='--abort'){if(!r.rebase){perr('fatal: No rebase in progress?');return}setH(r,r.rebase.orig);setWork(copy(C(r.rebase.orig).files));r.rebase=null;return}
      if(a[1]==='--skip'){if(!r.rebase){perr('fatal: No rebase in progress?');return}setWork(copy(headTree()));r.rebase.cur=null;rebaseNext();return}
      if(a[1]==='--continue'){if(!r.rebase){perr('fatal: No rebase in progress?');return}
        if(keys(r.conf).length){perr('error: Committing is not possible because you have unmerged files.\nhint: Fix them up in the work tree, and then use \'git add/rm <file>\'\nhint: as appropriate to mark resolution and make a commit.');keys(r.conf).forEach(function(f){pl(f+': needs merge')});
          perr('You must edit all merge conflicts and then\nmark them as resolved using git add');return}
        var cc=r.rebase.cur&&C(r.rebase.cur);if(cc){var st6=status();if(st6.staged.length){var nc=newCommit(cc.msg,[headId()],copy(r.index),cc.who);setH(r,nc.id);pl('['+'detached HEAD '+nc.id+'] '+cc.msg,'g')}}
        r.rebase.cur=null;rebaseNext();return}
      if(r.rebase){perr('fatal: It seems that there is already a rebase-merge directory, and\nI wonder if you are in the middle of another rebase.\nhint: Use "git rebase --continue", "--skip" or "--abort".');return}
      if(r.merge){perr('error: cannot rebase: You are in the middle of a merge.');return}
      var stR=status();if(stR.staged.length||stR.unstaged.length){perr('error: cannot rebase: You have unstaged changes.\nerror: Please commit or stash them.');return}
      var upR=a.slice(1).filter(function(x){return x[0]!=='-'})[0];
      if(!upR){if(r.rbr&&r.rbr[r.head]){upR='origin/'+r.head}else{perr('fatal: There is no tracking information for the current branch.\nPlease specify which branch you want to rebase against.\n\n    git rebase <branch>');return}}
      var upId=rev(upR);if(!upId){perr("fatal: invalid upstream '"+upR+"'");return}
      rebaseOnto(upId,upR);return}
    if(sub==='ls-files'){var root=r.root,pre=S.cwd===root?'':S.cwd.slice(root.length+1)+'/',stg0=a.indexOf('-s')>=0||a.indexOf('--stage')>=0;
      keys(r.index).sort().forEach(function(f){if(!pre||f.indexOf(pre)===0)pl((stg0?'100644 '+gblob(r.index[f])+' 0\t':'')+f.slice(pre.length))});return}
    /* git cat-file: read an object (commit, tree or blob) the way Git stores it */
    if(sub==='cat-file'){var cf=a.slice(1).filter(function(x){return x[0]!=='-'})[0],mode=a.indexOf('-t')>=0?'t':a.indexOf('-s')>=0?'s':a.indexOf('-p')>=0?'p':null;
      if(!mode||!cf){perr('usage: git cat-file (-t | -s | -p) <object>');return}gitDirSync();
      var hx=null,cid=rev(cf);if(cid)hx=gcommit(r,C(cid));else if(/^[0-9a-f]{4,40}$/.test(cf)){var hits=keys(r.objs||{}).filter(function(h){return h.indexOf(cf)===0});if(hits.length>1){perr('error: short object ID '+cf+' is ambiguous');return}hx=hits[0]||null}
      if(!hx||!GOBJ[hx]){perr('fatal: Not a valid object name '+cf);return}var ob=GOBJ[hx];
      if(mode==='t'){pl(ob.t);return}if(mode==='s'){pl(String(ob.body.length));return}
      if(ob.t==='tree'){var bb=ob.body,i=0;while(i<bb.length){var sp=bb.indexOf(32,i),nul=bb.indexOf(0,sp),h2='';for(var k=nul+1;k<nul+21;k++)h2+=('0'+bb[k].toString(16)).slice(-2);var md=new TextDecoder().decode(bb.subarray(i,sp)),nm=new TextDecoder().decode(bb.subarray(sp+1,nul));
          pl((md==='40000'?'040000 tree ':'100644 blob ')+h2+'\t'+nm);i=nul+21}return}
      var txt=new TextDecoder().decode(ob.body);if(ob.t==='blob'&&/[\u0000-\u0008\u000E-\u001F]/.test(txt.slice(0,4000))){pl('(binary file, '+ob.body.length+' bytes)','y');return}
      pl(txt.replace(/\n$/,''));return}
    if(sub==='diff'){S.ran.diff=1;
      var dd=a.indexOf('--'),flags=a.slice(1,dd<0?a.length:dd).filter(function(x){return x[0]==='-'}),words=a.slice(1,dd<0?a.length:dd).filter(function(x){return x[0]!=='-'}),paths=dd<0?[]:a.slice(dd+1);
      var revs=[];words.forEach(function(x){var id=rev(x);if(id)revs.push(id);else{var f=rel(norm(x));if(f!==null&&(f in work()||f in r.index||f in headTree()))paths.push(x);else revs.push(false),badRev(x)}});
      if(revs.indexOf(false)>=0)return;
      var only=paths.length?paths.map(function(x){return rel(norm(x))}):null,stg=flags.indexOf('--staged')>=0||flags.indexOf('--cached')>=0;
      keys(r.conf).forEach(function(f){if(!only||only.indexOf(f)>=0)pl('* Unmerged path '+f,'r')});
      var wt=function(){var w=work(),o={};keys(tracked()).forEach(function(f){if(f in w&&!r.conf[f])o[f]=w[f]});return o};
      var dStat=flags.indexOf('--stat')>=0,dNames=flags.indexOf('--name-only')>=0,dNS=flags.indexOf('--name-status')>=0;
      if(dStat||dNames||dNS){var diffTrees=function(o,n,on){if(dStat){statTrees(o,n,on);return}var al={};keys(o).concat(keys(n)).forEach(function(f){al[f]=1});
        keys(al).sort().forEach(function(f){if(on&&on.indexOf(f)<0)return;if(o[f]!==n[f])pl(dNS?(!(f in o)?'A':!(f in n)?'D':'M')+'\t'+f:f)})}}
      if(revs.length===2){diffTrees(C(revs[0]).files,C(revs[1]).files,only);return}
      if(revs.length===1){diffTrees(C(revs[0]).files,stg?r.index:wt(),only);return}
      if(stg){diffTrees(headTree(),r.index,only);return}
      var ix={};keys(r.index).forEach(function(f){if(!r.conf[f])ix[f]=r.index[f]});var w2=wt();keys(r.index).forEach(function(f){if(!(f in work()))delete w2[f]});
      diffTrees(ix,w2,only);return}
    if(sub==='show'){var sref=a.slice(1).filter(function(x){return x[0]!=='-'})[0]||'HEAD',sid=rev(sref);
      if(!sid){if(!headId()&&sref==='HEAD'){perr("fatal: your current branch '"+r.head+"' does not have any commits yet");return}badRev(sref);return}
      var tg=r.tags&&r.tags[sref];if(tg&&tg.msg){pl('tag '+sref+'\nTagger: '+tg.who+'\nDate:   Sun Nov 1 23:00:00 2026\n\n'+tg.msg+'\n')}
      var sc=C(sid);showCommit(sc);if(sc.p.length<2){if(a.indexOf('--stat')>=0)statTrees(sc.p.length?C(sc.p[0]).files:{},sc.files);else diffTrees(sc.p.length?C(sc.p[0]).files:{},sc.files)}S.ran.show=1;return}
    if(sub==='reset'){
      var mode=a.indexOf('--hard')>=0?'hard':a.indexOf('--soft')>=0?'soft':a.indexOf('--mixed')>=0?'mixed':'',rw=a.slice(1).filter(function(x){return x[0]!=='-'}),tgt=null,rpaths=[];
      rw.forEach(function(x,i){var id=i===0?rev(x):null;if(id)tgt=id;else rpaths.push(x)});
      if(rpaths.length){if(mode==='hard'||mode==='soft'){var nf=rpaths.filter(function(x){var f=rel(norm(x));return f===null||!(f in r.index||f in headTree()||f in work())})[0];if(nf){badRev(nf);return}perr('fatal: Cannot do '+mode+' reset with paths.');return}
        var ht=tgt?C(tgt).files:headTree(),bad=null;rpaths.forEach(function(x){var f=rel(norm(x));if(f===null||!(f in r.index||f in ht||f in work())){bad=x;return}if(f in ht)r.index[f]=ht[f];else delete r.index[f];delete r.conf[f]});
        if(bad){badRev(bad);return}var us=status().unstaged;if(us.length)pl('Unstaged changes after reset:\n'+us.map(function(u){return (u[1]==='deleted'?'D':'M')+'\t'+u[0]}).join('\n'));return}
      if(!headId()){perr("fatal: your current branch '"+r.head+"' does not have any commits yet");return}
      if(!tgt){if(rw.length){badRev(rw[0]);return}tgt=headId()}
      var tc=C(tgt);setH(r,tgt);
      if(mode==='soft'){r.merge=null;return}
      if(mode==='hard'){hardTo(copy(tc.files));pl('HEAD is now at '+tc.id+' '+tc.msg);S.ran.reset=1;return}
      r.index=copy(tc.files);r.conf={};r.merge=null;var us2=status().unstaged;if(us2.length)pl('Unstaged changes after reset:\n'+us2.map(function(u){return (u[1]==='deleted'?'D':'M')+'\t'+u[0]}).join('\n'));S.ran.reset=1;return}
    if(sub==='stash'){r.stash=r.stash||[];var act=a[1]||'push',idx=0;var sa=a.slice(2).filter(function(x){return /^stash@\{\d+\}$/.test(x)||/^\d+$/.test(x)})[0];if(sa)idx=+(sa.match(/\d+/)[0]);
      if(act==='-u'||act==='--include-untracked'||act==='-m'||act==='save'){a.splice(1,0,'push');act='push'}
      if(act==='push'){if(!headId()){perr("You do not have the initial commit yet");return}
        var mi2=a.indexOf('-m'),smsg=mi2>=0?a[mi2+1]:null,inclU=a.indexOf('-u')>=0||a.indexOf('--include-untracked')>=0,w=work(),h=headTree(),tr=tracked(),ent={base:headId(),branch:r.head,work:{},index:{},msg:smsg},any=false;
        keys(tr).forEach(function(f){var wv=f in w?w[f]:null,iv=f in r.index?r.index[f]:null,hv=f in h?h[f]:null;if(wv!==hv||iv!==hv||r.conf[f]){ent.work[f]=wv;ent.index[f]=iv;any=true}});
        var unt=inclU?status().untracked:[];unt.forEach(function(f){ent.work[f]=w[f];ent.index[f]=null;any=true});
        if(!any){pl('No local changes to save');return}
        if(r.conf&&keys(r.conf).length){perr('error: could not write index');pl('Fix the merge conflict first (git add, git commit), then stash.','y');return}
        hardTo(copy(h));unt.forEach(function(f){delete S.files[r.root+'/'+f]});
        var bc=C(ent.base);ent.label=(smsg?'On '+(r.det?'(no branch)':r.head)+': '+smsg:'WIP on '+(r.det?'(no branch)':r.head)+': '+bc.id+' '+bc.msg);ent.id=rid();r.stash.unshift(ent);
        pl('Saved working directory and index state '+ent.label);S.ran.stash=1;return}
      if(act==='list'){r.stash.forEach(function(e,i){pl('stash@{'+i+'}: '+e.label)});return}
      var e=r.stash[idx];if(act==='clear'){r.stash=[];return}
      if(!e){perr(r.stash.length?'error: stash@{'+idx+'} is not a valid reference':'No stash entries found.');return}
      if(act==='drop'){r.stash.splice(idx,1);pl('Dropped refs/stash@{'+idx+'} ('+fullid(e.id)+')');return}
      if(act==='show'){var sb0=C(e.base).files,so={},sn={};keys(e.work).forEach(function(f){if(!(f in sb0)&&e.index[f]==null)return;if(f in sb0)so[f]=sb0[f];if(e.work[f]!=null)sn[f]=e.work[f]});statTrees(so,sn);return}
      if(act==='pop'||act==='apply'){var w3=work(),h3=headTree(),base3=C(e.base).files,clash=[];
        keys(e.work).forEach(function(f){var cur=f in w3?w3[f]:null,iv=f in r.index?r.index[f]:(f in h3?h3[f]:null);if(cur!==iv||(f in r.index&&r.index[f]!==(f in h3?h3[f]:undefined)))clash.push(f)});
        if(clash.length){perr('error: Your local changes to the following files would be overwritten by merge:\n'+clash.map(function(f){return '\t'+f}).join('\n')+'\nPlease commit your changes or stash them before you merge.\nAborting');git(['status']);pl('The stash entry is kept in case you need it again.');return}
        var cf=[];keys(e.work).forEach(function(f){var bs=f in base3?base3[f]:null,ou=f in h3?h3[f]:null,th=e.work[f],res;
          if(ou===bs)res=th;else if(th===bs)res=ou;else if(ou===th)res=ou;else{cf.push(f);res='<<<<<<< Updated upstream\n'+(ou||'')+'=======\n'+(th||'')+'>>>>>>> Stashed changes\n'}
          if(res==null)delete S.files[r.root+'/'+f];else{S.files[r.root+'/'+f]=res;var d=dirname(r.root+'/'+f);while(d!==r.root&&!S.dirs[d]){S.dirs[d]=1;d=dirname(d)}}
          if(!(f in base3)&&e.index[f]!=null&&cf.indexOf(f)<0)r.index[f]=res});
        cf.forEach(function(f){r.conf[f]=1;pl('Auto-merging '+f+'\nCONFLICT (content): Merge conflict in '+f,'r')});
        if(cf.length){pl('The stash entry is kept in case you need it again.');return}
        git(['status']);if(act==='pop'){r.stash.splice(idx,1);pl('Dropped refs/stash@{'+idx+'} ('+fullid(e.id)+')')}S.ran.stash=1;return}
      perr("error: unknown subcommand: '"+act+"'\nusage: git stash list | show | drop | pop | apply | push [-m <message>] [-u]");return}
    if(sub==='tag'){r.tags=r.tags||{};var ta=a.indexOf('-a')>=0,tdel=a.indexOf('-d')>=0,tmi=a.indexOf('-m'),tmsg=tmi>=0?a[tmi+1]:null,tw=a.slice(1).filter(function(x,i){return x[0]!=='-'&&!(tmi>=0&&i+1===tmi+1)});
      if(a.indexOf('-l')>=0||a.indexOf('--list')>=0||!tw.length){keys(r.tags).sort().forEach(function(t){pl(t)});return}
      var tn2=tw[0];
      if(tdel){if(!r.tags[tn2]){perr("error: tag '"+tn2+"' not found.");return}pl("Deleted tag '"+tn2+"' (was "+r.tags[tn2].id+")");delete r.tags[tn2];return}
      if(r.tags[tn2]){perr("fatal: tag '"+tn2+"' already exists");return}
      if(!/^[A-Za-z0-9._\/-]+$/.test(tn2)||/\.\.|^[.\/-]|\/$|\.lock$/.test(tn2)){perr("fatal: '"+tn2+"' is not a valid tag name.");return}
      var tid=tw[1]?rev(tw[1]):headId();if(!tid){if(!tw[1]){perr("fatal: Failed to resolve 'HEAD' as a valid ref.");return}badRev(tw[1]);return}
      if((ta||tmsg)&&!tmsg){perr('fatal: no tag message given. Use  git tag -a '+tn2+' -m "message"');return}
      r.tags[tn2]={id:tid,msg:tmsg,who:(S.cfg.name||'you')+' <'+(S.cfg.email||'you@example.com')+'>'};S.ran.tag=1;return}
    if(sub==='mv'){var mw=a.slice(1).filter(function(x){return x[0]!=='-'});if(mw.length<2){perr('usage: git mv <source> <destination>');return}
      var sa2=norm(mw[0]),da2=norm(mw[1]),sf=rel(sa2);if(S.dirs[da2])da2=da2+'/'+base(sa2);var df=rel(da2);
      if(sf===null||df===null){perr('fatal: '+mw[0]+' is outside the repository');return}
      if(!exists(sa2)){perr('fatal: bad source, source='+sf+', destination='+df);return}
      var moved=S.dirs[sa2]?keys(r.index).filter(function(f){return f.indexOf(sf+'/')===0}):(sf in r.index?[sf]:[]);
      if(!moved.length){perr('fatal: not under version control, source='+sf+', destination='+df);return}
      if(exists(da2)){perr('fatal: destination exists, source='+sf+', destination='+df);return}
      if(!S.dirs[dirname(da2)]){perr('fatal: renaming \''+sf+'\' failed: No such file or directory');return}
      var rr=fsRename(sa2,da2);if(rr.err){perr('fatal: '+rr.err.replace(/<[^>]+>/g,''));return}
      moved.forEach(function(f){var nf=df+f.slice(sf.length);r.index[nf]=r.index[f];delete r.index[f]});S.ran.mv=1;return}
    if(sub==='status'){
      S.ran.status=1;if(S.files[R().root+'/.gitignore'])S.ran.stat2=1;var st=status(),o=[r.det?'HEAD detached '+(r.det===r.detFrom?'at ':'from ')+r.detName:'On branch '+r.head];
      var tk=track();
      var sShort=a.some(function(x){return x==='-s'||x==='--short'||/^-(sb|bs)$/.test(x)}),sBr=a.some(function(x){return x==='-b'||x==='--branch'||/^-(sb|bs)$/.test(x)});
      if(sShort){var hT0=headTree(),codes={},ren={},goneS=st.staged.filter(function(x){return x[1]==='deleted'});
        st.staged.forEach(function(x){if(x[1]==='new file'){var src=goneS.filter(function(g){return !ren[g[0]]&&hT0[g[0]]===r.index[x[0]]})[0];if(src){ren[src[0]]=x[0];codes[x[0]]=['R',' ',src[0]]}}});
        st.staged.forEach(function(x){if(codes[x[0]]||ren[x[0]])return;codes[x[0]]=[{'new file':'A',modified:'M',deleted:'D'}[x[1]],' ']});
        st.unstaged.forEach(function(x){if(!codes[x[0]])codes[x[0]]=[' ',' '];codes[x[0]][1]=x[1]==='deleted'?'D':'M'});
        st.conf.forEach(function(f){codes[f]=['U','U']});
        if(sBr){var bl='## '+(r.det?'HEAD (no branch)':(headId()?'':'No commits yet on ')+r.head);if(tk){bl+='...'+tk.o;var ab=[];if(tk.ah)ab.push('ahead '+tk.ah);if(tk.bh)ab.push('behind '+tk.bh);if(ab.length)bl+=' ['+ab.join(', ')+']'}pr('<span class="g">'+esc(bl)+'</span>')}
        keys(codes).sort().forEach(function(f){var c=codes[f];pr('<span class="g">'+c[0]+'</span><span class="r">'+c[1]+'</span> '+esc(c[2]?c[2]+' -> '+f:f))});
        st.untracked.forEach(function(f){pr('<span class="r">??</span> '+esc(f))});return}
      if(tk){if(!tk.ah&&!tk.bh)o.push("Your branch is up to date with '"+tk.o+"'.");
        else if(!tk.ah)o.push("Your branch is behind '"+tk.o+"' by "+cmt(tk.bh)+', and can be fast-forwarded.\n  (use "git pull" to update your local branch)');
        else if(!tk.bh)o.push("Your branch is ahead of '"+tk.o+"' by "+cmt(tk.ah)+'.\n  (use "git push" to publish your local commits)');
        else o.push("Your branch and '"+tk.o+"' have diverged,\nand have "+tk.ah+' and '+tk.bh+' different commits each, respectively.\n  (use "git pull" if you want to integrate the remote branch with yours)')}
      if(S.mate1&&!S.ran.f1)S.ran.st1=1;if(S.ran.f1&&tk&&tk.bh)S.ran.st2=1;
      if(!headId())o.push('\nNo commits yet');
      if(r.rebase){o.push('interactive rebase in progress; onto '+r.rebase.onto+'\nYou are currently rebasing branch \''+r.head+'\' on \''+r.rebase.onto+'\'.\n  (fix conflicts and then run "git rebase --continue")\n  (use "git rebase --skip" to skip this patch)\n  (use "git rebase --abort" to check out the original branch)')}
      else if(r.merge&&r.merge.revert){o.push('You are currently reverting commit '+(r.merge.rid||'')+'.\n'+(st.conf.length?'  (fix conflicts and run "git revert --continue")':'  (all conflicts fixed: run "git revert --continue")')+'\n  (use "git revert --skip" to skip this patch)\n  (use "git revert --abort" to cancel the revert operation)');
        if(st.conf.length){o.push('\nUnmerged paths:\n  (use "git restore --staged <file>..." to unstage)\n  (use "git add <file>..." to mark resolution)');st.conf.forEach(function(f){o.push('\tboth modified:   '+f)})}}
      else if(r.merge&&!st.conf.length){o.push('All conflicts fixed but you are still merging.\n  (use "git commit" to conclude merge)')}
      else if(r.merge||st.conf.length){o.push('You have unmerged paths.\n  (fix conflicts and run "git commit")'+(r.merge?'\n  (use "git merge --abort" to abort the merge)':''));
        if(st.conf.length){o.push('\nUnmerged paths:\n  (use "git add <file>..." to mark resolution)');st.conf.forEach(function(f){o.push('\tboth modified:   '+f)})}}
      if(st.staged.length){o.push('\nChanges to be committed:'+(r.merge?'':!headId()?'\n  (use "git rm --cached <file>..." to unstage)':'\n  (use "git restore --staged <file>..." to unstage)'));
        var hT=headTree(),gone=st.staged.filter(function(x){return x[1]==='deleted'}),used={};
        st.staged.forEach(function(x){if(x[1]==='new file'){var src=gone.filter(function(g){return !used[g[0]]&&hT[g[0]]===r.index[x[0]]})[0];if(src){used[src[0]]=1;x.ren=src[0]}}});
        st.staged.forEach(function(x){if(x[1]==='deleted'&&used[x[0]])return;o.push(x.ren?'\trenamed:    '+x.ren+' -> '+x[0]:'\t'+x[1]+':   '+x[0])})}
      if(st.unstaged.length){o.push('\nChanges not staged for commit:\n  (use "git add'+(st.unstaged.some(function(x){return x[1]==='deleted'})?'/rm':'')+' <file>..." to update what will be committed)\n  (use "git restore <file>..." to discard changes in working directory)');st.unstaged.forEach(function(x){o.push('\t'+x[1]+':   '+x[0])})}
      if(st.untracked.length){o.push('\nUntracked files:\n  (use "git add <file>..." to include in what will be committed)');st.untracked.forEach(function(f){o.push('\t'+f)})}
      if(!st.staged.length&&!st.unstaged.length&&!st.untracked.length&&!st.conf.length)o.push(headId()?'nothing to commit, working tree clean':'nothing to commit (create/copy files and use "git add" to track)');
      else if(!st.staged.length)o.push(st.untracked.length&&!st.unstaged.length&&!st.conf.length?'\nnothing added to commit but untracked files present (use "git add" to track)':'\nno changes added to commit (use "git add" and/or "git commit -a")');
      var txt=o.join('\n');txt.split('\n').forEach(function(l){var c=''; if(/^\t/.test(l)){c=/new file|modified|deleted/.test(l)&&txt.indexOf('Changes to be committed')>=0&&txt.indexOf(l)<txt.indexOf('Changes not staged')+0.1&&false?'':''}
        pr('<span class="'+(/^\t/.test(l)?(statusColor(l,txt)):'')+'">'+(esc(l)||'&nbsp;')+'</span>')});return}
    if(sub==='add'){
      var w=work(),args=a.slice(1),force=false,upd=false,badOpt=null;
      args=args.filter(function(x){if(x==='-f'||x==='--force'){force=true;return false}if(x==='-u'||x==='--update'){upd=true;return false}if(x==='-v'||x==='--verbose'||x==='--')return false;
        if(x[0]==='-'&&x!=='-A'&&x!=='--all'&&!badOpt)badOpt=x;return true});
      if(badOpt){perr(badOpt==='-p'||badOpt==='--patch'||badOpt==='-i'?"error: interactive git add is not available on the Mini laptop: stage whole files with  git add <file>":"error: unknown "+(badOpt[1]==='-'?"option `"+badOpt.slice(2):"switch `"+badOpt.slice(1))+"'\nusage: git add [<options>] [--] <pathspec>...");return}
      /* -u: every tracked file that changed or was deleted (new files stay untracked) */
      if(upd){var up0=args.length?args.map(function(x){return rel(norm(x))}):null;keys(r.index).forEach(function(f){if(up0&&!up0.some(function(q){return q===''||q===f||f.indexOf(q+'/')===0}))return;if(f in w)r.index[f]=w[f];else delete r.index[f];delete r.conf[f]});return}
      if(!args.length){perr('Nothing specified, nothing added.\nhint: Maybe you wanted to say \'git add .\'?\nhint: Turn this message off by running\nhint: "git config advice.addEmptyPathspec false"');return}
      var did=false,ign=[];
      args.forEach(function(x){
        if(x==='.'||x==='-A'||x==='--all'){keys(w).forEach(function(f){if(!ignored(f)||f in r.index){r.index[f]=w[f];did=true}});keys(r.index).forEach(function(f){if(!(f in w)){delete r.index[f];did=true}});keys(r.conf).forEach(function(f){delete r.conf[f]})}
        else{var f=rel(norm(x));
          /* a folder: everything inside it (new, changed and deleted files), like real Git: git add notes */
          if(f!==null&&S.dirs[norm(x)]&&!(f in w)){var pre=f===''?'':f+'/',hit=0;
            keys(w).forEach(function(k){if(k.indexOf(pre)===0&&(!ignored(k)||k in r.index)){r.index[k]=w[k];delete r.conf[k];hit++}});
            keys(r.index).forEach(function(k){if(k.indexOf(pre)===0&&!(k in w)){delete r.index[k];hit++}});
            if(hit)did=true;return}
          if(f===null||(!(f in w)&&!(f in r.index))){perr("fatal: pathspec '"+x+"' did not match any files");return}
          if(f in w&&ignored(f)&&!(f in r.index)&&!force){ign.push(x);return}
          if(f in w){r.index[f]=w[f]}else delete r.index[f];delete r.conf[f];did=true}});
      if(ign.length)perr('The following paths are ignored by one of your .gitignore files:\n'+ign.join('\n')+'\nhint: Use -f if you really want to add them.\nhint: Turn this message off by running\nhint: "git config advice.addIgnoredFile false"');
      return}
    if(sub==='rm'){
      var tg=a.slice(1).filter(function(x){return x[0]!=='-'});if(!tg.length){perr('usage: git rm [-r] <file>');return}
      var all=tg.indexOf('.')>=0||tg.indexOf('*')>=0,done=0,cached=a.indexOf('--cached')>=0,recur=a.some(function(x){return /^-[a-z]*r[a-z]*$/.test(x)});
      /* a folder needs -r, like real Git */
      var dirArg=tg.filter(function(x){var q=rel(norm(x));return q!==null&&q!==''&&!(q in r.index)&&keys(r.index).some(function(f){return f.indexOf(q+'/')===0})})[0];
      if((dirArg||tg.indexOf('.')>=0)&&!recur){perr("fatal: not removing '"+(dirArg||'.')+"' recursively without -r");return}
      var hitF=keys(r.index).filter(function(f){return all||tg.some(function(x){var q=rel(norm(x));return q===f||(q!==null&&f.indexOf(q+'/')===0)})}),frc=a.some(function(x){return x==='-f'||x==='--force'||/^-[a-z]*f[a-z]*$/.test(x)}),hT1=headTree(),w6=work();
      if(!cached&&!frc){var stg2=hitF.filter(function(f){return r.index[f]!==hT1[f]}),loc=hitF.filter(function(f){return f in w6&&w6[f]!==r.index[f]&&r.index[f]===hT1[f]});
        if(stg2.length){perr('error: the following file'+(stg2.length>1?'s have':' has')+' changes staged in the index:\n'+stg2.map(function(f){return '    '+f}).join('\n')+'\n(use --cached to keep the file, or -f to force removal)');return}
        if(loc.length){perr('error: the following file'+(loc.length>1?'s have':' has')+' local modifications:\n'+loc.map(function(f){return '    '+f}).join('\n')+'\n(use --cached to keep the file, or -f to force removal)');return}}
      hitF.forEach(function(f){delete r.index[f];if(!cached)delete S.files[r.root+'/'+f];delete r.conf[f];pl("rm '"+f+"'");done++});
      if(!done)perr("fatal: pathspec '"+tg[0]+"' did not match any files");
      else if(cached)pl('Git stopped tracking '+(done===1?'it':'them')+', but the file'+(done===1?' is':'s are')+' still on your laptop (now untracked).\nAdd '+(done===1?'it':'them')+' to .gitignore so git add . does not pick '+(done===1?'it':'them')+' up again, then commit and push.','y');
      else pl('Now run: git commit -m "Remove files"  then  git push','y');return}
    function hardTo0(files){keys(headTree()).concat(keys(r.index)).forEach(function(f){if(!(f in files))delete S.files[r.root+'/'+f]});keys(files).forEach(function(f){S.files[r.root+'/'+f]=files[f]});r.index=copy(files);r.conf={};r.merge=null}
    if(sub==='revert'){
      if(a[1]==='--continue'){if(!r.merge||!r.merge.revert){perr('error: no cherry-pick or revert in progress');return}git(['commit']);return}
      if(a[1]==='--abort'){if(!r.merge||!r.merge.revert){perr('error: no cherry-pick or revert in progress');return}hardTo0(headTree());pl('Revert aborted.');return}
      /* -m 1 (or -m1): for a merge commit, which parent is the main line to go back to */
      var mi3=a.findIndex(function(x){return x==='-m'||x==='--mainline'||/^-m\d+$/.test(x)}),ml=null;
      if(mi3>=0){var mv=/^-m\d+$/.test(a[mi3])?a[mi3].slice(2):a[mi3+1];if(!/^\d+$/.test(mv||'')){perr("error: option `mainline' expects a number greater than zero");return}ml=+mv;if(ml<1){perr("error: option `mainline' expects a number greater than zero");return}}
      var rref=a.slice(1).filter(function(x,i){return x[0]!=='-'&&!(mi3>=0&&i+1===mi3+1&&!/^-m\d+$/.test(a[mi3]))})[0];if(!rref){perr('usage: git revert [-m <parent-number>] <commit>');return}
      if(!headId()){perr('fatal: bad revision \''+rref+'\'');return}
      var rid0=rev(rref);if(!rid0){perr("fatal: bad revision '"+rref+"'");return}
      var cc=C(rid0);if(cc.p.length>1&&!ml){perr('error: commit '+fullid(cc.id)+' is a merge but no -m option was given.\nfatal: revert failed');pl('Tip: git revert -m 1 '+cc.id+'  keeps the branch you merged into (parent 1) and undoes what the merge brought in.','y');return}
      if(ml&&cc.p.length<2){perr('error: mainline was specified but commit '+fullid(cc.id)+' is not a merge.\nfatal: revert failed');return}
      if(ml&&ml>cc.p.length){perr('error: commit '+fullid(cc.id)+' does not have parent '+ml+'\nfatal: revert failed');return}
      var st5=status();if(st5.staged.length||st5.unstaged.length||st5.conf.length){perr('error: your local changes would be overwritten by revert.\nhint: commit your changes or stash them to proceed.\nfatal: revert failed');return}
      var bt=cc.files,tt=cc.p.length?C(cc.p[ml?ml-1:0]).files:{},ot=headTree(),res={},conf=[],all={};keys(bt).concat(keys(tt),keys(ot)).forEach(function(k){all[k]=1});
      keys(all).forEach(function(f){var x=bt[f],o=ot[f],t=tt[f];if(o===t){if(o!==undefined)res[f]=o}else if(o===x){if(t!==undefined)res[f]=t}else if(t===x){if(o!==undefined)res[f]=o}else{conf.push(f);res[f]='<<<<<<< HEAD\n'+(o||'')+'=======\n'+(t||'')+'>>>>>>> parent of '+cc.id+' ('+cc.msg+')\n'}});
      var rmsg='Revert "'+cc.msg+'"';
      if(conf.length){keys(res).forEach(function(f){S.files[r.root+'/'+f]=res[f]});keys(ot).forEach(function(f){if(!(f in res))delete S.files[r.root+'/'+f]});
        keys(res).forEach(function(f){if(conf.indexOf(f)<0)r.index[f]=res[f]});conf.forEach(function(f){r.conf[f]=1});r.merge={other:null,revert:true,msg:rmsg,rid:cc.id};
        perr('error: could not revert '+cc.id+'... '+cc.msg+'\nhint: After resolving the conflicts, mark them with\nhint: "git add/rm <pathspec>", then run\nhint: "git revert --continue".');return}
      var ds=diffStat(ot,res);keys(ot).forEach(function(f){if(!(f in res))delete S.files[r.root+'/'+f]});keys(res).forEach(function(f){S.files[r.root+'/'+f]=res[f]});r.index=copy(res);
      var rc=newCommit(rmsg,[headId()],res);setH(r,rc.id);S.reverted=1;
      pl('['+hName(r)+' '+rc.id+'] '+rmsg,'g');pl(statLine(ds));return}
    if(sub==='restore'){
      var stg=a.indexOf('--staged')>=0,fs=a.slice(1).filter(function(x){return x[0]!=='-'});
      fs.forEach(function(x){var f=rel(norm(x));if(f===null)return;
        if(stg){var h=headTree();if(f in h)r.index[f]=h[f];else delete r.index[f]}
        else{if(f in r.index)S.files[r.root+'/'+f]=r.index[f];else perr("error: pathspec '"+x+"' did not match any file(s) known to git")}});return}
    if(sub==='commit'){
      /* -a (also written -am "msg"): stage every change to files Git already tracks first (new files still need git add) */
      var all2=a.some(function(x){return x==='-a'||x==='--all'||/^-a+m$/.test(x)||x==='-am'});
      var mi=a.findIndex(function(x){return x==='-m'||x==='-am'||x==='--message'}),msg=mi>=0?a[mi+1]:null;
      if(!S.cfg.name||!S.cfg.email){
        /* word for word what real Git prints */
        pl('Author identity unknown\n\n*** Please tell me who you are.\n\nRun\n\n  git config --global user.email "you@example.com"\n  git config --global user.name "Your Name"\n\nto set your account\'s default identity.\nOmit --global to set the identity only in this repository.\n');
        perr("fatal: unable to auto-detect email address (got 'you@laptop.(none)')");
        window.gitPop&&window.gitPop('err','ERROR','Git does not know who you are yet.<br>Run these two commands first:<br><code>git config --global user.name "Your Name"</code><br><code>git config --global user.email "you@example.com"</code>');return}
      if(keys(r.conf).length){perr('error: Committing is not possible because you have unmerged files.\nhint: Fix them up, then use \'git add <file>\' to mark them resolved.');return}
      if(all2){var w5=work();keys(r.index).forEach(function(f){if(!(f in w5))delete r.index[f];else r.index[f]=w5[f]});keys(headTree()).forEach(function(f){if(f in w5&&!(f in r.index)&&!r.conf[f])r.index[f]=w5[f]})}
      var st2=status(),merging=!!r.merge;
      if(a.indexOf('--amend')>=0){if(!headId()){perr('fatal: You have nothing to amend.');return}if(merging){perr('fatal: You are in the middle of a merge -- cannot amend.');return}
        var oc=C(headId()),am=msg||oc.msg,pt=oc.p.length?C(oc.p[0]).files:{},nc=newCommit(am,oc.p.slice(),copy(r.index));setH(r,nc.id);var ds0=diffStat(pt,nc.files);
        pl('['+hName(r)+(oc.p.length?' ':' (root-commit) ')+nc.id+'] '+am,'g');pl(' Date: '+gdate(oc));pl(statLine(ds0));ds0.created.forEach(function(f){pl(' create mode 100644 '+f)});(ds0.deleted||[]).forEach(function(f){pl(' delete mode 100644 '+f)});return}
      if(!msg&&!merging){perr('Aborting commit due to empty commit message.\nTip: use  git commit -m "your message"');return}
      if(!st2.staged.length&&!merging){pl('On branch '+r.head+'\n'+(st2.untracked.length?'nothing added to commit but untracked files present (use "git add" to track)':'nothing to commit, working tree clean'));return}
      var first=!headId(),ot=headTree(),parents=first?[]:[headId()];
      if(merging&&r.merge.other)parents.push(r.merge.other);
      var m=msg||r.merge.msg,c=newCommit(m,parents,copy(r.index));setH(r,c.id);r.merge=null;
      var ds=diffStat(ot,c.files);if(merging)S.merged=true;
      pl('['+hName(r)+(first?' (root-commit) ':' ')+c.id+'] '+m,'g');if(merging)return;
      var rn=[],usedD={};ds.created.forEach(function(f){var g=(ds.deleted||[]).filter(function(d){return !usedD[d]&&ot[d]===c.files[f]})[0];if(g){usedD[g]=1;rn.push([g,f])}});
      if(rn.length){var ot2=copy(ot);rn.forEach(function(x){ot2[x[1]]=ot2[x[0]];delete ot2[x[0]]});ds=diffStat(ot2,c.files);ds.files+=rn.length}
      pl(ds.ins||ds.del?statLine(ds):' '+ds.files+' file'+(ds.files===1?'':'s')+' changed, 0 insertions(+), 0 deletions(-)');
      ds.created.forEach(function(f){pl(' create mode 100644 '+f)});(ds.deleted||[]).forEach(function(f){pl(' delete mode 100644 '+f)});rn.forEach(function(x){pl(' rename '+x[0]+' => '+x[1]+' (100%)')});return}
    if(sub==='log'){
      S.ran.log=1;if(!headId()){perr("fatal: your current branch '"+r.head+"' does not have any commits yet");return}
      var one=a.indexOf('--oneline')>=0,patch=a.indexOf('-p')>=0||a.indexOf('--patch')>=0||a.indexOf('-u')>=0,stat=a.indexOf('--stat')>=0,graph=a.indexOf('--graph')>=0,lim=Infinity,tips=[],la=a.slice(1),lpaths=[];
      for(var li=0;li<la.length;li++){var o1=la[li],mm;
        if((mm=o1.match(/^-(\d+)$/))||(mm=o1.match(/^-n(\d+)$/))||(mm=o1.match(/^--max-count=(\d+)$/)))lim=+mm[1];
        else if(o1==='-n'||o1==='--max-count'){if(!/^\d+$/.test(la[li+1]||'')){perr("fatal: '"+(la[li+1]||'')+"': not an integer");return}lim=+la[++li]}
        else if(o1==='--all'){keys(r.br).forEach(function(b){if(r.br[b])tips.push(r.br[b])});keys(r.rbr||{}).forEach(function(b){tips.push(r.rbr[b])});if(headId())tips.push(headId())}
        else if(o1==='--'){lpaths=lpaths.concat(la.slice(li+1));break}
        else if(o1[0]!=='-'&&!rev(o1)&&(function(){var f=rel(norm(o1));return f!==null&&(f in work()||f in r.index||keys(r.cm).some(function(k){return f in r.cm[k].files}))})()){lpaths.push(o1)}
        else if(o1[0]!=='-'){var tid=rev(o1);if(!tid){perr("fatal: ambiguous argument '"+o1+"': unknown revision or path not in the working tree.\nUse '--' to separate paths from revisions, like this:\n'git <command> [<revision>...] -- [<file>...]'");return}tips.push(tid)}}
      if(!tips.length)tips.push(headId());
      var seenL={},list=[];tips.forEach(function(t){reach(t).forEach(function(c){if(!seenL[c.id]){seenL[c.id]=1;list.push(c)}})});
      list.sort(function(x,y){return y.n-x.n});
      if(lpaths.length){var lp=lpaths.map(function(x){return rel(norm(x))});list=list.filter(function(c){var pf=c.p.length?C(c.p[0]).files:{};return lp.some(function(q){return keys(c.files).concat(keys(pf)).some(function(f){return (f===q||f.indexOf(q+'/')===0)&&c.files[f]!==pf[f]})})})}
      if(graph){var inSet={},indeg={};list.forEach(function(c){inSet[c.id]=c;indeg[c.id]=0});list.forEach(function(c){c.p.forEach(function(q){if(inSet[q])indeg[q]++})});
        var stk=list.filter(function(c){return !indeg[c.id]}).sort(function(x,y){return x.n-y.n}),topo=[];
        while(stk.length){var tc=stk.pop();topo.push(tc);tc.p.forEach(function(q){if(inSet[q]&&--indeg[q]===0)stk.push(inSet[q])})}list=topo}
      if(lim<list.length)list=list.slice(0,lim);
      /* --graph: the lines on the left, like real Git (one column per line of history) */
      var cols=[],inL={};list.forEach(function(c){inL[c.id]=1});
      function gl(t){pr('<span class="c">'+t+'</span>')}
      list.forEach(function(c,i){var refs=refsOf(c.id),rs=refs.length?' ('+refs.join(', ')+')':'',gp='',ci=0;
        if(graph){ci=cols.indexOf(c.id);if(ci<0){cols.push(c.id);ci=cols.length-1}gp=cols.map(function(x,k){return k===ci?'*':'|'}).join(' ')+(c.p.length>1?'   ':' ')}
        var cont=graph?cols.map(function(x,k){return '|'}).join(' ')+' ':'';
        if(one){pr('<span class="c">'+gp+'</span><span class="y">'+c.id+'</span><span class="c">'+esc(rs)+'</span> '+esc(c.msg))}
        else{pr('<span class="c">'+gp+'</span><span class="y">commit '+fullid(c.id)+'</span><span class="c">'+esc(rs)+'</span>');
          if(c.p.length>1)pl(cont+'Merge: '+c.p.join(' '));
          pl((cont+'Author: '+c.who+' <'+(c.who==='Roli'?'roli@example.com':(S.cfg.email||'you@example.com'))+'>\nDate:   '+gdate(c)+'\n\n    '+c.msg).split('\n').join('\n'+cont))}
        if((patch||stat)&&c.p.length<2){if(!one)pl(cont);if(stat)statTrees(c.p.length?C(c.p[0]).files:{},c.files);else diffTrees(c.p.length?C(c.p[0]).files:{},c.files)}
        if(graph){var ps=c.p.filter(function(x){return inL[x]});
          if(!ps.length)cols.splice(ci,1);else{cols[ci]=ps[0];
            if(ps.length>1&&cols.indexOf(ps[1])<0){cols.splice(ci+1,0,ps[1]);gl(cols.map(function(x,k){return k<ci?'|':k===ci?'|\\':k===ci+1?null:'\\'}).filter(function(x){return x!==null}).join(' '))}}
          /* two lines that reach the same commit join up: |/ */
          for(var k=cols.length-1;k>0;k--){var j=cols.indexOf(cols[k]);if(j<k){gl(cols.slice(0,k).map(function(){return '|'}).join(' ')+'/'+cols.slice(k+1).map(function(){return ' /'}).join(''));cols.splice(k,1)}}}
        if(!one&&i<list.length-1)pl(graph?cols.map(function(){return '|'}).join(' '):'')});return}
    if(sub==='branch'){
      var da=a.indexOf('-d')>=0||a.indexOf('-D')>=0,names=a.slice(1).filter(function(x){return x[0]!=='-'});
      if(da){var n=names[0];if(!n){perr('fatal: branch name required');return}if(!(n in r.br)){perr("error: branch '"+n+"' not found");return}
        if(n===r.head&&!r.det){perr("error: cannot delete branch '"+n+"' used by worktree at '"+r.root+"'");return}
        var tip=r.br[n];if(tip&&a.indexOf('-D')<0&&!anc(headId())[tip]){perr("error: the branch '"+n+"' is not fully merged.\nIf you are sure you want to delete it, run 'git branch -D "+n+"'");return}
        delete r.br[n];pl("Deleted branch "+n+" (was "+tip+").");return}
      var su=a.filter(function(x){return /^--set-upstream-to=|^-u$/.test(x)})[0];
      if(su){var tgt=su==='-u'?a[a.indexOf('-u')+1]:su.split('=')[1],lb=a.slice(1).filter(function(x){return x[0]!=='-'&&x!==tgt})[0]||r.head,rb=(tgt||'').replace(/^origin\//,'');
        if(!r.remote||!tgt||!r.rbr||!r.rbr[rb]){perr("error: the requested upstream branch '"+(tgt||'')+"' does not exist\nhint: git fetch first, or push the branch with  git push -u origin "+lb);return}
        r.up=r.up||{};r.up[lb]=1;pl("branch '"+lb+"' set up to track '"+tgt+"'.");return}
      var mv=a.indexOf('-m')>=0||a.indexOf('-M')>=0;
      if(mv){var from=names.length>1?names[0]:r.head,to=names.length>1?names[1]:names[0];
        if(!to){perr('fatal: branch name required');return}if(!(from in r.br)){perr("error: refname refs/heads/"+from+" not found\nfatal: Branch rename failed");return}
        if(from===to)return;if((to in r.br)&&a.indexOf('-M')<0){perr("fatal: a branch named '"+to+"' already exists");return}
        r.br[to]=r.br[from];delete r.br[from];if(r.head===from)r.head=to;if(r.up&&r.up[from]){delete r.up[from];r.up[to]=1}return}
      if(a.indexOf('--show-current')>=0){if(!r.det)pl(r.head);return}
      if(names.length){var nb=names[0];if(nb in r.br){perr("fatal: a branch named '"+nb+"' already exists");return}
        if(!headId()){perr("fatal: not a valid object name: '"+r.head+"'.");return}
        var sp=names[1]?rev(names[1]):headId();if(!sp){perr("fatal: not a valid object name: '"+names[1]+"'.");return}r.br[nb]=sp;return}
      var vv=a.indexOf('-vv')>=0,v1=vv||a.indexOf('-v')>=0||a.indexOf('--verbose')>=0,bw=Math.max.apply(null,keys(r.br).map(function(b){return b.length}).concat([0]));
      if(r.det){var dl='(HEAD detached '+(r.det===r.detFrom?'at ':'from ')+r.detName+')',dc=C(r.det);bw=Math.max(bw,dl.length);pr('<span class="g">'+esc('* '+dl+(v1?new Array(bw-dl.length+2).join(' ')+dc.id+' '+dc.msg:''))+'</span>')}
      keys(r.br).sort().forEach(function(b){var t=(b===r.head&&!r.det?'* ':'  ')+b;
        if(v1&&r.br[b]){var bc=C(r.br[b]),ex='';if(vv&&r.up&&r.up[b]&&r.rbr&&r.rbr[b]){var A1=anc(r.br[b]),B1=anc(r.rbr[b]),ah=keys(A1).filter(function(k){return !B1[k]}).length,bh=keys(B1).filter(function(k){return !A1[k]}).length;ex='[origin/'+b+(ah||bh?': '+[ah?'ahead '+ah:'',bh?'behind '+bh:''].filter(Boolean).join(', '):'')+'] '}
          t+=new Array(bw-b.length+2).join(' ')+bc.id+' '+ex+bc.msg}
        pr(b===r.head&&!r.det?'<span class="g">'+esc(t)+'</span>':esc(t))});
      if(a.indexOf('-a')>=0||a.indexOf('-r')>=0)keys(r.rbr||{}).sort().forEach(function(b){if(r.rbr[b])pr('<span class="r">  remotes/origin/'+esc(b)+'</span>')});return}
    if(sub==='switch'||sub==='checkout'){
      var co=sub==='checkout',dd2=a.indexOf('--'),mk=a.indexOf('-c')>=0||a.indexOf('-b')>=0||a.indexOf('-C')>=0||a.indexOf('-B')>=0,pos=a.slice(1,dd2<0?a.length:dd2).filter(function(x){return x[0]!=='-'||x==='-'}),tn=pos[0];
      /* checkout -- <file> / checkout <file> / checkout <commit> -- <file>: put the file back, from the staging area or that commit */
      if(co&&!mk&&(dd2>=0||(tn&&tn!=='-'&&!(tn in r.br)&&!(r.rbr&&r.rbr[tn])&&!rev(tn)))){
        var src=null,fl=dd2>=0?a.slice(dd2+1):pos;if(dd2>=0&&pos.length){src=rev(pos[0]);if(!src){perr("fatal: invalid reference: "+pos[0]);return}}
        if(!fl.length){perr('fatal: you must specify path(s) to restore');return}
        var tree=src?C(src).files:null,bad2=null,n2=0;
        fl.forEach(function(x){var f=rel(norm(x));if(bad2)return;var ks=keys(tree||r.index).filter(function(k){return f!==null&&(f===''||k===f||k.indexOf(f+'/')===0)});
          if(!ks.length){bad2=x;return}ks.forEach(function(k){var v=(tree||r.index)[k];S.files[r.root+'/'+k]=v;if(tree)r.index[k]=v;delete r.conf[k];n2++})});
        if(bad2){perr("error: pathspec '"+bad2+"' did not match any file(s) known to git");return}
        return}
      if(tn==='-'){if(!r.prev||!(r.prev in r.br)){perr('fatal: invalid reference: @{-1}');return}tn=r.prev}
      var detach=a.indexOf('--detach')>=0||a.indexOf('-d')>=0&&!co;
      if(!tn&&a.indexOf('--detach')<0){perr(mk?"error: switch `"+(co?'b':'c')+"' requires a value":'fatal: missing branch name; try -c');return}
      if(keys(r.conf).length){perr('error: you need to resolve your current index first\n'+keys(r.conf).map(function(f){return f+': needs merge'}).join('\n'));return}
      /* move to another commit, keeping uncommitted changes that do not clash (real Git refuses only when they would be overwritten) */
      function moveTo(tid,label){var h=headTree(),w=work(),tt=tid?C(tid).files:{},st6=status(),dirty={},bad=[],unt=[];
        st6.staged.forEach(function(x){dirty[x[0]]=x[1]==='new file'?'A':x[1]==='deleted'?'D':'M'});st6.unstaged.forEach(function(x){if(!dirty[x[0]])dirty[x[0]]=x[1]==='deleted'?'D':'M'});
        keys(dirty).forEach(function(f){if(h[f]!==tt[f]&&!(dirty[f]==='A'&&r.index[f]===tt[f]))bad.push(f)});
        st6.untracked.forEach(function(f){if(f in tt&&w[f]!==tt[f])unt.push(f)});
        if(bad.length){perr('error: Your local changes to the following files would be overwritten by checkout:\n'+bad.sort().map(function(f){return '\t'+f}).join('\n')+'\nPlease commit your changes or stash them before you switch branches.\nAborting');return null}
        if(unt.length){perr('error: The following untracked working tree files would be overwritten by checkout:\n'+unt.sort().map(function(f){return '\t'+f}).join('\n')+'\nPlease move or remove them before you switch branches.\nAborting');return null}
        var all3={};keys(h).concat(keys(tt)).forEach(function(f){all3[f]=1});
        keys(all3).forEach(function(f){if(dirty[f])return;if(f in tt){S.files[r.root+'/'+f]=tt[f];r.index[f]=tt[f];var d=dirname(r.root+'/'+f);while(d!==r.root&&!S.dirs[d]){S.dirs[d]=1;d=dirname(d)}}else{delete S.files[r.root+'/'+f];delete r.index[f]}});
        return keys(dirty).sort().map(function(f){return dirty[f]+'\t'+f})}
      function carried(l){if(l&&l.length)pl(l.join('\n'))}
      function leaving(from,to){if(from===to)return '';var keep={};keys(r.br).forEach(function(b){if(r.br[b])keys(anc(r.br[b])).forEach(function(k){keep[k]=1})});keys(r.rbr||{}).forEach(function(b){if(r.rbr[b])keys(anc(r.rbr[b])).forEach(function(k){keep[k]=1})});keys(r.tags||{}).forEach(function(t){keys(anc(r.tags[t].id)).forEach(function(k){keep[k]=1})});
        var lost=reach(from).filter(function(c){return !keep[c.id]});
        if(!lost.length)return 'Previous HEAD position was '+from+' '+C(from).msg;
        return 'Warning: you are leaving '+lost.length+' commit'+(lost.length>1?'s':'')+' behind, not connected to\nany of your branches:\n\n'+lost.slice(0,4).map(function(c){return '  '+c.id+' '+c.msg}).join('\n')+(lost.length>4?'\n ... and '+(lost.length-4)+' more.':'')+'\n\nIf you want to keep '+(lost.length>1?'them':'it')+' by creating a new branch, this may be a good time\nto do so with:\n\n git branch <new-branch-name> '+from+'\n'}
      if(mk){if((tn in r.br)&&a.indexOf('-C')<0&&a.indexOf('-B')<0){perr("fatal: a branch named '"+tn+"' already exists");return}
        var spt=pos[1]?rev(pos[1]):headId(),cl=null;if(pos[1]&&!spt){perr(co?"fatal: '"+pos[1]+"' is not a commit and a branch '"+tn+"' cannot be created from it":"fatal: invalid reference: "+pos[1]);return}
        if(pos[1]){cl=moveTo(spt);if(!cl)return}
        if(!r.det)r.prev=r.head;r.br[tn]=spt;r.head=tn;r.det=null;pl("Switched to a new branch '"+tn+"'");carried(cl);return}
      if(!(tn in r.br)&&r.rbr&&r.rbr[tn]){var cl2=moveTo(r.rbr[tn]);if(!cl2)return;
        var lv2=r.det?leaving(r.det,r.rbr[tn]):'';r.br[tn]=r.rbr[tn];if(!r.det)r.prev=r.head;r.head=tn;r.det=null;if(lv2)pl(lv2);r.up=r.up||{};r.up[tn]=1;pl("branch '"+tn+"' set up to track 'origin/"+tn+"'.\nSwitched to a new branch '"+tn+"'");carried(cl2);return}
      /* detached HEAD: look at (and even commit on) an old commit without being on a branch, like real Git */
      if((detach||co)&&!mk&&(detach||!(tn in r.br))&&(tn?rev(tn):headId())){var did0=tn?rev(tn):headId(),was=r.det,cl4=moveTo(did0);if(!cl4)return;
        var nm0=!tn||tn==='HEAD'?did0:(r.tags&&r.tags[tn]?tn:/^origin\//.test(tn)&&r.rbr&&r.rbr[tn.slice(7)]?tn:(tn in r.br?tn:did0));
        if(!was)r.prev=r.head;var oldTxt=was?leaving(was,did0):'';
        r.det=did0;r.detFrom=did0;r.detName=nm0===did0?did0:nm0;carried(cl4);
        if(oldTxt)pl(oldTxt);
        else if(!was&&co&&!detach)pl("Note: switching to '"+(tn||did0)+"'.\n\nYou are in 'detached HEAD' state. You can look around, make experimental\nchanges and commit them, and you can discard any commits you make in this\nstate without impacting any branches by switching back to a branch.\n\nIf you want to create a new branch to retain commits you create, you may\ndo so (now or later) by using -c with the switch command. Example:\n\n  git switch -c <new-branch-name>\n\nOr undo this operation with:\n\n  git switch -\n\nTurn off this advice by setting config variable advice.detachedHead to false\n");
        pl('HEAD is now at '+did0+' '+C(did0).msg);S.ran.detach=1;return}
      if(!(tn in r.br)){if(co)perr(rev(tn)?"error: the Mini laptop cannot look at an old commit on its own (detached HEAD).\nhint: Use  git show "+tn+"  to see it, or  git switch -c look "+tn+"  to make a branch there.":"error: pathspec '"+tn+"' did not match any file(s) known to git");
        else perr(rev(tn)?"fatal: a branch is expected, got commit '"+tn+"'\nhint: If you want to detach HEAD at the commit, try again with the --detach option.":"fatal: invalid reference: "+tn);return}
      if(tn===r.head&&!r.det){pl("Already on '"+tn+"'");return}
      var lv3=r.det?leaving(r.det,r.br[tn]):'';var cl3=moveTo(r.br[tn]);if(!cl3)return;if(!r.det)r.prev=r.head;r.head=tn;r.det=null;if(lv3)pl(lv3);pl("Switched to branch '"+tn+"'");carried(cl3);return}
    if(sub==='merge'){
      if(a[1]==='--abort'){if(!r.merge){perr('fatal: There is no merge to abort (MERGE_HEAD missing).');return}applyTree(headTree());r.conf={};r.merge=null;return}
      if(mergeBlocked('Merging'))return;
      /* -m "message" names the merge commit, like real Git */
      var mmi=a.indexOf('-m'),mmsg=mmi>=0?a[mmi+1]:null,on=a.slice(1).filter(function(x,i){return x[0]!=='-'&&!(mmi>=0&&i+1===mmi+1)})[0];
      if(mmi>=0&&!mmsg){perr("error: switch `m' requires a value");return}
      if(on&&on.indexOf('origin/')===0&&r.rbr&&r.rbr[on.slice(7)]){var rbx=r.rbr[on.slice(7)];if(rbx===headId()||anc(headId())[rbx]){pl('Already up to date.');return}mergeInto(rbx,on,mmsg||"Merge remote-tracking branch '"+on+"'");return}
      if(!on||!(on in r.br)){perr('merge: '+on+' - not something we can merge');return}
      if(!r.br[on]){perr('merge: '+on+' - not something we can merge');return}
      if(on===r.head){pl('Already up to date.');return}
      mergeInto(r.br[on],on,mmsg||"Merge branch '"+on+"'");return}
    if(sub==='remote'){
      if(a[1]==='add'){if(!a[3]){perr('usage: git remote add <name> <url>');return}if(r.remote){perr("error: remote origin already exists.");return}
        r.remote={url:a[3],br:{},ids:{}};var src0=!RL.on&&ghSource(a[3],r);if(src0)ghCopy(src0,r);return}
      /* extra words after git remote -v are an unknown subcommand, like real Git (it does not just ignore them) */
      if(a[1]==='-v'&&a[2]){perr("error: unknown subcommand: `"+a[2]+"`\nusage: git remote [-v | --verbose]\n   or: git remote add <name> <url>\n   or: git remote set-url <name> <newurl>");return}
      if(a[1]==='-v'||!a[1]){if(r.remote){if(a[1])pl('origin\t'+r.remote.url+' (fetch)\norigin\t'+r.remote.url+' (push)');else pl('origin')}return}
      /* change the link (git remote set-url origin <url>), take it away (git remote remove origin), or print it */
      if(a[1]==='set-url'){if(!a[3]){perr('usage: git remote set-url <name> <newurl>');return}if(a[2]!=='origin'||!r.remote){perr("error: No such remote '"+a[2]+"'");return}
        var keepBr=r.remote.br,was=realTarget(r);r.remote={url:a[3],br:{},ids:{}};var src1=!RL.on&&ghSource(a[3],r);if(src1)ghCopy(src1,r);else if(RL.on)r.remote.br=keepBr;
        /* Real GitHub mode, now pointing at a different GitHub repo: this folder starts fresh with it */
        var now2=realTarget(r);if(RL.on&&String(was).toLowerCase()!==String(now2).toLowerCase()){r.rlknown={};r.rlmap={};r.remote.br={}}return}
      if(a[1]==='remove'||a[1]==='rm'){if(a[2]!=='origin'||!r.remote){perr("error: No such remote: '"+(a[2]||'')+"'");return}r.remote=null;r.rbr={};r.up={};return}
      if(a[1]==='get-url'){if(a[2]!=='origin'||!r.remote){perr("error: No such remote '"+(a[2]||'')+"'");return}pl(r.remote.url);return}
      perr("error: unknown subcommand: `"+a[1]+"`\nusage: git remote [-v | --verbose]\n   or: git remote add <name> <url>\n   or: git remote set-url <name> <newurl>");return}
    if(sub==='push'){
      if(!r.remote){if(a.slice(1).filter(function(x){return x[0]!=='-'}).length)perr("fatal: 'origin' does not appear to be a git repository\nfatal: Could not read from remote repository.\n\nPlease make sure you have the correct access rights\nand the repository exists.");
        else perr("fatal: No configured push destination.\nEither specify the URL from the command-line or configure a remote repository using\n\n    git remote add <name> <url>\n\nand then push using the remote name\n\n    git push <name>\n");
        pl('Tip: connect first with  git remote add origin <url>','y');return}
      var pw0=a.slice(1).filter(function(x){return x[0]!=='-'});
      if(r.det&&a.indexOf('--tags')<0&&(pw0.length<2||pw0[1]==='HEAD')){perr("fatal: You are not currently on a branch.\nTo push the history leading to the current (detached HEAD)\nstate now, use\n\n    git push origin HEAD:<name-of-remote-branch>\n");pl('Or make a branch here first:  git switch -c <new-branch-name>','y');return}
      if(pw0.length<2&&a.indexOf('--tags')<0&&!(r.up&&r.up[r.head])&&r.br[r.head]!==undefined){
        perr("fatal: The current branch "+r.head+" has no upstream branch.\nTo push the current branch and set the remote as upstream, use\n\n    git push --set-upstream origin "+r.head+"\n\nTo have this happen automatically for branches without a tracking\nupstream, see 'push.autoSetupRemote' in 'git help config'.\n");
        pl('The first push of a branch needs -u:  git push -u origin '+r.head+'   (after that, plain  git push  works)','y');return}
      if(RL.on&&!realOk(r)){realRoute(r,'push',function(){git(a)});return}
      var pw=a.slice(1).filter(function(x){return x[0]!=='-'}),allTags=a.indexOf('--tags')>=0;
      if(pw[0]&&pw[0]!=='origin'){perr("fatal: '"+pw[0]+"' does not appear to be a git repository\nfatal: Could not read from remote repository.");return}
      var ref=pw[1],br=r.head;r.tags=r.tags||{};
      if(a.indexOf('--delete')>=0||a.indexOf('-d')>=0){var db=ref;
        if(!db){perr("fatal: --delete doesn't make sense without any refs");return}
        if(db===(RL.on?ghDef(r):'main')){pl('To '+r.remote.url);perr(" ! [remote rejected] "+db+" (refusing to delete the current branch: refs/heads/"+db+")\nerror: failed to push some refs to '"+r.remote.url+"'");return}
        if(RL.on){realDelBranch(db);return}
        if(!r.remote.br[db]){perr("error: unable to delete '"+db+"': remote ref does not exist\nerror: failed to push some refs to '"+r.remote.url+"'");return}
        delete r.remote.br[db];if(r.rbr)delete r.rbr[db];if(r.up)delete r.up[db];
        keys(S.repos).forEach(function(rt){var q=S.repos[rt];if(q!==r&&q.remote&&ghKey(q.remote.url)===ghKey(r.remote.url))delete q.remote.br[db]});
        pl('To '+r.remote.url);pl(' - [deleted]         '+db,'g');return}
      /* tags: git push origin v1.0, or git push --tags */
      if(allTags||(ref&&r.tags[ref]&&!(ref in r.br))){var tl=allTags?keys(r.tags).sort():[ref];r.remote.tags=r.remote.tags||{};tl=tl.filter(function(t){return r.remote.tags[t]!==r.tags[t].id});
        if(!tl.length){pl('Everything up-to-date');return}
        if(RL.on){realTagPush(tl);return}
        pl('To '+r.remote.url);tl.forEach(function(t){r.remote.tags[t]=r.tags[t].id;pl(' * [new tag]         '+t+' -> '+t,'g')});ghShare(r);return}
      if(ref){if(!(ref in r.br)){perr('error: src refspec '+ref+' does not match any\nerror: failed to push some refs to \''+r.remote.url+'\'');return}br=ref}
      if(!r.br[br]){perr('error: src refspec '+br+' does not match any\nerror: failed to push some refs (make a commit first)');return}
      var rt=r.remote.br[br],lt=r.br[br];
      if(rt&&rt!==lt&&!anc(lt)[rt]){pushRejected(r.remote.url,br,r.rbr[br]===rt);return}
      pl('Enumerating objects: 5, done.\nCounting objects: 100% (5/5), done.\nWriting objects: 100% (3/3), 280 bytes | 280.00 KiB/s, done.');
      if(rt===lt){if(a.indexOf('-u')>=0||a.indexOf('--set-upstream')>=0){r.up=r.up||{};r.up[br]=1}pl('Everything up-to-date');return}
      var setU=a.indexOf('-u')>=0||a.indexOf('--set-upstream')>=0;
      if(RL.on){realPush(br,rt,lt,setU);return}
      pl('To '+r.remote.url);
      pl(rt?' '+rt+'..'+lt+'  '+br+' -> '+br:' * [new branch]      '+br+' -> '+br,'g');
      if(setU){pl("branch '"+br+"' set up to track 'origin/"+br+"'.");r.up=r.up||{};r.up[br]=1}
      r.remote.br[br]=lt;r.rbr[br]=lt;S.pushed=true;ghShare(r);return}
    if(sub==='fetch'||sub==='pull'){
      if(!r.remote){if(sub==='pull'&&!a.slice(1).filter(function(x){return x[0]!=='-'}).length&&!r.det)perr("There is no tracking information for the current branch.\nPlease specify which branch you want to merge with.\nSee git-pull(1) for details.\n\n    git pull <remote> <branch>\n\nIf you wish to set tracking information for this branch you can do so with:\n\n    git branch --set-upstream-to=<remote>/<branch> "+r.head+"\n");
        else perr("fatal: 'origin' does not appear to be a git repository\nfatal: Could not read from remote repository.\n\nPlease make sure you have the correct access rights\nand the repository exists.");return}
      var pa=a.slice(1).filter(function(x){return x[0]!=='-'});
      if(sub==='pull'&&r.det){perr("You are not currently on a branch.\nPlease specify which branch you want to merge with.\nSee git-pull(1) for details.\n\n    git pull <remote> <branch>\n");return}
      if(sub==='pull'&&pa.length<2&&!(r.up&&r.up[r.head])&&r.br[r.head]){
        perr("There is no tracking information for the current branch.\nPlease specify which branch you want to merge with.\nSee git-pull(1) for details.\n\n    git pull <remote> <branch>\n\nIf you wish to set tracking information for this branch you can do so with:\n\n    git branch --set-upstream-to=origin/"+r.head+" "+r.head+"\n");return}
      if(RL.on&&!realOk(r)){realRoute(r,'fetch',function(){git(a)});return}
      var allowU=a.indexOf('--allow-unrelated-histories')>=0,reb=a.indexOf('--rebase')>=0||a.indexOf('-r')>=0;
      if(r.rebase){perr('error: Pulling is not possible because you are in the middle of a rebase.\nhint: Use "git rebase --continue", "--skip" or "--abort".');return}
      if(sub==='pull'&&mergeBlocked('Pulling'))return;
      if(S.mate1)S.ran.f1=1;
      if(RL.on){realFetch(r.head,function(res){syncPull(sub,allowU,res,reb)});return}
      syncPull(sub,allowU,null,reb);return}
    /* a typo: real Git's message, with the closest command it knows */
    var GC=['add','branch','checkout','clone','commit','config','diff','fetch','help','init','log','ls-files','merge','mv','pull','push','rebase','remote','reset','restore','revert','rm','show','stash','status','switch','tag'];
    function lev(x,y){var d=[],i,j;for(i=0;i<=x.length;i++){d[i]=[i]}for(j=1;j<=y.length;j++)d[0][j]=j;for(i=1;i<=x.length;i++)for(j=1;j<=y.length;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(x[i-1]===y[j-1]?0:1));return d[x.length][y.length]}
    var best=GC.map(function(c){return [c,lev(sub,c)]}).filter(function(c){return c[1]<=2}).sort(function(a,b){return a[1]-b[1]}),near=best.filter(function(c){return c[1]===(best[0]||[])[1]}).map(function(c){return c[0]});
    perr("git: '"+sub+"' is not a git command. See 'git --help'."+(near.length?"\n\nThe most similar command"+(near.length>1?"s are":" is")+"\n\t"+near.join('\n\t'):''));
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
      case 'ls':{var fl=t.filter(function(x,i){return i>0&&x[0]==='-'}).join(''),all=/a/.test(fl),lng=/l/.test(fl);if(all)S.ran.lsa=1;var dir=norm(t.filter(function(x,i){return i>0&&x[0]!=='-'})[0]||'.');
        if(!S.dirs[dir]){perr("ls: cannot access '"+(t[1]||'')+"': No such file or directory");return}
        var items=[];if(all){items.push('<span class="b">./</span>','<span class="b">../</span>')} /* ls -a always shows . and .. too, like Git Bash */
        var lsk=winSortKey,ent=[];
        keys(S.dirs).forEach(function(d){if(d!==dir&&dirname(d)===dir&&(all||base(d)[0]!=='.'))ent.push([lsk(base(d)),'<span class="b">'+esc(base(d))+'/</span>'])});
        keys(S.files).forEach(function(f){if(dirname(f)===dir&&(all||base(f)[0]!=='.'))ent.push([lsk(base(f)),esc(base(f))])});
        ent.sort(function(x,y){return x[0]<y[0]?-1:x[0]>y[0]?1:0}).forEach(function(e){items.push(e[1])});
        if(lng){/* ls -l: one line each, with permissions, owner, size in bytes, date and name, like Git Bash */
          var dt=new Date(),MO=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],when=MO[dt.getMonth()]+' '+('  '+dt.getDate()).slice(-2)+' '+('0'+dt.getHours()).slice(-2)+':'+('0'+dt.getMinutes()).slice(-2);
          var sz=function(f){var v=S.files[f];return isBin(v)?binSize(v):unescape(encodeURIComponent(v||'')).length};
          var zw=Math.max(1,String(Math.max.apply(null,[0].concat(keys(S.files).filter(function(f){return dirname(f)===dir}).map(sz)))).length);
          var row=function(dirp,n,size){return (dirp?'drwxr-xr-x':'-rw-r--r--')+' 1 you 197121 '+(new Array(zw+1).join(' ')+size).slice(-zw)+' '+when+' '+(dirp?'<span class="b">'+esc(n)+'/</span>':esc(n))};
          var rows=[],tot=0;if(all){rows.push(row(1,'.',0));rows.push(row(1,'..',0))}
          var lk=winSortKey,lent=[];
          keys(S.dirs).filter(function(d){return d!==dir&&dirname(d)===dir&&(all||base(d)[0]!=='.')}).forEach(function(d){lent.push([lk(base(d)),row(1,base(d),0)])});
          keys(S.files).filter(function(f){return dirname(f)===dir&&(all||base(f)[0]!=='.')}).forEach(function(f){var z=sz(f);tot+=Math.ceil(z/1024);lent.push([lk(base(f)),row(0,base(f),z)])});
          lent.sort(function(x,y){return x[0]<y[0]?-1:x[0]>y[0]?1:0}).forEach(function(e){rows.push(e[1])});
          pr('total '+tot);rows.forEach(function(x){pr(x)});return}
        pr(items.length?items.join('&nbsp;&nbsp;'):'&nbsp;');return}
      case 'cd':{var d=norm(t[1]||'~');if(!S.dirs[d]){perr('bash: cd: '+(t[1]||'')+': No such file or directory');return}S.cwd=d;return}
      case 'mkdir':{if(!t[1]){perr('mkdir: missing operand');return}var d2=norm(t[1]);if(S.dirs[d2]){perr("mkdir: cannot create directory '"+t[1]+"': File exists");return}if(!S.dirs[dirname(d2)]){perr("mkdir: cannot create directory '"+t[1]+"': No such file or directory");return}S.dirs[d2]=1;return}
      /* mv renames or moves (and quietly replaces a file already there, like bash); cp copies (-r for folders) */
      case 'mv':case 'cp':{var op=t.filter(function(x,i){return i>0&&x[0]!=='-'}),rec2=t.some(function(x){return /^-.*r/i.test(x)});
        if(op.length<2){perr(cmd+': missing '+(op.length?'destination file operand after \''+op[0]+'\'':'file operand'));return}
        var src=norm(op[0]),dst=norm(op[1]);
        if(!exists(src)){perr(cmd+": cannot stat '"+op[0]+"': No such file or directory");return}
        if(S.dirs[dst])dst=dst+'/'+base(src);
        if(!S.dirs[dirname(dst)]){perr(cmd+": cannot "+(cmd==='mv'?'move':'create regular file')+" '"+op[0]+"' to '"+op[1]+"': No such file or directory");return}
        if(dst===src){perr(cmd+": '"+op[0]+"' and '"+op[1]+"' are the same file");return}
        if(S.dirs[src]&&under(dst,src)){perr(cmd+": cannot "+(cmd==='mv'?'move':'copy')+" '"+op[0]+"' to a subdirectory of itself, '"+op[1]+"'");return}
        if(S.dirs[dst]){perr(cmd+": cannot overwrite directory '"+op[1]+"'");return}
        if(S.dirs[src]&&dst in S.files){perr(cmd+": cannot overwrite non-directory '"+op[1]+"' with directory '"+op[0]+"'");return}
        if(cmd==='cp'){if(S.dirs[src]&&!rec2){perr("cp: -r not specified; omitting directory '"+op[0]+"'");return}
          if(S.dirs[src]){keys(S.dirs).forEach(function(d){if(under(d,src))S.dirs[dst+d.slice(src.length)]=1});keys(S.files).forEach(function(f){if(f.indexOf(src+'/')===0)S.files[dst+f.slice(src.length)]=S.files[f]})}
          else S.files[dst]=S.files[src];return}
        if(dst in S.files)delete S.files[dst];var mr=fsRename(src,dst);if(mr.err)perr('mv: '+mr.err.replace(/<[^>]+>/g,''));return}
      case 'touch':{if(!t[1]){perr('touch: missing file operand');return}var f=norm(t[1]);if(!S.dirs[dirname(f)]){perr('touch: No such directory');return}if(!(f in S.files))S.files[f]='';return}
      case 'cat':{if(!t[1]){perr('cat: missing file');return}var f2=norm(t[1]);S.ran.cat=1;if(!(f2 in S.files)){perr('cat: '+t[1]+': No such file or directory');return}
        if(isBin(S.files[f2])&&/\/\.git\/(objects\/[0-9a-f]{2}\/[0-9a-f]{38}|index)$/.test(f2)){var om=f2.match(/objects\/([0-9a-f]{2})\/([0-9a-f]{38})$/);pl(t[1]+': a binary file: Git compressed it with zlib, so cat prints gibberish.\nRead it with:  '+(om?'git cat-file -p '+om[1]+om[2]:'git ls-files --stage'),'y');return}
        if(isBin(S.files[f2])){pl(t[1]+': '+(isPic(S.files[f2])?'a picture':'a binary file')+' ('+binSize(S.files[f2])+' bytes). cat would print gibberish: open it in VS Code or the File Explorer to see it.','y');return}
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
        if(hit&&S.repo&&!args.some(function(x){return /(^|\/)\.git\/?$/.test(x)}))pl('Files removed from your folder. Now git add . (or git rm) , commit, push.','y');return}
      case 'rm_old':{if(!t[1]){perr('rm: missing operand');return}var f3=norm(t[1]);if(!(f3 in S.files)){perr("rm: cannot remove '"+t[1]+"': No such file or directory");return}delete S.files[f3];return}
      case 'clear':out.innerHTML='';return;
      case 'help':pl('Try these:\n  rm file | rm -r folder | rm *    (delete things)\n  git rm .    (remove all tracked files)\n  wipe-github    (Real mode: delete EVERYTHING in the GitHub repo, start fresh)\n\n  pwd  ls  cd  mkdir  touch  cat  rm  mv  cp  clear\n  mv old.txt new.txt    (rename or move)   cp a.txt b.txt   (copy; cp -r for folders)\n  echo "text" > file      (make or change a file)\n  git init | clone | status | add | commit | diff | log | show\n  git restore | reset | revert | stash | rm | mv | tag\n  git branch | switch | checkout | merge | rebase\n  ls -l | ls -la | git ls-files    (long list, hidden files too, files Git tracks)\n  git remote | push | fetch | pull\n  git help    (all git commands, grouped)\n\nEvery command, with what it does: open the Cheat Sheet on the desktop.','y');return;
    }
    perr('bash: '+cmd+': command not found');
  }
  function exec(line){lastCmd=String(line||'');
    var t=tok(line),ri=-1;t.forEach(function(x,i){if((x==='>'||x==='>>')&&ri<0)ri=i});
    if(t[0]==='echo'&&ri>=0){var target=t[ri+1];if(!target){perr('bash: syntax error near unexpected token `newline\'');return}
      var p=norm(target);if(!S.dirs[dirname(p)]){perr('bash: '+target+': No such file or directory');return}
      var txt=t.slice(1,ri).join(' ')+'\n';S.files[p]=t[ri]==='>>'?(S.files[p]||'')+txt:txt;return}
    if(t[0]==='echo'){pl(t.slice(1).join(' '));return}
    if(t[0]==='git'){git(t.slice(1));return}
    if(t[0]==='gh'){ghCmd(t.slice(1));return}
    shell(t);
  }
  /* ---------- prompt + render ---------- */
  /* ---------- the .git folder, the way real Git writes it ----------
     objects/ holds a zlib-compressed object for every file (blob), folder (tree) and commit, named by its SHA-1;
     blob and tree names are the real SHA-1s Git would give them. index is Git's binary staging file (DIRC),
     logs/ records every move of HEAD and the branches, hooks/ has Git's own sample scripts. */
  var GIT_HOOKS={"applypatch-msg.sample": "#!/bin/sh\n#\n# An example hook script to check the commit log message taken by\n# applypatch from an e-mail message.\n#\n# The hook should exit with non-zero status after issuing an\n# appropriate message if it wants to stop the commit.  The hook is\n# allowed to edit the commit message file.\n#\n# To enable this hook, rename this file to \"applypatch-msg\".\n\n. git-sh-setup\ncommitmsg=\"$(git rev-parse --git-path hooks/commit-msg)\"\ntest -x \"$commitmsg\" && exec \"$commitmsg\" ${1+\"$@\"}\n:\n", "commit-msg.sample": "#!/bin/sh\n#\n# An example hook script to check the commit log message.\n# Called by \"git commit\" with one argument, the name of the file\n# that has the commit message.  The hook should exit with non-zero\n# status after issuing an appropriate message if it wants to stop the\n# commit.  The hook is allowed to edit the commit message file.\n#\n# To enable this hook, rename this file to \"commit-msg\".\n\n# Uncomment the below to add a Signed-off-by line to the message.\n# Doing this in a hook is a bad idea in general, but the prepare-commit-msg\n# hook is more suited to it.\n#\n# SOB=$(git var GIT_AUTHOR_IDENT | sed -n 's/^\\(.*>\\).*$/Signed-off-by: \\1/p')\n# grep -qs \"^$SOB\" \"$1\" || echo \"$SOB\" >> \"$1\"\n\n# This example catches duplicate Signed-off-by lines.\n\ntest \"\" = \"$(grep '^Signed-off-by: ' \"$1\" |\n\t sort | uniq -c | sed -e '/^[ \t]*1[ \t]/d')\" || {\n\techo >&2 Duplicate Signed-off-by lines.\n\texit 1\n}\n", "fsmonitor-watchman.sample": "#!/usr/bin/perl\n\nuse strict;\nuse warnings;\nuse IPC::Open2;\n\n# An example hook script to integrate Watchman\n# (https://facebook.github.io/watchman/) with git to speed up detecting\n# new and modified files.\n#\n# The hook is passed a version (currently 2) and last update token\n# formatted as a string and outputs to stdout a new update token and\n# all files that have been modified since the update token. Paths must\n# be relative to the root of the working tree and separated by a single NUL.\n#\n# To enable this hook, rename this file to \"query-watchman\" and set\n# 'git config core.fsmonitor .git/hooks/query-watchman'\n#\nmy ($version, $last_update_token) = @ARGV;\n\n# Uncomment for debugging\n# print STDERR \"$0 $version $last_update_token\\n\";\n\n# Check the hook interface version\nif ($version ne 2) {\n\tdie \"Unsupported query-fsmonitor hook version '$version'.\\n\" .\n\t    \"Falling back to scanning...\\n\";\n}\n\nmy $git_work_tree = get_working_dir();\n\nmy $retry = 1;\n\nmy $json_pkg;\neval {\n\trequire JSON::XS;\n\t$json_pkg = \"JSON::XS\";\n\t1;\n} or do {\n\trequire JSON::PP;\n\t$json_pkg = \"JSON::PP\";\n};\n\nlaunch_watchman();\n\nsub launch_watchman {\n\tmy $o = watchman_query();\n\tif (is_work_tree_watched($o)) {\n\t\toutput_result($o->{clock}, @{$o->{files}});\n\t}\n}\n\nsub output_result {\n\tmy ($clockid, @files) = @_;\n\n\t# Uncomment for debugging watchman output\n\t# open (my $fh, \">\", \".git/watchman-output.out\");\n\t# binmode $fh, \":utf8\";\n\t# print $fh \"$clockid\\n@files\\n\";\n\t# close $fh;\n\n\tbinmode STDOUT, \":utf8\";\n\tprint $clockid;\n\tprint \"\\0\";\n\tlocal $, = \"\\0\";\n\tprint @files;\n}\n\nsub watchman_clock {\n\tmy $response = qx/watchman clock \"$git_work_tree\"/;\n\tdie \"Failed to get clock id on '$git_work_tree'.\\n\" .\n\t\t\"Falling back to scanning...\\n\" if $? != 0;\n\n\treturn $json_pkg->new->utf8->decode($response);\n}\n\nsub watchman_query {\n\tmy $pid = open2(\\*CHLD_OUT, \\*CHLD_IN, 'watchman -j --no-pretty')\n\tor die \"open2() failed: $!\\n\" .\n\t\"Falling back to scanning...\\n\";\n\n\t# In the query expression below we're asking for names of files that\n\t# changed since $last_update_token but not from the .git folder.\n\t#\n\t# To accomplish this, we're using the \"since\" generator to use the\n\t# recency index to select candidate nodes and \"fields\" to limit the\n\t# output to file names only. Then we're using the \"expression\" term to\n\t# further constrain the results.\n\tmy $last_update_line = \"\";\n\tif (substr($last_update_token, 0, 1) eq \"c\") {\n\t\t$last_update_token = \"\\\"$last_update_token\\\"\";\n\t\t$last_update_line = qq[\\n\"since\": $last_update_token,];\n\t}\n\tmy $query = <<\"\tEND\";\n\t\t[\"query\", \"$git_work_tree\", {$last_update_line\n\t\t\t\"fields\": [\"name\"],\n\t\t\t\"expression\": [\"not\", [\"dirname\", \".git\"]]\n\t\t}]\n\tEND\n\n\t# Uncomment for debugging the watchman query\n\t# open (my $fh, \">\", \".git/watchman-query.json\");\n\t# print $fh $query;\n\t# close $fh;\n\n\tprint CHLD_IN $query;\n\tclose CHLD_IN;\n\tmy $response = do {local $/; <CHLD_OUT>};\n\n\t# Uncomment for debugging the watch response\n\t# open ($fh, \">\", \".git/watchman-response.json\");\n\t# print $fh $response;\n\t# close $fh;\n\n\tdie \"Watchman: command returned no output.\\n\" .\n\t\"Falling back to scanning...\\n\" if $response eq \"\";\n\tdie \"Watchman: command returned invalid output: $response\\n\" .\n\t\"Falling back to scanning...\\n\" unless $response =~ /^\\{/;\n\n\treturn $json_pkg->new->utf8->decode($response);\n}\n\nsub is_work_tree_watched {\n\tmy ($output) = @_;\n\tmy $error = $output->{error};\n\tif ($retry > 0 and $error and $error =~ m/unable to resolve root .* directory (.*) is not watched/) {\n\t\t$retry--;\n\t\tmy $response = qx/watchman watch \"$git_work_tree\"/;\n\t\tdie \"Failed to make watchman watch '$git_work_tree'.\\n\" .\n\t\t    \"Falling back to scanning...\\n\" if $? != 0;\n\t\t$output = $json_pkg->new->utf8->decode($response);\n\t\t$error = $output->{error};\n\t\tdie \"Watchman: $error.\\n\" .\n\t\t\"Falling back to scanning...\\n\" if $error;\n\n\t\t# Uncomment for debugging watchman output\n\t\t# open (my $fh, \">\", \".git/watchman-output.out\");\n\t\t# close $fh;\n\n\t\t# Watchman will always return all files on the first query so\n\t\t# return the fast \"everything is dirty\" flag to git and do the\n\t\t# Watchman query just to get it over with now so we won't pay\n\t\t# the cost in git to look up each individual file.\n\t\tmy $o = watchman_clock();\n\t\t$error = $output->{error};\n\n\t\tdie \"Watchman: $error.\\n\" .\n\t\t\"Falling back to scanning...\\n\" if $error;\n\n\t\toutput_result($o->{clock}, (\"/\"));\n\t\t$last_update_token = $o->{clock};\n\n\t\teval { launch_watchman() };\n\t\treturn 0;\n\t}\n\n\tdie \"Watchman: $error.\\n\" .\n\t\"Falling back to scanning...\\n\" if $error;\n\n\treturn 1;\n}\n\nsub get_working_dir {\n\tmy $working_dir;\n\tif ($^O =~ 'msys' || $^O =~ 'cygwin') {\n\t\t$working_dir = Win32::GetCwd();\n\t\t$working_dir =~ tr/\\\\/\\//;\n\t} else {\n\t\trequire Cwd;\n\t\t$working_dir = Cwd::cwd();\n\t}\n\n\treturn $working_dir;\n}\n", "post-update.sample": "#!/bin/sh\n#\n# An example hook script to prepare a packed repository for use over\n# dumb transports.\n#\n# To enable this hook, rename this file to \"post-update\".\n\nexec git update-server-info\n", "pre-applypatch.sample": "#!/bin/sh\n#\n# An example hook script to verify what is about to be committed\n# by applypatch from an e-mail message.\n#\n# The hook should exit with non-zero status after issuing an\n# appropriate message if it wants to stop the commit.\n#\n# To enable this hook, rename this file to \"pre-applypatch\".\n\n. git-sh-setup\nprecommit=\"$(git rev-parse --git-path hooks/pre-commit)\"\ntest -x \"$precommit\" && exec \"$precommit\" ${1+\"$@\"}\n:\n", "pre-commit.sample": "#!/bin/sh\n#\n# An example hook script to verify what is about to be committed.\n# Called by \"git commit\" with no arguments.  The hook should\n# exit with non-zero status after issuing an appropriate message if\n# it wants to stop the commit.\n#\n# To enable this hook, rename this file to \"pre-commit\".\n\nif git rev-parse --verify HEAD >/dev/null 2>&1\nthen\n\tagainst=HEAD\nelse\n\t# Initial commit: diff against an empty tree object\n\tagainst=$(git hash-object -t tree /dev/null)\nfi\n\n# If you want to allow non-ASCII filenames set this variable to true.\nallownonascii=$(git config --type=bool hooks.allownonascii)\n\n# Redirect output to stderr.\nexec 1>&2\n\n# Cross platform projects tend to avoid non-ASCII filenames; prevent\n# them from being added to the repository. We exploit the fact that the\n# printable range starts at the space character and ends with tilde.\nif [ \"$allownonascii\" != \"true\" ] &&\n\t# Note that the use of brackets around a tr range is ok here, (it's\n\t# even required, for portability to Solaris 10's /usr/bin/tr), since\n\t# the square bracket bytes happen to fall in the designated range.\n\ttest $(git diff --cached --name-only --diff-filter=A -z $against |\n\t  LC_ALL=C tr -d '[ -~]\\0' | wc -c) != 0\nthen\n\tcat <<\\EOF\nError: Attempt to add a non-ASCII file name.\n\nThis can cause problems if you want to work with people on other platforms.\n\nTo be portable it is advisable to rename the file.\n\nIf you know what you are doing you can disable this check using:\n\n  git config hooks.allownonascii true\nEOF\n\texit 1\nfi\n\n# If there are whitespace errors, print the offending file names and fail.\nexec git diff-index --check --cached $against --\n", "pre-merge-commit.sample": "#!/bin/sh\n#\n# An example hook script to verify what is about to be committed.\n# Called by \"git merge\" with no arguments.  The hook should\n# exit with non-zero status after issuing an appropriate message to\n# stderr if it wants to stop the merge commit.\n#\n# To enable this hook, rename this file to \"pre-merge-commit\".\n\n. git-sh-setup\ntest -x \"$GIT_DIR/hooks/pre-commit\" &&\n        exec \"$GIT_DIR/hooks/pre-commit\"\n:\n", "pre-push.sample": "#!/bin/sh\n\n# An example hook script to verify what is about to be pushed.  Called by \"git\n# push\" after it has checked the remote status, but before anything has been\n# pushed.  If this script exits with a non-zero status nothing will be pushed.\n#\n# This hook is called with the following parameters:\n#\n# $1 -- Name of the remote to which the push is being done\n# $2 -- URL to which the push is being done\n#\n# If pushing without using a named remote those arguments will be equal.\n#\n# Information about the commits which are being pushed is supplied as lines to\n# the standard input in the form:\n#\n#   <local ref> <local oid> <remote ref> <remote oid>\n#\n# This sample shows how to prevent push of commits where the log message starts\n# with \"WIP\" (work in progress).\n\nremote=\"$1\"\nurl=\"$2\"\n\nzero=$(git hash-object --stdin <\/dev/null | tr '[0-9a-f]' '0')\n\nwhile read local_ref local_oid remote_ref remote_oid\ndo\n\tif test \"$local_oid\" = \"$zero\"\n\tthen\n\t\t# Handle delete\n\t\t:\n\telse\n\t\tif test \"$remote_oid\" = \"$zero\"\n\t\tthen\n\t\t\t# New branch, examine all commits\n\t\t\trange=\"$local_oid\"\n\t\telse\n\t\t\t# Update to existing branch, examine new commits\n\t\t\trange=\"$remote_oid..$local_oid\"\n\t\tfi\n\n\t\t# Check for WIP commit\n\t\tcommit=$(git rev-list -n 1 --grep '^WIP' \"$range\")\n\t\tif test -n \"$commit\"\n\t\tthen\n\t\t\techo >&2 \"Found WIP commit in $local_ref, not pushing\"\n\t\t\texit 1\n\t\tfi\n\tfi\ndone\n\nexit 0\n", "pre-rebase.sample": "#!/bin/sh\n#\n# Copyright (c) 2006, 2008 Junio C Hamano\n#\n# The \"pre-rebase\" hook is run just before \"git rebase\" starts doing\n# its job, and can prevent the command from running by exiting with\n# non-zero status.\n#\n# The hook is called with the following parameters:\n#\n# $1 -- the upstream the series was forked from.\n# $2 -- the branch being rebased (or empty when rebasing the current branch).\n#\n# This sample shows how to prevent topic branches that are already\n# merged to 'next' branch from getting rebased, because allowing it\n# would result in rebasing already published history.\n\npublish=next\nbasebranch=\"$1\"\nif test \"$#\" = 2\nthen\n\ttopic=\"refs/heads/$2\"\nelse\n\ttopic=`git symbolic-ref HEAD` ||\n\texit 0 ;# we do not interrupt rebasing detached HEAD\nfi\n\ncase \"$topic\" in\nrefs/heads/??/*)\n\t;;\n*)\n\texit 0 ;# we do not interrupt others.\n\t;;\nesac\n\n# Now we are dealing with a topic branch being rebased\n# on top of master.  Is it OK to rebase it?\n\n# Does the topic really exist?\ngit show-ref -q \"$topic\" || {\n\techo >&2 \"No such branch $topic\"\n\texit 1\n}\n\n# Is topic fully merged to master?\nnot_in_master=`git rev-list --pretty=oneline ^master \"$topic\"`\nif test -z \"$not_in_master\"\nthen\n\techo >&2 \"$topic is fully merged to master; better remove it.\"\n\texit 1 ;# we could allow it, but there is no point.\nfi\n\n# Is topic ever merged to next?  If so you should not be rebasing it.\nonly_next_1=`git rev-list ^master \"^$topic\" ${publish} | sort`\nonly_next_2=`git rev-list ^master           ${publish} | sort`\nif test \"$only_next_1\" = \"$only_next_2\"\nthen\n\tnot_in_topic=`git rev-list \"^$topic\" master`\n\tif test -z \"$not_in_topic\"\n\tthen\n\t\techo >&2 \"$topic is already up to date with master\"\n\t\texit 1 ;# we could allow it, but there is no point.\n\telse\n\t\texit 0\n\tfi\nelse\n\tnot_in_next=`git rev-list --pretty=oneline ^${publish} \"$topic\"`\n\t/usr/bin/perl -e '\n\t\tmy $topic = $ARGV[0];\n\t\tmy $msg = \"* $topic has commits already merged to public branch:\\n\";\n\t\tmy (%not_in_next) = map {\n\t\t\t/^([0-9a-f]+) /;\n\t\t\t($1 => 1);\n\t\t} split(/\\n/, $ARGV[1]);\n\t\tfor my $elem (map {\n\t\t\t\t/^([0-9a-f]+) (.*)$/;\n\t\t\t\t[$1 => $2];\n\t\t\t} split(/\\n/, $ARGV[2])) {\n\t\t\tif (!exists $not_in_next{$elem->[0]}) {\n\t\t\t\tif ($msg) {\n\t\t\t\t\tprint STDERR $msg;\n\t\t\t\t\tundef $msg;\n\t\t\t\t}\n\t\t\t\tprint STDERR \" $elem->[1]\\n\";\n\t\t\t}\n\t\t}\n\t' \"$topic\" \"$not_in_next\" \"$not_in_master\"\n\texit 1\nfi\n\n<<\\DOC_END\n\nThis sample hook safeguards topic branches that have been\npublished from being rewound.\n\nThe workflow assumed here is:\n\n * Once a topic branch forks from \"master\", \"master\" is never\n   merged into it again (either directly or indirectly).\n\n * Once a topic branch is fully cooked and merged into \"master\",\n   it is deleted.  If you need to build on top of it to correct\n   earlier mistakes, a new topic branch is created by forking at\n   the tip of the \"master\".  This is not strictly necessary, but\n   it makes it easier to keep your history simple.\n\n * Whenever you need to test or publish your changes to topic\n   branches, merge them into \"next\" branch.\n\nThe script, being an example, hardcodes the publish branch name\nto be \"next\", but it is trivial to make it configurable via\n$GIT_DIR/config mechanism.\n\nWith this workflow, you would want to know:\n\n(1) ... if a topic branch has ever been merged to \"next\".  Young\n    topic branches can have stupid mistakes you would rather\n    clean up before publishing, and things that have not been\n    merged into other branches can be easily rebased without\n    affecting other people.  But once it is published, you would\n    not want to rewind it.\n\n(2) ... if a topic branch has been fully merged to \"master\".\n    Then you can delete it.  More importantly, you should not\n    build on top of it -- other people may already want to\n    change things related to the topic as patches against your\n    \"master\", so if you need further changes, it is better to\n    fork the topic (perhaps with the same name) afresh from the\n    tip of \"master\".\n\nLet's look at this example:\n\n\t\t   o---o---o---o---o---o---o---o---o---o \"next\"\n\t\t  /       /           /           /\n\t\t /   a---a---b A     /           /\n\t\t/   /               /           /\n\t       /   /   c---c---c---c B         /\n\t      /   /   /             \\         /\n\t     /   /   /   b---b C     \\       /\n\t    /   /   /   /             \\     /\n    ---o---o---o---o---o---o---o---o---o---o---o \"master\"\n\n\nA, B and C are topic branches.\n\n * A has one fix since it was merged up to \"next\".\n\n * B has finished.  It has been fully merged up to \"master\" and \"next\",\n   and is ready to be deleted.\n\n * C has not merged to \"next\" at all.\n\nWe would want to allow C to be rebased, refuse A, and encourage\nB to be deleted.\n\nTo compute (1):\n\n\tgit rev-list ^master ^topic next\n\tgit rev-list ^master        next\n\n\tif these match, topic has not merged in next at all.\n\nTo compute (2):\n\n\tgit rev-list master..topic\n\n\tif this is empty, it is fully merged to \"master\".\n\nDOC_END\n", "pre-receive.sample": "#!/bin/sh\n#\n# An example hook script to make use of push options.\n# The example simply echoes all push options that start with 'echoback='\n# and rejects all pushes when the \"reject\" push option is used.\n#\n# To enable this hook, rename this file to \"pre-receive\".\n\nif test -n \"$GIT_PUSH_OPTION_COUNT\"\nthen\n\ti=0\n\twhile test \"$i\" -lt \"$GIT_PUSH_OPTION_COUNT\"\n\tdo\n\t\teval \"value=\\$GIT_PUSH_OPTION_$i\"\n\t\tcase \"$value\" in\n\t\techoback=*)\n\t\t\techo \"echo from the pre-receive-hook: ${value#*=}\" >&2\n\t\t\t;;\n\t\treject)\n\t\t\texit 1\n\t\tesac\n\t\ti=$((i + 1))\n\tdone\nfi\n", "prepare-commit-msg.sample": "#!/bin/sh\n#\n# An example hook script to prepare the commit log message.\n# Called by \"git commit\" with the name of the file that has the\n# commit message, followed by the description of the commit\n# message's source.  The hook's purpose is to edit the commit\n# message file.  If the hook fails with a non-zero status,\n# the commit is aborted.\n#\n# To enable this hook, rename this file to \"prepare-commit-msg\".\n\n# This hook includes three examples. The first one removes the\n# \"# Please enter the commit message...\" help message.\n#\n# The second includes the output of \"git diff --name-status -r\"\n# into the message, just before the \"git status\" output.  It is\n# commented because it doesn't cope with --amend or with squashed\n# commits.\n#\n# The third example adds a Signed-off-by line to the message, that can\n# still be edited.  This is rarely a good idea.\n\nCOMMIT_MSG_FILE=$1\nCOMMIT_SOURCE=$2\nSHA1=$3\n\n/usr/bin/perl -i.bak -ne 'print unless(m/^. Please enter the commit message/..m/^#$/)' \"$COMMIT_MSG_FILE\"\n\n# case \"$COMMIT_SOURCE,$SHA1\" in\n#  ,|template,)\n#    /usr/bin/perl -i.bak -pe '\n#       print \"\\n\" . `git diff --cached --name-status -r`\n# \t if /^#/ && $first++ == 0' \"$COMMIT_MSG_FILE\" ;;\n#  *) ;;\n# esac\n\n# SOB=$(git var GIT_COMMITTER_IDENT | sed -n 's/^\\(.*>\\).*$/Signed-off-by: \\1/p')\n# git interpret-trailers --in-place --trailer \"$SOB\" \"$COMMIT_MSG_FILE\"\n# if test -z \"$COMMIT_SOURCE\"\n# then\n#   /usr/bin/perl -i.bak -pe 'print \"\\n\" if !$first_line++' \"$COMMIT_MSG_FILE\"\n# fi\n", "push-to-checkout.sample": "#!/bin/sh\n\n# An example hook script to update a checked-out tree on a git push.\n#\n# This hook is invoked by git-receive-pack(1) when it reacts to git\n# push and updates reference(s) in its repository, and when the push\n# tries to update the branch that is currently checked out and the\n# receive.denyCurrentBranch configuration variable is set to\n# updateInstead.\n#\n# By default, such a push is refused if the working tree and the index\n# of the remote repository has any difference from the currently\n# checked out commit; when both the working tree and the index match\n# the current commit, they are updated to match the newly pushed tip\n# of the branch. This hook is to be used to override the default\n# behaviour; however the code below reimplements the default behaviour\n# as a starting point for convenient modification.\n#\n# The hook receives the commit with which the tip of the current\n# branch is going to be updated:\ncommit=$1\n\n# It can exit with a non-zero status to refuse the push (when it does\n# so, it must not modify the index or the working tree).\ndie () {\n\techo >&2 \"$*\"\n\texit 1\n}\n\n# Or it can make any necessary changes to the working tree and to the\n# index to bring them to the desired state when the tip of the current\n# branch is updated to the new commit, and exit with a zero status.\n#\n# For example, the hook can simply run git read-tree -u -m HEAD \"$1\"\n# in order to emulate git fetch that is run in the reverse direction\n# with git push, as the two-tree form of git read-tree -u -m is\n# essentially the same as git switch or git checkout that switches\n# branches while keeping the local changes in the working tree that do\n# not interfere with the difference between the branches.\n\n# The below is a more-or-less exact translation to shell of the C code\n# for the default behaviour for git's push-to-checkout hook defined in\n# the push_to_deploy() function in builtin/receive-pack.c.\n#\n# Note that the hook will be executed from the repository directory,\n# not from the working tree, so if you want to perform operations on\n# the working tree, you will have to adapt your code accordingly, e.g.\n# by adding \"cd ..\" or using relative paths.\n\nif ! git update-index -q --ignore-submodules --refresh\nthen\n\tdie \"Up-to-date check failed\"\nfi\n\nif ! git diff-files --quiet --ignore-submodules --\nthen\n\tdie \"Working directory has unstaged changes\"\nfi\n\n# This is a rough translation of:\n#\n#   head_has_history() ? \"HEAD\" : EMPTY_TREE_SHA1_HEX\nif git cat-file -e HEAD 2>/dev/null\nthen\n\thead=HEAD\nelse\n\thead=$(git hash-object -t tree --stdin <\/dev/null)\nfi\n\nif ! git diff-index --quiet --cached --ignore-submodules $head --\nthen\n\tdie \"Working directory has staged changes\"\nfi\n\nif ! git read-tree -u -m \"$commit\"\nthen\n\tdie \"Could not update working tree to new HEAD\"\nfi\n", "sendemail-validate.sample": "#!/bin/sh\n\n# An example hook script to validate a patch (and/or patch series) before\n# sending it via email.\n#\n# The hook should exit with non-zero status after issuing an appropriate\n# message if it wants to prevent the email(s) from being sent.\n#\n# To enable this hook, rename this file to \"sendemail-validate\".\n#\n# By default, it will only check that the patch(es) can be applied on top of\n# the default upstream branch without conflicts in a secondary worktree. After\n# validation (successful or not) of the last patch of a series, the worktree\n# will be deleted.\n#\n# The following config variables can be set to change the default remote and\n# remote ref that are used to apply the patches against:\n#\n#   sendemail.validateRemote (default: origin)\n#   sendemail.validateRemoteRef (default: HEAD)\n#\n# Replace the TODO placeholders with appropriate checks according to your\n# needs.\n\nvalidate_cover_letter () {\n\tfile=\"$1\"\n\t# TODO: Replace with appropriate checks (e.g. spell checking).\n\ttrue\n}\n\nvalidate_patch () {\n\tfile=\"$1\"\n\t# Ensure that the patch applies without conflicts.\n\tgit am -3 \"$file\" || return\n\t# TODO: Replace with appropriate checks for this patch\n\t# (e.g. checkpatch.pl).\n\ttrue\n}\n\nvalidate_series () {\n\t# TODO: Replace with appropriate checks for the whole series\n\t# (e.g. quick build, coding style checks, etc.).\n\ttrue\n}\n\n# main -------------------------------------------------------------------------\n\nif test \"$GIT_SENDEMAIL_FILE_COUNTER\" = 1\nthen\n\tremote=$(git config --default origin --get sendemail.validateRemote) &&\n\tref=$(git config --default HEAD --get sendemail.validateRemoteRef) &&\n\tworktree=$(mktemp --tmpdir -d sendemail-validate.XXXXXXX) &&\n\tgit worktree add -fd --checkout \"$worktree\" \"refs/remotes/$remote/$ref\" &&\n\tgit config --replace-all sendemail.validateWorktree \"$worktree\"\nelse\n\tworktree=$(git config --get sendemail.validateWorktree)\nfi || {\n\techo \"sendemail-validate: error: failed to prepare worktree\" >&2\n\texit 1\n}\n\nunset GIT_DIR GIT_WORK_TREE\ncd \"$worktree\" &&\n\nif grep -q \"^diff --git \" \"$1\"\nthen\n\tvalidate_patch \"$1\"\nelse\n\tvalidate_cover_letter \"$1\"\nfi &&\n\nif test \"$GIT_SENDEMAIL_FILE_COUNTER\" = \"$GIT_SENDEMAIL_FILE_TOTAL\"\nthen\n\tgit config --unset-all sendemail.validateWorktree &&\n\ttrap 'git worktree remove -ff \"$worktree\"' EXIT &&\n\tvalidate_series\nfi\n", "update.sample": "#!/bin/sh\n#\n# An example hook script to block unannotated tags from entering.\n# Called by \"git receive-pack\" with arguments: refname sha1-old sha1-new\n#\n# To enable this hook, rename this file to \"update\".\n#\n# Config\n# ------\n# hooks.allowunannotated\n#   This boolean sets whether unannotated tags will be allowed into the\n#   repository.  By default they won't be.\n# hooks.allowdeletetag\n#   This boolean sets whether deleting tags will be allowed in the\n#   repository.  By default they won't be.\n# hooks.allowmodifytag\n#   This boolean sets whether a tag may be modified after creation. By default\n#   it won't be.\n# hooks.allowdeletebranch\n#   This boolean sets whether deleting branches will be allowed in the\n#   repository.  By default they won't be.\n# hooks.denycreatebranch\n#   This boolean sets whether remotely creating branches will be denied\n#   in the repository.  By default this is allowed.\n#\n\n# --- Command line\nrefname=\"$1\"\noldrev=\"$2\"\nnewrev=\"$3\"\n\n# --- Safety check\nif [ -z \"$GIT_DIR\" ]; then\n\techo \"Don't run this script from the command line.\" >&2\n\techo \" (if you want, you could supply GIT_DIR then run\" >&2\n\techo \"  $0 <ref> <oldrev> <newrev>)\" >&2\n\texit 1\nfi\n\nif [ -z \"$refname\" -o -z \"$oldrev\" -o -z \"$newrev\" ]; then\n\techo \"usage: $0 <ref> <oldrev> <newrev>\" >&2\n\texit 1\nfi\n\n# --- Config\nallowunannotated=$(git config --type=bool hooks.allowunannotated)\nallowdeletebranch=$(git config --type=bool hooks.allowdeletebranch)\ndenycreatebranch=$(git config --type=bool hooks.denycreatebranch)\nallowdeletetag=$(git config --type=bool hooks.allowdeletetag)\nallowmodifytag=$(git config --type=bool hooks.allowmodifytag)\n\n# check for no description\nprojectdesc=$(sed -e '1q' \"$GIT_DIR/description\")\ncase \"$projectdesc\" in\n\"Unnamed repository\"* | \"\")\n\techo \"*** Project description file hasn't been set\" >&2\n\texit 1\n\t;;\nesac\n\n# --- Check types\n# if $newrev is 0000...0000, it's a commit to delete a ref.\nzero=$(git hash-object --stdin <\/dev/null | tr '[0-9a-f]' '0')\nif [ \"$newrev\" = \"$zero\" ]; then\n\tnewrev_type=delete\nelse\n\tnewrev_type=$(git cat-file -t $newrev)\nfi\n\ncase \"$refname\",\"$newrev_type\" in\n\trefs/tags/*,commit)\n\t\t# un-annotated tag\n\t\tshort_refname=${refname##refs/tags/}\n\t\tif [ \"$allowunannotated\" != \"true\" ]; then\n\t\t\techo \"*** The un-annotated tag, $short_refname, is not allowed in this repository\" >&2\n\t\t\techo \"*** Use 'git tag [ -a | -s ]' for tags you want to propagate.\" >&2\n\t\t\texit 1\n\t\tfi\n\t\t;;\n\trefs/tags/*,delete)\n\t\t# delete tag\n\t\tif [ \"$allowdeletetag\" != \"true\" ]; then\n\t\t\techo \"*** Deleting a tag is not allowed in this repository\" >&2\n\t\t\texit 1\n\t\tfi\n\t\t;;\n\trefs/tags/*,tag)\n\t\t# annotated tag\n\t\tif [ \"$allowmodifytag\" != \"true\" ] && git rev-parse $refname > /dev/null 2>&1\n\t\tthen\n\t\t\techo \"*** Tag '$refname' already exists.\" >&2\n\t\t\techo \"*** Modifying a tag is not allowed in this repository.\" >&2\n\t\t\texit 1\n\t\tfi\n\t\t;;\n\trefs/heads/*,commit)\n\t\t# branch\n\t\tif [ \"$oldrev\" = \"$zero\" -a \"$denycreatebranch\" = \"true\" ]; then\n\t\t\techo \"*** Creating a branch is not allowed in this repository\" >&2\n\t\t\texit 1\n\t\tfi\n\t\t;;\n\trefs/heads/*,delete)\n\t\t# delete branch\n\t\tif [ \"$allowdeletebranch\" != \"true\" ]; then\n\t\t\techo \"*** Deleting a branch is not allowed in this repository\" >&2\n\t\t\texit 1\n\t\tfi\n\t\t;;\n\trefs/remotes/*,commit)\n\t\t# tracking branch\n\t\t;;\n\trefs/remotes/*,delete)\n\t\t# delete tracking branch\n\t\tif [ \"$allowdeletebranch\" != \"true\" ]; then\n\t\t\techo \"*** Deleting a tracking branch is not allowed in this repository\" >&2\n\t\t\texit 1\n\t\tfi\n\t\t;;\n\t*)\n\t\t# Anything else (is there anything else?)\n\t\techo \"*** Update hook: unknown type of update to ref $refname of type $newrev_type\" >&2\n\t\texit 1\n\t\t;;\nesac\n\n# --- Finished\nexit 0\n"};
  var GIT_EXCLUDE="# git ls-files --others --exclude-from=.git/info/exclude\n# Lines that start with '#' are comments.\n# For a project mostly in C, the following would be a good set of\n# exclude patterns (uncomment them if you want to use them):\n# *.[oa]\n# *~\n";
  function u8(str){return new TextEncoder().encode(str)}
  function cat8(list){var n=0;list.forEach(function(x){n+=x.length});var o=new Uint8Array(n),k=0;list.forEach(function(x){o.set(x,k);k+=x.length});return o}
  function hex2b(h){var o=new Uint8Array(h.length/2);for(var i=0;i<o.length;i++)o[i]=parseInt(h.substr(i*2,2),16);return o}
  function sha1(b){var H0=0x67452301,H1=0xEFCDAB89,H2=0x98BADCFE,H3=0x10325476,H4=0xC3D2E1F0,ml=b.length,nb=((ml+9+63)>>6)<<6,m=new Uint8Array(nb),w=new Int32Array(80);m.set(b);m[ml]=0x80;
    var bits=ml*8;m[nb-4]=bits>>>24;m[nb-3]=(bits>>>16)&255;m[nb-2]=(bits>>>8)&255;m[nb-1]=bits&255;var hi=Math.floor(ml/536870912);m[nb-8]=hi>>>24;m[nb-7]=(hi>>>16)&255;m[nb-6]=(hi>>>8)&255;m[nb-5]=hi&255;
    for(var i=0;i<nb;i+=64){for(var t=0;t<16;t++)w[t]=(m[i+t*4]<<24)|(m[i+t*4+1]<<16)|(m[i+t*4+2]<<8)|m[i+t*4+3];for(t=16;t<80;t++){var x=w[t-3]^w[t-8]^w[t-14]^w[t-16];w[t]=(x<<1)|(x>>>31)}
      var A=H0,B=H1,C2=H2,D=H3,E=H4;for(t=0;t<80;t++){var f,k;if(t<20){f=(B&C2)|(~B&D);k=0x5A827999}else if(t<40){f=B^C2^D;k=0x6ED9EBA1}else if(t<60){f=(B&C2)|(B&D)|(C2&D);k=0x8F1BBCDC}else{f=B^C2^D;k=0xCA62C1D6}
        var tmp=(((A<<5)|(A>>>27))+f+E+k+w[t])|0;E=D;D=C2;C2=(B<<30)|(B>>>2);B=A;A=tmp}
      H0=(H0+A)|0;H1=(H1+B)|0;H2=(H2+C2)|0;H3=(H3+D)|0;H4=(H4+E)|0}
    return [H0,H1,H2,H3,H4].map(function(v){return ('00000000'+(v>>>0).toString(16)).slice(-8)}).join('')}
  /* zlib with stored (uncompressed) blocks: a valid zlib stream, starting with 0x78 0x01 like Git's objects */
  function zlibStore(b){var parts=[new Uint8Array([0x78,0x01])],i=0;do{var n=Math.min(65535,b.length-i),last=i+n>=b.length?1:0;parts.push(new Uint8Array([last,n&255,n>>8,(~n)&255,((~n)>>8)&255]));parts.push(b.subarray(i,i+n));i+=n}while(i<b.length);
    var a1=1,a2=0;for(var j=0;j<b.length;j++){a1=(a1+b[j])%65521;a2=(a2+a1)%65521}parts.push(new Uint8Array([a2>>8,a2&255,a1>>8,a1&255]));return cat8(parts)}
  function b64of(b){var s0='';for(var i=0;i<b.length;i+=32768)s0+=String.fromCharCode.apply(null,b.subarray(i,i+32768));return btoa(s0)}
  function bytesOf(t){if(isBin(t)){var bi=binInfo(t);if(!bi||bi.b64==null)return null;var s2=atob(bi.b64),o=new Uint8Array(s2.length);for(var i=0;i<s2.length;i++)o[i]=s2.charCodeAt(i);return o}return u8(t)}
  var GOBJ={},GBLOB={},GTREE={};
  function gobj(type,body){var hd=u8(type+' '+body.length+'\u0000'),raw=cat8([hd,body]),h=sha1(raw);if(!GOBJ[h])GOBJ[h]={t:type,body:body,z:null};return h}
  function gobjFile(h){var o=GOBJ[h];if(!o.z)o.z=binReg('gitobj:'+h,b64of(zlibStore(cat8([u8(o.t+' '+o.body.length+'\u0000'),o.body]))),'application/x-git-object','object');return o.z}
  function gblob(t){if(t in GBLOB)return GBLOB[t];var b=bytesOf(t),h;
    if(b)h=gobj('blob',b);else{var bi=binInfo(t);h=sha1(u8('lazy:'+(bi?bi.name+bi.size:t)));if(!GOBJ[h])GOBJ[h]={t:'blob',body:u8('(this file is fetched when it is needed)'),z:null}}
    GBLOB[t]=h;return h}
  /* a folder becomes a tree: mode, name and the SHA-1 of each entry, in Git's order */
  function gtree(files){var top={},subs={};keys(files).forEach(function(f){var i=f.indexOf('/');if(i<0)top[f]=gblob(files[f]);else{var d=f.slice(0,i);(subs[d]=subs[d]||{})[f.slice(i+1)]=files[f]}});
    var ents=keys(top).map(function(n){return {n:n,m:'100644',h:top[n],k:n}}).concat(keys(subs).map(function(d){return {n:d,m:'40000',h:gtree(subs[d]),k:d+'/'}}));
    ents.sort(function(x,y){return x.k<y.k?-1:x.k>y.k?1:0});var key=ents.map(function(e){return e.m+' '+e.n+' '+e.h}).join('\n');if(key in GTREE)return GTREE[key];
    var body=cat8(ents.map(function(e){return cat8([u8(e.m+' '+e.n+'\u0000'),hex2b(e.h)])}));return GTREE[key]=gobj('tree',body)}
  function gwho(c){var nm=c.who||S.cfg.name||'you',em=c.who==='Roli'?'roli@example.com':(S.cfg.email||'you@example.com');return nm+' <'+em+'> '+Math.floor(Date.UTC(2026,10,1,22,10+c.n%50)/1000)+' +0000'}
  function gcommit(r,c){if(c.gobj&&GOBJ[c.gobj])return c.gobj;if(c.full&&c.ts&&!c.gobj){var em0=c.email||(c.who==='Roli'?'roli@example.com':(S.cfg.email||'you@example.com')),wh=c.who+' <'+em0+'> '+c.ts+' '+(c.tz||'+0000'),tx0='tree '+gtree(c.files)+'\n'+c.p.map(function(q){return 'parent '+fullid(q)+'\n'}).join('')+'author '+wh+'\ncommitter '+wh+'\n\n'+c.msg+'\n';GOBJ[c.full]={t:'commit',body:u8(tx0),z:null};c.gobj=c.full;return c.full}var tx='tree '+gtree(c.files)+'\n'+c.p.map(function(q){return 'parent '+fullid(q)+'\n'}).join('')+'author '+gwho(c)+'\ncommitter '+gwho(c)+'\n\n'+c.msg+'\n';
    var h=fullid(c.id),body=u8(tx);GOBJ[h]={t:'commit',body:body,z:null};c.gobj=h;return h}
  function tzs(){var o=-new Date().getTimezoneOffset(),a=Math.abs(o);return (o<0?'-':'+')+('0'+Math.floor(a/60)).slice(-2)+('0'+a%60).slice(-2)}
  /* Git's binary index (DIRC version 2): one entry per staged file, then a SHA-1 of it all */
  function gindex(r){var ps=keys(r.index).sort(function(x,y){return x<y?-1:x>y?1:0}),hd=new Uint8Array(12),dv=new DataView(hd.buffer);hd.set(u8('DIRC'));dv.setUint32(4,2);dv.setUint32(8,ps.length);
    var parts=[hd];ps.forEach(function(f){var b=bytesOf(r.index[f]),size=b?b.length:0,nm=u8(f),len=62+nm.length,pad=8-(len%8),e=new Uint8Array(len+pad),v=new DataView(e.buffer),ts=1793570000;
      v.setUint32(0,ts);v.setUint32(8,ts);v.setUint32(24,0x81A4);v.setUint32(36,size);e.set(hex2b(gblob(r.index[f])),40);v.setUint16(60,Math.min(nm.length,0xFFF));e.set(nm,62);parts.push(e)});
    var all=cat8(parts);return cat8([all,hex2b(sha1(all))])}
  /* the reflog: every time HEAD or a branch moves, one line, with the reason real Git writes */
  var lastCmd='';
  function gReflog(r){var cur={head:r.head,det:r.det||null,br:copy(r.br),rbr:copy(r.rbr||{})},sn=r.snap;r.rlog=r.rlog||{};r.snap=cur;
    if(!sn){var hn=cur.br[cur.head];if(/^\s*git\s+clone\b/.test(lastCmd)&&hn){var w0=(S.cfg.name||'you')+' <'+(S.cfg.email||'you@example.com')+'> '+Math.floor(Date.now()/1000)+' '+tzs(),u0=tok(lastCmd).filter(function(x,i){return i>1&&x[0]!=='-'})[0]||'';
        ['HEAD','refs/heads/'+cur.head].forEach(function(ref){r.rlog[ref]=['0000000000000000000000000000000000000000 '+fullid(hn)+' '+w0+'\tclone: from '+u0]})}return}
    var Z='0000000000000000000000000000000000000000',who=(S.cfg.name||'you')+' <'+(S.cfg.email||'you@example.com')+'> '+Math.floor(Date.now()/1000)+' '+tzs();
    var t=tok(lastCmd||''),g=t[0]==='git'?t[1]:t[0],arg=t.slice(2).filter(function(x){return x[0]!=='-'}),C0=function(id){return id&&r.cm[id]};
    function add(ref,o,n,why){(r.rlog[ref]=r.rlog[ref]||[]).push((o?fullid(o):Z)+' '+(n?fullid(n):Z)+' '+who+'\t'+why)}
    function why(o,n,isHead){var c=C0(n),m=c?c.msg.split('\n')[0]:'';
      if(g==='commit')return 'commit'+(t.indexOf('--amend')>=0?' (amend)':!o?' (initial)':c&&c.p.length>1?' (merge)':'')+': '+m;
      if(g==='merge'||g==='pull'){var ff=c&&c.p.length<2;return g+(g==='merge'?' '+(arg[0]||''):'')+': '+(ff?'Fast-forward':"Merge made by the 'ort' strategy.")}
      if(g==='reset')return 'reset: moving to '+(arg[0]||'HEAD');
      if(g==='revert')return 'revert: '+m;
      if(g==='rebase')return isHead?'rebase (finish): returning to refs/heads/'+cur.head:'rebase (finish): refs/heads/'+cur.head+' onto '+fullid(n);
      if(g==='clone')return 'clone: from '+(arg[0]||'');
      if(g==='cherry-pick')return 'cherry-pick: '+m;
      if(g==='stash')return 'reset: moving to HEAD';
      return (g||'update')+': '+(m||'moving')}
    var hO=sn.det||sn.br[sn.head],hN=cur.det||cur.br[cur.head],moved=sn.head!==cur.head||!!sn.det!==!!cur.det;
    var bs={};keys(sn.br).concat(keys(cur.br)).forEach(function(b){bs[b]=1});
    keys(bs).forEach(function(b){var o=sn.br[b],n=cur.br[b];if(o===n)return;var ref='refs/heads/'+b;
      if(!n){if(g==='branch'&&(t.indexOf('-m')>=0||t.indexOf('-M')>=0)&&arg[1]&&cur.br[arg[1]]===o){r.rlog['refs/heads/'+arg[1]]=(r.rlog[ref]||[]).concat([]);add('refs/heads/'+arg[1],o,o,'Branch: renamed '+ref+' to refs/heads/'+arg[1])}delete r.rlog[ref];return}
      if(!o){if(g==='branch'&&(t.indexOf('-m')>=0||t.indexOf('-M')>=0))return;add(ref,null,n,g==='clone'?'clone: from '+(arg[0]||''):(g==='switch'||g==='checkout')?'branch: Created from '+(arg[1]||'HEAD'):(g==='branch'?'branch: Created from '+(arg[1]||sn.head):(g==='fetch'||g==='pull'?'branch: Created from origin/'+b:why(o,n))));return}
      add(ref,o,n,why(o,n))});
    if(hO!==hN||moved){var w2=moved&&(g==='switch'||g==='checkout')?'checkout: moving from '+(sn.det?fullid(sn.det):sn.head)+' to '+(cur.det?(arg[0]||fullid(cur.det)):cur.head):why(hO,hN,true);
      if(g==='commit'||!moved||g==='switch'||g==='checkout'||g==='clone')add('HEAD',hO,hN,w2);else add('HEAD',hO,hN,w2);
      if(/^(reset|merge|pull|rebase)$/.test(g)&&hO)r.origHead=hO}
    var rs={};keys(sn.rbr).concat(keys(cur.rbr)).forEach(function(b){rs[b]=1});
    keys(rs).forEach(function(b){var o=sn.rbr[b],n=cur.rbr[b],ref='refs/remotes/origin/'+b;if(o===n)return;if(!n){delete r.rlog[ref];return}
      if(g==='clone')return;add(ref,o,n,g==='push'||g==='gh'?'update by push':(!o?'storing head':g==='pull'?'pull: fast-forward':'fetch: fast-forward'))})}
  function gitDirFiles(r){var f={},d=['branches','hooks','info','objects','objects/info','objects/pack','refs','refs/heads','refs/tags'],up=r.up||{},Cr=function(id){return r.cm[id]};
    f['HEAD']=r.det?fullid(r.det)+'\n':'ref: refs/heads/'+r.head+'\n';
    var cfg='[core]\n\trepositoryformatversion = 0\n\tfilemode = false\n\tbare = false\n\tlogallrefupdates = true\n\tsymlinks = false\n\tignorecase = true\n';
    if(r.remote&&r.remote.url){cfg+='[remote "origin"]\n\turl = '+r.remote.url+'\n\tfetch = +refs/heads/*:refs/remotes/origin/*\n';keys(up).forEach(function(b){if(up[b]&&b in r.br)cfg+='[branch "'+b+'"]\n\tremote = origin\n\tmerge = refs/heads/'+b+'\n'})}
    f['config']=cfg;f['description']="Unnamed repository; edit this file 'description' to name the repository.\n";
    keys(GIT_HOOKS).forEach(function(h){f['hooks/'+h]=GIT_HOOKS[h]});f['info/exclude']=GIT_EXCLUDE;
    keys(r.br).forEach(function(b){if(r.br[b])f['refs/heads/'+b]=fullid(r.br[b])+'\n'});
    keys(r.tags||{}).forEach(function(t){f['refs/tags/'+t]=fullid(r.tags[t].id)+'\n'});
    var rb=keys(r.rbr||{}).filter(function(b){return r.rbr[b]});if(rb.length){d.push('refs/remotes','refs/remotes/origin');rb.forEach(function(b){f['refs/remotes/origin/'+b]=fullid(r.rbr[b])+'\n'})}
    if(r.stash&&r.stash.length){f['refs/stash']=fullid(r.stash[0].id)+'\n'}
    /* objects: every commit you can reach, its trees and its files, plus what is staged (git add makes the blob) */
    var objs={},seen={};function own(h){objs[h]=1}
    keys(r.br).map(function(b){return r.br[b]}).concat(r.det?[r.det]:[],rb.map(function(b){return r.rbr[b]})).forEach(function(t){var st=[t];while(st.length){var id=st.pop();if(!id||seen[id]||!Cr(id))continue;seen[id]=1;var c=Cr(id);
      if(!c.hidden){own(gcommit(r,c));var th=gtree(c.files);own(th);(function walk(h){var o=GOBJ[h];if(!o||o.t!=='tree')return;var b=o.body,i=0;while(i<b.length){var sp=b.indexOf(32,i),nul=b.indexOf(0,sp),hx='';for(var k=nul+1;k<nul+21;k++)hx+=('0'+b[k].toString(16)).slice(-2);var md=new TextDecoder().decode(b.subarray(i,sp));own(hx);if(md==='40000')walk(hx);i=nul+21}})(th)}
      c.p.forEach(function(q){st.push(q)})}});
    keys(r.index).forEach(function(x){own(gblob(r.index[x]))});
    keys(objs).forEach(function(h){var dd='objects/'+h.slice(0,2);if(d.indexOf(dd)<0)d.push(dd);f[dd+'/'+h.slice(2)]=gobjFile(h)});
    r.objs=objs;
    if(keys(r.index).length)f['index']=binReg('gitidx:'+sha1(gindex(r)),b64of(gindex(r)),'application/x-git-index','index');
    var hc=r.det||r.br[r.head];if(hc&&Cr(hc))f['COMMIT_EDITMSG']=Cr(hc).msg+'\n';
    if(r.origHead&&Cr(r.origHead))f['ORIG_HEAD']=fullid(r.origHead)+'\n';
    if(r.merge&&r.merge.other){f['MERGE_HEAD']=fullid(r.merge.other)+'\n';f['MERGE_MODE']='';f['MERGE_MSG']=(r.merge.msg||'Merge')+'\n'+(keys(r.conf).length?'\n# Conflicts:\n'+keys(r.conf).map(function(x){return '#\t'+x+'\n'}).join(''):'')}
    /* logs/ */
    var rl=r.rlog||{};keys(rl).forEach(function(ref){if(!rl[ref].length)return;var p2=ref.split('/');for(var i=1;i<p2.length;i++){var dd='logs/'+p2.slice(0,i).join('/');if(d.indexOf(dd)<0)d.push(dd)}if(d.indexOf('logs')<0)d.push('logs');f['logs/'+ref]=rl[ref].join('\n')+'\n'});
    if(r.stash&&r.stash.length){['logs','logs/refs'].forEach(function(x){if(d.indexOf(x)<0)d.push(x)});f['logs/refs/stash']=r.stash.slice().reverse().map(function(e,i,a){return (i?fullid(a[i-1].id):'0000000000000000000000000000000000000000')+' '+fullid(e.id)+' '+(S.cfg.name||'you')+' <'+(S.cfg.email||'you@example.com')+'> '+Math.floor(Date.now()/1000)+' '+tzs()+'\t'+e.label}).join('\n')+'\n'}
    return {dirs:d,files:f}}
  function gitDirSync(){if(!S||!S.repos)return;var want={},wantD={};
    keys(S.repos).forEach(function(rt){var r=S.repos[rt];if(!r||!S.dirs[rt])return;var g=rt+'/.git';
      /* rm -rf .git: the files stay, but the folder is not a repo any more (its history is gone) */
      if(r.gitMade&&!S.dirs[g]){delete S.repos[rt];if(under(S.cwd,g))S.cwd=rt;return}
      r.gitMade=true;gReflog(r);var v=gitDirFiles(r);wantD[g]=1;v.dirs.forEach(function(x){wantD[g+'/'+x]=1});keys(v.files).forEach(function(x){want[g+'/'+x]=v.files[x]})});
    keys(S.files).forEach(function(f){if(hasGit(f)&&!(f in want))delete S.files[f]});
    keys(S.dirs).forEach(function(d){if(hasGit(d)&&!wantD[d])delete S.dirs[d]});
    keys(want).forEach(function(f){if(S.files[f]!==want[f])S.files[f]=want[f]});keys(wantD).forEach(function(d){S.dirs[d]=1});
    if(!S.dirs[S.cwd])S.cwd=HOME}
  /* Git Bash's ls sorts with Windows' CompareStringEx (Cygwin's wcscoll): names starting with . or _ first, then digits,
     then letters ignoring case (lowercase first on a tie); - and ' do not count */
  var WSYM=" !\"#$%&()*,./:;?@[\\]^_`{|}~+<=>";
  function winSortKey(n){var pk='',tk='';for(var i=0;i<n.length;i++){var c=n.charAt(i);if(c==='-'||c==="'")continue;var l=c.toLowerCase(),w;
      if(/[0-9]/.test(c))w=200+(+c);else if(l!==c.toUpperCase()||/[a-z]/i.test(c))w=300+l.charCodeAt(0);else{var k=WSYM.indexOf(c);w=k>=0?10+k:100+c.charCodeAt(0)%90}
      pk+=String.fromCharCode(w);tk+=c===l?'0':'1'}return pk+'\u0000'+tk+'\u0000'+n}
  function promptHtml(){var d=S.cwd.replace(HOME,'~'),b='';
    if(S.repo&&under(S.cwd,S.repo.root+'/.git'))b=' <span class="c">(GIT_DIR!)</span>';
    else if(S.repo&&(S.cwd===S.repo.root||S.cwd.indexOf(S.repo.root+'/')===0))b=' <span class="c">('+(S.repo.det?'('+S.repo.det+'...)':esc(S.repo.head))+')</span>';
    return '<span class="g">you@laptop</span> <span class="p">MINGW64</span> <span class="y">'+esc(d)+'</span>'+b+'<br>$ '}
  function setPrompt(){gitDirSync();ps.innerHTML=promptHtml().replace('<br>$ ','');if(window.mlTermBar)try{window.mlTermBar()}catch(z){}}
  /* Git Bash's GitHub login: real (with the account) or the Mini laptop's pretend GitHub */
  function termAuth(){var t=tvCur==='term'?RL:(TV.term&&TV.term.rl)||{};return {on:!!t.on,login:t.login||'',busy:tvCur==='term'&&(busy||pend)}}
  function run(line){
    if(scripting&&tvCur!=='lab'&&!termPaste)tvUse('lab');
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
      z4='<div class="url">'+esc(rm.url)+'</div>'+(bs.length?bs.map(function(b){var tip=rm.br[b];var n=reach(tip).length;var ahead='';return '<div class="rb"><b>'+esc(b)+'</b> <span>'+tip+'</span> <small>'+Math.max(n,1)+' commit'+(n===1?'':'s')+'</small>'+ahead+'</div>'}).join(''):'<i class="empty">Connected, but empty. Try: git push -u origin main</i>')}
    else z4='<i class="empty">Not connected. Try: git remote add origin URL</i>';
    var z5='';if(S.repo&&S.repo.remote){var tk=track();
      z5=!tk?(S.repo.rbr[S.repo.head]?'':'<b>Your laptop:</b> has not talked to GitHub about <b>'+esc(S.repo.head)+'</b> yet.')
        :'<b>As of your last fetch:</b> '+(!tk.ah&&!tk.bh?'up to date with GitHub.':!tk.ah?'GitHub has <b>'+cmt(tk.bh)+'</b> you don\'t have. <code>git pull</code> brings '+(tk.bh===1?'it':'them')+' in.'
          :!tk.bh?'you have <b>'+cmt(tk.ah)+'</b> GitHub doesn\'t have. <code>git push</code> sends '+(tk.ah===1?'it':'them')+' up.':'you and GitHub both have new commits ('+tk.ah+' and '+tk.bh+'). <code>git pull</code> joins them.')
          +' <small>Git only checks GitHub when you type git fetch or git pull.</small>'}
    return {z1:z1,z2:z2,z3:z3,z4:z4,z5:z5};
  }
  function commitChanges(c){var o=c.p.length?C(c.p[0]).files:{},n=c.files,r={add:[],mod:[],del:[]};
    keys(n).forEach(function(f){if(!(f in o))r.add.push(f);else if(o[f]!==n[f])r.mod.push(f)});keys(o).forEach(function(f){if(!(f in n))r.del.push(f)});
    r.add.sort();r.mod.sort();r.del.sort();return r}
  function commitPop(id){var c=C(id);if(!c||!window.gitPop)return;var ch=commitChanges(c),row=function(cls,sym,f){return '<div class="cpf '+cls+'"><b>'+sym+'</b>'+esc(f)+'</div>'};
    var body='<div class="cpmsg">'+esc(c.msg)+'</div><div class="cpmeta">'+c.id+' &middot; '+esc(c.who)+(c.p.length>1?' &middot; merge':'')+'</div>'
      +(ch.add.length||ch.mod.length||ch.del.length?ch.add.map(function(f){return row('cpa','+',f)}).join('')+ch.mod.map(function(f){return row('cpm','~',f)}).join('')+ch.del.map(function(f){return row('cpd','\u2212',f)}).join(''):'<div class="cpf">No file changes.</div>')
      +(ch.del.length?'<p class="cpnote">Deleted files are not gone forever: they are still in the commits before this one. <code>git revert '+c.id+'</code> brings them back.</p>':'')
      +'<p class="cpnote">In real Git: <code>git show --stat '+c.id+'</code></p>';
    window.gitPop('warn','COMMIT '+c.id,body,[{t:'Close'}])}
  function graph(){
    if(!S.repo)return '<i class="empty">Your commits will be drawn here.</i>';
    /* only commits something still points at (a branch, origin/..., a tag), like git log: after git reset --hard the dropped ones disappear */
    var r=R(),seen0={};keys(r.br).map(function(b){return r.br[b]}).concat(r.det?[r.det]:[]).concat(keys(r.rbr||{}).map(function(b){return r.rbr[b]}),keys(r.tags||{}).map(function(t){return r.tags[t].id})).forEach(function(t){if(t)keys(anc(t)).forEach(function(k){seen0[k]=1})});
    var cs=visible().filter(function(c){return seen0[c.id]});if(!cs.length)return '<i class="empty">No commits yet. Try: git add, then git commit -m "..."</i>';
    var bn=keys(r.br).filter(function(b){return r.br[b]}).sort(function(x,y){return x==='main'?-1:y==='main'?1:x<y?-1:1});
    var ln=0,owner={},laneName=[];
    bn.forEach(function(b){var x=r.br[b],mine=false;while(x&&!(x in owner)){if(!C(x).hidden){owner[x]=ln;mine=true}x=C(x).p[0]}if(mine){laneName[ln]=b;ln++}});
    keys(r.rbr||{}).sort().forEach(function(b){var x=r.rbr[b],mine=false;while(x&&!(x in owner)){if(!C(x).hidden){owner[x]=ln;mine=true}x=C(x).p[0]}if(mine){laneName[ln]='origin/'+b;ln++}});
    ln=Math.max(ln,1);if(!laneName[0])laneName[0]=r.head;
    /* commits keep a readable spacing; a long history makes the graph wider and it scrolls sideways (newest end first) */
    var n=cs.length,G=86,W0=470,step=n>1?84:0,W=Math.max(W0,G+44+(n-1)*step+50),mc=Math.max(7,Math.floor(step/7.6)),pad=64,LH=96;
    var X=function(i){return G+44+i*step},Y=function(l){return pad+l*LH},H=Y(ln-1)+72,pos={};
    cs.forEach(function(c,i){var l=owner[c.id];if(l===undefined)l=0;pos[c.id]={x:X(i),y:Y(l),l:l}});
    var s=(W>W0?'<div class="gwrap"><div class="gscroll"><svg viewBox="0 0 '+W+' '+H+'" style="width:'+(W/W0*100).toFixed(1)+'%;max-width:none" role="img" aria-label="Commit graph, scroll sideways to see older commits">':'<div class="gwrap"><div class="gscroll"><svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Commit graph">');
    var lanes='<svg class="glanes" viewBox="0 0 '+(G-4)+' '+H+'" style="width:'+((G-4)/W0*100).toFixed(2)+'%" aria-hidden="true"><rect x="0" y="0" width="'+(G-4)+'" height="'+H+'" fill="#fff"/>';
    for(var l=0;l<ln;l++){var nm=laneName[l]||'';var og=nm.indexOf('origin/')===0,w=og?Math.min(78,nm.length*6.1+10):Math.min(78,nm.length*7.4+16);
      s+='<line x1="'+(G-6)+'" y1="'+Y(l)+'" x2="'+(W-8)+'" y2="'+Y(l)+'" stroke="#e1e9fb" stroke-width="2" stroke-dasharray="3 5"/>';
      if(og)lanes+='<rect x="6" y="'+(Y(l)-11)+'" width="'+w+'" height="22" rx="5" fill="#fff" stroke="#16327a" stroke-width="2" stroke-dasharray="4 2"/><text x="'+(6+w/2)+'" y="'+(Y(l)+4)+'" text-anchor="middle" font-size="10.5" font-weight="800" fill="#16327a" font-family="Nunito,sans-serif">'+esc(nm.length>12?nm.slice(0,11)+'…':nm)+'</text>';
      else lanes+='<rect x="6" y="'+(Y(l)-11)+'" width="'+w+'" height="22" rx="5" fill="'+LC[l%5]+'" stroke="#16327a" stroke-width="2"/><text x="'+(6+w/2)+'" y="'+(Y(l)+4)+'" text-anchor="middle" font-size="12" font-weight="800" fill="#fff" font-family="Nunito,sans-serif">'+esc(nm.length>9?nm.slice(0,8)+'…':nm)+'</text>'}
    lanes+='</svg>';
    cs.forEach(function(c){c.p.forEach(function(q){var a=pos[q],b=pos[c.id];if(!a)return;
      if(a.y===b.y)s+='<line x1="'+a.x+'" y1="'+a.y+'" x2="'+b.x+'" y2="'+b.y+'" stroke="'+LC[b.l%5]+'" stroke-width="5" stroke-linecap="round"/>';
      else s+='<path d="M'+a.x+' '+a.y+' C '+(a.x+step*.55)+' '+a.y+' '+(b.x-step*.55)+' '+b.y+' '+b.x+' '+b.y+'" fill="none" stroke="'+LC[Math.max(a.l,b.l)%5]+'" stroke-width="5" stroke-linecap="round"/>'})});
    var tips={};if(r.det&&pos[r.det])tips[r.det]=['HEAD'];bn.forEach(function(b){var t=r.br[b];if(t&&pos[t])(tips[t]=tips[t]||[]).push(b)});
    keys(r.rbr||{}).sort().forEach(function(b){var t=r.rbr[b];if(t&&pos[t])(tips[t]=tips[t]||[]).push('origin/'+b)});
    keys(r.tags||{}).sort().forEach(function(tg){var t=r.tags[tg].id;if(t&&pos[t])(tips[t]=tips[t]||[]).push('tag: '+tg)});
    var cloud='<path d="M0 6a3 3 0 0 1 4.6-2.5A3.8 3.8 0 0 1 11.8 5a2.5 2.5 0 0 1-.6 4.9H2.4A2.6 2.6 0 0 1 0 6z" fill="#fff" stroke="#16327a" stroke-width="1.2"/>';
    cs.forEach(function(c){var p=pos[c.id],mrg=c.p.length>1;
      var msg=c.msg.length>mc?c.msg.slice(0,mc-1)+'…':c.msg;
      /* what this commit did to the files: +added ~changed -deleted (click the commit for the list) */
      var ch=commitChanges(c),bits=[];if(ch.add.length)bits.push('<tspan fill="#2e9e4f">+'+ch.add.length+'</tspan>');if(ch.mod.length)bits.push('<tspan fill="#c98a1b">~'+ch.mod.length+'</tspan>');if(ch.del.length)bits.push('<tspan fill="#d0342c">\u2212'+ch.del.length+'</tspan>');
      var tip=(ch.add.length?'added: '+ch.add.join(', ')+'\n':'')+(ch.mod.length?'changed: '+ch.mod.join(', ')+'\n':'')+(ch.del.length?'deleted: '+ch.del.join(', ')+'\n':'');
      s+='<g class="gn" data-c="'+c.id+'" role="button" tabindex="0" aria-label="Commit '+c.id+': '+esc(c.msg)+'. '+esc(tip.replace(/\n/g,'. '))+'"><title>'+esc(c.id+' '+c.msg+'\n'+(tip||'no file changes'))+'</title><circle cx="'+p.x+'" cy="'+p.y+'" r="13" fill="'+LC[p.l%5]+'" stroke="#16327a" stroke-width="3"/>'+(mrg?'<circle cx="'+p.x+'" cy="'+p.y+'" r="5" fill="#fff"/>':'')
       +'<text x="'+p.x+'" y="'+(p.y+31)+'" text-anchor="middle" font-size="11.5" font-weight="800" font-family="Nunito,sans-serif" fill="#16327a">'+esc(msg)+'</text>'
       +'<text x="'+p.x+'" y="'+(p.y+44)+'" text-anchor="middle" font-size="10" font-family="Fira Code,monospace" fill="#7a86b0">'+c.id+'</text>'
       +(bits.length?'<text x="'+p.x+'" y="'+(p.y+57)+'" text-anchor="middle" font-size="11" font-weight="800" font-family="Fira Code,monospace">'+bits.join(' ')+'</text>':'')+'</g>';
      var k=0;(tips[c.id]||[]).forEach(function(b){
        var tg=b.indexOf('tag: ')===0,up=b.indexOf('origin/')===0,head=b==='HEAD'||!up&&!tg&&b===r.head&&!r.det,label=b==='HEAD'?'HEAD (detached)':(head?'HEAD > ':'')+b,w=label.length*6.9+16+(up?18:0),y=p.y-30-k*24;
        s+='<rect class="'+(up?'gorig':'gtag')+'" x="'+(p.x-w/2)+'" y="'+(y-14)+'" width="'+w+'" height="21" rx="5" fill="'+(tg?'#ffd34e':up?'#fff':head?'#e8336d':LC[p.l%5])+'" stroke="#16327a" stroke-width="2"'+(up?' stroke-dasharray="4 2"':'')+'/><text x="'+(p.x-w/2+8)+'" y="'+(y+1)+'" font-size="12" font-weight="800" fill="'+(up||tg?'#16327a':'#fff')+'" font-family="Nunito,sans-serif">'+esc(label)+'</text>'
         +(up?'<g transform="translate('+(p.x+w/2-20)+','+(y-9)+')">'+cloud+'</g>':'');k++});
    });
    return s+'</svg></div>'+lanes+'</div><div class="glg">'+(W>W0?n+' commits: scroll sideways to see older ones. ':'')+'<span class="gk"><b style="color:#2e9e4f">+</b> added <b style="color:#c98a1b">~</b> changed <b style="color:#d0342c">\u2212</b> deleted: click a commit to see its files.</span> Pink tag = where you are now. White tag with a cloud = <b>origin/main</b>: where GitHub was the last time you fetched, pulled or pushed.</div>'}
  /* missions */
  var VI={files:'<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>',search:'<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5"/></svg>',scm:'<svg viewBox="0 0 24 24"><circle cx="6" cy="5" r="2.5"/><circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="8" r="2.5"/><path d="M6 7.5v9M18 10.5c0 4-6 3-11 6.5"/></svg>',ext:'<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="14" y="3" width="7" height="7" transform="rotate(15 17.5 6.5)"/></svg>',merge:'<svg viewBox="0 0 24 24"><circle cx="6" cy="5" r="2.5"/><circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="12" r="2.5"/><path d="M6 7.5v9M6 8c0 3 4 4 9.5 4"/></svg>',more:'<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/></svg>',del:'<svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',nf:'<svg viewBox="0 0 24 24"><path d="M13 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9"/><path d="M18 3v6M15 6h6"/></svg>',nd:'<svg viewBox="0 0 24 24"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M12 10.5v5M9.5 13h5"/></svg>',br:'<svg viewBox="0 0 24 24"><circle cx="6" cy="5" r="2.5"/><circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="7" r="2.5"/><path d="M6 7.5v9M18 9.5c0 4-6 3-12 7"/></svg>'};
  function ficon(f){var e=(f.match(/\.([a-z0-9]+)$/i)||[,''])[1].toLowerCase(),m={md:['M&darr;','#519aba'],html:['&lt;&gt;','#e44d26'],css:['#','#42a5f5'],js:['JS','#cbcb41'],json:['{}','#cbcb41'],py:['py','#3572a5'],gitignore:['&#9670;','#f14e32']}[e]||['&#8801;','#9da5b4'];return '<i class="vsi" style="color:'+m[1]+'">'+m[0]+'</i>'}
  function flang(f){var e=(f.match(/\.([a-z0-9]+)$/i)||[,''])[1].toLowerCase();return {md:'Markdown',html:'HTML',css:'CSS',js:'JavaScript',json:'JSON',py:'Python',gitignore:'Ignore'}[e]||'Plain Text'}
  function vsShell(folder,list,cur,editor,branch,state){
    var dirty=list.filter(function(x){return x[1]}).length;
    var side='<div class="vsside"><div class="vssh"><span>EXPLORER</span><span class="vstools"><button class="vsnew" data-new="1" title="New File" aria-label="New File">'+VI.nf+'</button><button class="vsnew" data-newdir="1" title="New Folder" aria-label="New Folder">'+VI.nd+'</button></span></div><div class="vsfold" data-root="1">&#8964; '+esc(folder.toUpperCase())+'</div>'+vsTreeHtml+'</div>';
    var scm=S.vsView==='scm';if(scm)side=scmSide();
    var act='<div class="vsact"><i'+(scm?'':' class="on"')+' title="Explorer" data-view="files">'+VI.files+'</i><i title="Search">'+VI.search+'</i><i'+(scm?' class="on"':'')+' title="Source Control" data-view="scm">'+VI.scm+(dirty?'<em>'+dirty+'</em>':'')+'</i><i title="Extensions">'+VI.ext+'</i></div>';
    var tabs=cur?'<div class="vstabs">'+list.filter(function(x){return x[0]===cur||x[1]==='C'}).concat(list.filter(function(x){return x[0]!==cur&&x[1]!=='C'})).slice(0,3).map(function(x){return '<span class="vstab'+(x[0]===cur?' on':'')+(x[1]==='C'?' cf':'')+'" data-f="'+esc(x[0])+'">'+ficon(x[0])+esc(base(x[0]))+(x[1]==='C'?' &#9888;':'')+'<u>&times;</u></span>'}).join('')+vsUrBtns()+'</div><div class="vscrumb">'+esc(folder)+' &rsaquo; '+vsCrumb(cur)+'</div>':'';
    var stat='<div class="vsstat'+(branch?'':' nof')+'"><span>'+(branch?'<a class="vsbr" data-brpick="1" title="Switch branch">'+VI.br+esc(branch)+'</a>'+(state?' &middot; '+state:''):'no Git repo here')+'</span><span>&#8855; 0 &#9888; 0</span><span class="vsr">'+(cur?'Ln 1, Col 1 &nbsp; UTF-8 &nbsp; '+flang(cur):'')+'</span></div>';
    return '<div class="vsmain'+(scm?' scm':'')+'">'+act+side+'<div class="vsed">'+tabs+'<div class="vscode">'+editor+'</div></div></div>'+stat}
  function vsEdit(t){if(isBin(t))return isPic(t)?'<div class="vsimg"><img src="'+binUrl(t)+'" alt="'+esc(base(S.fvf||'picture'))+'"><small>'+esc(base(S.fvf||''))+' &middot; '+binSize(t)+' bytes &middot; a picture, so there is nothing to type here</small></div>':'<div class="vsempty">This is a binary file ('+binSize(t)+' bytes). VS Code cannot show it as text.</div>';
    t=t||'';var ls=t.replace(/\n$/,'').split('\n'),n=Math.max(1,ls.length),w=0;ls.forEach(function(l){w=Math.max(w,l.replace(/\t/g,'  ').length)});var g='';for(var i=1;i<=n;i++)g+=i+'\n';
    return '<div class="vsedit"><pre class="vsgut" id="vsGut">'+g+'</pre><textarea id="vsTa" style="min-width:calc('+(w+2)+'ch + 16px)" rows="'+(n+1)+'" spellcheck="false" autocomplete="off" autocapitalize="off" wrap="off" aria-label="File contents" placeholder="Start typing...">'+esc(t)+'</textarea></div>'}
  function vsPop(title,text,btns){
    var old=np.querySelector('.vsdlg');if(old)old.remove();np.classList.remove('min');if(np.classList.contains('docked'))vsDock(false);
    var d=document.createElement('div');d.className='vsdlg';d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');
    d.innerHTML='<div class="vsdb"><div class="vsdt"><i>!</i><div><strong class="vsdtt">'+title+'</strong><p>'+text+'</p></div></div><div class="vsdbtn"></div></div>';
    var bb=d.querySelector('.vsdbtn'),prev=document.activeElement;
    function close(){d.remove();if(prev&&prev.focus&&document.contains(prev))prev.focus({preventScroll:true})}
    (btns||[{t:'OK'}]).forEach(function(b,i){var x=document.createElement('button');x.textContent=b.t;if(i===0)x.className='pri';x.onclick=function(){close();if(b.fn)b.fn()};bb.appendChild(x)});
    d.addEventListener('keydown',function(e){if(e.key==='Escape'){e.stopPropagation();close()}});
    d.addEventListener('pointerdown',function(e){e.stopPropagation()});
    np.appendChild(d);bb.firstChild.focus({preventScroll:true})}
  function gp(f){return S.cwd===R().root?f:R().root+'/'+f}
  function vsRun(cmds){if(busy){vsPop('Busy','Wait for the terminal to finish first.');return}cmds=[].concat(cmds);
    (function next(){if(pend){setTimeout(next,250);return}if(!cmds.length)return;var c=cmds.shift();if(typeof c==='function'){c();next();return}
      pr('<span class="c">[VS Code runs]</span>');run(c);setTimeout(next,60)})()}
  function scmSide(){
    var h='<div class="vsside scmside"><div class="vssh"><span>SOURCE CONTROL</span>'+(S.repo?'<span class="scmtools"><button class="vsnew" data-scm="merge" title="Merge Branch...">'+VI.merge+'</button><button class="vsnew" data-scm="more" title="More Actions...">'+VI.more+'</button></span>':'')+'</div>';
    if(!S.repo)return h+'<p class="scmtxt">The folder currently open doesn\'t have a Git repository. You can initialize a repository which will enable source control features powered by Git.</p><button class="scmbtn" data-scm="init">Initialize Repository</button></div>';
    var st=status(),r=R(),mg=r.merge,msg=S.scmMsg!=null?S.scmMsg:'';
    h+='<div class="scmbox"><textarea id="scmMsg" rows="2" spellcheck="false" placeholder="'+(mg?esc(mg.msg):'Message (Ctrl+Enter to commit on \''+esc(hName(r))+'\')')+'">'+esc(msg)+'</textarea><button class="scmbtn" data-scm="commit">&#10003; '+(mg?'Continue':'Commit')+'</button></div>';
    function row(f,letter,cls,acts){return '<div class="vsfile scmrow g'+cls+'" data-f="'+esc(f)+'">'+ficon(f)+'<span>'+esc(base(f))+'</span>'+acts+'<b>'+letter+'</b></div>'}
    function sec(t,n,act,body){return n?'<div class="scmsec"><div class="scmh"><span>&#8964; '+t+'</span>'+act+'<em>'+n+'</em></div>'+body+'</div>':''}
    var ch=st.unstaged.map(function(x){return [x[0],x[1]==='deleted'?'D':'M']}).concat(st.untracked.map(function(f){return [f,'U']}));
    h+=sec('Merge Changes',st.conf.length,'',st.conf.map(function(f){return row(f,'!','C','<button class="scma" data-scm="stage" title="Stage Changes">+</button>')}).join(''));
    h+=sec('Staged Changes',st.staged.length,'<button class="scma" data-scm="unstageall" title="Unstage All Changes">&minus;</button>',st.staged.map(function(x){return row(x[0],x[1]==='deleted'?'D':x[1]==='new file'?'A':'M',x[1]==='deleted'?'D':'A','<button class="scma" data-scm="unstage" title="Unstage Changes">&minus;</button>')}).join(''));
    h+=sec('Changes',ch.length,'<button class="scma" data-scm="stageall" title="Stage All Changes">+</button>',ch.map(function(x){return row(x[0],x[1],x[1],'<button class="scma" data-scm="stage" title="Stage Changes">+</button>')}).join(''));
    if(!st.conf.length&&!st.staged.length&&!ch.length)h+='<p class="scmtxt">'+(mg?'All conflicts staged. Press Continue to finish the merge.':'No changes. Edit a file to see it here.')+'</p>';
    return h+'</div>'}
  function vsPickList(title,items){
    var old=np.querySelector('.vsdlg');if(old)old.remove();
    var d=document.createElement('div');d.className='vsdlg vspick';
    d.innerHTML='<div class="vsqp"><div class="vsqt">'+title+'</div>'+items.map(function(it,i){return '<button class="vsqi" data-i="'+i+'">'+it.t+(it.d?'<small>'+it.d+'</small>':'')+'</button>'}).join('')+(items.length?'':'<div class="vsqe">No other branches. Make one in the terminal: <code>git switch -c feature</code></div>')+'</div>';
    function close(){d.remove()}
    d.addEventListener('click',function(e){var b=e.target.closest('.vsqi');if(b){close();items[+b.getAttribute('data-i')].fn()}else if(e.target===d)close()});
    d.addEventListener('keydown',function(e){if(e.key==='Escape'){e.stopPropagation();close()}});
    d.addEventListener('pointerdown',function(e){e.stopPropagation()});
    np.appendChild(d);var f=d.querySelector('.vsqi');if(f)f.focus({preventScroll:true})}
  function scmAct(a,f){var r=R();
    if(a==='init'){var im=vsMode();vsRun(im.root!==S.cwd?['cd '+tilde(im.root),'git init']:'git init');return}
    if(!r)return;
    if(a==='stage'){var t=work()[f];if(r.conf[f]&&/^<<<<<<<|^>>>>>>>/m.test(t||'')){vsPop('Are you sure you want to stage '+esc(f)+' with merge conflicts?','The file still has conflict markers (&lt;&lt;&lt;&lt;&lt;&lt;&lt;). Fix it first with the Accept links or the Merge Editor.',[{t:'Stage anyway',fn:function(){vsRun('git add '+gp(f))}},{t:'Cancel'}]);return}vsRun('git add '+gp(f));return}
    if(a==='unstage'){vsRun('git restore --staged '+gp(f));return}
    if(a==='stageall'){vsRun('git add .');return}
    if(a==='unstageall'){vsRun(status().staged.map(function(x){return 'git restore --staged '+gp(x[0])}));return}
    if(a==='merge'||a==='more'){var bs=keys(r.br).filter(function(b){return b!==r.head&&r.br[b]});
      if(a==='more'){vsPickList('More Actions',[{t:'Merge Branch...',fn:function(){scmAct('merge')}},{t:'Switch Branch...',fn:brPick},{t:'Create Branch...',fn:function(){vsAsk('Type a new branch name and press Enter (no spaces)','feature',function(n){vsRun('git switch -c '+n)})}}].concat(r.merge?[{t:'Abort Merge',fn:function(){vsRun('git merge --abort')}}]:[]));return}
      vsPickList('Select a branch to merge into \''+esc(r.head)+'\'',bs.map(function(b){return {t:VI.br+' '+esc(b),fn:function(){vsRun('git merge '+b)}}}));return}
    if(a==='commit'){var st=status(),msg=(S.scmMsg||'').trim().replace(/"/g,"'");
      if(st.conf.length){vsPop('Resolve the merge conflicts first','Fix '+st.conf.map(esc).join(', ')+', then press <b>+</b> to stage it. After that you can commit.');return}
      if(r.merge){S.scmMsg='';vsRun(msg?'git commit -m "'+msg+'"':'git commit --no-edit');return}
      if(!msg){vsPop('Type a commit message','Write a short note in the Message box about what you changed, for example <code>Add pasta recipe</code>.');return}
      if(!st.staged.length){if(!st.unstaged.length&&!st.untracked.length){vsPop('Nothing to commit','There are no changes. Edit or create a file first.');return}
        vsPop('There are no staged changes to commit.','Would you like to stage all your changes and commit them directly?',[{t:'Yes',fn:function(){S.scmMsg='';vsRun(['git add .','git commit -m "'+msg+'"'])}},{t:'Cancel'}]);return}
      S.scmMsg='';vsRun('git commit -m "'+msg+'"')}}
  function vsAsk(title,ph,fn,val){var old=np.querySelector('.vsdlg');if(old)old.remove();
    var d=document.createElement('div');d.className='vsdlg vspick';d.innerHTML='<div class="vsqp"><input class="vsqin" placeholder="'+ph+'" spellcheck="false" autocomplete="off"><div class="vsqt" style="border:0;margin:0;padding:6px 6px 2px">'+title+'</div></div>';
    var inp2=d.querySelector('input');function close(){d.remove()}
    inp2.addEventListener('keydown',function(e){e.stopPropagation();if(e.key==='Escape')close();if(e.key==='Enter'){var v=inp2.value.trim();if(!/^[A-Za-z0-9._\/-]+$/.test(v)){inp2.classList.add('bad');return}close();fn(v)}});
    d.addEventListener('click',function(e){if(e.target===d)close()});d.addEventListener('pointerdown',function(e){e.stopPropagation()});
    np.appendChild(d);if(val!=null){inp2.value=val;var dot=val.lastIndexOf('.');inp2.setSelectionRange(0,dot>0?dot:val.length)}inp2.focus({preventScroll:true})}
  function brPick(){var r=R();if(!r)return;vsPickList('Select a branch to switch to',[{t:'+ Create new branch...',fn:function(){vsAsk('Type a new branch name and press Enter (no spaces)','feature',function(n){vsRun('git switch -c '+n)})}}].concat(keys(r.br).map(function(b){return {t:VI.br+' '+esc(b),d:b===r.head?'current':'',fn:function(){if(b!==r.head)vsRun('git switch '+b)}}})))}
  function mParse(t){var segs=[],L=t.replace(/\n$/,'').split('\n'),i=0,base=[];
    while(i<L.length){var l=L[i];
      if(/^<<<<<<< ?/.test(l)){if(base.length){segs.push({b:base});base=[]}var c={cur:[],inc:[],cn:l.replace(/^<<<<<<< ?/,'')||'HEAD',inn:''},m=1;i++;
        while(i<L.length&&!/^>>>>>>> ?/.test(L[i])){if(/^=======/.test(L[i]))m=2;else(m===1?c.cur:c.inc).push(L[i]);i++}
        c.inn=(L[i]||'').replace(/^>>>>>>> ?/,'');segs.push(c)}
      else base.push(l);i++}
    if(base.length)segs.push({b:base});return segs}
  function mResult(segs,pick,keepMarkers){var o=[],k=0;segs.forEach(function(s){if(s.b){o=o.concat(s.b);return}var p=pick[k++]||[];
      if(!p.length){if(keepMarkers)o=o.concat(['<<<<<<< '+s.cn],s.cur,['======='],s.inc,['>>>>>>> '+s.inn]);return}
      p.forEach(function(w){o=o.concat(w==='cur'?s.cur:s.inc)})});return o.join('\n')+'\n'}
  function mPane(segs,side,pick){var o='',n=0,k=0;segs.forEach(function(s){
      if(s.b){s.b.forEach(function(l){n++;o+='<div class="fl"><span class="ln2">'+n+'</span><span>'+(esc(l)||'&nbsp;')+'</span></div>'});return}
      var on=(pick[k]||[]).indexOf(side)>=0;
      o+='<label class="mck"><input type="checkbox" data-mc="'+k+'" data-side="'+side+'"'+(on?' checked':'')+'> Accept '+(side==='inc'?'Incoming':'Current')+'</label>';
      s[side].forEach(function(l){n++;o+='<div class="fl m'+side+(on?' on':'')+'"><span class="ln2">'+n+'</span><span>'+(esc(l)||'&nbsp;')+'</span></div>'});k++});return o}
  function mEditor(t){var segs=mParse(t),pick=S.vsMerge.pick,cs=segs.filter(function(s){return !s.b}),left=cs.filter(function(s,i){return !(pick[i]||[]).length}).length,res='',n=0,k=0;
    segs.forEach(function(s){if(s.b){s.b.forEach(function(l){n++;res+='<div class="fl"><span class="ln2">'+n+'</span><span>'+(esc(l)||'&nbsp;')+'</span></div>'});return}
      var p=pick[k++]||[];if(!p.length){res+='<div class="mhole">Conflict: tick a box above</div>';return}
      p.forEach(function(w){s[w].forEach(function(l){n++;res+='<div class="fl m'+w+' on"><span class="ln2">'+n+'</span><span>'+(esc(l)||'&nbsp;')+'</span></div>'})})});
    var inn=cs[0]?cs[0].inn:'incoming',cn=R().head;
    return '<div class="mgrid"><div class="mp"><div class="mph"><b>Incoming</b> <span class="mref">&#9679; '+esc(inn)+'</span></div><div class="mpb">'+mPane(segs,'inc',pick)+'</div></div>'
      +'<div class="mp"><div class="mph"><b>Current</b> <span class="mref">&#9679; '+esc(cn)+'</span></div><div class="mpb">'+mPane(segs,'cur',pick)+'</div></div>'
      +'<div class="mp mres"><div class="mph"><b>Result</b> <span class="mref">'+esc(S.fvf)+'</span><span class="mleft'+(left?'':' ok')+'">'+(left?left+' Conflict'+(left>1?'s':'')+' Remaining':'No Remaining Conflicts')+'</span></div><div class="mpb">'+res+'</div>'
      +'<div class="mfoot"><button data-mclose="1">Close</button><button class="pri" data-mdone="1">Complete Merge</button></div></div></div>'}
  function mOpen(){S.vsMerge={f:S.fvf,pick:{}};var r=np.getBoundingClientRect(),w=Math.min(760,innerWidth-16),h=Math.min(500,innerHeight-60);
    np.dataset.prev=JSON.stringify({w:np.style.width,h:np.style.height,l:np.style.left,t:np.style.top,r:np.style.right,b:np.style.bottom});
    np.style.width=w+'px';np.style.height=h+'px';np.style.left=Math.max(8,Math.min(r.left,innerWidth-w-8))+'px';np.style.top=Math.max(8,innerHeight-h-50)+'px';np.style.right='auto';np.style.bottom='auto';np.classList.add('merging');fvDraw()}
  function mClose(){S.vsMerge=null;np.classList.remove('merging');try{var p=JSON.parse(np.dataset.prev||'{}');np.style.width=p.w||'';np.style.height=p.h||'';np.style.left=p.l||'';np.style.top=p.t||'';np.style.right=p.r||'';np.style.bottom=p.b||''}catch(z){}fvDraw()}
  function mDone(force){var f=S.vsMerge.f,abs=R().root+'/'+f,segs=mParse(work()[f]||''),pick=S.vsMerge.pick,left=segs.filter(function(s){return !s.b}).filter(function(s,i){return !(pick[i]||[]).length}).length;
    if(left&&!force){vsPop('Do you want to complete the merge of '+esc(f)+'?','The file still has '+left+' unhandled conflict'+(left>1?'s':'')+'.',[{t:'Complete with Conflicts',fn:function(){mDone(true)}},{t:'Cancel'}]);return}
    S.files[abs]=mResult(segs,pick,true);mClose();
    pr('<span class="y">[VS Code] Merge completed for '+esc(f)+'. File saved. Next: git add '+esc(f)+', then git commit.</span>');render()}
  /* ---------- shared file system: VS Code, desktop and Bin all use these ---------- */
  function under(p,d){return !!p&&!!d&&(p===d||p.indexOf(d+'/')===0)}
  function okName(n){return /^[A-Za-z0-9_.-]+$/.test(n)&&n!=='.'&&n!=='..'&&n!=='.git'}
  function exists(a){return !!S.dirs[a]||(a in S.files)}
  function uniq(dir,name){if(!exists(dir+'/'+name))return name;var m=name.match(/^(.+?)(\.[^.]*)?$/),st=m[1],ex=m[2]||'';
    for(var i=1;;i++){var n=st+'-copy'+(i>1?i:'')+ex;if(!exists(dir+'/'+n))return n}}
  function tilde(a){return a===HOME?'~':a.indexOf(HOME+'/')===0?'~'+a.slice(HOME.length):a}
  function sigNow(){return S.cwd+'|'+(S.repo?S.repo.root:'')}
  function hasGit(a){return /(^|\/)\.git(\/|$)/.test(a)}
  function fsNew(a,dir){if(!okName(base(a)))return {err:'Use letters, numbers, dots, dashes or underscores. No spaces.'};
    if(exists(a))return {err:'A file or folder called <b>'+esc(base(a))+'</b> already exists here.'};
    if(!S.dirs[dirname(a)])return {err:'That folder does not exist any more.'};
    if(dir)S.dirs[a]=1;else S.files[a]='';return {abs:a}}
  function fsRename(o,n){if(o===n)return {abs:n};if(o===HOME)return {err:'The home folder cannot be renamed.'};
    if(!okName(base(n)))return {err:'Use letters, numbers, dots, dashes or underscores. No spaces.'};
    if(exists(n))return {err:'A file or folder called <b>'+esc(base(n))+'</b> already exists there.'};
    if(!S.dirs[dirname(n)])return {err:'That folder does not exist any more.'};
    if(S.dirs[o]){if(under(n,o))return {err:'A folder cannot go inside itself.'};
      var pin=S.vsPin&&S.vsPinSig===sigNow();
      keys(S.dirs).forEach(function(d){if(under(d,o)){delete S.dirs[d];S.dirs[n+d.slice(o.length)]=1}});
      keys(S.files).forEach(function(f){if(f.indexOf(o+'/')===0){var t=S.files[f];delete S.files[f];S.files[n+f.slice(o.length)]=t}});
      var mv=function(x){return under(x,o)?n+x.slice(o.length):x};
      S.cwd=mv(S.cwd);keys(S.repos).forEach(function(rt){var nr=mv(rt);if(nr!==rt){var rp=S.repos[rt];delete S.repos[rt];rp.root=nr;S.repos[nr]=rp}});if(S.vsPin)S.vsPin=mv(S.vsPin);if(S.vsSelDir)S.vsSelDir=mv(S.vsSelDir);
      if(pin)S.vsPinSig=sigNow();if(S.fvfWant)S.fvfWant=mv(S.fvfWant)}
    else if(o in S.files){var t=S.files[o];delete S.files[o];S.files[n]=t}
    else return {err:'It is not there any more.'};
    return {abs:n}}
  function fsDelete(a){if(a===HOME)return {err:'The home folder cannot be deleted.'};
    if(S.dirs[a]){keys(S.files).forEach(function(f){if(f.indexOf(a+'/')===0)delete S.files[f]});keys(S.dirs).forEach(function(d){if(under(d,a))delete S.dirs[d]});
      keys(S.repos).forEach(function(rt){if(under(rt,a)){delete S.repos[rt];S.vsMerge=null}});
      while(!S.dirs[S.cwd])S.cwd=dirname(S.cwd)}
    else if(a in S.files)delete S.files[a];
    else return {err:'It is not there any more.'};
    return {abs:a}}
  function fsCopy(src,dir){if(!exists(src))return {err:'It is not there any more.'};if(!S.dirs[dir])return {err:'That folder does not exist any more.'};
    if(S.dirs[src]&&under(dir,src))return {err:'A folder cannot be pasted inside itself.'};
    var dst=dir+'/'+uniq(dir,base(src));
    if(S.dirs[src]){keys(S.dirs).forEach(function(d){if(under(d,src)&&!hasGit(d.slice(src.length)))S.dirs[dst+d.slice(src.length)]=1});
      keys(S.files).forEach(function(f){if(f.indexOf(src+'/')===0&&!hasGit(f.slice(src.length)))S.files[dst+f.slice(src.length)]=S.files[f]})}
    else S.files[dst]=S.files[src];
    return {abs:dst}}
  function fsMove(src,dir){if(!exists(src))return {err:'It is not there any more.'};if(dirname(src)===dir)return {abs:src};
    if(S.dirs[src]&&under(dir,src))return {err:'A folder cannot go inside itself.'};
    return fsRename(src,dir+'/'+uniq(dir,base(src)))}
  var binSeq=0;
  function binPut(a){if(!exists(a))return {err:'It is not there any more.'};if(a===HOME)return {err:'The home folder cannot be deleted.'};
    var e={id:++binSeq,name:base(a),from:dirname(a),dir:!!S.dirs[a],files:{},dirs:[]};
    if(e.dir){keys(S.dirs).forEach(function(d){if(d.indexOf(a+'/')===0)e.dirs.push(d.slice(a.length+1))});
      keys(S.files).forEach(function(f){if(f.indexOf(a+'/')===0)e.files[f.slice(a.length+1)]=S.files[f]});
      e.repos=keys(S.repos).filter(function(rt){return under(rt,a)}).map(function(rt){return {repo:S.repos[rt],rel:rt.slice(a.length)}});e.repo=e.repos.length>0}
    else e.files['']=S.files[a];
    var r=fsDelete(a);if(r.err)return r;(S.bin||(S.bin=[])).push(e);return {abs:a,repo:!!e.repo}}
  function binRestore(id){var b=S.bin||[],i=-1;b.forEach(function(x,k){if(x.id===id)i=k});if(i<0)return {err:'It is not in the Bin any more.'};var e=b[i];
    var p=e.from,need=[];while(!S.dirs[p]){need.unshift(p);p=dirname(p)}need.forEach(function(d){S.dirs[d]=1});
    var dst=e.from+'/'+uniq(e.from,e.name),note='';
    if(e.dir){S.dirs[dst]=1;e.dirs.forEach(function(d){S.dirs[dst+'/'+d]=1});keys(e.files).forEach(function(f){S.files[dst+'/'+f]=e.files[f]});
      (e.repos||[]).forEach(function(x){x.repo.root=dst+x.rel;S.repos[x.repo.root]=x.repo})}
    else S.files[dst]=e.files[''];
    b.splice(i,1);return {abs:dst,note:note}}
  function binEmpty(id){if(id==null)S.bin=[];else S.bin=(S.bin||[]).filter(function(x){return x.id!==id})}
  function gitMark(a){var r=repoOf(a);if(!r||!under(a,r.root)||a===r.root||!(a in S.files))return '';var f=a.slice(r.root.length+1);
    if(r.conf[f])return 'C';if(!(f in r.index))return 'U';var hid=r.br[r.head],h=hid&&r.cm[hid]?r.cm[hid].files:{};return S.files[a]!==r.index[f]?'M':r.index[f]!==h[f]?(f in h?'M':'A'):''}
  /* VS Code shows the terminal's repo or folder, unless the desktop opened another folder in it */
  function vsMode(){var r=S.repo;
    if(S.vsPin&&S.dirs[S.vsPin]&&S.vsPinSig===sigNow()){if(r&&under(S.vsPin,r.root))return {root:r.root,repo:true};return {root:S.vsPin,repo:false}}
    S.vsPin=null;return r?{root:r.root,repo:true}:{root:S.cwd,repo:false}}
  function vsAbs(k){var m=vsMode();return m.repo?m.root+'/'+k:k}
  function vsKeyOf(a,m){m=m||vsMode();if(!under(a,m.root)||a===m.root)return null;return m.repo?a.slice(m.root.length+1):a}
  function vsTarget(m){var d=S.vsSelDir;return d&&S.dirs[d]&&under(d,m.root)?d:m.root}
  function vsOpenUp(d,root){while(d&&d!==root&&under(d,root)){if(S.vsClosed)delete S.vsClosed[d];d=dirname(d)}}
  /* small right-click menu used by VS Code and the desktop */
  var ctxLast=0;
  function ctxClose(){document.querySelectorAll('.ctxm').forEach(function(m){m.remove()})}
  function ctxMenu(x,y,items,sub,px){if(!sub)ctxClose();else document.querySelectorAll('.ctxm.sub').forEach(function(m){m.remove()});
    ctxLast=Date.now();
    var m=document.createElement('div');m.className='ctxm'+(sub?' sub':'');m.setAttribute('role','menu');
    items.forEach(function(it){if(it==='-'){var h=document.createElement('hr');m.appendChild(h);return}
      var b=document.createElement('button');b.type='button';b.setAttribute('role','menuitem');
      b.innerHTML='<i>'+(it.on?'&#10003;':'')+'</i><span>'+it.t+'</span>'+(it.sub?'<em>&#9656;</em>':it.k?'<small>'+it.k+'</small>':'');
      if(it.dis){b.disabled=true;b.setAttribute('aria-disabled','true')}
      b.addEventListener('click',function(e){e.stopPropagation();if(it.dis)return;
        if(it.sub){var r=b.getBoundingClientRect();ctxMenu(r.right-4,r.top-4,it.sub,true,r.left);return}
        ctxClose();if(it.fn)it.fn()});
      b.addEventListener('pointerenter',function(){if(!it.sub&&!sub)document.querySelectorAll('.ctxm.sub').forEach(function(q){q.remove()})});
      m.appendChild(b)});
    m.addEventListener('pointerdown',function(e){e.stopPropagation()});
    m.addEventListener('contextmenu',function(e){e.preventDefault();e.stopPropagation()});
    m.addEventListener('keydown',function(e){var bs=[].slice.call(m.querySelectorAll('button:not([disabled])')),i=bs.indexOf(document.activeElement);
      if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();if(!bs.length)return;i=e.key==='ArrowDown'?(i+1)%bs.length:(i-1+bs.length)%bs.length;bs[i].focus()}
      else if(e.key==='Escape'){e.preventDefault();e.stopPropagation();if(sub)m.remove();else ctxClose()}
      else if(e.key==='ArrowRight'&&document.activeElement&&document.activeElement.querySelector('em'))document.activeElement.click()
      else if(e.key==='ArrowLeft'&&sub)m.remove()});
    document.body.appendChild(m);
    var w=m.offsetWidth,h=m.offsetHeight;
    if(sub&&x+w>innerWidth-4)x=Math.max(4,px-w+4);
    m.style.left=Math.max(4,Math.min(x,innerWidth-w-4))+'px';m.style.top=Math.max(4,Math.min(y,innerHeight-h-42))+'px';
    var f=m.querySelector('button:not([disabled])');if(f)f.focus({preventScroll:true});return m}
  document.addEventListener('pointerdown',function(){if(document.querySelector('.ctxm'))ctxClose()});
  addEventListener('blur',ctxClose);addEventListener('resize',ctxClose);
  document.addEventListener('scroll',function(){if(Date.now()-ctxLast>300)ctxClose()},true);
  /* long press = right-click on touch screens */
  function longPress(el,test,fn){var t=null,sx=0,sy=0;
    el.addEventListener('pointerdown',function(e){if(e.pointerType==='mouse'||!test(e.target))return;sx=e.clientX;sy=e.clientY;var tg=e.target;clearTimeout(t);
      t=setTimeout(function(){t=null;el._lp=Date.now();fn({target:tg,clientX:sx,clientY:sy,preventDefault:function(){},stopPropagation:function(){}})},550)});
    el.addEventListener('pointermove',function(e){if(t&&Math.abs(e.clientX-sx)+Math.abs(e.clientY-sy)>10){clearTimeout(t);t=null}});
    ['pointerup','pointercancel','pointerleave'].forEach(function(n){el.addEventListener(n,function(){clearTimeout(t);t=null})});
    el.addEventListener('contextmenu',function(e){if(!test(e.target))return;e.preventDefault();e.stopPropagation();if(el._lp&&Date.now()-el._lp<900)return;fn(e)});
    el.addEventListener('click',function(e){if(el._lp&&Date.now()-el._lp<900){e.preventDefault();e.stopPropagation();el._lp=0}},true)}
  function vsPath(){return vsAbs(S.fvf)}
  /* undo / redo in the VS Code editor: each file keeps its own history; typing in one go is one step */
  function vsHist(p){S.vsUndo=S.vsUndo||{};return S.vsUndo[p]||(S.vsUndo[p]={u:[],r:[],t:0,last:null})}
  function vsCan(redo){if(!S.fvf)return false;var p=vsPath();if(!(p in S.files)||isBin(S.files[p]))return false;var h=vsHist(p);if(h.last!==null&&h.last!==S.files[p])return false;return (redo?h.r:h.u).length>0}
  function vsUrBtns(){return '<span class="vsur"><button type="button" data-vsu="u" title="Undo (Ctrl+Z)" aria-label="Undo"'+(vsCan(false)?'':' disabled')+'>&#8630;</button><button type="button" data-vsu="r" title="Redo (Ctrl+Y)" aria-label="Redo"'+(vsCan(true)?'':' disabled')+'>&#8631;</button></span>'}
  function vsUndoDo(redo){if(!vsCan(redo))return;var p=vsPath(),h=vsHist(p),cur=S.files[p],from=redo?h.r:h.u,to=redo?h.u:h.r,v=from.pop();to.push(cur);S.files[p]=v;h.last=v;h.t=0;
    /* the cursor goes to the end of the part that changed back */
    var i=0,k=0;while(i<v.length&&i<cur.length&&v[i]===cur[i])i++;while(k<v.length-i&&k<cur.length-i&&v[v.length-1-k]===cur[cur.length-1-k])k++;var at=Math.max(i,v.length-k);
    var sc=document.querySelector('#fvB .vscode');vsSel={f:S.fvf,s:at,e:at,t:sc?sc.scrollTop:0,l:sc?sc.scrollLeft:0};render()}
  var vsSel=null;
  /* the line between the file list and the editor can be dragged to make the list wider or narrower (a little ⋮ grip on phones) */
  var vsGripD=null;
  function vsGrip(){var mn=np.querySelector('.vsmain'),sd=mn&&mn.querySelector('.vsside');if(!mn||!sd||np.classList.contains('merging')){var og=np.querySelector('.vsgrip');if(og)og.remove();return}
    var g=mn.querySelector('.vsgrip');if(!g){g=document.createElement('span');g.className='vsgrip';g.setAttribute('role','separator');g.setAttribute('aria-orientation','vertical');g.setAttribute('aria-label','Drag to resize the file list');g.title='Drag to resize';g.innerHTML='<i>&#8942;</i>';mn.appendChild(g)}
    }
  np.addEventListener('pointerdown',function(e){var g=e.target.closest&&e.target.closest('.vsgrip');if(!g)return;e.preventDefault();e.stopPropagation();var sd=np.querySelector('.vsside'),ac=np.querySelector('.vsact');
    vsGripD={x:e.clientX,w:sd.offsetWidth,a:ac?ac.offsetWidth:30};np.style.setProperty('--vsa',vsGripD.a+'px');np.classList.add('sizing');try{g.setPointerCapture(e.pointerId)}catch(z){}},true);
  np.addEventListener('pointermove',function(e){if(!vsGripD)return;var max=np.clientWidth-vsGripD.a-90,w=Math.round(Math.max(70,Math.min(max,vsGripD.w+e.clientX-vsGripD.x)));
    np.style.setProperty('--vsw',w+'px');np.classList.add('vswset');vsGrip()});
  ['pointerup','pointercancel'].forEach(function(n){np.addEventListener(n,function(){if(vsGripD){vsGripD=null;np.classList.remove('sizing')}})});
  addEventListener('resize',function(){if(np.classList.contains('show'))vsGrip()});
  function vsKeep(){vsGrip();var ta=$('vsTa'),nm=$('vsName'),sm=$('scmMsg');if(nm){nm.focus();return}if(sm&&S.scmFocus){sm.focus({preventScroll:true});sm.setSelectionRange(sm.value.length,sm.value.length)}var edDone=false;if(ta&&vsSel&&vsSel.f===S.fvf){ta.focus({preventScroll:true});ta.setSelectionRange(vsSel.s,vsSel.e);var sc=ta.closest('.vscode');if(sc){sc.scrollTop=vsSel.t;sc.scrollLeft=vsSel.l;edDone=true}}vsSel=null;vsRestoreScroll(edDone)}
  $('fvB').addEventListener('input',function(e){if(e.target.id!=='vsTa')return;var ta=e.target,v=ta.value;
    var hp=vsPath(),h=vsHist(hp),was=S.files[hp]===undefined?'':S.files[hp],now=Date.now();
    if(h.last!==null&&h.last!==was){h.u=[];h.r=[]} /* the file was changed outside the editor (git restore, merge...): start a fresh history */
    if(!h.u.length||now-h.t>800||/Paste|Drop|Cut|LineBreak|Paragraph/.test(e.inputType||''))h.u.push(was);if(h.u.length>200)h.u.shift();h.t=now;h.r=[];
    S.files[hp]=v===''||/\n$/.test(v)?v:v+'\n';h.last=S.files[hp];
    var sc=ta.closest('.vscode');vsSel={f:S.fvf,s:ta.selectionStart,e:ta.selectionEnd,t:sc?sc.scrollTop:0,l:sc?sc.scrollLeft:0};render()});
  $('fvB').addEventListener('input',function(e){if(e.target.id==='scmMsg')S.scmMsg=e.target.value});
  $('fvB').addEventListener('mousedown',function(e){if(e.target.closest&&e.target.closest('[data-vsu]'))e.preventDefault()}); /* keep typing focus in the file */
  $('fvB').addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-vsu]');if(b&&!b.disabled)vsUndoDo(b.getAttribute('data-vsu')==='r')});
  $('fvB').addEventListener('focusin',function(e){S.scmFocus=e.target.id==='scmMsg'});
  $('fvB').addEventListener('keydown',function(e){
    if(e.target.id==='scmMsg'&&e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();scmAct('commit');return}
    if(e.target.id==='vsTa'&&(e.ctrlKey||e.metaKey)&&!e.altKey){var uk=(e.key||'').toLowerCase();
      if(uk==='z'&&!e.shiftKey){e.preventDefault();vsUndoDo(false);return}
      if(uk==='y'||(uk==='z'&&e.shiftKey)){e.preventDefault();vsUndoDo(true);return}}
    if(e.target.id==='vsTa'&&e.key==='Tab'){e.preventDefault();var ta=e.target,s=ta.selectionStart;ta.setRangeText('  ',s,ta.selectionEnd,'end');ta.dispatchEvent(new Event('input',{bubbles:true}))}
    if(e.target.id!=='vsName')return;
    if(e.key==='Escape'){S.vsNaming=0;fvDraw();return}
    if(e.key!=='Enter')return;e.preventDefault();var nm=e.target.value.trim(),vm=vsMode(),dir=vsTarget(vm),isDir=S.vsNaming==='dir';
    if(!okName(nm)){e.target.classList.add('bad');e.target.title='Use letters, numbers, dots, dashes or underscores. No spaces.';return}
    var abs=dir+'/'+nm;S.vsNaming=0;
    if(!isDir&&(abs in S.files)){S.fvf=vsKeyOf(abs,vm);render();return}
    var r=fsNew(abs,isDir);
    if(r.err){vsPop(isDir?'Cannot create folder':'Cannot create file',r.err);fvDraw();return}
    if(isDir){S.vsSelDir=abs;delete S.vsClosed[abs];pr('<span class="c">[VS Code] Created folder '+esc(nm)+'.'+(vm.repo?' Git does not save empty folders, so put a file in it.':'')+'</span>');render();return}
    S.fvf=vsKeyOf(abs,vm);pr('<span class="c">[VS Code] Created '+esc(nm)+'.'+(vm.repo?' Type in it, then use git add and git commit here.':' Type in it.')+'</span>');render();var ta=$('vsTa');if(ta)ta.focus({preventScroll:true})});
  $('fvB').addEventListener('focusout',function(e){if(e.target.id==='vsName'&&S.vsNaming){setTimeout(function(){if(S.vsNaming&&document.activeElement.id!=='vsName'){S.vsNaming=0;fvDraw()}},150)}});
  var vsTreeHtml='';
  function vsCrumb(k){var m=vsMode(),rp=m.repo?k:k.slice(m.root.length+1),pa=rp.split('/'),last=pa.pop();
    return pa.map(function(x){return esc(x)+' &rsaquo; '}).join('')+ficon(k)+esc(last)}
  function vsTree(m,list,cur){var root=m.root,dirs={},tgt=vsTarget(m),cl=S.vsClosed||(S.vsClosed={});
    var files=list.map(function(x){return {k:x[0],s:x[1],a:m.repo?root+'/'+x[0]:x[0]}});
    keys(S.dirs).forEach(function(d){if(d.indexOf(root+'/')===0&&!hasGit(d.slice(root.length)))dirs[d]=1});
    files.forEach(function(x){var q=dirname(x.a);while(q!==root&&q.indexOf(root+'/')===0){dirs[q]=1;q=dirname(q)}});
    var dl=keys(dirs);
    function pad(n,f){return ' style="padding-left:'+((f?14:4)+n*12)+'px"'}
    function nameRow(n){var dir=S.vsNaming==='dir';return '<div class="vsname"'+pad(n,1)+'><input id="vsName" placeholder="'+(dir?'folder-name':'name.txt')+'" spellcheck="false" autocomplete="off" autocapitalize="off" aria-label="'+(dir?'New folder name':'New file name')+'"></div>'}
    function walk(dir,n){var o=S.vsNaming&&tgt===dir?nameRow(n):'';
      dl.filter(function(d){return dirname(d)===dir}).sort().forEach(function(d){var open=!cl[d];
        o+='<div class="vsfile vsdir'+(S.vsSelDir===d?' sel':'')+'" data-d="'+esc(d)+'"'+pad(n)+' title="'+esc(base(d))+'"><i class="vsar" aria-hidden="true">'+(open?'&#9662;':'&#9656;')+'</i><span>'+esc(base(d))+'</span><button class="vsdel" data-del="1" title="Delete" aria-label="Delete '+esc(base(d))+'">'+VI.del+'</button></div>';
        if(open)o+=walk(d,n+1)});
      files.filter(function(x){return dirname(x.a)===dir}).sort(function(a,b){return a.a<b.a?-1:1}).forEach(function(x){
        o+='<div class="vsfile'+(x.k===cur?' on':'')+(x.s?' g'+x.s:'')+'" data-f="'+esc(x.k)+'"'+pad(n,1)+'>'+ficon(x.k)+'<span>'+esc(base(x.k))+'</span>'+(x.s?'<b>'+(x.s==='C'?'!':x.s)+'</b>':'')+'<button class="vsdel" data-del="1" title="Delete" aria-label="Delete '+esc(base(x.k))+'">'+VI.del+'</button></div>'});
      return o}
    return walk(root,0)||'<div class="vsnone">empty folder</div>'}
  function vsShowWin(){np.classList.add('show');var t=$('tkVS');if(t)t.hidden=false;window.vsDock(false)}
  function vsOpenPath(a){S.vsEmpty=false;S.vsClosed=S.vsClosed||{};
    if(S.dirs[a]){S.vsPin=a;S.vsPinSig=sigNow();S.vsSelDir=null;delete S.vsClosed[a];var m=vsMode();if(m.repo&&a!==m.root){S.vsSelDir=a;vsOpenUp(a,m.root)}}
    else if(a in S.files){var d=dirname(a);S.vsPin=d;S.vsPinSig=sigNow();vsOpenUp(d,vsMode().root);S.fvfWant=a}
    else return;
    S.vsView='files';S.vsNaming=0;vsShowWin();render()}
  function vsDelete(a){var nm=base(a),isDir=!!S.dirs[a],rp=S.repo&&isDir&&under(S.repo.root,a),inr=S.repo&&a!==S.repo.root&&under(a,S.repo.root);if(inr)nm=a.slice(S.repo.root.length+1);
    vsPop('Are you sure you want to delete \''+esc(nm)+'\''+(isDir?' and everything in it':'')+'?','You can restore it from the Bin on the desktop.'+(rp?'<br><b>This folder holds a Git repo.</b> Its history (the hidden .git folder) goes to the Bin with it.':inr?'<br>Git will then show it as <b>deleted</b>. Run <code>git add '+(isDir?'.':esc(nm))+'</code> and <code>git commit</code> to save that.':''),
      [{t:'Move to Bin',fn:function(){var r=binPut(a);if(r.err){vsPop('Cannot delete',r.err);return}
        pr('<span class="c">[VS Code] Moved '+esc(nm)+' to the Bin.'+(inr?' Next: git add '+(isDir?'.':esc(nm))+', then git commit.':'')+'</span>');render()}},{t:'Cancel'}])}
  function vsRename(a){var old=base(a);
    vsAsk('Type a new name and press Enter (no spaces)',old,function(n){if(n===old)return;if(!okName(n)){vsPop('Cannot rename','Use letters, numbers, dots, dashes or underscores. No spaces.');return}
      var fa=S.fvf?vsAbs(S.fvf):null,r=fsRename(a,dirname(a)+'/'+n);if(r.err){vsPop('Cannot rename',r.err);return}
      if(fa&&under(fa,a))S.fvfWant=r.abs+fa.slice(a.length);
      pr('<span class="c">[VS Code] Renamed '+esc(old)+' to '+esc(n)+'.'+(S.repo&&under(r.abs,S.repo.root)&&r.abs!==S.repo.root?' Git will show the old name as deleted and the new name as a new file.':'')+'</span>');render()},old)}
  function vsMenu(e){var t=e.target,m=vsMode(),row=t.closest&&t.closest('.vsfile[data-f],.vsdir');
    function nw(d,kind){S.vsSelDir=d===m.root?null:d;S.vsNaming=kind;S.vsView='files';fvDraw()}
    var items;
    if(row&&row.classList.contains('vsdir')){var d=row.getAttribute('data-d');
      items=[{t:'New File...',fn:function(){nw(d,'file')}},{t:'New Folder...',fn:function(){nw(d,'dir')}},'-',{t:'Rename...',k:'F2',fn:function(){vsRename(d)}},{t:'Delete',k:'Del',fn:function(){vsDelete(d)}}]}
    else if(row){var k=row.getAttribute('data-f'),a=vsAbs(k);
      items=[{t:'Open',fn:function(){S.fvf=k;fvDraw()}},'-',{t:'Rename...',k:'F2',fn:function(){vsRename(a)}},{t:'Delete',k:'Del',fn:function(){vsDelete(a)}}]}
    else items=[{t:'New File...',fn:function(){nw(m.root,'file')}},{t:'New Folder...',fn:function(){nw(m.root,'dir')}}];
    ctxMenu(e.clientX,e.clientY,items)}
  /* VS Code is drawn again after every click; keep where you had scrolled to: the file list, the tabs, the window,
     and each file's own place in the editor (switching tabs and back keeps your spot, like real VS Code) */
  var vsSV=null,vsFileScroll={};
  function vsSaveScroll(){var np=$('notepad');if(!np)return null;var o={},ed=np.querySelector('.vscode');
    ['.vsside','.vstree','.vstabs','.npb','.vsed'].forEach(function(q){var e=np.querySelector(q);if(e)o[q]=[e.scrollTop,e.scrollLeft]});
    if(ed&&o.f===undefined&&S.fvfShown)vsFileScroll[S.fvfShown]=[ed.scrollTop,ed.scrollLeft];return o}
  function vsRestoreScroll(edDone){var np=$('notepad'),o=vsSV;vsSV=null;if(!np)return;
    if(o)keys(o).forEach(function(q){var e=np.querySelector(q);if(e){e.scrollTop=o[q][0];e.scrollLeft=o[q][1]}});
    var ed=np.querySelector('.vscode');if(ed&&!edDone){var f=vsFileScroll[S.fvf];ed.scrollTop=f?f[0]:0;ed.scrollLeft=f?f[1]:0}
    S.fvfShown=S.fvf}
  function fvDraw(){vsSV=vsSaveScroll();
    /* VS Code starts with no folder open, like the real one on first launch. It opens a folder once you use it:
       Open Folder, Open with VS Code, cd into a folder in the terminal, or tapping a file in the lab */
    if(S.vsEmpty&&(S.cwd!==HOME||S.vsPin))S.vsEmpty=false;
    if(S.vsEmpty){S.vsView='files';np.classList.remove('bad','merging');S.vsMerge=null;vsTreeHtml='';$('fvT').textContent='Visual Studio Code';
      $('fvB').innerHTML=vsShell('NO FOLDER OPENED',[],null,'<div class="vswelcome"><div class="vswt">Visual Studio Code</div><p>No folder is open yet.</p><button type="button" class="vsopenbtn" data-vsopen="1">Open Folder</button>'
        +'<p class="vshint">Opens the folder the terminal is in. You can also right-click a folder on the desktop and choose <b>Open with VS Code</b>, or <code>cd</code> into a folder in the Practice Lab.</p></div>',null);vsKeep();return}
    var m=vsMode(),T=$('fvT'),B=$('fvB'),w,ks,conf=false,folder=base(m.root)||'/',empty='<div class="vsempty">No files yet. Click the <b>New File</b> icon next to EXPLORER, or type in the terminal:<br><code>echo "Pasta" &gt; pasta.txt</code></div>';
    S.vsClosed=S.vsClosed||{};
    if(S.fvfWant){var wk=vsKeyOf(S.fvfWant,m);if(wk!==null&&(vsAbs(wk) in S.files))S.fvf=wk;S.fvfWant=null}
    if(S.vsNaming){var tg=vsTarget(m);delete S.vsClosed[tg];vsOpenUp(tg,m.root)}
    if(!m.repo){var fl=keys(S.files).filter(function(f){return f.indexOf(m.root+'/')===0&&!hasGit(f.slice(m.root.length))}).sort(function(a,b){var x=dirname(a)===m.root,y=dirname(b)===m.root;return x!==y?(x?-1:1):a<b?-1:1});np.classList.remove('bad');
      if(S.vsMerge){S.vsMerge=null;np.classList.remove('merging')}
      var nl=fl.map(function(f){return [f,'']});
      if(!fl.length){vsTreeHtml=vsTree(m,[],null);T.textContent=folder+' - Visual Studio Code';B.innerHTML=vsShell(folder,[],null,empty,null);vsKeep();return}
      if(!S.fvf||!(S.fvf in S.files)||fl.indexOf(S.fvf)<0)S.fvf=fl[0];vsTreeHtml=vsTree(m,nl,S.fvf);T.textContent=base(S.fvf)+' - '+folder+' - Visual Studio Code';
      B.innerHTML=vsShell(folder,nl,S.fvf,vsEdit(S.files[S.fvf]),null);vsKeep();return}
    w=work();ks=keys(w).sort();
    var hT=headTree();
    function st(f){return R().conf[f]?'C':!(f in R().index)?'U':w[f]!==R().index[f]?'M':R().index[f]!==hT[f]?(f in hT?'M':'A'):''}
    if(!ks.length){np.classList.remove('bad');vsTreeHtml=vsTree(m,[],null);T.textContent=folder+' - Visual Studio Code';B.innerHTML=vsShell(folder,[],null,empty,R().det?R().det:R().head);vsKeep();return}
    if(!S.fvf||!(S.fvf in w))S.fvf=ks[0];
    conf=!!R().conf[S.fvf];
    if(S.vsMerge&&(!conf||S.vsMerge.f!==S.fvf||!/^<<<<<<</m.test(w[S.fvf]||''))){S.vsMerge=null;np.classList.remove('merging')}
    var lst=ks.map(function(f){return [f,st(f)]});vsTreeHtml=vsTree(m,lst,S.fvf);
    var state=conf?'merge conflict':({U:'new file, not tracked',M:(w[S.fvf]!==R().index[S.fvf]?'changed, not staged':'staged'),A:'staged',C:'merge conflict'})[st(S.fvf)]||'saved';
    T.textContent=S.fvf+' - '+folder+' - Visual Studio Code';
    np.classList.toggle('bad',conf);
    if(conf&&!S.conflShown){S.conflShown=1;np.classList.remove('min');if(np.classList.contains('docked'))vsDock(false);np.classList.remove('flash');void np.offsetWidth;np.classList.add('flash')}
    if(!conf)S.conflShown=0;
    var nc=conf?((w[S.fvf].match(/^<<<<<<</gm)||[]).length):0;
    B.innerHTML=vsShell(folder,lst,S.fvf,(S.vsMerge&&S.vsMerge.f===S.fvf&&nc?mEditor(w[S.fvf]):nc?'<div class="vsconf">'+nc+' conflict'+(nc>1?'s':'')+' &middot; pick a change below, or edit the file yourself</div>'+fvHtml(w[S.fvf]):vsEdit(w[S.fvf]))+(/\.md$/i.test(S.fvf)?mdPrev(w[S.fvf]):'')+(nc&&!(S.vsMerge&&S.vsMerge.f===S.fvf)?'<div class="vsme"><button data-me="1">Resolve in Merge Editor</button></div>':''),(R().det?R().det:R().head)+(R().merge?' (merging)':''),state);vsKeep();
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
  var TT1=['Make a folder called recipes and go inside it','Turn it into a Git repo and set your name and email','Create a file called pasta.txt','Save it as your first commit','Connect GitHub and push it','Make a branch called feature','Change the file and commit it on the branch','Push the branch to GitHub','Go back to main','Change the same line on main and commit it','Merge feature into main (a conflict will appear)','Read the conflict markers in the file','Fix the file by writing the final line yourself','Mark it fixed and finish the merge','Push the result to GitHub','Delete the merged feature branch, here and on GitHub','Add a README file','Look at the history'];
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
   function(){return !!(S.merged&&S.repo&&!('feature' in S.repo.br)&&S.repo.remote&&!S.repo.remote.br.feature)},
   function(){return !!(S.repo&&'README.md' in headTree())},
   function(){return !!S.ran.log}
  ];
  var TT,PR,ST;
  function prog(){var k=0;while(k<PR.length&&PR[k]())k++;if(k<(S.best||0)){k=S.best;while(k<PR.length&&PR[k]())k++}S.best=k;return k}
  function render(){
    fvDraw();
    var z=zones(),ids=['z1','z2','z3','z4'];
    var tz=$('pgTrk');if(tz&&S.sig.z5!==z.z5){tz.innerHTML=z.z5;tz.hidden=!z.z5;if(S.sig.z5!==undefined&&z.z5){tz.classList.remove('flash');void tz.offsetWidth;tz.classList.add('flash')}S.sig.z5=z.z5}
    ids.forEach(function(id){var el=$(id),h=z[id];if(S.sig[id]!==h){el.innerHTML=h;var gs=el.querySelector('.gscroll');if(gs)gs.scrollLeft=gs.scrollWidth;if(S.sig[id]!==undefined){el.parentNode.classList.remove('flash');void el.parentNode.offsetWidth;el.parentNode.classList.add('flash')}S.sig[id]=h}});
    si=prog();var n=si,cur=si<ST.length?si:-1;
    $('pgCount').textContent=n+' / '+ST.length+' missions';
    var mc=$('pgMission');
    if(cur<0){mc.innerHTML='<div class="mdone">&#9733; All missions done! You just used Git for real. &#9733;</div>';
      if(!S.finished){S.finished=1;setTimeout(function(){window.gitPop&&window.gitPop('warn','MISSION COMPLETE',cs===4?'You made your own repo, saved a commit and pushed it to GitHub, all by yourself.<br><b>Now it is all yours: keep going!</b>':'You made a repo, saved commits, branched, merged, fixed a conflict and pushed.<br><b>That is the whole Git workflow.</b>',[{t:'Yay!'}])},500)}}
    else{mc.innerHTML='<div class="mnum">MISSION '+(cur+1)+' OF '+ST.length+'</div><div class="mtxt">'+TT[cur]+'</div><div class="mcmd">'+ST[cur].cmds.map(function(c){return '<code>'+esc(c.replace('@URL@',ghUrl()).replace('@FIX@','echo "...your choice..." > pasta.txt').replace('@CH@','your choice').replace(/@F@/g,(S.own&&S.own.f)||'your-folder').replace('@N@',(S.own&&S.own.n)||'Your Name').replace('@E@',(S.own&&S.own.e)||'you@example.com').replace(/^@MATE(\d)@$/,function(m,n){return RL.on?'(edit plan.txt on github.com)':'(Roli pushes to GitHub)'}))+'</code>'}).join('')+'</div>'+(ST[cur].free?'<p class="mfree">Your turn: type it yourself in the terminal.</p>':'<button id="pgType" class="greenbtn">Type it for me</button>');
      if($('pgType'))$('pgType').onclick=function(){sStep()}}
    var l='';TT.forEach(function(t,i){l+='<li class="'+(i<si?'d':i===cur?'c':'')+'">'+t+'</li>'});$('pgList').innerHTML=l;
    if(window.sDraw)sDraw();
    if(window.deskDraw)deskDraw();
  }
  /* Open Folder: a folder picker like the one on a real computer, showing the Mini laptop's folders */
  function folderPick(){if(document.querySelector('.fpk'))return;var cur=HOME,sel=null,back=[],lastTap={d:null,t:0};
    var FI='<svg viewBox="0 0 48 40" aria-hidden="true"><path d="M2 7a3 3 0 0 1 3-3h13l5 5h20a3 3 0 0 1 3 3v23a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3z" fill="#d9a83a"/><path d="M2 14h44v21a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3z" fill="#ffd36e"/></svg>';
    var ov=document.createElement('div');ov.className='fpk inwin'+(np.clientWidth<560?' narrow':'');
    ov.innerHTML='<div class="fpkw" role="dialog" aria-modal="true" aria-label="Open Folder"><div class="fpkt"><span>Open Folder</span><button type="button" data-k="cancel" class="fpktx" aria-label="Close" title="Close">x</button></div><div class="fpks"><div class="fpkh">Places</div><div class="fpkside"></div></div>'
      +'<div class="fpkm"><div class="fpkbar"><button type="button" data-k="back" aria-label="Back" title="Back">&#8249;</button><button type="button" data-k="up" aria-label="Up one folder" title="Up one folder">&#8593;</button><div class="fpkpath"></div>'
      +'<button type="button" data-k="new" title="New folder">+ Folder</button></div>'
      +'<div class="fpkgrid" role="listbox" aria-label="Folders"></div><div class="fpkfoot"><span class="fpkinfo"></span><button type="button" data-k="cancel">Cancel</button><button type="button" data-k="ok" class="fpkok">Select</button></div></div></div>';
    np.appendChild(ov);vsShowWin();
    function tl(d){return d===HOME?'~':'~'+d.slice(HOME.length)}
    function kids(d){return keys(S.dirs).filter(function(x){return x!==d&&dirname(x)===d&&base(x).charAt(0)!=='.'}).sort(function(a,b){return base(a).toLowerCase()<base(b).toLowerCase()?-1:1})}
    function go(d){if(d===cur)return;back.push(cur);cur=d;sel=null;draw()}
    function draw(){var top=[[HOME,'Home']].concat(kids(HOME).map(function(d){return [d,base(d)]}));
      ov.querySelector('.fpkside').innerHTML=top.map(function(x){return '<button type="button" class="fpksi'+(cur===x[0]||(x[0]!==HOME&&under(cur,x[0]))?' on':'')+'" data-go="'+esc(x[0])+'">'+(x[0]===HOME?'&#8962; ':'')+esc(x[1])+'</button>'}).join('');
      var parts=cur===HOME?[]:cur.slice(HOME.length+1).split('/'),acc=HOME,ph='<button type="button" class="fpkc" data-go="'+esc(HOME)+'">&#8962; Home</button>';
      parts.forEach(function(x){acc+='/'+x;ph+='<span class="fpksep">/</span><button type="button" class="fpkc" data-go="'+esc(acc)+'">'+esc(x)+'</button>'});ov.querySelector('.fpkpath').innerHTML=ph;
      var ks=kids(cur);ov.querySelector('.fpkgrid').innerHTML=ks.length?ks.map(function(d){return '<button type="button" class="fpki'+(sel===d?' on':'')+'" role="option" aria-selected="'+(sel===d)+'" data-d="'+esc(d)+'">'+FI+(S.repos&&S.repos[d]?'<em class="fpkgit">git</em>':'')+'<span>'+esc(base(d))+'</span></button>'}).join(''):'<p class="fpkempty">No folders in here. Press <b>Select</b> to open this one, or make a new folder.</p>';
      ov.querySelector('[data-k="back"]').disabled=!back.length;ov.querySelector('[data-k="up"]').disabled=cur===HOME;
      ov.querySelector('.fpkinfo').textContent='Select opens: '+tl(sel||cur)}
    function close(){ov.remove();document.removeEventListener('keydown',key,true)}
    function pick(){var t=sel||cur;close();S.vsEmpty=false;vsOpenPath(t)}
    function key(e){if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close()}else if(e.key==='Enter'&&!(e.target.closest&&e.target.closest('input'))){e.preventDefault();pick()}}
    document.addEventListener('keydown',key,true);
    ov.addEventListener('click',function(e){if(e.target===ov){close();return}var b=e.target.closest('button');if(!b)return;var k=b.getAttribute('data-k');
      if(k==='cancel'){close();return}if(k==='ok'){pick();return}
      if(k==='back'){if(back.length){cur=back.pop();sel=null;draw()}return}
      if(k==='up'){if(cur!==HOME)go(dirname(cur));return}
      if(k==='new'){var n='new-folder',i=2;while(exists(cur+'/'+n))n='new-folder-'+(i++);S.dirs[cur+'/'+n]=1;sel=cur+'/'+n;render();draw();return}
      var g=b.getAttribute('data-go');if(g){go(g);return}
      var d=b.getAttribute('data-d');if(d){var now=Date.now();if(lastTap.d===d&&now-lastTap.t<500){lastTap={d:null,t:0};go(d);return}lastTap={d:d,t:now};sel=d;draw();var nb=ov.querySelector('.fpki[data-d="'+d.replace(/"/g,'\\"')+'"]');if(nb)nb.focus()}});
    ov.addEventListener('dblclick',function(e){var b=e.target.closest('.fpki');if(b){lastTap={d:null,t:0};go(b.getAttribute('data-d'))}});
    draw();var ok=ov.querySelector('.fpkok');if(ok)ok.focus()}
  function showFile(e){if(e.target.closest&&e.target.closest('[data-vsopen]')){folderPick();return}
    if(S.vsEmpty&&e.target.closest&&e.target.closest('[data-new],[data-newdir],.fchip'))S.vsEmpty=false;
    if(e.target.closest&&e.target.closest('[data-new]')){S.vsNaming='file';fvDraw();return}
    if(e.target.closest&&e.target.closest('[data-newdir]')){S.vsNaming='dir';fvDraw();return}
    var vv=e.target.closest&&e.target.closest('[data-view]');if(vv){S.vsView=vv.getAttribute('data-view');fvDraw();return}
    if(e.target.closest&&e.target.closest('[data-brpick]')){brPick();return}
    var sc=e.target.closest&&e.target.closest('[data-scm]');if(sc){var rw=sc.closest('[data-f]');scmAct(sc.getAttribute('data-scm'),rw&&rw.getAttribute('data-f'));return}
    var dl=e.target.closest&&e.target.closest('[data-del]');if(dl){var drow=dl.closest('[data-f],[data-d]');if(drow)vsDelete(drow.hasAttribute('data-d')?drow.getAttribute('data-d'):vsAbs(drow.getAttribute('data-f')));return}
    var dr=e.target.closest&&e.target.closest('.vsdir');if(dr){var dd=dr.getAttribute('data-d');S.vsClosed=S.vsClosed||{};if(S.vsClosed[dd])delete S.vsClosed[dd];else S.vsClosed[dd]=1;S.vsSelDir=dd;fvDraw();return}
    if(e.target.closest&&(e.target.closest('[data-root]')||(e.target.classList&&e.target.classList.contains('vsside')&&!e.target.classList.contains('scmside'))||e.target.closest('.vsnone'))){S.vsSelDir=null;fvDraw();return}var ac=e.target.closest&&e.target.closest('[data-act]');if(ac){vsAccept(ac.getAttribute('data-act'));return}if(e.target.closest&&e.target.closest('[data-me]')){mOpen();return}
    if(e.target.closest&&e.target.closest('[data-mclose]')){mClose();return}
    if(e.target.closest&&e.target.closest('[data-mdone]')){mDone();return}
    var mc=e.target.closest&&e.target.closest('[data-mc]');if(mc){var k=mc.getAttribute('data-mc'),sd=mc.getAttribute('data-side'),a=S.vsMerge.pick[k]||(S.vsMerge.pick[k]=[]),ix=a.indexOf(sd);if(mc.checked&&ix<0)a.push(sd);if(!mc.checked&&ix>=0)a.splice(ix,1);fvDraw();return}var el=e.target.closest&&e.target.closest('.fchip[data-f],.vstab[data-f],.vsfile[data-f]');if(!el)return;
    if(el.classList.contains('fchip')){S.vsPin=null;S.fvf=S.repo?el.getAttribute('data-f'):S.cwd+'/'+el.getAttribute('data-f');S.vsView='files'}
    else{S.fvf=el.getAttribute('data-f');if(el.classList.contains('vsfile')&&!el.classList.contains('scmrow')){var fd=dirname(vsAbs(S.fvf));S.vsSelDir=fd===vsMode().root?null:fd}}
    fvDraw();np.classList.remove('flash');void np.offsetWidth;np.classList.add('flash')}
  $('fvB').addEventListener('click',showFile);
  longPress($('fvB'),function(t){var sd=t.closest&&t.closest('.vsside');return !!sd&&!sd.classList.contains('scmside')&&!(t.closest&&t.closest('input'))},vsMenu);
  $('fvB').addEventListener('keydown',function(e){if(e.target.closest&&e.target.closest('.vsside')&&(e.key==='F2'||e.key==='Delete')&&e.target.tagName!=='INPUT'){var row=e.target.closest('.vsfile[data-f],.vsdir');if(!row)return;var a=row.classList.contains('vsdir')?row.getAttribute('data-d'):vsAbs(row.getAttribute('data-f'));e.preventDefault();if(e.key==='F2')vsRename(a);else vsDelete(a)}});
  $('z1').addEventListener('click',showFile);
  /* over the commit graph, a normal mouse wheel moves along the history sideways */
  $('z3').addEventListener('click',function(e){var g=e.target.closest&&e.target.closest('.gn[data-c]');if(g)commitPop(g.getAttribute('data-c'))});
  $('z3').addEventListener('keydown',function(e){var g=e.target.closest&&e.target.closest('.gn[data-c]');if(g&&(e.key==='Enter'||e.key===' ')){e.preventDefault();commitPop(g.getAttribute('data-c'))}});
  $('z3').addEventListener('wheel',function(e){var g=e.target.closest&&e.target.closest('.gscroll');if(!g||Math.abs(e.deltaX)>Math.abs(e.deltaY)||g.scrollWidth<=g.clientWidth)return;
    var max=g.scrollWidth-g.clientWidth;if((e.deltaY<0&&g.scrollLeft<=0)||(e.deltaY>0&&g.scrollLeft>=max-1))return;e.preventDefault();g.scrollLeft+=e.deltaY},{passive:false});$('z2').addEventListener('click',showFile);
  /* ---------- typing animation ---------- */
  var sGen=0;
  function stopScripts(){sGen++;busy=false;scripting=false;inp.disabled=false;inp.value='';sBusy=false;holdCap=false;sAuto=false;clearTimeout(sTimer);$('stNext').disabled=false}
  function scriptRun(cmds,gap,done,speed){
    if(busy)return false;busy=true;scripting=true;inp.disabled=true;var g=sGen;
    (function next(){
      if(g!==sGen)return;
      if(!cmds.length){busy=false;scripting=false;inp.disabled=false;try{inp.focus({preventScroll:true})}catch(z){}if(done)done();return}
      var c=cmds.shift(),i=0;inp.value='';
      var iv=setInterval(function(){if(g!==sGen){clearInterval(iv);return}i++;inp.value=c.slice(0,i);if(i>=c.length){clearInterval(iv);setTimeout(function(){if(g!==sGen)return;inp.value='';run(c);setTimeout(function w(){if(g!==sGen)return;if(pend)setTimeout(w,300);else next()},gap||420)},speed?500:260)}},speed||22);
    })();
    return true;
  }
  function reset(){if(RL){RL.known={};RL.map={}}if(typeof tvUse==='function'&&tvCur!=='lab'&&!busy&&!pend)tvUse('lab');fresh();TV.lab.out.innerHTML='';if(TV.term)TV.term.cwd=HOME;pl('Welcome to your Mini laptop! Type  help  to see what you can do.','y');setPrompt();S.sig={};render()}
  labIn.addEventListener('focus',function(){if(!busy&&!pend)tvUse('lab')});
  labIn.addEventListener('keydown',function(e){
    if(tvCur!=='lab'){if(busy||pend){if(e.key==='Enter')e.preventDefault();return}tvUse('lab')}
    if(e.key==='Enter'){var v=labIn.value;labIn.value='';run(v)}
    else if(e.key==='ArrowUp'){if(S.hi>0){S.hi--;labIn.value=S.hist[S.hi]||'';e.preventDefault()}}
    else if(e.key==='ArrowDown'){if(S.hi<S.hist.length){S.hi++;labIn.value=S.hist[S.hi]||'';e.preventDefault()}}
    else if(e.key==='l'&&e.ctrlKey){TV.lab.out.innerHTML='';e.preventDefault()}
  });
  labIn.addEventListener('paste',function(e){if(tvCur!=='lab'){if(busy||pend)return;tvUse('lab')}
    var t=(e.clipboardData||window.clipboardData).getData('text');if(!/[\r\n]/.test(t))return;
    e.preventDefault();if(busy)return;
    var lines=(inp.value+t).split(/\r?\n/).filter(function(l){return l.trim()});inp.value='';
    busy=true;scripting=true;inp.disabled=true;var g=sGen;
    (function next(){if(g!==sGen)return;if(pend){setTimeout(next,300);return}
      if(!lines.length){busy=false;scripting=false;inp.disabled=false;inp.focus({preventScroll:true});return}
      run(lines.shift());setTimeout(next,120)})();
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
        .then(function(){RL.known={};RL.map={};pl('Done. Every file is deleted, but GitHub keeps the old commits (that is how Git works).','y');pl('Starting again? Type  git pull  first to bring that history down, then add your files, commit and push.','y')});
    }).catch(function(){perr('Could not reach GitHub.')}).then(function(){busy=false;inp.disabled=false;inp.focus({preventScroll:true});refreshLive()});
  }
  $('pgReset').onclick=function(){if(pend)return;stopScripts();
    if(RL.on&&window.gitPop)window.gitPop('err','CLEAR EVERYTHING?','This clears the terminal, deletes the files on your Mini laptop and starts over.<br><br>Also delete every file in <b>github.com/'+esc(RL.repo)+'</b>?',[{t:'Laptop only',fn:reset},{t:'Laptop + GitHub',fn:wipeReal},{t:'Cancel'}]);
    else reset()};
  $('pgReadme').onclick=function(){if(busy)return;
    if(!S.repo||!S.cfg.name){window.gitPop&&window.gitPop('warn','MAKE A REPO FIRST','A README lives inside a repo. Run <code>git init</code> and set your name and email first, or press Start the story.');return}
    var cm=['echo "# My Project" > README.md','echo "What it is: a small demo project." >> README.md','echo "How to use it: open the files and read." >> README.md','git add README.md','git commit -m "Add README"'];
    if(S.repo.remote)cm.push(S.repo.up&&S.repo.up[S.repo.head]?'git push':'git push -u origin '+S.repo.head);scriptRun(cm,900,null,true)};
  function ghUrl(){return 'https://github.com/'+(RL.on?RL.repo:'you/'+((cs===4?(S.own&&S.own.f):['recipes','notes','shop','team'][cs])||'recipes'))+'.git'}
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
   {say:'The feature work is part of main now, so the <b>feature</b> branch is done. <b>git branch -d</b> deletes it on your laptop (it only deletes branches that are merged), and <b>git push origin --delete</b> deletes it on GitHub.',cmds:['git branch -d feature','git push origin --delete feature']},
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
   {say:'Oops, we needed it! <b>git revert HEAD</b> undoes the last commit by making a <b>new</b> commit. Nothing is ever lost, because history keeps everything. (Any older commit works too: <b>git revert</b> and its id from <b>git log --oneline</b>.)',cmds:['git revert HEAD']},
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
  var TT4=['Make a folder called team and set up Git','Write plan.txt and commit it','Connect GitHub and push','Your teammate pushes to GitHub','Ask git status (it says up to date!)','Download Roli\'s commit with git fetch','Ask git status again: behind by 1','Bring it in with git pull','Bonus: your teammate changes line 1','Change line 1 yourself and commit','Push (GitHub refuses)','Pull: a merge conflict','Fix the file','Finish the merge and push'];
  var ST4=[
   {say:'A new project called <b>team</b>. You and your teammate <b>Roli</b> will both work on it.',cmds:['mkdir team','cd team','git init','git config --global user.name "Nishita"','git config --global user.email "you@example.com"']},
   {say:'You write the plan and save it as the first commit.',cmds:['echo "Plan: build a website" > plan.txt','git add plan.txt','git commit -m "Add the plan"']},
   {say:'Connect GitHub and push. Now Roli can clone the repo and work on it too.',cmds:['git remote add origin @URL@','git push -u origin main']},
   {say:'Meanwhile, on another laptop, <b>Roli pushes a commit</b> that adds a line to plan.txt. Look at box 4: GitHub has a new commit. Your laptop has no idea yet.',cmds:['@MATE1@'],mate:1},
   {say:'Ask Git. It says <b>up to date</b>! <b>git status</b> never asks GitHub. It compares with <b>origin/main</b>: your laptop\'s memory of GitHub from the last time they talked.',cmds:['git status']},
   {say:'<b>git fetch</b> downloads Roli\'s commit but does <b>not</b> touch your files. Watch the graph: only the white <b>origin/main</b> tag moves. main and plan.txt stay as they were.',cmds:['git fetch']},
   {say:'Ask again. Now Git knows: your branch is <b>behind origin/main by 1 commit</b>. Box 4 says so too.',cmds:['git status']},
   {say:'<b>git pull</b> is git fetch plus git merge. <b>main</b> moves up to origin/main, and plan.txt now has Roli\'s line. Look at VS Code.',cmds:['git pull','cat plan.txt']},
   {say:'<b>Bonus ending: a conflict.</b> Roli changes <b>line 1</b> and pushes: Roli wants an app, not a website.',cmds:['@MATE2@'],mate:2},
   {say:'At the same time you change <b>the same line</b> on your laptop and commit it, without pulling first.',cmds:['echo "Plan: build a game" > plan.txt','echo "Roli: I will make the logo" >> plan.txt','git add plan.txt','git commit -m "Make it a game"']},
   {say:'Push. GitHub <b>refuses</b>: it has Roli\'s new commit and you do not. Real Git says <b>fetch first</b>.',cmds:['git push'],stop:true},
   {say:'Pull to bring Roli\'s commit down. You both changed line 1, so Git stops with a <b>merge conflict</b> in plan.txt.',cmds:['git pull'],stop:true},
   {say:'Talk to your teammate and decide together. Here you keep <b>both ideas</b>: a game app. (In VS Code you could also use the Accept buttons.)',cmds:['echo "Plan: build a game app" > plan.txt','echo "Roli: I will make the logo" >> plan.txt']},
   {say:'Mark it fixed, finish the merge and push. GitHub now has both of your work, and <b>git log</b> shows the whole story.',cmds:['git add plan.txt','git commit -m "Merge Roli\'s plan"','git push','git log --oneline']}
  ];
  function inTeam(){return !!(S.repo&&S.dirs[HOME+'/team'])}
  var PR4=[
   function(){return !!(S.repo&&S.cfg.name&&S.cfg.email&&S.dirs[HOME+'/team'])},
   function(){return inTeam()&&hasC('plan.txt')},
   function(){return inTeam()&&!!(S.repo.remote&&S.repo.remote.br.main)},
   function(){return !!S.mate1},
   function(){return !!S.ran.st1},
   function(){return !!S.ran.f1},
   function(){return !!(S.ran.st2||S.ran.p1)},
   function(){return !!S.ran.p1},
   function(){return !!S.mate2},
   function(){return !!S.mate2&&/build a game/.test(headTree()['plan.txt']||'')},
   function(){return !!S.ran.rej2},
   function(){return !!S.ran.pc2},
   function(){return !!S.ran.pc2&&(!S.repo.merge||!/<<<<<<</.test(work()['plan.txt']||''))},
   function(){return !!S.ran.pc2&&!S.repo.merge&&!!S.ran.log&&S.repo.remote.br.main===S.repo.br.main}
  ];
  /* the teammate: in the simulator Roli pushes to the pretend GitHub; in Real GitHub mode, you play Roli on github.com */
  function mateEdit(n){var url='https://github.com/'+RL.repo+'/edit/'+(R()?R().head:'main')+'/plan.txt';
    return 'Now <b>you</b> play Roli. Open <a href="'+url+'" target="_blank" rel="noopener">plan.txt on GitHub</a> (the pencil icon edits it), '
      +(n===1?'add a new line <code>Roli: I will make the logo</code>':'change line 1 to <code>Plan: build an app</code>')
      +' and press <b>Commit changes</b>. Then come back here and press <b>Next step</b>. Your laptop will not notice by itself, just like real Git.'}
  function mateDo(n){var r=R();if(!r||!r.remote||!r.remote.br[r.head]){pl('(Roli can only push after you have pushed to GitHub.)','y');return}
    if(RL.on){S['mate'+n]=1;pr('<span class="y">[Your turn to play Roli: edit plan.txt on github.com, then press Next step.]</span>');return}
    var tip=r.remote.br[r.head],tf=copy(C(tip).files),t=tf['plan.txt']||'';
    if(n===1)tf['plan.txt']=t+'Roli: I will make the logo\n';
    else{var ls=t.replace(/\n$/,'').split('\n');ls[0]='Plan: build an app';tf['plan.txt']=ls.join('\n')+'\n'}
    var c=cfin({id:'',msg:n===1?'Add Roli\'s line':'Make it an app',p:[tip],files:tf,br:r.head,n:++S.n,who:'Roli',hidden:true});r.cm[c.id]=c;r.list.push(c);r.remote.br[r.head]=c.id;S['mate'+n]=c.id;ghShare(r);
    pr('<span class="y">[Meanwhile on GitHub: Roli pushed "'+esc(c.msg)+'". Your laptop does not know yet.]</span>')}
  /* story 5: your own project. You pick the folder name, your name and email; the set-up is typed for you, then it is your turn */
  var TT5=['Set up your project folder (done for you)','Create a file in it','Stage it: git add .','Save it: git commit -m "..."','Upload it: git push -u origin main'];
  var ST5=[
   {say:'The Mini laptop makes your folder, turns it into a Git repo, tells Git your name and email, and connects it to GitHub. Watch each command.',cmds:['mkdir @F@','cd @F@','git init','git config --global user.name "@N@"','git config --global user.email "@E@"','git remote add origin @URL@'],own:true},
   {say:'<b>Your turn.</b> Make a file in your folder. Type for example <code>echo "Hello" &gt; hello.txt</code>, or use <b>New File</b> in VS Code.',cmds:['echo "Hello" > hello.txt'],free:true},
   {say:'<b>Your turn.</b> Put everything in the staging area: <code>git add .</code> (the dot means everything here).',cmds:['git add .'],free:true},
   {say:'<b>Your turn.</b> Save a commit with a message that says what you did, like <code>git commit -m "Add hello"</code>.',cmds:['git commit -m "Add hello"'],free:true},
   {say:'<b>Your turn.</b> Upload it to GitHub: <code>git push -u origin main</code>.',cmds:['git push -u origin main'],free:true}
  ];
  function ownRepo(){return S.own&&S.repos[HOME+'/'+S.own.f]}
  function ownFiles(){var rp=ownRepo();if(!rp)return [];return keys(S.files).filter(function(f){return f.indexOf(rp.root+'/')===0&&!hasGit(f.slice(rp.root.length))})}
  var PR5=[
   function(){var rp=ownRepo();return !!(rp&&S.cfg.name&&S.cfg.email&&rp.remote)},
   function(){var rp=ownRepo();return !!rp&&(ownFiles().length>0||!!rp.br[rp.head])},
   function(){var rp=ownRepo();if(!rp)return false;var h=rp.br[rp.head];return !!h||keys(rp.index).length>0},
   function(){var rp=ownRepo();return !!(rp&&rp.br[rp.head])},
   function(){var rp=ownRepo();return !!(rp&&rp.br[rp.head]&&rp.remote&&rp.remote.br[rp.head]===rp.br[rp.head])}
  ];
  /* the little form for story 5 */
  function ownForm(k){sAuto=false;holdCap=true;var nm=(S.cfg.name||'').replace(/"/g,''),em=S.cfg.email||'';
    $('stSay').innerHTML='<span class="stn">STEP 1</span> Choose a name for your project folder and tell Git who you are.'
      +'<div class="ownf"><label>Folder name<input id="ownF" value="my-project" autocomplete="off" spellcheck="false" autocapitalize="off"></label>'
      +'<label>Your name<input id="ownN" value="'+esc(nm)+'" placeholder="Nishita" autocomplete="off"></label>'
      +'<label>Your email<input id="ownE" value="'+esc(em)+'" placeholder="you@example.com" autocomplete="off" type="email"></label>'
      +'<button type="button" class="greenbtn" id="ownGo">Set it up</button><p class="ownerr" id="ownErr" role="alert"></p></div>';
    var go=function(){var f=$('ownF').value.trim(),n=$('ownN').value.trim().replace(/"/g,''),e=$('ownE').value.trim().replace(/"/g,''),er='';
      if(!okName(f))er='The folder name can only use letters, numbers, dots, dashes and underscores (no spaces).';
      else if(S.dirs[HOME+'/'+f])er='There is already something called '+esc(f)+' in your home folder. Pick another name.';
      else if(!n)er='Type your name.';else if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e))er='Type an email address, like you@example.com.';
      if(er){$('ownErr').innerHTML=er;return}S.own={f:f,n:n,e:e};sRun(k)};
    $('ownGo').onclick=go;['ownF','ownN','ownE'].forEach(function(id){$(id).addEventListener('keydown',function(ev){ev.stopPropagation();if(ev.key==='Enter'){ev.preventDefault();go()}})});
    setTimeout(function(){try{$('ownF').focus();$('ownF').select()}catch(z){}},30)}
  var STORIES=[{n:'1. Pasta, branch, conflict',h:'GUIDED STORY: PASTA, BRANCH, CONFLICT',ST:ST1,TT:TT1,PR:PR1},{n:'2. Deleting files',h:'GUIDED STORY: DELETING FILES',ST:ST2,TT:TT2,PR:PR2},{n:'3. The .gitignore file',h:'GUIDED STORY: THE .GITIGNORE FILE',ST:ST3,TT:TT3,PR:PR3},{n:'4. Teammates: fetch and pull',h:'GUIDED STORY: TEAMMATES, FETCH AND PULL',ST:ST4,TT:TT4,PR:PR4},{n:'5. Your own project',h:'GUIDED STORY: YOUR OWN PROJECT',ST:ST5,TT:TT5,PR:PR5}];
  STORIES[2].h='GUIDED STORY: THE .gitignore FILE';
  ST=ST1;TT=TT1;PR=PR1;
  (function(){var h='';STORIES.forEach(function(s,k){h+='<button data-k="'+k+'" class="'+(k===0?'on':'')+'">'+s.n+'</button>'});$('stTabs').innerHTML=h;
    $('stTabs').onclick=function(e){var b=e.target.closest('button');if(!b||pend)return;var k=+b.getAttribute('data-k');if(k===cs)return;stopScripts();
      cs=k;ST=STORIES[k].ST;TT=STORIES[k].TT;PR=STORIES[k].PR;sAuto=false;clearTimeout(sTimer);holdCap=false;
      Array.prototype.forEach.call($('stTabs').children,function(x,i){x.className=i===k?'on':''});$('stH').textContent=STORIES[k].h;reset()}})();
  function sDraw(){
    var d='';ST.forEach(function(x,k){d+='<i class="'+(k<si?'d':k===si?'c':'')+'"></i>'});$('sDots').innerHTML=d;
    $('stC').textContent=Math.min(si,ST.length)+' / '+ST.length;
    $('stNext').textContent=si===0&&!S.repo?'Start the story':si>=ST.length?'Play again':ST[si]&&ST[si].free?'Show the hint':'Next step';
    $('stAuto').textContent=sAuto?'Pause':'Auto-play';$('stAuto').className=sAuto?'on':'';
    if(!sBusy&&!holdCap){
      if(si>=ST.length)$('stSay').innerHTML=cs===4?'<b>Your project is on GitHub!</b> From here it is all yours: change files, make branches, commit and push. The boxes on the right keep showing what Git sees.':'<b>The whole story is done.</b> You can press Play again, or type anything you like in the terminal.';
      else if(si===0&&ST[0].own&&!S.own)$('stSay').innerHTML='Press <b>Start the story</b>, then type a name for your folder, your name and your email. The Mini laptop sets everything up for you. After that it is your turn: make a file, then <b>git add</b>, <b>git commit</b> and <b>git push</b> it yourself.';
      else if(si===0&&!S.repo&&!S.dirs[HOME+'/recipes'])$('stSay').innerHTML='Press <b>Start the story</b>. You will watch every command get typed, and a line under it will explain what it does. You can go one step at a time, or press Auto-play. You can also type the commands yourself, and the story moves ahead with you.';
      else $('stSay').innerHTML='<span class="stn">UP NEXT: STEP '+(si+1)+'</span> '+ST[si].say;
    }
  }
  window.sDraw=sDraw;
  var CH={red:['Pasta with red sauce','keep red sauce'],white:['Pasta with white sauce','keep white sauce'],both:['Pasta with red and white sauce','use both sauces']};
  function sStep(){
    if(sBusy)return;clearTimeout(sTimer);
    if(busy){sTimer=setTimeout(sStep,400);return}
    if(si>=ST.length){reset();si=0}
    var k=si,st=ST[k];
    if(st.own&&!S.own){ownForm(k);return}
    if(st.free){sAuto=false;holdCap=true;sDraw();$('stSay').innerHTML='<span class="stn">STEP '+(k+1)+': YOUR TURN</span> '+st.say+' Type it in the terminal below. The story moves on when Git sees you did it.';try{inp.focus({preventScroll:true})}catch(z){}return}
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
    var cmds=st.cmds.map(function(c){var o=S.own||{};return c.replace('@URL@',ghUrl()).replace(/@F@/g,o.f||'').replace('@N@',o.n||'').replace('@E@',o.e||'').replace('@FIX@','echo "'+ch[0]+'" > pasta.txt').replace('@CH@',ch[1])});
    var g=sGen;S.pushRej=false;
    function finish(){
        sBusy=false;$('stNext').disabled=false;render();
        var adv=si>k;
        if(si>=ST.length){sAuto=false;holdCap=false;sDraw();return}
        /* the step ran but its goal is still not met (e.g. a file was renamed by hand): say so instead of looping */
        if(!adv&&si<=k&&!st.choose&&RL.on&&S.pushFail){sAuto=false;holdCap=true;
          $('stSay').innerHTML='<span class="stn stwarn">STEP '+(si+1)+' DID NOT FINISH</span> The push to GitHub failed (the red message in the terminal says why). Type <b>git push</b> to try again: it carries on from where it stopped.';return}
        if(!adv&&si<=k&&!st.choose&&!(R()&&R().merge)&&RL.on&&cs===3&&S.mate1&&[6,7,10,11].indexOf(si)>=0){sAuto=false;holdCap=true;
          $('stSay').innerHTML='<span class="stn stwarn">STUCK AT STEP '+(si+1)+'</span> Git found nothing new on GitHub. Did you press <b>Commit changes</b> on github.com? '+mateEdit(S.mate2?2:1).replace(/ Then come back here and press <b>Next step<\/b>\./,'')+' Then type <b>git fetch</b> and <b>git status</b> here (or <b>git pull</b> for the bonus ending).';return}
        if(!adv&&si<=k&&!st.choose&&!(R()&&R().merge)){sAuto=false;holdCap=true;
          $('stSay').innerHTML='<span class="stn stwarn">STUCK AT STEP '+(si+1)+'</span> This step needs: <b>'+TT[si]+'</b>. Something on your Mini laptop is different from what the story expects (for example, a file with another name). Press <b>Restart story</b> to start again cleanly, or fix it by hand in the terminal.'+(RL.on&&cs===3&&S.mate1?' In Real GitHub mode, check that you pressed <b>Commit changes</b> on github.com, then type <b>git fetch</b> and <b>git status</b> again.':'');return}
        if(sAuto&&adv&&!st.stop)sTimer=setTimeout(sStep,3600);
        else if(sAuto){sAuto=false;sDraw();if(st.stop)$('stSay').innerHTML+=' <b>Press Next step to continue.</b>'}}
    /* Real GitHub mode, like real Git: a push is refused when the demo repo already has commits from before
       (even after "Delete everything", which keeps the history). Bring them down first, then push again. */
    function afterRun(){if(g!==sGen)return;
      if(RL.on&&S.pushRej&&R()&&!R().merge&&!S.mate2){S.pushRej=false;
        $('stSay').innerHTML='<span class="stn">STEP '+(k+1)+'</span> GitHub refused: your demo repo already has commits from before (<b>Delete everything</b> removes files but keeps the history). Real Git makes you bring them down first with <b>git pull origin '+R().head+' --allow-unrelated-histories</b>, then push again.';
        scriptRun(['git pull origin '+R().head+' --allow-unrelated-histories','git push -u origin '+R().head],1300,function(){if(g!==sGen)return;
          if(R()&&R().merge){sAuto=false;$('stSay').innerHTML='<span class="stn">STEP '+(k+1)+'</span> The old files on GitHub clash with this story (a merge conflict). Fix the file in VS Code, then <b>git add</b>, <b>git commit</b> and <b>git push</b>. Or press <b>Delete everything in this repo</b> and <b>Restart story</b>.'}
          finish()},true);return}
      finish()}
    sTimer=setTimeout(function(){
      if(g!==sGen)return;
      var mates=cmds.filter(function(c){return /^@MATE\d@$/.test(c)});cmds=cmds.filter(function(c){return !/^@MATE\d@$/.test(c)});
      mates.forEach(function(m){mateDo(+m.charAt(5))});
      if(mates.length&&RL.on){render();sAuto=false;$('stSay').innerHTML='<span class="stn">STEP '+(k+1)+'</span> '+mateEdit(+mates[0].charAt(5));sBusy=false;$('stNext').disabled=false;sDraw();return}
      var ok=scriptRun(cmds,1100,afterRun,true);
      if(!ok){sBusy=false;holdCap=false;$('stNext').disabled=false;sDraw()}
    },900);
  }
  $('stNext').onclick=function(){sStep()};
  $('stAuto').onclick=function(){sAuto=!sAuto;sDraw();if(sAuto&&!sBusy)sStep();else if(!sAuto)clearTimeout(sTimer)};
  $('stRestart').onclick=function(){if(pend)return;stopScripts();reset();sDraw()};
  $('pgMate').onclick=function(){
    if(busy)return;var r=S.repo;
    if(!r||!r.remote||!r.remote.br[r.head]){window.gitPop&&window.gitPop('warn','NOT YET','Push something to GitHub first. Finish the missions up to <b>git push</b>, or press Watch a demo then push.');return}
    var tip=r.remote.br[r.head],tf=copy(C(tip).files);tf['from-roli.txt']='Hi from Roli\n';
    var cur=r.head;var c=cfin({id:'',msg:'Roli adds a note',p:[tip],files:tf,br:cur,n:++S.n,who:'Roli',hidden:true});r.cm[c.id]=c;r.list.push(c);r.remote.br[cur]=c.id;ghShare(r);
    pr('<span class="y">[A teammate (Roli) just pushed a commit to GitHub.]</span>');
    window.gitPop&&window.gitPop('warn','NEW ON GITHUB','Roli pushed new work to GitHub.<br>You do not have it yet. Type <code>git pull</code> to bring it down.');render();
  };

  /* ---------- REAL GitHub mode ---------- */
  var RL={on:false,repo:'',tok:'',def:'main',view:'main',seen:{},timer:null,blobs:{}};
  /* known and map belong to each local repo (a clone has its own commits), so they live on the repo */
  ['known','map'].forEach(function(k){Object.defineProperty(RL,k,{get:function(){var r=S&&S.repo;if(!r)return {};return r['rl'+k]||(r['rl'+k]={})},set:function(v){var r=S&&S.repo;if(r)r['rl'+k]=v}})});
  /* known[branch]: the GitHub commit our copy of that branch matches. map: GitHub commit id -> our commit, for commits we already have. */
  var EMPTY_TREE='4b825dc642cb6eb9a060e54bf8d69288fbee4904'; // Git's id for "no files at all"; GitHub answers 404 for it
  function ghRepo(r){return (r&&r.ghRepo)||RL.repo}
  function ghDef(r){return (r&&r.ghDef)||RL.def}
  function realTree(sha,repo){repo=repo||ghRepo(R());if(sha===EMPTY_TREE)return Promise.resolve({});return gh('GET','/repos/'+repo+'/git/trees/'+sha+'?recursive=1').then(function(t){if(t.s!==200)throw new Error('could not read the files of one commit ('+t.s+')');
    var all=t.j.tree.filter(function(x){return x.type==='blob'});if(all.length>200)RL.trunc=true;var fl=all.slice(0,200),files={};
    return seq(fl,function(f){if(RL.blobs[f.sha]!==undefined){files[f.path]=RL.blobs[f.sha];return}
      return gh('GET','/repos/'+repo+'/git/blobs/'+f.sha).then(function(b){var raw=((b.j&&b.j.content)||'').replace(/\s+/g,''),txt=null,ext=(f.path.match(/\.([a-z0-9]+)$/i)||[,''])[1].toLowerCase();
        var MIME={png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',gif:'image/gif',webp:'image/webp',svg:'image/svg+xml',ico:'image/x-icon',pdf:'application/pdf',zip:'application/zip'};
        if(!MIME[ext]||ext==='svg'){try{txt=decodeURIComponent(escape(atob(raw)));if(/\u0000/.test(txt))txt=null}catch(e){txt=null}}
        if(txt===null)txt=binReg('gh:'+f.sha,raw,MIME[ext],base(f.path));
        RL.blobs[f.sha]=txt;files[f.path]=txt})}).then(function(){return files})})}
  /* git fetch / git pull in Real GitHub mode: download the commits GitHub has that we don't, then carry on as normal */
  /* run fn over items, a few at a time (much faster than one by one, still gentle on GitHub) */
  function pool(items,n,fn){var i=0;function next(){if(i>=items.length)return Promise.resolve();var it=items[i++];return fn(it).then(next)}var w=[];for(var k=0;k<Math.min(n,items.length);k++)w.push(next());return Promise.all(w)}
  /* git fetch / git pull in Real GitHub mode, like real Git: download every commit GitHub has that we do not have yet
     (the whole history the first time), with its real parents, so merges stay merges */
  function realFetch(br,done,quiet,max){var r=R(),repo=ghRepo(r),shallow=false;pend=true;busy=true;inp.disabled=true;
    if(!quiet)pl('Fetching from github.com/'+repo+' (this one is real)...','y');
    function fin(res){if(!quiet){pend=false;if(!scripting){busy=false;inp.disabled=false;inp.focus({preventScroll:true})}}try{done(res||{})}catch(e){perr('error: '+e.message)}setPrompt();render()}
    gh('GET','/repos/'+repo+'/git/ref/heads/'+encodeURIComponent(br)).then(function(x){
      if(x.s!==200)return {};
      var head=x.j.object.sha;if(RL.map[head]){r.remote.br[br]=RL.map[head];RL.known[br]=head;return {}}
      var fresh=[],page=1;
      function more(){return gh('GET','/repos/'+repo+'/commits?sha='+encodeURIComponent(br)+'&per_page=100&page='+page).then(function(cl){
        if(cl.s!==200)throw new Error('GitHub said '+cl.s);
        var hit=false;cl.j.forEach(function(c){if(RL.map[c.sha])hit=true;else fresh.push(c)});
        if(max&&fresh.length>=max){if(!hit&&(cl.j.length===100||fresh.length>max))shallow=true;return}
        if(hit||cl.j.length<100||page>=20)return;page++;return more()})}
      return more().then(function(){
        /* a big repo: keep only the newest commits (like git clone --depth); the oldest one kept becomes the start of the history */
        if(max&&fresh.length>max){fresh=fresh.slice(0,max);shallow=true}
        var bySha={};fresh.forEach(function(c){bySha[c.sha]=c});var trees={},got=0;
        /* only what the branch really contains: walk back from GitHub's newest commit, stopping at commits we already have */
        var need=[],seen={},stack=[head];while(stack.length){var q=stack.pop();if(seen[q]||RL.map[q]||!bySha[q])continue;seen[q]=1;need.push(bySha[q]);(bySha[q].parents||[]).forEach(function(pp){stack.push(pp.sha)})}
        fresh=need;
        if(!quiet)pl('Receiving '+fresh.length+' commit'+(fresh.length===1?'':'s')+'...');
        return pool(fresh,6,function(c){return realTree(c.commit.tree.sha,repo).then(function(f){trees[c.sha]=f;got++})}).then(function(){
          var made={};
          function build(sha){if(RL.map[sha])return RL.map[sha];var c=bySha[sha];if(!c)return null;if(made[sha])return made[sha];
            var ps=(c.parents||[]).map(function(q){return build(q.sha)}).filter(Boolean);
            var sc={id:sha.slice(0,7),full:sha,msg:(c.commit.message||'').split('\n')[0],p:ps,files:trees[sha],br:br,n:++S.n,who:(c.commit.author&&c.commit.author.name)||'GitHub',hidden:true};FULLID[sc.id]=sha;
            if(c.commit.author&&c.commit.author.date){sc.ts=Math.floor(Date.parse(c.commit.author.date)/1000);sc.email=c.commit.author.email}
            r.cm[sc.id]=sc;r.list.push(sc);made[sha]=sc.id;RL.map[sha]=sc.id;return sc.id}
          build(head);
          if(RL.map[head]){r.remote.br[br]=RL.map[head];RL.known[br]=head}
          if(!quiet)pl('Receiving objects: 100% ('+got+'/'+fresh.length+'), done.');return {shallow:shallow}})})
    }).then(fin,function(e){fin({err:'fatal: could not read from GitHub ('+((e&&e.message)||'network error')+')'})})}
  var rb=$('realBox'),rbody=$('realB');
  function gh(method,path,body){
    return fetch('https://api.github.com'+path,{method:method,cache:'no-store',headers:{'Authorization':'Bearer '+RL.tok,'Accept':'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'},body:body?JSON.stringify(body):undefined}).then(function(r){return r.json().catch(function(){return {}}).then(function(j){return {s:r.status,j:j,m:method,u:path,need:r.headers.get('x-accepted-github-permissions')}})});
  }
  function b64(t){return btoa(unescape(encodeURIComponent(t)))}
  function ago(d){var s=Math.max(0,(Date.now()-new Date(d))/1000);return s<60?'just now':s<3600?Math.floor(s/60)+' min ago':Math.floor(s/3600)+' h ago'}
  /* while switching repos, the rest of the Practice Lab is greyed out (nothing else can be clicked or typed) */
  function labLock(on){RL.form=!!on;$('pg').classList.toggle('rswitching',!!on);labIn.disabled=!!on}
  /* while GitHub answers, the panel greys out too, so Connect cannot be pressed twice */
  function rbBusy(t){rbody.classList.add('rbusy');rbody.querySelectorAll('button,input').forEach(function(e){e.disabled=true});var m=document.createElement('p');m.className='rbusymsg';m.textContent=t;rbody.insertBefore(m,rbody.firstChild)}
  function setupForm(msg,sw){rbody.classList.remove('rbusy');
    rbody.innerHTML='<ol class="rsteps"><li><b>Make a token.</b> <a href="https://github.com/settings/tokens/new" target="_blank" rel="noopener">Open github.com/settings/tokens/new</a>, tick <b>repo</b>, set <b>Expiration</b> to <b>7 days</b>, scroll down, click <b>Generate token</b>, and copy it.</li>'
     +'<li><b>Pick the repo.</b> Already have an empty repo? Paste its link. No repo yet? Make one right here, below.</li></ol>'
     +'<label class="rf">Token (starts with ghp_ or github_pat_)<input id="rfTok" type="password" placeholder="paste the token here" autocomplete="off"></label>'
     +'<label class="rf">Repo link<input id="rfRepo" placeholder="https://github.com/your-name/your-repo" value="'+esc(RL.repo)+'"></label>'
     +'<p class="empty" style="margin:4px 0 0">The token stays in this tab only. It is never saved.</p>'
     +(msg?'<p class="rerr">'+esc(msg)+'</p>':'')
     +'<div class="btns" style="justify-content:flex-start;margin:8px 0 0"><button class="greenbtn" id="rfGo">Connect</button><button id="rfOff">Back to Mini laptop only</button></div>'
     +'<div class="rfnew"><b>No repo yet? Make one</b><span class="rfnewrow"><input id="rfNewName" placeholder="my-first-repo" aria-label="New repo name" autocomplete="off" spellcheck="false">'
     +'<label><input type="radio" name="rfVis" value="public" checked> Public</label><label><input type="radio" name="rfVis" value="private"> Private</label></span>'
     +'<div class="btns" style="justify-content:flex-start;margin:6px 0 0"><button id="rfNew">Create it and connect</button></div><small>Your token makes an empty repo on your GitHub account (like github.com/new), then connects to it.</small></div>';
    $('rfGo').onclick=connect;$('rfOff').onclick=realOff;$('rfNew').onclick=connectNew;
    /* switching repos: you stay logged in (the token is kept), and Cancel goes back to the repo you were on */
    if(sw&&RL.on){labLock(true);$('rfTok').value=RL.tok;var st=rbody.querySelector('.rsteps');if(st)st.outerHTML='<p class="rswitch"><b>Switch repo.</b> You stay logged in. Paste another repo\'s link and press <b>Connect</b>, or make a new repo below. Now on: <b>'+esc(RL.repo)+'</b></p>';
      $('rfRepo').value='';var c=$('rfOff');c.textContent='Cancel';c.onclick=function(){labLock(false);refreshLive(true)}}
    $('rfNewName').addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();connectNew()}});
  }
  function parseRepo(v){v=v.trim();var m=v.match(/github\.com[\/:]([\w.-]+)\/([\w.-]+?)(?:\.git)?(?:[\/?#].*)?$/);if(m)return m[1]+'/'+m[2];m=v.match(/^([\w.-]+)\/([\w.-]+)$/);return m?m[1]+'/'+m[2].replace(/\.git$/,''):''}
  function connect(){tvUse('lab');
    var rp=parseRepo($('rfRepo').value),tk=$('rfTok').value.trim();
    if(!rp||!tk){RL.repo=rp;setupForm(!tk?'Paste the token first.':'Paste the repo link (like https://github.com/you/your-repo), or make a new repo below.');if(tk)$('rfTok').value=tk;return}
    connectTo(rp,tk)}
  /* no repo yet: make it with the token (POST /user/repos), then connect to it */
  function connectNew(){tvUse('lab');var tk=$('rfTok').value.trim(),nm=ghFixName($('rfNewName').value),priv=!!document.querySelector('input[name="rfVis"][value="private"]:checked');
    function again(m){setupForm(m,RL.on);$('rfTok').value=tk;$('rfNewName').value=nm;if(priv)document.querySelector('input[name="rfVis"][value="private"]').checked=true}
    if(!tk){again('Paste the token first: it is what makes the repo on your account.');return}
    if(!nm||nm==='.'||nm==='..'){again('Type a name for the new repo, like my-first-repo.');return}
    RL.tok=tk;rbBusy('Making github.com/.../'+nm+' ...');
    gh('POST','/user/repos',{name:nm,description:'Made with the Git & GitHub Workshop Mini laptop',private:priv,auto_init:false}).then(function(x){
      if(x.s===201||x.s===200){var full=x.j.full_name;pl('✓ Created repository '+full+' on GitHub\n  https://github.com/'+full,'g');connectTo(full,tk);return}
      var msg=(x.j&&x.j.message)||'',det=(x.j&&x.j.errors&&x.j.errors[0]&&(x.j.errors[0].message||x.j.errors[0].code))||'';if(!RL.on)RL.tok='';
      if(x.s===422&&/exist/i.test(msg+' '+det)){again('You already have a repo called '+nm+'. Pick another name, or paste its link above and press Connect.');return}
      if(x.s===401){again('GitHub said 401: the token is wrong or expired. Make a new one.');return}
      if(x.s===403||x.s===404){again('GitHub said '+x.s+': this token cannot make repos. Use a classic token with the repo box ticked (a fine-grained token also needs Administration: Read and write). Or make the repo at github.com/new and paste its link.');return}
      again('GitHub said '+x.s+': '+(msg||'could not make the repo')+(det?' ('+det+')':''))
    }).catch(function(e){if(!RL.on)RL.tok='';again('Could not reach GitHub ('+((e&&e.message)||'blocked')+'). Check your internet and open the file directly in Chrome or Edge.')})}
  function connectTo(rp,tk){var prev=RL.on?{repo:RL.repo,tok:RL.tok,def:RL.def}:null;
    function fail(m){if(prev){RL.repo=prev.repo;RL.tok=prev.tok;RL.def=prev.def;setupForm(m,true)}else{RL.tok='';setupForm(m)}}
    RL.repo=rp;RL.tok=tk;if($('rfGo'))rbBusy('Connecting to github.com/'+rp+' ...');else rbody.innerHTML='<p class="empty">Connecting...</p>';
    gh('GET','/repos/'+rp).then(function(x){
      if(x.s!==200){fail('GitHub said '+x.s+': '+(x.j.message||'could not reach the repo')+'. Check the name and token.');return}
      if(x.j.permissions&&!x.j.permissions.push){fail('This token cannot write to that repo. Make a classic token with the repo box ticked.');return}
      if(RL.form)labLock(false);rbody.classList.remove('rbusy');RL.def=x.j.default_branch||'main';RL.view=RL.def;RL.on=true;RL.seen={};RL.known={};RL.map={};RL.blobs={};RL.up={};RL.login='';
      $('pg').classList.add('real');$('pgReal').textContent='Real mode: ON';
      pl('Connected to github.com/'+rp+' for real.','y');
      var inRepo=S.repo&&(S.cwd===S.repo.root||S.cwd.indexOf(S.repo.root+'/')===0);
      if(inRepo){pl('Connect this repo to it, then upload (once you have a commit):','y');pl('  git remote add origin https://github.com/'+rp+'.git\n  git push -u origin main','c')}
      else{pl('Next: press Start the story (it uses this repo), or make your own project first:','y');
        pl('  mkdir my-project\n  cd my-project\n  git init\n  echo "hello" > hello.txt\n  git add .\n  git commit -m "First commit"\n  git remote add origin https://github.com/'+rp+'.git\n  git push -u origin main','c')}
      refreshLive(true);clearInterval(RL.timer);RL.timer=setInterval(function(){refreshLive()},8000);
    }).catch(function(e){var keep=tk;var inFrame=false;try{inFrame=window.top!==window}catch(z){inFrame=true}
      setupForm('Could not reach GitHub ('+(e&&e.message||'blocked')+'). '+(inFrame?'This page is inside a preview that blocks outside connections. Download the file and open it in Chrome or Edge.':'Check your internet, turn off ad blockers, and open the file directly in Chrome or Edge instead of a preview.'));
      var t=$('rfTok');if(t)t.value=keep;RL.tok=''})
  }
  function realOff(){if(RL.form)labLock(false);rbody.classList.remove('rbusy');RL.on=false;RL.tok='';clearInterval(RL.timer);$('pg').classList.remove('real');rb.hidden=true;$('pgReal').textContent='Real GitHub mode'}
  function refreshLive(first){
    if(!RL.on||tvCur!=='lab'||!RL.repo||RL.form)return;
    var r=R(),v=(r&&r.head&&r.remote&&r.remote.br[r.head])?r.head:RL.view;
    Promise.all([gh('GET','/repos/'+RL.repo+'/commits?sha='+encodeURIComponent(v)+'&per_page=8'),gh('GET','/repos/'+RL.repo+'/contents?ref='+encodeURIComponent(v)),gh('GET','/repos/'+RL.repo+'/branches')]).then(function(a){
      var cm=a[0],ct=a[1],br=a[2],h='';
      h+='<div class="lvh"><a href="https://github.com/'+RL.repo+'" target="_blank" rel="noopener"><b>'+esc(RL.repo)+'</b></a><span class="lvb">'+esc(v)+'</span><span class="lvn">'+Math.max(br.s===200?br.j.length:1,1)+' branch'+((br.s===200&&br.j.length>1)?'es':'')+'</span><button id="rfRef" title="Refresh">&#8635;</button></div>';
      if(cm.s===200&&cm.j.length){
        h+='<div class="lvf">';
        if(ct.s===200)ct.j.forEach(function(f){h+='<div class="lvfile" data-p="'+esc(f.path)+'" data-t="'+f.type+'"><span>'+(f.type==='dir'?'&#128193;':'&#128196;')+'</span> '+esc(f.name)+'</div>'});
        h+='</div><div class="lvc">';
        cm.j.forEach(function(c){var isNew=!first&&!RL.seen[c.sha]&&Object.keys(RL.seen).length>0;RL.seen[c.sha]=1;
          h+='<a class="lvcm'+(isNew?' newc':'')+'" href="'+esc(c.html_url)+'" target="_blank" rel="noopener"><b>'+esc(c.commit.message.split('\n')[0])+'</b><small><code>'+c.sha.slice(0,7)+'</code> '+esc(c.commit.author.name)+' &middot; '+ago(c.commit.author.date)+'</small></a>'});
        h+='</div>';
      }else h+='<p class="empty">This repo has no commits on <b>'+esc(v)+'</b> yet. Make a commit and push.</p>';
      h+='<div class="btns rbtns"><button id="rfSwitch">Switch repo</button><button id="rfOff2">Switch off real mode</button><button id="rfWipe" class="redbtn">Delete everything in this repo</button></div>';
      rbody.innerHTML=h;rb.hidden=false;
      var b=$('rfRef');if(b)b.onclick=function(){refreshLive()};$('rfOff2').onclick=realOff;$('rfSwitch').onclick=function(){if(busy||pend)return;setupForm(null,true)};$('rfWipe').onclick=function(){if(busy)return;window.gitPop('err','DELETE EVERYTHING?','This deletes <b>every file and every extra branch</b> in <b>github.com/'+esc(RL.repo)+'</b> and clears the Mini laptop too. Use it to reset the repo for the next demo.',[{t:'Yes, delete everything',fn:wipeReal},{t:'Cancel'}])};
    });
  }
  rbody.addEventListener('click',function(e){var el=e.target.closest&&e.target.closest('.lvfile');if(!el||el.getAttribute('data-t')!=='file')return;
    var path=el.getAttribute('data-p'),v=(R()&&R().remote&&R().remote.br[R().head])?R().head:RL.view;
    gh('GET','/repos/'+RL.repo+'/contents/'+path.split('/').map(encodeURIComponent).join('/')+'?ref='+encodeURIComponent(v)).then(function(x){
      var t=x.s===200?decodeURIComponent(escape(atob(x.j.content.replace(/\n/g,'')))):'Could not read this file.';
      window.gitPop&&window.gitPop('warn',path+' (on GitHub, branch '+v+')','<pre class="fpre">'+esc(t)+'</pre>')})});
  function treeDiff(c){var par=c.p.length?C(c.p[0]).files:{},o=[];keys(c.files).forEach(function(f){if(par[f]!==c.files[f])o.push(['put',f,c.files[f]])});keys(par).forEach(function(f){if(!(f in c.files))o.push(['del',f])});return o}
  function seq(items,fn){return items.reduce(function(p,i){return p.then(function(){return fn(i)})},Promise.resolve())}
  function realTagPush(tl){var r=R(),repo=ghRepo(r),sha={};keys(RL.map).forEach(function(k){sha[RL.map[k]]=k});
    var miss=tl.filter(function(t){return !sha[r.tags[t].id]});if(miss.length){perr('error: GitHub does not have the commit for '+miss.join(', ')+' yet.\nhint: push its branch first (git push), then push the tag.');return}
    pend=true;busy=true;inp.disabled=true;
    seq(tl,function(t){return gh('POST','/repos/'+repo+'/git/refs',{ref:'refs/tags/'+t,sha:sha[r.tags[t].id]}).then(function(x){if(x.s>=300)throw new Error(x.s+' '+((x.j&&x.j.message)||''));r.remote.tags=r.remote.tags||{};r.remote.tags[t]=r.tags[t].id})})
    .then(function(){pl('To https://github.com/'+repo+'.git');tl.forEach(function(t){pl(' * [new tag]         '+t+' -> '+t,'g')})},function(e){perr('error: GitHub refused the tag: '+e.message)})
    .then(function(){pend=false;if(!scripting){busy=false;inp.disabled=false;inp.focus({preventScroll:true})}setPrompt();render()})}
  /* ---------- making a new repo ON GITHUB: gh repo create, or the Browser's New repository page ----------
     Normal mode: a pretend repo on the Mini laptop's GitHub. Real GitHub mode: a real repo on your account,
     and Real GitHub mode switches to it, ready to push. */
  function ghFixName(n){return String(n||'').trim().replace(/\.git$/i,'').replace(/[^A-Za-z0-9._-]+/g,'-')}
  function ghHas(full){var k='https://github.com/'+full.toLowerCase();if(S.ghMade&&S.ghMade[k])return true;
    if(k==='https://github.com/octocat/hello-world'||k==='https://github.com/roli/website')return true;
    return keys(S.repos).some(function(rt){var q=S.repos[rt];return q.remote&&ghKey(q.remote.url)===k&&keys(q.remote.br).some(function(b){return q.remote.br[b]})})}
  /* who you are on GitHub: "you" on the pretend GitHub, your real user name in Real GitHub mode */
  function ghOwner(cb){if(!RL.on){cb('you');return}if(RL.login){cb(RL.login);return}
    gh('GET','/user').then(function(x){RL.login=(x.s===200&&x.j&&x.j.login)||RL.repo.split('/')[0];cb(RL.login)},function(){cb(RL.repo.split('/')[0])})}
  /* which commits are already on GitHub is remembered per folder (RL.known / RL.map read the repo you are in),
     so switching the GitHub repo shown leaves each folder's memory alone */
  function realSwitch(full,def){RL.repo=full;RL.def=def||'main';RL.view=RL.def;RL.seen={};refreshLive(true)}
  /* o = {name, owner, desc, priv}; cb({ok,full,url}) or cb({err,kind}) where kind is name / exists / perm / net */
  function ghCreate(o,cb){var name=ghFixName(o.name);
    if(!name||name==='.'||name==='..'){cb({err:'Repository name is required.',kind:'name'});return}
    if(name.length>100){cb({err:'Name is too long (at most 100 characters).',kind:'name'});return}
    ghOwner(function(me){var owner=o.owner||me,full=owner+'/'+name;
      if(!RL.on){
        if(owner.toLowerCase()!=='you'){cb({err:"GraphQL: you can only make repos for your own account (you) on this Mini laptop",kind:'perm'});return}
        if(ghHas(full)){cb({err:'GraphQL: Name already exists on this account (createRepository)',kind:'exists',full:full});return}
        S.ghMade=S.ghMade||{};S.ghMade['https://github.com/'+full.toLowerCase()]={full:full,priv:!!o.priv,desc:o.desc||'',def:'main'};
        cb({ok:true,full:full,url:'https://github.com/'+full,name:name});return}
      var path=owner.toLowerCase()===me.toLowerCase()?'/user/repos':'/orgs/'+encodeURIComponent(owner)+'/repos';
      gh('POST',path,{name:name,description:o.desc||'',private:!!o.priv,auto_init:false}).then(function(x){
        if(x.s===201||x.s===200){var f2=(x.j&&x.j.full_name)||full;realSwitch(f2,(x.j&&x.j.default_branch)||'main');cb({ok:true,full:f2,url:'https://github.com/'+f2,name:name,real:true});return}
        var msg=(x.j&&x.j.message)||'',det=(x.j&&x.j.errors&&x.j.errors[0]&&(x.j.errors[0].message||x.j.errors[0].code))||'';
        if(x.s===422&&/exist/i.test(msg+' '+det)){cb({err:'GraphQL: Name already exists on this account (createRepository)',kind:'exists',full:full});return}
        if(x.s===401){cb({err:'HTTP 401: Bad credentials (https://api.github.com'+path+')',kind:'perm'});return}
        if(x.s===403||x.s===404){cb({err:'HTTP '+x.s+': '+(msg||'Resource not accessible by personal access token')+' (https://api.github.com'+path+')',kind:'perm'});return}
        cb({err:'HTTP '+x.s+': '+(msg||'GitHub refused')+(det?' ('+det+')':''),kind:'net'})
      }).catch(function(e){cb({err:'could not reach GitHub ('+((e&&e.message)||'network error')+')',kind:'net'})})})}
  function permHint(){pl('Your token cannot make repos. A classic token with the "repo" box ticked can. A fine-grained token also needs "Administration: Read and write". Or make the repo at github.com/new and connect it.','y')}
  /* gh: GitHub's own command-line tool (only the parts the workshop teaches) */
  function ghCmd(a){
    if(a[0]==='--version'||a[0]==='version'){pl('gh version 2.63.2 (2024-12-05)\nhttps://github.com/cli/cli/releases/tag/v2.63.2');return}
    if(!a.length||a[0]==='help'||a[0]==='--help'){pl('Work seamlessly with GitHub from the command line.\n\nUSAGE\n  gh <command> <subcommand> [flags]\n\nON THIS MINI LAPTOP\n  gh repo create <name> --public     make a new repo on GitHub\n  gh repo create <name> --public --source=. --remote=origin --push\n                                     ...and connect this folder to it and push\n  gh auth status                     who you are logged in as');return}
    if(a[0]==='auth'&&a[1]==='login'){if(tvCur==='term'&&ML.termLoginAsk){ML.termLoginAsk();return}pl('In the Practice Lab, log in with the Real GitHub mode button. In Git Bash / Terminal, type  gh auth login','y');return}
    if(a[0]==='auth'&&a[1]==='logout'){if(tvCur!=='term'){pl('In the Practice Lab, switch off Real GitHub mode with its button.','y');return}
      if(!RL.on){perr('not logged in to any hosts');return}var who=RL.login;RL.on=false;RL.tok='';RL.login='';RL.repo='';pl('\u2713 Logged out of github.com account '+who,'g');pl('Git Bash now uses the Mini laptop\'s pretend GitHub. Log in again with:  gh auth login','y');setPrompt();return}
    if(a[0]==='auth'){if(a[1]!=='status'){perr('unknown command "'+(a[1]||'')+'" for "gh auth"\nTry: gh auth status');return}
      var wait=RL.on;if(wait){pend=true;busy=true;inp.disabled=true}
      ghOwner(function(me){pl('github.com\n  ✓ Logged in to github.com account '+me+' ('+(RL.on?'your token':'keyring')+')\n  - Active account: true\n  - Git operations protocol: https'+(RL.on?'':'\n  (the Mini laptop\'s pretend GitHub: switch on Real GitHub mode to use your real account)'));if(wait)ghDone()});return}
    if(a[0]!=='repo'){perr('unknown command "'+a[0]+'" for "gh"\n\nUsage:  gh <command> <subcommand> [flags]\n\nOn this Mini laptop:  gh repo create <name> --public');return}
    if(a[1]!=='create'){perr('unknown command "'+(a[1]||'')+'" for "gh repo"\n\nOn this Mini laptop:  gh repo create <name> --public');return}
    var o={},name=null,bad=null;
    for(var i=2;i<a.length;i++){var x=a[i],m=x.match(/^(--[a-z-]+)=(.*)$/),k=m?m[1]:x,v=m?m[2]:null;
      function val(){if(v!==null)return v;i++;return a[i]}
      if(k==='--public')o.vis='public';else if(k==='--private')o.vis='private';else if(k==='--internal')o.vis='internal';
      else if(k==='--source'||k==='-s')o.src=val();else if(k==='--remote'||k==='-r')o.rem=val();
      else if(k==='--description'||k==='-d')o.desc=val();else if(k==='--push')o.push=true;else if(k==='--clone'||k==='-c')o.clone=true;
      else if(k==='--add-readme'||k==='--gitignore'||k==='-g'||k==='--license'||k==='-l'||k==='--template'||k==='-p'){bad=k;if(k!=='--add-readme')val()}
      else if(x[0]==='-'){perr('unknown flag: '+x+'\n\nUsage:  gh repo create [<name>] [flags]');return}
      else if(name===null)name=x;else{perr('accepts at most 1 arg(s), received 2');return}}
    if(name===null&&o.src){var sp=norm(o.src);name=sp===HOME?null:base(sp)}
    if(name===null){perr('error: give the new repo a name, like:  gh repo create my-project --public\n(real gh would ask you questions instead; on this Mini laptop, type the flags)');return}
    if(!o.vis){perr('`--public`, `--private`, or `--internal` required when not running interactively');return}
    if(o.vis==='internal'){perr('error: --internal is only for repos in an organization. Use --public or --private.');return}
    if(bad){perr(bad+': not on this Mini laptop. It makes empty repos, so your first git push just works.');return}
    if(o.push&&!o.src){perr('`--push` enabled but no `--source` specified');return}
    if(o.rem&&!o.src){perr('the `--remote` option can only be used with `--source`');return}
    if(o.clone&&o.src){perr('the `--source` option is not supported with `--clone`');return}
    var owner=null;if(name.indexOf('/')>0){owner=name.split('/')[0];name=name.split('/').slice(1).join('/')}
    var srcRepo=null,rem=o.rem||'origin';
    if(o.src){var sd=norm(o.src);if(!S.dirs[sd]){perr(o.src+': no such directory');return}
      srcRepo=S.repos[sd]||null;if(!srcRepo){perr('current directory is not a git repository. Run `git -C "'+o.src+'" init` to initialize it');return}
      if(rem!=='origin'){perr('error: this Mini laptop knows one remote per repo, called origin. Leave out --remote, or use --remote=origin');return}
      if(srcRepo.remote){perr('X Unable to add remote "origin"\nerror: remote origin already exists.\nTip: git remote remove origin   (then try again)');return}}
    var wait2=RL.on;if(wait2){pend=true;busy=true;inp.disabled=true;pl('Creating the repo on github.com (this one is real)...','y')}
    ghCreate({name:name,owner:owner,desc:o.desc,priv:o.vis==='private'},function(res){
      if(res.err){perr(res.err);if(res.kind==='perm')permHint();if(wait2)ghDone();return}
      pl('✓ Created repository '+res.full+' on GitHub\n  '+res.url,'g');
      if(res.real&&tvCur==='lab')pl('Real GitHub mode now shows github.com/'+res.full+'.','y');
      var git2=res.url+'.git';
      if(o.clone){if(wait2)ghDone();git(['clone',git2]);render();return}
      if(!srcRepo){if(!o.src){pl('Next, connect your folder to it: copy this line and run it (inside that folder):','y');pl('  git remote add origin '+git2,'c')}if(wait2)ghDone();return}
      srcRepo.remote={url:git2,br:{},ids:{}};pl('✓ Added remote '+git2,'g');
      if(!o.push){if(wait2)ghDone();return}
      if(wait2)ghDone();
      var keep=S.forceRepo;S.forceRepo=srcRepo;var hb=srcRepo.head;
      if(RL.on){RL.onPushed=function(){pl('✓ Pushed commits to '+git2,'g');setPrompt();render()};git(['push','-u','origin',hb]);S.forceRepo=keep;render();return}
      git(['push','-u','origin',hb]);S.forceRepo=keep;if(srcRepo.br[hb]&&srcRepo.remote.br[hb]===srcRepo.br[hb])pl('✓ Pushed commits to '+git2,'g');render()})}
  /* ---------- the Terminal app: a plain Git Bash. It asks for a GitHub token once, then works like a real terminal ---------- */
  var termPaste=false;
  /* Git Bash tabs, like a real terminal: each tab has its own output, folder and history; they share the
     Mini laptop (files, repos) and the gh login. The command line and prompt are shared and show the current tab. */
  var TT=[],tcur=0;
  function termTabs(){var c=tvCur==='term'?S.cwd:(TV.term&&TV.term.cwd)||HOME;return {cur:tcur,busy:busy||pend,list:TT.map(function(t,i){var d=i===tcur?c:t.cwd;return d===HOME?'~':d.indexOf(HOME+'/')===0?'~'+d.slice(HOME.length):d})}}
  function termTabGo(i){if(busy||pend||!TT[i])return false;if(tvCur!=='term')tvUse('term');if(i===tcur){setPrompt();return true}
    var a=TT[tcur];a.cwd=S.cwd;a.hist=S.hist;a.hi=S.hi;a.out.hidden=true;
    tcur=i;var n=TT[i];n.out.hidden=false;out=n.out;TV.term.out=n.out;S.cwd=S.dirs[n.cwd]||n.cwd===HOME?n.cwd:HOME;S.hist=n.hist;S.hi=n.hi;setPrompt();n.out.scrollTop=n.out.scrollHeight;return true}
  function termTabNew(o){if(busy||pend)return false;o.hidden=true;TT.push({out:o,cwd:HOME,hist:[],hi:0});return termTabGo(TT.length-1)}
  function termTabClose(i){if(busy||pend||TT.length<2||!TT[i])return false;
    if(i===tcur)termTabGo(i>0?i-1:1);var t=TT[i];TT.splice(i,1);if(tcur>i)tcur--;t.out.remove();setPrompt();return true}
  function termAttach(o,i,p){TV.term={out:o,inp:i,ps:p,cwd:HOME,hist:[],hi:0,rl:null};TT=[{out:o,cwd:HOME,hist:[],hi:0}];tcur=0;
    i.addEventListener('focus',function(){if(!busy&&!pend)tvUse('term')});
    i.addEventListener('keydown',function(e){
      if(tvCur!=='term'){if(busy||pend){if(e.key==='Enter')e.preventDefault();return}tvUse('term')}
      if(e.key==='Enter'){e.preventDefault();if(busy||pend)return;var v=i.value;i.value='';run(v)}
      else if(e.key==='ArrowUp'){if(S.hi>0){S.hi--;i.value=S.hist[S.hi]||'';e.preventDefault()}}
      else if(e.key==='ArrowDown'){if(S.hi<S.hist.length){S.hi++;i.value=S.hist[S.hi]||'';e.preventDefault()}}
      else if(e.key==='l'&&e.ctrlKey){(TT[tcur]?TT[tcur].out:o).innerHTML='';e.preventDefault()}});
    i.addEventListener('paste',function(e){var t=(e.clipboardData||window.clipboardData).getData('text');if(!/[\r\n]/.test(t))return;
      e.preventDefault();if(busy||pend)return;tvUse('term');var lines=(i.value+t).split(/\r?\n/).filter(function(l){return l.trim()});i.value='';
      termPaste=true;(function next(){if(pend||busy){setTimeout(next,200);return}if(!lines.length){termPaste=false;return}run(lines.shift());setTimeout(next,80)})()})}
  function termNote(t,c){var k=tvCur;if(k!=='term')tvUse('term');pl(t,c);if(k!=='term'&&!busy&&!pend)tvUse(k)}
  /* log in with a token: like gh auth login --with-token. No repo needed */
  function termLogin(tk,cb){tk=String(tk||'').trim();if(!tk){cb({err:'Paste your token first.'});return}if(busy||pend){cb({err:'Wait for the command that is running to finish.'});return}
    tvUse('term');busy=true;pend=true;inp.disabled=true;RL.tok=tk;
    function fin(){busy=false;pend=false;inp.disabled=false;setPrompt()}
    gh('GET','/user').then(function(x){if(tvCur!=='term')tvUse('term');
      if(x.s!==200||!x.j||!x.j.login){RL.tok='';fin();cb({err:x.s===401?'GitHub said 401: this token is wrong or expired. Make a new one.':'GitHub said '+x.s+': '+((x.j&&x.j.message)||'could not log in')});return}
      RL.on=true;RL.login=x.j.login;RL.repo='';RL.def='main';RL.view='main';RL.seen={};RL.blobs={};RL.up={};
      pl('✓ Logged in to github.com account '+x.j.login,'g');
      pl('Use Git like on a real computer. For example:\n  gh repo create my-project --public       (make a new repo)\n  git clone https://github.com/'+x.j.login+'/<repo>.git   (use one you already have)','y');
      fin();cb({ok:true,login:x.j.login})
    }).catch(function(e){RL.tok='';fin();cb({err:'Could not reach GitHub ('+((e&&e.message)||'blocked')+'). Check your internet, turn off ad blockers, and open the file directly in Chrome or Edge.'})})}
  function termSkip(){if(busy||pend)return;tvUse('term');RL.on=false;RL.tok='';RL.login='';RL.repo='';
    pl('Using the Mini laptop\'s pretend GitHub (nothing leaves this page). To use your real GitHub later:  gh auth login','y');setPrompt()}
  function ghDone(){pend=false;if(!scripting){busy=false;inp.disabled=false;try{inp.focus({preventScroll:true})}catch(z){}}setPrompt();render()}
  /* Real GitHub mode: push, fetch and pull go to the repo in the origin link, like real Git.
     A link to a repo that does not exist fails like real Git; a link to another repo you can use switches to it. */
  function realTarget(r){var m=asHttps((r&&r.remote&&r.remote.url)||'').match(/^https?:\/\/(?:www\.)?github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+?)(?:\.git)?\/?$/);return m?m[1]+'/'+m[2]:null}
  function realOk(r){var t=realTarget(r);if(!t)return true;return t.toLowerCase()===String(ghRepo(r)||'').toLowerCase()}
  function realRoute(r,kind,again){var t=realTarget(r),url='https://github.com/'+t+'.git';pend=true;busy=true;inp.disabled=true;
    gh('GET','/repos/'+t).then(function(x){
      if(x.s===200&&!(kind==='push'&&x.j.permissions&&x.j.permissions.push===false)){var full=x.j.full_name||t;realSwitch(full,x.j.default_branch);if(tvCur==='lab')pl('Real GitHub mode now shows github.com/'+full+': the repo your origin link points to.','y');ghDone();again();return}
      if(x.s===200){perr("remote: Permission to "+t+".git denied.\nfatal: unable to access '"+url+"/': The requested URL returned error: 403");ghDone();return}
      perr("remote: Repository not found.\nfatal: repository '"+url+"/' not found");
      pl('The link must point to a repo that really exists on GitHub.'+(RL.repo?' Your connected repo is github.com/'+RL.repo+':\n  git remote set-url origin https://github.com/'+RL.repo+'.git\nOr':'')+' Make this one first:  gh repo create '+t.split('/')[1]+' --public\n(check the spelling too: the link shows on the repo\'s page on github.com, under Code)','y');ghDone()
    }).catch(function(e){perr("fatal: unable to access '"+url+"/': "+((e&&e.message)||'network error'));ghDone()})}
  /* git push origin --delete <branch>, for real */
  function realDelBranch(db){var r=R(),repo=ghRepo(r),url='https://github.com/'+repo+'.git';pend=true;busy=true;inp.disabled=true;
    gh('DELETE','/repos/'+repo+'/git/refs/heads/'+encodeURIComponent(db)).then(function(x){
      if(x.s===204||x.s===200){delete r.remote.br[db];if(r.rbr)delete r.rbr[db];if(r.up)delete r.up[db];delete RL.known[db];pl('To '+url);pl(' - [deleted]         '+db,'g');refreshLive();return}
      if(x.s===422||x.s===404)perr("error: unable to delete '"+db+"': remote ref does not exist\nerror: failed to push some refs to '"+url+"'");
      else perr('error: GitHub refused: '+x.s+' '+((x.j&&x.j.message)||''))
    }).catch(function(e){perr("fatal: unable to access '"+url+"/': "+((e&&e.message)||'network error'))}).then(function(){ghDone()})}
  /* git push, for real. Each commit on your Mini laptop becomes ONE commit on GitHub, the way real Git does it:
     upload each changed file (a blob), make the folder listing (a tree, built on the parent's tree), make the commit
     (tree + parents + message), and only at the end move the branch to it. A merge keeps both parents.
     If anything fails half way, the branch on GitHub has not moved, so nothing is left half pushed. */
  function realPush(br,rt,lt,setU){
    var r=R(),repo=ghRepo(r),def=ghDef(r),list=reach(lt).filter(function(c){return !rt||!anc(rt)[c.id]}).reverse();
    pend=true;busy=true;inp.disabled=true;pl('Sending '+list.length+' commit'+(list.length===1?'':'s')+' to GitHub (this one is real)...','y');
    var shaOf={},treeOf={},head=null,wasEmpty=false,tip=null;S.pushFail=false;
    keys(RL.map).forEach(function(k){shaOf[RL.map[k]]=k});if(rt&&RL.known[br]&&!shaOf[rt])shaOf[rt]=RL.known[br];
    RL.up=RL.up||{};var up=RL.up[repo]=RL.up[repo]||{};
    function chk(x){if(x.s>=300){var er=new Error(x.s+' '+((x.j&&x.j.message)||'')+' [on '+x.m+' '+x.u.split('?')[0]+(x.need?'; needs: '+x.need:'')+']');er.code=x.s;er.msg=(x.j&&x.j.message)||'';throw er}return x}
    function rejected(){var er=new Error('rejected');er.rejected=true;throw er}
    /* 1. where is the branch on GitHub now? Someone else may have pushed since you last fetched */
    var ensure=gh('GET','/repos/'+repo+'/git/ref/heads/'+encodeURIComponent(br)).then(function(x){
      if(x.s===200){if(x.j.object.sha!==RL.known[br])rejected();head=x.j.object.sha;return}
      if(x.s===409){wasEmpty=true;
        /* a brand-new repo with no commits cannot take files yet: wake it up with a tiny placeholder commit;
           your own first commit then replaces it, so GitHub's history starts with yours */
        return gh('PUT','/repos/'+repo+'/contents/.mini-laptop-start',{message:'Start the repo (replaced by your first commit)',content:b64('start\n'),branch:def}).then(chk)}});
    /* the tree of a commit that is already on GitHub (asked once, then remembered) */
    function treeFor(sha){if(treeOf[sha])return Promise.resolve(treeOf[sha]);
      return gh('GET','/repos/'+repo+'/git/commits/'+sha).then(chk).then(function(x){treeOf[sha]=x.j.tree.sha;return treeOf[sha]})}
    /* upload one file's contents, once per different contents */
    function blobFor(t){if(up[t])return Promise.resolve(up[t]);
      return (isBin(t)?binLoad(t):Promise.resolve(b64(t))).then(function(c){return gh('POST','/repos/'+repo+'/git/blobs',{content:c,encoding:'base64'})}).then(chk).then(function(x){up[t]=x.j.sha;return x.j.sha})}
    function oneCommit(c){if(shaOf[c.id])return Promise.resolve();
      var parents=c.p.map(function(id){return shaOf[id]});
      if(parents.some(function(s){return !s})){var er=new Error('GitHub does not have the commit before '+c.id+' yet. Type git push again.');return Promise.reject(er)}
      /* changes compared with the first parent; a first commit lists every file */
      var base=parents.length?treeFor(parents[0]):Promise.resolve(null);
      return base.then(function(bt){var ch=bt?treeDiff(c):keys(c.files).sort().map(function(f){return ['put',f,c.files[f]]}),entries=[];
        return seq(ch,function(x){if(x[0]==='del'){entries.push({path:x[1],mode:'100644',type:'blob',sha:null});return}
            return blobFor(x[2]).then(function(s){entries.push({path:x[1],mode:'100644',type:'blob',sha:s})})})
          .then(function(){if(bt&&!entries.length)return bt; /* nothing changed (like some merges): same tree as the parent */
            var body={tree:entries};if(bt)body.base_tree=bt;
            return gh('POST','/repos/'+repo+'/git/trees',body).then(chk).then(function(x){return x.j.sha})})
          .then(function(ts){return gh('POST','/repos/'+repo+'/git/commits',(function(){var o={message:c.msg+'\n',tree:ts,parents:parents};if(c.ts){var iso=new Date(c.ts*1000).toISOString().replace(/\.\d{3}Z$/,'')+'Z',tz=c.tz||'+0000',loc=new Date((c.ts+(tz[0]==='-'?-1:1)*(+tz.slice(1,3)*3600+ +tz.slice(3,5)*60))*1000).toISOString().replace(/\.\d{3}Z$/,'')+tz.slice(0,3)+':'+tz.slice(3),a={name:c.who,email:c.email||(S.cfg.email||'you@example.com'),date:loc};o.author=a;o.committer=a}return o})()).then(chk).then(function(x){
            shaOf[c.id]=x.j.sha;treeOf[x.j.sha]=(x.j.tree&&x.j.tree.sha)||ts;RL.map[x.j.sha]=c.id})})})}
    ensure.then(function(){return seq(list,oneCommit)})
    /* 2. move the branch to the newest commit, in one step. Without force, GitHub itself refuses if it moved meanwhile */
    .then(function(){tip=shaOf[lt];if(!tip)throw new Error('the newest commit did not reach GitHub');
      var path='/repos/'+repo+'/git/refs';
      if(wasEmpty){
        if(br===def)return gh('PATCH',path+'/heads/'+encodeURIComponent(br),{sha:tip,force:true}).then(chk);
        /* the first branch pushed to an empty repo: the default branch shows it too, so the placeholder is gone everywhere */
        return gh('POST',path,{ref:'refs/heads/'+br,sha:tip}).then(chk).then(function(){return gh('PATCH',path+'/heads/'+encodeURIComponent(def),{sha:tip,force:true}).then(chk)})}
      if(head)return gh('PATCH',path+'/heads/'+encodeURIComponent(br),{sha:tip,force:false}).then(function(x){if(x.s===422)rejected();return chk(x)});
      return gh('POST',path,{ref:'refs/heads/'+br,sha:tip}).then(function(x){if(x.s===422&&/exist/i.test((x.j&&x.j.message)||''))rejected();return chk(x)})})
    .then(function(){RL.known[br]=tip;RL.map[tip]=lt;if(wasEmpty&&br!==def)RL.known[def]=tip;
      pl('To https://github.com/'+repo+'.git');pl(rt?' '+rt+'..'+lt+'  '+br+' -> '+br:' * [new branch]      '+br+' -> '+br,'g');
      if(setU){pl("branch '"+br+"' set up to track 'origin/"+br+"'.");r.up=r.up||{};r.up[br]=1}
      r.remote.br[br]=lt;r.rbr[br]=lt;S.pushed=true;
      if(!r.ghRepo&&(!r.remote.url||ghKey(r.remote.url).indexOf(RL.repo.toLowerCase())<0))r.remote.url='https://github.com/'+repo+'.git';
      if(tvCur==='lab')window.gitPop&&window.gitPop('warn','PUSHED FOR REAL','Look at the GitHub panel. Your commit is now on github.com/'+esc(repo)+'.');
      refreshLive();if(RL.onPushed){var after=RL.onPushed;RL.onPushed=null;after()}
    }).catch(function(e){RL.onPushed=null;
      if(e&&e.rejected){pushRejected('https://github.com/'+repo+'.git',br,false);return}
      S.pushFail=true;
      if(r.ghRepo&&e&&(e.code===403||e.code===404)){perr('remote: Permission to '+repo+'.git denied.\nfatal: unable to access \'https://github.com/'+repo+'.git/\': The requested URL returned error: 403');pl('You cloned someone else\'s repo: you can change it on your laptop, but only its owners can push. On GitHub you would fork it first.','y');return}
      perr('error: GitHub refused: '+e.message);
      var auth=e&&(e.code===401||e.code===403||e.code===404);
      /* nothing moved on GitHub: the branch only moves at the very end, so typing git push again simply carries on */
      window.gitPop&&window.gitPop('err','ERROR: PUSH FAILED',esc(e.message)+'<br>'+(auth?'Check that it is a classic token with the repo box ticked.':'Type <code>git push</code> again to continue.'));
    }).then(function(){pend=false;if(!scripting){busy=false;inp.disabled=false;inp.focus({preventScroll:true})}setPrompt();render()});
  }
  $('pgReal').onclick=function(){if(busy||pend)return;tvUse('lab');if(RL.on){realOff();return}$('pg').classList.add('real');rb.hidden=false;setupForm()};
  window.ML={isBin:isBin,isPic:isPic,binReg:binReg,binLazy:binLazy,termAuth:termAuth,termTabs:termTabs,termTabGo:termTabGo,termTabNew:termTabNew,termTabClose:termTabClose,binUrl:binUrl,binSize:binSize,binInfo:binInfo,repoOf:function(p){return repoOf(p)},S:function(){return S},HOME:HOME,render:render,pr:pr,esc:esc,base:base,dirname:dirname,under:under,okName:okName,exists:exists,uniq:uniq,
    fsNew:fsNew,fsRename:fsRename,fsCopy:fsCopy,fsMove:fsMove,binPut:binPut,binRestore:binRestore,binEmpty:binEmpty,gitMark:gitMark,ghCreate:ghCreate,ghOwner:ghOwner,ghFixName:ghFixName,realOn:function(){return RL.on},termAttach:termAttach,termLogin:termLogin,termSkip:termSkip,termInfo:function(){var r=tvCur==='term'?RL:(TV.term&&TV.term.rl)||{};return {on:!!r.on,login:r.login||''}},run:function(c){run(c)},
    ctxMenu:ctxMenu,ctxClose:ctxClose,longPress:longPress,ficon:ficon,openInVS:vsOpenPath,showVS:vsShowWin};
  reset();
})();
