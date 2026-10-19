/* Bohemio Academy — simuladores históricos de recepción Morse.
   Secuencias didácticas ficticias; no representan transmisiones históricas reales. */
(()=>{
"use strict";
const alphabet=DATA_MORSE;
const modes=[
 {id:"rail",icon:"🚂",name:"Estación ferroviaria",subtitle:"Despacho telegráfico · siglo XIX",kind:"sound",pool:["TREN","VIA","ESTACION","SALIDA","LLEGADA"],description:"Escucha un aviso breve como los que podían intercambiarse entre estaciones. Transcribe el texto recibido."},
 {id:"air",icon:"✈",name:"Aeródromo de 1940",subtitle:"Radiotelegrafía · época de la Segunda Guerra Mundial",kind:"sound",pool:["BASE","RADIO","PISTA","NORTE","ALFA"],description:"Copia un grupo de entrenamiento inspirado en la radiotelegrafía aeronáutica. No es una frecuencia ni un mensaje operativo real."},
 {id:"sea",icon:"⚓",name:"Buque de señales",subtitle:"Lámpara de destellos · comunicación visual",kind:"light",pool:["SOS","MAR","BARCO","LUZ","AYUDA"],description:"Observa los destellos de la lámpara: cortos para puntos, largos para rayas. Escribe lo que ves."}
];
const levels=[
 {name:"1 · Primeras señales",description:"Dos o tres letras, para reconocer el ritmo.",pool:{rail:["VIA","TREN","RED"],air:["QTH","QRM","SOS"],sea:["SOS","MAR","LUZ"]}},
 {name:"2 · Mensajes breves",description:"Palabras cortas, sin espacios.",pool:{rail:["SALIDA","LLEGADA","ESTACION"],air:["RADIO","PISTA","NORTE"],sea:["BARCO","AYUDA","FARO"]}},
 {name:"3 · Copia avanzada",description:"Grupos más largos y mayor velocidad.",pool:{rail:["TELEGRAFO","FERROCARRIL","ESTACIONES"],air:["AERODROMO","FRECUENCIA","OPERADOR"],sea:["NAVEGACION","SALVAMENTO","SENALES"]}}
];
const style=document.createElement("style");style.textContent=`
#historic-simulators{margin:30px 0}
#historic-simulators .scene-heading{font-size:26px;color:#50321e;margin:0 0 8px}
#historic-simulators .scene-intro{color:#68503b;line-height:1.65}
#historic-simulators .scene-levels{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:12px 0 20px}
#historic-simulators .scene-levels label{color:#5a412c;font-weight:bold}
#historic-simulators .scene-levels select{min-height:45px;max-width:100%;padding:8px 12px;border:2px solid #947047;border-radius:5px;background:#fff8e6;color:#3b2918;font-size:16px}
#historic-simulators .scene-level-help{color:#6a513a!important;font-size:14px;margin-bottom:12px}
#historic-simulators .scene-tabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:18px 0}
#historic-simulators .scene-tabs button{padding:16px 8px!important;min-height:68px;font-weight:bold;font-size:15px}
#historic-simulators .scene-tabs button[aria-pressed=true]{background:#77512f!important;color:#fff!important;border-color:#49301c!important}
#historic-simulators .scene-set{background:linear-gradient(150deg,#6a482c,#2c1b11);border:9px ridge #9b7348;padding:24px;border-radius:5px;box-shadow:inset 0 0 35px #0007;color:#fff0d0}
#historic-simulators .scene-set h4,#historic-simulators .scene-set p{color:#f7e5c6!important}
#historic-simulators .scene-set h4{font-size:24px}
#historic-simulators .scene-object{display:flex;justify-content:center;align-items:center;min-height:150px;margin:15px auto;position:relative}
#historic-simulators .telegraph-visual{width:200px;height:90px;border:6px ridge #a9854d;border-radius:12px;background:linear-gradient(155deg,#9b713d,#422816);position:relative;box-shadow:0 14px 14px #0008}
#historic-simulators .telegraph-visual:before{content:"";position:absolute;left:28%;top:35px;width:55%;height:13px;background:linear-gradient(#f2d78d,#7d511f);transform:rotate(-12deg);border-radius:7px}
#historic-simulators .telegraph-visual:after{content:"";position:absolute;left:24%;top:4px;width:48px;height:48px;border:7px solid #ac7b38;background:radial-gradient(circle at 35% 30%,#4e3a2a,#090909);border-radius:50%}
#historic-simulators .radio-visual{width:225px;height:125px;border:9px ridge #a27b4b;border-radius:10px;background:repeating-linear-gradient(0deg,#35392f 0 9px,#1e251d 10px 15px);box-shadow:0 12px 20px #0008;position:relative}
#historic-simulators .radio-visual:before{content:"RADIO · CW";position:absolute;left:20px;top:20px;background:#e4cda1;color:#382819;padding:6px;font:700 13px Georgia}
#historic-simulators .radio-visual:after{content:"◉  ◉";position:absolute;right:20px;bottom:15px;color:#d1a968;font-size:28px}
#historic-simulators .lamp-visual{width:130px;height:130px;border-radius:50%;border:13px ridge #aa8553;background:radial-gradient(circle,#3c2b16,#120f0a);box-shadow:0 0 0 9px #322519,0 10px 20px #0009;transition:background .025s,box-shadow .025s}
#historic-simulators .lamp-visual.on{background:radial-gradient(circle,#fff,#fff7b6 30%,#f6b82c 72%);box-shadow:0 0 0 9px #322519,0 0 55px 25px #ffdb6b}
#historic-simulators .scene-actions{display:flex;gap:9px;flex-wrap:wrap;margin:18px 0}
#historic-simulators .scene-actions button{padding:11px 16px!important;min-height:44px}
#historic-simulators .scene-answer{display:block;width:100%;max-width:460px;background:#fff7e6!important;color:#392819!important;padding:13px;border:2px solid #9d7544!important;border-radius:5px;font:20px Georgia;letter-spacing:.1em}
#historic-simulators .scene-feedback{min-height:48px;margin-top:14px;font-weight:bold}
#historic-simulators .scene-meta{font-size:13px;color:#ebd3a7!important}
@media(max-width:620px){#historic-simulators .scene-tabs{grid-template-columns:1fr}#historic-simulators .scene-set{padding:14px;border-width:5px}#historic-simulators .scene-tabs button{min-height:48px!important}}
`;document.head.append(style);
const host=document.getElementById("screen-practice");if(!host)return;
const root=document.createElement("section");root.id="historic-simulators";root.className="bento-card p-6";
root.innerHTML='<h3 class="scene-heading">Escuela de telegrafistas: tres escenarios</h3><p class="scene-intro">Aprende escuchando o leyendo señales de luz. Cada ejercicio es una simulación didáctica, no una recreación documental.</p><div class="scene-tabs" role="group" aria-label="Escenario histórico"></div><div class="scene-levels"><label for="historic-level">Dificultad</label><select id="historic-level"></select><label for="historic-speed">Velocidad</label><select id="historic-speed"><option value="85">Lenta</option><option value="65">Normal</option><option value="48">Rápida</option></select></div><p class="scene-level-help"></p><div class="scene-set"><h4 class="scene-title"></h4><p class="scene-description"></p><div class="scene-object"><div class="scene-device" aria-hidden="true"></div></div><p class="scene-meta">Pulsa Nueva transmisión para comenzar.</p><label for="historic-level" style="display:block;color:#fff0d0;margin-top:12px">Dificultad</label><select id="historic-level" style="padding:10px;width:100%;max-width:360px;background:#fff4d9;color:#392819;border:1px solid #9d7544;border-radius:4px"><option value="1">Nivel 1 · caracteres sueltos</option><option value="2">Nivel 2 · palabras cortas</option><option value="3">Nivel 3 · mensajes más largos</option></select><label for="historic-answer" style="display:block;margin:14px 0 7px;color:#fff0d0">Tu transcripción</label><input id="historic-answer" class="scene-answer" type="text" autocomplete="off" autocapitalize="characters" placeholder="Escribe lo recibido"><div class="scene-actions"><button type="button" class="scene-new">Nueva transmisión</button><button type="button" class="scene-repeat">Repetir</button><button type="button" class="scene-check">Comprobar</button><button type="button" class="scene-stop">Detener</button></div><p class="scene-feedback" role="status" aria-live="polite"></p></div>';
host.append(root);
const q=sel=>root.querySelector(sel),tabs=q(".scene-tabs"),title=q(".scene-title"),description=q(".scene-description"),device=q(".scene-device"),meta=q(".scene-meta"),answerInput=q(".scene-answer"),feedback=q(".scene-feedback");
let active=modes[0],target="",playing=false,run=0,oscillators=[],audioCtx=null,score={},lastAnswer="";
const levelSelect=q("#historic-level"),speedSelect=q("#historic-speed"),levelHelp=q(".scene-level-help");
levels.forEach((l,i)=>{const option=document.createElement("option");option.value=String(i);option.textContent=l.name;levelSelect.append(option)});
function updateLevel(){stop();target="";lastAnswer="";answerInput.value="";feedback.textContent="";levelHelp.textContent=levels[Number(levelSelect.value)].description+" Escucha el mensaje y escríbelo sin mirar una solución."}
levelSelect.addEventListener("change",updateLevel);
try{score=JSON.parse(localStorage.getItem("bohemio-morse-scenes-v1")||"{}")||{}}catch{score={}}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const levelWords={rail:[["T","E","A","N","I","M"],["TREN","VIA","SALIDA"],["ESTACION","LLEGADA"]],air:[["A","N","S","O","R","K"],["BASE","RADIO","PISTA"],["NORTE","ALFA"]],sea:[["S","O","E","T","A","N"],["SOS","MAR","LUZ"],["BARCO","AYUDA"]]};
let level=1;
function stop(){run++;playing=false;device.classList.remove("on");oscillators.forEach(o=>{try{o.stop()}catch{}});oscillators=[]}
function select(mode){stop();active=mode;target="";lastAnswer="";answerInput.value="";feedback.textContent="";title.textContent=mode.icon+" "+mode.name;description.textContent=mode.description;device.className="scene-device "+(mode.id==="rail"?"telegraph-visual":mode.id==="air"?"radio-visual":"lamp-visual");meta.textContent=mode.subtitle+" · Pulsa Nueva transmisión.";Array.from(tabs.children).forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.mode===mode.id)))}
for(const m of modes){const b=document.createElement("button");b.type="button";b.dataset.mode=m.id;b.textContent=m.icon+" "+m.name;b.onclick=()=>select(m);tabs.append(b)}
async function play(){
 if(!target||playing)return;
 const thisRun=++run;playing=true;feedback.textContent="Transmisión en curso…";meta.textContent=active.subtitle;
 const dot=level===1?150:level===2?120:95; // Intervalo del punto; aumenta gradualmente la velocidad.
 if(active.kind==="sound"){const C=window.AudioContext||window.webkitAudioContext;if(!C){feedback.textContent="Este navegador no admite audio.";playing=false;return}audioCtx=audioCtx||new C();try{await audioCtx.resume()}catch{playing=false;return}}
 async function mark(units){if(thisRun!==run)return;const ms=dot*units;
 if(active.kind==="light"){device.classList.add("on")}else{
 const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.frequency.value=620;gain.gain.value=.12;osc.connect(gain);gain.connect(audioCtx.destination);osc.start();oscillators.push(osc);
 }
 await sleep(ms);if(thisRun!==run)return;if(active.kind==="light")device.classList.remove("on");else{const osc=oscillators.shift();if(osc)try{osc.stop()}catch{}}}
 const letters=target.split("");for(let j=0;j<letters.length&&thisRun===run;j++){const symbols=alphabet[letters[j]];if(!symbols)continue;for(let k=0;k<symbols.length&&thisRun===run;k++){await mark(symbols[k]==="."?1:3);if(k<symbols.length-1)await sleep(dot)}if(j<letters.length-1)await sleep(dot*3)}
 if(thisRun===run){playing=false;feedback.textContent="Fin de la transmisión. Escribe lo que has recibido."}
}
q("#historic-level").addEventListener("change",e=>{level=Number(e.target.value);stop();target="";answerInput.value="";feedback.textContent="Nivel "+level+" seleccionado. Pulsa Nueva transmisión."});
q(".scene-new").onclick=()=>{stop();const choices=levelWords[active.id][level-1];target=choices[Math.floor(Math.random()*choices.length)];answerInput.value="";feedback.textContent="";play()};
q(".scene-repeat").onclick=()=>{if(!target){feedback.textContent="Primero inicia una transmisión.";return}if(!playing)play()};
q(".scene-stop").onclick=()=>{stop();feedback.textContent="Transmisión detenida."};
q(".scene-check").onclick=()=>{if(!target){feedback.textContent="Primero inicia una transmisión.";return}if(playing){feedback.textContent="Espera al final de la transmisión.";return}const received=answerInput.value.trim().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g,"");if(!received){feedback.textContent="Escribe tu respuesta antes de comprobar.";return}if(lastAnswer===target){feedback.textContent="Ya has corregido este ejercicio. Pulsa Nueva transmisión.";return}lastAnswer=target;const ok=received===target;const scoreKey=active.id+"-"+levelSelect.value;const s=score[scoreKey]||{total:0,correct:0};s.total++;if(ok)s.correct++;score[scoreKey]=s;try{localStorage.setItem("bohemio-morse-scenes-v1",JSON.stringify(score))}catch{}feedback.textContent=(ok?"¡Correcto!":"Respuesta: "+target+". Sigue practicando.")+" · Aciertos en este escenario: "+s.correct+"/"+s.total;target=""};
answerInput.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();q(".scene-check").click()}});
select(modes[0]);updateLevel();
})();