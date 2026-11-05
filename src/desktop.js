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
    setup:px(['.......KK.......','......KGGK......','......KGGK......','......KGGK......','...KKKKGGKKKK...','....KGGGGGGK....','.....KGGGGK.....','......KGGK......','.......KK.......','..KK........KK..','..KSK......KSK..','..KSKKKKKKKKSK..','..KSSSSSSSSSSK..','..KKKKKKKKKKKK..','................','................'],{K:'#16327a',G:'#2e9e4f',S:'#cfd8ee'}),
    cheat:px(['..KKKKKKKKKKK...','..KYYYYYYYYYKK..','..KYKKYYYYYYKYK.','..KYYYYYYYYYKKKK','..KYGYBBBBBYYYYK','..KYYGYYYYYYYYYK','..KYGYBBBBBBBYYK','..KYYYYYYYYYYYYK','..KYGYBBBBYYYYYK','..KYYGYYYYYYYYYK','..KYGYBBBBBBYYYK','..KYYYYYYYYYYYYK','..KYGYBBBBBYYYYK','..KYYYYYYYYYYYYK','..KKKKKKKKKKKKKK','................'],{K:'#16327a',Y:'#fff6c9',G:'#2e9e4f',B:'#7fa3e0'}),
    pic:px(['................','KKKKKKKKKKKKKKKK','KSSSSSSSSSSSSSSK','KSSSSSSSSSSYYSSK','KSSSSSSSSSYYYYSK','KSSSSSSSSSSYYSSK','KSSSSGSSSSSSSSSK','KSSSGGGSSSSSSSSK','KSSGGGGGSSSGSSSK','KSGGGGGGGSGGGSSK','KGGGGGGGGGGGGGGK','KDDDDDDDDDDDDDDK','KDDDDDDDDDDDDDDK','KKKKKKKKKKKKKKKK','................','................'],{K:'#16327a',S:'#9fd0ff',Y:'#ffd34e',G:'#4caf50',D:'#2e7d32'}),
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
  var tkMeme=tkBtn('tkMeme','Photos',I.pic);tkMeme.hidden=true;tbar.insertBefore(tkMeme,tray);
  var tkCred=tkBtn('tkCred','suspects.txt',I.file);tkCred.hidden=true;tbar.insertBefore(tkCred,tray);
  var tkCheat=tkBtn('tkCheat','Cheat Sheet',I.cheat);tkCheat.hidden=true;tbar.insertBefore(tkCheat,tray);
  var tkFx=tkBtn('tkFx','File Explorer',I.folder);tkFx.hidden=true;tbar.insertBefore(tkFx,tray);
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
    if(!wasOn){winOpen('wsWin');setTimeout(function(){wsBody.dispatchEvent(new Event('scroll'))},50);var t=null;try{t=hash&&document.querySelector(hash)}catch(z){}/* scroll only inside the workshop (never the page behind it), and a link to the lab opens at the top: the lab has its own window */wsBody.scrollTop=0;if(t&&wsBody.contains(t)&&!t.closest('#p5')){var jump=function(){var sb=wsBody.style.scrollBehavior;wsBody.style.scrollBehavior='auto';wsBody.scrollTop+=t.getBoundingClientRect().top-wsBody.getBoundingClientRect().top;wsBody.style.scrollBehavior=sb};jump();setTimeout(jump,150);setTimeout(jump,450)}wasOn=true;setTimeout(showTip,700)} /* a link to the lab (#p5) only scrolls to its card: the lab never opens by itself */
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
  var smn=$('startMenu');if(smn)smn.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href^="#"]');var W=wins.wsWin;if(a&&W){if(W.el.hidden||W.el.classList.contains('docked'))winOpen('wsWin');else zOrder(W.el)}},true);
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
  /* stacking: a pinned window (VS Code, Notepad, Cheat Sheet) always stays on top; whatever you click or open comes to the front of all the others */
  function zOrder(w,auto){var all=[$('notepad')].concat(Object.keys(wins).map(function(k){return wins[k].el})).filter(Boolean);
    all.sort(function(a,b){return (+a.style.zIndex||55)-(+b.style.zIndex||55)});all.splice(all.indexOf(w),1);all.push(w);
    var pinOn=function(x){return x.id==='notepad'?vsPinned:!!winPin[x.id]};all=all.filter(function(x){return !pinOn(x)}).concat(all.filter(pinOn));
    all.forEach(function(x,i){x.style.zIndex=51+i});active=w;tkSync()}
  var active=null,vsPinned=store('vspin')==='1',winPin={};
  /* which windows are on screen, which one is in front, and what a click on its taskbar button or desktop icon does */
  function isVis(el){if(!el)return false;if(el.id==='notepad')return el.classList.contains('show')&&!el.classList.contains('docked');return !el.hidden&&!el.classList.contains('docked')}
  function topWin(){if(active&&isVis(active))return active;var t=null,tz=-1;[$('notepad')].concat(Object.keys(wins).map(function(k){return wins[k].el})).forEach(function(el){if(!isVis(el))return;var z=+el.style.zIndex||55;if(z>=tz){tz=z;t=el}});return t}
  function tkSync(){var t=topWin();Object.keys(wins).forEach(function(k){wins[k].tk.classList.toggle('on',wins[k].el===t)});var tv=$('tkVS');if(tv)tv.classList.toggle('on',!!t&&t.id==='notepad')}
  /* a double-click on a taskbar button counts as one click: its second click (detail 2) must not minimise the window the first one just brought up */
  function tkClick(el){return function(e){if(e&&e.detail>=2&&isVis(el)&&topWin()===el)return;activate(el)}}
  function activate(el,open,auto){if(!el)return;var isNp=el.id==='notepad',id=el.id;
    if(!isVis(el)){if(isNp){ML.showVS();zOrder(el,auto)}else{winOpen(id,auto);if(id==='drawWin')padFit();if(id==='binWin')binDraw();if(id==='guideWin')guideInit();if(id==='memeWin')picDraw()}return}
    if(open||topWin()!==el){zOrder(el,auto);return}
    if(isNp)window.vsDock(true);else winDock(id,true)}
  var np=$('notepad');if(np){np.addEventListener('pointerdown',function(){zOrder(np)},true);
    /* pin VS Code on top of the other windows */
    var pinB=document.createElement('button');pinB.type='button';pinB.id='npPin';pinB.innerHTML='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 1.5h6l-1 4 2.5 2.5h-9L6 5.5z" fill="currentColor"/><path d="M8 8v6.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
    function pinSync(){pinB.classList.toggle('on',vsPinned);pinB.setAttribute('aria-pressed',vsPinned?'true':'false');pinB.title=vsPinned?'Unpin (stop keeping VS Code on top)':'Pin on top (keep VS Code above other windows)';pinB.setAttribute('aria-label',pinB.title)}
    pinB.onclick=function(e){e.stopPropagation();vsPinned=!vsPinned;store('vspin',vsPinned?'1':'0');pinSync();zOrder(np)};
    var mn=$('npMin');if(mn)mn.parentNode.insertBefore(pinB,mn);pinSync();
    var tkv=$('tkVS');if(tkv)tkv.onclick=tkClick(np);
    var npWas=false;new MutationObserver(function(){var vis=isVis(np);if(vis&&!npWas)zOrder(np,true);else tkSync();npWas=vis}).observe(np,{attributes:true,attributeFilter:['class']})}
  function makeWin(id,title,icon,tk,w,h,o){o=o||{};var el=document.createElement('div');el.className='dwin';el.id=id;el.hidden=true;el.setAttribute('role','dialog');el.setAttribute('aria-label',title);
    el.innerHTML='<div class="dwh"><i>'+icon+'</i><span>'+esc(title)+'</span><button type="button" class="dmin" title="Minimise" aria-label="Minimise">_</button>'+(o.max?'<button type="button" class="dmax" title="Full screen" aria-label="Full screen">&#9633;</button>':'')+(o.noClose?'':'<button type="button" class="dx" title="Close" aria-label="Close">x</button>')+'</div><div class="dwb"></div><button type="button" class="dwr" tabindex="-1" aria-hidden="true"></button>';
    document.body.appendChild(el);var W={el:el,body:el.querySelector('.dwb'),tk:tk,placed:false,w:w,h:h};wins[id]=W;
    el.addEventListener('pointerdown',function(){zOrder(el)},true);
    var hd=el.querySelector('.dwh'),ox,oy,dr=false,ph=null;
    /* hold the title bar and drag to move the window, on laptops and phones alike; a strip of it always stays on screen */
    hd.addEventListener('pointerdown',function(e){if(e.target.closest('button')||el.classList.contains('max'))return;
      dr=true;var r=el.getBoundingClientRect();ox=e.clientX-r.left;oy=e.clientY-r.top;el.classList.add('sizing');try{hd.setPointerCapture(e.pointerId)}catch(z){}e.preventDefault()});
    hd.addEventListener('pointermove',function(e){if(!dr)return;var w=el.offsetWidth;
      el.style.left=Math.round(Math.max(Math.min(0,80-w),Math.min(innerWidth-80,e.clientX-ox)))+'px';el.style.top=Math.round(Math.max(0,Math.min(innerHeight-38-36,e.clientY-oy)))+'px'});
    ['pointerup','pointercancel'].forEach(function(n){hd.addEventListener(n,function(){if(dr){dr=false;el.classList.remove('sizing')}})});
    var g=el.querySelector('.dwr'),sx,sy,sw,sh,on=false;
    g.addEventListener('pointerdown',function(e){e.preventDefault();e.stopPropagation();var r=el.getBoundingClientRect();sx=e.clientX;sy=e.clientY;sw=r.width;sh=r.height;on=true;el.classList.add('sizing');g.setPointerCapture(e.pointerId)});
    g.addEventListener('pointermove',function(e){if(!on)return;var r=el.getBoundingClientRect();el.style.width=Math.max(Math.min(innerWidth<=700?180:240,innerWidth-16),Math.min(innerWidth-r.left-4,sw+e.clientX-sx))+'px';el.style.height=Math.max(150,Math.min(innerHeight-r.top-40,sh+e.clientY-sy))+'px'});
    g.addEventListener('pointercancel',function(){on=false;el.classList.remove('sizing')});
    g.addEventListener('pointerup',function(){on=false;el.classList.remove('sizing')});
    el.querySelector('.dmin').onclick=function(){winDock(id,true)};
    if(!o.noClose){el.querySelector('.dx').onclick=function(){winClose(id)};
      if(!o.noEsc)el.addEventListener('keydown',function(e){if(e.key==='Escape'&&!e.defaultPrevented&&!document.querySelector('.ctxm')){winClose(id)}})}
    if(o.max){el.querySelector('.dmax').onclick=function(){winMax(id)};hd.addEventListener('dblclick',function(e){if(!e.target.closest('button')&&innerWidth>700)winMax(id)})}
    tk.onclick=tkClick(el);
    return W}
  /* after rotating the phone or shrinking the window, pull any window back so its title bar can still be reached */
  addEventListener('resize',function(){Object.keys(wins).forEach(function(k){var el=wins[k].el;if(el.hidden||el.classList.contains('max')||!el.style.left)return;
    if(el.offsetWidth>innerWidth-8)el.style.width=Math.max(200,innerWidth-8)+'px';var l=parseFloat(el.style.left)||0,t=parseFloat(el.style.top)||0,w=el.offsetWidth;
    el.style.left=Math.round(Math.max(Math.min(0,80-w),Math.min(innerWidth-80,l)))+'px';el.style.top=Math.round(Math.max(0,Math.min(innerHeight-38-36,t)))+'px'})});
  function vsFront(){if(np)zOrder(np)}
  function openVS(k){ML.openInVS(k);vsFront()}
  function winOpen(id,auto){var W=wins[id],el=W.el,was=isVis(el);el.hidden=false;el.classList.remove('docked');W.tk.hidden=false;
    if(!W.placed&&W.place){W.placed=true;W.place()}
    if(!W.placed){W.placed=true;var w=Math.min(W.w,innerWidth-24),h=Math.min(W.h,innerHeight-110);el.style.width=w+'px';el.style.height=h+'px';
      var n=Object.keys(wins).indexOf(id);/* cascade a little, but never past the screen edge, so every part of the window can be reached */
      el.style.left=Math.max(8,Math.min(innerWidth-w-8,Math.round((innerWidth-w)/2)+(n%6)*28))+'px';el.style.top=Math.max(8,Math.min(innerHeight-38-h-8,Math.round((innerHeight-38-h)/2)-20+(n%6)*24))+'px'}
    zOrder(el,auto);if(was)return;el.classList.remove('flash');void el.offsetWidth;el.classList.add('flash');var f=el.querySelector('[data-focus]')||el.querySelector('.dx');if(f&&f.tagName==='INPUT'&&(innerWidth<=700||matchMedia('(hover: none)').matches))f=el.querySelector('.dx')||el.querySelector('.dmin');if(f)f.focus({preventScroll:true})}
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
  WS.place=function(){var c=cell(),n=appCols();if(innerWidth<=700){var pl=Math.min(c.x0+n*c.w+4,Math.round(innerWidth*0.45));WS.el.style.left=pl+'px';WS.el.style.top='0px';WS.el.style.width=(innerWidth-pl)+'px';WS.el.style.height=(innerHeight-38)+'px';return}var l=Math.min(c.x0+n*c.w+12,Math.round(innerWidth*0.3));WS.el.style.left=l+'px';WS.el.style.top='8px';WS.el.style.width=Math.max(320,innerWidth-l-10)+'px';WS.el.style.height=Math.max(220,innerHeight-38-16)+'px'};
  var WSBASE=980;
  function wsZoom(){var w=wsBody.clientWidth;if(!w)return;var base=innerWidth<=700?innerWidth:WSBASE,nz=w&&w<base*0.97?String(Math.round(w/base*1000)/1000):'';if(nz!==wsIn.style.zoom)wsIn.style.zoom=nz}
  /* keep your reading position when the window is resized, made full screen or rescaled:
     remember which bit of the lesson sits in the middle of the window, and put it back there afterwards */
  var bookmark=null,bmT=0;
  function wsRec(){var wr=wsBody.getBoundingClientRect();if(!wr.height||WS.el.hidden||WS.el.classList.contains('docked'))return;var z=parseFloat(wsIn.style.zoom)||1;
    if(wsBody.scrollTop<2){bookmark=null;return}
    var found=null;[0.4,0.55,0.25,0.7].some(function(f){var hit=document.elementFromPoint(wr.left+wr.width/2,wr.top+wr.height*f);
      if(!hit||!wsIn.contains(hit)||(hit.closest&&hit.closest('.loadwrap,.wnav,.wbtns')))return false; // sticky bars never move: useless as a bookmark
      /* landed in a gap between cards (the whole module): use the nearest card, banner or topic list instead, which keeps its shape when the window is resized */
      if(!(hit.closest&&hit.closest('.card,.banner,.idx'))){var y=wr.top+wr.height*f,best=null,bd=1e9;wsIn.querySelectorAll('section.phase .card,section.phase .banner,section.phase .idx').forEach(function(c){var r=c.getBoundingClientRect();if(!r.height)return;var dd=y<r.top?r.top-y:y>r.bottom?y-r.bottom:0;if(dd<bd){bd=dd;best=c}});if(best)hit=best}
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
    if(Math.abs(H-(+bg.dataset.h||0))<300&&Math.abs((wsIn.clientWidth||0)-(+bg.dataset.w||0))<40){bg.style.height=H+'px';return}
    bg.dataset.h=H;bg.style.height=H+'px';bg.innerHTML='';
    /* a natural-looking scatter ("blue noise"): random spots, but never too close to each other, so there are no
       clumps and no grid pattern. Never behind a lesson card or banner (they are see-through and it would smudge). */
    var W=wsIn.clientWidth||800,minD=W<600?125:180,k=0,
      z=parseFloat(getComputedStyle(wsIn).zoom)||1,wr=wsIn.getBoundingClientRect(),blocks=[];
    bg.dataset.w=W;
    wsIn.querySelectorAll('.card,.banner,.idx,.signoff,.marquee,.icons,footer,.loadwrap').forEach(function(el){var r=el.getBoundingClientRect();if(!r.width)return;
      /* a card may be sliding in right now: take off whatever slide offset it has at this moment, so this works at any time */
      var tf=getComputedStyle(el).transform,off=tf&&tf!=='none'?(parseFloat(tf.split(',')[5])||0)*z:0;
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
  wsIn.querySelectorAll('.wiz').forEach(function(w){var c=w.closest('.rv');if(c)c.classList.add('rvfade')});
  function wsFit(){wsZoom();wsLw();wsRestore();clearTimeout(decoT);decoT=setTimeout(decoFill,250)}
  if(window.ResizeObserver)new ResizeObserver(wsFit).observe(wsBody);else addEventListener('resize',wsFit);
  /* the lessons can change height without the window changing (fonts arriving, a quiz or demo opening):
     re-measure the decorations then too, so there is never empty space below the sign-off */
  (function(){var wr=wsIn.querySelector('.wrap'),again=function(){clearTimeout(decoT);decoT=setTimeout(decoFill,250)};
    if(wr&&window.ResizeObserver)new ResizeObserver(again).observe(wr);
    try{document.fonts&&document.fonts.ready.then(again)}catch(z){}})();
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
    $('labGo').onclick=function(){openLab()};
    var pgb=labIn.querySelector('.btns.pgb');if(pgb){var cb2=document.createElement('button');cb2.type='button';cb2.id='pgCheat';cb2.textContent='Cheat sheet';pgb.insertBefore(cb2,pgb.firstChild);cb2.onclick=function(){activate(CS.el,true)}}})();
  LAB.place=function(){if(innerWidth<=700){LAB.el.style.left='0px';LAB.el.style.top='0px';LAB.el.style.width=innerWidth+'px';LAB.el.style.height=(innerHeight-38)+'px';return} /* phones: the terminal starts with the whole width */
    var c=cell(),l=Math.min(c.x0+appCols()*c.w+40,Math.round(innerWidth*0.3)+28),w=Math.max(340,Math.min(1060,innerWidth-l-20));
    LAB.el.style.left=l+'px';LAB.el.style.top='22px';LAB.el.style.width=w+'px';LAB.el.style.height=Math.max(240,innerHeight-38-40)+'px'};
  var LABBASE=1000;
  function labZoom(){var w=labBody.clientWidth;if(!w)return;var nz=innerWidth>700&&w<LABBASE*0.97?String(Math.round(w/LABBASE*1000)/1000):'';if(nz!==labIn.style.zoom)labIn.style.zoom=nz}
  if(window.ResizeObserver)new ResizeObserver(labZoom).observe(labBody);else addEventListener('resize',labZoom);
  function openLab(auto){var was=isVis(LAB.el);activate(LAB.el,true,auto);labZoom();
    /* VS Code is the lab's editor: bring it along, in front */
    if(!was&&np&&np.classList.contains('show')&&!np.classList.contains('docked'))zOrder(np,true)}
  ML.openLab=openLab;
  /* a small "Top" button inside the workshop and the Practice Lab: it shows once you scroll down, and takes you back to the start */
  [[WS,wsBody],[LAB,labBody]].forEach(function(x){var W=x[0],bd=x[1],t=document.createElement('button');t.type='button';t.className='totop';t.hidden=true;t.innerHTML='&#9650; Top';t.title='Back to the top';t.setAttribute('aria-label','Back to the top');W.el.appendChild(t);
    t.onclick=function(){bd.scrollTo({top:0,behavior:'smooth'})};bd.addEventListener('scroll',function(){t.hidden=bd.scrollTop<500},{passive:true})});
  /* links to the practice lab (the Start menu, the lesson index) open the app */
  document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href="#t2-3b"],a[href="#p5"]');if(a)setTimeout(openLab,30)});

  /* browser: the address is locked to the workshop repo; Search opens it in a new tab */
  var BR=makeWin('brWin','Browser',I.br,tkBR,560,400,{max:true});
  BR.body.parentNode.insertBefore((function(){var d=document.createElement('div');d.className='brbar';
    d.innerHTML='<button type="button" class="brnav" disabled aria-label="Back">&#9664;</button><button type="button" class="brnav" disabled aria-label="Forward">&#9654;</button><label class="brurl" title="This address is locked">'+I.lock+'<input id="brUrl" readonly value="'+REPO+'" aria-label="Address (locked)"></label><button type="button" class="brgo" id="brGo" data-focus>Search</button>';return d})(),BR.body);
  BR.body.innerHTML='<div class="brpage"><div class="brlogo">Git<b>Hub</b> repo</div><p>This is the workshop\'s own repository on GitHub. Press <b>Search</b> to open it in a new tab.</p>'
    +'<div class="brcard"><span class="rpic">'+I.repo+'</span><div><b>nishik2811-cell / Git-GitHub-Workshop</b><small>The code for this whole workshop: one HTML file.</small></div></div><p class="brmsg" id="brMsg" role="status"></p></div>';
  function brSearch(){var a=document.createElement('a');a.href=REPO;a.target='_blank';a.rel='noopener';document.body.appendChild(a);a.click();a.remove();
    $('brMsg').innerHTML='Opened in a new tab. Nothing happened? <a href="'+REPO+'" target="_blank" rel="noopener">Open the repo</a>'}
  $('brGo').onclick=function(){if(brTabNow==='setup')brNewTab(SETUP);else brSearch()};

  /* Setup guide tab: the setup website shown right inside the Browser window.
     No internet, or it does not load: a message and an "Open in a new tab" button instead.
     A site can refuse to be shown inside another page, and the page cannot tell when that happens,
     so a slim bar under it always offers the new tab too. */
  var SETUP='https://first-things-first-roan.vercel.app/',brTabNow='repo',brTimer=0,brLoaded=false,brSized=false;
  function brNewTab(u){var a=document.createElement('a');a.href=u;a.target='_blank';a.rel='noopener';document.body.appendChild(a);a.click();a.remove()}
  (function(){var tb=document.createElement('div');tb.className='brtabs';tb.setAttribute('role','tablist');tb.setAttribute('aria-label','Browser tabs');
    tb.innerHTML='<button type="button" class="brtab on" data-t="repo" role="tab" aria-selected="true">'+I.repo+'<span>GitHub repo</span></button><button type="button" class="brtab" data-t="setup" role="tab" aria-selected="false">'+I.setup+'<span>Setup guide</span></button>';
    var bar=BR.el.querySelector('.brbar');bar.parentNode.insertBefore(tb,bar);
    tb.addEventListener('click',function(e){var b=e.target.closest('.brtab');if(b)brTab(b.getAttribute('data-t'))});
    var pg=BR.body.querySelector('.brpage');pg.id='brRepo';
    var sd=document.createElement('div');sd.id='brSetup';sd.hidden=true;
    sd.innerHTML='<div class="brframe"><div class="brfail" id="brFail" hidden role="status"><div class="brlogo">Setup <b>guide</b></div><p id="brFailMsg"></p>'
      +'<div class="brfbtns"><a class="brgo brnew" href="'+SETUP+'" target="_blank" rel="noopener">Open in a new tab</a><button type="button" class="brretry" id="brRetry">Try again</button></div></div></div>'
      +'<div class="brhint">Page blank? <a href="'+SETUP+'" target="_blank" rel="noopener">Open in a new tab</a></div>';
    BR.body.appendChild(sd);$('brRetry').onclick=brLoad})();
  function brFail(why){clearTimeout(brTimer);var f=$('brFrame');if(f)f.hidden=true;$('brFailMsg').textContent=why==='offline'?'No internet right now, so the Setup guide cannot load here. Connect to the internet and press Try again, or open it in a new tab later.':'The Setup guide did not load inside this window. Open it in a new tab instead.';$('brFail').hidden=false}
  function brLoad(){var fr=BR.body.querySelector('.brframe'),f=$('brFrame');$('brFail').hidden=true;clearTimeout(brTimer);brLoaded=false;
    if(f)f.remove();f=document.createElement('iframe');f.id='brFrame';f.title='Setup guide';f.setAttribute('referrerpolicy','no-referrer');
    f.setAttribute('sandbox','allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms');fr.insertBefore(f,fr.firstChild);
    if(navigator.onLine===false){brFail('offline');return}
    f.addEventListener('load',function(){if(f.getAttribute('src')){brLoaded=true;clearTimeout(brTimer)}});
    brTimer=setTimeout(function(){if(!brLoaded)brFail('slow')},10000);
    f.src=SETUP;
    /* a quick check that the site can be reached at all: fails straight away when offline */
    try{fetch(SETUP,{mode:'no-cors',cache:'no-store'}).catch(function(){brFail('offline')})}catch(e){}}
  function brTab(t){brTabNow=t;BR.el.querySelectorAll('.brtab').forEach(function(b){var on=b.getAttribute('data-t')===t;b.classList.toggle('on',on);b.setAttribute('aria-selected',on?'true':'false')});
    var setup=t==='setup';$('brRepo').hidden=setup;$('brSetup').hidden=!setup;BR.body.classList.toggle('brsetupon',setup);
    $('brUrl').value=setup?SETUP:REPO;$('brGo').textContent=setup?'Open':'Search';$('brGo').title=setup?'Open the Setup guide in a new tab':'Open the repo in a new tab';
    if(setup){if(!$('brFrame'))brLoad();
      /* a website needs room: the first time, make a small Browser window bigger (laptops) */
      if(!brSized&&innerWidth>700&&!BR.el.classList.contains('max')){brSized=true;var w=Math.min(1000,innerWidth-24),h=Math.min(720,innerHeight-60);if(BR.el.offsetWidth<w){BR.el.style.width=w+'px';BR.el.style.height=h+'px';BR.el.style.left=Math.max(8,Math.round((innerWidth-w)/2))+'px';BR.el.style.top=Math.max(8,Math.round((innerHeight-38-h)/2))+'px'}}}}
  addEventListener('offline',function(){if(brTabNow==='setup'&&!BR.el.hidden)brFail('offline')});
  addEventListener('online',function(){if(brTabNow==='setup'&&!$('brFail').hidden)brLoad()});
  function openSetup(){winOpen('brWin');brTab('setup')}
  ML.openSetup=openSetup;
  /* Start menu: a Setup guide entry under "Setup and installation" */
  (function(){var L=$('smList');if(!L)return;var d=document.createElement('div');d.className='smi';
    d.innerHTML='<a class="smp" id="smSetup" href="'+SETUP+'"><b class="smweb">'+I.setup+'</b>Setup guide (website)</a>';L.appendChild(d);
    d.querySelector('a').addEventListener('click',function(e){e.preventDefault();$('startMenu').hidden=true;openSetup()})})();
  /* the Start menu list scrolls when it is taller than the screen (9 modules + more);
     on laptops the side menus are placed against the screen, so the scrolling list cannot cut them off */
  (function(){var sm=$('startMenu'),L=$('smList');if(!sm||!L)return;
    function fit(){if(sm.hidden)return;L.style.maxHeight='';var other=sm.offsetHeight-L.offsetHeight,room=innerHeight-38-other-6;L.style.maxHeight=Math.max(120,room)+'px'}
    $('startBtn').addEventListener('click',function(){setTimeout(fit,0)});addEventListener('resize',fit);
    var wide=function(){return innerWidth>700&&matchMedia('(hover: hover)').matches};
    L.addEventListener('mouseover',function(e){var it=e.target.closest&&e.target.closest('.smi');if(!it||!wide())return;var sub=it.querySelector('.smsub');if(!sub)return;
      var r=it.getBoundingClientRect(),m=sm.getBoundingClientRect();sub.style.position='fixed';sub.style.left=(m.right-3)+'px';sub.style.bottom='auto';
      sub.style.display='block';var h=sub.offsetHeight;sub.style.display='';sub.style.top=Math.max(6,Math.min(r.bottom-h+1,innerHeight-38-h-4))+'px'});
    L.addEventListener('scroll',function(){L.querySelectorAll('.smi:hover').forEach(function(x){x.dispatchEvent(new MouseEvent('mouseover',{bubbles:true}))})},{passive:true})})();
  $('brUrl').addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();brSearch()}});
  ['paste','cut','drop'].forEach(function(n){$('brUrl').addEventListener(n,function(e){e.preventDefault()})});


  /* drawing notepad */
  var DW=makeWin('drawWin','Notepad',I.pad,tkDraw,580,430);
  /* a pin in the title bar keeps a window above the others (Notepad, Cheat Sheet), like VS Code's pin; it is remembered */
  function addPin(W,key,name){var id=W.el.id;winPin[id]=store(key)==='1';var b=document.createElement('button');b.type='button';b.className='dpin';
    b.innerHTML='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 1.5h6l-1 4 2.5 2.5h-9L6 5.5z" fill="currentColor"/><path d="M8 8v6.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
    function sync(){var on=winPin[id];b.classList.toggle('on',on);b.setAttribute('aria-pressed',on?'true':'false');b.title=on?'Unpin (stop keeping '+name+' on top)':'Pin on top (keep '+name+' above other windows)';b.setAttribute('aria-label',b.title)}
    b.onclick=function(e){e.stopPropagation();winPin[id]=!winPin[id];store(key,winPin[id]?'1':'0');sync();zOrder(W.el)};
    var mn=W.el.querySelector('.dwh .dmin');mn.parentNode.insertBefore(b,mn);sync()}
  addPin(DW,'padpin','Notepad');
  var PCOL=[['#16327a','Blue ink'],['#222222','Black'],['#e8336d','Pink'],['#2e9e4f','Green'],['#e07f22','Orange'],['#7653d1','Purple']],PSZ=[[2,'Thin'],[5,'Medium'],[11,'Thick']];
  DW.body.classList.add('padb');
  DW.body.innerHTML='<div class="padtools" role="toolbar" aria-label="Drawing tools"><span class="padgrp">'
    +'<button type="button" class="padt on" data-tool="pen" aria-pressed="true" title="Pen">&#9998; Pen</button><button type="button" class="padt" data-tool="er" aria-pressed="false" title="Eraser">&#9003; Eraser</button></span>'
    +'<span class="padgrp">'+PCOL.map(function(c,i){return '<button type="button" class="padc'+(i?'':' on')+'" data-col="'+c[0]+'" style="background:'+c[0]+'" title="'+c[1]+'" aria-label="'+c[1]+'" aria-pressed="'+(i?'false':'true')+'"></button>'}).join('')+'</span>'
    +'<span class="padgrp">'+PSZ.map(function(z,i){return '<button type="button" class="padz'+(i===1?' on':'')+'" data-sz="'+z[0]+'" title="'+z[1]+'" aria-label="'+z[1]+' line" aria-pressed="'+(i===1)+'"><i style="width:'+(z[0]+3)+'px;height:'+(z[0]+3)+'px"></i></button>'}).join('')+'</span>'
    +'<span class="padgrp"><button type="button" class="padt" data-act="undo" title="Undo (Ctrl+Z)">&#8630; Undo</button><button type="button" class="padt" data-act="clear" title="Clear the page">Clear</button><button type="button" class="padt pads" data-act="save" title="Save the drawing: on the Mini laptop, on your device, or both">Save</button></span></div>'
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
    else if(b.dataset.act==='save')padSave()});
  /* Save: download the picture to your own device, save it as a file on the Mini laptop (in any folder, so you can
     git add, commit and push it like any other file), or both */
  var padDir=null;
  function padPng(){var o=document.createElement('canvas');o.width=cv.width;o.height=cv.height;var g=o.getContext('2d');g.fillStyle='#ffffff';g.fillRect(0,0,o.width,o.height);g.drawImage(cv,0,0);return o.toDataURL('image/png')}
  function padName(v){v=String(v||'').trim().replace(/\s+/g,'-').replace(/[^A-Za-z0-9_.-]/g,'').replace(/\.png$/i,'').replace(/^\.+/,'');return (v||'drawing')+'.png'}
  function padDirs(){var st=S();return Object.keys(st.dirs).filter(function(d){return d===HOME||(d.indexOf(HOME+'/')===0&&!/\/\./.test(d.slice(HOME.length)))}).sort()}
  /* the same picture always gets the same id, so Git sees two identical drawings as equal, like real Git does */
  function padKey(b64){var h=2166136261;for(var i=0;i<b64.length;i++){h^=b64.charCodeAt(i);h=Math.imul(h,16777619)}return 'draw:'+(h>>>0).toString(16)+':'+b64.length}
  function padDownload(url,name){var a=document.createElement('a');a.download=name;a.href=url;document.body.appendChild(a);a.click();a.remove()}
  function padToLaptop(url,dir,name){var st=S();if(!st.dirs[dir])dir=HOME;name=ML.uniq(dir,name);var b64=url.slice(url.indexOf(',')+1),abs=dir+'/'+name;
    st.files[abs]=ML.binReg(padKey(b64),b64,'image/png',name);padDir=dir;ML.render();return abs}
  function padSave(){var st=S(),dirs=padDirs(),cur=padDir&&st.dirs[padDir]?padDir:HOME;
    var opts=dirs.map(function(d){return '<option value="'+esc(d)+'"'+(d===cur?' selected':'')+'>'+esc(d===HOME?'Desktop (~)':'~'+d.slice(HOME.length))+'</option>'}).join('');
    var html='<div class="padsv"><label>File name<input id="padSvN" type="text" value="'+esc(ML.uniq(cur,'drawing.png'))+'" spellcheck="false" autocomplete="off" aria-label="File name"></label>'
      +'<label>Folder on the Mini laptop<select id="padSvD" aria-label="Folder on the Mini laptop">'+opts+'</select></label>'
      +'<p>Saved on the <b>Mini laptop</b>, it becomes a file you can open, move into a repo folder, then <code>git add</code>, <code>git commit</code> and <code>git push</code>. <b>My device</b> downloads it to your real computer or phone.</p></div>';
    function go(where){var url=padPng(),name=padName($('padSvN').value),dir=$('padSvD').value,msg=[],abs=null;
      if(where!=='device'){abs=padToLaptop(url,dir,name);msg.push('On the Mini laptop: <b>'+esc(tilde(dirname(abs))+'/'+base(abs)).replace('~ (desktop)/','~/')+'</b>')}
      if(where!=='laptop'){padDownload(url,abs?base(abs):name);msg.push('On your device: <b>'+esc(abs?base(abs):name)+'</b> (in your Downloads)')}
      var btns=[{t:'OK'}];if(abs)btns.unshift({t:dirname(abs)===HOME?'Show on desktop':'Open the folder',fn:function(){openFolder(dirname(abs));fxSel=abs;fxSels={};fxSels[abs]=1;fxDraw()}});
      window.gitPop('ok','SAVED',msg.join('<br>')+(abs?'<br><br>To put it on GitHub: in that repo folder run <code>git add '+esc(base(abs))+'</code>, then commit and push.':''),btns)}
    window.gitPop('ok','SAVE DRAWING',html,[{t:'Save on Mini laptop',fn:function(){go('laptop')}},{t:'Save on my device',fn:function(){go('device')}},{t:'Both',fn:function(){go('both')}},{t:'Cancel'}]);
    var bx=document.querySelector('#ov .dlg');if(bx)bx.classList.add('padsvdlg');
    var n=$('padSvN');n.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();var f=$('ovB').firstChild;if(f)f.click()}});
    n.focus({preventScroll:true});n.setSelectionRange(0,n.value.replace(/\.png$/i,'').length)}
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
  var HHTASK='TASK: upload this folder to GitHub, without uploading the secret key\n\n'
    +'1. Open the Practice Lab and go into this folder:   cd ~/hehehe\n'
    +'2. Look at everything, hidden files too:   ls -a\n   See .env? It holds a secret key (a fake one). It must never reach GitHub.\n'
    +'3. Turn the folder into a Git repo:   git init\n'
    +'4. Tell Git who you are (if you have not yet):\n   git config --global user.name "Your Name"\n   git config --global user.email "you@example.com"\n'
    +'5. Ask Git what it sees:   git status\n   Uh oh: .env is in the list, so git add . would save it.\n'
    +'6. Make Git ignore it: create a .gitignore file with .env in it\n   echo ".env" > .gitignore\n'
    +'7. Ask again:   git status\n   .env is gone from the list, and .gitignore is new.\n'
    +'8. Stage everything and save it:   git add .   then   git commit -m "Add memes"\n'
    +'9. Connect a GitHub repo:   git remote add origin https://github.com/you/hehehe.git\n   (in Real GitHub mode, use your own repo link)\n'
    +'10. Upload it:   git push -u origin main\n\n'
    +'Done when GitHub has the 5 memes, README.md, task.txt and .gitignore, and NOT .env.\n';
  var HHREADME='# hehehe\n\nA folder of Git memes from the Git & GitHub Workshop.\n\n'
    +'- google-drive-crimes.jpg: where do you save your code?\n- final_final_FINAL_v3.jpg: file names before Git\n- git-out-alive.jpg: in case of fire\n'
    +'- star-forks.jpg: may the fork be with you\n- bathroom-tile-commit-streak.jpg: that commit streak\n\n'
    +'Made with git add, git commit and git push.\n';
  var HHENV='# a secret: never upload this file\nMEME_API_KEY=sk-fake-4f9a2c7e1b3d-not-a-real-key\n';
  /* hehehe is a real folder on the Mini laptop: the pictures are files you can open, move, copy, delete, git add and git push */
  var HH=HOME+'/hehehe',memeKeys={};
  window.mlSeed=function(st){var names=MEMES.map(function(m){return m[0]}).filter(function(n){return memeKeys[n]}).concat(Object.keys(memeKeys).filter(function(n){return !MEMES.some(function(m){return m[0]===n})}));
    if(!names.length)return;st.dirs[HH]=1;names.forEach(function(n){st.files[HH+'/'+n]=memeKeys[n]});
    /* a small task to practise on: upload this folder to GitHub, without leaking the (fake) key */
    st.files[HH+'/task.txt']=HHTASK;st.files[HH+'/README.md']=HHREADME;st.files[HH+'/.env']=HHENV};
  /* the pictures are packed into the page after this script, so read them once the page has loaded */
  function memesLoad(){document.querySelectorAll('script.memePack').forEach(function(sc){var n=sc.getAttribute('data-name');if(!memeKeys[n])memeKeys[n]=ML.binReg('meme:'+n,sc.textContent,'image/jpeg',n)});
    var st=S();if(!st.dirs[HH]){window.mlSeed(st);ML.render()}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',memesLoad);else memesLoad();
  function escA(t){return esc(t).replace(/"/g,'&quot;')}
  function altOf(abs){var m=MEMES.filter(function(x){return x[0]===base(abs)})[0];return m?m[1]:base(abs)}
  function isPicFile(k){var st=S();return (k in st.files)&&ML.isPic(st.files[k])}
  /* the picture viewer (Photos): opens a picture, the arrows go through the other pictures in the same folder */
  var MW=makeWin('memeWin','Photos',I.pic,tkMeme,660,480,{max:true}),picAt=null;
  MW.body.classList.add('mmb');
  function picList(){if(!picAt)return [];var d=dirname(picAt),st=S();return Object.keys(st.files).filter(function(f){return dirname(f)===d&&ML.isPic(st.files[f])}).sort(function(a,b){return a.toLowerCase()<b.toLowerCase()?-1:1})}
  function picDraw(){var st=S();if(!picAt||!(picAt in st.files)||!ML.isPic(st.files[picAt])){var l0=picList();picAt=l0[0]||null}
    if(!picAt){MW.body.innerHTML='<div class="mmempty">This picture is not there any more.</div>';return}
    var l=picList(),i=l.indexOf(picAt);MW.el.querySelector('.dwh span').textContent=base(picAt);tkMeme.querySelector('span').textContent=base(picAt);
    MW.body.innerHTML='<div class="mmbar"><button type="button" class="mmbtn" data-mm="back">&#9664; Open folder</button><span>'+esc(tilde(picAt))+' <small>('+(i+1)+' of '+l.length+')</small></span><button type="button" class="mmbtn" data-mm="prev" aria-label="Previous picture"'+(l.length<2?' disabled':'')+'>&larr;</button><button type="button" class="mmbtn" data-mm="next" aria-label="Next picture"'+(l.length<2?' disabled':'')+'>&rarr;</button></div><div class="mmview"><img src="'+ML.binUrl(st.files[picAt])+'" alt="'+escA(altOf(picAt))+'"></div>'}
  function picOpen(k){picAt=k;activate(MW.el,true);picDraw();var f=MW.body.querySelector('[data-mm="next"]');if(f)f.focus({preventScroll:true})}
  function picStep(d){var l=picList();if(l.length<2)return;picAt=l[(l.indexOf(picAt)+d+l.length)%l.length];picDraw()}
  /* open a file the way a desktop would: pictures in Photos, everything else in VS Code */
  function openFile(k){if(S().dirs[k]){openFolder(k);return}if(isPicFile(k))picOpen(k);else openVS(k)}
  MW.body.addEventListener('click',function(e){var b=e.target.closest('[data-mm]');if(!b)return;var a=b.getAttribute('data-mm');if(a==='back'){if(picAt)openFolder(dirname(picAt))}else picStep(a==='next'?1:-1)});
  MW.el.addEventListener('keydown',function(e){if(!picAt)return;if(e.key==='ArrowRight'){e.preventDefault();picStep(1)}else if(e.key==='ArrowLeft'){e.preventDefault();picStep(-1)}else if(e.key==='Backspace'){e.preventDefault();openFolder(dirname(picAt))}});


  /* ---------- File Explorer: opening a folder shows what is inside (folders in folders too); "Open with VS Code" edits it ---------- */
  var FX=makeWin('fxWin','File Explorer',I.folder,tkFx,620,440,{max:true}),fxDir=HOME,fxSel=null,fxSels={},fxSelMode=false,fxRen=null,fxTap={k:null,t:0},fxPtr='mouse',fxMarq=null;
  FX.body.classList.add('fxb');
  function fxItems(){var st=S(),o=[];
    Object.keys(st.dirs).filter(function(d){return d!==fxDir&&dirname(d)===fxDir}).forEach(function(d){o.push({k:d,n:base(d),dir:true,repo:!!(st.repos&&st.repos[d])})});
    Object.keys(st.files).filter(function(f){return dirname(f)===fxDir}).forEach(function(f){o.push({k:f,n:base(f),mark:ML.gitMark(f)})});
    return o.sort(function(a,b){return a.dir!==b.dir?(a.dir?-1:1):a.n.toLowerCase()<b.n.toLowerCase()?-1:1})}
  function fxDraw(){if(FX.el.hidden||fxRen)return;var st=S();while(fxDir!==HOME&&!st.dirs[fxDir])fxDir=dirname(fxDir);
    var list=fxItems(),title=fxDir===HOME?'Home (desktop)':base(fxDir);FX.el.querySelector('.dwh span').textContent=title;FX.el.setAttribute('aria-label',title);tkFx.querySelector('span').textContent=title;
    var path='<span class="fxcrumb" data-go="'+esc(HOME)+'">~</span>';var parts=fxDir===HOME?[]:fxDir.slice(HOME.length+1).split('/'),acc=HOME;
    parts.forEach(function(x){acc+='/'+x;path+=' / <span class="fxcrumb" data-go="'+esc(acc)+'">'+esc(x)+'</span>'});
    FX.body.innerHTML='<div class="fxbar"><button type="button" class="mmbtn" data-fx="up"'+(fxDir===HOME?' disabled':'')+' aria-label="Up one folder" title="Up one folder">&#8593; Up</button><div class="fxpath">'+path+'</div><button type="button" class="mmbtn fxcp" data-fx="copypath" title="Copy this location (paste it after cd in the terminal)" aria-label="Copy this folder location">&#128203; Copy path</button>'
      +'<button type="button" class="mmbtn" data-fx="newdir" title="New folder">+ Folder</button><button type="button" class="mmbtn" data-fx="newfile" title="New file">+ File</button>'
      +'<button type="button" class="mmbtn" data-fx="vs" title="Open this folder in VS Code">VS Code</button></div>'
      +(st.repos&&st.repos[fxDir]?'<div class="fxrepo">This folder is a <b>Git repo</b>.</div>':'')
      +(list.length?'<div class="mmgrid fxgrid">'+list.map(function(it){return '<button type="button" class="mmt fxt'+(fxSels[it.k]?' sel':'')+(inClip(it.k)?' cut':'')+'" data-k="'+esc(it.k)+'" title="'+esc(it.n)+'"><span class="fxic">'+(it.dir?I.folder:isPicFile(it.k)?'<img class="fxthumb" src="'+ML.binUrl(S().files[it.k])+'" alt="">':I.file)
        +(it.repo?'<b class="dbadge bU" style="background:#e8336d">git</b>':it.mark?'<b class="dbadge b'+it.mark+'">'+(it.mark==='C'?'!':it.mark)+'</b>':'')+'</span><span class="mmn">'+esc(it.n)+'</span></button>'}).join('')+'</div>'
        :'<div class="mmempty">This folder is empty. Right-click (or long-press) for <b>New folder</b> or <b>New file</b>.</div>')
      +'<div class="fxfoot">'+list.length+' item'+(list.length===1?'':'s')+'</div>';fxSelBar()}
  function fxList(){return fxItems().map(function(x){return x.k}).filter(function(k){return fxSels[k]})}
  function fxMark(){FX.body.querySelectorAll('.fxt').forEach(function(b){b.classList.toggle('sel',!!fxSels[b.getAttribute('data-k')])});fxSelBar()}
  function fxClear(){fxSels={};fxSel=null;fxSelMode=false;fxMark()}
  function fxAll(){fxSels={};fxItems().forEach(function(x){fxSels[x.k]=1});fxMark()}
  /* the selection bar inside the explorer: only in Select mode on phones */
  function fxSelBar(){var old=FX.body.querySelector('.selbar');var l=fxList();if(!fxSelMode){if(old)old.remove();return}
    var bar=old||document.createElement('div');bar.className='selbar fxsb';bar.setAttribute('role','toolbar');
    bar.innerHTML='<b>'+l.length+' selected</b><button type="button" data-sb="open"'+(l.length?'':' disabled')+'>Open</button><button type="button" data-sb="cut"'+(l.length?'':' disabled')+'>Cut</button><button type="button" data-sb="copy"'+(l.length?'':' disabled')+'>Copy</button>'
      +'<button type="button" data-sb="del"'+(l.length?'':' disabled')+'>Delete</button><button type="button" data-sb="all">Select all</button><button type="button" data-sb="done">Done</button>';
    if(!old){var bar2=FX.body.querySelector('.fxbar');bar2.parentNode.insertBefore(bar,bar2.nextSibling)}}
  function openFolder(d){fxDir=d;fxSel=null;fxSels={};fxSelMode=false;activate(FX.el,true);fxDraw()}
  function fxOpen(k){var st=S();if(st.dirs[k]){fxDir=k;fxSel=null;fxSels={};fxSelMode=false;fxDraw();return}openFile(k)}
  function fxRename(k,isNew){var b=FX.body.querySelector('.fxt[data-k="'+cssq(k)+'"]');if(!b)return;fxRen=k;fxSel=k;
    var lab=b.querySelector('.mmn'),inp=document.createElement('input');inp.className='dren';inp.value=base(k);inp.setAttribute('aria-label','New name');inp.spellcheck=false;inp.autocapitalize='off';lab.replaceWith(inp);
    var dot=inp.value.lastIndexOf('.');inp.focus();inp.setSelectionRange(0,dot>0&&!S().dirs[k]?dot:inp.value.length);var done=false;
    function finish(ok){if(done)return;var v=inp.value.trim();
      if(ok&&v!==base(k)){if(!ML.okName(v)){inp.classList.add('bad');inp.title='Use letters, numbers, dots, dashes or underscores. No spaces.';inp.focus();return}
        var r=ML.fsRename(k,dirname(k)+'/'+v);if(r.err){inp.classList.add('bad');popWarn('Cannot rename',r.err);return}
        done=true;fxRen=null;keyMoved(k,r.abs);fxSel=r.abs;fxSels={};fxSels[r.abs]=1;say((isNew?'Named it ':'Renamed '+esc(base(k))+' to ')+esc(v)+'.');ML.render();fxDraw();return}
      done=true;fxRen=null;fxDraw()}
    inp.addEventListener('keydown',function(e){e.stopPropagation();if(e.key==='Enter'){e.preventDefault();finish(true)}else if(e.key==='Escape'){e.preventDefault();finish(false)}});
    inp.addEventListener('blur',function(){setTimeout(function(){if(!done&&fxRen===k)finish(true)},0)});
    ['pointerdown','click','dblclick','contextmenu'].forEach(function(n){inp.addEventListener(n,function(e){e.stopPropagation()})})}
  function fxNew(dir){var name=ML.uniq(fxDir,dir?'new-folder':'new-file.txt'),r=ML.fsNew(fxDir+'/'+name,dir);if(r.err)return popWarn('Cannot create',r.err);
    say('Created '+(dir?'folder ':'')+esc(tilde(r.abs))+'.');fxSel=r.abs;fxSels={};fxSels[r.abs]=1;ML.render();fxDraw();fxRename(r.abs,true)}
  function fxDelete(k){delMany([k])}
  function fxMenu(k,x,y){var st=S();
    if(!k){ML.ctxMenu(x,y,[{t:'New folder',fn:function(){fxNew(true)}},{t:'New file',fn:function(){fxNew(false)}},'-',{t:'Paste',k:'Ctrl+V',dis:!canPasteNow(),fn:function(){paste(fxDir)}},
        {t:'Select all',k:'Ctrl+A',fn:fxAll},{t:'Open with VS Code',fn:function(){openVS(fxDir)}},{t:'Refresh',k:'F5',fn:fxDraw}]);return}
    var cur=fxList();if(fxSels[k]&&cur.length>1){fxSel=k;multiMenu(cur,x,y,'fx');return}
    fxSel=k;fxSels={};fxSels[k]=1;fxMark();var isDir=!!st.dirs[k];
    var touchSel=fxPtr!=='mouse'?[{t:'Select',fn:function(){fxSelMode=true;fxSels={};fxSels[k]=1;fxMark()}}]:[];
    ML.ctxMenu(x,y,[{t:'Open',fn:function(){fxOpen(k)}},{t:'Open with VS Code',fn:function(){openVS(k)}}].concat(touchSel,['-',
      {t:'Cut',k:'Ctrl+X',fn:function(){setClip('cut',[k])}},{t:'Copy',k:'Ctrl+C',fn:function(){setClip('copy',[k])}},
      {t:'Paste into folder',dis:!(isDir&&canPasteNow()),fn:function(){paste(k)}},'-',
      {t:'Rename',k:'F2',fn:function(){fxRename(k)}},{t:'Delete',k:'Del',fn:function(){fxDelete(k)}}]))}
  FX.body.addEventListener('pointerdown',function(e){fxPtr=e.pointerType||'mouse'},true);
  /* drag a box over empty space in the folder to select everything inside it */
  FX.body.addEventListener('pointerdown',function(e){if(fxRen||(e.button!==0&&e.pointerType==='mouse'))return;if(e.target.closest('.fxt,.fxbar,.selbar,input'))return;var g=e.target.closest('.fxgrid,.mmempty,.fxfoot')||(e.target===FX.body?FX.body:null);if(!g)return;
    var add=e.ctrlKey||e.metaKey;if(!add&&!fxSelMode){fxSels={};fxSel=null;fxMark()}var base={};Object.keys(fxSels).forEach(function(k){base[k]=1});
    var box=document.createElement('div');box.className='marq';box.hidden=true;FX.body.appendChild(box);fxMarq={sx:e.clientX,sy:e.clientY,box:box,base:base,id:e.pointerId,on:false}});
  FX.body.addEventListener('pointermove',function(e){if(!fxMarq||e.pointerId!==fxMarq.id)return;var mx=e.clientX,my=e.clientY,m=fxMarq;
    if(!m.on){if(Math.abs(mx-m.sx)+Math.abs(my-m.sy)<8)return;m.on=true;m.box.hidden=false;try{FX.body.setPointerCapture(e.pointerId)}catch(z){}}
    var br=FX.body.getBoundingClientRect(),l=Math.min(mx,m.sx),t=Math.min(my,m.sy),r=Math.max(mx,m.sx),bt=Math.max(my,m.sy);
    m.box.style.left=(l-br.left+FX.body.scrollLeft)+'px';m.box.style.top=(t-br.top+FX.body.scrollTop)+'px';m.box.style.width=(r-l)+'px';m.box.style.height=(bt-t)+'px';
    var nx={};Object.keys(m.base).forEach(function(k){nx[k]=1});FX.body.querySelectorAll('.fxt').forEach(function(ic){var q=ic.getBoundingClientRect();if(q.left<r&&q.right>l&&q.top<bt&&q.bottom>t)nx[ic.getAttribute('data-k')]=1});fxSels=nx;fxMark()});
  ['pointerup','pointercancel'].forEach(function(n){FX.body.addEventListener(n,function(e){if(fxMarq&&e.pointerId===fxMarq.id){var was=fxMarq.on;fxMarq.box.remove();fxMarq=null;if(was)FX.body._marqUntil=Date.now()+300}})});
  FX.body.addEventListener('click',function(e){if(fxRen)return;var c=e.target.closest('[data-go]');if(c){fxDir=c.getAttribute('data-go');fxSel=null;fxSels={};fxSelMode=false;fxDraw();return}
    var sb=e.target.closest('.selbar [data-sb]');if(sb){var w2=sb.getAttribute('data-sb'),l=fxList();if(w2==='open')openMany(l);else if(w2==='cut')setClip('cut',l);else if(w2==='copy')setClip('copy',l);else if(w2==='del')delMany(l);else if(w2==='all'){fxAll();return}if(w2==='done'||w2==='open'||w2==='del')fxClear();return}
    var a=e.target.closest('[data-fx]');if(a){var w=a.getAttribute('data-fx');if(w==='copypath'){var t=fxDir===HOME?'~':'~'+fxDir.slice(HOME.length),ok=function(){a.innerHTML='&#10003; Copied!';setTimeout(function(){if(a.isConnected)a.innerHTML='&#128203; Copy path'},1400)},old=function(){var ta=document.createElement('textarea');ta.value=t;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy')}catch(z){}ta.remove();ok()};
      try{if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(t).then(ok,old);else old()}catch(z){old()}return}if(w==='up'&&fxDir!==HOME){var was=fxDir;fxDir=dirname(fxDir);fxSels={};fxSels[was]=1;fxSel=was;fxSelMode=false;fxDraw()}else if(w==='newdir')fxNew(true);else if(w==='newfile')fxNew(false);else if(w==='vs')openVS(fxDir);return}
    var t=e.target.closest('.fxt');if(!t){if(FX.body._marqUntil&&Date.now()<FX.body._marqUntil)return;if(!fxSelMode&&!e.ctrlKey&&!e.metaKey){fxSels={};fxSel=null;fxMark()}return}
    var k=t.getAttribute('data-k'),now=Date.now();
    /* Ctrl/Cmd-click (or Select mode on a phone) adds or removes; Shift-click selects a range */
    if(fxSelMode||((e.ctrlKey||e.metaKey)&&e.detail<2)){if(fxSels[k])delete fxSels[k];else fxSels[k]=1;fxSel=k;fxMark();return}
    if(e.shiftKey&&fxSel){var o=fxItems().map(function(x){return x.k}),i0=o.indexOf(fxSel),i1=o.indexOf(k);if(i0>=0&&i1>=0){fxSels={};o.slice(Math.min(i0,i1),Math.max(i0,i1)+1).forEach(function(x){fxSels[x]=1});fxMark();return}}
    /* one click selects; double-click (double-tap, or Enter) opens */
    var open=e.detail===0||e.detail>=2||(fxPtr!=='mouse'&&fxTap.k===k&&now-fxTap.t<600);
    if(open){fxTap={k:null,t:0};var l2=fxList();if(e.detail===0&&l2.length>1&&fxSels[k]){openMany(l2);return}fxOpen(k);return}fxTap={k:k,t:now};fxSel=k;fxSels={};fxSels[k]=1;fxMark()});
  ML.longPress(FX.body,function(t){return !(t.closest&&(t.closest('input')||t.closest('.fxbar')))},function(e){var t=e.target.closest&&e.target.closest('.fxt');fxMenu(t?t.getAttribute('data-k'):null,e.clientX,e.clientY)});
  FX.el.addEventListener('keydown',function(e){if(fxRen||(e.target.closest&&e.target.closest('input')))return;var l=fxList(),k=l.length===1?l[0]:fxSel,many=l.length>1;
    if(e.key==='Backspace'&&fxDir!==HOME){e.preventDefault();var was=fxDir;fxDir=dirname(fxDir);fxSels={};fxSels[was]=1;fxSel=was;fxDraw()}
    else if(e.key==='F2'&&k&&!many){e.preventDefault();fxRename(k)}else if(e.key==='Delete'&&l.length){e.preventDefault();delMany(l)}else if(e.key==='F5'){e.preventDefault();fxDraw()}
    else if(e.key==='Escape'&&(l.length||fxSelMode)){e.preventDefault();fxClear()}
    else if((e.ctrlKey||e.metaKey)&&!e.altKey&&(e.key==='a'||e.key==='A')){e.preventDefault();fxAll()}
    else if((e.ctrlKey||e.metaKey)&&!e.altKey&&l.length&&(e.key.toLowerCase()==='c'||e.key.toLowerCase()==='x')){e.preventDefault();setClip(e.key.toLowerCase()==='x'?'cut':'copy',l)}
    else if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='v'){e.preventDefault();paste(k&&!many&&S().dirs[k]?k:fxDir)}});

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
  var pos={},sel=null,sels={},selMode=false,clip=null,renaming=null,lastSig='';
  function applyLook(){desk.classList.toggle('small',view==='small');desk.style.backgroundImage='url('+wallpaper(wp)+')';
    html.classList.remove('th-green','th-pink','th-purple','th-orange');if(theme!=='blue')html.classList.add('th-'+theme)}
  applyLook();
  function items(){var s=S(),bin=s.bin||[],o=[{k:'app:ws',n:'Workshop',ic:I.ws,app:'ws'},{k:'app:lab',n:'Practice Lab',ic:I.lab,app:'lab'},{k:'app:cheat',n:'Cheat Sheet',ic:I.cheat,app:'cheat'},{k:'app:vs',n:'VS Code',ic:I.vs,app:'vs'},{k:'app:br',n:'Browser',ic:I.br,app:'br'},{k:'app:setup',n:'Setup guide',ic:I.setup,app:'setup'},{k:'app:draw',n:'Notepad',ic:I.pad,app:'draw'},{k:'app:guide',n:'Setup-Guide.pdf',ic:I.pdf,app:'guide'},{k:'app:credits',n:'suspects.txt',ic:I.file,app:'credits'},{k:'app:bin',n:'Bin',ic:bin.length?I.binf:I.bin,app:'bin'}];
    var mine=[];
    Object.keys(s.dirs).filter(function(d){return d!==HOME&&dirname(d)===HOME}).forEach(function(d){mine.push({k:d,n:base(d),ic:I.folder,dir:true,repo:!!(s.repos&&s.repos[d])})});
    Object.keys(s.files).filter(function(f){return dirname(f)===HOME}).forEach(function(f){var pic=ML.isPic(s.files[f]);mine.push({k:f,n:base(f),ic:pic?'<img class="dthumb" src="'+ML.binUrl(s.files[f])+'" alt="">':I.file,mark:ML.gitMark(f)})});
    mine.forEach(function(x){if(!born[x.k])born[x.k]=++bornN});
    var nm=function(a,b){var x=a.n.toLowerCase(),y=b.n.toLowerCase();return x<y?-1:x>y?1:0},ext=function(x){var m=x.n.match(/\.([^.]+)$/);return m?m[1].toLowerCase():''};
    /* Arrange icons: by name sorts every icon A to Z; by type puts apps, then folders, then files grouped by type
       (the setup guide counts as a .pdf file); by date created keeps the apps first, then your things oldest first */
    if(sortBy==='name')return o.concat(mine).sort(nm);
    if(sortBy==='date'){mine.sort(function(a,b){return born[a.k]-born[b.k]});return o.concat(mine)}
    /* by date modified: the apps first, then your things, the one you changed longest ago first (so new changes go to the end) */
    if(sortBy==='modified'){mine.sort(function(a,b){return (mtime[a.k]||born[a.k])-(mtime[b.k]||born[b.k])});return o.concat(mine)}
    var grp=function(x){return x.app&&x.app!=='guide'&&x.app!=='memes'&&x.app!=='credits'?0:x.dir?1:2},ord=function(x){return x.app?['ws','lab','cheat','vs','br','draw','bin'].indexOf(x.app):0};
    return o.concat(mine).sort(function(a,b){return grp(a)!==grp(b)?grp(a)-grp(b):grp(a)===0?ord(a)-ord(b):ext(a)!==ext(b)?(ext(a)<ext(b)?-1:1):nm(a,b)})}
  var SORTS={name:'name',type:'type',date:'date created',modified:'date modified'},sortBy=SORTS[store('sort')]?store('sort'):'modified',born={},bornN=0,mtime={},msig={};
  function arrange(k){sortBy=k;store('sort',k);pos={};lastSig='';draw(true);say('Arranged the icons by '+SORTS[k]+'.')}
  function cell(){var sm=view==='small',ph=innerWidth<=700;return {w:sm?(ph?66:74):(ph?80:92),h:sm?(ph?66:72):(ph?78:96),x0:8,y0:8}}
  function slots(n){var c=cell(),rows=Math.max(1,Math.floor((desk.clientHeight-c.y0)/c.h)),cols=Math.max(1,Math.floor((desk.clientWidth-c.x0)/c.w));return {c:c,rows:rows,cols:cols}}
  function layout(list){var g=slots(),c=g.c,used={},out={};
    function key(col,row){return col+','+row}
    list.forEach(function(it){var p=pos[it.k];if(p&&p.col<g.cols&&p.row<g.rows&&!used[key(p.col,p.row)]){used[key(p.col,p.row)]=1;out[it.k]=p}});
    var i=0;list.forEach(function(it){if(out[it.k])return;var col,row;
      do{col=Math.floor(i/g.rows);row=i%g.rows;i++}while(used[key(col,row)]&&i<5000);used[key(col,row)]=1;out[it.k]={col:col,row:row}});
    return out}
  function draw(force){if(desk.hidden&&!force)return;if(renaming)return;
    var list=items(),s=S(),sig=JSON.stringify(list.map(function(x){return [x.k,x.mark||'',x.repo||0,x.ic.length]}))+'|'+view+'|'+(clip?clip.mode+clip.list.join(','):'')+'|'+Object.keys(sels).sort().join(',')+'|'+desk.clientWidth+'x'+desk.clientHeight+'|'+JSON.stringify(pos);
    if(sig===lastSig&&!force)return;lastSig=sig;
    var L=layout(list),c=cell(),h='',foc=document.activeElement&&document.activeElement.closest&&document.activeElement.closest('.dico'),fk=foc&&foc.getAttribute('data-k');
    list.forEach(function(it){var p=L[it.k];h+='<button type="button" class="dico'+(sels[it.k]?' sel':'')+(inClip(it.k)?' cut':'')+'" data-k="'+esc(it.k)+'" style="left:'+(c.x0+p.col*c.w+(c.w-(view==='small'?(innerWidth<=700?62:68):(innerWidth<=700?74:84)))/2)+'px;top:'+(c.y0+p.row*c.h)+'px" title="'+esc(it.n)+(it.repo?' (Git repo)':'')+'">'
      +'<span class="dic">'+it.ic+(it.repo?'<b class="dbadge bU" style="background:#e8336d" aria-label="Git repo">git</b>':it.mark?'<b class="dbadge b'+it.mark+'" aria-label="Git: '+({U:'new',M:'changed',A:'staged',C:'conflict'})[it.mark]+'">'+(it.mark==='C'?'!':it.mark)+'</b>':'')+'</span><span class="dl">'+esc(it.n)+'</span></button>'});
    icons.innerHTML=h;
    if(fk){var nf=icons.querySelector('[data-k="'+cssq(fk)+'"]');if(nf)nf.focus({preventScroll:true})}
    if(!BW.el.hidden)binDraw();else tkBin.querySelector('i').innerHTML=(s.bin||[]).length?I.binf:I.bin;selBarDraw()}
  function keyMoved(o,n){if(pos[o]){pos[n]=pos[o];delete pos[o]}if(born[o]){born[n]=born[o];delete born[o]}if(mtime[o]){mtime[n]=mtime[o];delete mtime[o]}if(msig[o]!==undefined){msig[n]=msig[o];delete msig[o]}}
  function cssq(v){return v.replace(/\\/g,'\\\\').replace(/"/g,'\\"')}
  /* remember the order things appear in ~ (for "Arrange icons by date created"); runs after every change */
  function noteNew(){var s=S();Object.keys(s.dirs).concat(Object.keys(s.files)).forEach(function(k){if(k!==HOME&&dirname(k)===HOME&&!born[k])born[k]=++bornN});
    /* date modified: a file changes when its contents change; a folder when something is added, removed or renamed directly inside it (like a real computer) */
    Object.keys(born).forEach(function(k){var sig=k in s.files?'f'+s.files[k]:s.dirs[k]?'d'+Object.keys(s.dirs).concat(Object.keys(s.files)).filter(function(x){return dirname(x)===k}).sort().join('|'):null;
      if(sig===null){delete msig[k];return}if(msig[k]!==undefined&&msig[k]!==sig)mtime[k]=++bornN;else if(msig[k]===undefined)mtime[k]=born[k];msig[k]=sig})}
  window.deskDraw=function(){noteNew();if(!BW.el.hidden)binDraw();draw();if(!FX.el.hidden)fxDraw();if(!MW.el.hidden&&picAt&&!(picAt in S().files))picDraw()};
  addEventListener('resize',function(){lastSig='';draw()});

  function itemOf(k){var l=items();for(var i=0;i<l.length;i++)if(l[i].k===k)return l[i];return null}
  function openItem(it,open){if(!it)return;
    if(it.app==='setup'){openSetup();return}
    if(it.app){activate(it.app==='vs'?np:wins[{ws:'wsWin',lab:'labWin',cheat:'cheatWin',br:'brWin',setup:'brWin',bin:'binWin',draw:'drawWin',guide:'guideWin',memes:'memeWin',credits:'credWin'}[it.app]].el,open);return}
    openFile(it.k)}

  /* rename right on the icon */
  function startRename(k,isNew){var b=icons.querySelector('.dico[data-k="'+cssq(k)+'"]');if(!b)return;renaming=k;sel=k;sels={};sels[k]=1;markSel();
    var lab=b.querySelector('.dl'),inp=document.createElement('input');inp.className='dren';inp.value=base(k);inp.setAttribute('aria-label','New name');inp.spellcheck=false;inp.autocapitalize='off';
    lab.replaceWith(inp);var dot=inp.value.lastIndexOf('.');inp.focus();inp.setSelectionRange(0,dot>0&&!S().dirs[k]?dot:inp.value.length);
    var done=false;
    function finish(ok){if(done)return;var v=inp.value.trim();
      if(ok&&v!==base(k)){if(!ML.okName(v)){inp.classList.add('bad');inp.title='Use letters, numbers, dots, dashes or underscores. No spaces.';inp.focus();return}
        var r=ML.fsRename(k,HOME+'/'+v);if(r.err){inp.classList.add('bad');popWarn('Cannot rename',r.err);return}
        done=true;renaming=null;if(pos[k]){pos[r.abs]=pos[k];delete pos[k]}keyMoved(k,r.abs);sel=r.abs;sels={};sels[r.abs]=1;say((isNew?'Named it ':'Renamed '+esc(base(k))+' to ')+esc(v)+'.');lastSig='';ML.render();return}
      done=true;renaming=null;lastSig='';draw(true)}
    inp.addEventListener('keydown',function(e){e.stopPropagation();if(e.key==='Enter'){e.preventDefault();finish(true)}else if(e.key==='Escape'){e.preventDefault();finish(false)}});
    inp.addEventListener('blur',function(){setTimeout(function(){if(!done&&renaming===k)finish(true)},0)});
    ['pointerdown','click','dblclick','contextmenu'].forEach(function(n){inp.addEventListener(n,function(e){e.stopPropagation()})})}

  function newThing(dir){var name=ML.uniq(HOME,dir?'new-folder':'new-file.txt'),r=ML.fsNew(HOME+'/'+name,dir);if(r.err)return popWarn('Cannot create',r.err);
    say('Created '+(dir?'folder ':'')+esc(name)+'.');sel=r.abs;sels={};sels[r.abs]=1;lastSig='';ML.render();draw(true);startRename(r.abs,true)}
  /* cut / copy / paste / delete work on one thing or many (the clipboard holds a list) */
  function setClip(mode,list){list=list.filter(function(k){var it=itemOf(k);return !(it&&it.app)&&ML.exists(k)});clip=list.length?{mode:mode,list:list}:null;lastSig='';draw(true);if(!FX.el.hidden)fxDraw()}
  function inClip(k){return !!(clip&&clip.mode==='cut'&&clip.list.indexOf(k)>=0)}
  function canPasteNow(){return !!(clip&&clip.list.some(function(k){return ML.exists(k)}))}
  function nameList(l){return l.length===1?esc(base(l[0])):l.length+' items'}
  function delMany(list){list=list.filter(function(k){var it=itemOf(k);return !(it&&it.app)&&ML.exists(k)});if(!list.length)return;
    var s=S(),rp=list.filter(function(k){return Object.keys(s.repos||{}).some(function(rt){return under(rt,k)})}),inr=list.some(function(k){var o=ML.repoOf(k);return !!o&&k!==o.root});
    function go(){var done=[];list.forEach(function(k){if(!ML.exists(k))return;var r=ML.binPut(k);if(r.err){popWarn('Cannot delete',r.err);return}done.push(k);if(clip){clip.list=clip.list.filter(function(c){return !under(c,k)});if(!clip.list.length)clip=null}delete pos[k];delete sels[k];delete fxSels[k]});
      if(!done.length)return;sel=null;say('Moved '+nameList(done)+' to the Bin.'+(inr?' Next: git add, then git commit.':''));ML.render();if(!FX.el.hidden)fxDraw()}
    if(rp.length)confirmPop(rp.length===1&&list.length===1?'Delete this Git repo?':'Delete Git repos?','<b>'+rp.map(function(k){return esc(base(k))}).join(', ')+'</b> '+(rp.length===1?'holds a Git repo':'hold Git repos')+'. The history (the hidden .git folder) goes to the Bin too. You can restore it from the Bin.',go);else go()}
  function del(k){delMany([k])}
  function paste(dir){if(!canPasteNow())return;var moved=[],errs=[],mode=clip.mode;
    clip.list.forEach(function(k){if(!ML.exists(k))return;if(S().dirs[k]&&under(dir,k)){errs.push(esc(base(k))+': a folder cannot go inside itself.');return}
      var r=mode==='cut'?ML.fsMove(k,dir):ML.fsCopy(k,dir);if(r.err){errs.push(esc(base(k))+': '+r.err);return}moved.push(r.abs);
      if(mode==='cut'&&r.abs!==k){if(pos[k]&&dir===HOME)pos[r.abs]=pos[k];delete pos[k];keyMoved(k,r.abs)}});
    if(moved.length)say((mode==='cut'?'Moved ':'Copied ')+nameList(moved)+' to '+esc(tilde(dir))+'.');
    if(errs.length)popWarn('Cannot paste',errs.join('<br>'));
    if(mode==='cut')clip=null;
    if(dir===HOME&&moved.length){sels={};moved.forEach(function(k){sels[k]=1});sel=moved[0]}lastSig='';ML.render();if(!FX.el.hidden)fxDraw()}
  /* open several things at once: apps come to the front, folders open in the File Explorer, files in VS Code */
  function openMany(list){list.forEach(function(k){var it=itemOf(k)||{k:k,dir:!!S().dirs[k]};openItem(it,true)})}

  /* menus */
  function deskMenu(x,y){
    ML.ctxMenu(x,y,[{t:'New folder',fn:function(){newThing(true)}},{t:'New file',fn:function(){newThing(false)}},'-',
      {t:'Paste',k:'Ctrl+V',dis:!canPasteNow(),fn:function(){paste(HOME)}},{t:'Select all',k:'Ctrl+A',fn:selectAll},{t:'Refresh',k:'F5',fn:refresh},'-',
      {t:'Arrange icons',sub:Object.keys(SORTS).map(function(k){return {t:'By '+SORTS[k],on:sortBy===k,fn:function(){arrange(k)}}})},
      {t:'View',sub:[{t:'Large icons',on:view==='large',fn:function(){setView('large')}},{t:'Small icons',on:view==='small',fn:function(){setView('small')}}]},'-',
      {t:'Change wallpaper',sub:Object.keys(WP).map(function(k){return {t:WP[k].n,on:wp===k,fn:function(){wp=k;store('wp',k);applyLook()}}})},
      {t:'Personalise',sub:['blue','green','pink','purple','orange'].map(function(k){return {t:k[0].toUpperCase()+k.slice(1),on:theme===k,fn:function(){theme=k;store('theme',k);applyLook()}}})}])}
  function selList(){return items().map(function(x){return x.k}).filter(function(k){return sels[k]})}
  /* right-click on a selection of several things: act on all of them */
  function multiMenu(list,x,y,where){var mv=list.filter(function(k){var it=itemOf(k);return !(it&&it.app)}),files=mv.filter(function(k){return !S().dirs[k]});
    ML.ctxMenu(x,y,[{t:'Open ('+list.length+')',fn:function(){openMany(list)}},{t:'Open with VS Code',dis:!files.length,fn:function(){openVS(files[0])}},'-',
      {t:'Cut ('+mv.length+')',k:'Ctrl+X',dis:!mv.length,fn:function(){setClip('cut',mv)}},{t:'Copy ('+mv.length+')',k:'Ctrl+C',dis:!mv.length,fn:function(){setClip('copy',mv)}},'-',
      {t:'Delete ('+mv.length+')',k:'Del',dis:!mv.length,fn:function(){delMany(mv)}}].concat(where==='fx'?[]:['-',{t:'Clear selection',k:'Esc',fn:clearSel}]))}
  function itemMenu(it,x,y){var cur=selList();if(sels[it.k]&&cur.length>1){sel=it.k;multiMenu(cur,x,y);return}
    sel=it.k;sels={};sels[it.k]=1;markSel();
    var touchSel=lastPtr!=='mouse'?[{t:'Select',fn:function(){selMode=true;sels={};sels[it.k]=1;markSel()}}]:[];
    if(it.app){var m=[{t:'Open',fn:function(){openItem(it,true)}}].concat(touchSel);if(it.app==='bin'){var n=(S().bin||[]).length;m.push('-',{t:'Empty Bin',dis:!n,fn:function(){confirmPop('Empty the Bin?','Everything in the Bin will be gone for good.',function(){ML.binEmpty();say('Emptied the Bin.');ML.render()})}})}
      ML.ctxMenu(x,y,m);return}
    var canPaste=it.dir&&canPasteNow();
    ML.ctxMenu(x,y,[{t:'Open',fn:function(){openItem(it)}},{t:'Open with VS Code',fn:function(){openVS(it.k)}}].concat(touchSel,['-',
      {t:'Cut',k:'Ctrl+X',fn:function(){setClip('cut',[it.k])}},{t:'Copy',k:'Ctrl+C',fn:function(){setClip('copy',[it.k])}},
      {t:'Paste into folder',dis:!canPaste,fn:function(){paste(it.k)}},'-',
      {t:'Rename',k:'F2',fn:function(){startRename(it.k)}},{t:'Delete',k:'Del',fn:function(){del(it.k)}}]))}
  function setView(v){view=v;store('view',v);pos={};applyLook();lastSig='';draw(true)}
  function refresh(){lastSig='';draw(true);desk.classList.remove('flash');void desk.offsetWidth;desk.classList.add('flash')}
  /* F5 is the Mini laptop's own Refresh wherever you are (the same as right-click > Refresh), so it never wipes your work.
     Ctrl+F5 / Shift+F5 still reload the page, and reloading or closing asks first when there is work to lose. */
  document.addEventListener('keydown',function(e){if(e.key!=='F5'||e.defaultPrevented||e.ctrlKey||e.metaKey||e.shiftKey||!boot.hidden)return;e.preventDefault();refresh()});
  function hashS(t){var h=5381;t=String(t);for(var i=0;i<t.length;i++)h=((h<<5)+h+t.charCodeAt(i))|0;return h}
  function workSig(){var s=S();if(!s)return '';var f=s.files||{},d=s.dirs||{},r=s.repos||{};
    return Object.keys(f).sort().map(function(k){return k+':'+hashS(f[k])}).join('|')+'#'+Object.keys(d).sort().join('|')+'#'
      +Object.keys(r).sort().map(function(k){var x=r[k]||{};return k+':'+Object.keys(x.cm||{}).length+':'+JSON.stringify(x.br||{})+':'+JSON.stringify(x.index||{}).length}).join('|')+'#'+(s.bin||[]).length}
  var workBase=null;function workMark(){try{workBase=workSig()}catch(z){}}
  addEventListener('load',function(){setTimeout(workMark,600)});
  ML.workChanged=function(){try{return (workBase!==null&&workSig()!==workBase)||strokes.length>0}catch(z){return false}};
  ML.workMark=workMark;
  addEventListener('beforeunload',function(e){if(!boot.hidden||!ML.workChanged())return;e.preventDefault();e.returnValue='';return ''});
  function markSel(){icons.querySelectorAll('.dico').forEach(function(b){b.classList.toggle('sel',!!sels[b.getAttribute('data-k')])});selBarDraw()}
  function clearSel(){sels={};sel=null;selMode=false;markSel()}
  function selectAll(){sels={};items().forEach(function(x){sels[x.k]=1});markSel()}
  /* the selection bar: only in Select mode on phones (there is no right-click there); with a mouse the right-click menu does the job */
  var selBar=document.createElement('div');selBar.className='selbar';selBar.hidden=true;selBar.setAttribute('role','toolbar');selBar.setAttribute('aria-label','Selected items');desk.appendChild(selBar);
  function selBarDraw(){var l=selList(),mv=l.filter(function(k){var it=itemOf(k);return !(it&&it.app)});if(!selMode){selBar.hidden=true;return}selBar.hidden=false;
    selBar.innerHTML='<b>'+l.length+' selected</b><button type="button" data-sb="open"'+(l.length?'':' disabled')+'>Open</button><button type="button" data-sb="cut"'+(mv.length?'':' disabled')+'>Cut</button><button type="button" data-sb="copy"'+(mv.length?'':' disabled')+'>Copy</button>'
      +'<button type="button" data-sb="del"'+(mv.length?'':' disabled')+'>Delete</button><button type="button" data-sb="all">Select all</button><button type="button" data-sb="done">Done</button>'}
  selBar.addEventListener('pointerdown',function(e){e.stopPropagation()});
  selBar.addEventListener('click',function(e){e.stopPropagation();var b=e.target.closest('[data-sb]');if(!b)return;var a=b.getAttribute('data-sb'),l=selList(),mv=l.filter(function(k){var it=itemOf(k);return !(it&&it.app)});
    if(a==='open'){openMany(l)}else if(a==='cut')setClip('cut',mv);else if(a==='copy')setClip('copy',mv);else if(a==='del')delMany(mv);else if(a==='all'){selectAll();return}
    if(a==='done'||a==='open'||a==='del')clearSel()});

  ML.longPress(desk,function(t){return !(t.closest&&t.closest('input'))},function(e){var b=e.target.closest&&e.target.closest('.dico');
    if(b){var it=itemOf(b.getAttribute('data-k'));if(it){itemMenu(it,e.clientX,e.clientY);return}}if(marq){marq.box.remove();marq=null}if(!selMode){sels={};sel=null;markSel()}deskMenu(e.clientX,e.clientY)});

  /* click, double-click, drag */
  var drag=null,lastTap={k:null,t:0},lastPtr='mouse',ghostUntil=0;
  /* on touch screens a window can open right under your finger; the same tap's click must not press a button in it */
  document.addEventListener('click',function(e){if(Date.now()<ghostUntil&&!(e.target.closest&&e.target.closest('#desk'))){e.preventDefault();e.stopPropagation();ghostUntil=0}},true);
  desk.addEventListener('pointerdown',function(e){lastPtr=e.pointerType},true);
  var marq=null;
  /* items in reading order (down each column, then the next column), for Shift-click ranges */
  function inOrder(){var L=layout(items());return items().map(function(x){return x.k}).sort(function(a,b){return L[a].col-L[b].col||L[a].row-L[b].row})}
  desk.addEventListener('pointerdown',function(e){if(e.button!==0&&e.pointerType==='mouse')return;if(e.target.closest('.selbar'))return;var b=e.target.closest('.dico');if(renaming&&(!b||b.getAttribute('data-k')!==renaming))return;
    var add=e.ctrlKey||e.metaKey;
    if(!b){/* drag a box over empty desktop to select everything inside it */
      if(!add&&!selMode){sels={};sel=null;markSel()}
      var base={};Object.keys(sels).forEach(function(k){base[k]=1});var dr=desk.getBoundingClientRect(),box=document.createElement('div');box.className='marq';box.hidden=true;desk.appendChild(box);
      marq={sx:e.clientX,sy:e.clientY,x0:dr.left,y0:dr.top,box:box,base:base,id:e.pointerId,on:false};return}
    if(b.querySelector('.dren'))return;
    var k=b.getAttribute('data-k');
    if(selMode||add){if(sels[k])delete sels[k];else sels[k]=1;sel=k;markSel();drag={b:b,k:k,sx:e.clientX,sy:e.clientY,ox:b.offsetLeft,oy:b.offsetTop,moved:false,id:e.pointerId,type:e.pointerType,toggled:true};return}
    if(e.shiftKey&&sel&&e.pointerType==='mouse'){var o=inOrder(),i0=o.indexOf(sel),i1=o.indexOf(k);if(i0>=0&&i1>=0){sels={};o.slice(Math.min(i0,i1),Math.max(i0,i1)+1).forEach(function(x){sels[x]=1});markSel();return}}
    if(!sels[k]){sels={};sels[k]=1}sel=k;markSel();
    drag={b:b,k:k,sx:e.clientX,sy:e.clientY,ox:b.offsetLeft,oy:b.offsetTop,moved:false,id:e.pointerId,type:e.pointerType,many:selList().length>1}});
  desk.addEventListener('pointermove',function(e){
    if(marq&&e.pointerId===marq.id){var mx=e.clientX,my=e.clientY;if(!marq.on){if(Math.abs(mx-marq.sx)+Math.abs(my-marq.sy)<8)return;marq.on=true;marq.box.hidden=false;try{desk.setPointerCapture(e.pointerId)}catch(z){}}
      var l=Math.min(mx,marq.sx),t=Math.min(my,marq.sy),r=Math.max(mx,marq.sx),bt=Math.max(my,marq.sy);
      marq.box.style.left=(l-marq.x0)+'px';marq.box.style.top=(t-marq.y0)+'px';marq.box.style.width=(r-l)+'px';marq.box.style.height=(bt-t)+'px';
      var nx={};Object.keys(marq.base).forEach(function(k){nx[k]=1});icons.querySelectorAll('.dico').forEach(function(ic){var q=ic.getBoundingClientRect();if(q.left<r&&q.right>l&&q.top<bt&&q.bottom>t)nx[ic.getAttribute('data-k')]=1});
      sels=nx;markSel();return}
    if(!drag||e.pointerId!==drag.id||drag.toggled)return;var dx=e.clientX-drag.sx,dy=e.clientY-drag.sy;
    if(!drag.moved){if(Math.abs(dx)+Math.abs(dy)<8)return;drag.moved=true;drag.b.classList.add('drag');try{desk.setPointerCapture(e.pointerId)}catch(z){}}
    drag.b.style.left=(drag.ox+dx)+'px';drag.b.style.top=(drag.oy+dy)+'px';
    /* the other selected icons travel along */
    if(drag.many)icons.querySelectorAll('.dico.sel').forEach(function(x){if(x!==drag.b){x.style.transform='translate('+dx+'px,'+dy+'px)';x.classList.add('drag2')}});
    var t=dropTarget(drag,e.clientX,e.clientY);icons.querySelectorAll('.dico.drop').forEach(function(x){if(x!==t)x.classList.remove('drop')});if(t)t.classList.add('drop')});
  function dropTarget(d,x,y){var b=d.b;b.style.visibility='hidden';var el=document.elementFromPoint(x,y);b.style.visibility='';var t=el&&el.closest&&el.closest('.dico');
    if(!t||t===b)return null;var it=itemOf(t.getAttribute('data-k'));if(!it)return null;var me=itemOf(d.k);if(!me)return null;
    if(me.app)return null;if(d.many&&sels[it.k])return null;if(it.app==='bin'||it.app==='vs'||(it.dir&&!(me.dir&&under(it.k,me.k))))return t;return null}
  function endDrag(e){
    if(marq&&e.pointerId===marq.id){marq.box.remove();marq=null;return}
    if(!drag)return;var d=drag;drag=null;d.b.classList.remove('drag');icons.querySelectorAll('.drag2').forEach(function(x){x.style.transform='';x.classList.remove('drag2')});
    if(d.toggled)return;
    if(!d.moved){if(e.type==='pointercancel'||(desk._lp&&Date.now()-desk._lp<900))return;var now=Date.now(),it=itemOf(d.k);
      /* a plain click inside a selection of several picks just that one (like a real desktop) */
      if(d.many&&d.type==='mouse'&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey){sels={};sels[d.k]=1;markSel()}
      if(appOpen(it)){lastTap={k:null,t:0};if(d.type!=='mouse')ghostUntil=Date.now()+600;activate(appEl(it));return}
      if(d.type!=='mouse'){if(lastTap.k===d.k&&now-lastTap.t<700){lastTap={k:null,t:0};ghostUntil=Date.now()+600;openItem(it)}else lastTap={k:d.k,t:now}}
      return}
    var t=dropTarget(d,e.clientX,e.clientY);icons.querySelectorAll('.dico.drop').forEach(function(x){x.classList.remove('drop')});
    var group=d.many?selList().filter(function(k){var x=itemOf(k);return !(x&&x.app)}):[d.k];if(d.many&&group.indexOf(d.k)<0&&!(itemOf(d.k)||{}).app)group.push(d.k);
    if(t){var it2=itemOf(t.getAttribute('data-k'));
      if(it2.app==='bin'){delMany(group);lastSig='';draw(true);return}
      if(it2.app==='vs'){lastSig='';draw(true);openVS(d.k);return}
      if(it2.dir){var ok2=[],er2=[];group.forEach(function(k){if(k===it2.k||(S().dirs[k]&&under(it2.k,k)))return;var r=ML.fsMove(k,it2.k);if(r.err){er2.push(esc(base(k))+': '+r.err);return}ok2.push(k);delete pos[k];delete sels[k];if(clip){clip.list=clip.list.filter(function(c){return c!==k});if(!clip.list.length)clip=null}});
        if(er2.length)popWarn('Cannot move',er2.join('<br>'));if(ok2.length){sel=null;say('Moved '+nameList(ok2)+' into '+esc(base(it2.k))+'.')}lastSig='';ML.render();return}}
    /* dropped on empty desktop: the icon (and the others selected with it) move by the same number of places */
    var c=cell(),g=slots(),L=layout(items()),col=Math.max(0,Math.min(g.cols-1,Math.round((d.b.offsetLeft-c.x0)/c.w))),row=Math.max(0,Math.min(g.rows-1,Math.round((d.b.offsetTop-c.y0)/c.h)));
    var dc=col-L[d.k].col,dr2=row-L[d.k].row,movers=d.many?selList():[d.k];
    movers.forEach(function(k){var from=L[k],to={col:Math.max(0,Math.min(g.cols-1,from.col+dc)),row:Math.max(0,Math.min(g.rows-1,from.row+dr2))};
      var taken=null;Object.keys(L).forEach(function(o){if(o!==k&&movers.indexOf(o)<0&&L[o].col===to.col&&L[o].row===to.row)taken=o});
      if(taken){pos[taken]=from;L[taken]=from}pos[k]=to;L[k]=to});lastSig='';draw(true)}
  desk.addEventListener('pointerup',endDrag);desk.addEventListener('pointercancel',endDrag);
  desk.addEventListener('dblclick',function(e){if(lastPtr!=='mouse')return;var b=e.target.closest('.dico');if(!b||b.querySelector('.dren'))return;
    var it=itemOf(b.getAttribute('data-k'));if(appOpen(it))return;openItem(it)});
  /* once an app's window is open (even minimised), one click on its icon minimises or restores it, like the taskbar */
  function appEl(it){return it&&it.app?(it.app==='vs'?np:wins[{ws:'wsWin',lab:'labWin',cheat:'cheatWin',br:'brWin',setup:'brWin',bin:'binWin',draw:'drawWin',guide:'guideWin',memes:'memeWin',credits:'credWin'}[it.app]].el):null}
  function appOpen(it){var el=appEl(it);if(!el)return false;return el.id==='notepad'?el.classList.contains('show'):!el.hidden}
  desk.addEventListener('keydown',function(e){if(e.target.closest('.dren')||e.target.closest('.selbar'))return;var b=e.target.closest('.dico'),k=b&&b.getAttribute('data-k'),it=k&&itemOf(k),l=selList(),many=l.length>1;
    if(e.key==='Enter'&&(it||many)){e.preventDefault();if(many)openMany(l);else openItem(it)}
    else if(e.key==='F2'&&it&&!it.app&&!many){e.preventDefault();startRename(k)}
    else if(e.key==='Delete'&&(many||(it&&!it.app))){e.preventDefault();delMany(many?l:[k])}
    else if(e.key==='F5'){e.preventDefault();refresh()}
    else if(e.key==='Escape'&&(l.length||selMode)){e.preventDefault();clearSel()}
    else if((e.ctrlKey||e.metaKey)&&!e.altKey&&(e.key==='a'||e.key==='A')){e.preventDefault();selectAll()}
    else if((e.ctrlKey||e.metaKey)&&!e.altKey&&(many||(it&&!it.app))&&(e.key.toLowerCase()==='c'||e.key.toLowerCase()==='x')){e.preventDefault();setClip(e.key.toLowerCase()==='x'?'cut':'copy',many?l:[k])}
    else if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='v'){e.preventDefault();paste(it&&it.dir&&!many?k:HOME)}});
  desk.addEventListener('focusin',function(e){var b=e.target.closest&&e.target.closest('.dico');if(b&&!renaming&&!selList().length){sel=b.getAttribute('data-k');sels={};sels[sel]=1;markSel()}});
  /* ---------- every command the Practice Lab's terminal understands: [command, what it does, search words, lesson, what Try it types] ---------- */
  var CHEAT=[
   {g:'Set up Git',l:[
    ['git --version','Check that Git is installed, and which version','version installed check install setup','#t1-5','git --version'],
    ['git config --global user.name "Name"','Tell Git your name (once per computer). It goes on every commit you make','name config who identity setup author','#t1-5','git config --global user.name ""'],
    ['git config --global user.email "you@example.com"','Tell Git your email (once per computer)','email config identity setup author','#t1-5','git config --global user.email ""'],
    ['git config --list','See the settings Git is using, like your name and email','config list settings show','#n2-1','git config --list'],
    ['git help','List the Git commands, grouped by what they are for','help commands list usage','#t2-3','git help']]},
   {g:'Start a repo',l:[
    ['git init','Turn the folder you are in into a Git repo','start new repo create init begin folder','#t2-2','git init'],
    ['git clone <url>','Copy a whole repo from GitHub into a new folder. Try it with GitHub\'s own sample repo; in Real GitHub mode any repo you can see on github.com works','download clone copy get repo github','#t2-4','git clone https://github.com/octocat/Hello-World'],
    ['git clone <folder> <new-folder>','Clone a repo that is already on this laptop into another folder','clone copy local folder repo','#t2-4','git clone ']]},
   {g:'Save your work',l:[
    ['git status','See what changed, what is staged, and if you are ahead of or behind GitHub','status changed what happened check see state behind ahead','#n3-1','git status'],
    ['git add <file>','Put one file\'s changes in the staging area, ready to save','save stage add prepare track file','#t2-3','git add '],
    ['git add .','Stage every change in this folder at once','save stage add all everything','#t2-3','git add .'],
    ['git commit -m "message"','Save a snapshot (a save point) of what you staged','save commit snapshot message checkpoint','#t2-3','git commit -m ""'],
    ['git commit -am "message"','Stage every change to files Git already tracks, and commit, in one go (new files still need git add)','save commit all stage tracked shortcut','#n3-1','git commit -am ""'],
    ['git diff','See exactly which lines you changed (not staged yet)','diff difference changes compare what changed lines see','#t2-3','git diff'],
    ['git diff --staged','See the changes you staged, before you commit them','diff staged cached compare before commit','#t2-3','git diff --staged'],
    ['git diff HEAD~1 HEAD','Compare two commits: here, the one before last with the last one','diff compare commits two versions','#t2-3','git diff HEAD~1 HEAD'],
    ['git log','See every commit: who, when and why','history log list commits past see author','#n3-2','git log'],
    ['git log --oneline','See your history, one short line per commit','history log list commits short oneline','#n3-2','git log --oneline'],
    ['git show','See the last commit and the lines it changed','show last commit details lines changed','#t2-3','git show'],
    ['git show HEAD~1','See the commit before the last one (HEAD~2 goes two back, and so on)','show older commit previous details','#t2-3','git show HEAD~1'],
    ['git ls-files','List every file Git is keeping track of (tracked files)','list files tracked ls-files what git knows','#t2-3','git ls-files']]},
   {g:'Undo things',l:[
    ['git restore <file>','Throw away changes to a file you have not staged yet','undo discard throw away changes reset file restore go back','#t2-3','git restore '],
    ['git restore --staged <file>','Take a file back out of the staging area (keeps your changes)','unstage undo add remove staging restore','#t2-3','git restore --staged '],
    ['git reset <file>','Unstage a file (the same as git restore --staged)','unstage reset undo add','#t2-3','git reset '],
    ['git reset --soft HEAD~1','Undo the last commit but keep its changes staged','undo last commit reset soft uncommit keep','#t2-3','git reset --soft HEAD~1'],
    ['git reset --hard HEAD~1','Throw away the last commit and its changes (careful: they are gone)','undo delete last commit reset hard throw away dangerous','#t2-3','git reset --hard HEAD~1'],
    ['git revert HEAD','Undo the last commit safely, by adding a new commit that reverses it','undo last commit head revert mistake','#t2-3','git revert HEAD'],
    ['git revert <commit>','Undo any older commit (use its id from git log), only that one','undo revert reverse commit go back mistake older','#t2-3','git revert '],
    ['git revert -m 1 <merge>','Undo a merge: keep your branch (parent 1), take out what the merge brought in','undo merge revert mainline','#t3-3','git revert -m 1 '],
    ['git revert --continue','Finish a revert after you fixed its conflict and used git add','revert continue conflict finish','#t3-5','git revert --continue'],
    ['git revert --abort','Give up on a revert that hit a conflict','revert abort cancel conflict','#t3-5','git revert --abort']]},
   {g:'Put work aside (stash)',l:[
    ['git stash','Put your unfinished changes away for later, leaving a clean folder','stash save later shelve put away hide changes switch','#n5-3','git stash'],
    ['git stash -m "message"','Stash with a note, so you remember what it was','stash message note name','#n5-3','git stash -m ""'],
    ['git stash -u','Stash new (untracked) files too','stash untracked new files include','#n5-3','git stash -u'],
    ['git stash list','See what you have stashed','stash list see saved','#n5-3','git stash list'],
    ['git stash pop','Bring your stashed changes back (and remove them from the list)','stash pop restore unstash bring back','#n5-3','git stash pop'],
    ['git stash apply','Bring your stashed changes back, but keep them in the list too','stash apply restore keep','#n5-3','git stash apply'],
    ['git stash show','See which files a stash changed','stash show files see','#n5-3','git stash show'],
    ['git stash drop','Throw away the newest stash','stash drop delete remove','#n5-3','git stash drop']]},
   {g:'Files in Git',l:[
    ['git rm <file>','Delete a file and stage the deletion','delete remove rm file','#t2-3','git rm '],
    ['git mv <old> <new>','Rename or move a file, and stage the rename','rename move mv file','#t2-3','git mv '],
    ['.gitignore','A file listing what Git should never save, like passwords: one name (or *.log) per line','ignore secret password private hide gitignore keep out','#t4-1','echo "secret.txt" > .gitignore']]},
   {g:'Branches',l:[
    ['git branch','List your branches (the * is the one you are on)','list branches see branch','#t3-2','git branch'],
    ['git branch -a','List your branches and GitHub\'s (remotes/origin/...)','list all branches remote origin','#t3-2','git branch -a'],
    ['git branch <name>','Make a new branch, but stay where you are','new branch create make','#t3-2','git branch '],
    ['git switch <name>','Move to another branch','change branch switch go move','#t3-2','git switch '],
    ['git switch -c <name>','Make a new branch and move onto it','new branch create switch make','#t3-2','git switch -c '],
    ['git checkout <name>','The older way to move to another branch','change branch checkout go move old','#t3-2','git checkout '],
    ['git checkout -b <name>','The older way to make a branch and move onto it','new branch checkout create old','#t3-2','git checkout -b '],
    ['git branch -d <name>','Delete a branch you have already merged','delete remove branch','#t3-2','git branch -d '],
    ['git branch -D <name>','Delete a branch even if it is not merged (its commits are dropped)','delete force branch remove','#t3-2','git branch -D '],
    ['git merge <branch>','Combine another branch into the one you are on','combine merge join branch together','#t3-3','git merge '],
    ['git merge <branch> -m "message"','Merge, and give the merge commit your own message','merge message name','#t3-3','git merge '],
    ['git merge --abort','Give up on a merge with conflicts and go back to before it','abort cancel stop merge conflict undo','#t3-5','git merge --abort'],
    ['git rebase <branch>','Replay your commits on top of another branch, so the history is one straight line (your commits get new ids)','rebase replay move commits straight line history linear','#n5-4','git rebase main'],
    ['git rebase --continue','After fixing a rebase conflict and using git add, carry on with the next commit','rebase continue conflict','#n5-4','git rebase --continue'],
    ['git rebase --skip','Leave out the commit that caused the conflict, and carry on','rebase skip drop commit','#n5-4','git rebase --skip'],
    ['git rebase --abort','Give up on a rebase and go back to exactly how things were','rebase abort cancel undo','#n5-4','git rebase --abort'],
    ['git pull --rebase','Download new commits and put yours on top of them, instead of making a merge commit','pull rebase download update straight','#n5-4','git pull --rebase']]},
   {g:'Versions (tags)',l:[
    ['git tag','List your tags','tag list versions','#n5-5','git tag'],
    ['git tag v1.0','Put a name (a version label) on the current commit','tag version release label name','#n5-5','git tag v1.0'],
    ['git tag -a v1.0 -m "message"','A version label with a message (an annotated tag)','tag annotated version release message','#n5-5','git tag -a v1.0 -m ""'],
    ['git tag -d v1.0','Delete a tag','tag delete remove','#n5-5','git tag -d v1.0'],
    ['git push origin v1.0','Upload a tag to GitHub','push tag upload release version','#n5-5','git push origin v1.0'],
    ['git push --tags','Upload all your tags to GitHub','push tags all upload','#n5-5','git push --tags']]},
   {g:'GitHub',l:[
    ['git remote add origin <url>','Connect your repo to one on GitHub','connect remote origin link github url add','#n6-1','git remote add origin '],
    ['git remote -v','Show which GitHub address your repo is connected to','remote address url origin show connected','#n6-1','git remote -v'],
    ['git push -u origin main','Upload your commits to GitHub the first time (and remember where)','upload push send share github online first','#t2-4','git push -u origin main'],
    ['git push','Upload your new commits to GitHub','upload push send share github online','#t2-4','git push'],
    ['git push origin <branch>','Upload one branch to GitHub, even if you are on another','push branch upload','#t2-4','git push origin '],
    ['git fetch','Download new commits from GitHub without changing your files (origin/main moves)','download fetch check update look remote teammate','#n6-2','git fetch'],
    ['git pull','Download new commits from GitHub and merge them into your branch','download pull get update latest sync teammate','#n6-2','git pull'],
    ['git pull --allow-unrelated-histories','Join two histories that started separately (e.g. a README made on GitHub)','unrelated histories pull join refusing','#t2-4','git pull --allow-unrelated-histories'],
    ['git merge origin/main','Merge what you fetched, by hand (git pull does fetch + this)','merge origin fetched remote','#t2-4','git merge origin/main']]},
   {g:'Terminal (Git Bash)',l:[
    ['pwd','Show which folder you are in','where folder path pwd current','#t2-2','pwd'],
    ['ls','List the files and folders here','list files folder see ls show','#t2-2','ls'],
    ['ls -a','List everything, hidden files too (like .git)','list files hidden folder see ls show all','#t2-2','ls -a'],
    ['ls -l','A long list: one line per file, with its size and date (folders end in /)','list long details size date ls','#t2-2','ls -l'],
    ['ls -la','The long list with hidden files too','list long all hidden details ls','#t2-2','ls -la'],
    ['cd <folder>','Go into a folder','change folder go into directory cd move','#t2-2','cd '],
    ['cd ..','Go up one folder','back up parent folder cd','#t2-2','cd ..'],
    ['cd ~','Go to your home folder (the desktop)','home desktop cd tilde','#t2-2','cd ~'],
    ['mkdir <folder>','Make a new folder','new folder make directory create mkdir','#t2-2','mkdir '],
    ['touch <file>','Make a new, empty file','new file create empty touch','#t2-2','touch '],
    ['echo "text" > file.txt','Create a file with this text (or replace what is in it)','create write file text echo make new replace','#t2-3','echo "" > notes.txt'],
    ['echo "line" >> file.txt','Add a line to the end of a file','append add line file echo','#t2-3','echo "" >> notes.txt'],
    ['cat <file>','Show what is inside a file','read show open file view cat contents','#t2-3','cat '],
    ['mv <old> <new>','Rename or move a file or folder (git mv also stages it)','rename move mv file folder','#t2-2','mv '],
    ['cp <file> <copy>','Copy a file','copy duplicate cp file','#t2-2','cp '],
    ['cp -r <folder> <copy>','Copy a folder and everything in it','copy folder recursive cp','#t2-2','cp -r '],
    ['rm <file>','Delete a file','delete remove rm file','#t2-2','rm '],
    ['rm -r <folder>','Delete a folder and everything in it','delete remove folder recursive','#t2-2','rm -r '],
    ['clear','Clear the terminal screen (Ctrl+L too)','clear clean screen','#t2-2','clear'],
    ['whoami','Show your user name on this laptop','who user name whoami','#t2-2','whoami'],
    ['help','List the commands this terminal knows','help commands list','#t2-2','help']]},
   {g:'Real GitHub mode',l:[
    ['wipe-github','Delete every file in the connected GitHub repo (the history stays). Only in Real GitHub mode','wipe delete clear github real reset','#t2-3b','wipe-github']]}];
  /* Try it: open the Practice Lab and type the command for you (press Enter to run it) */
  function tryCmd(c){openLab(true);var i=$('pgIn');if(!i)return;setTimeout(function(){i.value=c;var at=c.indexOf('""');i.focus({preventScroll:true});var n=at>-1?at+1:c.length;try{i.setSelectionRange(n,n)}catch(z){}},80)}

  /* ---------- the Cheat Sheet app ---------- */
  var CS=makeWin('cheatWin','Cheat Sheet',I.cheat,tkCheat,560,600,{max:true});CS.body.classList.add('csb');addPin(CS,'cheatpin','the Cheat Sheet');
  CS.body.innerHTML='<div class="cshead"><input type="search" id="csQ" placeholder="Search commands, e.g. undo, branch, upload" autocomplete="off" aria-label="Search the cheat sheet" data-focus><small id="csN"></small></div><div class="cslist" id="csL"></div>';
  (function(){var h='';CHEAT.forEach(function(g,gi){h+='<section class="csg" data-g="'+gi+'"><h3>'+esc(g.g)+'</h3>'+g.l.map(function(c,ci){return '<div class="csr" data-g="'+gi+'" data-c="'+ci+'"><div class="cst"><code>'+esc(c[0])+'</code><button type="button" class="cscopy" data-copy="'+gi+'.'+ci+'" title="Copy it, to paste into your own Git Bash">Copy</button><button type="button" class="smtry" data-try="'+gi+'.'+ci+'" title="Type it in the Practice Lab">Try it</button></div><p>'+esc(c[1])+'</p></div>'}).join('')+'</section>'});
    $('csL').innerHTML=h+'<p class="csnone" id="csNone" hidden>Nothing found. Try "undo", "branch" or "upload".</p>'})();
  function csFilter(){var v=$('csQ').value.trim().toLowerCase(),words=v?v.split(/\s+/):[],n=0,tot=0;
    CS.body.querySelectorAll('.csg').forEach(function(sec){var gi=+sec.getAttribute('data-g'),any=false;
      sec.querySelectorAll('.csr').forEach(function(r){var c=CHEAT[gi].l[+r.getAttribute('data-c')],hay=(CHEAT[gi].g+' '+c[0]+' '+c[1]+' '+c[2]).toLowerCase(),on=words.every(function(w){return hay.indexOf(w)>-1});r.hidden=!on;tot++;if(on){n++;any=true}});sec.hidden=!any});
    $('csN').textContent=v?n+' of '+tot+' commands':tot+' commands';$('csNone').hidden=n>0}
  $('csQ').addEventListener('input',csFilter);$('csQ').addEventListener('keydown',function(e){e.stopPropagation();if(e.key==='Escape'&&$('csQ').value){e.preventDefault();$('csQ').value='';csFilter()}});
  /* Copy puts the command as shown on the clipboard (swap the <...> parts for your own names) */
  function copyText(t,done){function old(){var ta=document.createElement('textarea');ta.value=t;ta.setAttribute('readonly','');ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();var ok=false;try{ok=document.execCommand('copy')}catch(z){}ta.remove();done(ok)}
    if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(t).then(function(){done(true)},old);else old()}
  CS.body.addEventListener('click',function(e){var c=e.target.closest('[data-copy]');
    if(c){var q2=c.getAttribute('data-copy').split('.'),txt=CHEAT[+q2[0]].l[+q2[1]][0];copyText(txt,function(ok){c.textContent=ok?'Copied!':'Press Ctrl+C';c.classList.toggle('done',ok);clearTimeout(c._t);c._t=setTimeout(function(){c.textContent='Copy';c.classList.remove('done')},1600)});return}
    var b=e.target.closest('[data-try]');if(!b)return;var q=b.getAttribute('data-try').split('.');tryCmd(CHEAT[+q[0]].l[+q[1]][4])});
  csFilter();
  /* ---------- Start menu search: lessons, apps, your files, Git commands and settings, in groups ---------- */
  (function(){var Q=$('smQ'),R=$('smRes'),L=$('smList'),sm=$('startMenu');if(!Q||!R||!sm)return;
    Q.placeholder='Search lessons, apps, files...';Q.setAttribute('aria-label','Search lessons, apps, files, Git commands and settings');
    var acts=[];
    function low(x){return String(x).toLowerCase()}
    function hit(hay,words){hay=low(hay);return words.every(function(w){return hay.indexOf(w)>-1})}
    function lessons(){var out=[];document.querySelectorAll('section.phase').forEach(function(sec){var t=sec.querySelector('h2');if(!t)return;
      sec.querySelectorAll('.idx a').forEach(function(a){if(a.getAttribute('href')==='#t2-3b')return;out.push({h:a.getAttribute('href'),t:a.textContent.replace(/^\s*\d+\.\s*/,''),p:t.textContent})})});
      out.push({h:'#t1-5',t:'Setup and installation',p:'Introduction'});return out}
    var APPK={ws:'lessons workshop learn read exe',lab:'practice lab terminal git bash missions stories try commands',cheat:'cheat sheet commands list reference help all git bash terminal',vs:'vs code visual studio editor explorer source control',br:'browser internet web github repo search',setup:'setup guide website install installation first things first help web browser',
      draw:'notepad draw paint sketch pen',guide:'setup guide pdf install help windows linux',memes:'hehehe memes funny pictures images folder',credits:'suspects txt credits team names made by',bin:'bin trash recycle deleted restore'};
    /* everyday words people type, and the Git commands that do it */
    var CMDS=[];CHEAT.forEach(function(g){g.l.forEach(function(c){CMDS.push(c)})});
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
      var score=function(c){var k=low(c[2]),sc=0;words.forEach(function(w){if(k.indexOf(w)===0)sc+=3;else if((' '+k).indexOf(' '+w)>-1)sc+=1;if(low(c[0]).indexOf(w)>-1)sc+=1});return sc};
      var cmds=CMDS.filter(function(c){return hit(c[0]+' '+c[1]+' '+c[2],words)}).map(function(c,i){return [c,score(c),i]}).sort(function(a,b){return b[1]-a[1]||a[2]-b[2]}).map(function(x){return x[0]}).slice(0,8)
        .map(function(c){return '<div class="smcmd"><a class="smhit" href="'+c[3]+'"><code>'+esc(c[0])+'</code><small>'+esc(c[1])+'</small></a><button type="button" class="smtry" data-i="'+act(function(){tryCmd(c[4])})+'" title="Type it in the Practice Lab">Try it</button></div>'});
      var st=S(),fs=Object.keys(st.dirs).filter(function(d){return d!==HOME&&under(d,HOME)}).map(function(d){return [d,1]})
        .concat(Object.keys(st.files).filter(function(f){return under(f,HOME)}).map(function(f){return [f,0]}))
        .filter(function(x){return x[0].indexOf('/.git')<0&&hit(base(x[0]),words)}).slice(0,6)
        .map(function(x){return '<button type="button" class="smhit" data-i="'+act(function(){openFile(x[0])})+'"><i class="smic">'+(x[1]?I.folder:I.file)+'</i>'+esc(base(x[0]))+'<small>'+esc(tilde(dirname(x[0])))+'</small></button>'});
      var set=settings().filter(function(o){return hit(o.t+' '+o.k,words)}).slice(0,5)
        .map(function(o){return '<button type="button" class="smhit" data-i="'+act(o.fn)+'">'+esc(o.t)+(o.on?' <b class="smon">&#10003;</b>':'')+'<small>Setting</small></button>'});
      var h=grp('Apps',apps)+grp('Lessons',les)+grp('Git commands',cmds)+grp('Your files',fs)+grp('Settings',set);
      L.hidden=true;R.hidden=false;R.innerHTML=h||'<p>Nothing found. Try "branch", "undo", "notepad" or "wallpaper".</p>'}
    var lp=L&&L.querySelector('a.smp[href="#p5"]');if(lp){var lb=lp.querySelector('b');if(lb){lb.innerHTML=I.lab;lb.classList.add('smweb')}var sub=lp.nextElementSibling;if(sub&&sub.classList.contains('smsub'))sub.remove();var ar=lp.querySelector('em');if(ar)ar.remove()}
    Q.addEventListener('input',search);
    Q.addEventListener('keydown',function(e){if(e.key!=='Enter')return;e.preventDefault();search();var f=R.hidden?null:R.querySelector('.smhit');if(f)f.click()});
    R.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('button[data-i]');if(!b)return;e.stopPropagation();var fn=acts[+b.getAttribute('data-i')];sm.hidden=true;if(fn)fn()})})();
})();
