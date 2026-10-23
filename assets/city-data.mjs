// Pixel coordinates are traced on the original 1536 × 1024 fictional map.
// Junctions are shared explicitly: geometry crossings never create shortcuts.
export const MAP = { width:1536, height:1024, kmPerPixel:0.002 };
export const MODES = [
  {id:'walk',name:'A pé',short:'A pé',speed:4.5,overhead:0},
  {id:'bike',name:'Bicicleta',short:'Bike',speed:14,overhead:2},
  {id:'car',name:'Carro',short:'Carro',speed:22,overhead:4},
  {id:'moto',name:'Moto',short:'Moto',speed:22,overhead:2},
  {id:'bus',name:'Ônibus',short:'Ônibus',speed:18,overhead:0}
];
const N = {
 q00:[752,188],q01:[805,188],q02:[882,184],q03:[967,176],q04:[1040,165],
 q10:[744,222],q11:[805,219],q12:[884,214],q13:[968,207],q14:[1043,202],
 q20:[736,256],biaStreet:[775,253],q21:[805,251],q22:[886,246],q23:[973,238],q24:[1054,236],
 q30:[721,309],q31:[801,303],q32:[885,298],q33:[980,291],q34:[1074,292],
 q40:[705,350],q41:[795,347],q42:[883,344],q43:[984,340],leoStreet:[1026,340],q44:[1088,338],
 q50:[691,382],q51:[790,376],q52:[883,369],q53:[989,369],q54:[1102,383],
 q60:[662,442],q61:[780,424],q62:[883,414],q63:[999,415],q64:[1052,424],
 bnE:[1094,157],bmE:[1128,280],bsE:[1155,455],midW:[947,561],midE:[1015,586],lowW:[924,769],lowE:[989,731],lastW:[1033,915],lastE:[1080,900],
 cn:[578,61],cw:[236,171],cl:[255,286],csw:[322,434],cs:[527,455],
 gate:[710,307],campSE:[650,299],campS:[580,290],campSW:[419,291],parkWest:[354,306],parkEast:[710,270],
 plaza:[566,227],fisioWalk:[373,167],libraryWalk:[450,278],contabWalk:[651,227],
 coast1:[300,493],coast2:[312,575],coast3:[319,641],coast4:[319,710],coast5:[347,813],
 a1:[451,544],a2:[578,520],a3:[686,506],a4:[786,488],a5:[891,470],a6:[947,470],
 squareNW:[480,609],squareNE:[578,584],squareSW:[483,702],squareSE:[590,683],
 b3:[707,558],b4:[818,535],b5:[910,479],
 c3:[726,625],c4:[859,593],
 marketNW:[492,745],marketSW:[481,841],marketNE:[607,749],marketSE:[622,839],marketStop:[565,862],
 terminalNW:[737,817],terminalW:[742,923],terminalE:[1015,978],
 parkStop:[1040,165],parkWalk:[990,175],
 upperC:[1155,119],upperD:[1250,120],upperE:[1368,154],ruralTurn:[1430,177],ruralPark:[1441,126],
 colW:[1170,258],colC:[1260,253],colE:[1420,276],colS:[1240,338],colSE:[1446,395],
 shopW:[1188,468],shopParking:[1280,506],shopE:[1418,510],
 eastRow0:[1200,532],eastRow1:[1178,587],eastRow2:[1160,657],eastRow3:[1140,718],eastRow4:[1122,783],eastRow5:[1105,844],eastRow6:[1087,902],
 eastWest0:[1008,638],eastWest1:[996,688],esperancaStreet:[1238,669],eastMain1:[1398,599],eastMain2:[1380,660],eastMain3:[1354,779],eastMain4:[1315,910],
 bianca:[771,268],leo:[1024,336],portao:[710,307],fisio:[362,167],contab:[651,218],biblioteca:[445,278],hospital:[527,441],
 centro:[535,647],mercado:[565,839],orla:[284,563],parque:[940,171],shopping:[1288,491],
 colinas:[1250,246],esperanca:[1230,660],rodoviaria:[758,925],rural:[1439,120]
};
export const JUNCTIONS = N;
let id=0;
const ways=[];
function way(name,points,options={}) {
 ways.push({id:`way-${++id}`,name,kind:'road',...options,points:points.map(p=>typeof p==='string'?N[p]:p)});
}
// The university neighborhood: complete blocks, rather than diagonal links.
way('Rua norte da Vila',['q00','q01','q02','q03','q04']);
way('Rua das repúblicas',['q10','q11','q12','q13','q14']);
way('Rua da Bianca',['q20','biaStreet','q21','q22','q23','q24']);
way('Rua do portão leste',['q30','q31','q32','q33',[1028,285],'q34']);
way('Rua do Leonardo',['q40','q41','q42','q43','leoStreet','q44']);
way('Rua sul da Vila',['q50','q51','q52','q53',[1040,377],'q54']);
way('Avenida do campus',['q60',[718,433],'q61',[830,417],'q62',[938,411],'q63',[1028,419],'q64']);
way('Avenida universitária',['q00','q10','q20',[730,282],'q30',[713,331],'q40','q50',[679,411],'q60']);
way('Rua dos estudantes',['q01','q11','q21',[804,276],'q31','q41','q51',[785,402],'q61']);
way('Rua das papelarias',['q02','q12','q22',[885,273],'q32','q42','q52',[883,392],'q62']);
way('Rua das moradias',['q03','q13','q23',[976,264],'q33','q43','q53',[993,392],'q63']);
way('Avenida da margem oeste',['q04','q14','q24',[1062,260],'q34','q44',[1098,361],'q54',[1090,400],[1072,415],'q64']);
// River crossings are separate, named bridge edges.
way('Ponte do Parque',['q04',[1066,162],'bnE'],{bridge:'ponte-parque'});
way('Ponte das Colinas',['q34',[1100,286],'bmE'],{bridge:'ponte-colinas'});
way('Ponte do Shopping',['q64',[1085,434],[1118,444],'bsE'],{bridge:'ponte-shopping'});
way('Ponte da Vila Esperança',['midW',[972,571],[995,580],'midE'],{bridge:'ponte-esperanca'});
way('Ponte da Rodoviária',['lowW',[946,756],[967,743],'lowE'],{bridge:'ponte-rodoviaria'});
way('Ponte sul',['lastW',[1056,910],'lastE'],{bridge:'ponte-sul'});
// Northeast: the actual approach to the rural area is through the northern bridge.
way('Estrada das colinas',['bnE',[1115,137],[1135,126],'upperC',[1200,115],'upperD',[1300,133],'upperE',[1400,165],'ruralTurn',[1485,199],[1530,216]]);
way('Acesso aos sítios',['ruralTurn',[1429,161],[1436,145],'ruralPark']);
way('Rua oeste das Colinas',['upperC',[1140,155],[1133,182],[1138,211],[1153,245],'bmE']);
way('Alameda das Colinas',['bmE',[1150,266],'colW',[1215,253],'colC',[1312,256],[1368,268],'colE']);
way('Avenida do bairro leste',['bmE',[1146,303],[1175,319],'colS',[1300,354],[1370,375],'colSE']);
way('Rua circular das Colinas',['ruralTurn',[1414,210],'colE',[1450,280],[1467,309],[1463,333],[1445,354],'colSE']);
way('Avenida leste do Shopping',['colSE',[1444,433],[1433,478],'shopE']);
way('Marginal leste',['bnE',[1100,181],[1114,222],'bmE',[1145,318],[1157,345],[1165,385],[1161,414],'bsE']);
way('Acesso oeste do Shopping',['bsE',[1170,461],'shopW']);
way('Frente do Shopping',['shopW',[1220,490],'shopParking',[1340,518],[1380,526],'shopE']);
way('Avenida Esperança',['shopW',[1162,487],[1136,512],[1105,540],[1065,565],[1037,580],'midE']);
way('Avenida leste',['shopE',[1410,549],'eastMain1','eastMain2',[1368,715],'eastMain3',[1338,844],'eastMain4',[1295,982]]);
way('Rua central da Vila Esperança',['shopW','eastRow0','eastRow1','eastRow2','eastRow3','eastRow4','eastRow5','eastRow6']);
way('Rua principal da Vila Esperança',['midE','eastWest0',[1076,645],'eastRow2','esperancaStreet',[1335,689],'eastMain2']);
way('Marginal da Vila Esperança',['midE','eastWest0','eastWest1','lowE']);
way('Rua sul da Vila Esperança',['lowE',[1050,742],[1110,759],'eastRow4',[1200,798],'eastMain3']);
way('Rua da ponte sul',['lastE','eastRow6',[1190,922],'eastMain4']);
way('Rua transversal da Esperança',['eastMain1',[1335,584],[1260,570],'eastRow1']);
// Campus roads connect parking areas; vehicles never use the central footpaths.
way('Acesso leste do campus',['q30','gate',[680,304],'campSE',[615,297],'campS']);
way('Estacionamento leste',['gate',[711,290],'parkEast']);
way('Rua interna sul',['campS',[535,290],[489,290],'campSW',[385,303],'parkWest']);
way('Acesso ao estacionamento oeste',['parkWest',[322,289],[300,285],'cl']);
way('Via da orla universitária',[[248,70],[237,116],[233,155],'cw',[249,199],[249,237],'cl',[277,341],[296,393],'csw']);
way('Rua do Hospital',['csw',[355,447],[410,452],[470,456],'cs',[585,450],[632,444],'q60']);
way('Avenida da Orla',['csw',[313,463],'coast1',[320,532],'coast2',[334,611],'coast3',[338,677],'coast4',[333,749],[328,780],'coast5']);
// Downtown street centerlines and the terminal perimeter.
way('Avenida central',['coast2',[389,558],'a1',[514,532],'a2',[633,513],'a3',[738,497],'a4',[838,478],'a5',[924,466],'a6']);
way('Rua norte da praça',['coast3',[394,628],[448,616],'squareNW',[535,597],'squareNE',[641,570],'b3',[763,546],'b4',[869,514],'b5','a6']);
way('Rua sul da praça',['coast4',[398,694],[447,689],'squareSW',[539,691],'squareSE',[658,643],'c3',[793,609],'c4',[909,574],'midW']);
way('Rua oeste da praça',['a1',[461,574],'squareNW',[480,655],'squareSW','marketNW','marketSW']);
way('Rua leste da praça',['a2','squareNE',[582,612],[585,650],'squareSE','marketNE','marketSE']);
way('Acesso norte do centro',['cs',[550,483],'a2']);
way('Rua do campus ao centro',['q60',[674,472],'a3','b3',[718,592],'c3']);
way('Rua do comércio',['q61',[800,453],'a4','b4',[837,561],'c4']);
way('Rua da margem central',['q63',[1000,439],[979,455],'a6']);
way('Rua oeste da Rodoviária',['c4',[879,656],[900,711],'lowW',[948,808],[982,850],[1015,886],'lastW']);
way('Acesso à ponte da Esperança',['c4',[904,577],'midW']);
way('Avenida do Mercado',['coast5',[409,824],'marketSW',[524,851],'marketStop',[604,871],[665,887],[715,901]]);
way('Rua leste do Mercado',['marketSE',[627,879],[685,901],[726,923],'terminalW']);
way('Avenida norte da Rodoviária',['marketSE',[679,825],[715,817],'terminalNW',[800,804],[863,789],[904,779],'lowW']);
way('Contorno oeste da Rodoviária',['terminalNW',[736,865],[740,897],'terminalW',[743,955],[780,976],[838,985],[897,983],[950,987],[998,991],'terminalE']);
way('Contorno leste da Rodoviária',['terminalE',[1034,950],'lastW']);
// Last-meter connections: use walking-only access, never vehicle shortcuts.
way('Entrada da Bianca',['biaStreet',[774,260],'bianca'],{kind:'access'});
way('Entrada do Leonardo',['leoStreet','leo'],{kind:'access'});
way('Entrada do Hospital',['cs','hospital'],{kind:'access'});
way('Entrada do Mercado',['marketStop','mercado'],{kind:'access'});
way('Entrada da Rodoviária',['terminalW','rodoviaria'],{kind:'access'});
way('Entrada do Shopping',['shopParking','shopping'],{kind:'access'});
way('Acesso ao bairro Colinas',['colC','colinas'],{kind:'access'});
way('Acesso à Vila Esperança',['esperancaStreet','esperanca'],{kind:'access'});
way('Entrada dos sítios',['ruralPark','rural'],{kind:'access'});
way('Passeio da Orla',['coast2',[310,566],'orla'],{kind:'shared'});
way('Passeio da praça',['squareNE',[567,599],[551,625],'centro'],{kind:'shared'});
way('Entrada sul do Parque',['q04',[1017,171],'parkWalk',[964,176],'parque'],{kind:'shared'});
way('Passeio central do campus',['campS',[566,271],[568,250],'plaza'],{kind:'shared'});
way('Passeio da Fisioterapia',['parkWest',[366,278],[374,243],[373,210],'fisioWalk','fisio'],{kind:'shared'});
way('Alameda da biblioteca',['parkWest',[392,291],'campSW',[438,281],'libraryWalk','biblioteca'],{kind:'shared'});
way('Biblioteca à praça',['libraryWalk',[492,289],[536,290],'campS'],{kind:'shared'});
way('Fisioterapia à praça',['fisioWalk',[373,210],[375,232],[414,229],[454,226],[490,231],[539,230],'plaza'],{kind:'shared'});
way('Contábeis à praça',['plaza',[588,245],[617,236],[627,225],'contabWalk','contab'],{kind:'shared'});
way('Acesso Contábeis',['parkEast',[701,248],[675,236],'contabWalk'],{kind:'shared'});
export const WAYS = ways;
export const PLACES = [
 {id:'bianca',name:'Casa da Bianca',node:'bianca',parking:'biaStreet',stop:'biaStreet'},
 {id:'leo',name:'Casa do Leonardo',node:'leo',parking:'leoStreet',stop:'leoStreet'},
 {id:'portao',name:'Universidade · portão leste',node:'portao',parking:'gate',stop:'q30'},
 {id:'fisio',name:'Fisioterapia',node:'fisio',parking:'parkWest',stop:'gate'},
 {id:'contab',name:'Ciências Contábeis',node:'contab',parking:'parkEast',stop:'gate'},
 {id:'biblioteca',name:'Biblioteca central',node:'biblioteca',parking:'parkWest',stop:'gate'},
 {id:'hospital',name:'Hospital Universitário',node:'hospital',parking:'cs',stop:'cs'},
 {id:'centro',name:'Centro · praça central',node:'centro',parking:'squareNE',stop:'squareNE'},
 {id:'mercado',name:'Mercado e feira',node:'mercado',parking:'marketStop',stop:'marketStop'},
 {id:'orla',name:'Orla · passeio central',node:'orla',parking:'coast2',stop:'coast2'},
 {id:'parque',name:'Parque · entrada sul',node:'parque',parking:'q04',stop:'q04'},
 {id:'shopping',name:'Shopping · entrada sul',node:'shopping',parking:'shopParking',stop:'shopW'},
 {id:'colinas',name:'Jardim das Colinas',node:'colinas',parking:'colC',stop:'colC'},
 {id:'esperanca',name:'Vila Esperança',node:'esperanca',parking:'esperancaStreet',stop:'esperancaStreet'},
 {id:'rodoviaria',name:'Rodoviária',node:'rodoviaria',parking:'terminalW',stop:'terminalW'},
 {id:'rural',name:'Zona rural · acesso aos sítios',node:'rural',parking:'ruralPark',stop:'ruralPark'}
].map(p=>({...p,point:N[p.node]}));
export const BUS_LINES = [
 {id:'U1',name:'Universitária',stops:['terminalW','marketStop','squareNE','cs','gate','q04']},
 {id:'U2',name:'Shopping e bairros',stops:['terminalW','esperancaStreet','shopW','colC','leoStreet','q30']},
 {id:'U3',name:'Parque e sítios',stops:['squareNE','q30','leoStreet','q04','colC','ruralPark']}
];
export const STOP_NAMES = Object.fromEntries(PLACES.map(p=>[p.stop,p.name]));
STOP_NAMES.gate='Portão leste da universidade';
