(function(){
  function $(id){return document.getElementById(id)}
  /* ---------- pop-up system ---------- */
  var ov=$('ov'),ovBox=ov.querySelector('.popup'),lastFocus=null;
  function closePop(){ov.hidden=true;if(lastFocus&&lastFocus.focus)lastFocus.focus()}
  function pop(kind,title,text,btns){
    lastFocus=document.activeElement;
    ovBox.className='dlg popup'+(kind==='err'?' err':'');
    $('ovT').textContent=title;$('ovP').innerHTML=text;
    var bb=$('ovB');bb.innerHTML='';
    (btns||[{t:'OK'}]).forEach(function(b){
      var x=document.createElement('button');x.textContent=b.t;
      x.onclick=function(){closePop();if(b.fn)b.fn()};bb.appendChild(x);
    });
    ov.hidden=false;bb.firstChild.focus();
  }
  window.gitPop=pop;
  $('ovX').onclick=closePop;
  ov.addEventListener('click',function(e){if(e.target===ov)closePop()});
  addEventListener('keydown',function(e){if(e.key==='Escape'&&!ov.hidden)closePop()});

  /* ---------- 1.1 snapshots ---------- */
  var snaps=[
    {id:'3f8a1c2',msg:'add intro',files:[['intro.txt']],note:'Your first save point. Just the intro.'},
    {id:'9bd04e7',msg:'add results',files:[['intro.txt'],['results.txt']],note:'Results added and working.'},
    {id:'c71e5a0',msg:'oops, broke results',files:[['intro.txt'],['results.txt','bad']],note:'Something went wrong in results.txt. This is the newest save, but you do not have to stay here.'}
  ];
  var box=$('snaps'),panel=$('snapPanel'),sl=$('snapSlider');
  function show(i,quiet){
    var s=snaps[i];sl.value=i;
    Array.prototype.forEach.call(box.querySelectorAll('button'),function(b,j){b.className=j===i?'on':''});
    var h='<p style="margin:0 0 6px"><b>Folder at save point '+s.id+'</b></p>';
    s.files.forEach(function(f){h+='<span class="file '+(f[1]||'')+'">'+f[0]+(f[1]?' (broken)':'')+'</span>'});
    h+='<p style="margin:8px 0 4px">'+s.note+'</p><p style="margin:0;font-size:13px;color:var(--ink2)">To look at it: <code>git checkout '+s.id+'</code></p>';
    panel.innerHTML=h;
    if(i===2&&!quiet)pop('warn','WARNING','The last save broke <b>results.txt</b>.<br>Do you want to go back to the working save?',[{t:'Yes, go back',fn:function(){show(1,true)}},{t:'No, stay'}]);
  }
  snaps.forEach(function(s,i){
    var d=document.createElement('div');d.className='snap';
    var b=document.createElement('button');b.innerHTML=s.msg+'<small>'+s.id+'</small>';
    b.onclick=function(){show(i)};d.appendChild(b);box.appendChild(d);
  });
  sl.oninput=function(){show(+sl.value)};
  show(1,true);

  /* ---------- 1.2 save-as error ---------- */
  var sb=$('saveBtn');
  if(sb)sb.onclick=function(){pop('err','ERROR','<b>report_FINAL_really.docx</b> already exists.<br>Which "final" do you mean?',[{t:'Replace it',fn:function(){$('saveNote').textContent='You replaced it. The old version is gone for good. With Git it would still be in the history.'}},{t:'Rename again',fn:function(){$('saveNote').textContent='Now it is report_FINAL_really2.docx. This is the mess Git saves you from.'}}])};

  /* ---------- 1.4 centralized vs distributed (interactive) ---------- */
  (function(){
    var host=$('vcs');if(!host)return;
    var down=false,names=['Nishita','Abhinav','Aryan'],srv=0,own=[0,0,0],xs=[13,118,223];
    function lap(k,idx,sub,dim,saves){var x=xs[idx];
      return '<g class="vlap'+(dim?' dim':'')+'" data-k="'+k+'" data-i="'+idx+'" tabindex="0" role="button" aria-label="'+names[idx]+' saves a change"><rect x="'+x+'" y="150" width="86" height="62" rx="8" fill="'+(dim?'#d9dce6':'#fff')+'" stroke="#16327a" stroke-width="3"/><rect x="'+(x+8)+'" y="158" width="70" height="26" rx="3" fill="'+(dim?'#eceef4':'#e8f0ff')+'" stroke="#16327a" stroke-width="2"/><text x="'+(x+43)+'" y="176" text-anchor="middle" font-size="12" font-weight="800" fill="#16327a">'+names[idx]+'</text><text x="'+(x+43)+'" y="198" text-anchor="middle" font-size="10.5" fill="#4a5a90">'+sub+'</text>'+(saves?'<text x="'+(x+43)+'" y="208" text-anchor="middle" font-size="9.5" fill="#2f9a5a" font-weight="800">'+saves+'</text>':'')+'</g>'}
    function draw(){
      var c='<svg viewBox="0 0 320 226" role="img" aria-label="Centralized system">';
      [55,161,266].forEach(function(x){c+='<line x1="160" y1="76" x2="'+x+'" y2="150" stroke="'+(down?'#e8336d':'#1d4ba6')+'" stroke-width="4" '+(down?'stroke-dasharray="6 6"':'')+'/>'});
      c+='<g><rect x="105" y="10" width="110" height="66" rx="8" fill="'+(down?'#ff9aa8':'#cfe0ff')+'" stroke="#16327a" stroke-width="3"/><rect x="117" y="20" width="86" height="12" rx="2" fill="#fff" stroke="#16327a" stroke-width="2"/><rect x="117" y="38" width="86" height="12" rx="2" fill="#fff" stroke="#16327a" stroke-width="2"/><text x="160" y="66" text-anchor="middle" font-size="11" font-weight="800" fill="#16327a">'+(down?'SERVER DOWN':'SERVER: '+srv+' saves')+'</text></g>';
      if(down)c+='<text x="160" y="108" text-anchor="middle" font-size="28" fill="#e8336d" font-weight="900">&#10005;</text>';
      for(var q=0;q<3;q++)c+=lap('c',q,down?'stuck':'latest files only',down);
      host.querySelector('#vcsC').innerHTML=c+'</svg>';
      var d='<svg viewBox="0 0 320 226" role="img" aria-label="Distributed system">';
      [55,161,266].forEach(function(x){d+='<line x1="160" y1="70" x2="'+x+'" y2="150" stroke="#9aa9d6" stroke-width="3" stroke-dasharray="5 6"/>'});
      d+='<g opacity="'+(down?.45:1)+'"><path d="M118 62h84a18 18 0 0 0 0-36 24 24 0 0 0-44-6 20 20 0 0 0-40 12 15 15 0 0 0 0 30z" fill="'+(down?'#ffe3a0':'#eaf1ff')+'" stroke="#16327a" stroke-width="3" stroke-dasharray="6 4"/><text x="160" y="46" text-anchor="middle" font-size="10.5" font-weight="800" fill="#16327a">'+(down?'GitHub offline':'GitHub (optional)')+'</text></g>';
      for(var r=0;r<3;r++)d+=lap('d',r,'full history',false,(3+own[r])+' saves here');
      host.querySelector('#vcsD').innerHTML=d+'</svg>';
      $('vcsMsg').innerHTML=down?'<b>Centralized:</b> nobody can save or see history. <b>Distributed:</b> '+names[0]+', '+names[1]+' and '+names[2]+' each still hold the whole history. Click their laptops, saving still works.':'Click any laptop to <b>save a change</b>, then press <b>Crash the server</b>.';
      Array.prototype.forEach.call(host.querySelectorAll('.vlap'),function(g){
        function act(){var k=g.getAttribute('data-k'),i=+g.getAttribute('data-i');
          if(k==='c'){if(down){pop('err','ERROR','Cannot reach the server.<br><b>'+names[i]+'</b> cannot save, and cannot see old versions.<br>The only full history was on that server.');return}srv++;draw();var s=host.querySelector('#vcsC .vlap[data-i="'+i+'"] rect');}
          else{own[i]++;draw()}}
        g.onclick=act;g.onkeydown=function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();act()}}});
    }
    $('crashBtn').onclick=function(){if(down)return;pop('err','ERROR','Cannot connect to the server.<br>Connection timed out.',[{t:'OK',fn:function(){down=true;draw()}}])};
    $('fixBtn').onclick=function(){down=false;draw()};
    draw();
  })();

  /* ---------- OS tab groups ---------- */
  function tabGroup(btnId,prefix){
    var bs=document.querySelectorAll('#'+btnId+' button');
    function set(k){
      ['win','mac','lin'].forEach(function(o){var e=$(prefix+o);if(e)e.style.display=o===k?'':'none'});
      Array.prototype.forEach.call(bs,function(b){b.className=b.getAttribute('data-os')===k?'on':''});
    }
    Array.prototype.forEach.call(bs,function(b){b.onclick=function(){set(b.getAttribute('data-os'))}});
    set('win');
  }
  tabGroup('termTabs','term-');tabGroup('osTabs','os-');

  /* ---------- wizards ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('.wiz'),function(w){
    var st=w.querySelectorAll('.ws'),i=0,pv=w.querySelector('.wprev'),nx=w.querySelector('.wnext'),ct=w.querySelector('.wcount'),bar=w.querySelector('.wbar i');
    function go(n){
      i=Math.max(0,Math.min(st.length-1,n));
      Array.prototype.forEach.call(st,function(s,k){s.className='ws'+(k===i?' on':'')});
      ct.textContent='STEP '+(i+1)+' OF '+st.length;bar.style.width=Math.round((i+1)*100/st.length)+'%';
      pv.disabled=i===0;nx.disabled=i===st.length-1;nx.textContent=i===st.length-2?'Last step >':(i===st.length-1?'Done!':'Next >');
    }
    function keep(){requestAnimationFrame(function(){var r=w.getBoundingClientRect();var sc=document.getElementById('wsBody'),tp=sc?sc.getBoundingClientRect().top:0;if(r.top<tp)w.scrollIntoView({behavior:'smooth',block:'start'})})}
    pv.onclick=function(){go(i-1);keep()};
    nx.onclick=function(){go(i+1);keep()};
    go(0);
  });

  /* ---------- setup checklist ---------- */
  var setItems=['I opened the terminal (Git Bash on Windows)','I installed Git','git --version shows a version number','I made my GitHub account','I set my name and email with git config'];
  var sL=$('setList');
  function drawSet(){var n=sL.querySelectorAll('input:checked').length;$('setBar').style.width=Math.round(n*100/setItems.length)+'%';$('setMsg').textContent=n+' of '+setItems.length+(n===setItems.length?'. You are ready for the workshop ★':'. Tick each box when it is done.')}
  setItems.forEach(function(t){var l=document.createElement('label');l.className='chk';l.innerHTML='<input type="checkbox"><span>'+t+'</span>';l.querySelector('input').onchange=function(){l.className='chk'+(this.checked?' done':'');drawSet()};sL.appendChild(l)});
  drawSet();






  Array.prototype.forEach.call(document.querySelectorAll('.flip'),function(f){
    f.onclick=function(){f.classList.toggle('on')};
    f.onkeydown=function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();f.classList.toggle('on')}};
  });

  var pr=document.getElementById('prSlider');
  function drawPr(){
    var n=+pr.value,eff=Math.min(100,Math.round(n*100/40)),cf=Math.min(100,Math.round(n*100/45));
    document.getElementById('prCount').textContent=n;
    var e=document.getElementById('prEffort'),c=document.getElementById('prConf');
    e.style.width=eff+'%';c.style.width=cf+'%';
    e.style.background=eff<35?'#2f7a52':eff<70?'#d9a516':'#a8456f';
    c.style.background=cf<35?'#2f7a52':cf<70?'#d9a516':'#a8456f';
    var m=n<=5?'Quick to review. Likely merged in minutes.':n<=15?'Fine. A reviewer can still hold it all in their head.':n<=30?'Getting heavy. Reviewers start skimming and bugs slip through.':'Nobody will read all of this. Split it into smaller pull requests.';
    document.getElementById('prMsg').textContent=m;
  }
  pr.oninput=drawPr;drawPr();

  var items=['A README that explains the project','A .gitignore file','Small commits with clear messages','Work happens on branches, not main','Old merged branches are deleted','Folders are organised (src, docs, tests)'];
  var hl=document.getElementById('healthList');
  function drawHealth(){
    var n=hl.querySelectorAll('input:checked').length;
    document.getElementById('healthMsg').textContent=n+' of '+items.length+(n===items.length?'. Lovely, that is a tidy repo.':n>=4?'. Almost there.':'. Room to improve.');
  }
  items.forEach(function(t){
    var l=document.createElement('label');l.className='chk';
    l.innerHTML='<input type="checkbox"><span>'+t+'</span>';
    l.querySelector('input').onchange=function(){l.className='chk'+(this.checked?' done':'');drawHealth()};
    hl.appendChild(l);
  });
  drawHealth();

  var tabT={
    code:'<b>Code</b>: your files and folders, the branch picker and the commit history. The README shows underneath. The green Code button gives you the clone link.',
    issues:'<b>Issues</b>: a to-do and bug list for the project. Each issue has a title, a description, labels and someone assigned to it.',
    prs:'<b>Pull requests</b>: every proposed change waiting for review, plus the ones already merged. This is where teammates comment and approve.',
    actions:'<b>Actions</b>: automation that runs when something happens, such as running tests on every push. You do not need it for this workshop.',
    settings:'<b>Settings</b>: rename the repo, switch it between public and private, add collaborators, protect the main branch, or delete the repo. Only owners see this tab.'};
  function setTab(k){document.getElementById('tabPanel').innerHTML='<p style="margin:0">'+tabT[k]+'</p>';document.querySelectorAll('#tabBtns button').forEach(function(b){b.className=b.getAttribute('data-t')===k?'on':''})}
  document.querySelectorAll('#tabBtns button').forEach(function(b){b.onclick=function(){setTab(b.getAttribute('data-t'))}});setTab('code');

  var repoIn=$('repoIn'),swapOut=$('swapOut');
  function drawSwap(){
    var m=/github\.com\/([\w.-]+)\/([\w.-]+)/i.exec(repoIn.value);
    if(!m){swapOut.innerHTML='<div class="note y" style="margin-top:10px">Paste a link like https://github.com/user/repo</div>';return}
    var o=m[1],r=m[2].replace(/\.git$/,'');
    var rows=[['GitReverse','gitreverse.com'],['GitIngest','gitingest.com'],['GitDiagram','gitdiagram.com'],['DeepWiki','deepwiki.com'],['github.dev','github.dev'],['github1s','github1s.com']];
    swapOut.innerHTML=rows.map(function(x){var u='https://'+x[1]+'/'+o+'/'+r;return '<div class="res"><b>'+x[0]+'</b><code>'+u+'</code><a class="btn" href="'+u+'" target="_blank" rel="noopener noreferrer">Open</a></div>'}).join('');
  }
  repoIn.oninput=drawSwap;
  document.querySelectorAll('[data-ex]').forEach(function(b){b.onclick=function(){repoIn.value='https://github.com/'+b.getAttribute('data-ex');drawSwap()}});
  drawSwap();

  var outs=['Understand Git and GitHub','Set up and configure Git','Create and manage repositories','Use the basic Git commands','Work with branches and pull requests','Resolve merge conflicts','Collaborate with teammates using GitHub'];
  var ol=document.getElementById('outList');
  function drawOut(){var n=ol.querySelectorAll('input:checked').length;document.getElementById('outBar').style.width=Math.round(n*100/7)+'%';document.getElementById('outMsg').textContent=n+' of 7'+(n===7?'. Workshop complete ★':'. Tick each one when you feel ready.')}
  outs.forEach(function(s,i){var l=document.createElement('label');l.className='chk';l.innerHTML='<input type="checkbox"><span><b style="font-weight:700">'+(i+1)+'.</b> '+s+'</span>';l.querySelector('input').onchange=function(){l.className='chk'+(this.checked?' done':'');drawOut()};ol.appendChild(l)});
  drawOut();

  var qs=[
    {q:'What is Git?',o:['A website','A program that saves the history of your project','A type of computer'],a:1,e:'Git is a program on your computer. GitHub is the website.'},
    {q:'Which command uploads your commits to GitHub?',o:['git pull','git clone','git push'],a:2,e:'Push = upload. Pull = download the latest.'},
    {q:'You want to try a risky idea without touching main. What do you do?',o:['Copy the folder and rename it','Create a branch','Delete the repo and start over'],a:1,e:'A branch is a safe side road, and merging it back is one command.'},
    {q:'Which file should NOT be committed to a public repo?',o:['README.md','.env with passwords','index.html'],a:1,e:'Secrets belong in .gitignore. Once committed, they stay in the history.'}
  ];
  var qi=0,score=0,answered=false;
  function drawQ(){
    var q=qs[qi];answered=false;
    $('qQ').textContent=(qi+1)+'. '+q.q;
    var bx=$('qOpts');bx.innerHTML='';
    q.o.forEach(function(t,i){
      var b=document.createElement('button');b.className='opt';b.textContent=t;
      b.onclick=function(){
        if(answered)return;answered=true;
        bx.querySelectorAll('button')[q.a].className='opt right';
        if(i===q.a){score++;$('qFb').textContent='Correct. '+q.e}
        else{b.className='opt wrong';$('qFb').textContent='Not quite. '+q.e}
        $('qScore').textContent='Score: '+score+' / '+qs.length;
        var nx=$('qNext');nx.disabled=false;nx.textContent=qi===qs.length-1?'Play again':'Next question';
      };
      bx.appendChild(b);
    });
    $('qFb').textContent='';$('qNext').disabled=true;
  }
  $('qNext').onclick=function(){
    if(qi===qs.length-1){qi=0;score=0;$('qScore').textContent=''}else qi++;
    drawQ();
  };
  drawQ();

  /* retro decorations on every window */
  var DEC=[['sp-cursor c1','sp-cursor c2','sp-sparkle s1'],['sp-pad g1','sp-heartb h1'],['sp-folder f1','sp-heart h2'],['sp-rock r1','sp-flower fl1','sp-sparkle s2']];
  document.querySelectorAll('.card:not(.hero)').forEach(function(c,i){
    var d=document.createElement('div');d.className='decor';d.setAttribute('aria-hidden','true');
    DEC[i%4].forEach(function(k){var e=document.createElement('i');e.className='sp '+k;d.appendChild(e)});
    c.appendChild(d);
  });
  (function(){var bg=document.createElement('div');bg.className='bgdeco';var H=document.documentElement.scrollHeight;bg.style.height=H+'px';
    var K=['sp-star','sp-flower','sp-heart','sp-flower2','sp-heartb','sp-sparkle'],n=Math.round(H/150);
    for(var i=0;i<n;i++){var e=document.createElement('i');e.className='sp '+K[i%K.length]+(i%2?' bob':' bob2');
      var side=i%3,x=side===0?Math.random()*7:side===1?93+Math.random()*6:Math.random()*100;
      e.style.left=x+'%';e.style.top=(i*150+Math.random()*120)+'px';e.style.height=(18+Math.random()*22)+'px';bg.appendChild(e)}
    document.body.insertBefore(bg,document.body.firstChild)})();
  document.querySelectorAll('.wd [data-pop]').forEach(function(b){b.onclick=function(){var p=b.getAttribute('data-pop').split('|');pop(p[0],p[1],p[2])}});
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.06});
    document.querySelectorAll('.card:not(.hero)').forEach(function(c){c.classList.add('rv');io.observe(c)})}
  var lw=$('loadFill'),ll=$('loadLbl');
  function prog(){var sc=document.getElementById('wsBody'),h=sc?sc.scrollHeight-sc.clientHeight:document.documentElement.scrollHeight-innerHeight,y=sc?sc.scrollTop:scrollY;var p=h>0?Math.min(100,Math.round(y*100/h)):100;lw.style.width=p+'%';ll.textContent=p>=100?'LOADED! \u2605':'LOADING... '+p+'%'}
  document.addEventListener('scroll',prog,{passive:true,capture:true});prog();
  var hy=$('heroYes'),hn=$('heroNo');
  if(hy)hy.onclick=function(){pop('warn','WARNING','Going back is exactly what Git is for.<br>Press START to learn how.',[{t:'OK',fn:function(){location.hash='p1'}}])};
  if(hn)hn.onclick=function(){location.hash='p1'};
  var hf=$('heroFolder');
  if(hf)hf.onclick=function(){
    pop('warn','my-first-repo (folder)','Inside this folder you can see:<br><b>README.md</b> &nbsp; <b>index.html</b> &nbsp; <b>style.css</b><br><br>Git also adds a <b>hidden</b> folder to remember every save.',[{t:'Show the hidden one',fn:function(){pop('warn','.git (hidden folder)','This is the <b>memory</b> of your project. Every save point (commit) lives in here.<br><br>Delete it and Git forgets everything. So never touch it!',[{t:'Got it'},{t:'Start learning',fn:function(){location.hash='p1'}}])}},{t:'Close'}]);
  };
  var sb2=$('startBtn'),sm=$('startMenu');
  sb2.onclick=function(e){e.stopPropagation();sm.hidden=!sm.hidden};
  document.addEventListener('click',function(e){if(!sm.hidden&&!sm.contains(e.target))sm.hidden=true});
  (function(){var L=$('smList'),R=$('smRes'),Q=$('smQ'),all=[],h='';
    function tx(s){return s.replace(/^\s*\d+\.\s*/,'')}
    document.querySelectorAll('section.phase').forEach(function(s){var n=s.querySelector('.pn'),t=s.querySelector('h2');if(!t)return;
      var subs=[];s.querySelectorAll('.idx a').forEach(function(a){subs.push([a.getAttribute('href'),tx(a.textContent)])});
      if(!subs.length)s.querySelectorAll('.card[id]').forEach(function(c){var m=c.querySelector('.topic h3');if(m)subs.push(['#'+c.id,tx(m.textContent)])});
      subs.forEach(function(x){all.push({h:x[0],t:x[1],p:t.textContent})});
      h+='<div class="smi"><a class="smp" href="#'+s.id+'"><b>'+(n?n.textContent:'')+'</b>'+esc2(t.textContent)+'<em>&#9656;</em></a><div class="smsub">'+subs.map(function(x){return '<a href="'+x[0]+'">'+esc2(x[1])+'</a>'}).join('')+'</div></div>'});
    h+='<div class="smi"><a class="smp" href="#t1-5"><b>&#9881;</b>Setup and installation</a></div>';
    L.innerHTML=h;
    function esc2(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;')}
    Q.addEventListener('input',function(){var v=Q.value.trim().toLowerCase();
      if(!v){R.hidden=true;L.hidden=false;return}
      var m=all.filter(function(x){return (x.t+' '+x.p).toLowerCase().indexOf(v)>-1});
      L.hidden=true;R.hidden=false;R.innerHTML=m.length?m.map(function(x){return '<a href="'+x.h+'">'+esc2(x.t)+'<small>'+esc2(x.p)+'</small></a>'}).join(''):'<p>Nothing found. Try "branch", "push" or "merge".</p>'});
    sb2.addEventListener('click',function(){Q.value='';R.hidden=true;L.hidden=false;setTimeout(function(){if(!sm.hidden)Q.focus()},30)});
    sm.addEventListener('click',function(e){var a=e.target.closest('a');if(!a)return;
      if(a.id==='smTop'){e.preventDefault();(document.getElementById('wsBody')||window).scrollTo({top:0,behavior:'smooth'})}
      if(a.classList.contains('smp')&&a.nextElementSibling&&a.nextElementSibling.children.length&&window.matchMedia('(hover:none)').matches&&!a.parentNode.classList.contains('open')){e.preventDefault();Array.prototype.forEach.call(L.children,function(c){c.classList.remove('open')});a.parentNode.classList.add('open');return}
      sm.hidden=true})})();
  var clk=$('clock');function tick(){var d=new Date(),h=d.getHours(),m=d.getMinutes();clk.textContent=(h%12||12)+':'+(m<10?'0':'')+m+' '+(h<12?'AM':'PM')}
  tick();setInterval(tick,20000);
  var cols=['#7fb3ea','#ffb74d','#ff8fba','#8fe39a','#c9a6f0','#ffe36e'];
  document.querySelectorAll('.starrow').forEach(function(r){for(var i=0;i<22;i++){r.insertAdjacentHTML('beforeend','<svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="12,2 15,9 22,9.5 16.5,14.5 18.5,22 12,17.8 5.5,22 7.5,14.5 2,9.5 9,9" fill="'+cols[i%6]+'" stroke="#16327a" stroke-width="1.8" stroke-linejoin="round"/></svg>')}});

  /* ---------- 2.1 make a folder remember ---------- */
  (function(){
    if(!$('rpFiles'))return;
    var R,goals=[
      ['Edit a file. What happens to the old version?',function(){return R.edits>0}],
      ['Turn the folder into a repo with git init.',function(){return R.git}],
      ['Edit a file, then save a snapshot.',function(){return R.snaps.length>0}],
      ['Push your snapshots to GitHub.',function(){return R.cloud.length>0}],
      ['Now delete .git. What survives?',function(){return R.deleted}]
    ];
    var drafts=['first draft','added a menu','fixed the colours','new photo','typo fix','bigger title'];
    function reset(){R={git:false,edits:0,dirty:{},snaps:[],cloud:[],deleted:false,linked:false,g:0,n:0,ver:{'index.html':1,'style.css':1}};cmd('');say('This is a normal folder with two files. Try the buttons. The goal at the top tells you what to try next.');draw()}
    function cmd(t){$('rpCmd').textContent='$ '+t}
    function say(t){$('rpSay').innerHTML=t}
    function id(){R.n++;return ('0000000'+((Math.imul(R.n+7,2654435761)>>>0).toString(16))).slice(-7)}
    function draw(){
      var g=R.g;while(g<goals.length&&goals[g][1]())g++;R.g=g;
      $('rpGoal').innerHTML=g<goals.length?'<b>GOAL '+(g+1)+' OF '+goals.length+'</b>'+goals[g][0]:'<b>ALL DONE</b>You know what a repository is. Press Start over to play again.';
      $('rpFiles').innerHTML=Object.keys(R.ver).map(function(f){var ch=R.dirty[f];return '<div class="rp-file'+(ch?' ch':'')+'"><span>'+f+'</span><i>'+(ch?'changed, not saved':'version '+R.ver[f])+'</i></div>'}).join('');
      var gb=$('rpGit');gb.className='rp-git'+(R.git?' on':'');
      gb.innerHTML=R.git?'<span class="t">.git/</span> hidden memory: '+(R.snaps.length?R.snaps.length+' snapshot'+(R.snaps.length>1?'s':''):'no snapshots yet')+'<div class="rp-snaps">'+R.snaps.map(function(s){return '<span class="rp-snap"><b>'+s[0]+'</b>'+s[1]+'</span>'}).join('')+'</div>':'no <code>.git</code> folder, so nothing is remembered';
      $('rpLtag').textContent=R.git?'local repo':'just a folder';
      $('rpRemote').className='rp-box rp-cloud'+(R.cloud.length?' on':'');
      $('rpRtag').textContent=R.cloud.length?'remote repo':'empty';
      $('rpCloud').innerHTML=R.cloud.length?'<div class="rp-dir">you/my-project</div><div class="rp-snaps">'+R.cloud.map(function(s){return '<span class="rp-snap"><b>'+s[0]+'</b>'+s[1]+'</span>'}).join('')+'</div>':'<div class="rp-empty">Nothing online yet.</div>';
    }
    function flash(el){el.classList.remove('flash');void el.offsetWidth;el.classList.add('flash')}
    $('rpInit').onclick=function(){
      cmd('git init');
      if(R.git){say('It is already a repo. You only run <code>git init</code> once per project.');return}
      R.git=true;R.deleted=false;
      say('Git made a hidden <code>.git</code> folder. Your files did not change. The folder can now remember.');draw();flash($('rpGit'));
    };
    $('rpEdit').onclick=function(){
      var f=R.edits%2?'style.css':'index.html';R.edits++;R.dirty[f]=1;R.ver[f]++;
      cmd('code '+f+'    # you type and press Ctrl+S');
      say(R.git?'<b>'+f+'</b> changed. Git notices, but it only remembers it once you save a snapshot.':'<b>'+f+'</b> changed and the old version is <b>gone for good</b>. Nothing was remembering it.');
      draw();
    };
    $('rpSave').onclick=function(){
      cmd('git add . && git commit -m "'+drafts[R.snaps.length%drafts.length]+'"');
      if(!R.git){window.gitPop('err','fatal: not a git repository','This folder has no <code>.git</code>, so there is nowhere to save a snapshot.<br>Press <b>git init</b> first.');return}
      if(!Object.keys(R.dirty).length){say('Nothing changed since the last snapshot, so there is nothing new to save. Edit a file first.');return}
      R.snaps.push([id(),drafts[R.snaps.length%drafts.length]]);R.dirty={};
      say('Snapshot saved inside <code>.git</code>. You can always come back to this exact moment.');draw();flash($('rpGit'));
    };
    $('rpPush').onclick=function(){
      var first=!R.linked;
      cmd(first?'git remote add origin https://github.com/you/my-project.git\n$ git push -u origin main':'git push');
      if(!R.git){window.gitPop('err','fatal: not a git repository','Only a repo can be pushed. Press <b>git init</b> first.');return}
      if(!R.snaps.length){say('There are no snapshots to send yet. Save one first.');return}
      R.cloud=R.snaps.slice();R.linked=true;
      say('GitHub now has a copy of every snapshot. The one on your laptop is the <b>local</b> repo, the one online is the <b>remote</b> repo.'+(first?' The first push needs two steps: <code>git remote add origin</code> tells the folder where GitHub is, and <code>-u</code> links your branch to it. After that, plain <code>git push</code> is enough.':''));draw();flash($('rpCloud'));
    };
    $('rpDel').onclick=function(){
      if(!R.git){say('There is no <code>.git</code> folder to delete.');return}
      window.gitPop('warn','Delete the .git folder?','Your files stay. All the snapshots inside it are lost from this laptop.',[{t:'Delete it',fn:function(){
        cmd('rm -rf .git');R.git=false;R.snaps=[];R.deleted=true;R.linked=false;
        say(R.cloud.length?'Your files are still here, but the history is gone from your laptop. Good thing GitHub still has a copy: you could <code>git clone</code> it back.':'Your files are still here, but every snapshot is gone. It is just a folder again.');draw();
      }},{t:'Keep it'}]);
    };
    $('rpReset').onclick=reset;
    reset();
  })();
})();
