import {assetUrl} from './asset-url.js';
import imageSources from './exhibit-image-sources.json' with {type:'json'};
import {exhibitionsFor} from './museum-exhibition-data.js';

export function imageRecord(image,imageAlt){
 const source=imageSources[image];
 if(!source?.sourcePages?.length)return{image:null,imageAlt:'',imageSourcePage:null};
 return{image:assetUrl(image),imageAlt,imageSourcePage:source.sourcePages[0],width:source.width,height:source.height,
  srcset:source.variants?.length?[...source.variants.map(v=>`${assetUrl(v.image)} ${v.width}w`),`${assetUrl(image)} ${source.width}w`].join(', '):null};
}
export function buildExhibitions(topic){
 return exhibitionsFor(topic).map((section,index)=>{
  const id=topic.id+'-section-'+index;
  const items=section.items?.map((entry,itemIndex)=>{
   const sourcePages=entry.sourcePages||section.sourcePages;
   const visual=imageRecord(entry.image,entry.imageAlt||entry.title);
   return{...entry,id:id+'-item-'+itemIndex,label:entry.title,description:entry.text,
    sourcePages,sourcePage:sourcePages[0],...visual,
    imageStatus:visual.image?(entry.imageStatus||'verified source association'):'text-only: no matching source illustration'};
  });
  return{...section,id,items,type:section.type||'editorial',interactive:Boolean(section.interactive&&items?.length),
   selectorVisual:section.selectorImage?imageRecord(section.selectorImage.image,section.selectorImage.imageAlt):null,
   kind:section.kind||(items?'category':'editorial'),visual:imageRecord(section.image,section.imageAlt||section.title)};
 });
}
