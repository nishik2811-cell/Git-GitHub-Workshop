"""Copy src/playground.js, src/desktop.js and src/desktop.css into index.html.
Run from the repo root:  python3 src/sync.py"""
import re
h=open('index.html',encoding='utf-8').read()
pg=open('src/playground.js',encoding='utf-8').read()
dj=open('src/desktop.js',encoding='utf-8').read()
dc=open('src/desktop.css',encoding='utf-8').read()

# playground: from its opening line to the first "  reset();\n})();" after it
start=h.index("(function(){\n  if(!document.getElementById('pg'))return;")
end=h.index("  reset();\n})();",start)+len("  reset();\n})();")
pgs=pg.strip()
assert pgs.startswith("(function(){\n  if(!document.getElementById('pg'))return;") and pgs.endswith("  reset();\n})();")
h=h[:start]+pgs+h[end:]

# desktop css: its own block at the end of the main <style>
CS='/* ---------- Mini laptop desktop: boot screen, desktop, windows, menus ---------- */'
if CS in h:
    a=h.index(CS);b=h.index('/* ---------- end Mini laptop desktop css ---------- */',a)
    h=h[:a]+h[b+len('/* ---------- end Mini laptop desktop css ---------- */'):]
i=h.index('</style>')
h=h[:i]+dc.strip()+'\n/* ---------- end Mini laptop desktop css ---------- */\n'+h[i:]

# desktop js: its own <script id="deskjs"> just before </body>
h=re.sub(r'<script id="deskjs">.*?</script>\n?','',h,flags=re.S)
i=h.rindex('</body>')
h=h[:i]+'<script id="deskjs">\n'+dj.strip()+'\n</script>\n'+h[i:]
open('index.html','w',encoding='utf-8').write(h)
print('index.html updated:',len(h)//1024,'KB')
