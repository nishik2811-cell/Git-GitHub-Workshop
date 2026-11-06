"""Make the slide pictures for the decks in resources/, so the Mini laptop can show them in Slides.

For every resources/<name>.pptx this writes resources/slides/<name>/s-01.jpg, s-02.jpg, ...
It needs LibreOffice (soffice) and pdftoppm (poppler-utils). Run it from the repo root after you
add or change a deck, then run  python3 src/sync.py :

    python3 src/slides.py
"""
import os,shutil,subprocess,sys,tempfile
if not os.path.isdir('resources'):sys.exit('Run this from the repo root (the folder with resources/ in it).')
for tool in ('soffice','pdftoppm'):
    if not shutil.which(tool):sys.exit(tool+' is not installed. Install LibreOffice and poppler-utils first.')
for name in sorted(os.listdir('resources')):
    if not name.lower().endswith('.pptx'):continue
    base=name[:-5];out=os.path.join('resources','slides',base)
    with tempfile.TemporaryDirectory() as tmp:
        subprocess.run(['soffice','--headless','--convert-to','pdf','--outdir',tmp,os.path.join('resources',name)],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
        pdf=os.path.join(tmp,base+'.pdf')
        if os.path.isdir(out):shutil.rmtree(out)
        os.makedirs(out)
        subprocess.run(['pdftoppm','-scale-to-x','1280','-scale-to-y','-1','-jpeg','-jpegopt','quality=78',pdf,os.path.join(out,'s')],check=True,stderr=subprocess.DEVNULL)
    print(name+':',len(os.listdir(out)),'slides')
