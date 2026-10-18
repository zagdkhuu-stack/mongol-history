"""Extract chapter-only assets and verbatim text from the approved 32-page PDF."""
import json
import pathlib
import re
import sys
import pymupdf

source = pathlib.Path(sys.argv[1])
pdf = pymupdf.open(source)
assert len(pdf) == 32, 'Expected the approved 32-page edition'
root = pathlib.Path(__file__).resolve().parents[1]
asset_root = root / 'public/assets/pdf-details'
mapping = {1:[2], 2:[3,4], 3:[5,6,7], 4:[8,9,10], 6:[16,17,18,19], 7:[20,21,22,23], 8:[24,25,26,27], 9:[28,29], 10:[30,31,32]}
# Only meaningful embedded illustrations; exclude slide backgrounds and ornament.
figures = {2:[4],3:[0],4:[0],5:[1],6:[0],7:[0,1],8:[2,4,6,8,10,12,14],9:[0,1],10:[0],17:[9],18:[8],20:[1,2],21:[3],24:[4],26:[10],27:[1],28:[10],29:[8],30:[1],31:[0,1]}
headings = {2:'МОНГОЛ ГҮРНИЙ СОЕЛЬІН ӨВ, ТҮҮХЭН АЧ ХОЛБОГДОЛ',3:'МАЛ АЖ АХУЙ, НҮҮДЛИЙН АМЬДРАЛ',4:'УЛИРЛЫН НҮҮДЭЛ ХЭРХЭН ЯВАГДДАГ БАЙСАН БЭ?',5:'МОНГОЛИЙН АН АГНУУР, ГАЗАР ТАРИАЛАН, ХҮНСНИЙ АЖ АХУЙ',6:'МОНГОЛЫН ГАЗАР ТАРИАЛАН',7:'Монголын хүнсний аж ахуй',18:'Гэрэгэ гэж юу вэ?',19:'Өртөө нь төрийн удирдлага, худалдаа, мэдээлэл дамжуулахад ямар ач холбогдолтой байсан бэ?',24:'Бичиг үсэг, боловсрол, оюуны соёл',26:'Дөрвөлжин бичиг',27:'ШИНЖЛЭХ УХААН, ТЕХНОЛОГИЙН СОЛИЛЦООНД ҮЗҮҮЛСЭН НӨЛӨӨ',28:'Монголын эзэнт гүрэн дэх шашин, соёлын солилцоо',29:'СОЁЛЫН СОЛИЛЦОО',30:'ДЭЛХИЙН ХУДАЛДАА, ХАРИЛЦААНД ҮЛДЭЭСЭН ӨВ',31:'УРЛАГ, УРАН БАРИЛГА, ГАР УРЛАЛЫН СОЁЛЫН ӨВ'}
def clean(s):
    return re.sub(r'\s+', ' ', s).strip()

def text_blocks(page, clip=None, remove=''):
    result=[]
    for block in page.get_text('blocks',sort=True):
        if block[6] != 0: continue
        if clip is not None and not (clip.x0 <= block[0] < clip.x1 and clip.y0 <= block[1] < clip.y1): continue
        value=clean(block[4])
        # Joining layout line breaks only; spelling remains unchanged.
        if remove and clean(remove) in value: value=value.replace(clean(remove),'').strip()
        if value and value != 'он': result.append(value)
    return result

def text_lines(page, box):
    # PDF blocks can span several columns; select complete lines for each item.
    bounds=pymupdf.Rect(box)
    lines=[]
    for block in page.get_text('dict')['blocks']:
        for line in block.get('lines',[]):
            x,y,_,_=line['bbox']
            if bounds.x0<=x<bounds.x1 and bounds.y0<=y<bounds.y1:
                lines.append((y,x,clean(''.join(span['text'] for span in line['spans']))))
    return [value for _,_,value in sorted(lines) if value]

chapters={}
for topic,pages in mapping.items():
    folder=asset_root/f'topic-{topic:02d}'
    folder.mkdir(parents=True,exist_ok=True)
    sections=[]
    for n in pages:
        if n==32: continue # Closing thank-you slide, no educational content.
        page=pdf[n-1]
        images=[]
        for k,idx in enumerate(figures.get(n,[])):
            info=page.get_image_info(xrefs=True)[idx]
            pix=pymupdf.Pixmap(pdf,info['xref'])
            mask=pdf.extract_image(info['xref']).get('smask')
            if mask: pix=pymupdf.Pixmap(pix,pymupdf.Pixmap(pdf,mask))
            if pix.colorspace and pix.colorspace.n>3: pix=pymupdf.Pixmap(pymupdf.csRGB,pix)
            filename=f'page-{n:02d}-figure-{k+1:02d}.png'
            pix.save(folder/filename)
            images.append({'src':f'/assets/pdf-details/topic-{topic:02d}/{filename}','width':pix.width,'height':pix.height,'page':n})
        heading=headings.get(n,'')
        paragraphs=text_blocks(page,remove=heading)
        # Pages 17 and 21 contain illustrations over hidden duplicated slide text.
        if n in [9,10,17,21]: paragraphs=[]
        section={'page':n,'heading':heading,'paragraphs':paragraphs,'images':images,'layout':'editorial'}
        if n in [3,4,9,10,17,21]: section['layout']='gallery'
        # Preserve the original columns rather than interleaving their text.
        zones={16:[(20,150,760,490),(20,490,770,800),(760,450,1415,800)],20:[(0,289,715,810),(715,289,1440,810)],22:[(70,130,700,650),(740,130,1380,630)],23:[(150,100,1310,250),(150,250,715,700),(740,250,1310,700)],25:[(70,120,760,750),(760,120,1440,750)]}
        if n in zones:
            section['groups']=[text_blocks(page,pymupdf.Rect(z)) for z in zones[n]]
            section['paragraphs']=[]
            section['layout']='columns'
            if n==16: section['heading']='Өртөө, зам харилцаа'
            if n==20: section['heading']='Эдийн соёл, өдөр тутмын ахуй'
        if n==25:
            section['groups']=[[clean(' '.join(g[:2])),clean(' '.join(g[2:]))] for g in section['groups']]
        if n==31:
            section['paragraphs']=[clean(' '.join(paragraphs))]
        if n==7:
            section['paragraphs']=[]
            section['table']={'head':['Хүнсний төрөл','Хэрэглээ, ач холбогдол'],'rows':[
                ['Малын мах','Хонь, үхэр, адуу, ямаа болон бусад малын махыг хүнсэнд хэрэглэнэ.'],
                ['Сүү, сүүн бүтээгдэхүүн','Айраг, сүү нь өдөр тутмын хүнсний чухал хэсэг байв.'],
                ['Ангийн мах','Малын гаралтай хүнсийг нөхөж, төрөл зүйлийг нэмэгдүүлнэ.'],
                ['Үр тариа, гурил','Тариалангийн бүсээс нийлүүлэгдэх болон дотооддоо үйлдвэрлэсэн эх үүсвэр байв.'],
                ['Зэрлэг ургамал','Байгалийн орчноос түүж, хүнсэнд нэмэлтээр ашиглана.']]}
        if n==8:
            section['paragraphs']=text_blocks(page,pymupdf.Rect(170,0,710,115))
            section['crafts']=[]
            for box,img in zip([(150,115,440,475),(430,115,718,475),(720,115,993,475),(995,115,1275,475),(150,455,530,800),(532,455,890,800),(892,455,1280,800)],images):
                section['crafts'].append({'text':text_lines(page,box),'image':img})
            section['images']=[]
            section['layout']='crafts'
        sections.append(section)
    chapters[str(topic)]={'pages':pages,'sections':sections}
(root/'src/pdf-chapters.json').write_text(json.dumps(chapters,ensure_ascii=False,indent=2),encoding='utf-8')
print('Extracted',sum(len(v['sections']) for v in chapters.values()),'sections; mapping preserved, topic 05 excluded.')
