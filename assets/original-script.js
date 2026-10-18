const chapters = [
  {
    number: "01",
    category: "МОНГОЛЫН ТҮҮХ",
    title: "Ерөнхий нөхцөл,<br>түүхэн орчин",
    text: "Монгол гүрэн байгуулагдсан түүхэн нөхцөл болон тухайн үеийн ерөнхий мэдээлэл.",
    keywords: ["1206", "XIII ЗУУН", "МОНГОЛ ГҮРЭН"],
    image: "assets/images/01.jpg"
  },
  {
    number: "02",
    category: "АЖ АХУЙ",
    title: "Мал аж ахуй,<br>нүүдэл",
    text: "Монголчуудын нүүдлийн мал аж ахуй, таван хошуу мал болон ахуй амьдрал.",
    keywords: ["АДУУ", "НҮҮДЭЛ", "МАЛ АЖ АХУЙ"],
    image: "assets/images/02.jpg"
  },
  {
    number: "03",
    category: "АЖ АХУЙ",
    title: "Ан агнуур,<br>газар тариалан",
    text: "Ан агнуур, газар тариалан болон хүнсний хэрэглээ.",
    keywords: ["АН АГНУУР", "ТАРИАЛАН", "ХҮНС"],
    image: "assets/images/03.jpg"
  },
  {
    number: "04",
    category: "ҮЙЛДВЭРЛЭЛ",
    title: "Гар урлал,<br>үйлдвэрлэл",
    text: "Дархан, төмөрлөг, арьс шир, нэхмэл болон бусад гар урлалын хөгжил.",
    keywords: ["ДАРХАН", "ТӨМӨРЛӨГ", "УРЛАЛ"],
    image: "assets/images/04.jpg"
  },
  {
    number: "05",
    category: "ХУДАЛДАА",
    title: "Торгоны зам,<br>худалдаа",
    text: "Монгол гүрний үеийн Евразийн худалдаа болон Торгоны замын хөгжил.",
    keywords: ["ТОРГОНЫ ЗАМ", "ЕВРАЗИ", "ХУДАЛДАА"],
    image: "assets/images/05.jpg"
  },
  {
    number: "06",
    category: "ХАРИЛЦАА ХОЛБОО",
    title: "Өртөө,<br>зам харилцаа",
    text: "Өртөөний тогтолцоо, элч болон мэдээлэл дамжуулах систем.",
    keywords: ["ӨРТӨӨ", "ЭЛЧ", "ЗАМ"],
    image: "assets/images/06.jpg"
  },
  {
    number: "07",
    category: "ЭДИЙН СОЁЛ",
    title: "Эдийн соёл,<br>ахуй",
    text: "Монголчуудын гэр сууц, хувцас, эд хэрэглэл болон өдөр тутмын ахуй.",
    keywords: ["ГЭР", "ХУВЦАС", "АХУЙ"],
    image: "assets/images/07.jpg"
  },
  {
    number: "08",
    category: "ОЮУНЫ СОЁЛ",
    title: "Бичиг үсэг,<br>боловсрол",
    text: "Монгол бичиг, сурвалж бичиг болон боловсролын хөгжил.",
    keywords: ["МОНГОЛ БИЧИГ", "БОЛОВСРОЛ", "СУРВАЛЖ"],
    image: "assets/images/08.jpg"
  },
  {
    number: "09",
    category: "ОЮУНЫ СОЁЛ",
    title: "Шашин,<br>соёлын харилцаа",
    text: "Монгол гүрний шашны бодлого, шашны хүлцэл болон бусад соёлтой харилцсан харилцаа.",
    keywords: ["ШАШИН", "ХҮЛЦЭЛ", "ХАРИЛЦАА"],
    image: "assets/images/09.jpg"
  },
  {
    number: "10",
    category: "ХОТ СУУРИН",
    title: "Хархорум,<br>архитектур",
    text: "Хархорум хот, барилга байгууламж болон Монгол гүрний хот суурины хөгжил.",
    keywords: ["ХАРХОРУМ", "ХОТ", "АРХИТЕКТУР"],
    image: "assets/images/10.jpg"
  }
];


/* =========================
   ELEMENTS
========================= */

const experience = document.getElementById("experience");

const topProgressFill =
  document.getElementById("topProgressFill");

const imageLayerA =
  document.getElementById("imageLayerA");

const imageLayerB =
  document.getElementById("imageLayerB");

const imageA =
  document.getElementById("imageA");

const imageB =
  document.getElementById("imageB");

const content =
  document.getElementById("content");

const chapterNumber =
  document.getElementById("chapterNumber");

const chapterCategory =
  document.getElementById("chapterCategory");

const chapterTitle =
  document.getElementById("chapterTitle");

const chapterDescription =
  document.getElementById("chapterDescription");

const keywords =
  document.getElementById("keywords");

const giantNumber =
  document.getElementById("giantNumber");

const currentChapterEl =
  document.getElementById("currentChapter");

const chapterLineFill =
  document.getElementById("chapterLineFill");

const introOverlay =
  document.getElementById("introOverlay");

const outroOverlay =
  document.getElementById("outroOverlay");

const scrollHint =
  document.getElementById("scrollHint");


/* =========================
   HELPERS
========================= */

function clamp(value, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function ease(t) {
  t = clamp(t);
  return t * t * (3 - 2 * t);
}


/* =========================
   RENDER TEXT
========================= */

let renderedChapter = -1;

function renderChapter(index) {

  if (renderedChapter === index) return;

  renderedChapter = index;

  const chapter = chapters[index];

  chapterNumber.textContent = chapter.number;
  chapterCategory.textContent = chapter.category;
  chapterTitle.innerHTML = chapter.title;
  chapterDescription.textContent = chapter.text;

  giantNumber.textContent = chapter.number;
  currentChapterEl.textContent = chapter.number;

  keywords.innerHTML = "";

  chapter.keywords.forEach(word => {

    const span = document.createElement("span");

    span.textContent = word;

    keywords.appendChild(span);

  });

}


/* =========================
   MAIN ANIMATION
========================= */

function update() {

  const rect =
    experience.getBoundingClientRect();

  const total =
    experience.offsetHeight -
    window.innerHeight;

  const progress =
    clamp(-rect.top / total);


  /* top progress */

  topProgressFill.style.width =
    `${progress * 100}%`;


  /* ==================================
     INTRO
  ================================== */

  const introEnd = 0.075;

  const introP =
    clamp(progress / introEnd);

  const introEase =
    ease(introP);


  /*
    Intro starts full screen,
    then opens horizontally.
  */

  introOverlay.style.clipPath =
    `inset(
      0
      ${introEase * 50}%
      0
      ${introEase * 50}%
    )`;


  introOverlay.style.transform =
    `scale(${1 + introEase * 0.35})`;


  introOverlay.style.opacity =
    `${1 - clamp((introP - .65) / .35)}`;


  scrollHint.style.opacity =
    `${1 - introP * 2}`;



  /* ==================================
     CHAPTER AREA
  ================================== */

  const storyStart = introEnd;
  const storyEnd = 0.92;

  const storyP = clamp(
    (progress - storyStart) /
    (storyEnd - storyStart)
  );


  const totalTransitions =
    chapters.length;


  const raw =
    storyP * totalTransitions;


  let index =
    Math.floor(raw);


  if (index >= chapters.length) {
    index = chapters.length - 1;
  }


  let local =
    raw - Math.floor(raw);


  if (storyP >= 1) {
    local = 1;
  }


  renderChapter(index);


  const nextIndex =
    Math.min(
      index + 1,
      chapters.length - 1
    );


  /*
    Current + next images
  */

  imageA.src =
    chapters[index].image;

  imageB.src =
    chapters[nextIndex].image;



  /* ==================================
     CHAPTER TIMELINE

     0.00 - 0.50  chapter stays visible
     0.50 - 1.00  transition
  ================================== */

  const transition =
    ease(
      clamp(
        (local - 0.50) / 0.50
      )
    );


  const calm =
    clamp(local / 0.5);



  /* ==================================
     DIFFERENT TRANSITIONS

     4 animation styles rotate.
  ================================== */

  const style =
    index % 4;



  /* ----------------------------------
     STYLE 0
     Image zoom takeover
  ---------------------------------- */

  if (style === 0) {

    const scaleA =
      lerp(
        1,
        1.55,
        transition
      );


    imageLayerA.style.transform =
      `translateY(-50%)
       translateX(${lerp(0, -22, transition)}vw)
       scale(${scaleA})`;


    imageLayerA.style.opacity =
      `${1 - transition}`;


    imageLayerA.style.clipPath =
      `inset(0 0 0 0)`;


    imageLayerB.style.transform =
      `translateY(-50%)
       translateX(${lerp(28, 0, transition)}vw)
       scale(${lerp(.72, 1, transition)})`;


    imageLayerB.style.opacity =
      `${transition}`;


    imageLayerB.style.clipPath =
      `inset(
        0
        ${lerp(45, 0, transition)}%
        0
        0
      )`;

  }



  /* ----------------------------------
     STYLE 1
     Horizontal cinematic wipe
  ---------------------------------- */

  else if (style === 1) {

    imageLayerA.style.transform =
      `translateY(-50%)
       translateX(${lerp(0, 60, transition)}vw)
       rotate(${lerp(0, 4, transition)}deg)`;


    imageLayerA.style.opacity =
      `${1 - transition * .8}`;


    imageLayerA.style.clipPath =
      `inset(
        0
        0
        0
        ${transition * 100}%
      )`;


    imageLayerB.style.transform =
      `translateY(-50%)
       translateX(${lerp(-45, 0, transition)}vw)
       scale(${lerp(1.25, 1, transition)})`;


    imageLayerB.style.opacity =
      `${transition}`;


    imageLayerB.style.clipPath =
      `inset(
        0
        ${lerp(100, 0, transition)}%
        0
        0
      )`;

  }



  /* ----------------------------------
     STYLE 2
     Center reveal
  ---------------------------------- */

  else if (style === 2) {

    imageLayerA.style.transform =
      `translateY(-50%)
       scale(${lerp(1, .7, transition)})
       rotate(${lerp(0, -3, transition)}deg)`;


    imageLayerA.style.opacity =
      `${1 - transition}`;


    imageLayerA.style.clipPath =
      `inset(
        ${transition * 35}%
        ${transition * 35}%
        ${transition * 35}%
        ${transition * 35}%
      )`;


    const side =
      lerp(50, 0, transition);


    imageLayerB.style.transform =
      `translateY(-50%)
       scale(${lerp(1.35, 1, transition)})`;


    imageLayerB.style.opacity =
      `${transition}`;


    imageLayerB.style.clipPath =
      `inset(
        0
        ${side}%
        0
        ${side}%
      )`;

  }



  /* ----------------------------------
     STYLE 3
     Push / depth
  ---------------------------------- */

  else {

    imageLayerA.style.transform =
      `translateY(-50%)
       translateX(${lerp(0, -45, transition)}vw)
       scale(${lerp(1, .75, transition)})`;


    imageLayerA.style.opacity =
      `${1 - transition}`;


    imageLayerA.style.clipPath =
      `inset(0)`;


    imageLayerB.style.transform =
      `translateY(-50%)
       translateX(${lerp(55, 0, transition)}vw)
       scale(${lerp(.55, 1, transition)})`;


    imageLayerB.style.opacity =
      `${transition}`;


    imageLayerB.style.clipPath =
      `inset(0)`;

  }



  /* ==================================
     IMAGE INTERNAL CAMERA MOTION
  ================================== */

  imageA.style.transform =
    `scale(${1.05 + calm * .08})
     translateX(${calm * -1.5}%)`;


  imageB.style.transform =
    `scale(${1.15 - transition * .1})`;



  /* ==================================
     TEXT ANIMATION
     
     No vertical movement.
  ================================== */

  const textExit =
    ease(
      clamp(
        (local - .52) / .30
      )
    );


  content.style.opacity =
    `${1 - textExit}`;


  content.style.transform =
    `translateY(-50%)
     translateX(${textExit * -16}vw)
     scale(${1 - textExit * .15})`;


  /*
    Giant number moves opposite direction.
  */

  giantNumber.style.transform =
    `translateX(${local * 7}vw)
     scale(${1 + local * .08})`;



  /* ==================================
     SIDE CHAPTER PROGRESS
  ================================== */

  const chapterProgress =
    (
      index +
      Math.min(local, 1)
    ) /
    chapters.length;


  chapterLineFill.style.height =
    `${chapterProgress * 100}%`;



  /* ==================================
     OUTRO
  ================================== */

  const outroStart =
    0.92;


  const outroP =
    ease(
      clamp(
        (progress - outroStart) /
        (1 - outroStart)
      )
    );


  outroOverlay.style.opacity =
    `${outroP}`;


  outroOverlay.style.transform =
    `scale(${lerp(1.35, 1, outroP)})`;


  const cut =
    lerp(
      50,
      0,
      outroP
    );


  outroOverlay.style.clipPath =
    `inset(
      ${cut}%
      0
      ${cut}%
      0
    )`;


  requestAnimationFrame(update);
}


/* =========================
   PRELOAD IMAGES
========================= */

chapters.forEach(chapter => {

  const image =
    new Image();

  image.src =
    chapter.image;

});


/* =========================
   START
========================= */

renderChapter(0);

requestAnimationFrame(update);