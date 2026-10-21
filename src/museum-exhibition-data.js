// Presentation adapts the original 39 sections without changing the gallery data.
const media=(name,alt)=>({image:`/assets/exhibit/${name}.webp`,imageAlt:alt});
const pages={ '01':[[2],[2],[2]],'02':[[3,7,23],[4],[3,7]],
 '03':[[5],[6],[7],[5,6,7]],'04':[[8],[9],[9],[10]],
 '05':[[12],[13],[14],[14,15]],'06':[[16,17],[16],[18],[19]],
 '07':[[20,21],[20],[22],[23],[23]],'08':[[24],[24,26],[25],[25,27]],
 '09':[[29],[28],[29]],'10':[[30],[31],[2,24,25,26,28,31,32]]};
const entry=(title,text,extra={})=>({title,text,...extra});

export function exhibitionsFor(topic){
 const sections=structuredClone(topic.sections).map((s,i)=>({
  ...s,sourcePages:pages[topic.number][i],kind:s.layout||'editorial',
  type:s.widget?.type,items:s.widget?.items||s.items,
  interactive:Boolean(s.widget),imageAlt:s.caption||s.title,
 }));
 const s=sections;
 switch(topic.number){
 case '01':
  s[0].kind='statement';s[0].paragraphs=[topic.intro];
  s[1].title='Эзэнт гүрний тэлэлт';s[1].kind='wide';
  s[1].paragraphs=[topic.sections[0].paragraphs[0],...s[1].paragraphs];
  s[2].title='Дэлхийн түүхэнд гүйцэтгэсэн үүрэг';s[2].kind='wide';
  break;
 case '02':
  s[0].items=s[0].items.map((item,i)=>({...item,...media(['sheep','goat','cattle','horse','camel'][i],`${item.title} — эхийн малын дүрслэл`)}));
  s[1].kind='wide';s[1].paragraphs=['Улирлыг сонгож бэлчээр, байгалийн орчин хэрхэн өөрчлөгдөхийг харьцуулна уу. Эхийн дөрвөн дүрслэл улирлын нүүдлийн хэмнэлийг харуулна.'];
  s[2].kind='statement';
  break;
 case '03':
  Object.assign(s[0],media('hunting-source','Морьтой ан ав — эхийн түүхэн тайлбар зураг'));
  s[1].kind='wide';
  s[2].interactive=true;s[2].type='food';s[2].kind='category';
  s[2].paragraphs=['Хүнсний төрлийг сонгож хэрэглээ, ач холбогдлыг харьцуулна уу.'];
  s[2].items=s[2].table.rows.map(([title,text],i)=>entry(title,text,
   i<2?media(i===0?'preserved-meat':'dairy-food',title+' — эхийн хүнсний дүрслэл'):
   i===2?{...media('hunting-source','Ангийн махны эх үүсвэр — ан авын дүрслэл'),sourcePages:[5,7]}:
   i===3?{...media('farm','Үр тарианы эх үүсвэр — тариалангийн дүрслэл'),sourcePages:[6,7]}:{}));
  s[3].interactive=false;s[3].kind='connections';
  s[3].paragraphs=['Мал аж ахуй, ан агнуур, газар тариалан нь хүнсний хэрэгцээг харилцан нөхдөг. Хүнсийг боловсруулах, хадгалах, хуваарилах нь энэ тогтолцооны салшгүй хэсэг байв.'];
  break;
 case '04':
  s[0].kind='category';
  s[1].interactive=false;s[1].kind='wide';Object.assign(s[1],media('craft-city','Чингай балгас, Хархорум — эхийн хотын дүрслэл'));
  s[1].paragraphs=['Хотын төвүүд урлал, тариалан, хүнс нийлүүлэлтэд өөр өөр үүрэг гүйцэтгэж байв.'];
  s[2].kind='wide';s[3].kind='wide';
  break;
 case '05':
  Object.assign(s[0],media('trade-caravan','Торгоны замын жин — эхийн 12-р хуудасны зураг'));s[0].kind='wide';
  s[1].kind='map';s[1].map='trade';s[1].paragraphs=['Бүс нутгийг газрын зураг эсвэл нэрээр нь сонгож солилцож байсан барааг харна уу. Байрлал, холболтыг тайлбарласан бүдүүвч; замын нарийвчилсан маршрут, улсын хил биш.'];
  s[1].items=s[1].items.map(item=>({...item,...media('trade-goods','Худалдааны бараа — эхийн 13-р хуудасны нийтлэг дүрслэл')}));
  s[2].kind='connections';s[3].kind='statement';
  break;
 case '06':
  Object.assign(s[0],media('relay-network','Өртөөний сүлжээ — эх материалын тайлбар газрын зураг'));s[0].kind='wide';
  s[0].paragraphs.push('Өртөөнүүд ойролцоогоор 30–40 км-ийн зайтай байрлаж, газар нутгийн нөхцөлөөс хамааран зай нь өөр өөр байжээ. Зурагт эх материалын өртөөний сүлжээний бүдүүвчийг харуулав.');
  s[1].map='relay';s[1].kind='map';
  Object.assign(s[2],media('gerege-detail','Гэрэгэний тухай эхийн тайлбар зураг — баримтат эд өлгийн гэрэл зураг биш'));
  break;
 case '07':
  s[0].map='ger';s[0].kind='map';
  s[0].selectorImage=media('cart-ger','Тэргэн гэрийн тайлбар дүрслэл.');
  Object.assign(s[3],media('ger-photo','Монгол гэр — эхийн 21-р хуудасны гэрэл зураг'));
  s[1].kind='wide';s[3].kind='wide';s[4].kind='statement';
  break;
 case '08':
  Object.assign(s[0],media('mongol-script','Монгол бичиг — эхийн бичгийн дурсгал'));s[0].kind='manuscript';
  s[1].kind='manuscript';
  s[1].items[1].text+=' Сажа ёсны тэргүүн Пагва ламын нэрээр «Пагва бичиг» гэж мөн нэрлэдэг. Монгол, хятад, төвд, санскрит хэлний авиаг тэмдэглэх зориулалттай байв.';
  s[3].title='Боловсрол, бүртгэл, мэдлэгийн солилцоо';
  s[3].paragraphs[0]=s[3].paragraphs[0].replace('академи, сургуулиуд','Ганлин академи, сургуулиуд');
  s[3].paragraphs.push('Дорноос Баруун руу цаас, хэвлэх арга, дарь; исламын ертөнцөөс Зүүн Ази руу одон орон, математик, анагаах ухааны мэдлэг дамжжээ. Ил хаант улсын Марага одон орны төв, эрдэмтэн Насир ад-Дин ат-Тусиг эхэд онцолсон. Монголчууд эдгээрийг зохион бүтээгээгүй, харин солилцоог түргэсгэсэн гэж тайлбарлажээ.');
  s[3].kind='wide';
  break;
 case '09':
  s[0].title='Мэдлэг, соёлын холбоосууд';s[0].paragraphs=['Шашин, бичиг, шинжлэх ухаан, зам харилцаа нь соёлын солилцоог олон чиглэлд өргөжүүлжээ.'];
  s[0].type='exchange';s[0].items=[
   entry('Шашин, бичиг','Төвөдөөс буддын шашин хүлээн авч, монгол бичгийг төрийн хэрэгт өргөн хэрэглэж ирсэн тухай эхэд өгүүлсэн.'),
   entry('Эрдэмтэд, эмч нар','Перс, Араб, Хятадын одон орончид, эмч нарыг цуглуулж, шинжлэх ухааныг хөгжүүлжээ.'),
   entry('Өртөөний сүлжээ','Зүүн Азиас Европ хүртэл торго, цаас, дарь, луужин түгэхэд өртөөний тогтолцоо нөлөөлсөн гэж эхэд тайлбарласан.')];
  s[1].type='beliefs';s[1].interactive=true;
  s[1].items=[entry('Мөнх Тэнгэр','«Мөнх Тэнгэрийн хүчин дор» хэмээх үзэл нь төрийн гол үзэл суртал байв. Бусад шашныг уусгалгүйгээр Тэнгэр шүтлэгийн хүрээнд хүлээн зөвшөөрсөн гэж эхэд тайлбарласан.'),
   entry('Зэрэгцэн орших итгэл','Хархорумд буддын, исламын, христийн несториан урсгалууд зэрэгцэн оршиж байв.'),
   entry('Шашны бодлого','Эхэд шашны тэргүүнүүдийг албан татвар, гувчуураас чөлөөлсөн, 1254 онд Мөнх хаан Хархорумд шашин хоорондын мэтгэлцээн зохион байгуулсан гэж өгүүлсэн.',media('mongke','Шашны бодлогын тухай эхийн 28-р хуудасны хөрөг'))];
  delete s[1].image;s[2].kind='wide';
  break;
 case '10':
  s[0].kind='wide';s[1].kind='category';
  s[2].kind='conclusion';s[2].interactive=false;
  s[2].title='Евразийн хамтын өв';s[2].paragraphs=['Соёлын өв нь нэг үндэстний уламжлалаар хязгаарлагдахгүй, Евразийн олон ард түмний урлаг, гар урлалын харилцан нөлөөллийн үр дүн юм. Худалдаа, зам харилцаа, бичиг үсэг, өдөр тутмын ахуйг хамтад нь харахад энэ түүхийн холбоосууд тодордог.'];
  s[2].timeline=s[2].items;delete s[2].items;
  Object.assign(s[2],media('closing-landscape','Эх материалын төгсгөлийн тал нутгийн зураг'));
  break;
 }
 return sections;
}
