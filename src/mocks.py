def pin(n,html,block=False):
    return '<span class="pw%s">%s<span class="co">%d</span></span>'%(' blk' if block else '',html,n)
def fig(inner,legend=(),cap=''):
    leg=''.join('<li><span class="co">%d</span><span>%s</span></li>'%(i+1,t) for i,t in enumerate(legend))
    return '<figure class="fig"><div class="shotwrap">%s</div>%s%s</figure>'%(inner,('<ol class="legend">'+leg+'</ol>') if leg else '','<figcaption>%s</figcaption>'%cap if cap else '')
def browser(url,body):
    return '<div class="shot"><div class="chrome"><i></i><i></i><i></i><span class="url">%s</span></div>%s</div>'%(url,body)
def m_download():
    b=('<div style="background:#2b2f3a;color:#fff;padding:8px 16px;display:flex;gap:18px;font-size:12px"><b>git-scm.com</b><span>About</span><span>Documentation</span><span>Downloads</span><span>Community</span></div>'
       '<div class="ghbody" style="text-align:center;padding:26px 16px"><div style="font-size:20px;font-weight:700;margin-bottom:6px">Download for Windows</div>'
       '<div style="color:#57606a;margin-bottom:16px">Click here to download the latest version of Git for Windows (64-bit).</div>'
       +pin(1,'<div style="display:inline-block;background:#1d4ba6;color:#fff;border-radius:6px;padding:8px 22px;font-weight:700">Click here to download</div>')+'</div>')
    return browser('git-scm.com/download/win',b)
def m_inst_next():
    return ('<div class="shot"><div class="winbar"><span>Git Setup</span><b>_ &#9633; x</b></div><div class="inst"><div class="side">Setup</div><div class="main"><b style="font-size:14px">Information</b><p style="margin:6px 0">Please read the following important information before continuing.</p><p style="margin:0;color:#555">Click Next to continue.</p></div></div>'
            '<div class="btnrow"><span>&lt; Back</span>'+pin(1,'<span class="def">Next &gt;</span>')+'<span>Cancel</span></div></div>')
def m_inst_branch():
    return ('<div class="shot"><div class="winbar"><span>Git Setup</span><b>_ &#9633; x</b></div><div class="inst"><div class="side">Setup</div><div class="main"><b style="font-size:14px">Adjusting the name of the initial branch</b>'
            '<div class="radio"><i></i><span>Let Git decide</span></div>'
            +pin(1,'<div class="radio" style="margin:7px 0"><i class="on"></i><span>Override the default branch name for new repositories<br><span style="display:inline-block;border:1px solid #888;background:#fff;padding:0 30px;margin-top:3px">main</span></span></div>',True)
            +'</div></div><div class="btnrow"><span>&lt; Back</span><span class="def">Next &gt;</span><span>Cancel</span></div></div>')
def m_start():
    return ('<div class="shot" style="background:#2b2f3a;color:#fff;padding:14px"><div style="background:#fff;color:#222;border-radius:20px;padding:5px 14px;margin-bottom:10px">Git Bash</div>'
            '<div style="color:#aab;margin-bottom:4px;font-size:11.5px">Best match</div>'
            +pin(1,'<div style="background:#3d6bc4;border-radius:6px;padding:7px 12px;min-width:260px"><b>Git Bash</b><span style="color:#cfe0ff"> &nbsp; App</span></div>',True)+'</div>')
def m_gitbash(body=None):
    p='<span class="g">you@DESKTOP-1A2B</span> <span class="p">MINGW64</span> <span class="y">~</span>\n'
    body=body or (p+'$ git --version\ngit version 2.xx.x\n\n'+p+'$ _')
    return '<div class="shot"><div class="winbar"><span>MINGW64:/c/Users/you</span><b>_ &#9633; x</b></div><div class="gb">%s</div></div>'%body
def m_gitlog():
    p='<span class="g">you@DESKTOP-1A2B</span> <span class="p">MINGW64</span> <span class="y">~/recipes</span> <span style="color:#6ab0f3">(main)</span>\n'
    return m_gitbash(p+'$ git log --oneline\n<span class="y">a3f9c21</span> add pasta recipe\n<span class="y">9bd04e7</span> add results\n<span class="y">3f8a1c2</span> add intro\n\n'+p+'$ _')
def m_mac():
    return ('<div class="shot"><div class="mac-dots"><i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i><span style="margin-left:10px">you - zsh - 80x24</span></div>'
            '<div class="mt">you@MacBook ~ % git --version\ngit version 2.xx.x\nyou@MacBook ~ % _</div></div>')
def m_macpopup():
    return ('<div class="dlgmac"><div style="width:40px;height:40px;border-radius:9px;background:#9aa4b5;margin:0 auto 8px"></div>'
            '<div style="font-weight:700;margin-bottom:4px">The "git" command requires the command line developer tools.</div><div style="font-size:12px;color:#555">Would you like to install the tools now?</div>'
            '<div class="row"><span>Cancel</span>'+pin(1,'<span class="pri">Install</span>')+'</div></div>')
def m_linux():
    return ('<div class="shot"><div class="mac-dots" style="background:#3a3a3a;color:#ddd;border-color:#222"><span>you@ubuntu: ~</span></div>'
            '<div class="lt"><span class="g">you@ubuntu</span>:<span class="b">~</span>$ sudo apt update\n<span class="g">you@ubuntu</span>:<span class="b">~</span>$ sudo apt install git\n<span class="g">you@ubuntu</span>:<span class="b">~</span>$ git --version\ngit version 2.xx.x\n<span class="g">you@ubuntu</span>:<span class="b">~</span>$ _</div></div>')
def ghbar(extra=''):
    return '<div class="ghbar"><span class="logo"></span><span class="search">Type / to search</span><span class="sp"></span>%s<span class="av"></span></div>'%extra
def m_signup():
    b=(ghbar().replace('<span class="search">Type / to search</span>','<b>Sign up</b>')+'<div class="ghbody" style="max-width:340px;margin:0 auto"><div style="font-size:18px;font-weight:700;margin:4px 0 10px">Create your account</div>'
       '<span class="lbl2">Email</span>'+pin(1,'<div class="field">you@example.com</div>')
       +'<span class="lbl2">Password</span>'+pin(2,'<div class="field">&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;</div>')
       +'<span class="lbl2">Username</span>'+pin(3,'<div class="field">your-username</div>')
       +'<div style="margin-top:12px">'+pin(4,'<span class="btn-g">Create account</span>')+'</div>'+'</div>')
    return browser('github.com/signup',b)
def m_home():
    menu=('<div style="display:flex;justify-content:flex-end;padding:4px 40px 0 0"><div style="border:1px solid #d0d7de;border-radius:8px;width:180px;background:#fff;box-shadow:0 4px 14px rgba(0,0,0,.15)">'
          +pin(2,'<div style="padding:7px 12px;background:#e8f0ff;font-weight:600;width:156px">New repository</div>')+'<div style="padding:7px 12px">Import repository</div><div style="padding:7px 12px">New gist</div></div></div>')
    b=(ghbar(pin(1,'<span class="plus">+ &#9662;</span>'))+menu+'<div class="ghbody" style="display:flex;gap:16px"><div style="width:150px;color:#57606a"><b style="color:#24292f">Top repositories</b><br>you/my-first-repo<br>you/recipes</div><div style="flex:1;color:#57606a">Your home feed shows updates from the projects you follow.</div></div>')
    return browser('github.com',b)
def m_new():
    b=(ghbar()+'<div class="ghbody"><div style="font-size:17px;font-weight:700;margin-bottom:8px">Create a new repository</div>'
       '<span class="lbl2">Repository name</span>'+pin(1,'<div class="field" style="width:260px">my-first-repo</div>')
       +'<div style="margin-bottom:8px">'+pin(2,'<span><b>(o)</b> Public &nbsp;&nbsp; <b>( )</b> Private</span>')+'</div>'
       +'<div style="margin-bottom:10px">'+pin(3,'<span>[x] Add a README file</span>')+'</div>'
       +'<div style="margin-top:4px">'+pin(4,'<span class="btn-g">Create repository</span>')+'</div>'+'</div>')
    return browser('github.com/new',b)
def m_repo():
    head=('<div class="ghbody" style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">'+pin(1,'<b style="font-size:16px">you / my-first-repo</b>')
          +'<span class="btn-gray" style="border-radius:20px;font-size:11px;padding:0 8px">Public</span><span style="flex:1"></span><span class="btn-gray">Watch</span>'+pin(5,'<span class="btn-gray">Fork</span>')+'<span class="btn-gray">Star</span></div>')
    tabs=pin(2,'<div class="tabsrow" style="padding:0"><span class="act">Code</span><span>Issues</span><span>Pull requests</span><span>Actions</span><span>Settings</span></div>',True)
    row='<div class="ghbody" style="display:flex;align-items:center;gap:10px"><span class="btn-gray">main &#9662;</span><span style="color:#57606a">1 Branch</span><span style="flex:1"></span>'+pin(4,'<span class="btn-g">&lt;&gt; Code &#9662;</span>')+'</div>'
    files=pin(3,'<div class="flist"><div><b>you</b><span>Initial commit</span><em>2 min ago</em></div><div><b>README.md</b><span>Initial commit</span><em>2 min ago</em></div><div><b>index.html</b><span>Add home page</span><em>1 min ago</em></div><div><b>style.css</b><span>Add styles</span><em>1 min ago</em></div></div>',True)
    return browser('github.com/you/my-first-repo',ghbar()+head+tabs+row+files)
def m_repo_head():
    head=('<div class="ghbody" style="display:flex;align-items:center;gap:10px;flex-wrap:wrap"><b style="font-size:16px">octo-team / website</b>'
          '<span class="btn-gray" style="border-radius:20px;font-size:11px;padding:0 8px">Public</span><span style="flex:1"></span><span class="btn-gray">Watch</span>'+pin(1,'<span class="btn-gray">Fork</span>')+'<span class="btn-gray">Star</span></div>')
    return browser('github.com/octo-team/website',ghbar()+head)
def m_clone():
    inner=('<div style="max-width:340px;border:1px solid #d0d7de;border-radius:10px;background:#fff;font-family:system-ui,sans-serif;font-size:12.5px;color:#1f2328;overflow:hidden;border:2.5px solid #16327a">'
           '<div style="display:flex;border-bottom:1px solid #d0d7de;background:#f6f8fa"><span style="padding:8px 12px;font-weight:600;border-bottom:2px solid #fd8c73">Local</span><span style="padding:8px 12px">Codespaces</span></div>'
           '<div style="padding:10px 12px"><b>Clone</b><div style="margin:6px 0"><b style="border-bottom:2px solid #fd8c73">HTTPS</b> &nbsp; SSH &nbsp; GitHub CLI</div>'
           '<div style="display:flex;gap:6px;align-items:center"><div class="field" style="flex:1;margin:0;font-size:11.5px">https://github.com/you/my-first-repo.git</div>'+pin(1,'<span class="btn-gray">copy</span>')+'</div>'
           '<div style="margin-top:8px;color:#57606a">Download ZIP</div></div></div>')
    return inner
def m_pr():
    b=(ghbar()+'<div class="ghbody"><div style="font-size:17px;font-weight:700">Add login page <span style="color:#57606a;font-weight:400">#12</span></div>'
       '<div style="margin:4px 0 8px"><span class="btn-g" style="padding:1px 10px;border-radius:20px">Open</span> &nbsp;Meera wants to merge 3 commits into <b>main</b> from <b>feature/login</b></div></div>'
       '<div class="tabsrow"><span class="act">Conversation 2</span><span>Commits 3</span>'+pin(1,'<span>Files changed 2</span>')+'</div>'
       '<div class="ghbody"><div class="flist" style="margin:0 0 10px"><div><b style="width:60px">Aarav</b><span>Looks good! Can you rename the button?</span></div></div>'
       '<div style="border:1px solid #2da44e;border-radius:6px;padding:10px 12px;background:#f0fff4"><b>This branch has no conflicts with the base branch</b><div style="margin-top:8px">'+pin(2,'<span class="btn-g">Merge pull request</span>')+'</div></div></div>')
    return browser('github.com/you/my-first-repo/pull/12',b)
