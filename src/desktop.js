/* ---------- Mini laptop desktop: boot screen, desktop, Bin, browser ---------- */
(function(){
  var ML=window.ML;if(!ML||!document.getElementById('taskbar'))return;
  var $=function(i){return document.getElementById(i)},esc=ML.esc,base=ML.base,dirname=ML.dirname,under=ML.under,HOME=ML.HOME;
  var REPO='https://github.com/nishik2811-cell/Git-GitHub-Workshop';
  function S(){return ML.S()}
  function store(k,v){try{if(v===undefined)return localStorage.getItem('mlDesk.'+k);localStorage.setItem('mlDesk.'+k,v)}catch(e){return null}}
  function say(t){ML.pr('<span class="c">[Desktop] '+t+'</span>')}
  var html=document.documentElement;

  /* ---------- pixel icons (16x16 grids drawn as SVG rects) ---------- */
  function px(rows,pal){var o='<svg viewBox="0 0 16 16" aria-hidden="true">';
    rows.forEach(function(r,y){for(var x=0;x<r.length;x++){var c=pal[r[x]];if(c)o+='<rect x="'+x+'" y="'+y+'" width="1.02" height="1.02" fill="'+c+'"/>'}});return o+'</svg>'}
  var I={
    folder:px(['................','................','.KKKKK..........','KYYYYYK.........','KYYYYYYKKKKKKKK.','KYYYYYYYYYYYYYK.','KLLLLLLLLLLLLLLK','KLYYYYYYYYYYYYLK','KLYYYYYYYYYYYYLK','KLYYYYYYYYYYYYLK','KLYYYYYYYYYYYYLK','KLYYYYYYYYYYYYLK','KLYYYYYYYYYYYYLK','KDDDDDDDDDDDDDDK','.KKKKKKKKKKKKKK.','................'],{K:'#16327a',Y:'#ffd34e',L:'#fff1b0',D:'#e0a31a'}),
    file:px(['..KKKKKKKKK.....','..KWWWWWWWKK....','..KWWWWWWWKGK...','..KWWWWWWWKKKK..','..KWWWWWWWWWWK..','..KWBBBBBBBWWK..','..KWWWWWWWWWWK..','..KWBBBBBBWWWK..','..KWWWWWWWWWWK..','..KWBBBBBBBWWK..','..KWWWWWWWWWWK..','..KWBBBBBWWWWK..','..KWWWWWWWWWWK..','..KGGGGGGGGGGK..','..KKKKKKKKKKKK..','................'],{K:'#16327a',W:'#ffffff',G:'#cfd8ee',B:'#7fa3e0'}),
    ws:px(['................','KKKKKKKKKKKKKKKK','KBBBBBBBBBBBPPBK','KBBBBBBBBBBBPPBK','KKKKKKKKKKKKKKKK','KSSSSSSSSSSSSSSK','KSSWWSSSSSSSSSSK','KSSSSSSSSSWWSSSK','KSSSSSSSSSSSSSSK','KGGGGGGGGGGGGGGK','KGGGGHHGGGGGGGGK','KGGGGHHGGGGGGGGK','KGGGGGGGGGGGHHGK','KGGGGGGGGGGGGGGK','KKKKKKKKKKKKKKKK','................'],{K:'#16327a',B:'#1d4ba6',P:'#e8336d',S:'#7fb3ea',W:'#ffffff',G:'#4caf50',H:'#2e7d32'}),
    vs:px(['................','.KKKKKKKKKKKKKK.','KBBBBBBBBBBBBBBK','KBBBBBBBBBBWBBBK','KBBBBBBBBBWWBBBK','KBWBBBBBBWWWBBBK','KBBWWBBBWWBWBBBK','KBBBBWWWWBBWBBBK','KBBBBWWWWBBWBBBK','KBBWWBBBWWBWBBBK','KBWBBBBBBWWWBBBK','KBBBBBBBBBWWBBBK','KBBBBBBBBBBWBBBK','KBBBBBBBBBBBBBBK','.KKKKKKKKKKKKKK.','................'],{K:'#0b3d66',B:'#007acc',W:'#ffffff'}),
    br:px(['................','.....KKKKKK.....','...KKBBGGBBKK...','..KBBBGGGBBBBK..','.KBBBGGGGGBBBBK.','.KBBGGGGGGBBBBK.','KBBBGGGGGBBBGGBK','KBBBBGGGBBBGGGBK','KBBBBBGGBBGGGGBK','KBBBBBGBBBGGGBBK','.KBBBBBBBBGGBBK.','.KBBGGBBBBBBBBK.','..KBBGGGBBBBBK..','...KKBBBBBBKK...','.....KKKKKK.....','................'],{K:'#16327a',B:'#4fa3e8',G:'#5cc05c'}),
    bin:px(['......KKKK......','..KKKKSSSSKKKK..','..KSSSSSSSSSSK..','..KKKKKKKKKKKK..','...KGLGLGLGLK...','...KGLGLGLGLK...','...KGLGLGLGLK...','...KGLGLGLGLK...','...KGLGLGLGLK...','...KGLGLGLGLK...','...KGLGLGLGLK...','...KGLGLGLGLK...','...KGLGLGLGLK...','...KGGGGGGGGK...','....KKKKKKKK....','................'],{K:'#16327a',S:'#c9d2e8',G:'#9aa7c7',L:'#dfe5f3'}),
    binf:px(['....W.KKKKP.....','..KKKKSSSSKKKK..','..KSWSPSSWSPSK..','..KKKKKKKKKKKK..','...KGLGLGLGLK...','...KGLGLGLGLK...','...KGLGLGLGLK...','...KGLGLGLGLK...','...KGLGLGLGLK...','...KGLGLGLGLK...','...KGLGLGLGLK...','...KGLGLGLGLK...','...KGLGLGLGLK...','...KGGGGGGGGK...','....KKKKKKKK....','................'],{K:'#16327a',S:'#c9d2e8',G:'#9aa7c7',L:'#dfe5f3',W:'#ffffff',P:'#ff8fba'}),
    repo:px(['................','..KKKKKKKKKKK...','..KBBBBBBBBBBK..','..KBWWWWWWWWBK..','..KBBBBBBBBBBK..','..KBWWWWWBBBBK..','..KBBBBBBBBBBK..','..KBWWWWWWWBBK..','..KBBBBBBBBBBK..','..KBBBBBBBBBBK..','..KKKKKKKKKKKK..','....KPPK........','....KPPK........','....KPKPK.......','................','................'],{K:'#16327a',B:'#1d4ba6',W:'#cfe3ff',P:'#e8336d'}),
    pad:px(['..K.K.K.K.K.....','.KWKWKWKWKWK....','.KWWWWWWWWWK..KK','.KWBBBBBBBWK.KOK','.KWWWWWWWWWKKOOK','.KWBBBBBBWWKOOK.','.KWWWWWWWWKOOK..','.KWPPWWWWKOOKK..','.KWPWPWWWKKKK...','.KWWPWPWKKKKK...','.KWWWWPPWWWWK...','.KWWWWWWWWWWK...','.KWBBBBBBBWWK...','.KWWWWWWWWWWK...','.KKKKKKKKKKKK...','................'],{K:'#16327a',W:'#ffffff',B:'#a9c4f0',P:'#e8336d',O:'#ffb74d'}),
    pdf:px(['..KKKKKKKKK.....','..KWWWWWWWKK....','..KWWWWWWWKGK...','..KWWWWWWWKKKK..','..KWBBBBBBWWWK..','..KWWWWWWWWWWK..','..KWBBBBBBBWWK..','.KRRRRRRRRRRRK..','.KRWWRWWRRWWRK..','.KRWRRWRWRWRRK..','.KRWWRWRWRWWRK..','.KRWRRWWRRWRRK..','.KRRRRRRRRRRRK..','..KWWWWWWWWWWK..','..KKKKKKKKKKKK..','................'],{K:'#16327a',W:'#ffffff',G:'#cfd8ee',B:'#7fa3e0',R:'#d93a3a'}),
    lab:px(['................','KKKKKKKKKKKKKKKK','KBBBBBBBBBPPYYGK','KKKKKKKKKKKKKKKK','KDDDDDDDDDDDDDDK','KDGDDDDDDDDDDDDK','KDDGDDDDDDDDDDDK','KDDDGDDDDDDDDDDK','KDDGDDDDDDDDDDDK','KDGDDDGGGGGDDDDK','KDDDDDDDDDDDDDDK','KDDDDDDDDDDDDDDK','KDDDDDDDDDDDDDDK','KKKKKKKKKKKKKKKK','.....KKKKKK.....','...KKKKKKKKKK...'],{K:'#16327a',B:'#1d4ba6',D:'#1b2440',G:'#5cf08a',P:'#e8336d',Y:'#ffd34e'}),
    power:'<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 3v8"/><path d="M6.3 7.2a8 8 0 1 0 11.4 0"/></svg>',
    lock:'<svg class="lock" viewBox="0 0 12 12" aria-hidden="true"><rect x="2" y="5" width="8" height="6" fill="#2e9e4f"/><path d="M3.5 5V3.6a2.5 2.5 0 0 1 5 0V5" fill="none" stroke="#2e9e4f" stroke-width="1.5"/></svg>'
  };

  /* ---------- wallpaper: an original pixel landscape drawn on a tiny canvas ---------- */
  var WP={day:{sky:['#8ec5ff','#a9d4ff','#c4e2ff','#dcefff'],sun:'#fff3a6',cl:'#ffffff',cs:'#d8e9ff',h1:'#7cc96a',h1s:'#6ab55a',h2:'#4ca34a',h2s:'#3f8d3e',g:'#2f7a34',n:'Day'},
          sunset:{sky:['#5b4b9a','#a35d9e','#f08a7a','#ffc27a'],sun:'#ffe08a',cl:'#ffd0c0',cs:'#e9a0a6',h1:'#7a5aa0',h1s:'#6a4c8f',h2:'#4e3d7a',h2s:'#43346b',g:'#352a5a',n:'Sunset'},
          night:{sky:['#0d1a3f','#14245a','#1d3172','#273f88'],sun:'#f4f1d0',cl:'#33477f',cs:'#2a3c70',h1:'#2b5a4a',h1s:'#244e40',h2:'#1d4436',h2s:'#173a2e',g:'#12301f',n:'Night',stars:1}};
  var wpCache={};
  function wallpaper(k){if(wpCache[k])return wpCache[k];var p=WP[k],W=192,H=120,c=document.createElement('canvas');c.width=W;c.height=H;var g=c.getContext('2d');
    var bands=p.sky.length;for(var y=0;y<H;y++){var t=y/(H*0.62),b=Math.min(bands-1,Math.floor(t*bands)),f=(t*bands)%1;g.fillStyle=p.sky[b];g.fillRect(0,y,W,1);
      if(f>0.75&&b<bands-1){g.fillStyle=p.sky[b+1];for(var dx=(y%2);dx<W;dx+=2)g.fillRect(dx,y,1,1)}}
    if(p.stars){var sd=7;for(var i=0;i<46;i++){sd=(sd*9301+49297)%233280;var sx=sd%W;sd=(sd*9301+49297)%233280;var sy=sd%60;g.fillStyle=i%5?'#cdd7ff':'#ffffff';g.fillRect(sx,sy,1,1)}}
    g.fillStyle=p.sun;var cx=150,cy=k==='sunset'?52:22,r=9;for(var yy=-r;yy<=r;yy++)for(var xx=-r;xx<=r;xx++)if(xx*xx+yy*yy<=r*r)g.fillRect(cx+xx,cy+yy,1,1);
    if(k==='night'){g.fillStyle=p.sky[0];for(yy=-r;yy<=r;yy++)for(xx=-r;xx<=r;xx++)if((xx-4)*(xx-4)+(yy+2)*(yy+2)<=r*r*0.7)g.fillRect(cx+xx,cy+yy,1,1)}
    function cloud(x,y,s){[[0,4,22,5],[4,1,10,4],[12,0,8,5],[18,2,8,5]].forEach(function(q){g.fillStyle=p.cl;g.fillRect(x+q[0]*s,y+q[1]*s,q[2]*s,q[3]*s)});g.fillStyle=p.cs;g.fillRect(x,y+8*s,22*s,1*s)}
    cloud(18,14,1);cloud(92,30,1);cloud(60,8,0.7);
    function hill(base,amp,f,ph,col,shade){for(var x=0;x<W;x++){var h=Math.round(base-amp*Math.sin(x*f+ph)-amp*0.4*Math.sin(x*f*2.3+ph*1.7));g.fillStyle=col;g.fillRect(x,h,1,H-h);g.fillStyle=shade;g.fillRect(x,h+3,1,1);if(x%7===0)g.fillRect(x,h+6,1,1)}}
    hill(78,9,0.03,1.2,p.h1,p.h1s);hill(94,7,0.045,3.1,p.h2,p.h2s);
    g.fillStyle=p.g;for(var x2=0;x2<W;x2++){g.fillRect(x2,H-6+((x2*7)%3===0?-1:0),1,8)}
    return (wpCache[k]=c.toDataURL())}

  /* ---------- build the DOM ---------- */
  var desk=document.createElement('div');desk.className='desk';desk.id='desk';desk.hidden=true;desk.setAttribute('role','region');desk.setAttribute('aria-label','Mini laptop desktop');
  desk.innerHTML='<div id="dIcons"></div>';document.body.appendChild(desk);
  var icons=$('dIcons');

  var tbar=$('taskbar'),tray=tbar.querySelector('.tray'),oldTk=tbar.querySelector('span.tk');
  function tkBtn(id,title,icon){var b=document.createElement('button');b.className='tk tkapp';b.id=id;b.title=title;b.type='button';b.innerHTML='<i>'+icon+'</i><span>'+esc(title)+'</span>';return b}
  var tkShow=document.createElement('button');tkShow.className='tkshow';tkShow.type='button';tkShow.title='Show desktop';tkShow.setAttribute('aria-label','Show desktop');tray.appendChild(tkShow);
  tkShow.onclick=function(){minAll()};
  var tkWS=tkBtn('tkWS','git-and-github-workshop.exe',I.ws);tkWS.classList.add('on');
  if(oldTk)oldTk.replaceWith(tkWS);else tbar.insertBefore(tkWS,tray);
  var tkLab=tkBtn('tkLab','Practice Lab',I.lab);tkLab.hidden=true;tbar.insertBefore(tkLab,tray);
  var tkBR=tkBtn('tkBR','Browser',I.br);tkBR.hidden=true;tbar.insertBefore(tkBR,tray);
  var tkDraw=tkBtn('tkDraw','Notepad',I.pad);tkDraw.hidden=true;tbar.insertBefore(tkDraw,tray);
  var tkGuide=tkBtn('tkGuide','Setup-Guide.pdf',I.pdf);tkGuide.hidden=true;tbar.insertBefore(tkGuide,tray);
  var tkMeme=tkBtn('tkMeme','hehehe',I.folder);tkMeme.hidden=true;tbar.insertBefore(tkMeme,tray);
  var tkCred=tkBtn('tkCred','suspects.txt',I.file);tkCred.hidden=true;tbar.insertBefore(tkCred,tray);
  var tkBin=tkBtn('tkBin','Bin',I.bin);tkBin.hidden=true;tbar.insertBefore(tkBin,tray);

  html.classList.add('deskon');

  /* ---------- boot screen ---------- */
  var boot=document.createElement('div');boot.className='boot';boot.id='boot';boot.setAttribute('role','dialog');boot.setAttribute('aria-label','Git workshop start screen');
  var hf=document.querySelector('.heroframe');
  if(hf){boot.appendChild(hf);boot.insertAdjacentHTML('beforeend','<p class="bootnote">Press START</p>')}
  document.body.appendChild(boot);html.classList.remove('preboot');
  function bootShow(){ML.ctxClose();try{sessionStorage.removeItem('mlStarted')}catch(z){}var sm=$('startMenu');if(sm)sm.hidden=true;boot.hidden=false;boot.classList.remove('out');html.classList.add('booting');var s=boot.querySelector('.start');if(s)s.focus({preventScroll:true})}
  function bootGo(hash,instant){if(boot.hidden)return;html.classList.remove('booting');try{sessionStorage.setItem('mlStarted','1')}catch(z){}
    if(instant)boot.hidden=true;else{boot.classList.add('out');setTimeout(function(){boot.hidden=true;boot.classList.remove('out')},360)}
    desk.hidden=false;draw(true);
    if(!wasOn){winOpen('wsWin');setTimeout(function(){wsBody.dispatchEvent(new Event('scroll'))},50);var t=null;try{t=hash&&document.querySelector(hash)}catch(z){}if(t)t.scrollIntoView({behavior:'instant',block:'start'});wasOn=true;setTimeout(showTip,700);if(hash==='#p5'||hash==='#t2-3b')setTimeout(openLab,60)}
    setTimeout(function(){if(location.hash)history.replaceState(null,'',location.pathname+location.search)},50)}
  var wasOn=false;
  /* only START leaves the start screen; Yes, No and the folder just show a pop-up */
  boot.addEventListener('click',function(e){var t=e.target.closest?e.target:e.target.parentNode;
    var a=t.closest('a[href^="#"]');
    if(a){e.preventDefault();e.stopImmediatePropagation();if(a.classList.contains('start'))bootGo(deepHash);return}
    if(t.closest('#heroYes')){e.stopImmediatePropagation();popWarn('WARNING','Going back is exactly what Git is for. Every commit is a save point you can go back to.<br><br>Press <b>START</b> to learn how.');return}
    if(t.closest('#heroNo')){e.stopImmediatePropagation();popWarn('WARNING','No going back? Then let\'s go forward!<br><br>Press <b>START</b> to begin.');return}
    if(t.closest('#heroFolder')){e.stopImmediatePropagation();folderPop(false)}},true);
  /* a page address like #p3 is remembered: the start screen still shows, and START jumps there */
  var deepHash=null;try{if(location.hash.length>1&&document.querySelector(location.hash))deepHash=location.hash}catch(z){}
  html.classList.add('booting');if(location.hash)history.replaceState(null,'',location.pathname+location.search);
  /* the start screen shows when you open the site or press Power; refreshing after START goes straight back to the desktop */
  if(html.classList.contains('skipboot'))setTimeout(function(){bootGo(deepHash,true);html.classList.remove('skipboot')},0);
  /* the folder on the start screen: a tiny file explorer of a Git repo */
  function folderPop(hid){var row=function(ic,n,d,h){return '<div class="fxr'+(h?' fxh':'')+'"><span class="fxi">'+ic+'</span><b>'+n+'</b><small>'+d+'</small></div>'};
    var body='<div class="fexp"><div class="fxp">&#128193; recipes</div>'
      +(hid?row(I.folder,'.git','Git\'s memory. All 3 saves (commits) live in here. Delete it and Git forgets everything.',1):'')
      +row(I.file,'README.md','The front page. Says what this project is.')
      +row(I.file,'pasta.txt','A recipe.')+row(I.file,'pizza.txt','Another recipe.')
      +'<div class="fxf">'+(hid?'4 items':'3 items, 1 hidden')+'</div></div>'
      +(hid?'<p class="fxn">That hidden <b>.git</b> folder is what makes <b>recipes</b> a Git repo. Never edit it by hand.</p>':'<p class="fxn">This folder is a <b>Git repo</b>. Git hides one folder in here. Can you find it?</p>');
    window.gitPop('warn','recipes (folder)',body,[{t:hid?'Hide hidden files':'Show hidden files',fn:function(){setTimeout(function(){folderPop(!hid)},0)}},{t:'Close'}])}

  /* topics in the start menu bring the workshop back */
  var smn=$('startMenu');if(smn)smn.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href^="#"]');var W=wins.wsWin;if(a&&W&&(W.el.hidden||W.el.classList.contains('docked')))winOpen('wsWin')},true);
  /* power button */
  var smf=document.querySelector('#startMenu .smfoot');
  if(smf){var pw=document.createElement('button');pw.type='button';pw.className='smpower';pw.title='Turn off the Mini laptop';pw.innerHTML=I.power+'<span>Power</span>';smf.appendChild(pw);
    pw.onclick=function(e){e.stopPropagation();bootShow()}}

  /* one-time tip on the taskbar button */
  var tip=null;
  function showTip(){var W=wins.wsWin;if(store('tip')||!W||W.el.hidden||W.el.classList.contains('docked'))return;tip=document.createElement('div');tip.className='tktip';tip.setAttribute('role','status');
    tip.innerHTML=(innerWidth<=700?'The workshop is a window. Press <b>&#9633;</b> for full screen, or <b>_</b> to minimise it and see the desktop. Tap it down here to bring it back.':'The workshop is a window. Use <b>_</b> to minimise it, <b>&#9633;</b> for full screen, or drag its corner to resize it. Click it down here to bring it back.')+'<button type="button" aria-label="Close tip">x</button>';
    document.body.appendChild(tip);var r=tkWS.getBoundingClientRect();tip.style.left=Math.max(8,Math.min(r.left,innerWidth-tip.offsetWidth-8))+'px';tip.style.setProperty('--ax',Math.max(12,r.left+r.width/2-parseFloat(tip.style.left)-7)+'px');
    tip.querySelector('button').onclick=hideTip;setTimeout(hideTip,12000)}
  function hideTip(){if(tip){tip.remove();tip=null;store('tip','1')}}

  /* ---------- floating windows (browser, Bin) ---------- */
  var wins={};
  function zOrder(w){var all=[$('notepad')].concat(Object.keys(wins).map(function(k){return wins[k].el})).filter(Boolean);
    all.sort(function(a,b){return (+a.style.zIndex||55)-(+b.style.zIndex||55)});all.splice(all.indexOf(w),1);all.push(w);
    /* pinned windows (VS Code, Notepad) always stay above the others; the one you clicked last is on top among them */
    var pinOn=function(x){return x.id==='notepad'?vsPinned:x.id==='drawWin'?padPinned:false};all=all.filter(function(x){return !pinOn(x)}).concat(all.filter(pinOn));
    all.forEach(function(x,i){x.style.zIndex=51+i});active=w;tkSync()}
  var active=null,vsPinned=store('vspin')==='1',padPinned=store('padpin')==='1';
  /* which windows are on screen, which one is in front, and what a click on its taskbar button or desktop icon does */
  function isVis(el){if(!el)return false;if(el.id==='notepad')return el.classList.contains('show')&&!el.classList.contains('docked');return !el.hidden&&!el.classList.contains('docked')}
  function topWin(){if(active&&isVis(active))return active;var t=null,tz=-1;[$('notepad')].concat(Object.keys(wins).map(function(k){return wins[k].el})).forEach(function(el){if(!isVis(el))return;var z=+el.style.zIndex||55;if(z>=tz){tz=z;t=el}});return t}
  function tkSync(){var t=topWin();Object.keys(wins).forEach(function(k){wins[k].tk.classList.toggle('on',wins[k].el===t)});var tv=$('tkVS');if(tv)tv.classList.toggle('on',!!t&&t.id==='notepad')}
  function activate(el,open){if(!el)return;var isNp=el.id==='notepad',id=el.id;
    if(!isVis(el)){if(isNp){ML.showVS();zOrder(el)}else{winOpen(id);if(id==='drawWin')padFit();if(id==='binWin')binDraw();if(id==='guideWin')guideInit();if(id==='memeWin')memeInit()}return}
    if(open||topWin()!==el){zOrder(el);return}
    if(isNp)window.vsDock(true);else winDock(id,true)}
  var np=$('notepad');if(np){np.addEventListener('pointerdown',function(){zOrder(np)},true);
    /* pin VS Code on top of the other windows */
    var pinB=document.createElement('button');pinB.type='button';pinB.id='npPin';pinB.innerHTML='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 1.5h6l-1 4 2.5 2.5h-9L6 5.5z" fill="currentColor"/><path d="M8 8v6.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
    function pinSync(){pinB.classList.toggle('on',vsPinned);pinB.setAttribute('aria-pressed',vsPinned?'true':'false');pinB.title=vsPinned?'Unpin (stop keeping VS Code on top)':'Pin on top (keep VS Code above other windows)';pinB.setAttribute('aria-label',pinB.title)}
    pinB.onclick=function(e){e.stopPropagation();vsPinned=!vsPinned;store('vspin',vsPinned?'1':'0');pinSync();zOrder(np)};
    var mn=$('npMin');if(mn)mn.parentNode.insertBefore(pinB,mn);pinSync();
    var tkv=$('tkVS');if(tkv)tkv.onclick=function(){activate(np)};
    var npWas=false;new MutationObserver(function(){var vis=isVis(np);if(vis&&!npWas)zOrder(np);else tkSync();npWas=vis}).observe(np,{attributes:true,attributeFilter:['class']})}
  function makeWin(id,title,icon,tk,w,h,o){o=o||{};var el=document.createElement('div');el.className='dwin';el.id=id;el.hidden=true;el.setAttribute('role','dialog');el.setAttribute('aria-label',title);
    el.innerHTML='<div class="dwh"><i>'+icon+'</i><span>'+esc(title)+'</span><button type="button" class="dmin" title="Minimise" aria-label="Minimise">_</button>'+(o.max?'<button type="button" class="dmax" title="Full screen" aria-label="Full screen">&#9633;</button>':'')+(o.noClose?'':'<button type="button" class="dx" title="Close" aria-label="Close">x</button>')+'</div><div class="dwb"></div><span class="dwr" aria-hidden="true"></span>';
    document.body.appendChild(el);var W={el:el,body:el.querySelector('.dwb'),tk:tk,placed:false,w:w,h:h};wins[id]=W;
    el.addEventListener('pointerdown',function(){zOrder(el)},true);
    var hd=el.querySelector('.dwh'),ox,oy,dr=false;
    hd.addEventListener('pointerdown',function(e){if(e.target.closest('button')||innerWidth<=700||el.classList.contains('max'))return;dr=true;var r=el.getBoundingClientRect();ox=e.clientX-r.left;oy=e.clientY-r.top;hd.setPointerCapture(e.pointerId)});
    hd.addEventListener('pointermove',function(e){if(!dr)return;el.style.left=Math.max(0,Math.min(innerWidth-120,e.clientX-ox))+'px';el.style.top=Math.max(0,Math.min(innerHeight-80,e.clientY-oy))+'px'});
    hd.addEventListener('pointerup',function(){dr=false});
    var g=el.querySelector('.dwr'),sx,sy,sw,sh,on=false;
    g.addEventListener('pointerdown',function(e){e.preventDefault();e.stopPropagation();var r=el.getBoundingClientRect();sx=e.clientX;sy=e.clientY;sw=r.width;sh=r.height;on=true;el.classList.add('sizing');g.setPointerCapture(e.pointerId)});
    g.addEventListener('pointermove',function(e){if(!on)return;var r=el.getBoundingClientRect();el.style.width=Math.max(240,Math.min(innerWidth-r.left-6,sw+e.clientX-sx))+'px';el.style.height=Math.max(150,Math.min(innerHeight-r.top-44,sh+e.clientY-sy))+'px'});
    g.addEventListener('pointerup',function(){on=false;el.classList.remove('sizing')});
    el.querySelector('.dmin').onclick=function(){winDock(id,true)};
    if(!o.noClose){el.querySelector('.dx').onclick=function(){winClose(id)};
      if(!o.noEsc)el.addEventListener('keydown',function(e){if(e.key==='Escape'&&!e.defaultPrevented&&!document.querySelector('.ctxm')){winClose(id)}})}
    if(o.max){el.querySelector('.dmax').onclick=function(){winMax(id)};hd.addEventListener('dblclick',function(e){if(!e.target.closest('button')&&innerWidth>700)winMax(id)})}
    tk.onclick=function(){activate(el)};
    return W}
  function vsFront(){if(np)zOrder(np)}
  function openVS(k){ML.openInVS(k);vsFront()}
  function winOpen(id){var W=wins[id],el=W.el,was=isVis(el);el.hidden=false;el.classList.remove('docked');W.tk.hidden=false;
    if(!W.placed&&W.place){W.placed=true;W.place()}
    if(!W.placed){W.placed=true;var w=Math.min(W.w,innerWidth-24),h=Math.min(W.h,innerHeight-110);el.style.width=w+'px';el.style.height=h+'px';
      var n=Object.keys(wins).indexOf(id);el.style.left=Math.max(8,Math.round((innerWidth-w)/2)+n*28)+'px';el.style.top=Math.max(8,Math.round((innerHeight-38-h)/2)-20+n*24)+'px'}
    zOrder(el);if(was)return;el.classList.remove('flash');void el.offsetWidth;el.classList.add('flash');var f=el.querySelector('[data-focus]')||el.querySelector('.dx');if(f)f.focus({preventScroll:true})}
  function winMax(id,on){var el=wins[id].el;if(on==null)on=!el.classList.contains('max');el.classList.toggle('max',on);var b=el.querySelector('.dmax');
    if(b){b.innerHTML=on?'&#10064;':'&#9633;';b.title=on?'Restore down':'Full screen';b.setAttribute('aria-label',b.title)}}
  function winDock(id,on){var W=wins[id];if(on){W.el.classList.add('docked');tkSync()}else winOpen(id)}
  function winClose(id){var W=wins[id];W.el.hidden=true;W.el.classList.remove('docked');W.tk.hidden=true;tkSync()}
  function anyWinOpen(){var o=Object.keys(wins).some(function(k){var e=wins[k].el;return !e.hidden&&!e.classList.contains('docked')});return o||(np&&np.classList.contains('show')&&!np.classList.contains('docked'))}
  function minAll(){Object.keys(wins).forEach(function(k){if(!wins[k].el.hidden)winDock(k,true)});if(np&&np.classList.contains('show')&&window.vsDock)window.vsDock(true)}


  /* ---------- the workshop is a real window: all the page content scrolls inside it ---------- */
  var WS=makeWin('wsWin','git-and-github-workshop.exe',I.ws,tkWS,1100,700,{max:true,noClose:true});
  var wsBody=WS.body;wsBody.id='wsBody';wsBody.classList.add('wsb');
  var wsIn=document.createElement('div');wsIn.id='wsIn';wsBody.appendChild(wsIn);
  var KEEP={ov:1,startMenu:1,taskbar:1,notepad:1,boot:1,desk:1};
  [].slice.call(document.body.children).forEach(function(el){if(el.tagName==='SCRIPT'||KEEP[el.id]||el.classList.contains('dwin')||el.classList.contains('ctxm')||el.classList.contains('tktip'))return;wsIn.appendChild(el)});
  /* the workshop sits to the right of every built-in icon column, so no app icon starts hidden behind it */
  function appCols(){if(desk.hidden||!desk.clientHeight)return 1;var L=layout(items()),m=0;items().forEach(function(it){if(it.app&&L[it.k])m=Math.max(m,L[it.k].col)});return m+1}
  WS.place=function(){var c=cell(),n=appCols();if(innerWidth<=700){WS.el.style.setProperty('--wsl',Math.min(c.x0+n*c.w+4,Math.round(innerWidth*0.45))+'px');return}var l=Math.min(c.x0+n*c.w+12,Math.round(innerWidth*0.3));WS.el.style.left=l+'px';WS.el.style.top='8px';WS.el.style.width=Math.max(320,innerWidth-l-10)+'px';WS.el.style.height=Math.max(220,innerHeight-38-16)+'px'};
  var WSBASE=980;
  function wsZoom(){var w=wsBody.clientWidth;if(!w)return;var base=innerWidth<=700?innerWidth:WSBASE,nz=w&&w<base*0.97?String(Math.round(w/base*1000)/1000):'';if(nz!==wsIn.style.zoom)wsIn.style.zoom=nz}
  /* keep your reading position when the window is resized, made full screen or rescaled:
     remember which bit of the lesson sits in the middle of the window, and put it back there afterwards */
  var bookmark=null,bmT=0;
  function wsRec(){var wr=wsBody.getBoundingClientRect();if(!wr.height||WS.el.hidden||WS.el.classList.contains('docked'))return;var z=parseFloat(wsIn.style.zoom)||1;
    if(wsBody.scrollTop<2){bookmark=null;return}
    var found=null;[0.4,0.55,0.25,0.7].some(function(f){var hit=document.elementFromPoint(wr.left+wr.width/2,wr.top+wr.height*f);
      if(!hit||!wsIn.contains(hit)||(hit.closest&&hit.closest('.loadwrap,.wnav,.wbtns')))return false; // sticky bars never move: useless as a bookmark
      found={el:hit,f:f,d:(wr.top+wr.height*f-hit.getBoundingClientRect().top)/z};return true});
    if(found)bookmark=found}
  function wsRestore(){if(!bookmark||!wsIn.contains(bookmark.el)||WS.el.hidden||WS.el.classList.contains('docked'))return;var wr=wsBody.getBoundingClientRect(),z=parseFloat(wsIn.style.zoom)||1;if(!wr.height)return;
    var diff=bookmark.el.getBoundingClientRect().top+bookmark.d*z-(wr.top+wr.height*bookmark.f);if(Math.abs(diff)>1)wsBody.scrollTo({top:wsBody.scrollTop+diff,behavior:'instant'})}
  wsBody.addEventListener('scroll',function(){clearTimeout(bmT);bmT=setTimeout(wsRec,120)},{passive:true});
  function wsLw(){var lw=wsIn.querySelector('.loadwrap');wsIn.style.setProperty('--lwh',(lw?lw.offsetHeight:0)+'px')}
  /* the little flowers, hearts and stars behind the lessons: the page made them while it was still hidden
     (so only a few), so fill the whole height of the lessons once the window is open, and again if it grows a lot */
  var DECO=['sp-star','sp-flower','sp-heart','sp-flower2','sp-heartb','sp-sparkle'],decoT=null;
  function decoFill(){var bg=wsIn.querySelector('.bgdeco');if(!bg||WS.el.hidden)return;bg.style.height='0px';var H=wsIn.scrollHeight;if(H<400)return;
    if(Math.abs(H-(+bg.dataset.h||0))<300&&Math.abs((wsIn.clientWidth||0)-(+bg.dataset.w||0))<40){bg.style.height=bg.dataset.h+'px';return}
    bg.dataset.h=H;bg.style.height=H+'px';bg.innerHTML='';
    /* a natural-looking scatter ("blue noise"): random spots, but never too close to each other, so there are no
       clumps and no grid pattern. Never behind a lesson card or banner (they are see-through and it would smudge). */
    var W=wsIn.clientWidth||800,minD=W<600?125:180,k=0,
      z=parseFloat(getComputedStyle(wsIn).zoom)||1,wr=wsIn.getBoundingClientRect(),blocks=[];
    bg.dataset.w=W;
    wsIn.querySelectorAll('.card,.banner,.idx,.signoff,.marquee,.icons,footer,.loadwrap').forEach(function(el){var r=el.getBoundingClientRect();if(!r.width)return;
      var off=el.classList.contains('rv')&&!el.classList.contains('in')?24*z:0; // cards not shown yet sit 24px lower until they slide in
      blocks.push([(r.left-wr.left)/z-10,(r.top-off-wr.top)/z-10,(r.right-wr.left)/z+10,(r.bottom-off-wr.top)/z+10])});
    function free(x,y,sz){if(x<6||x+sz>W-6)return false;for(var i=0;i<blocks.length;i++){var b=blocks[i];if(x<b[2]&&x+sz>b[0]&&y<b[3]&&y+sz>b[1])return false}return true}
    /* which decoration: small sparkles most often, the bigger ones less */
    var KINDS=[['sp-sparkle',26,12,20],['sp-star',20,18,28],['sp-heart',14,18,28],['sp-heartb',14,18,28],['sp-flower',13,20,32],['sp-flower2',13,20,32]],tot=0;
    KINDS.forEach(function(q){tot+=q[1]});
    function kind(){var r=Math.random()*tot;for(var i=0;i<KINDS.length;i++){r-=KINDS[i][1];if(r<0)return KINDS[i]}return KINDS[0]}
    var cs=minD/Math.SQRT2,gw=Math.ceil(W/cs),grid={},tries=Math.round(W*H/(minD*minD)*14);
    function near(x,y){var gx=Math.floor(x/cs),gy=Math.floor(y/cs);for(var a=gx-2;a<=gx+2;a++)for(var b=gy-2;b<=gy+2;b++){var q=grid[a+','+b];if(q&&(q[0]-x)*(q[0]-x)+(q[1]-y)*(q[1]-y)<minD*minD)return true}return false}
    for(var t=0;t<tries;t++){var q=kind(),sz=q[2]+Math.random()*(q[3]-q[2]),x=Math.random()*W,y=Math.random()*(H-sz),cx=x+sz/2,cy=y+sz/2;
      if(!free(x,y,sz)||near(cx,cy))continue;grid[Math.floor(cx/cs)+','+Math.floor(cy/cs)]=[cx,cy];
      var e=document.createElement('i');e.className='sp '+q[0]+(Math.random()<0.5?' bob':' bob2');
      e.style.left=(x/W*100)+'%';e.style.top=y+'px';e.style.height=sz+'px';e.style.animationDelay=(-Math.random()*4).toFixed(2)+'s';bg.appendChild(e);k++}}
  function wsFit(){wsZoom();wsLw();wsRestore();clearTimeout(decoT);decoT=setTimeout(decoFill,250)}
  if(window.ResizeObserver)new ResizeObserver(wsFit).observe(wsBody);else addEventListener('resize',wsFit);
  addEventListener('resize',function(){if(innerWidth<=700){WS.place();return}if(WS.el.classList.contains('max'))return;var r=WS.el.getBoundingClientRect();if(r.right>innerWidth||r.bottom>innerHeight-38){WS.place()}});


  /* ---------- the Practice Lab is its own app: the terminal, the four boxes and the stories live in this window ---------- */
  var LAB=makeWin('labWin','Practice Lab',I.lab,tkLab,1060,720,{max:true,noEsc:true});
  var labBody=LAB.body;labBody.id='labBody';var labIn=document.createElement('div');labIn.id='labIn';labBody.appendChild(labIn);
  (function(){var card=$('t2-3b'),cb=card&&card.querySelector('.body'),pg=$('pg');if(!cb||!pg)return;
    var lead=cb.querySelector('p.lead');if(lead)labIn.appendChild(lead);
    [pg,cb.querySelector('.btns.pgb'),$('pgBar'),cb.querySelector('p.note')].forEach(function(x){if(x)labIn.appendChild(x)});
    cb.insertAdjacentHTML('afterbegin','<p class="lead">The practice lab is an <mark>app</mark> on your Mini laptop. It opens in its own window, so a lesson can stay open right beside it.</p>'
      +'<div class="btns labgo"><button type="button" class="greenbtn" id="labGo">Open the Practice Lab</button></div>'
      +'<p class="note">You can also double-click <b>Practice Lab</b> on the desktop, or search for it in the Start menu.</p>');
    $('labGo').onclick=function(){openLab()}})();
  LAB.place=function(){if(innerWidth<=700){LAB.el.style.setProperty('--wsl','0px');return} /* phones: the terminal needs the whole width */
    var c=cell(),l=Math.min(c.x0+appCols()*c.w+40,Math.round(innerWidth*0.3)+28),w=Math.max(340,Math.min(1060,innerWidth-l-20));
    LAB.el.style.left=l+'px';LAB.el.style.top='22px';LAB.el.style.width=w+'px';LAB.el.style.height=Math.max(240,innerHeight-38-40)+'px'};
  var LABBASE=1000;
  function labZoom(){var w=labBody.clientWidth;if(!w)return;var nz=innerWidth>700&&w<LABBASE*0.97?String(Math.round(w/LABBASE*1000)/1000):'';if(nz!==labIn.style.zoom)labIn.style.zoom=nz}
  if(window.ResizeObserver)new ResizeObserver(labZoom).observe(labBody);else addEventListener('resize',labZoom);
  function openLab(){var was=isVis(LAB.el);activate(LAB.el,true);labZoom();
    /* VS Code is the lab's editor: bring it along, in front */
    if(!was&&np&&np.classList.contains('show')&&!np.classList.contains('docked'))zOrder(np)}
  ML.openLab=openLab;
  /* links to the practice lab (the Start menu, the lesson index) open the app */
  document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href="#t2-3b"],a[href="#p5"]');if(a)setTimeout(openLab,30)});

  /* browser: the address is locked to the workshop repo; Search opens it in a new tab */
  var BR=makeWin('brWin','Browser',I.br,tkBR,560,400);
  BR.body.parentNode.insertBefore((function(){var d=document.createElement('div');d.className='brbar';
    d.innerHTML='<button type="button" class="brnav" disabled aria-label="Back">&#9664;</button><button type="button" class="brnav" disabled aria-label="Forward">&#9654;</button><label class="brurl" title="This address is locked">'+I.lock+'<input id="brUrl" readonly value="'+REPO+'" aria-label="Address (locked)"></label><button type="button" class="brgo" id="brGo" data-focus>Search</button>';return d})(),BR.body);
  BR.body.innerHTML='<div class="brpage"><div class="brlogo">Git<b>Hub</b> repo</div><p>This is the workshop\'s own repository on GitHub. Press <b>Search</b> to open it in a new tab.</p>'
    +'<div class="brcard"><span class="rpic">'+I.repo+'</span><div><b>nishik2811-cell / Git-GitHub-Workshop</b><small>The code for this whole workshop: one HTML file.</small></div></div><p class="brmsg" id="brMsg" role="status"></p></div>';
  function brSearch(){var a=document.createElement('a');a.href=REPO;a.target='_blank';a.rel='noopener';document.body.appendChild(a);a.click();a.remove();
    $('brMsg').innerHTML='Opened in a new tab. Nothing happened? <a href="'+REPO+'" target="_blank" rel="noopener">Open the repo</a>'}
  $('brGo').onclick=brSearch;
  $('brUrl').addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();brSearch()}});
  ['paste','cut','drop'].forEach(function(n){$('brUrl').addEventListener(n,function(e){e.preventDefault()})});


  /* drawing notepad */
  var DW=makeWin('drawWin','Notepad',I.pad,tkDraw,580,430);
  /* pin Notepad on top, like VS Code */
  (function(){var b=document.createElement('button');b.type='button';b.className='dpin';
    b.innerHTML='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 1.5h6l-1 4 2.5 2.5h-9L6 5.5z" fill="currentColor"/><path d="M8 8v6.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
    function sync(){b.classList.toggle('on',padPinned);b.setAttribute('aria-pressed',padPinned?'true':'false');b.title=padPinned?'Unpin (stop keeping Notepad on top)':'Pin on top (keep Notepad above other windows)';b.setAttribute('aria-label',b.title)}
    b.onclick=function(e){e.stopPropagation();padPinned=!padPinned;store('padpin',padPinned?'1':'0');sync();zOrder(DW.el)};
    var mn=DW.el.querySelector('.dwh .dmin');mn.parentNode.insertBefore(b,mn);sync()})();
  var PCOL=[['#16327a','Blue ink'],['#222222','Black'],['#e8336d','Pink'],['#2e9e4f','Green'],['#e07f22','Orange'],['#7653d1','Purple']],PSZ=[[2,'Thin'],[5,'Medium'],[11,'Thick']];
  DW.body.classList.add('padb');
  DW.body.innerHTML='<div class="padtools" role="toolbar" aria-label="Drawing tools"><span class="padgrp">'
    +'<button type="button" class="padt on" data-tool="pen" aria-pressed="true" title="Pen">&#9998; Pen</button><button type="button" class="padt" data-tool="er" aria-pressed="false" title="Eraser">&#9003; Eraser</button></span>'
    +'<span class="padgrp">'+PCOL.map(function(c,i){return '<button type="button" class="padc'+(i?'':' on')+'" data-col="'+c[0]+'" style="background:'+c[0]+'" title="'+c[1]+'" aria-label="'+c[1]+'" aria-pressed="'+(i?'false':'true')+'"></button>'}).join('')+'</span>'
    +'<span class="padgrp">'+PSZ.map(function(z,i){return '<button type="button" class="padz'+(i===1?' on':'')+'" data-sz="'+z[0]+'" title="'+z[1]+'" aria-label="'+z[1]+' line" aria-pressed="'+(i===1)+'"><i style="width:'+(z[0]+3)+'px;height:'+(z[0]+3)+'px"></i></button>'}).join('')+'</span>'
    +'<span class="padgrp"><button type="button" class="padt" data-act="undo" title="Undo (Ctrl+Z)">&#8630; Undo</button><button type="button" class="padt" data-act="clear" title="Clear the page">Clear</button><button type="button" class="padt pads" data-act="save" title="Save as a picture">Save</button></span></div>'
    +'<div class="padpaper"><canvas id="padCv" aria-label="Drawing area. Draw with the mouse, a pen or your finger."></canvas></div>';
  var cv=$('padCv'),cx=cv.getContext('2d'),strokes=[],cur=null,pTool='pen',pCol=PCOL[0][0],pSz=5,dpr=1;
  function padFit(){var r=cv.parentNode.getBoundingClientRect();if(!r.width||!r.height)return;dpr=window.devicePixelRatio||1;cv.width=Math.round(r.width*dpr);cv.height=Math.round(r.height*dpr);cv.style.width=r.width+'px';cv.style.height=r.height+'px';padRedraw()}
  function padStroke(s){cx.save();cx.globalCompositeOperation=s.er?'destination-out':'source-over';cx.strokeStyle=s.c;cx.fillStyle=s.c;cx.lineWidth=s.w;cx.lineCap='round';cx.lineJoin='round';
    var p=s.p;if(p.length===1){cx.beginPath();cx.arc(p[0][0],p[0][1],s.w/2,0,Math.PI*2);cx.fill()}else{cx.beginPath();cx.moveTo(p[0][0],p[0][1]);for(var i=1;i<p.length;i++)cx.lineTo(p[i][0],p[i][1]);cx.stroke()}cx.restore()}
  function padRedraw(){cx.setTransform(1,0,0,1,0,0);cx.clearRect(0,0,cv.width,cv.height);cx.setTransform(dpr,0,0,dpr,0,0);strokes.forEach(padStroke)}
  function ppos(e){var r=cv.getBoundingClientRect();return [Math.round((e.clientX-r.left)*10)/10,Math.round((e.clientY-r.top)*10)/10]}
  cv.addEventListener('pointerdown',function(e){if(e.button!==0&&e.pointerType==='mouse')return;e.preventDefault();cv.setPointerCapture(e.pointerId);cur={c:pCol,w:pTool==='er'?pSz*3:pSz,er:pTool==='er',p:[ppos(e)],id:e.pointerId};strokes.push(cur);padRedraw()});
  cv.addEventListener('pointermove',function(e){if(!cur||e.pointerId!==cur.id)return;var evs=e.getCoalescedEvents?e.getCoalescedEvents():[e];evs.forEach(function(q){cur.p.push(ppos(q))});padRedraw()});
  function pend(e){if(cur&&e.pointerId===cur.id)cur=null}
  cv.addEventListener('pointerup',pend);cv.addEventListener('pointercancel',pend);
  function pset(sel,b){DW.body.querySelectorAll(sel).forEach(function(x){x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',x===b?'true':'false')})}
  DW.body.querySelector('.padtools').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
    if(b.dataset.tool){pTool=b.dataset.tool;pset('[data-tool]',b)}
    else if(b.dataset.col){pCol=b.dataset.col;pset('[data-col]',b);if(pTool==='er'){pTool='pen';pset('[data-tool]',DW.body.querySelector('[data-tool="pen"]'))}}
    else if(b.dataset.sz){pSz=+b.dataset.sz;pset('[data-sz]',b)}
    else if(b.dataset.act==='undo'){strokes.pop();padRedraw()}
    else if(b.dataset.act==='clear'){if(!strokes.length)return;confirmPop('Clear the page?','Your drawing will be wiped. (Undo cannot bring it back.)',function(){strokes=[];padRedraw()})}
    else if(b.dataset.act==='save'){var o=document.createElement('canvas');o.width=cv.width;o.height=cv.height;var g=o.getContext('2d');g.fillStyle='#ffffff';g.fillRect(0,0,o.width,o.height);g.drawImage(cv,0,0);
      var a=document.createElement('a');a.download='drawing.png';a.href=o.toDataURL('image/png');document.body.appendChild(a);a.click();a.remove()}});
  DW.el.addEventListener('keydown',function(e){if((e.ctrlKey||e.metaKey)&&e.key==='z'){e.preventDefault();strokes.pop();padRedraw()}});
  if(window.ResizeObserver)new ResizeObserver(function(){padFit()}).observe(cv.parentNode);else addEventListener('resize',padFit);


  /* the setup guide PDF (packed into the page by src/sync.py from docs/setup-guide.pdf) */
  var GW=makeWin('guideWin','Setup-Guide.pdf',I.pdf,tkGuide,800,600,{max:true}),gUrl=null;
  GW.body.classList.add('gdb');
  function guideInit(){if(gUrl!==null)return;var src=document.getElementById('guidePdf');gUrl='';
    if(src){try{var b=atob(src.textContent.replace(/\s+/g,'')),a=new Uint8Array(b.length);for(var i=0;i<b.length;i++)a[i]=b.charCodeAt(i);gUrl=URL.createObjectURL(new Blob([a],{type:'application/pdf'}))}catch(e){gUrl=''}}
    if(!gUrl){GW.body.innerHTML='<div class="gdmsg"><span class="gdi">'+I.pdf+'</span><p>The setup guide is not in this copy of the page.</p><p><a href="docs/setup-guide.pdf" target="_blank" rel="noopener">Try docs/setup-guide.pdf</a></p></div>';return}
    var inline=navigator.pdfViewerEnabled!==false&&!(innerWidth<=700&&/Android|iPhone|iPad|Mobile/i.test(navigator.userAgent));
    GW.body.innerHTML='<div class="gdbar"><span>Git, Git Bash, VS Code &amp; GitHub: Complete Setup Guide</span><a class="gdbtn" href="'+gUrl+'" target="_blank" rel="noopener" data-focus>Open in new tab</a><a class="gdbtn" href="'+gUrl+'" download="Git-GitHub-Setup-Guide.pdf">Download</a></div>'
      +(inline?'<iframe class="gdf" title="Setup guide PDF" src="'+gUrl+'"></iframe>':'<div class="gdmsg"><span class="gdi">'+I.pdf+'</span><p><b>Git, Git Bash, VS Code &amp; GitHub: Complete Setup Guide</b></p><p>13 pages: install everything on Windows or Linux, connect to GitHub, a command cheat sheet and troubleshooting.</p><p>This browser cannot show PDFs inside a page. Use <b>Open in new tab</b> or <b>Download</b> above.</p></div>')}
  // clicks inside the PDF do not reach the page, so bring the window forward when the PDF gets focus
  addEventListener('blur',function(){setTimeout(function(){var f=GW.el.querySelector('iframe');if(f&&document.activeElement===f&&topWin()!==GW.el)zOrder(GW.el)},0)});


  /* the hehehe folder: memes packed into the page by src/sync.py from the memes/ folder */
  var MEMES=[['google-drive-crimes.jpg','"Where do you save your code?" "Google Drive." The driver turns round, horrified.'],
    ['final_final_FINAL_v3.jpg','Expanding brain: git, then folders v1.0 to v2.2, then project-final-for-real, then projectttttt and aaaaaaaa.'],
    ['git-out-alive.jpg','In case of fire: 1. git commit, 2. git push, 3. git out!'],
    ['star-forks.jpg','A fork held up in front of the GitHub logo: May the fork be with you.'],
    ['bathroom-tile-commit-streak.jpg','Your GitHub contribution graph with a few green squares, versus a whole wall of green tiles.']];
  var MW=makeWin('memeWin','hehehe',I.folder,tkMeme,660,480,{max:true}),memeList=null,memeAt=-1;
  MW.body.classList.add('mmb');
  function escA(t){return esc(t).replace(/"/g,'&quot;')}
  function memeInit(){if(memeList)return;memeList=[];var packs={};document.querySelectorAll('script.memePack').forEach(function(sc){packs[sc.getAttribute('data-name')]=sc});
    var names=MEMES.map(function(m){return m[0]}).filter(function(n){return packs[n]}).concat(Object.keys(packs).filter(function(n){return !MEMES.some(function(m){return m[0]===n})}));
    names.forEach(function(n){try{var b=atob(packs[n].textContent.replace(/\s+/g,'')),a=new Uint8Array(b.length);for(var i=0;i<b.length;i++)a[i]=b.charCodeAt(i);
      var alt=(MEMES.filter(function(m){return m[0]===n})[0]||[n,n])[1];memeList.push({n:n,alt:alt,url:URL.createObjectURL(new Blob([a],{type:'image/jpeg'}))})}catch(e){}});
    memeGrid()}
  function memeGrid(){memeAt=-1;
    if(!memeList.length){MW.body.innerHTML='<div class="mmempty">This folder is empty.</div>';return}
    MW.body.innerHTML='<div class="mmpath">&#128193; ~/Desktop/hehehe <small>'+memeList.length+' items</small></div><div class="mmgrid">'+memeList.map(function(m,i){return '<button type="button" class="mmt" data-i="'+i+'" title="'+esc(m.n)+'"><span class="mmimg"><img src="'+m.url+'" alt="'+escA(m.alt)+'"></span><span class="mmn">'+esc(m.n)+'</span></button>'}).join('')+'</div>'}
  function memeShow(i){memeAt=(i+memeList.length)%memeList.length;var m=memeList[memeAt];
    MW.body.innerHTML='<div class="mmbar"><button type="button" class="mmbtn" data-mm="back">&#9664; Back to folder</button><span>'+esc(m.n)+' <small>('+(memeAt+1)+' of '+memeList.length+')</small></span><button type="button" class="mmbtn" data-mm="prev" aria-label="Previous meme">&larr;</button><button type="button" class="mmbtn" data-mm="next" aria-label="Next meme">&rarr;</button></div><div class="mmview"><img src="'+m.url+'" alt="'+escA(m.alt)+'"></div>';
    var f=MW.body.querySelector('[data-mm="next"]');if(f)f.focus({preventScroll:true})}
  MW.body.addEventListener('click',function(e){var t=e.target.closest('.mmt');if(t){memeShow(+t.getAttribute('data-i'));return}
    var b=e.target.closest('[data-mm]');if(!b)return;var a=b.getAttribute('data-mm');if(a==='back')memeGrid();else memeShow(memeAt+(a==='next'?1:-1))});
  MW.el.addEventListener('keydown',function(e){if(memeAt<0)return;if(e.key==='ArrowRight'){e.preventDefault();memeShow(memeAt+1)}else if(e.key==='ArrowLeft'){e.preventDefault();memeShow(memeAt-1)}else if(e.key==='Backspace'){e.preventDefault();memeGrid()}});


  /* suspects.txt: the team, with GitHub profile links (add a username here when you have it) */
  var TEAM=[['Nishita','nishik2811-cell'],['Yashieta','yashibleh'],['Abhinav','Abhinav9897S'],['Aryan','Aryan5x'],['Vasu','VasuMittal2606']];
  var CW=makeWin('credWin','suspects.txt',I.file,tkCred,440,380);
  CW.body.classList.add('crb');
  CW.body.innerHTML='<div class="crtxt">GIT-WORKSHOP.EXE\ndebugged at 2 AM by\n\n'
    +TEAM.map(function(t){var pad=new Array(Math.max(1,11-t[0].length)).join(' ');return '  <b>'+esc(t[0])+'</b>'+pad+(t[1]?'<a href="https://github.com/'+esc(t[1])+'" target="_blank" rel="noopener" data-focus>github.com/'+esc(t[1])+'</a>':'<i>(link coming soon)</i>')}).join('\n')
    +'\n\n5 friends &middot; 1 workshop &middot; 0 merge conflicts</div>';

  /* Bin window */
  var BW=makeWin('binWin','Bin',I.bin,tkBin,460,330);
  function binDraw(){var b=S().bin||[],h='<div class="bintop"><span>'+(b.length?b.length+' item'+(b.length>1?'s':'')+' in the Bin':'The Bin is empty')+'</span><button type="button" data-bin="all"'+(b.length?'':' disabled')+'>Restore all</button><button type="button" class="red" data-bin="empty"'+(b.length?'':' disabled')+'>Empty Bin</button></div>';
    if(!b.length)h+='<div class="binempty">Things you delete on the desktop or in VS Code land here, so you can bring them back.<br><br><code>rm</code> in the terminal deletes for good, just like real Git Bash.</div>';
    b.slice().reverse().forEach(function(e){h+='<div class="binrow"><span class="bi">'+(e.dir?I.folder:I.file)+'</span><div><b>'+esc(e.name)+(e.repo?' (a Git repo)':'')+'</b><small>from '+esc(tilde(e.from))+'</small></div><button type="button" data-bin="r" data-id="'+e.id+'">Restore</button><button type="button" class="red" data-bin="x" data-id="'+e.id+'" aria-label="Delete '+esc(e.name)+' forever">Delete</button></div>'});
    BW.body.innerHTML=h;tkBin.querySelector('i').innerHTML=b.length?I.binf:I.bin}
  function tilde(a){return a===HOME?'~ (desktop)':a.indexOf(HOME+'/')===0?'~'+a.slice(HOME.length):a}
  BW.body.addEventListener('click',function(e){var b=e.target.closest('[data-bin]');if(!b)return;var k=b.getAttribute('data-bin'),id=+b.getAttribute('data-id');
    if(k==='r'){var r=ML.binRestore(id);if(r.err)return popWarn('Cannot restore',r.err);say('Restored '+esc(base(r.abs))+' to '+esc(tilde(dirname(r.abs)))+'.'+(r.note?' '+r.note:''));if(r.note)popWarn('Restored without history',r.note);ML.render()}
    else if(k==='x'){var it=(S().bin||[]).filter(function(x){return x.id===id})[0];if(!it)return;confirmPop('Delete forever?','<b>'+esc(it.name)+'</b> will be gone for good.',function(){ML.binEmpty(id);ML.render()})}
    else if(k==='empty')confirmPop('Empty the Bin?','Everything in the Bin will be gone for good.',function(){ML.binEmpty();say('Emptied the Bin.');ML.render()});
    else if(k==='all'){var n=0,notes=[];(S().bin||[]).slice().forEach(function(x){var r2=ML.binRestore(x.id);if(!r2.err){n++;if(r2.note)notes.push(r2.note)}});say('Restored '+n+' item'+(n===1?'':'s')+'.');if(notes.length)popWarn('Restored without history',notes[0]);ML.render()}});
  function popWarn(t,m){if(window.gitPop)window.gitPop('warn',t,m)}
  function confirmPop(t,m,fn){if(window.gitPop)window.gitPop('err',t,m,[{t:'Yes',fn:fn},{t:'Cancel'}]);else if(confirm(t))fn()}

  /* ---------- desktop icons ---------- */
  var view=store('view')==='small'?'small':'large',wp=WP[store('wp')]?store('wp'):'day',theme=store('theme')||'blue';
  var pos={},sel=null,clip=null,renaming=null,lastSig='';
  function applyLook(){desk.classList.toggle('small',view==='small');desk.style.backgroundImage='url('+wallpaper(wp)+')';
    html.classList.remove('th-green','th-pink','th-purple','th-orange');if(theme!=='blue')html.classList.add('th-'+theme)}
  applyLook();
  function items(){var s=S(),bin=s.bin||[],o=[{k:'app:ws',n:'Workshop',ic:I.ws,app:'ws'},{k:'app:lab',n:'Practice Lab',ic:I.lab,app:'lab'},{k:'app:vs',n:'VS Code',ic:I.vs,app:'vs'},{k:'app:br',n:'Browser',ic:I.br,app:'br'},{k:'app:draw',n:'Notepad',ic:I.pad,app:'draw'},{k:'app:guide',n:'Setup-Guide.pdf',ic:I.pdf,app:'guide'},{k:'app:memes',n:'hehehe',ic:I.folder,app:'memes',dir:true},{k:'app:credits',n:'suspects.txt',ic:I.file,app:'credits'},{k:'app:bin',n:'Bin',ic:bin.length?I.binf:I.bin,app:'bin'}];
    var mine=[];
    Object.keys(s.dirs).filter(function(d){return d!==HOME&&dirname(d)===HOME}).forEach(function(d){mine.push({k:d,n:base(d),ic:I.folder,dir:true,repo:!!(s.repo&&s.repo.root===d)})});
    Object.keys(s.files).filter(function(f){return dirname(f)===HOME}).forEach(function(f){mine.push({k:f,n:base(f),ic:I.file,mark:ML.gitMark(f)})});
    mine.forEach(function(x){if(!born[x.k])born[x.k]=++bornN});
    var nm=function(a,b){var x=a.n.toLowerCase(),y=b.n.toLowerCase();return x<y?-1:x>y?1:0},ext=function(x){var m=x.n.match(/\.([^.]+)$/);return m?m[1].toLowerCase():''};
    /* Arrange icons: by name sorts every icon A to Z; by type puts apps, then folders, then files grouped by type
       (the setup guide counts as a .pdf file); by date created keeps the apps first, then your things oldest first */
    if(sortBy==='name')return o.concat(mine).sort(nm);
    if(sortBy==='date'){mine.sort(function(a,b){return born[a.k]-born[b.k]});return o.concat(mine)}
    var grp=function(x){return x.app&&x.app!=='guide'&&x.app!=='memes'&&x.app!=='credits'?0:x.dir?1:2},ord=function(x){return x.app?['ws','lab','vs','br','draw','bin'].indexOf(x.app):0};
    return o.concat(mine).sort(function(a,b){return grp(a)!==grp(b)?grp(a)-grp(b):grp(a)===0?ord(a)-ord(b):ext(a)!==ext(b)?(ext(a)<ext(b)?-1:1):nm(a,b)})}
  var SORTS={name:'name',type:'type',date:'date created'},sortBy=SORTS[store('sort')]?store('sort'):'type',born={},bornN=0;
  function arrange(k){sortBy=k;store('sort',k);pos={};lastSig='';draw(true);say('Arranged the icons by '+SORTS[k]+'.')}
  function cell(){var sm=view==='small',ph=innerWidth<=700;return {w:sm?(ph?66:74):(ph?80:92),h:sm?(ph?66:72):(ph?84:96),x0:8,y0:8}}
  function slots(n){var c=cell(),rows=Math.max(1,Math.floor((desk.clientHeight-c.y0)/c.h)),cols=Math.max(1,Math.floor((desk.clientWidth-c.x0)/c.w));return {c:c,rows:rows,cols:cols}}
  function layout(list){var g=slots(),c=g.c,used={},out={};
    function key(col,row){return col+','+row}
    list.forEach(function(it){var p=pos[it.k];if(p&&p.col<g.cols&&p.row<g.rows&&!used[key(p.col,p.row)]){used[key(p.col,p.row)]=1;out[it.k]=p}});
    var i=0;list.forEach(function(it){if(out[it.k])return;var col,row;
      do{col=Math.floor(i/g.rows);row=i%g.rows;i++}while(used[key(col,row)]&&i<5000);used[key(col,row)]=1;out[it.k]={col:col,row:row}});
    return out}
  function draw(force){if(desk.hidden&&!force)return;if(renaming)return;
    var list=items(),s=S(),sig=JSON.stringify(list.map(function(x){return [x.k,x.mark||'',x.repo||0,x.ic.length]}))+'|'+view+'|'+(clip?clip.mode+clip.abs:'')+'|'+sel+'|'+desk.clientWidth+'x'+desk.clientHeight+'|'+JSON.stringify(pos);
    if(sig===lastSig&&!force)return;lastSig=sig;
    var L=layout(list),c=cell(),h='',foc=document.activeElement&&document.activeElement.closest&&document.activeElement.closest('.dico'),fk=foc&&foc.getAttribute('data-k');
    list.forEach(function(it){var p=L[it.k];h+='<button type="button" class="dico'+(sel===it.k?' sel':'')+(clip&&clip.mode==='cut'&&clip.abs===it.k?' cut':'')+'" data-k="'+esc(it.k)+'" style="left:'+(c.x0+p.col*c.w+(c.w-(view==='small'?(innerWidth<=700?62:68):(innerWidth<=700?74:84)))/2)+'px;top:'+(c.y0+p.row*c.h)+'px" title="'+esc(it.n)+(it.repo?' (Git repo)':'')+'">'
      +'<span class="dic">'+it.ic+(it.repo?'<b class="dbadge bU" style="background:#e8336d" aria-label="Git repo">git</b>':it.mark?'<b class="dbadge b'+it.mark+'" aria-label="Git: '+({U:'new',M:'changed',A:'staged',C:'conflict'})[it.mark]+'">'+(it.mark==='C'?'!':it.mark)+'</b>':'')+'</span><span class="dl">'+esc(it.n)+'</span></button>'});
    icons.innerHTML=h;
    if(fk){var nf=icons.querySelector('[data-k="'+cssq(fk)+'"]');if(nf)nf.focus({preventScroll:true})}
    if(!BW.el.hidden)binDraw();else tkBin.querySelector('i').innerHTML=(s.bin||[]).length?I.binf:I.bin}
  function cssq(v){return v.replace(/\\/g,'\\\\').replace(/"/g,'\\"')}
  /* remember the order things appear in ~ (for "Arrange icons by date created"); runs after every change */
  function noteNew(){var s=S();Object.keys(s.dirs).concat(Object.keys(s.files)).forEach(function(k){if(k!==HOME&&dirname(k)===HOME&&!born[k])born[k]=++bornN})}
  window.deskDraw=function(){noteNew();if(!BW.el.hidden)binDraw();draw()};
  addEventListener('resize',function(){lastSig='';draw()});

  function itemOf(k){var l=items();for(var i=0;i<l.length;i++)if(l[i].k===k)return l[i];return null}
  function openItem(it,open){if(!it)return;
    if(it.app){activate(it.app==='vs'?np:wins[{ws:'wsWin',lab:'labWin',br:'brWin',bin:'binWin',draw:'drawWin',guide:'guideWin',memes:'memeWin',credits:'credWin'}[it.app]].el,open);return}
    openVS(it.k)}

  /* rename right on the icon */
  function startRename(k,isNew){var b=icons.querySelector('.dico[data-k="'+cssq(k)+'"]');if(!b)return;renaming=k;sel=k;b.classList.add('sel');
    var lab=b.querySelector('.dl'),inp=document.createElement('input');inp.className='dren';inp.value=base(k);inp.setAttribute('aria-label','New name');inp.spellcheck=false;inp.autocapitalize='off';
    lab.replaceWith(inp);var dot=inp.value.lastIndexOf('.');inp.focus();inp.setSelectionRange(0,dot>0&&!S().dirs[k]?dot:inp.value.length);
    var done=false;
    function finish(ok){if(done)return;var v=inp.value.trim();
      if(ok&&v!==base(k)){if(!ML.okName(v)){inp.classList.add('bad');inp.title='Use letters, numbers, dots, dashes or underscores. No spaces.';inp.focus();return}
        var r=ML.fsRename(k,HOME+'/'+v);if(r.err){inp.classList.add('bad');popWarn('Cannot rename',r.err);return}
        done=true;renaming=null;if(pos[k]){pos[r.abs]=pos[k];delete pos[k]}if(born[k]){born[r.abs]=born[k];delete born[k]}sel=r.abs;say((isNew?'Named it ':'Renamed '+esc(base(k))+' to ')+esc(v)+'.');lastSig='';ML.render();return}
      done=true;renaming=null;lastSig='';draw(true)}
    inp.addEventListener('keydown',function(e){e.stopPropagation();if(e.key==='Enter'){e.preventDefault();finish(true)}else if(e.key==='Escape'){e.preventDefault();finish(false)}});
    inp.addEventListener('blur',function(){setTimeout(function(){if(!done&&renaming===k)finish(true)},0)});
    ['pointerdown','click','dblclick','contextmenu'].forEach(function(n){inp.addEventListener(n,function(e){e.stopPropagation()})})}

  function newThing(dir){var name=ML.uniq(HOME,dir?'new-folder':'new-file.txt'),r=ML.fsNew(HOME+'/'+name,dir);if(r.err)return popWarn('Cannot create',r.err);
    say('Created '+(dir?'folder ':'')+esc(name)+'.');sel=r.abs;lastSig='';ML.render();draw(true);startRename(r.abs,true)}
  function del(k){var it=itemOf(k);if(!it||it.app)return;var s=S(),rp=s.repo&&under(s.repo.root,k),inr=s.repo&&under(k,s.repo.root)&&k!==s.repo.root;
    function go(){var r=ML.binPut(k);if(r.err)return popWarn('Cannot delete',r.err);if(clip&&under(clip.abs,k))clip=null;delete pos[k];sel=null;
      say('Moved '+esc(base(k))+' to the Bin.'+(inr?' Next: git add, then git commit.':''));ML.render()}
    if(rp)confirmPop('Delete this Git repo?','<b>'+esc(base(k))+'</b> holds a Git repo. Its history (the hidden .git folder) goes to the Bin with it. You can restore it from the Bin.',go);else go()}
  function paste(dir){if(!clip||!ML.exists(clip.abs))return;var r=clip.mode==='cut'?ML.fsMove(clip.abs,dir):ML.fsCopy(clip.abs,dir);
    if(r.err)return popWarn('Cannot paste',r.err);
    say((clip.mode==='cut'?'Moved ':'Copied ')+esc(base(clip.abs))+' to '+esc(tilde(dir))+(r.abs&&base(r.abs)!==base(clip.abs)?' as '+esc(base(r.abs)):'')+'.');
    if(clip.mode==='cut'){if(r.abs!==clip.abs){if(pos[clip.abs]&&dir===HOME)pos[r.abs]=pos[clip.abs];delete pos[clip.abs]}clip=null}
    sel=dir===HOME?r.abs:sel;lastSig='';ML.render()}

  /* menus */
  function deskMenu(x,y){var canPaste=!!(clip&&ML.exists(clip.abs));
    ML.ctxMenu(x,y,[{t:'New folder',fn:function(){newThing(true)}},{t:'New file',fn:function(){newThing(false)}},'-',
      {t:'Paste',k:'Ctrl+V',dis:!canPaste,fn:function(){paste(HOME)}},{t:'Refresh',k:'F5',fn:refresh},'-',
      {t:'Arrange icons',sub:Object.keys(SORTS).map(function(k){return {t:'By '+SORTS[k],on:sortBy===k,fn:function(){arrange(k)}}})},
      {t:'View',sub:[{t:'Large icons',on:view==='large',fn:function(){setView('large')}},{t:'Small icons',on:view==='small',fn:function(){setView('small')}}]},'-',
      {t:'Change wallpaper',sub:Object.keys(WP).map(function(k){return {t:WP[k].n,on:wp===k,fn:function(){wp=k;store('wp',k);applyLook()}}})},
      {t:'Personalise',sub:['blue','green','pink','purple','orange'].map(function(k){return {t:k[0].toUpperCase()+k.slice(1),on:theme===k,fn:function(){theme=k;store('theme',k);applyLook()}}})}])}
  function itemMenu(it,x,y){sel=it.k;markSel();
    if(it.app){var m=[{t:'Open',fn:function(){openItem(it,true)}}];if(it.app==='bin'){var n=(S().bin||[]).length;m.push('-',{t:'Empty Bin',dis:!n,fn:function(){confirmPop('Empty the Bin?','Everything in the Bin will be gone for good.',function(){ML.binEmpty();say('Emptied the Bin.');ML.render()})}})}
      ML.ctxMenu(x,y,m);return}
    var canPaste=it.dir&&clip&&ML.exists(clip.abs);
    ML.ctxMenu(x,y,[{t:'Open',fn:function(){openItem(it)}},{t:'Open with VS Code',fn:function(){openVS(it.k)}},'-',
      {t:'Cut',k:'Ctrl+X',fn:function(){clip={mode:'cut',abs:it.k};lastSig='';draw(true)}},{t:'Copy',k:'Ctrl+C',fn:function(){clip={mode:'copy',abs:it.k};lastSig='';draw(true)}},
      {t:'Paste into folder',dis:!canPaste,fn:function(){paste(it.k)}},'-',
      {t:'Rename',k:'F2',fn:function(){startRename(it.k)}},{t:'Delete',k:'Del',fn:function(){del(it.k)}}])}
  function setView(v){view=v;store('view',v);pos={};applyLook();lastSig='';draw(true)}
  function refresh(){lastSig='';draw(true);desk.classList.remove('flash');void desk.offsetWidth;desk.classList.add('flash')}
  function markSel(){icons.querySelectorAll('.dico').forEach(function(b){b.classList.toggle('sel',b.getAttribute('data-k')===sel)})}

  ML.longPress(desk,function(t){return !(t.closest&&t.closest('input'))},function(e){var b=e.target.closest&&e.target.closest('.dico');
    if(b){var it=itemOf(b.getAttribute('data-k'));if(it){itemMenu(it,e.clientX,e.clientY);return}}sel=null;markSel();deskMenu(e.clientX,e.clientY)});

  /* click, double-click, drag */
  var drag=null,lastTap={k:null,t:0},lastPtr='mouse',ghostUntil=0;
  /* on touch screens a window can open right under your finger; the same tap's click must not press a button in it */
  document.addEventListener('click',function(e){if(Date.now()<ghostUntil&&!(e.target.closest&&e.target.closest('#desk'))){e.preventDefault();e.stopPropagation();ghostUntil=0}},true);
  desk.addEventListener('pointerdown',function(e){lastPtr=e.pointerType},true);
  desk.addEventListener('pointerdown',function(e){if(e.button!==0&&e.pointerType==='mouse')return;var b=e.target.closest('.dico');if(renaming&&(!b||b.getAttribute('data-k')!==renaming))return;
    if(!b){sel=null;markSel();return}
    if(b.querySelector('.dren'))return;
    sel=b.getAttribute('data-k');markSel();
    drag={b:b,k:sel,sx:e.clientX,sy:e.clientY,ox:b.offsetLeft,oy:b.offsetTop,moved:false,id:e.pointerId,type:e.pointerType}});
  desk.addEventListener('pointermove',function(e){if(!drag||e.pointerId!==drag.id)return;var dx=e.clientX-drag.sx,dy=e.clientY-drag.sy;
    if(!drag.moved){if(Math.abs(dx)+Math.abs(dy)<8)return;drag.moved=true;drag.b.classList.add('drag');try{desk.setPointerCapture(e.pointerId)}catch(z){}}
    drag.b.style.left=(drag.ox+dx)+'px';drag.b.style.top=(drag.oy+dy)+'px';
    var t=dropTarget(drag,e.clientX,e.clientY);icons.querySelectorAll('.dico.drop').forEach(function(x){if(x!==t)x.classList.remove('drop')});if(t)t.classList.add('drop')});
  function dropTarget(d,x,y){var b=d.b;b.style.visibility='hidden';var el=document.elementFromPoint(x,y);b.style.visibility='';var t=el&&el.closest&&el.closest('.dico');
    if(!t||t===b)return null;var it=itemOf(t.getAttribute('data-k'));if(!it)return null;var me=itemOf(d.k);if(!me)return null;
    if(me.app)return null;if(it.app==='bin'||it.app==='vs'||(it.dir&&!(me.dir&&under(it.k,me.k))))return t;return null}
  function endDrag(e){if(!drag)return;var d=drag;drag=null;d.b.classList.remove('drag');
    if(!d.moved){if(e.type==='pointercancel'||(desk._lp&&Date.now()-desk._lp<900))return;var now=Date.now(),it=itemOf(d.k);
      if(appOpen(it)){lastTap={k:null,t:0};if(d.type!=='mouse')ghostUntil=Date.now()+600;activate(appEl(it));return}
      if(d.type!=='mouse'){if(lastTap.k===d.k&&now-lastTap.t<700){lastTap={k:null,t:0};ghostUntil=Date.now()+600;openItem(it)}else lastTap={k:d.k,t:now}}
      return}
    var t=dropTarget(d,e.clientX,e.clientY);icons.querySelectorAll('.dico.drop').forEach(function(x){x.classList.remove('drop')});
    if(t){var it2=itemOf(t.getAttribute('data-k'));
      if(it2.app==='bin'){del(d.k);lastSig='';draw(true);return}
      if(it2.app==='vs'){lastSig='';draw(true);openVS(d.k);return}
      if(it2.dir){var r=ML.fsMove(d.k,it2.k);if(r.err){popWarn('Cannot move',r.err);lastSig='';draw(true);return}delete pos[d.k];if(clip&&clip.abs===d.k)clip=null;sel=null;say('Moved '+esc(base(d.k))+' into '+esc(base(it2.k))+'.');lastSig='';ML.render();return}}
    var c=cell(),g=slots(),col=Math.max(0,Math.min(g.cols-1,Math.round((d.b.offsetLeft-c.x0)/c.w))),row=Math.max(0,Math.min(g.rows-1,Math.round((d.b.offsetTop-c.y0)/c.h)));
    var L=layout(items()),taken=null;Object.keys(L).forEach(function(k){if(k!==d.k&&L[k].col===col&&L[k].row===row)taken=k});
    if(taken){pos[taken]=L[d.k]}pos[d.k]={col:col,row:row};lastSig='';draw(true)}
  desk.addEventListener('pointerup',endDrag);desk.addEventListener('pointercancel',endDrag);
  desk.addEventListener('dblclick',function(e){if(lastPtr!=='mouse')return;var b=e.target.closest('.dico');if(!b||b.querySelector('.dren'))return;
    var it=itemOf(b.getAttribute('data-k'));if(appOpen(it))return;openItem(it)});
  /* once an app's window is open (even minimised), one click on its icon minimises or restores it, like the taskbar */
  function appEl(it){return it&&it.app?(it.app==='vs'?np:wins[{ws:'wsWin',lab:'labWin',br:'brWin',bin:'binWin',draw:'drawWin',guide:'guideWin',memes:'memeWin',credits:'credWin'}[it.app]].el):null}
  function appOpen(it){var el=appEl(it);if(!el)return false;return el.id==='notepad'?el.classList.contains('show'):!el.hidden}
  desk.addEventListener('keydown',function(e){if(e.target.closest('.dren'))return;var b=e.target.closest('.dico'),k=b&&b.getAttribute('data-k'),it=k&&itemOf(k);
    if(e.key==='Enter'&&it){e.preventDefault();openItem(it)}
    else if(e.key==='F2'&&it&&!it.app){e.preventDefault();startRename(k)}
    else if(e.key==='Delete'&&it&&!it.app){e.preventDefault();del(k)}
    else if(e.key==='F5'){e.preventDefault();refresh()}
    else if((e.ctrlKey||e.metaKey)&&!e.altKey&&it&&!it.app&&(e.key==='c'||e.key==='x')){e.preventDefault();clip={mode:e.key==='x'?'cut':'copy',abs:k};lastSig='';draw(true)}
    else if((e.ctrlKey||e.metaKey)&&e.key==='v'){e.preventDefault();paste(it&&it.dir?k:HOME)}});
  desk.addEventListener('focusin',function(e){var b=e.target.closest&&e.target.closest('.dico');if(b&&!renaming){sel=b.getAttribute('data-k');markSel()}});
  /* ---------- Start menu search: lessons, apps, your files, Git commands and settings, in groups ---------- */
  (function(){var Q=$('smQ'),R=$('smRes'),L=$('smList'),sm=$('startMenu');if(!Q||!R||!sm)return;
    Q.placeholder='Search lessons, apps, files...';Q.setAttribute('aria-label','Search lessons, apps, files, Git commands and settings');
    var acts=[];
    function low(x){return String(x).toLowerCase()}
    function hit(hay,words){hay=low(hay);return words.every(function(w){return hay.indexOf(w)>-1})}
    function lessons(){var out=[];document.querySelectorAll('section.phase').forEach(function(sec){var t=sec.querySelector('h2');if(!t)return;
      sec.querySelectorAll('.idx a').forEach(function(a){out.push({h:a.getAttribute('href'),t:a.textContent.replace(/^\s*\d+\.\s*/,''),p:t.textContent})})});
      out.push({h:'#t1-5',t:'Setup and installation',p:'Introduction'});return out}
    var APPK={ws:'lessons workshop learn read exe',lab:'practice lab terminal git bash missions stories try commands',vs:'vs code visual studio editor explorer source control',br:'browser internet web github repo search',
      draw:'notepad draw paint sketch pen',guide:'setup guide pdf install help windows linux',memes:'hehehe memes funny pictures images folder',credits:'suspects txt credits team names made by',bin:'bin trash recycle deleted restore'};
    /* everyday words people type, and the Git commands that do it */
    var CMDS=[
      ['git restore <file>','Undo changes to a file you have not committed yet','undo discard throw away changes reset file restore go back','#t2-3','git restore '],
      ['git revert <commit>','Undo a commit safely, by adding a new commit that reverses it','undo revert reverse commit go back mistake','#t2-3','git revert '],
      ['git rm <file>','Delete a file and stage the deletion','delete remove rm file','#t2-3','git rm '],
      ['git add <file>','Put a change in the staging area, ready to save','save stage add prepare track','#t2-3','git add '],
      ['git commit -m "message"','Save a snapshot (a save point) of what you staged','save commit snapshot message checkpoint','#t2-3','git commit -m ""'],
      ['git status','See what changed and what is staged','status changed what happened check see state behind ahead','#t2-3','git status'],
      ['git log --oneline','See your history of commits','history log list commits past see','#t2-3','git log --oneline'],
      ['git init','Turn a folder into a Git repo','start new repo create init begin','#t2-2','git init'],
      ['git push -u origin main','Upload your commits to GitHub','upload push send share github online','#t2-4','git push -u origin main'],
      ['git pull','Download new commits from GitHub and merge them in','download pull get update latest sync teammate','#t2-4','git pull'],
      ['git fetch','Check GitHub for new commits, without changing your files','download fetch check update look remote teammate','#t2-4','git fetch'],
      ['git clone <url>','Copy a repo from GitHub onto your computer','download clone copy get repo','#t2-4','git clone '],
      ['git remote add origin <url>','Connect your repo to one on GitHub','connect remote origin link github url','#t2-5','git remote add origin '],
      ['git switch -c <name>','Make a new branch and move onto it','new branch create switch make','#t3-2','git switch -c '],
      ['git switch <name>','Move to another branch','change branch switch go move checkout','#t3-2','git switch '],
      ['git branch','List your branches','list branches see branch','#t3-2','git branch'],
      ['git merge <branch>','Combine another branch into this one','combine merge join branch together','#t3-3','git merge '],
      ['.gitignore','A file listing what Git should never save, like passwords','ignore secret password private hide gitignore keep out','#t4-1','echo "secret.txt" > .gitignore'],
      ['git config --global user.name "Name"','Tell Git your name (and user.email for your email)','name email config who identity setup','#t1-5','git config --global user.name ""']];
    var THEMES=['blue','green','pink','purple','orange'];
    function settings(){var o=[];
      Object.keys(WP).forEach(function(k){o.push({t:'Wallpaper: '+WP[k].n,k:'wallpaper background desktop picture '+k+(k==='night'?' dark':''),on:wp===k,fn:function(){wp=k;store('wp',k);applyLook()}})});
      THEMES.forEach(function(k){o.push({t:'Colours: '+k[0].toUpperCase()+k.slice(1),k:'colour color colours theme personalise personalize '+k,on:theme===k,fn:function(){theme=k;store('theme',k);applyLook()}})});
      o.push({t:'Icons: Large',k:'icons icon size view large big',on:view==='large',fn:function(){setView('large')}});
      o.push({t:'Icons: Small',k:'icons icon size view small little',on:view==='small',fn:function(){setView('small')}});
      Object.keys(SORTS).forEach(function(k){o.push({t:'Arrange icons by '+SORTS[k],k:'arrange sort order icons '+SORTS[k],on:sortBy===k,fn:function(){arrange(k)}})});
      return o}
    function tilde(p){return p===HOME?'~':'~'+p.slice(HOME.length)}
    function act(fn){acts.push(fn);return acts.length-1}
    function grp(t,rows){return rows.length?'<div class="smg">'+t+'</div>'+rows.join(''):''}
    function search(){var v=low(Q.value.trim());if(!v)return;var words=v.split(/\s+/);acts=[];
      var apps=items().filter(function(it){return it.app&&hit(it.n+' '+(APPK[it.app]||''),words)})
        .sort(function(a,b){return (low(a.n).indexOf(v)===0?0:1)-(low(b.n).indexOf(v)===0?0:1)}).slice(0,5)
        .map(function(it){return '<button type="button" class="smhit" data-i="'+act(function(){openItem(it,true)})+'"><i class="smic">'+it.ic+'</i>'+esc(it.n)+'<small>App</small></button>'});
      var les=lessons().filter(function(x){return hit(x.t+' '+x.p,words)}).slice(0,6)
        .map(function(x){return '<a class="smhit" href="'+esc(x.h)+'">'+esc(x.t)+'<small>'+esc(x.p)+'</small></a>'});
      var cmds=CMDS.filter(function(c){return hit(c[0]+' '+c[1]+' '+c[2],words)}).slice(0,4)
        .map(function(c){return '<div class="smcmd"><a class="smhit" href="'+c[3]+'"><code>'+esc(c[0])+'</code><small>'+esc(c[1])+'</small></a><button type="button" class="smtry" data-i="'+act(function(){tryCmd(c[4])})+'" title="Type it in the Practice Lab">Try it</button></div>'});
      var st=S(),fs=Object.keys(st.dirs).filter(function(d){return d!==HOME&&under(d,HOME)}).map(function(d){return [d,1]})
        .concat(Object.keys(st.files).filter(function(f){return under(f,HOME)}).map(function(f){return [f,0]}))
        .filter(function(x){return x[0].indexOf('/.git')<0&&hit(base(x[0]),words)}).slice(0,6)
        .map(function(x){return '<button type="button" class="smhit" data-i="'+act(function(){openVS(x[0])})+'"><i class="smic">'+(x[1]?I.folder:I.file)+'</i>'+esc(base(x[0]))+'<small>'+esc(tilde(dirname(x[0])))+'</small></button>'});
      var set=settings().filter(function(o){return hit(o.t+' '+o.k,words)}).slice(0,5)
        .map(function(o){return '<button type="button" class="smhit" data-i="'+act(o.fn)+'">'+esc(o.t)+(o.on?' <b class="smon">&#10003;</b>':'')+'<small>Setting</small></button>'});
      var h=grp('Apps',apps)+grp('Lessons',les)+grp('Git commands',cmds)+grp('Your files',fs)+grp('Settings',set);
      L.hidden=true;R.hidden=false;R.innerHTML=h||'<p>Nothing found. Try "branch", "undo", "notepad" or "wallpaper".</p>'}
    function tryCmd(c){openLab();var i=$('pgIn');if(!i)return;setTimeout(function(){i.value=c;var at=c.indexOf('""');i.focus({preventScroll:true});var n=at>-1?at+1:c.length;try{i.setSelectionRange(n,n)}catch(z){}},80)}
    Q.addEventListener('input',search);
    Q.addEventListener('keydown',function(e){if(e.key!=='Enter')return;e.preventDefault();search();var f=R.hidden?null:R.querySelector('.smhit');if(f)f.click()});
    R.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('button[data-i]');if(!b)return;e.stopPropagation();var fn=acts[+b.getAttribute('data-i')];sm.hidden=true;if(fn)fn()})})();
})();
