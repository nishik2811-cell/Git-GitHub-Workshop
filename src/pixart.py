import base64,io,math,random
from PIL import Image,ImageDraw,ImageFilter
INK=(22,50,122,255)
def uri(im,scale=4):
    im=im.resize((im.width*scale,im.height*scale),Image.NEAREST)
    b=io.BytesIO();im.save(b,'PNG',optimize=True)
    return 'data:image/png;base64,'+base64.b64encode(b.getvalue()).decode()
def hexc(h):
    h=h.lstrip('#');return tuple(int(h[i:i+2],16) for i in (0,2,4))+(255,)
def outline(im,col=INK):
    a=im.split()[3].point(lambda v:255 if v>0 else 0)
    big=Image.new('RGBA',(im.width+4,im.height+4),(0,0,0,0));big.paste(im,(2,2))
    a=big.split()[3].point(lambda v:255 if v>0 else 0)
    d=Image.new('L',big.size,0)
    px=a.load();dp=d.load()
    for y in range(big.height):
        for x in range(big.width):
            if px[x,y]:
                for dx,dy in((1,0),(-1,0),(0,1),(0,-1)):
                    X,Y=x+dx,y+dy
                    if 0<=X<big.width and 0<=Y<big.height:dp[X,Y]=255
    o=Image.new('RGBA',big.size,col);o.putalpha(d)
    o.alpha_composite(big);return o
def ascii_sprite(rows,cmap):
    h=len(rows);w=max(len(r) for r in rows)
    im=Image.new('RGBA',(w,h),(0,0,0,0))
    for y,r in enumerate(rows):
        for x,c in enumerate(r):
            if c in cmap:im.putpixel((x,y),hexc(cmap[c]))
    return im
def heart(fill,hi):
    n=15;im=Image.new('RGBA',(n,n),(0,0,0,0))
    for y in range(n):
        for x in range(n):
            X=(x-7)/6.2;Y=-(y-6.5)/6.2
            if (X*X+Y*Y-1)**3-X*X*Y**3<=0:im.putpixel((x,y),hexc(fill))
    im.putpixel((3,4),hexc(hi));im.putpixel((4,3),hexc(hi));im.putpixel((3,3),hexc(hi))
    return outline(im)
def sparkle(c1,c2):
    n=15;im=Image.new('RGBA',(n,n),(0,0,0,0))
    for y in range(n):
        for x in range(n):
            X=abs(x-7);Y=abs(y-7)
            if (X+1)*(Y+1)<=4 and X+Y<=7:im.putpixel((x,y),hexc(c1))
            if (X+1)*(Y+1)<=1:im.putpixel((x,y),hexc(c2))
    return im
def star(c):
    n=17;im=Image.new('RGBA',(n,n),(0,0,0,0));d=ImageDraw.Draw(im)
    pts=[]
    for i in range(10):
        r=8 if i%2==0 else 3.6;a=-math.pi/2+i*math.pi/5
        pts.append((8+r*math.cos(a),8.5+r*math.sin(a)))
    d.polygon(pts,fill=hexc(c));return outline(im)
def cursor():
    rows=["X","XX","XWX","XWWX","XWWWX","XWWWWX","XWWWWWX","XWWWWWWX","XWWWWWWWX","XWWWWWWWWX","XWWWWWXXXXX","XWWXWWX","XWX.XWWX","XX..XWWX","X....XWWX",".....XWWX","......XX"]
    return ascii_sprite(rows,{'X':'#16327a','W':'#ffffff'})
def hand():
    rows=["....XX......","...XWWX.....","...XWWX.....","...XWWX.....","...XWWXXX...","...XWWXWWXX.","XX.XWWXWWXWX","XWXXWWWWWWWX","XWWXWWWWWWWX",".XWWWWWWWWWX","..XWWWWWWWWX","..XWWWWWWWX.","...XWWWWWWX.","...XWWWWWX..","....XXXXXX.."]
    return ascii_sprite(rows,{'X':'#16327a','W':'#ffffff'})
def gamepad():
    im=Image.new('RGBA',(30,16),(0,0,0,0));d=ImageDraw.Draw(im)
    d.rectangle([3,2,26,11],fill=hexc('#f1f1f1'));d.rectangle([1,5,4,13],fill=hexc('#f1f1f1'));d.rectangle([25,5,28,13],fill=hexc('#f1f1f1'))
    d.rectangle([4,3,26,4],fill=hexc('#ffffff'))
    d.rectangle([6,6,10,7],fill=hexc('#5a6070'));d.rectangle([7,5,9,9],fill=hexc('#5a6070'))
    for (x,y,c) in((21,4,'#ef5350'),(24,7,'#42a5f5'),(21,9,'#66bb6a'),(18,7,'#ffca28')):
        d.rectangle([x,y,x+1,y+1],fill=hexc(c))
    d.rectangle([12,6,17,8],fill=hexc('#b8bcc8'))
    return outline(im)
def folder():
    im=Image.new('RGBA',(28,22),(0,0,0,0));d=ImageDraw.Draw(im)
    d.rectangle([1,2,10,5],fill=hexc('#f0e060'))
    d.rectangle([1,5,26,19],fill=hexc('#f4ec76'))
    d.rectangle([3,8,26,19],fill=hexc('#ffff9e'))
    d.rectangle([3,17,26,19],fill=hexc('#d8cc4a'))
    for y in (9,12):d.line([4,y,24,y],fill=hexc('#fffcc8'))
    return outline(im)
def cloud():
    im=Image.new('RGBA',(34,18),(0,0,0,0));d=ImageDraw.Draw(im)
    for (cx,cy,r) in((9,11,5),(16,8,7),(24,11,5),(19,12,6),(12,12,5)):d.ellipse([cx-r,cy-r,cx+r,cy+r],fill=hexc('#ffffff'))
    d.rectangle([4,12,28,16],fill=hexc('#ffffff'));d.rectangle([4,15,28,16],fill=hexc('#cfe0ff'))
    return outline(im)
def flower(petal):
    rows=[".PP.",
          "PYYP",
          "PYYP",
          ".PP.",
          "..G.",
          ".GG.",
          "..G."]
    return outline(ascii_sprite(rows,{'P':petal,'Y':'#ffe36e','G':'#4f9d3a'}))
def speech():
    im=Image.new('RGBA',(22,16),(0,0,0,0));d=ImageDraw.Draw(im)
    d.rectangle([1,1,20,11],fill=hexc('#ffffff'));d.polygon([(4,11),(9,11),(4,15)],fill=hexc('#ffffff'))
    h=heart('#ff8fba','#ffffff').crop((2,2,17,17)).resize((9,9),Image.NEAREST)
    im.alpha_composite(h,(6,2))
    return outline(im)
def rock():
    im=Image.new('RGBA',(34,34),(0,0,0,0));d=ImageDraw.Draw(im)
    d.polygon([(2,32),(6,12),(13,3),(20,10),(26,6),(32,32)],fill=hexc('#8d8794'))
    d.polygon([(2,32),(6,12),(13,3),(14,32)],fill=hexc('#b3adbb'))
    d.polygon([(20,10),(26,6),(32,32),(22,32)],fill=hexc('#6c6676'))
    d.line([(11,10),(10,26)],fill=hexc('#5d5766'))
    return outline(im)
def tuft():
    im=Image.new('RGBA',(30,26),(0,0,0,0));d=ImageDraw.Draw(im)
    for (x,h,c) in((4,18,'#5dbb4a'),(9,24,'#3f9a36'),(14,20,'#6fd05a'),(19,25,'#2f8a30'),(24,16,'#5dbb4a')):
        d.polygon([(x-3,26),(x,26-h),(x+3,26)],fill=hexc(c))
    return outline(im)
# --------- landscapes ----------
PAL={
 'day':dict(sky=['#8fc4e8','#a8d4ee','#bfe0f0','#d6ecf2','#f0e8cc'],cloud=('#ffffff','#e4eff7','#c5d9ea'),far='#6b8fb4',far2='#8aa9c6',mid='#4f8a6e',mid2='#3f7a5e',field=['#7cab48','#68993f','#548735'],blade='#2d5a2a',stars=False),
 'spring':dict(sky=['#6ec0ea','#8fd2f0','#b0e2f4','#d0f0f2','#f4f2c8'],cloud=('#ffffff','#ecf6fb','#cfe4f0'),far='#5fa3b8',far2='#7ebccb',mid='#58a35a',mid2='#438f4c',field=['#8fcb4e','#78b843','#62a338'],blade='#2e6f2c',stars=False),
 'dusk':dict(sky=['#4a4f9c','#7a62ad','#b878b4','#e89aa8','#ffc990'],cloud=('#ffd9cf','#e7a8b8','#b678ac'),far='#4b4a8a',far2='#615c9c',mid='#3b5c80',mid2='#2f4a72',field=['#4f7a5a','#3f6a52','#315a48'],blade='#1d3b3a',stars=False),
 'night':dict(sky=['#0f1c4d','#1a2d6b','#27418a','#3a58a6','#5c7ec0'],cloud=('#5470b4','#3c5698','#2c4180'),far='#22356f',far2='#2c4482',mid='#1f4a62',mid2='#173b52',field=['#2a5a54','#214b48','#193c3c'],blade='#0f2a2e',stars=True),
}
def landscape(name,w,h,seed=1):
    P=PAL[name];rnd=random.Random(seed)
    im=Image.new('RGBA',(w,h));px=im.load()
    skyh=int(h*.62);cols=[hexc(c) for c in P['sky']]
    nb=len(cols)
    for y in range(h):
        t=min(y/skyh,1)*(nb-1);i=int(t);f=t-i
        for x in range(w):
            c=cols[min(i,nb-1)]
            if i<nb-1:
                th=f*4
                bayer=[[0,2],[3,1]][y%2][x%2]
                if th>bayer+.5:c=cols[i+1]
            px[x,y]=c
    d=ImageDraw.Draw(im)
    if P['stars']:
        for _ in range(w*h//90):
            x=rnd.randrange(w);y=rnd.randrange(int(skyh*.7));px[x,y]=hexc('#ffffff' if rnd.random()<.6 else '#ffe9a0')
    # clouds
    c1,c2,c3=[hexc(c) for c in P['cloud']]
    for _ in range(max(3,w//28)):
        cx=rnd.randrange(w);cy=rnd.randrange(3,int(skyh*.7));sc=rnd.uniform(.8,1.7)
        blobs=[(cx+rnd.randint(-int(9*sc),int(9*sc)),cy+rnd.randint(-2,2),rnd.randint(int(3*sc),int(6*sc))) for _ in range(5)]
        for (bx,by,r) in blobs:d.ellipse([bx-r,by-r*.7,bx+r,by+r*.7],fill=c3)
        for (bx,by,r) in blobs:d.ellipse([bx-r,by-r*.7-1,bx+r,by+r*.7-1],fill=c2)
        for (bx,by,r) in blobs:d.ellipse([bx-r+1,by-r*.7-2,bx+r-1,by+r*.7-2],fill=c1)
    def ridge(base,amp,seed2,col,col2=None):
        r2=random.Random(seed2);ph=[r2.uniform(0,6.28) for _ in range(3)];fr=[r2.uniform(.04,.09),r2.uniform(.1,.17),r2.uniform(.22,.3)]
        for x in range(w):
            y=base-amp*(.6*math.sin(x*fr[0]+ph[0])+.3*math.sin(x*fr[1]+ph[1])+.12*math.sin(x*fr[2]+ph[2]))
            y=int(y)
            for yy in range(y,h):
                c=col
                if col2 and yy<y+2:c=col2
                px[x,yy]=hexc(c) if isinstance(c,str) else c
    ridge(skyh-h*.02,h*.17,seed+11,P['far'],P['far2'])
    ridge(skyh+h*.06,h*.11,seed+23,P['mid'],P['mid2'])
    # field
    fy=int(h*.74)
    fc=[hexc(c) for c in P['field']]
    for y in range(fy,h):
        t=(y-fy)/(h-fy);i=min(int(t*3),2)
        for x in range(w):
            c=fc[i]
            if t*3-i>.7 and (x+y)%2==0 and i<2:c=fc[i+1]
            px[x,y]=c
    # texture dots, flowers
    for _ in range(w*(h-fy)//14):
        x=rnd.randrange(w);y=rnd.randrange(fy,h);px[x,y]=hexc(P['blade'])
    fl=['#ff7fb0','#ffe36e','#ffffff','#b99bff']
    for _ in range(w//9):
        x=rnd.randrange(2,w-2);y=rnd.randrange(fy+2,h-3);c=hexc(rnd.choice(fl))
        px[x,y]=c;px[x,y+1]=hexc('#3f9a36')
    # tall blades at the bottom
    bl=hexc(P['blade'])
    for x in range(w):
        if rnd.random()<.55:
            hh=rnd.randint(2,6)
            for k in range(hh):
                if h-1-k>=0:px[x,h-1-k]=bl
    return im

def landscape2(name,w,h,seed=1):
    # clean flat-colour scene: no dither, no noise
    P={'day':('#9fd0f2','#bfe0f6','#d9eefa','#eef7fb','#ffffff','#7fa6d0','#5f9a6a','#7fbf5a','#5ea545'),
       'spring':('#8fd0f4','#b2e2f8','#d2f0fb','#eef9fc','#ffffff','#76b6d0','#5fae6a','#86cc5c','#63ad47'),
       'dusk':('#6c63b4','#9b78bf','#d58fb4','#f2aa9c','#ffe3d0','#5d5a9c','#486c88','#5f9a6a','#478456'),
       'night':('#16275f','#223a80','#314f9a','#4666b0','#dfe9ff','#2a3f86','#27506a','#2f6a5e','#255850')}[name]
    im=Image.new('RGBA',(w,h));d=ImageDraw.Draw(im)
    skyh=int(h*.68)
    for i in range(4):
        y0=int(skyh*i/4);y1=int(skyh*(i+1)/4)
        d.rectangle([0,y0,w,y1],fill=hexc(P[i]))
    cl=hexc(P[4]);rnd=random.Random(seed)
    for _ in range(max(2,w//34)):
        cx=rnd.randrange(w);cy=rnd.randrange(3,int(skyh*.55));sc=rnd.randint(4,7)
        d.rectangle([cx-sc*2,cy,cx+sc*2,cy+sc//2+1],fill=cl)
        d.rectangle([cx-sc,cy-sc//2-1,cx+sc,cy],fill=cl)
        d.rectangle([cx+sc//2,cy-sc,cx+sc+1,cy-sc//2],fill=cl)
    def ridge(base,amp,sd,col):
        r=random.Random(sd);ph=r.uniform(0,6);f=r.uniform(.035,.06)
        for x in range(w):
            y=int(base-amp*math.sin(x*f+ph)-amp*.4*math.sin(x*f*2.3+ph*2))
            d.rectangle([x,y,x,h],fill=hexc(col))
    ridge(skyh-2,h*.12,seed+1,P[5])
    ridge(skyh+h*.05,h*.08,seed+2,P[6])
    fy=int(h*.78)
    d.rectangle([0,fy,w,h],fill=hexc(P[7]))
    d.rectangle([0,fy+(h-fy)//2,w,h],fill=hexc(P[8]))
    for _ in range(w//10):
        x=rnd.randrange(2,w-2);y=rnd.randrange(fy+2,h-2)
        d.point((x,y),fill=hexc(rnd.choice(['#ffffff','#ffd0e4','#fff2a0'])))
    return im
def cursor_css():
    arrow=ascii_sprite(["X","XX","XWX","XWWX","XWWWX","XWWWWX","XWWWWWX","XWWWWWWX","XWWWWWWWX","XWWWWWWWWX","XWWWWWXXXXX","XWWXWWX","XWX.XWWX","XX..XWWX","X....XWWX",".....XWWX","......XX"],{'X':'#101010','W':'#ffffff'})
    hand_=ascii_sprite(["....XX......","...XWWX.....","...XWWX.....","...XWWX.....","...XWWXXX...","...XWWXWWXX.","XX.XWWXWWXWX","XWXXWWWWWWWX","XWWXWWWWWWWX",".XWWWWWWWWWX","..XWWWWWWWWX","..XWWWWWWWX.","...XWWWWWWX.","...XWWWWWX..","....XXXXXX.."],{'X':'#101010','W':'#ffffff'})
    a=uri(arrow,2);h=uri(hand_,2)
    return ("html,body,*{cursor:url(%s) 1 1,auto}\na,a *,button,button *,summary,label,.flip,.flip *,input[type=range],input[type=checkbox],.opt,.snap button,.folderbtn,.folderbtn *{cursor:url(%s) 8 1,pointer}\n"%(a,h))


def lerp(a,b,t): return tuple(int(a[i]+(b[i]-a[i])*t) for i in range(3))
def bliss(w,h,seed=3,night=False):
    rnd=random.Random(seed)
    im=Image.new('RGBA',(w,h));px=im.load();hy=int(h*.64)
    top=(10,100,208);bot=(150,214,255)
    for y in range(h):
        t=min(y/hy,1);t=round(t*7)/7
        c=lerp(top,bot,t)
        for x in range(w):px[x,y]=c+(255,)
    def cloud(cx,cy,r):
        blobs=[(cx+rnd.randint(-int(r*1.4),int(r*1.4)),cy+rnd.randint(-int(r*.3),int(r*.3)),max(1,rnd.randint(int(r*.5),int(r*.9)))) for _ in range(7)]
        blobs.append((cx,cy,r))
        for (bx,by,br) in blobs:
            for y in range(int(by-br),int(by+br)+1):
                for x in range(int(bx-br*1.15),int(bx+br*1.15)+1):
                    if 0<=x<w and 0<=y<h and ((x-bx)/1.15)**2+(y-by)**2<=br*br:
                        sh=(y-by)/max(br,1)
                        px[x,y]=((255,255,255,255) if sh<.15 else ((222,236,251,255) if sh<.6 else (186,214,242,255)))
    for _ in range(max(4,w//11)):
        cloud(rnd.randrange(w),rnd.randint(2,int(hy*.55)),rnd.randint(2,max(3,int(h*.06))))
    for _ in range(max(3,w//14)):
        cloud(rnd.randrange(w),rnd.randint(int(hy*.6),hy-1),rnd.randint(int(h*.05),max(int(h*.05)+1,int(h*.1))))
    # far hill
    for x in range(w):
        y=int(hy-h*.02-h*.05*math.sin(x*.05+1))
        for yy in range(y,h):px[x,yy]=(96,160,190,255)
    # main hill
    cols=[(150,208,76),(122,188,62),(94,162,50),(70,138,42),(52,112,36)]
    for x in range(w):
        t=(x-w*.28)/(w*.5)
        y=int(hy+h*.1-h*.2*math.exp(-t*t)-h*.03*math.sin(x*.12))
        for yy in range(y,h):
            d=(yy-y)/max(1,(h-y))
            k=min(int(d*5+ (0.6 if (x//3+yy)%7==0 else 0)),4)
            px[x,yy]=cols[k]+(255,)
    return im

def _vn(w,h,cx,cy,rnd):
    gw=int(w/cx)+3;gh=int(h/cy)+3
    g=[[rnd.random() for _ in range(gw)] for _ in range(gh)]
    def f(x,y):
        gx=x/cx;gy=y/cy;ix=int(gx);iy=int(gy);fx=gx-ix;fy=gy-iy
        fx=fx*fx*(3-2*fx);fy=fy*fy*(3-2*fy)
        a=g[iy][ix]*(1-fx)+g[iy][ix+1]*fx;b=g[iy+1][ix]*(1-fx)+g[iy+1][ix+1]*fx
        return a*(1-fy)+b*fy
    return f
PAL={
 'dusk':dict(sky=((38,74,140),(120,176,206)),cl=[(46,70,126),(76,112,164),(126,160,196)],hi=(238,210,172),far=[(52,86,112),(34,60,84)],fld=[(24,44,34),(34,66,40),(52,92,46)],blade=(104,150,62)),
 'day':dict(sky=((60,126,214),(170,220,250)),cl=[(110,150,214),(170,200,236),(228,240,252)],hi=(255,255,255),far=[(96,150,170),(70,124,140)],fld=[(40,100,44),(64,140,56),(104,184,72)],blade=(150,214,96)),
 'night':dict(sky=((16,26,70),(70,96,160)),cl=[(26,40,92),(44,66,122),(80,106,170)],hi=(180,170,214),far=[(32,48,92),(22,34,70)],fld=[(14,34,34),(22,56,44),(40,86,56)],blade=(80,140,92)),
}
def storm(w,h,seed=3,pal='dusk'):
    P=PAL[pal];rnd=random.Random(seed)
    im=Image.new('RGBA',(w,h));px=im.load();hy=int(h*.62)
    n1=_vn(w,h,max(w/5,6),max(h/8,4),rnd);n2=_vn(w,h,max(w/10,3),max(h/16,2),rnd);n3=_vn(w,h,max(w/22,2),max(h/30,2),rnd)
    tier=[[0]*w for _ in range(h)]
    for y in range(hy):
        t=y/hy;c=lerp(P['sky'][0],P['sky'][1],round(t*5)/5)
        for x in range(w):
            v=.5*n1(x,y)+.3*n2(x,y)+.2*n3(x,y)
            v+=(0.45-t)*.22
            k=0 if v<.5 else (1 if v<.58 else (2 if v<.66 else 3))
            tier[y][x]=k
            px[x,y]=c+(255,)
    for y in range(hy):
        for x in range(w):
            k=tier[y][x]
            if k:
                col=P['cl'][k-1]
                up=tier[y-1][x] if y>0 else 0
                if up<k and (k>=2 or up==0):col=P['hi'] if k>=2 else P['cl'][min(k,2)]
                px[x,y]=col+(255,)
    # far ridges
    for j,(base,amp) in enumerate(((hy-h*.07,h*.06),(hy-h*.02,h*.04))):
        ph=rnd.random()*6
        for x in range(w):
            y=int(base-amp*(.5+.5*math.sin(x*.09+ph))-amp*.4*math.sin(x*.23+ph*2))
            for yy in range(max(y,0),hy+2):px[x,yy]=P['far'][j]+(255,)
    # field
    for y in range(hy,h):
        t=(y-hy)/max(h-hy,1);k=0 if t<.35 else (1 if t<.7 else 2)
        for x in range(w):px[x,y]=P['fld'][k]+(255,)
    for _ in range(w*(h-hy)//7):
        x=rnd.randrange(w);y=rnd.randrange(hy+1,h);L=rnd.randint(1,max(2,int((y-hy)/(h-hy)*5)+1))
        for q in range(L):
            if y-q>=hy:px[x,y-q]=lerp(P['fld'][2],P['blade'],rnd.random())+(255,)
    for _ in range(max(3,w//14)):
        x=rnd.randrange(w);y=rnd.randrange(hy+3,h)
        px[x,y]=rnd.choice([(255,150,190,255),(255,226,110,255),(255,255,255,255)])
    return im
def icon_monitor():
    im=Image.new('RGBA',(18,18),(0,0,0,0));d=ImageDraw.Draw(im)
    d.rectangle([1,1,16,11],fill=hexc('#d8dde8'));d.rectangle([3,3,14,9],fill=hexc('#4aa0ee'));d.rectangle([3,3,14,4],fill=hexc('#8ccaff'))
    d.rectangle([6,12,11,13],fill=hexc('#b0b8c8'));d.rectangle([3,14,14,16],fill=hexc('#d8dde8'))
    return outline(im)
def icon_globe():
    im=Image.new('RGBA',(18,18),(0,0,0,0));d=ImageDraw.Draw(im)
    d.ellipse([1,1,16,16],fill=hexc('#3a8fe8'));d.ellipse([4,3,9,8],fill=hexc('#6fcf5a'));d.ellipse([9,9,14,14],fill=hexc('#6fcf5a'))
    d.arc([1,1,16,16],200,290,fill=hexc('#bfe3ff'))
    return outline(im)
def icon_note():
    im=Image.new('RGBA',(18,18),(0,0,0,0));d=ImageDraw.Draw(im)
    d.rectangle([2,1,13,16],fill=hexc('#ffffff'))
    for y in (4,7,10,13):d.line([4,y,11,y],fill=hexc('#6a8fd8'))
    d.rectangle([12,8,16,10],fill=hexc('#ffd84a'));d.line([14,11,14,14],fill=hexc('#e8a13a'))
    return outline(im)
def icon_branch():
    im=Image.new('RGBA',(18,18),(0,0,0,0));d=ImageDraw.Draw(im)
    d.line([5,3,5,14],fill=hexc('#2a2a2a'),width=2);d.line([5,10,12,6],fill=hexc('#2a2a2a'),width=2)
    for (x,y,c) in((5,3,'#ff8fba'),(5,14,'#6fcf5a'),(12,5,'#4aa0ee')):d.ellipse([x-2,y-2,x+2,y+2],fill=hexc(c))
    return outline(im)

def grass_tile():
    w,h=16,10;im=Image.new('RGBA',(w,h),(0,0,0,0));px=im.load();r=random.Random(5)
    for x in range(w):
        hh=r.randint(3,8)
        for k in range(hh):
            px[x,h-1-k]=hexc(['#3f9a36','#5dbb4a','#2f8a30'][(x+k)%3])
    for x in range(w):
        for y in range(h-2,h):px[x,y]=hexc('#2f8a30')
    return im
def css():
    s=[]
    sp={'heart':outline(Image.new('RGBA',(1,1))) if False else heart('#ff8fba','#ffffff'),
        'heartb':heart('#4a7de0','#bcd2ff'),'sparkle':sparkle('#ffe36e','#ffffff'),'star':star('#ffd84a'),
        'cursor':outline(cursor(),INK) if False else cursor(),'hand':hand(),'pad':gamepad(),'folder':folder(),'cloud':cloud(),
        'flower':flower('#ff8fba'),'flower2':flower('#b99bff'),'bubble':speech(),'rock':rock(),'tuft':tuft(),'monitor':icon_monitor(),'globe':icon_globe(),'note':icon_note(),'branch':icon_branch(),'folder2':folder()}
    for k,im in sp.items():
        s.append('.sp-%s{background-image:url(%s);aspect-ratio:%d/%d}'%(k,uri(im,3),im.width,im.height))
    s.append('.grass{background-image:url(%s)}'%uri(grass_tile(),3))
    s.append('.scene{background-image:url(%s)}'%uri(storm(112,84,5,'dusk'),6))
    for i,n in enumerate(['day','dusk','dusk','night'],1):
        s.append('.p%d .banner{background-image:url(%s)}'%(i,uri(storm(120,30,i*7+1,n),6)))
    s.append(cursor_css())
    return '\n'.join(s)
if __name__=='__main__':
    c=css();open('art.css','w').write(c);print(len(c)//1024,'KB')
