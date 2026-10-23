import {generateOpening,dateLabel,nextStoryDate,WEATHER,parseStoryDate} from './day-engine.mjs?v=db08e1b5a45c';
const $=id=>document.getElementById(id),KEY='amor-amizade-days-v1';
let current=null,history=[];
const fields={date:$('story-date'),time:$('story-time')};
function input(){return Object.fromEntries(Object.entries(fields).map(([k,e])=>[k,e.value]));}
function setFields(data){for(const[k,e]of Object.entries(fields))if(data[k]!==undefined)e.value=String(data[k]);weekday();}
function weekday(){try{$('story-weekday').textContent=dateLabel(fields.date.value).split(',')[0].toLocaleLowerCase('pt-BR');}catch{$('story-weekday').textContent='Escolha uma data válida.';}}
function normalText(text,opening){let body=String(text).trim();if(body.startsWith('[')&&body.includes(']'))body=body.slice(body.indexOf(']')+1).trim();body=body.replace(/^\|/,'').replace(/\|$/,'').trim();return opening.header+'\n|'+body+'|';}
function save(){try{localStorage.setItem(KEY,JSON.stringify({input:input(),current,history}));}catch{}}
function historyList(){
 $('opening-history').replaceChildren(...history.map((item,i)=>{const b=document.createElement('button');b.type='button';b.className='history-item';b.textContent=`${item.date.split('-').reverse().join('/')} · ${item.time} · ${item.temperature}°`;b.addEventListener('click',()=>{archive();const selected=history.find(h=>h.id===item.id)||item;setFields(selected);show({...selected,text:normalText(selected.text,selected)});$('day-status').textContent='Abertura recuperada.';save();});return b;}));
}
function archive(){if(!current)return;const text=normalText($('opening-text').value,current);const item={...current,text};history=[item,...history.filter(h=>h.id!==item.id)].slice(0,8);}
function show(opening){current=opening;$('opening-text').value=opening.text;$('opening-title').textContent=new Intl.DateTimeFormat('pt-BR',{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(parseStoryDate(opening.date));$('opening-weather').textContent=`${WEATHER.find(w=>w.id===opening.weather)?.name||'Tempo'} · ${opening.temperature}°`;$('opening-roll').textContent=opening.weatherRoll?`🎲 DADO DO CLIMA · ${opening.weatherRoll}/100`:'ABERTURA SALVA';historyList();}
function generate(rng){try{archive();const d=generateOpening({...input(),weather:'auto',temperature:'',template:'brief'},rng);show({...d,id:globalThis.crypto?.randomUUID?.()||String(Date.now())+Math.random()});$('day-status').textContent='Dados rolados! Abertura pronta para editar e copiar.';save();}catch(error){$('day-status').textContent=error.message;}}
fields.date.addEventListener('change',weekday);
for(const e of Object.values(fields))e.addEventListener('change',save);
$('day-form').addEventListener('submit',e=>{e.preventDefault();generate();});
$('next-day').addEventListener('click',()=>{try{fields.date.value=nextStoryDate(fields.date.value);weekday();generate();}catch(error){$('day-status').textContent=error.message;}});
$('opening-text').addEventListener('input',()=>{if(current){current.text=normalText($('opening-text').value,current);save();}});
$('copy-opening').addEventListener('click',async()=>{
 if(!current)return;const text=normalText($('opening-text').value,current);$('opening-text').value=text;current.text=text;save();
 try{if(!navigator.clipboard?.writeText)throw Error();await navigator.clipboard.writeText(text);$('day-status').textContent='Copiado! Já pode colar na conversa.';}
 catch{$('opening-text').focus();$('opening-text').select();$('opening-text').setSelectionRange(0,text.length);$('day-status').textContent='Texto selecionado. Use Copiar ou Ctrl+C para levar à conversa.';}
});
try{
 const saved=JSON.parse(localStorage.getItem(KEY)||'null');
 const valid=x=>{try{return x&&typeof x.text==='string'&&x.text.length<16000&&!!generateOpening(x,()=>0);}catch{return false;}};
 if(saved){history=Array.isArray(saved.history)?saved.history.filter(valid).slice(0,8):[];if(saved.input)setFields(saved.input);if(valid(saved.current)){const canonical=generateOpening(saved.current,()=>0);show({...saved.current,header:canonical.header,text:normalText(saved.current.text,canonical)});}}
}catch{}
weekday();if(!current)generate();
