import {assetUrl} from './asset-url.js';
import imageSources from './exhibit-image-sources.json' with {type:'json'};
// Actual pages in the current 32-page PDF; the archived extraction has an extra page.
const sectionPages={
  '01':[[2],[2],[2]],'02':[[3,7,20,23],[4],[3,7,23]],
  '03':[[5,20],[6],[7],[3,5,6,7]],'04':[[8],[9],[9],[10]],
  '06':[[16],[16,18],[18],[17,19]],'07':[[20,21],[20],[22],[23],[23]],
  '08':[[24],[24,26],[25],[25]],'09':[[27],[27,29],[28],[29]],
  '10':[[30],[30],[31],[2,24,25,26,28,30,31]],
};
// Verified lists from the craft exhibit, kept explicit so compound labels such
// as “Таваг, халбага” are never incorrectly split by punctuation.
const craftDetails={
  'Модон эдлэл':['Гэрийн мод','Тэрэг','Сав суулга','Таваг, халбага зэрэг'],
  'Арьс ширэн эдлэл':['Эмээл','Хазаар','Чөдөр, аргамж','Хөхүүр зэрэг'],
  'Металл эдлэл':['Хутга','Жад','Нум сумны тоноглол','Бамбай зэрэг'],
  'Нэхмэл, эсгий эдлэл':['Хивс','Нэхмэл эдлэл','Хувцас хэрэглэл'],
  'Хөгжмийн хэрэгсэл':['Морин хуур','Ятга','Хуучир'],
  'Шашин, зан үйлийн эд зүйлс':['Бөө мөргөлийн хувцас','Толь','Хонх, хэц','Бамбай зэрэг'],
};
// Whole-section illustrations stay separate from item-specific images: a
// composite livestock or food image must not be labelled as one selected item.
const sectionMedia={
  '02:0':{selector:['livestock','Таван хошуу малын эх танилцуулгын зураг']},
  '03:0':{selector:['hunting-source','Морьтой ан авын дүрслэл']},
  '03:2':{gallery:[['dairy-food','Сүү, цагаан идээ болон хүнсний хэрэглэл'],['preserved-meat','Гэрт мах хатааж, хүнс нөөцөлж буй байдал']]},
  '04:1':{gallery:[['craft-city','XIII зууны Монголын хот, урлалын төвүүдийн зураг']]},
  '06:2':{gallery:[['gerege','Гэрэгэ, элчийн эрх ба зам харилцааны тухай эхийн дүрслэл']]},
  '07:0':{gallery:[['ger-photo','Монгол гэрийн гэрэл зураг']]},
  '09:0':{gallery:[['science-exchange','Мэдлэгийн солилцооны тухай эхийн хуудсан дахь тал нутгийн гэрэл зураг']]},
  '10:0':{gallery:[['steppe','Тал нутгийн эх танилцуулгын дүрслэл']]},
  '10:2':{gallery:[['riders','Урлаг, соёлын өвийн тухай эхийн хуудсан дахь морьтны дүрслэл']]},
};
const sectionImage=([name,alt])=>imageRecord(`/assets/exhibit/${name}.webp`,alt);
export function imageRecord(image,imageAlt){
  const source=imageSources[image];
  if(!source?.sourcePages?.length)return{image:null,imageAlt:'',imageSourcePage:null};
  return{image:assetUrl(image),imageAlt,imageSourcePage:source.sourcePages[0],width:source.width,height:source.height};
}
function complete(entry,id,pages){
  const media=imageRecord(entry.image,entry.imageAlt||entry.title);
  return{id,label:entry.title,title:entry.title,description:entry.text,sourcePage:pages[0],sourcePages:pages,
    ...media,year:entry.year,direction:entry.direction,
    imageStatus:media.image?'verified':'text-only: no confidently matched source image'};
}
export function buildExhibitions(topic){
  if(topic.number==='05')return[];
  return topic.sections.map((section,index)=>{
    const pages=sectionPages[topic.number][index],id=`${topic.id}-section-${index}`;
    let entries=section.widget?.items||section.items,type=section.widget?.type||'categories';
    let kind=entries?'category':'editorial';
    if(section.layout==='comparison'&&section.items?.length===2)kind='comparison';
    if(type==='timeline')kind='timeline';if(type==='scripts')kind='manuscript';
    if(section.table){entries=section.table.rows.map(([title,text])=>({title,text}));kind='category';type='food';}
    if(topic.number==='03'&&index===0){
      kind='category';type='hunting';
      entries=[
        {title:'Морьтой ан',text:'Хурдан морь, нум сум ашиглан зээр, буга зэрэг амьтдыг агнадаг байв.'},
        {title:'Хамтын ан',text:'Хамтын ан нь сахилга бат, хамтын ажиллагааг хөгжүүлдэг байжээ.'},
        {title:'Ангийн хэрэгсэл',text:'Нум сум, хавх зэрэг хэрэгсэл ашигладаг байв.'},
      ];
    }
    if(topic.number==='09'&&index===2){
      kind='category';type='beliefs';
      entries=[
        {title:'Мөнх Тэнгэр',text:'«Мөнх Тэнгэрийн хүчин дор» гэсэн үзлийг төрийн үзэл сурталтай холбон тайлбарласан.'},
        {title:'Зэрэгцэн орших итгэл',text:'Хархорумд буддын, исламын, христийн несториан урсгалууд зэрэгцэн оршиж байсныг дурджээ.'},
        {title:'1254 оны мэтгэлцээн',text:section.paragraphs[1],image:section.image,imageAlt:section.caption},
      ];
    }
    if(topic.number==='07'&&index===3)entries=entries.map(entry=>entry.title==='Хөдөлгөөн'?{...entry,image:section.image,imageAlt:section.caption}:entry);
    if(topic.number==='03'&&type==='systems')entries=entries.map(entry=>{
      if(entry.title==='Мал аж ахуй')return{...entry,image:'/assets/exhibit/livestock.webp',imageAlt:'Таван хошуу мал'};
      if(entry.title==='Ан агнуур')return{...entry,image:'/assets/exhibit/hunting-source.webp',imageAlt:'Ан авын дүрслэл'};
      if(entry.title==='Газар тариалан')return{...entry,image:'/assets/exhibit/farm.webp',imageAlt:'Тариалангийн тайлбар дүрслэл'};
      if(entry.title==='Хүнсний аж ахуй')return{...entry,image:'/assets/exhibit/dairy-food.webp',imageAlt:'Хүнс ба ахуйн хэрэглэл'};
      return entry;
    });
    const items=entries?.map((entry,i)=>complete(entry,`${id}-item-${i}`,pages));
    if(topic.number==='03'&&type==='systems')for(const entry of items){entry.sourcePage={'Мал аж ахуй':3,'Ан агнуур':5,'Газар тариалан':6,'Хүнсний аж ахуй':7}[entry.title];entry.sourcePages=[entry.sourcePage];}
    if(type==='artifacts')for(const entry of items)if(craftDetails[entry.title])entry.details=craftDetails[entry.title];
    if(type==='scripts')for(const entry of items){entry.sourcePage=entry.imageSourcePage;entry.sourcePages=[entry.sourcePage];}
    if(type==='relay')for(const entry of items){entry.sourcePage=entry.title==='Эрхээ батлах'?18:16;entry.sourcePages=[entry.sourcePage];}
    if(type==='timeline')for(const entry of items){
      entry.sourcePage={'1204':24,'1206':2,'1240':25,'1254':28,'1269':26,'XIV зуун':30}[entry.title];
      entry.sourcePages=[entry.sourcePage];
      if(entry.title==='1204')Object.assign(entry,imageRecord('/assets/exhibit/mongol-script.webp','Монгол бичгийн дүрслэл'));
      if(entry.title==='1269')Object.assign(entry,imageRecord('/assets/exhibit/phags-pa.webp','Дөрвөлжин бичгийн дүрслэл'));
      if(entry.title==='1254')Object.assign(entry,imageRecord('/assets/exhibit/mongke.webp','Мөнх хааны хөрөг'));
      entry.imageStatus=entry.image?'verified contextual source image':'text-only: event illustration not available';
    }
    const huntingContext=topic.number==='03'&&index===0;
    const media=sectionMedia[`${topic.number}:${index}`];
    const contextualImage=huntingContext||(topic.number==='09'&&index===2)||(topic.number==='07'&&index===3)?null:section.image;
    const introduction=type==='artifacts'
      ? ['Их Монгол Улсын үед монголчууд өдөр тутмын амьдралдаа хэрэглэх олон төрлийн эд зүйлсийг өөрсдөө урлан хийдэг байв.']
      :topic.number==='03'&&index===0
      ? [`${section.paragraphs[0]} Гэхдээ ан агнуур мал аж ахуйг орлоогүй, түүнийг нөхөж байв.`]
      :topic.number==='09'&&index===2?['Шашны бодлогыг олон уламжлал уулзсан орчинтой хамт авч үзнэ.']:section.paragraphs;
    return{...section,paragraphs:introduction,id,kind,type,sourcePages:pages,visual:imageRecord(contextualImage,section.caption||section.title),items,
      ...(media?.selector?{selectorVisual:sectionImage(media.selector)}:{}),
      ...(media?.gallery?{supplementaryVisuals:media.gallery.map(sectionImage)}:{}),
      ...(topic.number==='06'&&index===3?{network:imageRecord('/assets/exhibit/relay-network.webp','Эх танилцуулга дахь өртөөний сүлжээний бүдүүвч')}:{})};
  });
}
