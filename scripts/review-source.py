"""Review the supplied PDF and extract only content illustrations for the museum."""
import io
import json
import pathlib
import sys
import pymupdf
from PIL import Image

root = pathlib.Path(__file__).resolve().parents[1]
pdf = pymupdf.open(sys.argv[1])
assert len(pdf) == 32
assets = root / 'public/assets/exhibit'
records_path = root / 'src/exhibit-image-sources.json'
records = json.loads(records_path.read_text(encoding='utf-8'))

def extract(name, page, xref, crop=None):
    image = Image.open(io.BytesIO(pdf.extract_image(xref)['image'])).convert('RGB')
    if crop:
        image = image.crop(crop)
    image.save(assets / (name + '.webp'), quality=92, method=6)
    records['/assets/exhibit/' + name + '.webp'] = {
        'sourcePages': [page], 'xref': xref, 'width': image.width,
        'height': image.height, 'crop': crop,
        'verification': 'Embedded source illustration; crop reviewed separately from slide text',
    }

# Retain the source labels. These are individual crops of an illustration,
# not photographs or independently authenticated medieval artifacts.
for name, box in {
    'sheep': (0, 0, 423, 270), 'goat': (423, 0, 846, 270),
    'cattle': (0, 270, 255, 564), 'horse': (255, 290, 590, 564),
    'camel': (590, 270, 846, 564),
}.items():
    extract(name, 3, 1452, box)
extract('trade-caravan', 12, 315)
extract('trade-goods', 13, 338)
extract('gerege-detail', 18, 403, (24, 445, 415, 768))
extract('closing-landscape', 32, 2522)
records_path.write_text(json.dumps(records, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

# Smaller museum-only renditions; full resolution stays available to the viewer.
responsive = assets / 'responsive'
responsive.mkdir(exist_ok=True)
for path, record in records.items():
    original = root / 'public' / path.lstrip('/')
    if not original.exists() or original.suffix != '.webp':
        continue
    image = Image.open(original).convert('RGB')
    variants = []
    for width in (480, 960):
        if image.width <= width:
            continue
        filename = original.stem + '-' + str(width) + '.webp'
        resized = image.resize((width, round(image.height * width / image.width)), Image.Resampling.LANCZOS)
        resized.save(responsive / filename, quality=84, method=6)
        variants.append({'image': '/assets/exhibit/responsive/' + filename, 'width': width})
    if variants:
        record['variants'] = variants
records_path.write_text(json.dumps(records, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

# Source page review: positions, aspect ratios and extracted text remain auditable.
review = []
for number, page in enumerate(pdf, 1):
    review.append({'page': number, 'text': page.get_text(),
                   'images': [{'xref': entry[0], 'width': entry[2], 'height': entry[3],
                               'positions': [list(rect) for rect in page.get_image_rects(entry[0])]}
                              for entry in page.get_images()],
                   'background': 'Dark charcoal; cream and gold type',
                   'use': 'Cover' if number == 1 else 'Blank slide' if number == 11 else
                          'Closing landscape only; slide heading omitted' if number == 32 else
                          'Semantic text and individually extracted content illustrations'})
(root / 'research/final-review/source-review.json').write_text(
    json.dumps(review, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print('Reviewed 32 pages; extracted 9 content illustrations and responsive renditions.')
