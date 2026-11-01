import re
exec(open('content4.py').read())
# header, marquee
icon_globe='<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="22" fill="#bcd8ff" stroke="#2b2f6b" stroke-width="3"/><ellipse cx="30" cy="30" rx="9" ry="22" fill="none" stroke="#2b2f6b" stroke-width="3"/><path d="M8 30h44M12 18h36M12 42h36" fill="none" stroke="#2b2f6b" stroke-width="3"/></svg>'
icon_folder='<svg viewBox="0 0 60 60"><path d="M6 14h18l5 6h25v30H6z" fill="#ffeb8f" stroke="#2b2f6b" stroke-width="3" stroke-linejoin="round"/><path d="M6 26h48" stroke="#2b2f6b" stroke-width="3"/></svg>'
icon_branch='<svg viewBox="0 0 60 60"><path d="M18 18v24" stroke="#2b2f6b" stroke-width="3.5" fill="none"/><path d="M18 40C18 28 42 34 42 24" stroke="#2b2f6b" stroke-width="3.5" fill="none"/><circle cx="18" cy="12" r="7" fill="#ffc3de" stroke="#2b2f6b" stroke-width="3"/><circle cx="18" cy="48" r="7" fill="#c4f0c9" stroke="#2b2f6b" stroke-width="3"/><circle cx="42" cy="18" r="7" fill="#bcd8ff" stroke="#2b2f6b" stroke-width="3"/></svg>'
icon_note='<svg viewBox="0 0 60 60"><rect x="10" y="8" width="38" height="44" rx="4" fill="#fff" stroke="#2b2f6b" stroke-width="3"/><path d="M17 20h24M17 29h24M17 38h14" stroke="#2b2f6b" stroke-width="3"/><path d="M40 52l4-14 10-10 6 6-10 10z" fill="#ffeb8f" stroke="#2b2f6b" stroke-width="3" stroke-linejoin="round"/></svg>'
cursor='<svg width="26" height="34" viewBox="0 0 24 32" aria-hidden="true"><polygon points="3,2 3,25 9,20 13,30 17,28 13,19 21,19" fill="#fff" stroke="#2b2f6b" stroke-width="2.5" stroke-linejoin="round"/></svg>'
txt='GIT AND GITHUB WORKSHOP ★ COMMIT ★ PUSH ★ PULL ★ BRANCH ★ MERGE ★ CLONE ★ FORK ★ '
head=('<div class="marquee"><div class="mq"><span>'+txt*3+'</span><span>'+txt*3+'</span></div></div>\n'
 '<div class="loadwrap"><span class="lbl" id="loadLbl">LOADING... 0%</span><div class="loadbar"><i id="loadFill"></i></div></div>\n'
 '<div class="wrap">\n<header>\n<div class="heroframe">\n'
 '<div class="card hero"><div class="tbar t-a"><span>GIT-WORKSHOP.EXE</span><span class="xbtn"></span></div>\n'
 '<div class="scene"><h1>Git and GitHub</h1><div class="tag">Warning: may cause sudden confidence</div>\n'
 '<a class="start" href="#p1">START</a><i class="sp sp-hand bob"></i>\n'
 '<i class="sp sp-sparkle bob" style="right:12%;top:3%;height:72px"></i><i class="sp sp-sparkle bob2" style="right:4%;top:14%;height:44px"></i><i class="sp sp-sparkle bob2" style="right:22%;top:20%;height:34px"></i>\n'
 '<i class="sp sp-cursor c1"></i><i class="sp sp-cursor c2"></i><i class="sp sp-cursor c3"></i><i class="sp sp-heart bob2" style="left:36%;top:57%;height:26px"></i><i class="sp sp-heart bob" style="left:46%;top:62%;height:18px"></i><i class="sp sp-heartb bob2" style="left:31%;bottom:12%;height:48px"></i><i class="sp sp-rock" style="left:0;bottom:0;height:120px"></i><i class="sp sp-flower" style="left:17%;bottom:3%;height:46px"></i><i class="sp sp-tuft" style="left:21%;bottom:0;height:60px"></i>\n'
 '<i class="sp sp-pad bob hide-m" style="right:2%;top:57%;height:58px"></i><i class="sp sp-bubble" style="right:11%;bottom:21%;height:44px"></i><button class="folderbtn bob2" id="heroFolder" aria-label="Open the folder" title="Click me"><i class="sp sp-folder" style="height:92px;position:static"></i></button>\n'
 '\n'
 '<div class="mdlg"><div class="dh"><span>WARNING</span><span>x</span></div><div class="db">DO YOU WANT<br>TO GO BACK ?<div class="row"><button id="heroYes">Yes</button><button id="heroNo">No</button></div></div></div>\n'
 '</div></div></div>\n<nav class="icons">\n'

 '<a href="#p1">'+icon_globe+'INTRO</a><a href="#p2">'+icon_folder+'REPOS</a><a href="#p3">'+icon_branch+'BRANCHES</a><a href="#p4">'+icon_note+'TIDY-UP</a>\n</nav>\n</header>\n')
foot='\n<div class="signoff"><div class="bar">SIGN-OFF.TXT</div><pre>$ git commit -m "crafted with <span class=\"p\">&#9829;</span> by <span class=\"y\">Nishita</span>, <span class=\"y\">Vasu</span>, <span class=\"y\">Yashieta</span>, <span class=\"y\">Abhinav</span> &amp; <span class=\"y\">Aryan</span>"\n<span class=\"g\">[main 5f3a9c1] 5 friends, 1 workshop, 0 merge conflicts</span></pre></div>\n<footer>git-and-github-workshop.exe finished loading &#9733;</footer>\n</div>\n'
js=open('app4.js').read()+'\n'+open('playground.js').read()
POP='<div class="ov" id="ov" hidden><div class="dlg popup" role="dialog" aria-modal="true"><div class="dh"><span id="ovT"></span><button class="x" id="ovX" aria-label="Close">x</button></div><div class="db"><p id="ovP" style="margin:0 0 12px"></p><div class="btns" id="ovB" style="margin:0;justify-content:center"></div></div></div></div>\n'
POP+='<div class="startmenu" id="startMenu" hidden><div class="smh">Git &amp; GitHub Workshop</div><div class="smsearch"><input id="smQ" type="search" placeholder="Search topics..." autocomplete="off" aria-label="Search topics"></div><div class="smlist" id="smList"></div><div class="smres" id="smRes" hidden></div><div class="smfoot"><a href="#top" id="smTop">&#9650; Back to the top</a></div></div>\n<div class="taskbar" id="taskbar"><button class="startbtn" id="startBtn"><i></i>start</button><span class="tk">&#9638; git-and-github-workshop.exe</span><span class="tray"><span id="clock">00:00</span></span></div>\n'
html='<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>Git and GitHub Workshop</title>\n<style>\n'+open('theme.css').read()+open('layout.css').read()+open('layout4.css').read()+open('art.css').read()+'</style>\n</head>\n<body>\n'+head+phases+foot+POP+'<script>\n'+js+'\n</script>\n</body>\n</html>\n'
html=html.replace('#2b2f6b','#16327a').replace('#2f56b8','#1d4ba6').replace('#2f6a9f','#1d4ba6')
open('template4.html','w').write(html)
print(len(html)//1024,'KB')
