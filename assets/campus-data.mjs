// Walking paths traced on the approved 1536 × 1024 campus illustration.
// Labels are roof locations; endpoints are the outdoor entrances, not roof centers.
import {MAP as CITY_MAP} from './city-data.mjs?v=eb9c0d202332';
// Matching touchline corners of the same football field in both illustrations.
// The redraw slightly changes the aspect ratio, so calibrate each axis separately.
export const CAMPUS_CALIBRATION={city:[[381,70],[440,107]],campus:[[512,158],[649,235]]};
const reference=CAMPUS_CALIBRATION;
export const CAMPUS_MAP={width:1536,height:1024,
 kmPerPixel:CITY_MAP.kmPerPixel*(reference.city[1][0]-reference.city[0][0])/(reference.campus[1][0]-reference.campus[0][0]),
 kmPerPixelY:CITY_MAP.kmPerPixel*(reference.city[1][1]-reference.city[0][1])/(reference.campus[1][1]-reference.campus[0][1])};
export const campusDistance=(a,b)=>Math.hypot((b[0]-a[0])*CAMPUS_MAP.kmPerPixel,(b[1]-a[1])*CAMPUS_MAP.kmPerPixelY);
export const CAMPUS_MODES=[{id:'walk',name:'A pé',short:'A pé',speed:4.5,overhead:0}];
export const CAMPUS_NODES={
 field:[578,257],fieldSW:[493,256],fieldSE:[664,256],fieldN:[586,131],north:[672,128],pool:[819,214],poolE:[853,180],poolSE:[846,227],courts:[993,270],courtsW:[902,265],sportE:[1227,273],
 wn:[321,146],wb:[326,240],wf:[329,326],wm:[324,393],wl:[319,475],wj:[336,538],ws:[350,589],
 fisio:[500,350],westMid:[490,420],westSouth:[469,549],westBase:[468,585],labs:[439,525],
 reitoria:[642,360],northMid:[674,386],northPlaza:[699,425],salas:[795,395],eastNorth:[868,316],contab:[926,389],
 pn:[730,450],pne:[767,463],pe:[780,494],pse:[769,526],ps:[734,550],psw:[699,536],pw:[682,504],pnw:[693,472],praca:[706,520],
 ru:[591,470],library:[663,552],secretaria:[827,520],cantina:[797,618],auditorio:[1022,579],
 south:[721,639],southW:[542,637],southE:[953,643],eastSide:[1219,557],eastGate:[1210,647],
 hospital:[612,684],parkingW:[531,677],parkingH:[478,840],parkingE:[1119,789],orla:[236,629]
};
const n=CAMPUS_NODES,ways=[];
function way(name,points){ways.push({name,points:points.map(p=>typeof p==='string'?n[p]:p)});}
way('Passeio oeste do campus',['wn',[319,185],'wb',[328,282],'wf',[325,359],'wm',[323,432],'wl',[325,508],'wj',[344,567],'ws']);
way('Passeio do campo',['wn',[361,135],[403,124],[449,111],[490,100],[540,88],[587,75],[635,62],[665,82],'north',[708,127],[727,136],[758,137],[781,137],[818,134],[861,137],'poolE']);
way('Passeio oeste do campo',[[490,100],[490,134],[488,148],[489,197],'fieldSW','field',[622,257],'fieldSE',[681,271]]);
way('Alameda norte',['fieldSE',[677,216],[689,218],[722,221],[757,222],[793,220],'pool','poolSE']);
way('Passeio da piscina',['poolE',[854,203],'poolSE']);
way('Passeio das quadras',['poolSE',[868,234],[887,242],'courtsW',[940,277],[972,277],'courts',[1029,280],[1065,278],[1103,278],[1141,271],[1183,276],'sportE']);
way('Alameda leste dos esportes',['sportE',[1230,297],[1240,316],[1250,354],[1265,375],[1275,414],[1282,446],[1283,479],[1276,509],[1258,545],[1236,561],'eastSide',[1236,568],[1230,607],'eastGate']);
way('Passeio da ala norte',['poolSE',[856,246],[864,276],'eastNorth',[883,339],[895,361],[909,378],'contab']);
way('Alameda de Contábeis',['contab',[908,390],[891,398],[868,415],[841,432],[824,450],[803,454],'pne']);
way('Contábeis aos esportes',['eastNorth',[891,297],[898,280],'courtsW']);
way('Passeio da Reitoria',[[681,271],[677,299],[667,329],[655,350],'reitoria',[656,367],'northMid',[687,409],'northPlaza','pn']);
way('Acesso às salas de aula',['salas',[799,410],[790,428],[778,438],'pne']);
way('Salas à ala norte',['salas',[833,399],[854,378],[862,349],'eastNorth']);
way('Praça de convivência',['pn',[752,454],'pne',[776,477],'pe',[778,511],'pse',[754,543],'ps',[714,546],'psw',[687,521],'pw',[684,488],'pnw',[709,456],'pn']);
way('Acesso à praça',['psw','praca']);
way('Alameda oeste da praça',['pnw','northPlaza',[685,416],[666,405],'northMid']);
way('Acesso leste à Fisioterapia',['fieldSW',[503,266],[506,291],[502,319],'fisio',[500,383],'westMid']);
way('Passeio sul da Reitoria',['fisio',[519,352],[537,350],[543,365],[547,379],[566,389],[589,392],[615,394],[640,389],[655,395],'northMid']);
way('Passeio entre a Reitoria e o restaurante',[[640,389],[648,407],[650,430],[649,452],[638,467]]);
way('Alameda dos laboratórios',['westMid',[492,461],[484,500],[474,527],'westSouth','westBase']);
way('Entrada dos laboratórios',['labs',[453,540],'westSouth']);
way('Passeio do restaurante',[[492,461],[492,493],[513,478],[548,466],'ru',[630,469],[638,467],[657,472],[676,485],'pw']);
way('Acesso à biblioteca',['westSouth',[499,568],[515,589],[544,595],[586,597],[630,580],[650,570],'library',[681,556],'psw']);
way('Biblioteca à praça',['library',[686,558],[714,560],'ps']);
way('Passeio da secretaria',['pse',[790,540],[811,524],'secretaria']);
way('Passeio da cantina',['ps',[739,581],[738,612],[773,616],'cantina']);
way('Eixo sul da praça',[[738,612],[731,626],'south']);
way('Calçada norte da via sul',['westBase',[509,594],[532,610],'southW',[586,639],[631,640],[674,640],'south',[784,638],[842,641],[898,643],'southE',[1006,646],[1056,650],[1105,646],[1148,645],[1195,649],'eastGate']);
way('Passeio do auditório',['southE',[976,629],[994,611],[1010,588],'auditorio',[1042,551],[1065,519],[1079,501],[1100,495],[1133,497],[1171,499],[1210,501],[1255,509],[1276,509]]);
way('Passeio da secretaria ao auditório',['secretaria',[823,545],[833,566],[856,579],[904,595],[944,607],[976,629]]);
way('Acesso ao estacionamento oeste',['southW',[543,666],'parkingW']);
way('Calçada do Hospital',['southW',[533,663],[549,674],[578,675],[603,674],'hospital']);
way('Passeio para o Hospital',['south',[707,657],[679,668],[644,677],[623,679],'hospital']);
way('Acesso ao estacionamento do Hospital',['parkingW',[526,688],[509,711],[498,738],[494,778],[495,817],'parkingH']);
way('Calçada do estacionamento leste',['eastGate',[1197,678],[1183,702],[1167,715],[1153,738],[1140,790],'parkingE']);
way('Travessia da orla',['orla',[252,630],[270,632],[288,633],[308,632],[319,617],[337,593],'ws','westBase']);
export const CAMPUS_WAYS=ways;
export const CAMPUS_PLACES=[
 ['fisio','Fisioterapia','fisio',[395,310]],['contab','Ciências Contábeis','contab',[995,363]],['library','Biblioteca central','library',[593,539]],['hospital','Hospital universitário','hospital',[699,807]],
 ['reitoria','Reitoria e administração','reitoria',[596,329]],['salas','Salas de aula','salas',[796,365]],['labs','Laboratórios e clínica-escola','labs',[441,456]],['ru','Restaurante universitário','ru',[587,447]],
 ['cantina','Cantina e convivência','cantina',[863,608]],['auditorio','Auditório','auditorio',[1071,571]],['secretaria','Secretaria e apoio ao aluno','secretaria',[891,493]],['praca','Praça de convivência','praca',[741,496]],
 ['courts','Quadras poliesportivas','courts',[1031,212]],['field','Campo de futebol','field',[584,196]],['pool','Piscina','pool',[808,174]],['parkingW','Estacionamento oeste','parkingW',[442,648]],
 ['parkingE','Estacionamento leste','parkingE',[1085,777]],['parkingH','Estacionamento do hospital','parkingH',[449,846]],['eastGate','Portão leste','eastGate',[1300,672]],['orla','Acesso pela orla','orla',[222,637]]
].map(([id,name,node,label])=>({id,name,node,label,point:n[node]}));
