// Reviewed against the actual 32-page source PDF, including the visible images.
// These are semantic bindings, not a zip of paragraphs and extraction order.
const asset=(topic,file)=>`/assets/pdf-details/topic-${topic}/${file}.png`;
export const imageAssociations={
 2:{status:'uncertain',images:[],reason:'Ger photograph does not illustrate any specific historical-significance paragraph.'},
 3:{status:'verified',images:[asset('02','page-03-figure-01')],subject:'Five livestock species diagram'},
 4:{status:'verified',images:[asset('02','page-04-figure-01')],subject:'Seasonal migration illustration'},
 5:{status:'verified',images:[asset('03','page-05-figure-01')],subject:'Mounted hunting'},
 6:{status:'verified',images:[asset('03','page-06-figure-01')],subject:'Cultivated fields and farming'},
 7:{status:'verified',images:[asset('03','page-07-figure-01'),asset('03','page-07-figure-02')],subject:'Food table: dairy/food products and preserved meat'},
 8:{status:'verified',images:[],subject:'Seven individually bound artifact records in topic-four.js'},
 9:{status:'verified',images:[asset('04','page-09-figure-01'),asset('04','page-09-figure-02')],subject:'Silver-tree illustration and named production-centre map; no separate explanatory text on this slide'},
 10:{status:'verified',images:[asset('04','page-10-figure-01')],subject:'Craft production illustration; no separate explanatory text'},
 16:{status:'text-only',images:[]},
 17:{status:'verified',images:[asset('06','page-17-figure-01')],subject:'Relay-station network map'},
 18:{status:'verified',images:[asset('06','page-18-figure-01')],subject:'Gerege and messenger illustration'},
 19:{status:'text-only',images:[]},
 20:{status:'verified',images:[],groups:[
  {heading:'Орон сууц: гэр',textGroup:0,images:[asset('07','page-20-figure-01')],subject:'Wheeled ger'},
  {heading:'Хувцас',textGroup:1,images:[asset('07','page-20-figure-02')],subject:'Historical garment'}
 ]},
 21:{status:'verified',images:[asset('07','page-21-figure-01')],subject:'Ger photograph'},
 22:{status:'text-only',images:[]},
 23:{status:'text-only',images:[]},
 24:{status:'verified',images:[asset('08','page-24-figure-01')],subject:'Mongolian script'},
 25:{status:'text-only',images:[]},
 26:{status:'verified',images:[asset('08','page-26-figure-01')],subject:'Square-script inscription'},
 27:{status:'uncertain',images:[],reason:'Horse-pasture photograph does not illustrate the technology-transfer paragraphs. Kept in Topic 08; illustration withheld.'},
 28:{status:'source-context',images:[asset('09','page-28-figure-01')],subject:'Original illustration on PDF page 28; no claim about portrait identity or depiction of the 1254 debate.'},
 29:{status:'source-context',images:[asset('09','page-29-figure-01')],subject:'Original illustration on PDF page 29, retained with its source section without assigning it to an individual statement.'},
 30:{status:'uncertain',images:[],reason:'Pastoral photograph is not evidence of trade, relay stations, or plague.'},
 31:{status:'uncertain',images:[],reason:'Riders and pasture images do not illustrate the specified porcelain, textile, painting, or architectural examples.'}
};
export function associatedImages(section,paths=imageAssociations[section.page]?.images||[]){
 return paths.map(src=>{
  const image=section.images.find(image=>image.src===src);
  if(!image)throw new Error(`Missing reviewed PDF image: ${src}`);
  return image;
 });
}
