
/* ═══════════════════════════════════════════════════════════
   THE SE7EN — one file, three languages, no external requests.
   Registered, non-judgemental, sourced. Every claim carries a link.
   ═══════════════════════════════════════════════════════════ */
const DATA = {

uz: {
  "brand.sub":"gunoh va fazilat",
  nav:{usul:"Usul", juftlik:"Juftliklar", zanjir:"Muhrlar", jadval:"Jadval", lugat:"Lug‘at", manbalar:"Manbalar"},
  m:{title:"Yetti muhr", hint:"mantiqiy jumboq · cheksiz rejim",
    lead:"Qo‘lingizda yetti muhr va yetti raqamlangan o‘rin. Har bir muhr yashirin tartib haqida bitta haqiqat aytadi. Jumboq shunday tuzilganki, 5 040 mumkin bo‘lgan tartibdan faqat bittasi hamma muhrga bir vaqtda mos keladi.",
    intro:"Bu o‘yin o‘qib chiqish bilan yechilmaydi: hech bir muhr to‘liq javobni aytmaydi. Har biri faqat ba’zi tartiblarni yo‘qotadi, qolganini siz o‘zingiz chiqarib tashlaysiz. Aylana yopilganda yettita nur birdan yonadi — o‘sha lahza butun o‘yinning maqsadi.",
    howh:"Qanday o‘ynaladi",
    how:"Kartani tanlab, aylanadagi o‘ringa bosing — yoki sichqoncha bilan sudrab tashlang. «Sinov» bitta o‘rinni tekshiradi va to‘g‘ri yoki xato ekanini aytadi (cheklangan). «Ochish» bitta o‘rinni to‘g‘ri qo‘yib qulflaydi — u ham sinovdan ketadi. «Tekshirish» butun aylanani tekshiradi: mashqda faqat xatolar sonini aytadi, shuning uchun taxmin qilish foyda bermaydi; cheksiz rejimda bitta xato o‘yinni tugatadi. Mashqda vaqt yo‘q, sinov uchta — tinch o‘ylaysiz. Cheksiz rejimda har daraja yangi aylana: vaqt qisqaradi, sinov kamayadi, ball to‘planadi.",
    cluesT:"Muhrlar", cardsT:"Yetti gunoh", time:"vaqt", testsW:"sinov", cluesW:"muhr",
    check:"Tekshirish", test:"Sinov", reveal:"Ochish", newPz:"Yangi jumboq", next:"Keyingi daraja",
    solo:"Mashq", runT:"Cheksiz", points:"ball", pointsWord:"ball", levelWord:"daraja", usedW:"sinov sarflandi",
    pickCard:"Avval kartani tanlang.", pickSeat:"Endi aylanadagi o‘rinni bosing.",
    needSeat:"Bu o‘rinda karta yo‘q — avval kartani qo‘ying.",
    needAll:"Aylana to‘liq emas: yettita o‘rin ham to‘ldirilishi kerak.",
    testPrompt:"Tekshirmoqchi bo‘lgan o‘rinni bosing.", testOk:"To‘g‘ri.", testNo:"Xato — bu o‘rinda boshqa gunoh turishi kerak.",
    revealOk:"{n}-o‘rin ochildi va qulflandi.",
    wrongN:"{n} o‘rin xato. Qaysi biri ekanini aniqlash uchun «Sinov» bor.",
    wrongRun:"{n} o‘rin xato edi — aylana shu yerda ochildi.",
    timeout:"Vaqt tugadi — aylana yopilmadi.",
    doneT:"Aylana yopildi",
    solved:"Aylana yopildi: yettita muhr bir vaqtda bajarildi.",
    orderT:"Tartib:", levelUp:"{l}-daraja — yangi aylana, vaqt qisqardi.",
    overH:"Aylana ochildi",
    overT:"{l}-darajada to‘xtadingiz: {s} ball, vaqt {t}.",
    tr:{kibr:"o‘zini ustun qo‘yish", buxiylik:"yig‘ishga berilish", shahvat:"istakning chetga chiqishi",
        gazab:"o‘ylamasdan javob berish", ochkozlik:"me’yordan ortiq yeyish", hasad:"birovning holiga qarab o‘lchash",
        dangasalik:"hech narsa qilmaslik"},
    cAt:"{a} — {n}-o‘rinda.", cNotAt:"{a} — {n}-o‘rinda emas.",
    cNext:"{a}dan keyin — {b} (7-o‘rindan keyin 1-o‘rin keladi).",
    cAdj:"{a} va {b} — qo‘shni o‘rinlarda.",
    cNotAdj:"{a} va {b} — qo‘shni emas.",
    cBefore:"{a} — {b}dan kichikroq raqamli o‘rinda.",
    cGap:"{a} bilan {b} orasida (kichik raqamdan kattasiga qarab) aynan {n} o‘rin bor.",
    cGapOne:"{a} bilan {b} orasida (kichik raqamdan kattasiga qarab) aynan bitta o‘rin bor."},
  ui:{print:"Chop etish / PDF", theme:"Kunduzgi yoki tungi ko‘rinish"},
  hero:{kicker:"Ma’lumotnoma · yetti juftlik · 2026",
    sub:"Gunoh — me’yordan chiqish. Fazilat — o‘rta.", cta:"Yetti muhrni yechish",
    lede:"Yetti gunoh — ikki ming yillik ro‘yxat. Bu sahifa uni dahshat emas, me’yor masalasi sifatida oladi: har bir gunoh chetga chiqish, uning qarshisida esa o‘rtani ushlab turuvchi fazilat turadi. Har fikr yonida manba bor."},
  meta:[["7","juftlik"],["7","varaq"],["3","til"],["%n","manba"]],
  usul:{title:"Usul", hint:"uch tamoyil",
    a:{h:"Nima bu", t:"Qiyosiy ma’lumotnoma: yetti tushuncha, ularning teskarisi va Markaziy Osiyo didaktik adabiyotidagi muqobillari — bir sahifada, izchil tartibda."},
    b:{h:"Nima emas", t:"Diniy risola emas, hukm chiqaruvchi qo‘llanma emas, dahshat hikoyalari to‘plami ham emas. Bu madaniyatlar tarixidagi bitta ro‘yxatning izohi."},
    c:{h:"Mantiq", t:"Har gunoh — me’yordan chiqish; fazilat — o‘rta. Aristotelning «me’yor» ta’limoti shu sahifaning o‘qiga olingan."}},
  juftlik:{title:"Yetti juftlik", hint:"gunoh → fazilat",
    intro:"Tartib lotin an’anasidan. Har bo‘limda avval gunoh — qisqa va neytral ta’rif bilan, keyin uning teskarisi va shu fikrning mahalliy ildizi."},
  labels:{virtue:"Teskarisi — fazilat", practice:"Amaliyotda", refs:"Manbalar", src:"manba"},
  entries:[
    {n:"01", lat:"Superbia", name:"Kibr", gloss:"o‘zini ustun qo‘yish",
     def:"Kibr — o‘zini boshqalardan ustun qo‘yish va tanqidni eshitmaslik. Klassik ro‘yxatda u ildiz sanaladi: qolgan oltisi shundan shox yasaydi.",
     vlat:"Humilitas", vname:"Kamtarlik",
     vtext:"Kamtarlik — o‘zini kamsitish emas, o‘zining haqiqiy o‘lchamini bilish. Aristotel bu fazilatni ikki xato orasiga qo‘yadi: o‘zini oshirib yuborish va o‘zini bekorga pastga urish.",
     practice:"Mintaqaning eng qadimgi nasihat kitobi Qobusnoma (1082) ota tomonidan o‘g‘ilga yozilgan: unda tinglash, kattalar oldida o‘zini tutish va o‘zini maqtamaslik haqida alohida boblari bor. Qoida amaliy: tanqidni qabul qilgan odam o‘rganishda davom etadi.",
     quote:"Hurmat qilsang — hurmat ko‘rasan.", qsrc:"O‘zbek xalq maqoli",
     refs:["Aristotel, NE II.7","Qobusnoma, 1082","Maqollar to‘plami"]},

    {n:"02", lat:"Avaritia", name:"Buxiylik", gloss:"yig‘ishga berilish",
     def:"Buxiylik — to‘plashga berilish: keragi yo‘q narsani ham ushlab turish va hech narsa bermaslik. Muammo miqdorda emas, yopiq qo‘lda.",
     vlat:"Liberalitas", vname:"Saxovat",
     vtext:"Saxovat — isrof bilan ziqnalik o‘rtasidagi o‘rta: kerakli miqdorni, kerakli odamga, kerakli paytda berish. Aristotelning mezoni sovg‘aning kattaligi emas, berishdan keyin odam erkin qoladimi — shu.",
     practice:"Hashar — qishloqning birgalikdagi ishi: uy qurish, ariq tozalash, hosilni yig‘ib olish. Haq so‘ralmaydi, hisob yuritilmaydi; aylanadigan narsa — mehnat, va u uy bo‘lib qaytadi.",
     quote:"Yaxshilik qil, daryoga tashla.", qsrc:"O‘zbek xalq maqoli",
     refs:["Aristotel, NE II.7","Maqollar to‘plami"]},

    {n:"03", lat:"Luxuria", name:"Shahvat", gloss:"istakning me’yordan chiqishi",
     def:"Shahvat — me’yordan chiqqan istak: boshqa odam shaxs emas, vosita bo‘lib qoladigan holat. Bu yerda mavzu faqat tushuncha darajasida qoladi.",
     vlat:"Castitas", vname:"O‘zini tuta bilish",
     vtext:"Bu fazilat ikki chet orasidagi o‘rta: bir tomonda indamaydigan to‘yim, ikkinchi tomonda har qanday zavqni rad etadigan qotib qolish. Mohiyati oddiy: xohlay olasan, lekin tanlay olasan.",
     practice:"Mintaqa adabida tarbiyalangan odamning belgisi zohidlik emas, tekislik: mehmon hurmat qilinadi, aytilgan so‘z ustidan chiqiladi, va’da qizishib turib berilmaydi.",
     quote:"O‘zingga ravo ko‘rmaganni boshqaga ham ravo ko‘rma.", qsrc:"O‘zbek xalq maqoli",
     refs:["Aristotel, NE III.10–12","Maqollar to‘plami"]},

    {n:"04", lat:"Ira", name:"G‘azab", gloss:"o‘ylamasdan javob berish",
     def:"G‘azab — fikrdan oldin keladigan javob: dalil o‘rnini kuch egallaydigan lahza.",
     vlat:"Patientia", vname:"Sabr-toqat",
     vtext:"Aristotel bu fazilatni ham ikki xato orasiga qo‘yadi: hamma narsaga portlaydigan jahldorlik va hech narsaga javob bermaydigan befarqlik. Fazilat — joyida va me’yorida achchiqlanish, keyin to‘xtay olish.",
     practice:"Hunarmand buni birinchi bo‘lib o‘rganadi: kulol loyni shoshiltirmaydi. Maqol xuddi shu sabrni kundalik nonga bog‘laydi — sabr achchiq, mevasi shirin.",
     quote:"Jahlning dushmani — sabr.", qsrc:"O‘zbek xalq maqoli",
     refs:["Aristotel, NE IV.5","Maqollar to‘plami"]},

    {n:"05", lat:"Gula", name:"Ochko‘zlik", gloss:"me’yordan ortiq yeyish-ichish",
     def:"Ochko‘zlik — ehtiyojdan ortiq yeyish-ichish; ko‘pincha isrofga aylanadi: ozgina kerak, ko‘p olinadi, ortig‘i tashlanadi.",
     vlat:"Temperantia", vname:"Me’yor",
     vtext:"Me’yor — parhez emas, «yetarli» so‘zini bilish odati. Qanoat bir qadam narida: bor narsaga suyanish, keyingisi ortidan quvmaslik.",
     practice:"Uyda non bosib o‘tilmaydi, betiga teskari qoldirilmaydi, tashlanmaydi. Kichkina qoida, lekin ortida katta fikr turibdi: mehnat bilan topilgan narsa isrof qilinmaydi.",
     quote:"Boriga rozi bo‘l, yo‘g‘iga sabr qil.", qsrc:"O‘zbek xalq maqoli",
     refs:["Aristotel, NE III.10–12","Maqollar to‘plami"]},

    {n:"06", lat:"Invidia", name:"Hasad", gloss:"birovning yaxshiligidan qiynalish",
     def:"Hasad — birovning yaxshiligidan og‘riq. Narsa kerak bo‘lgani uchun emas, boshqada borligi uchun og‘riydi; shuning uchun hech qachon to‘ymaydi.",
     vlat:"Benevolentia", vname:"Ko‘ngli ochiqlik",
     vtext:"Aristotel hasadni adolatli norozilikdan ajratadi: hasad boshqasining yo‘qotishini xohlaydi, norozilik esa xatoni tuzatishni. Ko‘ngli ochiqlik engilroq va foydaliroq yo‘l: hisob yuritmasdan xursand bo‘lish.",
     practice:"Mehmondo‘stlik — uning kundalik davosi: dasturxonga chaqirilgan odam begona bo‘lmaydi, to‘ydirilgan begonaga hasad qilish esa qiyin.",
     quote:"O‘zing yaxshi — olam yaxshi.", qsrc:"O‘zbek xalq maqoli",
     refs:["Aristotel, NE II.7; Rhetorika II.10","Maqollar to‘plami"]},

    {n:"07", lat:"Acedia", name:"Dangasalik", gloss:"ishdan va burchdan qochish",
     def:"Dangasalik — ishdan va burchdan qochish; ba’zan chuqurroq holat: hech narsani boshlashga arzimaydigandek tuyuladi.",
     vlat:"Industria", vname:"Mehnatsevarlik",
     vtext:"Mehnatsevarlik — kuchli iroda emas, kichik qadamlar odati: boshla, tugat, yana boshla. Aristotelning fikri shu yerda ham ishlaydi: fazilat qaror bilan emas, takror bilan yasaladi.",
     practice:"Qadimgi shogirdlik qoidasi: hunar avval ikki yil yomon ishlab o‘rganiladi. «Mehnat — rohatning poydevori» degan maqol ham shu haqda.",
     quote:"Mehnat — rohatning poydevori.", qsrc:"O‘zbek xalq maqoli",
     refs:["Aristotel, NE II.1–4","Qutadg‘u bilig, 1069–70","Maqollar to‘plami"]}
  ],
  e:{title:"Cheksiz rejim", tag:"reyting · hisob · rekord",
    lead:"Mashqda o‘rganasiz — cheksiz rejimda sinovdan o‘tasiz. Har yechilgan aylana — keyingi daraja: vaqt qisqaradi, sinov kamayadi, muhrlar kamayadi. Bitta xato yoki vaqt tugashi o‘yinni tugatadi, shuning uchun rekord doim yangilanadi.",
    score:"ball", level:"daraja", best:"rekord", start:"Boshlash", stop:"To‘xtatish",
    idle:"Tayyormisiz? Har yopilgan aylana — bir daraja. Xato tekshiruv yoki vaqt tugashi o‘yinni tugatadi.",
    need:"Boshlash uchun hisobingizga kiring — rekord va reyting hisobingizga bog‘lanadi.",
    over:"Aylana ochildi", again:"Yana urinish", overT:"{n} ball · {l}-daraja · {t}",
    newBest:"yangi rekord!", circle:"Aylana yopildi — daraja {l}", wrong:"Xato tekshiruv.", timeout:"Vaqt tugadi.", quit:"To‘xtatildi."},
  a:{signup:"Roʻyxatdan oʻtish", login:"Kirish", name:"Foydalanuvchi nomi", pass:"Parol",
    go:"Davom etish", logout:"Chiqish", hi:"Kirildi:", you:"siz", note:"Hisob shu qurilmada saqlanadi: server yoʻq, parol ochiq matnda saqlanmaydi (PBKDF2-SHA256, 120 000 takror).",
    errName:"Nom 3–16 belgi: harflar, raqamlar, pastki chiziq.", errPass:"Parol kamida 4 belgi.",
    errTaken:"Bu nom allaqachon olingan.", errBad:"Nom yoki parol xato.", errBusy:"Tekshirilmoqda…"},
  b:{title:"Reyting", local:"eng yaxshi 10 · shu qurilma", empty:"Hali natija yoʻq — birinchi boʻling.", rank:"#", name:"ism", score:"ball", level:"daraja", date:"sana"},
  zanjir:{
    whyT:"Nega bu o‘yin bir o‘qishda yechilmaydi",
    why:[
      {h:"Javob matnda yo‘q", t:"Yettita gunohning 5 040 xil tartibi bor. Muhrlar to‘plami shundan faqat bittasini qoldiradi — qolgan 5 039 tasini siz o‘zingiz chiqarib tashlaysiz. Har bir muhr boshqasi bilan birga ishlaydi, shuning uchun sahifani bir marta o‘qib chiqish hech narsa bermaydi: javob xulosada, satrlarda emas.", n:0},
      {h:"Yarim yechilgan aylana", t:"Louenshteyn ko‘rsatganidek, odamni to‘liq bilmagan narsa emas, aynan sal qolgan narsa tortadi: bilim bo‘shlig‘i tor bo‘lsa, uni yopish istagi kuchli bo‘ladi. Muhrlar aynan shu holatni yasaydi — har biri bilan nomzodlar kamayadi, lekin aylana yopilmaguncha bo‘shliq qoladi.", n:11},
      {h:"Boshlangan ish qaytaradi", t:"Zeygarnikning 1927-yildagi ishi xotira haqida edi va keyingi takrorlashlarda zaif chiqdi; mustahkam qolgan qismi — Ovsiankinaning kuzatuvi: boshlangan ishni odam o‘zi qaytib tugatadi. Shuning uchun yechilmagan aylana ekranda turadi va qaytib kelishni so‘raydi.", n:12},
      {h:"Birinchi muhr — sovg‘a", t:"Nunes va Dreze karta tajribasida oldindan berilgan ikki shtamp tugatish darajasini 19% dan 34% ga ko‘tardi, sharti — sovg‘aning sababi aytilishi. Shuning uchun birinchi muhr har doim bitta o‘rinni to‘g‘ridan-to‘g‘ri aytadi: aylana bo‘sh varaqdan boshlanmaydi.", n:13},
      {h:"O‘z qo‘li bilan yopilgan aylana", t:"Norton, Mochon va Arieli «IKEA effekti»ni ko‘rsatdi: odam o‘zi yig‘gan narsani qimmatroq baholaydi, lekin ish buzilsa effekt o‘chadi. Shuning uchun mashqda xato tekshiruv hech narsani o‘chirmaydi — faqat xatolar sonini aytadi. Cheksiz rejimda xato — qoida, jazo emas: u rekordni yangilash imkoniyati bo‘lib qoladi.", n:15},
      {h:"Oxirgi lahza esda qoladi", t:"Kahneman va hamkasablari tajriba qanday esda qolishini davomiylik emas, eng kuchli nuqta va yakun belgilashini ko‘rsatdi. Shuning uchun eng kuchli lahza oxirida: oxirgi muhr joyiga tushganda yettita nur birdan yonadi va aylana yopiladi.", n:16}
    ],
    doneC:"Muhrlarning kuchi — birgalikda: har biri alohida kuchsiz, yettitasi birga aylanani qulflaydi.",
    share:"Natijani nusxalash", shared:"Nusxalandi",
    cuts:[["Kibr","Kamtarlik"],["Buxiylik","Saxovat"],["Shahvat","O‘zini tutish"],["G‘azab","Sabr"],["Ochko‘zlik","Me’yor"],["Hasad","Ko‘ngli ochiqlik"],["Dangasalik","Mehnatsevarlik"]]},

  jadval:{title:"Bir jadvalda", hint:"7 qator", cap:"Yetti gunoh va ularning qarshisidagi fazilat",
    th:["№","Gunoh (lotin)","Nomi","Fazilat","Lotincha","Manba"]},
  note:{h:"Bir eslatma",
    t:"Yetti gunoh ro‘yxati Kitobda yo‘q — u antik davr oxirida Lotin G‘arbida shakllangan va o‘rta asrda qotib qolgan. Bu sahifa uni mazhab yoki hukm sifatida emas, madaniy ramka sifatida oladi: ro‘yxat Yevropada shakllangan, lekin o‘xshash savollar Markaziy Osiyo nasihat adabiyotida ham bor — Qobusnoma, Qutadg‘u bilig, Navoiyning «Mahbub ul-qulub»i. Shuning uchun har gunohning qarshisiga mahalliy manbada ham tan olingan fazilat qo‘yildi."},
  lugat:{title:"Lug‘at", hint:"12 atama",
    items:[["Superbia","Lotincha «yuqorida turish»; kibrning kitobiy nomi."],
      ["Avaritia","Lotincha «achinish»; buxiylikning kitobiy nomi."],
      ["Luxuria","Lotincha «to‘lib-toshish»; me’yordan chiqqan istak."],
      ["Acedia","Yunoncha «befarqlik»; dangasalikning kitobiy nomi."],
      ["Humilitas","Kamtarlik; «humus» — yer so‘zidan."],
      ["Temperantia","Me’yor; «temperare» — chegaralash."],
      ["Mesotes","Yunoncha «o‘rta»: Aristotelning me’yor tamoyili."],
      ["Hexis","Yunoncha «odat»: fazilat takror orqali yasaladi."],
      ["Qanoat","Arabcha «yetarli deb bilish» — kundalik o‘zbekcha atama."],
      ["Sabr","Arabcha «chidash» — kundalik o‘zbekcha atama."],
      ["Hashar","Birgalikdagi, haqsiz qishloq ishi."],
      ["Nasihatnoma","Ota yoki ustozning o‘g‘il yoki shogirdga yozgan odob kitobi."]]},
  manbalar:{title:"Manbalar", hint:"tekshirilgan",
    intro:"Har bo‘lim oxiridagi manba satri shu ro‘yxatga ishora qiladi. Havolalar asl nashr va rasmiy bazalarga olib boradi."},
  foot:{a:"Matn — ochiq manbalar asosidagi ma’lumotnoma. Foydalanishda manbani ko‘rsating; tarjimalar mualliflik tarjimasi.",
    b:"Sahifa bir faylda: tashqi skript, reklama va kuzatuvchi yo‘q."}
},

en: {
  "brand.sub":"vice and virtue",
  nav:{usul:"Method", juftlik:"Pairs", zanjir:"Seals", jadval:"Table", lugat:"Glossary", manbalar:"Sources"},
  m:{title:"The Seven Seals", hint:"logic puzzle · endless run",
    lead:"Seven seals, seven numbered seats. Each seal is one true statement about a hidden arrangement — and exactly one of the 5 040 possible arrangements satisfies all of them at once.",
    intro:"This cannot be solved by reading: no seal states the answer. Each one only eliminates candidates; the rest you have to reason out yourself. When the ring closes, all seven rays light at once — that moment is the whole point.",
    howh:"How to play",
    how:"Pick a card and click a seat on the ring — or drag the card onto it. “Test” checks one seat and tells you whether it is right (limited). “Reveal” places and locks one seat for you — it spends a test too. “Check” verifies the whole ring: in practice it only says how many seats are wrong, so guessing gains nothing; in the endless run one wrong ring ends the game. Practice has no clock and three tests. In the endless run every level is a new ring: less time, fewer tests, more points.",
    cluesT:"Seals", cardsT:"The seven vices", time:"time", testsW:"tests", cluesW:"seals",
    check:"Check", test:"Test", reveal:"Reveal", newPz:"New puzzle", next:"Next level",
    solo:"Practice", runT:"Endless", points:"points", pointsWord:"points", levelWord:"level", usedW:"tests spent",
    pickCard:"Pick a card first.", pickSeat:"Now click a seat on the ring.",
    needSeat:"That seat is empty — place a card on it first.",
    needAll:"The ring is incomplete: all seven seats must be filled.",
    testPrompt:"Click the seat you want to test.", testOk:"Correct.", testNo:"Wrong — another vice belongs in that seat.",
    revealOk:"Seat {n} has been revealed and locked.",
    wrongN:"{n} seats are wrong. “Test” tells you which.",
    wrongRun:"{n} seats were wrong — the ring opened here.",
    timeout:"Time ran out — the ring did not close.",
    doneT:"The ring is closed",
    solved:"The ring is closed: all seven seals hold at once.",
    orderT:"The order:", levelUp:"Level {l} — a new ring, less time.",
    overH:"The ring opened",
    overT:"You stopped at level {l}: {s} points, {t} on the clock.",
    tr:{kibr:"setting yourself above others", buxiylik:"holding on to what you have", shahvat:"appetite past the mean",
        gazab:"answering before thinking", ochkozlik:"eating past need", hasad:"measuring yourself by others",
        dangasalik:"doing nothing"},
    cAt:"{a} sits in seat {n}.", cNotAt:"{a} is not in seat {n}.",
    cNext:"After {a} comes {b} (seat 7 is followed by seat 1).",
    cAdj:"{a} and {b} sit in neighbouring seats.",
    cNotAdj:"{a} and {b} are not neighbours.",
    cBefore:"{a} sits in a lower-numbered seat than {b}.",
    cGap:"Exactly {n} seats lie between {a} and {b}, counting from the lower number upward.",
    cGapOne:"Exactly one seat lies between {a} and {b}, counting from the lower number upward."},
  ui:{print:"Print / PDF", theme:"Day or night view"},
  hero:{kicker:"Reference · seven pairs · 2026",
    sub:"Vice is the extreme. Virtue is the mean.", cta:"Solve the seven seals",
    lede:"The seven deadly sins are a two-thousand-year-old list. This page reads the list not as horror but as a question of measure: every vice is an overshoot, and opposite it stands the virtue that holds the middle. Every claim carries a source."},
  meta:[["7","pairs"],["7","cards"],["3","languages"],["%n","sources"]],
  usul:{title:"Method", hint:"three principles",
    a:{h:"What this is", t:"A comparative reference: seven concepts, their reversals, and the equivalents found in the didactic literature of Central Asia — on one page, in a fixed order."},
    b:{h:"What it is not", t:"Not a religious tract, not a book of rulings, not a collection of horror stories. It is a reading of one list inside cultural history."},
    c:{h:"The logic", t:"Every vice is a departure from measure; the virtue is the middle. Aristotle’s doctrine of the mean is the axis of this page."}},
  juftlik:{title:"Seven pairs", hint:"vice → virtue",
    intro:"The order follows the Latin tradition. Each entry opens with the vice, defined briefly and neutrally, then turns to its reversal and to the local root of that idea."},
  labels:{virtue:"Its reversal — virtue", practice:"In practice", refs:"Sources", src:"source"},
  entries:[
    {n:"01", lat:"Superbia", name:"Pride", gloss:"putting oneself above others",
     def:"Pride is the habit of placing oneself above others and refusing to hear correction. In the classical list it is the root: the other six grow out of it.",
     vlat:"Humilitas", vname:"Humility",
     vtext:"Humility is not self-belittlement; it is knowing your own true size. Aristotle sets this virtue between two errors — vanity, which overrates, and undue self-abasement, which underrates.",
     practice:"The oldest advice book of the region, the Qabus-nama (1082), was written by a father for his son; whole chapters deal with listening, with holding oneself before elders, and with not praising oneself. The rule is practical: the person who accepts correction keeps learning.",
     quote:"Respect others, and you will be respected.", qsrc:"Uzbek proverb",
     refs:["Aristotle, NE II.7","Qabus-nama, 1082","Proverb collection"]},

    {n:"02", lat:"Avaritia", name:"Greed", gloss:"the urge to hoard",
     def:"Greed is the urge to accumulate: holding what is not needed and giving nothing away. The problem is not the amount but the closed hand.",
     vlat:"Liberalitas", vname:"Generosity",
     vtext:"Generosity is the middle between waste and meanness: the right amount, to the right person, at the right time. Aristotle’s test is not the size of the gift but whether giving leaves you free.",
     practice:"Hashar — the village working together: raising a house, clearing the irrigation channel, bringing in the harvest. No wage is asked and no account is kept; what circulates is labour, and it returns as a house.",
     quote:"Do good and cast it into the river.", qsrc:"Uzbek proverb",
     refs:["Aristotle, NE II.7","Proverb collection"]},

    {n:"03", lat:"Luxuria", name:"Lust", gloss:"desire beyond measure",
     def:"Lust is desire that has left its measure: a state in which another person becomes a means rather than a person. The subject stays here at the level of idea, not scene.",
     vlat:"Castitas", vname:"Self-command",
     vtext:"The virtue lies between two edges: numbness that refuses all pleasure, and appetite that refuses all limits. Its core is simple — you may want, and still choose.",
     practice:"In the advice literature of the region the mark of a disciplined person is not austerity but evenness: the guest is respected, the word given is kept, and no promise is made in heat.",
     quote:"Do not wish for another what you would not wish for yourself.", qsrc:"Uzbek proverb",
     refs:["Aristotle, NE III.10–12","Proverb collection"]},

    {n:"04", lat:"Ira", name:"Wrath", gloss:"answering before thinking",
     def:"Wrath is the answer that arrives before the thought — the moment when force takes the place of argument.",
     vlat:"Patientia", vname:"Even temper",
     vtext:"Aristotle sets this virtue between two errors too: irascibility, which explodes at everything, and dullness, which never answers even a wrong worth answering. The virtue is to be angry at the right thing, at the right time, and then to stop.",
     practice:"A craftsman learns this first: a potter does not hurry clay. The proverb ties the same patience to daily bread — patience is bitter, its fruit is sweet.",
     quote:"The enemy of anger is patience.", qsrc:"Uzbek proverb",
     refs:["Aristotle, NE IV.5","Proverb collection"]},

    {n:"05", lat:"Gula", name:"Gluttony", gloss:"eating and drinking beyond need",
     def:"Gluttony is eating and drinking beyond need, and it usually ends in waste: a little is required, much is taken, the rest is thrown out.",
     vlat:"Temperantia", vname:"Measure",
     vtext:"Measure is not a diet; it is the habit of knowing where “enough” lies. Contentment is a step further: leaning on what you already have instead of chasing the next thing.",
     practice:"In the house, bread is not stepped over, not left face-down, not thrown out. A small rule — and behind it a large idea: what is made by labour is not wasted.",
     quote:"Be content with what you have; be patient with what you lack.", qsrc:"Uzbek proverb",
     refs:["Aristotle, NE III.10–12","Proverb collection"]},

    {n:"06", lat:"Invidia", name:"Envy", gloss:"pain at another’s good",
     def:"Envy is pain at another person’s good — not because the thing is wanted, but because someone else has it. That is why it is never satisfied.",
     vlat:"Benevolentia", vname:"Goodwill",
     vtext:"Aristotle separates envy from just resentment: envy wants the other to lose, resentment wants the wrong corrected. Goodwill is the lighter, better habit — gladness at another’s success, without keeping a score.",
     practice:"Hospitality is its everyday cure: a guest at the table stops being a stranger, and a stranger who has been fed is harder to resent.",
     quote:"Be good yourself, and the world is good.", qsrc:"Uzbek proverb",
     refs:["Aristotle, NE II.7; Rhetoric II.10","Proverb collection"]},

    {n:"07", lat:"Acedia", name:"Sloth", gloss:"flight from work and duty",
     def:"Sloth is flight from work and duty, and sometimes a deeper state in which nothing seems worth beginning.",
     vlat:"Industria", vname:"Diligence",
     vtext:"Diligence is not a strong will; it is the habit of small steps — begin, finish, begin again. Aristotle’s point holds here too: virtues are made by repetition, not by resolution.",
     practice:"The old rule of apprenticeship: a craft is learned by doing it badly for two years. “Labour is the foundation of rest,” says the proverb.",
     quote:"Labour is the foundation of rest.", qsrc:"Uzbek proverb",
     refs:["Aristotle, NE II.1–4","Qutadgu Bilig, 1069–70","Proverb collection"]}
  ],
  e:{title:"The endless run", tag:"rating · account · record",
    lead:"Practice teaches you; the endless run tests you. Every ring you close is the next level: less time, fewer tests, fewer seals. One wrong check or a drained clock ends the run, so the record is always there to be beaten.",
    score:"points", level:"level", best:"best", start:"Start", stop:"Stop",
    idle:"Ready? Every closed ring is one level. A wrong check or a drained clock ends the run.",
    need:"Sign in above to start — your record and rating are tied to your account.",
    over:"The ring opened", again:"Try again", overT:"{n} points · level {l} · {t}",
    newBest:"new record!", circle:"Ring closed — level {l}", wrong:"Wrong check.", timeout:"Time ran out.", quit:"Stopped."},
  a:{signup:"Sign up", login:"Sign in", name:"Username", pass:"Password",
    go:"Continue", logout:"Sign out", hi:"Signed in:", you:"you", note:"The account lives in this browser: there is no server, and the password is never stored in plain text (PBKDF2-SHA256, 120,000 rounds).",
    errName:"Name 3–16 characters: letters, digits, underscore.", errPass:"Password at least 4 characters.",
    errTaken:"That name is already taken.", errBad:"Wrong name or password.", errBusy:"Checking…"},
  b:{title:"Rating", local:"top 10 · this device", empty:"No results yet — be the first.", rank:"#", name:"name", score:"points", level:"level", date:"date"},
  zanjir:{
    whyT:"Why this game cannot be solved in one reading",
    why:[
      {h:"The answer is not on the page", t:"Seven vices can be arranged in 5 040 different orders. A set of seals leaves exactly one of them standing — the other 5 039 you eliminate yourself. Each seal only works together with the others, so a single pass over the text gives nothing: the answer lives in the deduction, not in the lines.", n:0},
      {h:"A half-closed ring", t:"Loewenstein showed that people are pulled not by what they wholly lack but by what they almost know: the narrower the information gap, the stronger the urge to close it. The seals manufacture exactly that state — every one removes candidates, yet the gap survives until the ring closes.", n:11},
      {h:"An unfinished task pulls you back", t:"Zeigarnik’s 1927 study was about memory and did not replicate well; what held up is Ovsiankina’s observation — people resume a task they started on their own. That is why an unsolved ring is left on screen: it asks to be returned to.", n:12},
      {h:"The first seal is a gift", t:"In Nunes and Drèze’s loyalty-card experiment, two stamps given up front raised completion from 19 % to 34 % — on condition that the reason for the gift was stated. So the first seal always names one seat outright: the ring never starts from a blank sheet.", n:13},
      {h:"A ring you closed yourself", t:"Norton, Mochon and Ariely showed the IKEA effect: people value what they assembled themselves, but the effect collapses if the build is destroyed. So in practice a wrong check deletes nothing — it only counts the wrong seats. In the endless run a mistake is a rule, not a punishment: it simply leaves the record to be beaten another time.", n:15},
      {h:"The last moment is what stays", t:"Kahneman and colleagues showed that an experience is remembered by its peak and its end, not by its length. That is why the peak sits last: when the final seal drops into place, all seven rays light at once and the ring closes.", n:16}
    ],
    doneC:"A seal is weak alone: each says one thing, and only all seven together lock the ring.",
    share:"Copy the result", shared:"Copied",
    cuts:[["Pride","Humility"],["Greed","Generosity"],["Lust","Self-command"],["Wrath","Patience"],["Gluttony","Temperance"],["Envy","Open-heartedness"],["Sloth","Diligence"]]},

  jadval:{title:"In one table", hint:"7 rows", cap:"The seven vices and the virtue set against each",
    th:["№","Vice (Latin)","Name","Virtue","Latin","Source"]},
  note:{h:"One note",
    t:"The seven-sin list is not in the Bible — it took shape in the Latin West in late antiquity and hardened in the Middle Ages. This page treats it not as a doctrine or a verdict but as a cultural frame: the list was formed in Europe, yet similar questions run through the didactic literature of Central Asia too — the Qabus-nama, Qutadgu Bilig, Navoiy’s Mahbub ul-qulub. That is why each vice is paired with a virtue that local sources also recognise."},
  lugat:{title:"Glossary", hint:"12 terms",
    items:[["Superbia","Latin “to be above”; the book name of pride."],
      ["Avaritia","Latin “to grieve over”; the book name of greed."],
      ["Luxuria","Latin “to overflow”; desire past its measure."],
      ["Acedia","Greek “indifference”; the book name of sloth."],
      ["Humilitas","Humility; from humus — earth."],
      ["Temperantia","Measure; from temperare — to bound."],
      ["Mesotes","Greek “the middle”: Aristotle’s principle of the mean."],
      ["Hexis","Greek “habit”: virtue is made by repetition."],
      ["Qanoat","Arabic “to deem sufficient” — an everyday Uzbek word."],
      ["Sabr","Arabic “to endure” — an everyday Uzbek word."],
      ["Hashar","Communal village labour, given without pay."],
      ["Nasihatnama","An advice book written by a father or master for a son or apprentice."]]},
  manbalar:{title:"Sources", hint:"verified",
    intro:"The source line at the end of each entry points to this list. Links lead to the original editions and official databases."},
  foot:{a:"A reference text built on open sources. When quoting, name the source; translations are the author’s.",
    b:"One file: no external scripts, no advertising, no trackers."}
},

ru: {
  "brand.sub":"порок и добродетель",
  nav:{usul:"Метод", juftlik:"Пары", zanjir:"Печати", jadval:"Таблица", lugat:"Словарь", manbalar:"Источники"},
  m:{title:"Семь печатей", hint:"логическая задача · бесконечный режим",
    lead:"Семь печатей и семь пронумерованных мест. Каждая печать — одно верное утверждение о скрытом порядке. Из 5 040 возможных порядков ровно один удовлетворяет всем печатям сразу.",
    intro:"Это нельзя решить прочтением: ни одна печать не называет ответ. Каждая лишь отсекает варианты, остальное вы выводите сами. Когда кольцо замкнётся, все семь лучей вспыхнут разом — ради этого момента всё и устроено.",
    howh:"Как играть",
    how:"Выберите карту и нажмите на место в кольце — или перетащите карту мышью. «Проверка» проверяет одно место и говорит, верно ли оно (ограниченно). «Открыть» ставит и закрепляет одно место за вас — это тоже расходует проверку. «Сверить» проверяет всё кольцо: в практике оно называет только число неверных мест, поэтому угадывать бессмысленно; в бесконечном режиме одна неверная сверка заканчивает игру. В практике нет таймера и есть три проверки. В бесконечном режиме каждый уровень — новое кольцо: меньше времени, меньше проверок, больше очков.",
    cluesT:"Печати", cardsT:"Семь пороков", time:"время", testsW:"проверок", cluesW:"печатей",
    check:"Сверить", test:"Проверка", reveal:"Открыть", newPz:"Новая задача", next:"Следующий уровень",
    solo:"Практика", runT:"Бесконечный", points:"очков", pointsWord:"очков", levelWord:"уровень", usedW:"проверок потрачено",
    pickCard:"Сначала выберите карту.", pickSeat:"Теперь нажмите на место в кольце.",
    needSeat:"Это место пусто — сначала поставьте на него карту.",
    needAll:"Кольцо не заполнено: нужны все семь мест.",
    testPrompt:"Нажмите на место, которое хотите проверить.", testOk:"Верно.", testNo:"Неверно — здесь другой порок.",
    revealOk:"Место {n} открыто и закреплено.",
    wrongN:"{n} мест неверны. Какие именно — покажет «Проверка».",
    wrongRun:"{n} мест были неверны — кольцо раскрылось здесь.",
    timeout:"Время вышло — кольцо не замкнулось.",
    doneT:"Кольцо замкнуто",
    solved:"Кольцо замкнуто: все семь печатей верны одновременно.",
    orderT:"Порядок:", levelUp:"Уровень {l} — новое кольцо, времени меньше.",
    overH:"Кольцо раскрылось",
    overT:"Вы остановились на уровне {l}: {s} очков, время {t}.",
    tr:{kibr:"ставить себя выше других", buxiylik:"держаться за накопленное", shahvat:"желание за пределами меры",
        gazab:"отвечать раньше, чем думать", ochkozlik:"есть больше потребности", hasad:"мерить себя другими",
        dangasalik:"ничего не делать"},
    cAt:"{a} — на {n}-м месте.", cNotAt:"{a} — не на {n}-м месте.",
    cNext:"{a} и {b} — соседние места, и {b} идёт следующим по номеру (после 7-го — 1-е).",
    cAdj:"{a} и {b} — на соседних местах.",
    cNotAdj:"{a} и {b} — не соседи.",
    cBefore:"{a} — на месте с меньшим номером, чем {b}.",
    cGap:"{a} и {b} стоят так, что между ними (от меньшего номера к большему) ровно {n} места.",
    cGapOne:"{a} и {b} стоят так, что между ними (от меньшего номера к большему) ровно одно место."},
  ui:{print:"Печать / PDF", theme:"Дневной или ночной вид"},
  hero:{kicker:"Справочник · семь пар · 2026",
    sub:"Порок — выход из меры. Добродетель — середина.", cta:"Решить семь печатей",
    lede:"Семь смертных грехов — список возрастом в две тысячи лет. Эта страница читает его не как ужас, а как вопрос о мере: каждый порок — крайность, и напротив него стоит добродетель, держащая середину. У каждого утверждения есть источник."},
  meta:[["7","пар"],["7","карт"],["3","языка"],["%n","источников"]],
  usul:{title:"Метод", hint:"три принципа",
    a:{h:"Что это", t:"Сравнительный справочник: семь понятий, их обратная сторона и соответствия в дидактической литературе Центральной Азии — на одной странице, в строгом порядке."},
    b:{h:"Чем это не является", t:"Это не религиозный трактат, не книга предписаний и не сборник историй ужасов. Это разбор одного списка внутри истории культуры."},
    c:{h:"Логика", t:"Каждый порок — уход от меры; добродетель — середина. Учение Аристотеля о середине взято осью этой страницы."}},
  juftlik:{title:"Семь пар", hint:"порок → добродетель",
    intro:"Порядок взят из латинской традиции. В каждом разделе сначала порок — кратко и нейтрально, затем его обратная сторона и местный корень этой мысли."},
  labels:{virtue:"Обратная сторона — добродетель", practice:"На практике", refs:"Источники", src:"источник"},
  entries:[
    {n:"01", lat:"Superbia", name:"Гордыня", gloss:"поставить себя выше других",
     def:"Гордыня — привычка ставить себя выше других и не слышать поправок. В классическом списке она считается корнем: остальные шесть вырастают из неё.",
     vlat:"Humilitas", vname:"Смирение",
     vtext:"Смирение — не самоуничижение, а знание своего настоящего размера. Аристотель ставит эту добродетель между двумя ошибками: тщеславием, которое завышает, и напрасным самоуничижением, которое занижает.",
     practice:"Самая старая книга наставлений региона — «Кабус-наме» (1082), написанная отцом для сына; целые главы в ней о том, как слушать, как держать себя перед старшими и как не хвалить себя. Правило практическое: кто принимает поправку, тот продолжает учиться.",
     quote:"Уважай других — и тебя будут уважать.", qsrc:"Узбекская пословица",
     refs:["Аристотель, NE II.7","Кабус-наме, 1082","Сборник пословиц"]},

    {n:"02", lat:"Avaritia", name:"Жадность", gloss:"стремление копить",
     def:"Жадность — стремление копить: держать ненужное и ничего не отдавать. Дело не в количестве, а в закрытой руке.",
     vlat:"Liberalitas", vname:"Щедрость",
     vtext:"Щедрость — середина между расточительством и скупостью: нужное количество, нужному человеку, в нужный момент. Мерило Аристотеля — не размер дара, а остаёшься ли ты свободным, когда отдаёшь.",
     practice:"Хашар — совместная работа села: поставить дом, очистить арык, собрать урожай. Платы не просят и счёта не ведут; в обороте труд, и он возвращается домом.",
     quote:"Сделай добро и брось его в реку.", qsrc:"Узбекская пословица",
     refs:["Аристотель, NE II.7","Сборник пословиц"]},

    {n:"03", lat:"Luxuria", name:"Похоть", gloss:"желание вне меры",
     def:"Похоть — желание, вышедшее из меры: состояние, в котором другой человек становится средством, а не человеком. Здесь тема остаётся на уровне понятия.",
     vlat:"Castitas", vname:"Владение собой",
     vtext:"Добродетель лежит между двумя краями: оцепенением, отвергающим всякое удовольствие, и аппетитом, не знающим границ. Суть проста: можно хотеть — и всё равно выбирать.",
     practice:"В литературе наставлений региона признак воспитанного человека — не аскеза, а ровность: гостя уважают, данному слову следуют, обещание не дают в горячке.",
     quote:"Не желай другому того, чего не желаешь себе.", qsrc:"Узбекская пословица",
     refs:["Аристотель, NE III.10–12","Сборник пословиц"]},

    {n:"04", lat:"Ira", name:"Гнев", gloss:"ответ раньше мысли",
     def:"Гнев — ответ, приходящий раньше мысли: мгновение, когда сила занимает место довода.",
     vlat:"Patientia", vname:"Ровность",
     vtext:"Аристотель и здесь ставит добродетель между двумя ошибками: вспыльчивостью, которая взрывается из-за всего, и вялостью, которая не отвечает даже на настоящую несправедливость. Добродетель — злиться на верное, в верное время и уметь остановиться.",
     practice:"Ремесленник узнаёт это первым: гончар не торопит глину. Пословица привязывает то же терпение к хлебу: терпение горько, плод его сладок.",
     quote:"Враг гнева — терпение.", qsrc:"Узбекская пословица",
     refs:["Аристотель, NE IV.5","Сборник пословиц"]},

    {n:"05", lat:"Gula", name:"Обжорство", gloss:"есть и пить сверх нужды",
     def:"Обжорство — еда и питьё сверх нужды, и обычно оно кончается расточительством: нужно немного, берут много, остальное выбрасывают.",
     vlat:"Temperantia", vname:"Мера",
     vtext:"Мера — не диета, а привычка знать, где лежит «достаточно». Довольство на шаг дальше: опираться на то, что есть, а не гнаться за следующим.",
     practice:"В доме через хлеб не переступают, не кладут его лицевой стороной вниз, не выбрасывают. Маленькое правило — и за ним большая мысль: сделанное трудом не тратится впустую.",
     quote:"Будь доволен тем, что есть, и терпелив к тому, чего нет.", qsrc:"Узбекская пословица",
     refs:["Аристотель, NE III.10–12","Сборник пословиц"]},

    {n:"06", lat:"Invidia", name:"Зависть", gloss:"боль от чужого блага",
     def:"Зависть — боль от чужого блага: не потому, что вещь нужна, а потому, что она есть у другого. Поэтому она никогда не насыщается.",
     vlat:"Benevolentia", vname:"Доброжелательность",
     vtext:"Аристотель отделяет зависть от праведного негодования: зависть хочет, чтобы другой потерял, негодование — чтобы ошибка была исправлена. Доброжелательность легче и полезнее: радость за чужой успех без счёта.",
     practice:"Гостеприимство — её повседневное лекарство: приглашённый за дастархан перестаёт быть чужим, а накормленному чужому завидовать труднее.",
     quote:"Сам будь хорош — и мир хорош.", qsrc:"Узбекская пословица",
     refs:["Аристотель, NE II.7; Риторика II.10","Сборник пословиц"]},

    {n:"07", lat:"Acedia", name:"Лень", gloss:"бегство от труда и долга",
     def:"Лень — бегство от труда и обязанности, а иногда более глубокое состояние: кажется, что начинать ничего не стоит.",
     vlat:"Industria", vname:"Трудолюбие",
     vtext:"Трудолюбие — не сильная воля, а привычка малых шагов: начни, закончи, начни снова. Мысль Аристотеля работает и здесь: добродетель делается повторением, а не решением.",
     practice:"Старое правило ученичества: ремесло осваивают, два года делая его плохо. «Труд — основа покоя», — говорит пословица.",
     quote:"Труд — основа покоя.", qsrc:"Узбекская пословица",
     refs:["Аристотель, NE II.1–4","Кутадгу билиг, 1069–70","Сборник пословиц"]}
  ],
  e:{title:"Бесконечный режим", tag:"рейтинг · аккаунт · рекорд",
    lead:"В практике вы учитесь; в бесконечном режиме проходите проверку. Каждое замкнутое кольцо — следующий уровень: меньше времени, меньше проверок, меньше печатей. Одна неверная сверка или истёкшее время заканчивают игру, поэтому рекорд всегда можно побить.",
    score:"очков", level:"уровень", best:"рекорд", start:"Начать", stop:"Остановить",
    idle:"Готовы? Каждое замкнутое кольцо — один уровень. Неверная сверка или истёкшее время заканчивают игру.",
    need:"Войдите выше, чтобы начать — рекорд и рейтинг привязаны к аккаунту.",
    over:"Кольцо раскрылось", again:"Ещё попытка", overT:"{n} очков · уровень {l} · {t}",
    newBest:"новый рекорд!", circle:"Кольцо замкнуто — уровень {l}", wrong:"Неверная сверка.", timeout:"Время вышло.", quit:"Остановлено."},
  a:{signup:"Регистрация", login:"Вход", name:"Имя пользователя", pass:"Пароль",
    go:"Продолжить", logout:"Выйти", hi:"Вход выполнен:", you:"вы", note:"Аккаунт хранится в этом браузере: сервера нет, пароль не хранится открытым текстом (PBKDF2-SHA256, 120 000 итераций).",
    errName:"Имя 3–16 символов: буквы, цифры, подчёркивание.", errPass:"Пароль не короче 4 символов.",
    errTaken:"Это имя уже занято.", errBad:"Неверное имя или пароль.", errBusy:"Проверяем…"},
  b:{title:"Рейтинг", local:"топ-10 · это устройство", empty:"Результатов пока нет — станьте первым.", rank:"#", name:"имя", score:"очки", level:"уровень", date:"дата"},
  zanjir:{
    whyT:"Почему эту игру нельзя решить одним прочтением",
    why:[
      {h:"Ответа нет в тексте", t:"Семь пороков можно расставить 5 040 способами. Набор печатей оставляет ровно один — остальные 5 039 вы отсекаете сами. Каждая печать работает только вместе с другими, поэтому одно прочтение ничего не даёт: ответ живёт в выводе, а не в строках.", n:0},
      {h:"Наполовину замкнутое кольцо", t:"Лёвенштейн показал: человека тянет не к тому, чего у него нет вовсе, а к тому, что он почти знает — чем уже информационный разрыв, тем сильнее желание его закрыть. Печати создают именно это состояние: каждая убирает варианты, но разрыв живёт, пока кольцо не замкнуто.", n:11},
      {h:"Незаконченное дело возвращает", t:"Работа Зайгарник 1927 года была о памяти и плохо воспроизводилась; устойчивым осталось наблюдение Овсянкиной — начатое дело человек возобновляет сам. Поэтому нерешённое кольцо остаётся на экране: оно просит вернуться.", n:12},
      {h:"Первая печать — подарок", t:"В эксперименте Нуньеса и Дрезе два заранее проставленных штампа подняли долю завершённых карт с 19 % до 34 % — при условии, что причина подарка названа. Поэтому первая печать всегда прямо называет одно место: кольцо не начинается с пустого листа.", n:13},
      {h:"Кольцо, замкнутое своими руками", t:"Нортон, Мошон и Ариели показали эффект IKEA: человек ценит то, что собрал сам, но эффект исчезает, если сборку разрушить. Поэтому в практике неверная сверка ничего не стирает — она лишь называет число неверных мест. В бесконечном режиме ошибка — это правило, а не наказание: она оставляет рекорд, который можно побить.", n:15},
      {h:"Запоминается последний момент", t:"Канеман и коллеги показали, что опыт запоминается по пику и финалу, а не по длительности. Поэтому пик стоит в конце: когда последняя печать встаёт на место, все семь лучей вспыхивают разом и кольцо замыкается.", n:16}
    ],
    doneC:"Печать слаба в одиночку: каждая говорит одно, и только все семь вместе запирают кольцо.",
    share:"Скопировать результат", shared:"Скопировано",
    cuts:[["Гордыня","Смирение"],["Алчность","Щедрость"],["Похоть","Власть над собой"],["Гнев","Терпение"],["Обжорство","Умеренность"],["Зависть","Открытость"],["Уныние","Трудолюбие"]]},

  jadval:{title:"В одной таблице", hint:"7 строк", cap:"Семь пороков и противостоящая каждому добродетель",
    th:["№","Порок (лат.)","Название","Добродетель","Лат.","Источник"]},
  note:{h:"Одно замечание",
    t:"Списка семи грехов нет в Библии — он сложился в латинском Западе в поздней античности и застыл в Средние века. Эта страница берёт его не как вероучение и не как приговор, а как культурную рамку: список сложился в Европе, но похожие вопросы есть и в дидактической литературе Центральной Азии — «Кабус-наме», «Кутадгу билиг», «Махбуб уль-кулуб» Навои. Поэтому напротив каждого порока стоит добродетель, признанная и местными источниками."},
  lugat:{title:"Словарь", hint:"12 терминов",
    items:[["Superbia","Лат. «быть наверху»; книжное имя гордыни."],
      ["Avaritia","Лат. «скорбеть»; книжное имя жадности."],
      ["Luxuria","Лат. «переливаться»; желание вне меры."],
      ["Acedia","Греч. «равнодушие»; книжное имя лени."],
      ["Humilitas","Смирение; от humus — земля."],
      ["Temperantia","Мера; от temperare — ограничивать."],
      ["Mesotes","Греч. «середина»: принцип меры Аристотеля."],
      ["Hexis","Греч. «привычка»: добродетель делается повторением."],
      ["Qanoat","Араб. «считать достаточным» — обиходное узбекское слово."],
      ["Sabr","Араб. «терпеть» — обиходное узбекское слово."],
      ["Hashar","Совместный сельский труд без оплаты."],
      ["Nasihatnama","Книга наставлений отца или учителя сыну или ученику."]]},
  manbalar:{title:"Источники", hint:"проверено",
    intro:"Строка источников в конце каждого раздела отсылает к этому списку. Ссылки ведут к оригинальным изданиям и официальным базам."},
  foot:{a:"Справочный текст на основе открытых источников. При цитировании указывайте источник; переводы — авторские.",
    b:"Один файл: без внешних скриптов, рекламы и трекеров."}
}
};

/* ── bibliography (language-neutral) ───────────────────────── */
const SOURCES = [
  {t:"Aristoteles, <i>Ethica Nicomachea</i>, II.5–9 (doctrine of the mean); III.10–12; IV.5.",
   href:"http://classics.mit.edu/Aristotle/nicomachaen.2.ii.html"},
  {t:"Aristoteles, <i>Rhetorica</i>, II.10 (envy and just resentment).",
   href:"http://classics.mit.edu/Aristotle/rhetoric.2.ii.html"},
  {t:"Plato, <i>Respublica</i>, IV (the cardinal virtues).",
   href:"http://classics.mit.edu/Plato/republic.5.iv.html"},
  {t:"Encyclopaedia Britannica, “seven deadly sins” — the history of the list.",
   href:"https://www.britannica.com/topic/seven-deadly-sins"},
  {t:"Kaykovus, <i>Qobusnoma</i>, 1082–83 — advice of a father to his son.",
   href:"https://uz.wikipedia.org/wiki/Qobusnoma"},
  {t:"Yusuf Xos Hojib, <i>Qutadg‘u bilig</i>, 1069–70.", href:"https://uz.wikipedia.org/wiki/Yusuf_Xos_Hojib"},
  {t:"Alisher Navoiy, <i>Mahbub ul-qulub</i>, 1499.", href:"https://uz.wikipedia.org/wiki/Mahbub_ul-qulub"},
  {t:"T. Mirzayev, A. Musoqulov, B. Sarimsoqov (eds.), <i>O‘zbek xalq maqollari</i>.",
   href:"https://n.ziyouz.com/books/uzbek_xalq_ogzaki_ijodi/"},
  {t:"Seneca, <i>De ira</i>; <i>De brevitate vitae</i> (Stoic readings on anger and time).",
   href:"https://www.gutenberg.org/ebooks/author/1308"},
  {t:"Dante Alighieri, <i>Purgatorio</i>, c. 1315 — the literary afterlife of the list.",
   href:"https://en.wikipedia.org/wiki/Purgatorio"},
  /* the psychology of why a half-open sentence holds attention — see the note under the puzzle */
  {t:"G. Loewenstein, “The Psychology of Curiosity: A Review and Reinterpretation”, <i>Psychological Bulletin</i> 116(1), 1994, 75–98 (the information gap).",
   href:"https://www.byrdseed.com/handouts/Psychology%20of%20Curiosity.pdf"},
  {t:"B. Zeigarnik, “On Finished and Unfinished Tasks”, 1927 — and the later replication record (the resumption effect survived, the memory claim did not).",
   href:"https://en.wikipedia.org/wiki/Zeigarnik_effect"},
  {t:"J. C. Nunes, X. Drèze, “The Endowed Progress Effect”, <i>Journal of Consumer Research</i> 32(4), 2006, 504–512.",
   href:"https://www.coglode.com/nuggets/endowed-progress-effect"},
  {t:"R. Kivetz, O. Urminsky, Y. Zheng, “The Goal-Gradient Hypothesis Resurrected”, <i>Journal of Marketing Research</i> 43(1), 2006, 39–58.",
   href:"https://doi.org/10.1509/jmkr.43.1.39"},
  {t:"M. I. Norton, D. Mochon, D. Ariely, “The IKEA Effect: When Labor Leads to Love”, <i>Journal of Consumer Psychology</i> 22(3), 2012.",
   href:"https://www.hbs.edu/ris/Publication%20Files/11-091.pdf"},
  {t:"D. Kahneman, B. L. Fredrickson, C. A. Schreiber, D. A. Redelmeier, “When More Pain Is Preferred to Less: Adding a Better End”, <i>Psychological Science</i>, 1993 (the peak–end rule).",
   href:"https://en.wikipedia.org/wiki/Peak%E2%80%93end_rule"}
];

/* ── render ────────────────────────────────────────────────── */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
let LANG = "uz";

const get = (L, path) => path.split(".").reduce((o, k) => (o == null ? o : o[k]), L);

function entriesHTML(L){
  return L.entries.map(e => `
  <article class="entry" data-rv>
    <div class="rail">
      <span class="num">${e.n}</span>
      <span class="lat">${e.lat}</span>
      <span class="mark" aria-hidden="true"></span>
    </div>
    <div class="body">
      <h3>${e.name}</h3>
      <p class="gloss">${e.gloss}</p>
      <p class="def">${e.def}</p>
      <div class="virtue">
        <span class="lbl">${L.labels.virtue}</span>
        <div class="names"><span class="vname">${e.vname}</span><span class="vlat">${e.vlat}</span></div>
        <p>${e.vtext}</p>
      </div>
      <p class="practice"><b>${L.labels.practice}</b>${e.practice}</p>
      <blockquote>${e.quote}<cite>${e.qsrc}</cite></blockquote>
      <div class="refs">${e.refs.map(r => `<span>${r}</span>`).join("")}</div>
    </div>
  </article>`).join("");
}

function tableHTML(L){
  $("#tblHead").innerHTML = L.jadval.th.map(h => `<th scope="col">${h}</th>`).join("");
  $("#tblBody").innerHTML = L.entries.map((e, i) => `
    <tr>
      <td class="n">${e.n}</td>
      <td class="lat">${e.lat}</td>
      <td>${e.name}</td>
      <td class="v">${e.vname}</td>
      <td>${e.vlat}</td>
      <td>${e.refs[0]}</td>
    </tr>`).join("");
}

function glossHTML(L){
  $("#gloss").innerHTML = L.lugat.items.map(([t, d]) => `<div><dt>${t}</dt><dd>${d}</dd></div>`).join("");
}

function whyHTML(L){
  $("#pzWhyBody").innerHTML = L.zanjir.why.map(w => {
    const src = w.n ? SOURCES[w.n - 1] : null;
    const ref = src ? ` <a href="${src.href}" target="_blank" rel="noopener">[${w.n}]</a>` : "";
    return `<div class="pz-why-item"><h5>${w.h}</h5><p>${w.t}${ref}</p></div>`;
  }).join("");
}

function metaHTML(L){
  $("#metaRow").innerHTML = L.meta.map(([b, s]) => `<div><b>${b === "%n" ? SOURCES.length : b}</b><span>${s}</span></div>`).join("");
}

function srcHTML(){
  $("#src").innerHTML = SOURCES.map(s =>
    `<li>${s.t} <a href="${s.href}" target="_blank" rel="noopener" aria-label="source">↗</a></li>`).join("");
}

/* ── the chain puzzle ──────────────────────────────────────────
   One text, cut into seven pieces. Each piece finishes the sentence
   the one before it left hanging; each piece leaves a new one open.
   The reader never remembers anything — the text is on screen — the
   only thing to find is which fragment fits the open clause.        */
const VK = ["kibr","hasad","buxiylik","ochkozlik","shahvat","gazab","dangasalik"];

/* ── the seven seals: a deduction board ────────────────────────
   Seven vices, seven seats on a ring, and a handful of seals
   (statements). Exactly one arrangement satisfies all of them.
   The puzzles are generated here: a random true arrangement, then
   the smallest set of true statements that pins it down to one
   solution — verified by enumerating all 5 040 permutations.     */

const MUHR = {
  L: null, mode: "solo",
  truth: [], clues: [], placed: [], locked: [], tested: [],
  sel: null, testing: false,
  tests: 3, score: 0, level: 1,
  run: false, deadline: 0, total: 0, raf: null, t0: 0, puzzleT0: 0,
  _all: null, _lastDrag: 0,

  /* ── generation ──────────────────────────────────────────────
     An arrangement is one of 7! = 5040 permutations of the seven
     vices over the seven numbered seats. A seal is a true statement
     about the hidden arrangement; a puzzle is a set of seals that
     leaves exactly one arrangement alive. The set is minimised and
     then made irredundant — drop any single seal and more than one
     arrangement survives. No line on the board states an answer, so
     the ring can only be closed by deriving it.                     */
  shuffle(a){
    const r = [...a];
    for (let i = r.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; }
    return r;
  },
  allPerms(){
    if (this._all) return this._all;
    const out = [], pos = new Int8Array(7), used = new Array(7).fill(false), cur = [];
    const rec = () => {
      if (cur.length === 7){ out.push([...cur]); this._pos.push(Int8Array.from(pos)); return; }
      for (let i = 0; i < 7; i++){
        if (used[i]) continue;
        used[i] = true; cur.push(VK[i]); pos[i] = cur.length - 1;
        rec();
        cur.pop(); used[i] = false;
      }
    };
    this._pos = [];
    rec();
    this._all = out;
    this._full = null;
    return out;
  },
  /* does this seat→key map satisfy one seal? (pos[keyIndex] = seat) */
  ok(pos, c){
    const pa = pos[c.ai], pb = pos[c.bi];
    switch (c.t){
      case "at":     return pa === c.n - 1;
      case "notat":  return pa !== c.n - 1;
      case "next":   return (pa + 1) % 7 === pb;
      case "adj":    { const d = (pa - pb + 7) % 7; return d === 1 || d === 6; }
      case "notadj": { const d = (pa - pb + 7) % 7; return !(d === 1 || d === 6); }
      case "before": return pa < pb;
      case "gap":    return Math.abs(pa - pb) === c.n + 1;
    }
    return true;
  },
  /* the set of surviving arrangements, packed as a bitmap */
  maskFor(c){
    const bits = new Uint32Array(158), pos = this._pos;
    for (let i = 0; i < 5040; i++) if (this.ok(pos[i], c)) bits[i >> 5] |= (1 << (i & 31));
    return bits;
  },
  and(a, b){
    const o = new Uint32Array(158);
    for (let w = 0; w < 158; w++) o[w] = a[w] & b[w];
    return o;
  },
  count(a){
    let n = 0;
    for (let w = 0; w < 158; w++){
      let v = a[w];
      v = v - ((v >>> 1) & 0x55555555);
      v = (v & 0x33333333) + ((v >>> 2) & 0x33333333);
      n += (((v + (v >>> 4)) & 0x0F0F0F0F) * 0x01010101) >>> 24;
    }
    return n;
  },
  fullMask(){
    if (this._full) return this._full;
    const m = new Uint32Array(158);
    for (let w = 0; w < 158; w++) m[w] = 0xFFFFFFFF;
    m[157] = (0xFFFFFFFF >>> (158 * 32 - 5040)) >>> 0;
    this._full = m;
    return m;
  },
  /* every true statement available in this arrangement, with the
     seat indices the bitmap code needs */
  candidates(truth){
    const pos = {}; truth.forEach((k, i) => pos[k] = i);
    const out = [];
    VK.forEach((k, i) => out.push({ t: "at", a: k, ai: i, n: pos[k] + 1 }));
    truth.forEach((k, i) => {
      const b = truth[(i + 1) % 7];
      out.push({ t: "next", a: k, ai: VK.indexOf(k), b, bi: VK.indexOf(b) });
    });
    for (let i = 0; i < 7; i++) for (let j = i + 1; j < 7; j++){
      const a = VK[i], b = VK[j], pa = pos[a], pb = pos[b], d = Math.abs(pa - pb);
      if (d === 1 || d === 6) out.push({ t: "adj", a, ai: i, b, bi: j });
      else out.push({ t: "notadj", a, ai: i, b, bi: j });
      const lo = pa < pb;
      out.push({ t: "before", a: lo ? a : b, ai: lo ? i : j, b: lo ? b : a, bi: lo ? j : i });
      if (d >= 2 && d <= 4) out.push({ t: "gap", a, ai: i, b, bi: j, n: d - 1 });
    }
    VK.forEach((k, ki) => {
      for (let n = 1; n <= 7; n++) if (pos[k] !== n - 1) out.push({ t: "notat", a: k, ai: ki, n });
    });
    return out;
  },

  /* practice is generous, the endless run is not: the same minimal
     seal set, plus n extra true statements that make the derivation
     shorter. Extras never break uniqueness. */
  extraFor(level){ return level <= 1 ? 2 : level <= 3 ? 1 : 0; },

  build(level){
    this.allPerms();
    const truth = this.shuffle(VK);
    const pool = this.shuffle(this.candidates(truth));
    const cache = new Map();
    const mask = c => { if (!cache.has(c)) cache.set(c, this.maskFor(c)); return cache.get(c); };
    const neg = c => (c.t === "notat" || c.t === "notadj");
    const WEIGHT = { at: 1, next: 1, before: 1.03, gap: 1.06, adj: 1.1, notat: 1.28, notadj: 1.34 };
    const practice = !this.run;
    /* how many seats the seals may name outright: a warm start early,
       one seat only once the levels climb */
    const atCap = practice ? 3 : (level <= 2 ? 3 : level <= 4 ? 2 : 1);

    /* the anchor: one seat is stated outright, so the board never
       starts from nothing (endowed progress, in miniature) */
    const anchor = pool.filter(c => c.t === "at")[0];
    const chosen = [anchor];
    let alive = this.and(this.fullMask(), mask(anchor));
    if (practice || level <= 2){
      const second = pool.filter(c => c.t === "at" && c.a !== anchor.a)[0];
      if (second){ chosen.push(second); alive = this.and(alive, mask(second)); }
    }

    /* stage one — concrete seals only; this is the practice mode */
    let guard = 0;
    while (this.count(alive) > 1 && guard++ < 60){
      let best = null, bestV = Infinity;
      for (const c of pool){
        if (neg(c) || chosen.includes(c)) continue;
        if (c.t === "at" && chosen.filter(x => x.t === "at").length >= atCap) continue;
        const n = this.count(this.and(alive, mask(c)));
        /* the same shape twice in a row reads as one long sentence:
           each repeat of a type costs a little */
        const v = n * WEIGHT[c.t] * (1 + 0.16 * chosen.filter(x => x.t === c.t).length);
        if (v < bestV){ bestV = v; best = c; }
      }
      if (!best) break;
      chosen.push(best);
      alive = this.and(alive, mask(best));
    }
    /* stage two — abstract seals ("not beside", "not in seat n") only
       when the concrete ones cannot finish the job */
    guard = 0;
    while (this.count(alive) > 1 && guard++ < 60){
      let best = null, bestV = Infinity;
      for (const c of pool){
        if (!neg(c) || chosen.includes(c)) continue;
        const n = this.count(this.and(alive, mask(c)));
        const v = n * WEIGHT[c.t];
        if (v < bestV){ bestV = v; best = c; }
      }
      if (!best) break;
      chosen.push(best);
      alive = this.and(alive, mask(best));
    }

    /* irredundancy: no seal may be droppable without opening a second
       arrangement — every line the reader is given is load-bearing */
    for (let i = chosen.length - 1; i >= 1; i--){
      const rest = chosen.filter((_, j) => j !== i);
      let a = this.fullMask();
      for (const c of rest) a = this.and(a, mask(c));
      if (this.count(a) === 1) chosen.splice(i, 1);
    }

    /* a floor on how much is stated: practice reads as a warm start,
       the endless run thins out as the levels climb */
    const min = practice ? 6 : (level <= 2 ? 6 : 5);
    const RANK = { before: 0, next: 1, gap: 2, adj: 3 };
    const spare = pool
      .filter(c => !chosen.includes(c) && RANK[c.t] !== undefined)
      .sort((x, y) => RANK[x.t] - RANK[y.t]);
    for (const c of spare){
      if (chosen.length >= min) break;
      chosen.push(c);
    }
    return { truth, clues: this.shuffle(chosen), solutions: this.count(alive) };
  },

  /* ── state ──────────────────────────────────────────────── */
  setLang(L){
    this.L = L;
    this.names = {
      kibr: L.entries[0].name, buxiylik: L.entries[1].name, shahvat: L.entries[2].name,
      gazab: L.entries[3].name, ochkozlik: L.entries[4].name, hasad: L.entries[5].name,
      dangasalik: L.entries[6].name
    };
    if (this.truth && this.truth.length) this.paint();
  },
  nameOf(k){ return (this.names && this.names[k]) || k; },
  traitOf(k){ const t = (this.L && this.L.m && this.L.m.tr) || {}; return t[k] || ""; },

  newPuzzle(level, keepMode){
    const lvl = level || 1;
    let res = this.build(lvl);
    for (let i = 0; i < 6 && res.solutions !== 1; i++) res = this.build(lvl);
    this.truth = res.truth;
    this.clues = res.clues;
    this.placed = new Array(7).fill(null);
    this.locked = new Array(7).fill(false);
    this.tested = new Array(7).fill(null);
    this.sel = null; this.testing = false; this.solvedFlag = false;
    if (!keepMode) this.tests = 3;
    $("#mDone").classList.remove("show");
    $("#mOver").classList.remove("show");
    $("#mBoard").style.display = ""; $("#mActs").style.display = "";
    this.status("");
    this.paint();
  },

  /* ── painting ───────────────────────────────────────────── */
  buildRing(){
    const ring = $("#ring");
    if (!ring || ring.dataset.built) return;
    const svg = $("#ringLines");
    let lines = "";
    for (let i = 0; i < 7; i++){
      const p1 = this.pt(i), p2 = this.pt((i + 1) % 7);
      lines += `<line data-line="${i}" class="${i === 6 ? "close" : ""}" x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}"/>`;
    }
    svg.innerHTML = lines;
    for (let i = 0; i < 7; i++){
      const pos = this.pt(i);
      const el = document.createElement("div");
      el.className = "seat";
      el.dataset.seat = i;
      el.tabIndex = 0;
      el.style.left = pos.x + "%"; el.style.top = pos.y + "%";
      el.innerHTML = `<span class="num">${i + 1}</span><span class="nm"></span>`;
      ring.appendChild(el);
    }
    ring.dataset.built = "1";
  },
  pt(i, R){
    const r = (R === undefined ? 34.5 : R);
    const ang = (-90 + i * (360 / 7)) * Math.PI / 180;
    return { x: (50 + r * Math.cos(ang)).toFixed(2), y: (50 + r * Math.sin(ang)).toFixed(2) };
  },

  clueHTML(c){
    const L = this.L.m, nm = k => `<b>${this.nameOf(k)}</b>`;
    const tpl = c.t === "gap" && c.n === 1 && L.cGapOne ? L.cGapOne : L[c.t === "at" ? "cAt" : c.t === "notat" ? "cNotAt"
      : c.t === "next" ? "cNext" : c.t === "adj" ? "cAdj" : c.t === "notadj" ? "cNotAdj"
      : c.t === "before" ? "cBefore" : "cGap"];
    return String(tpl).replaceAll("{a}", nm(c.a)).replaceAll("{b}", nm(c.b)).replaceAll("{n}", c.n);
  },

  paint(){
    if (!this.L || !this.truth || !this.truth.length) return;
    const L = this.L.m;
    this.buildRing();
    $("#mClues").innerHTML = this.clues.map(c => `<li>${this.clueHTML(c)}</li>`).join("");
    $("#mClueN").textContent = this.clues.length + " " + L.cluesW;
    const placedN = this.placed.filter(Boolean).length;
    $("#mCardsN").textContent = placedN + " / 7";

    $$("#ring .seat").forEach((el, i) => {
      const k = this.placed[i];
      el.classList.toggle("filled", !!k);
      el.classList.toggle("lock", !!this.locked[i]);
      el.classList.toggle("ok", this.tested[i] === "ok" && !this.locked[i]);
      el.classList.toggle("no", this.tested[i] === "no");
      el.classList.toggle("sel", false);
      el.classList.toggle("solved", !!this.solvedFlag);
      const nm = el.querySelector(".nm");
      nm.classList.remove("long", "longer");
      nm.textContent = k ? this.nameOf(k) : "";
      if (k && nm.scrollWidth > nm.clientWidth + 1){
        nm.classList.add("long");
        if (nm.scrollWidth > nm.clientWidth + 1) nm.classList.add("longer");
      }
      const badge = el.querySelector(".badge");
      if (badge) badge.remove();
      if (this.tested[i]){
        const b = document.createElement("span");
        b.className = "badge" + (this.tested[i] === "no" ? " bad" : "");
        b.textContent = this.tested[i] === "ok" ? "✓" : "✕";
        el.appendChild(b);
      }
    });
    $$("#ringLines line").forEach((l, i) => l.classList.toggle("on", !!this.placed[i] && !!this.placed[(i + 1) % 7]));

    $("#mTray").innerHTML = VK.map(k => {
      const used = this.placed.includes(k);
      return `<li><button class="card2 ${used ? "used" : ""} ${this.sel === k ? "sel" : ""}" type="button" data-card="${k}" ${used ? "disabled" : ""}>
        <span class="nm">${this.nameOf(k)}</span><span class="tr">${this.traitOf(k)}</span></button></li>`;
    }).join("");

    $("#mTests").textContent = String(this.tests);
    $("#mCheck").innerHTML = L.check;
    $("#mTest").innerHTML = L.test + `<span class="n">${this.tests}</span>`;
    $("#mHint").textContent = L.reveal;
    $("#mTest").disabled = this.tests <= 0 || this.solvedFlag;
    $("#mHint").disabled = this.tests <= 0 || this.solvedFlag;
    $("#mCheck").disabled = placedN < 7 || this.solvedFlag;
    $("#mNew").style.display = this.run ? "none" : "";
    $("#mNew").textContent = L.newPz;
    $("#mNext").textContent = this.run ? L.nextLevel : L.newPz;
    this.hud();
  },

  hud(){
    const L = this.L ? this.L.m : {};
    $("#mLevel").textContent = this.run ? String(this.level) : "—";
    $("#mScore").textContent = this.run ? String(this.score) : "—";
    const best = Auth.user ? Board.bestOf(Auth.user.key) : 0;
    $("#mBest").textContent = best ? String(best) : "—";
    if (!this.run){ $("#mTime").textContent = "—"; $("#mTests").textContent = String(this.tests); }
    const n = this.placed.filter(Boolean).length;
    $$("#mSeal .ray, #mSealMini .ray, #mSealBig .ray").forEach(r => r.classList.toggle("on", +r.dataset.ray < n));
  },

  /* ── interaction ────────────────────────────────────────── */
  select(k){ if (this.solvedFlag) return; this.sel = (this.sel === k) ? null : k; this.testing = false; this.status(this.sel ? this.L.m.pickSeat : ""); this.paint(); },

  seat(i){
    if (this.locked[i] || this.solvedFlag) return;
    if (this.testing){
      if (!this.placed[i]){ this.status(this.L.m.needSeat); return; }
      const ok = this.placed[i] === this.truth[i];
      this.tested[i] = ok ? "ok" : "no";
      this.tests--;
      this.testing = false;
      this.status(ok ? this.L.m.testOk : this.L.m.testNo);
      this.paint();
      return;
    }
    if (this.sel){
      const key = this.sel;
      const from = this.placed.indexOf(key);
      const occupant = this.placed[i];
      if (from > -1) this.placed[from] = null;
      this.placed[i] = key;
      if (occupant && occupant !== key && from > -1) this.placed[from] = occupant;
      this.tested[i] = null;
      if (occupant && from > -1) this.tested[from] = null;
      this.sel = null;
      this.status("");
      this.paint();
      return;
    }
    if (this.placed[i]){
      this.placed[i] = null;
      this.tested[i] = null;
      this.status("");
      this.paint();
    } else this.status(this.L.m.pickCard);
  },

  testMode(){ if (this.tests <= 0 || this.solvedFlag) return; this.testing = true; this.sel = null; this.status(this.L.m.testPrompt); this.paint(); },

  reveal(){
    if (this.tests <= 0 || this.solvedFlag) return;
    const open = [0,1,2,3,4,5,6].filter(i => this.placed[i] !== this.truth[i] && !this.locked[i]);
    if (!open.length) return;
    const i = open[Math.floor(Math.random() * open.length)];
    const key = this.truth[i];
    const at = this.placed.indexOf(key);
    if (at > -1) this.placed[at] = null;
    this.placed[i] = key; this.locked[i] = true; this.tested[i] = "ok";
    this.tests--;
    this.sel = null; this.testing = false;
    this.status(this.L.m.revealOk.replace("{n}", i + 1));
    this.paint();
  },

  check(){
    if (this.solvedFlag || this.placed.includes(null)){
      if (!this.solvedFlag) this.status(this.L.m.needAll);
      return;
    }
    const wrong = [];
    this.placed.forEach((k, i) => { if (k !== this.truth[i]) wrong.push(i); });
    if (!wrong.length){ this.solve(); return; }
    if (this.run){
      /* the run is unforgiving: one wrong ring ends it */
      wrong.forEach(i => {
        const el = $(`#ring .seat[data-seat="${i}"]`);
        if (el) el.classList.add("no");
      });
      this.status(this.L.m.wrongN.replace("{n}", wrong.length));
      this.endRun("wrong", wrong.length);
      return;
    }
    /* practice gives the count, never the seat: a count alone cannot be
       hill-climbed into an answer, so the deduction still has to be made.
       Finding out *which* seat is wrong is what «Sinov» is for. */
    this.status(this.L.m.wrongN.replace("{n}", wrong.length));
  },

  solve(){
    this.solvedFlag = true;
    this.stopClock();
    let gained = 0, left = 0;
    if (this.run){
      left = Math.max(0, Math.ceil((this.deadline - performance.now()) / 1000));
      gained = 100 + left * 2 + this.tests * 25;
      this.score += gained;
    }
    $("#mDone").classList.add("show");
    $("#mActs").style.display = "none";
    $("#mLoop").innerHTML = `<b>${this.L.m.orderT}</b>` + this.truth.map(k => this.nameOf(k)).join(" → ") + " → " + this.nameOf(this.truth[0]);
    $("#mPairs").innerHTML = this.L.zanjir.cuts.map(([a, b]) => `<li><b>${a}</b> <span>→</span> <i>${b}</i></li>`).join("");
    $("#mWin").innerHTML = this.run
      ? `<span class="st"><b>+${gained}</b>${L2p(this.L.m.points)}</span><span class="st"><b>${left}s</b>${this.L.m.time}</span><span class="st"><b>${this.tests}</b>${this.L.m.testsW}</span>`
      : `<span class="st"><b>${this.clues.length}</b>${this.L.m.cluesW}</span><span class="st"><b>${3 - this.tests}</b>${this.L.m.usedW}</span>`;
    this.status(this.L.m.solved);
    this.paint();
    $("#mDone").scrollIntoView({ behavior: "smooth", block: "center" });
  },

  status(t){ const el = $("#mStatus"); if (el) el.textContent = t || ""; },

  /* ── the endless run ────────────────────────────────────── */
  setMode(m){
    if (m === this.mode && m === "solo") return;
    this.stopClock();
    this.mode = m;
    $$("#modeBar button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.mode === m)));
    $("#mOver").classList.remove("show");
    if (m === "run"){
      this.run = false; this.level = 1; this.score = 0;
      this.solvedFlag = true;
      $("#mBoard").style.display = "none"; $("#mActs").style.display = "none"; $("#mDone").classList.remove("show");
      $("#runIdle").style.display = Auth.user ? "block" : "none";
      $("#runLock").style.display = Auth.user ? "none" : "block";
      this.hud();
    } else {
      this.run = false; this.level = 1; this.score = 0;
      $("#runIdle").style.display = "none"; $("#runLock").style.display = "none";
      $("#mOver").classList.remove("show");
      this.newPuzzle(1, false);
      this.hud();
    }
  },

  startRun(){
    if (!Auth.user){ $("#runLock").style.display = "block"; $("#runIdle").style.display = "none"; return; }
    this.mode = "run"; this.run = true; this.level = 1; this.score = 0;
    this.t0 = performance.now();
    $("#runIdle").style.display = "none"; $("#runLock").style.display = "none";
    $("#mOver").classList.remove("show");
    $$("#modeBar button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.mode === "run")));
    this.enterLevel();
  },

  enterLevel(){
    this.tests = Math.max(1, 3 - Math.floor((this.level - 1) / 2));
    this.total = Math.max(45, 150 - (this.level - 1) * 12) * 1000;
    this.newPuzzle(this.level, true);
    this.tests = Math.max(1, 3 - Math.floor((this.level - 1) / 2));
    this.deadline = performance.now() + this.total;
    this.paint();
    this.startClock();
    this.status(this.L.m.levelUp.replace("{l}", this.level));
  },

  startClock(){
    this.stopClock();
    const tick = () => {
      if (!this.run || this.solvedFlag) return;
      const left = this.deadline - performance.now();
      $("#mTime").textContent = Math.max(0, Math.ceil(left / 1000)) + "s";
      if (left <= 0){ this.endRun("timeout"); return; }
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  },
  stopClock(){ if (this.raf){ cancelAnimationFrame(this.raf); this.raf = null; } },

  endRun(why, n){
    if (!this.run) return;
    this.run = false; this.solvedFlag = true;
    this.stopClock();
    $("#mTime").textContent = "—";
    $("#mBoard").style.display = "none"; $("#mActs").style.display = "none"; $("#mDone").classList.remove("show");
    $("#mOver").classList.add("show");
    $("#mBig").textContent = String(this.score);
    const ms = Math.round(performance.now() - this.t0);
    const u = Auth.user;
    const res = u ? Board.submit(u.key, u.name, this.score, this.level, ms) : { rank: "—" };
    const L = this.L.m;
    $("#mOverTxt").innerHTML = L.overT.replace("{s}", this.score).replace("{l}", this.level).replace("{t}", PZclock(ms)) +
      `<br><span style="font-family:var(--sans); font-size:10.5px; letter-spacing:.14em; text-transform:uppercase; color:var(--muted)">${this.L.b.rank} ${res.rank} · ${this.L.b.score} ${this.score} · ${this.L.b.level} ${this.level}</span>` +
      (why === "wrong" ? `<br><span style="color:var(--accent); font-size:13.6px">${L.wrongRun.replace("{n}", n || 0)}</span>` : "") +
      (why === "timeout" ? `<br><span style="color:var(--accent); font-size:13.6px">${L.timeout}</span>` : "");
    this.hud();
    Board.paint(this.L);
    $("#mOver").scrollIntoView({ behavior: "smooth", block: "center" });
  },

  /* ── drag a card onto a seat (mouse and pen) ────────────── */
  initDrag(){
    const tray = $("#mTray");
    if (!tray) return;
    tray.addEventListener("pointerdown", e => {
      if (e.pointerType === "touch" || e.button !== 0) return;
      const btn = e.target.closest("[data-card]");
      if (!btn || btn.disabled) return;
      const key = btn.dataset.card, sx = e.clientX, sy = e.clientY;
      let ghost = null, hot = null, dragging = false;
      const move = ev => {
        if (!dragging){
          if (Math.hypot(ev.clientX - sx, ev.clientY - sy) < 8) return;
          dragging = true;
          const r = btn.getBoundingClientRect();
          ghost = btn.cloneNode(true);
          ghost.className = "card2 drag-ghost";
          ghost.style.width = r.width + "px";
          document.body.appendChild(ghost);
          btn.classList.add("dragging");
          document.body.classList.add("dragging-card");
        }
        ghost.style.transform = `translate(${ev.clientX - 60}px, ${ev.clientY - 24}px) rotate(-.8deg)`;
        const el = document.elementFromPoint(ev.clientX, ev.clientY);
        const seat = el && el.closest ? el.closest(".seat") : null;
        if (hot && hot !== seat) hot.classList.remove("hot");
        hot = (seat && !seat.classList.contains("lock")) ? seat : null;
        if (hot) hot.classList.add("hot");
      };
      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        window.removeEventListener("pointercancel", up);
        if (ghost) ghost.remove();
        btn.classList.remove("dragging");
        document.body.classList.remove("dragging-card");
        if (hot) hot.classList.remove("hot");
        if (dragging){
          this._lastDrag = Date.now();
          if (hot){ this.sel = key; this.seat(+hot.dataset.seat); }
        }
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
      window.addEventListener("pointercancel", up);
    });
  },

  shareText(){
    const L = this.L.m;
    return this.run
      ? `The Se7en — ${L.title}: ${this.score} ${L.pointsWord} · ${this.level} ${L.levelWord} · se7en-omega.vercel.app`
      : `The Se7en — ${L.title}: ${this.clues.length} ${L.cluesW} · se7en-omega.vercel.app`;
  },
  async share(){
    const txt = this.shareText();
    let ok = false;
    if (navigator.share){ try { await navigator.share({ title: this.L.m.title, text: txt }); ok = true; } catch(e){ return; } }
    if (!ok) try { await navigator.clipboard.writeText(txt); ok = true; } catch(e){}
    const b = $("#mShare");
    b.textContent = ok ? this.L.zanjir.shared : txt;
    setTimeout(() => { b.textContent = this.L.zanjir.share; }, 2200);
  }
};

function PZclock(ms){ const t = Math.max(0, Math.floor(ms / 1000)), m = Math.floor(t / 60), r = t % 60; return m + ":" + String(r).padStart(2, "0"); }
function L2p(s){ return " " + s; }

/* the seven-ray seal */
function sealSVG(){
  const cx = 50, cy = 50, R = 44;
  let out = "";
  for (let i = 0; i < 7; i++){
    const a = -Math.PI / 2 + i * (2 * Math.PI / 7);
    const x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
    out += `<line class="ray" data-ray="${i}" x1="${cx}" y1="${cy}" x2="${x.toFixed(2)}" y2="${y.toFixed(2)}"/>`;
    out += `<circle class="ray" data-ray="${i}" cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="1.8"/>`;
  }
  out += `<circle class="ring" cx="${cx}" cy="${cy}" r="46" fill="none" stroke="currentColor" stroke-width=".8" opacity=".28"/>`;
  out += `<circle cx="${cx}" cy="${cy}" r="10" fill="none" stroke="currentColor" stroke-width="1.1"/>`;
  out += `<circle cx="${cx}" cy="${cy}" r="2.4" fill="currentColor" stroke="none"/>`;
  ["#mSeal", "#mSealMini", "#mSealBig"].forEach(sel => { const el = $(sel); if (el) el.innerHTML = out; });
}

/* ── accounts, rating, endless run ───────────────────────────
   Everything here lives in this browser: there is no server, so the
   rating is a device-local board. Passwords are never stored in the
   clear — PBKDF2-SHA256 over a random salt. If the page is opened in
   an insecure context (no crypto.subtle), accounts are disabled
   rather than silently weakened.                                   */

const Store = {
  get(k, d){ try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch(e){ return d; } },
  set(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch(e){ return false; } },
  del(k){ try { localStorage.removeItem(k); } catch(e){} }
};

const hex = buf => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");

const Auth = {
  user: null,
  can(){ return !!(window.crypto && crypto.subtle && crypto.subtle.deriveBits); },
  async digest(pass, saltHex, rounds){
    const enc = new TextEncoder();
    const salt = Uint8Array.from(saltHex.match(/.{2}/g).map(h => parseInt(h, 16)));
    const key = await crypto.subtle.importKey("raw", enc.encode(pass), "PBKDF2", false, ["deriveBits"]);
    const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: rounds, hash: "SHA-256" }, key, 256);
    return hex(bits);
  },
  randHex(n){
    const a = new Uint8Array(n); crypto.getRandomValues(a);
    return [...a].map(b => b.toString(16).padStart(2, "0")).join("");
  },
  users(){ return Store.get("se7en.users", {}); },
  load(){ this.user = Store.get("se7en.session", null); return this.user; },
  validName(n){ return /^[A-Za-z0-9_ʻ’\u0400-\u04FF]{3,16}$/.test(n); },
  async register(name, pass){
    if (!this.validName(name)) return { ok: false, err: "name" };
    if (!pass || pass.length < 4) return { ok: false, err: "pass" };
    const users = this.users();
    if (users[name.toLowerCase()]) return { ok: false, err: "taken" };
    const salt = this.randHex(16), rounds = 120000;
    let hash = null;
    if (this.can()) hash = await this.digest(pass, salt, rounds);
    else return { ok: false, err: "nocrypto" };
    users[name.toLowerCase()] = { name, salt, hash, rounds, ts: Date.now() };
    Store.set("se7en.users", users);
    this.user = { name, key: name.toLowerCase() };
    Store.set("se7en.session", this.user);
    return { ok: true };
  },
  async login(name, pass){
    const users = this.users(), u = users[String(name || "").toLowerCase()];
    if (!u) return { ok: false, err: "bad" };
    if (!this.can()) return { ok: false, err: "nocrypto" };
    const hash = await this.digest(pass, u.salt, u.rounds || 120000);
    if (hash !== u.hash) return { ok: false, err: "bad" };
    this.user = { name: u.name, key: String(name).toLowerCase() };
    Store.set("se7en.session", this.user);
    return { ok: true };
  },
  logout(){ this.user = null; Store.del("se7en.session"); }
};

const Board = {
  all(){ return Store.get("se7en.board", []); },
  bestOf(key){ const r = this.all().find(x => x.key === key); return r ? r.score : 0; },
  /* one row per player: the best run wins, and it can always be improved */
  submit(key, name, score, level, ms){
    const rows = this.all();
    let row = rows.find(r => r.key === key);
    let fresh = false;
    if (!row){ row = { key, name, score, level, ms, ts: Date.now() }; rows.push(row); fresh = true; }
    else if (score > row.score){ row.score = score; row.level = level; row.ms = ms; row.ts = Date.now(); row.name = name; fresh = true; }
    rows.sort((a, b) => b.score - a.score || b.level - a.level || a.ms - b.ms);
    Store.set("se7en.board", rows.slice(0, 50));
    return { fresh, rank: rows.findIndex(r => r.key === key) + 1 };
  },
  html(L){
    const rows = this.all();
    if (!rows.length) return `<div class="empty">${L.b.empty}</div>`;
    const me = Auth.user ? Auth.user.key : null;
    const body = rows.slice(0, 10).map((r, i) => `<tr class="${r.key === me ? "me" : ""}">
      <td class="n">${i + 1}</td>
      <td>${r.name}${r.key === me ? ` <span style="color:var(--green)">·</span>` : ""}</td>
      <td class="s">${r.score}</td>
      <td class="s">${r.level}</td>
      <td class="d">${new Date(r.ts).toLocaleDateString()}</td></tr>`).join("");
    return `<table><thead><tr><th>${L.b.rank}</th><th>${L.b.name}</th><th>${L.b.score}</th><th>${L.b.level}</th><th>${L.b.date}</th></tr></thead><tbody>${body}</tbody></table>`;
  },
  paint(L){
    const el = $("#lbBody"); if (!el) return;
    el.innerHTML = this.html(L);
    const hd = $("#lb .lb-hd em"); if (hd) hd.textContent = L.b.local;
  }
};

/* ── the account panel (sign up / sign in / who is playing) ── */
const AccountUI = {
  L: null, _tab: "signup",
  render(L){
    if (L) this.L = L;
    const Lx = this.L, box = $("#accBox");
    if (!box || !Lx) return;
    if (Auth.user){
      const best = Board.bestOf(Auth.user.key);
      box.innerHTML = `<div class="who"><b>${Auth.user.name}</b><span>${Lx.a.hi} ${best ? best + " " + Lx.b.score : Lx.b.score + " —"}</span><span class="sp"></span><button class="btn ghost" id="accOut">${Lx.a.logout}</button></div>`;
      $("#accOut").addEventListener("click", () => {
        Auth.logout(); AccountUI.render(); Board.paint(this.L);
        MUHR.setMode("solo"); $("#runLock").style.display = "none";
      });
      $("#runLock").style.display = "none";
      return;
    }
    const tab = this._tab;
    box.innerHTML = `<div class="acc"><div class="acc-card">
      <div class="acc-tabs">
        <button type="button" data-tab="signup" aria-pressed="${tab === "signup"}">${Lx.a.signup}</button>
        <button type="button" data-tab="login" aria-pressed="${tab === "login"}">${Lx.a.login}</button>
      </div>
      <form id="accForm" autocomplete="on">
        <label for="accName">${Lx.a.name}</label>
        <input id="accName" name="username" autocomplete="username" maxlength="16" required>
        <label for="accPass">${Lx.a.pass}</label>
        <input id="accPass" name="password" type="password" autocomplete="current-password" minlength="4" required>
        <div class="row"><button class="btn" type="submit" id="accGo">${Lx.a.go}</button><span class="err" id="accErr"></span></div>
        <p class="fine">${Lx.a.note}</p>
      </form></div></div>`;
    box.querySelectorAll("[data-tab]").forEach(b => b.addEventListener("click", () => { this._tab = b.dataset.tab; this.render(); }));
    $("#accForm").addEventListener("submit", async e => {
      e.preventDefault();
      const name = $("#accName").value.trim(), pass = $("#accPass").value, err = $("#accErr");
      err.textContent = Lx.a.errBusy;
      const fn = (this._tab === "login") ? Auth.login : Auth.register;
      const res = await fn.call(Auth, name, pass);
      if (!res.ok){
        err.textContent = res.err === "name" ? Lx.a.errName : res.err === "pass" ? Lx.a.errPass
          : res.err === "taken" ? Lx.a.errTaken : Lx.a.errBad;
        return;
      }
      this.render(); Board.paint(this.L);
      MUHR.hud();
    });
    if (!Auth.user) $("#runLock").style.display = MUHR.mode === "run" ? "block" : "none";
  }
};

/* ── language ──────────────────────────────────────────────── */
function apply(lang){
  const L = DATA[lang] || DATA.uz;
  LANG = lang;
  document.documentElement.lang = lang;
  $$("[data-i18n]").forEach(el => {
    const v = get(L, el.dataset.i18n);
    if (typeof v === "string" && v) el.textContent = v;
  });
  $$("[data-i18n-title]").forEach(el => {
    const v = get(L, el.dataset.i18nTitle);
    if (typeof v === "string" && v){ el.title = v; el.setAttribute("aria-label", v); }
  });
  $$(".lang button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
  $("#entries").innerHTML = entriesHTML(L);
  tableHTML(L);
  glossHTML(L);
  metaHTML(L);
  whyHTML(L);
  MUHR.setLang(L);
  MUHR.paint();
  AccountUI.render(L);
  Board.paint(L);
  $("#runStart").textContent = L.e.start;
  $("#mAgain").textContent = L.e.again;
  $("#mShare").textContent = L.zanjir.share;
  reveal();
  try { localStorage.setItem("se7en.lang", lang); } catch(e){}
}

/* ── reveal + nav ──────────────────────────────────────────── */
let io = null;
function reveal(){
  if (!("IntersectionObserver" in window)){ $$("[data-rv]").forEach(e => e.classList.add("in")); return; }
  if (io) io.disconnect();
  io = new IntersectionObserver(es => {
    es.forEach(en => { if (en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
  $$("[data-rv]:not(.in)").forEach(e => io.observe(e));
}

function spy(){
  const secs = $$("main section[id]");
  const links = $$("nav.links a");
  const onScroll = () => {
    const y = scrollY + 130;
    let cur = secs[0] && secs[0].id;
    secs.forEach(s => { if (s.offsetTop <= y) cur = s.id; });
    links.forEach(a => a.classList.toggle("on", a.dataset.nav === cur));
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ── boot ──────────────────────────────────────────────────── */
(function boot(){
  let saved = null;
  try { saved = localStorage.getItem("se7en.lang"); } catch(e){}
  if (!saved) saved = "uz";
  $$(".lang button").forEach(b => b.addEventListener("click", () => apply(b.dataset.lang)));
  const p = $("#printBtn"); if (p) p.addEventListener("click", () => window.print());
  sealSVG();
  /* accounts, rating, and the seal board */
  Auth.load();
  MUHR.setLang(DATA[LANG] || DATA.uz);
  MUHR.newPuzzle(1, false);
  AccountUI.render(DATA[LANG] || DATA.uz);
  Board.paint(DATA[LANG] || DATA.uz);

  $("#mTray").addEventListener("click", e => {
    if (Date.now() - MUHR._lastDrag < 350) return;
    const b = e.target.closest("[data-card]");
    if (b && !b.disabled) MUHR.select(b.dataset.card);
  });
  $("#ring").addEventListener("click", e => {
    const seat = e.target.closest(".seat");
    if (seat) MUHR.seat(+seat.dataset.seat);
  });
  $("#ring").addEventListener("keydown", e => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const seat = e.target.closest(".seat");
    if (seat){ e.preventDefault(); MUHR.seat(+seat.dataset.seat); }
  });
  $("#mCheck").addEventListener("click", () => MUHR.check());
  $("#mTest").addEventListener("click", () => MUHR.testMode());
  $("#mHint").addEventListener("click", () => MUHR.reveal());
  $("#mNew").addEventListener("click", () => MUHR.newPuzzle(1, false));
  $("#mNext").addEventListener("click", () => {
    if (MUHR.run){ MUHR.level++; MUHR.enterLevel(); }
    else MUHR.newPuzzle(1, false);
  });
  $("#mAgain").addEventListener("click", () => MUHR.startRun());
  $("#mShare").addEventListener("click", () => MUHR.share());
  $("#runStart").addEventListener("click", () => MUHR.startRun());
  $$("#modeBar button").forEach(b => b.addEventListener("click", () => MUHR.setMode(b.dataset.mode)));
  MUHR.initDrag();

  /* digits pick a card, Esc lets go of it */
  document.addEventListener("keydown", e => {
    if (e.target.matches("input, textarea, select, [contenteditable]")) return;
    if (e.key === "Escape" && MUHR.sel){ MUHR.sel = null; MUHR.paint(); return; }
    if (/^[1-7]$/.test(e.key) && !MUHR.solvedFlag){
      const card = $$("#mTray [data-card]")[+e.key - 1];
      if (card && !card.disabled){ e.preventDefault(); MUHR.select(card.dataset.card); }
    }
  });

  /* on a phone the long rule would push the game below the fold: fold it */
  const rule = $("#pzRule");
  if (rule && matchMedia("(max-width: 1000px)").matches) rule.open = false;
  /* theme */
  const themeBtn = $("#themeBtn");
  const syncTheme = () => themeBtn.setAttribute("aria-pressed", String(document.documentElement.dataset.theme === "dark"));
  themeBtn.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("se7en.theme", next); } catch(e){}
    syncTheme();
  });
  syncTheme();
  /* until the reader picks a side, follow the system */
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", ev => {
    let chosen = null;
    try { chosen = localStorage.getItem("se7en.theme"); } catch(e){}
    if (!chosen){
      document.documentElement.dataset.theme = ev.matches ? "dark" : "light";
      syncTheme();
    }
  });

  srcHTML();
  apply(saved);
  spy();
})();
