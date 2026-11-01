import base64
b='fontpkg/node_modules/@fontsource/'
def face(fam,pkg,w,fn):
    d=base64.b64encode(open(f'{b}{pkg}/files/{fn}','rb').read()).decode()
    return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:normal;font-display:swap;src:url(data:font/woff2;base64,{d}) format('woff2')}}\n"
jd=base64.b64encode(open(b+'jersey-10/files/jersey-10-latin-400-normal.woff2','rb').read()).decode()
css="@font-face{font-family:'Pixelify Sans';font-weight:100 900;font-style:normal;font-display:swap;size-adjust:128%;src:url(data:font/woff2;base64,"+jd+") format('woff2')}\n"
css+=face('Nunito','nunito',400,'nunito-latin-400-normal.woff2')+face('Nunito','nunito',600,'nunito-latin-600-normal.woff2')+face('Nunito','nunito',700,'nunito-latin-700-normal.woff2')
css+=face('Fira Code','fira-code',400,'fira-code-latin-400-normal.woff2')
t=open('template4.html').read().replace('{{FONT_CSS}}',css)
open('git_github_scrapbook_blue.html','w').write(t)
print(len(t)//1024,'KB')
