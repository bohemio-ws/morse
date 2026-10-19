"use strict";
/* Curso Morse: recursos de aprendizaje autónomos, sin servicios externos. */
(function(){
const alphabet=DATA_MORSE;
const reverse=Object.fromEntries(Object.entries(alphabet).filter(([c])=>c!==" ").map(([c,v])=>[v,c]));
const decode=s=>String(s).trim().replace(/[·•]/g,".").replace(/[−–—_]/g,"-").replace(/\\/g,"/").split(/\s*\/\s*/).map(w=>w.trim().split(/\s+/).filter(Boolean).map(c=>reverse[c]||"□").join("")).join(" ");
const encode=s=>String(s).toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").split("").map(c=>alphabet[c]||"").filter(Boolean).join(" ");
function el(tag,cls,content){const x=document.createElement(tag);x.className=cls||"";if(content!==undefined)x.textContent=content;return x}
const lab=document.getElementById("screen-lab");
if(lab){
 const box=el("div","bento-card p-8 mt-8");
 box.append(el("h3","text-xl text-blue-400 mb-3","Traductor Morse → castellano"));
 box.append(el("p","guide-text","Separa las letras con un espacio y las palabras con /. Ejemplo: ... --- ... / .... --- .-.. .-"));
 const input=el("textarea","w-full p-4 rounded bg-slate-950 text-white mono border border-slate-700");
 input.rows=3;input.placeholder="... --- ... / .... --- .-.. .-";input.setAttribute("aria-label","Código Morse");
 const output=el("p","mono text-xl text-blue-200 mt-4");output.setAttribute("aria-live","polite");
 input.addEventListener("input",()=>output.textContent=decode(input.value));
 const keys=el("div","flex flex-wrap gap-3 mt-3");
 for(const [symbol,label] of [[".","● Punto"],["-","▬ Raya"],[" ","Separar letra"],[" / ","Separar palabra"]]){const b=el("button","bento-card p-3",label);b.type="button";b.addEventListener("click",()=>{input.value+=symbol;output.textContent=decode(input.value);input.focus()});keys.append(b)}
 box.append(input,keys,output);lab.append(box);
}
const practice=document.getElementById("screen-practice");
if(practice){
 const box=el("div","bento-card p-8 mt-8");
 box.append(el("h3","text-xl text-blue-400 mb-3","Dictado Morse: escribe lo que escuchas"));
 box.append(el("p","guide-text","Escucha cinco caracteres, escríbelos y comprueba tu recepción. Puedes repetir el audio antes de responder."));
 const speedLabel=el("label","block text-sm text-slate-400 mb-2","Velocidad (palabras por minuto)");
 const speed=el("input","w-full mb-4");speed.type="range";speed.min="8";speed.max="25";speed.value="15";
 const speedValue=el("span","text-blue-400 ml-2","15 PPM");speedLabel.append(speedValue);
 speed.oninput=()=>speedValue.textContent=speed.value+" PPM";
 const field=el("input","w-full p-3 text-white");field.placeholder="Escribe aquí los cinco caracteres";field.autocomplete="off";field.setAttribute("aria-label","Respuesta al dictado");
 const status=el("p","text-sm text-slate-400 mt-3","Pulsa Nueva serie.");
 const progress=el("p","text-sm text-blue-300 mt-2","");
 const buttons=el("div","flex flex-wrap gap-3 mt-4");
 const newBtn=el("button","bento-card p-3","Nueva serie"),repeatBtn=el("button","bento-card p-3","Repetir audio"),checkBtn=el("button","bento-card p-3","Comprobar");
 buttons.append(newBtn,repeatBtn,checkBtn);box.append(speedLabel,speed,field,buttons,status,progress);practice.append(box);
 let answer="",count=0,correct=0;const pool="KMRSUAPTLOWIENF";
 let saved=null;try{saved=JSON.parse(localStorage.getItem("bohemio-morse-reception-v1")||"null")}catch{}if(saved&&Number.isInteger(saved.count)&&Number.isInteger(saved.correct)){count=saved.count;correct=saved.correct}progress.textContent="Historial local: "+correct+" aciertos de "+count+" series.";
 let session=0;
 async function play(){
  if(!answer)return;
  const id=++session;
  const ctx=audio;
  if(ctx.state==="suspended")await ctx.resume();
  const unitMs=1200/Number(speed.value);
  let when=ctx.currentTime+0.08;
  for(const c of answer){
   const symbols=alphabet[c];
   for(let i=0;i<symbols.length;i++){
    const duration=(symbols[i]==="."?1:3)*unitMs/1000;
    const osc=ctx.createOscillator(),gain=ctx.createGain();
    osc.type="sine";osc.frequency.value=650;
    gain.gain.setValueAtTime(0,when);
    gain.gain.linearRampToValueAtTime(0.16,when+0.004);
    gain.gain.setValueAtTime(0.16,when+Math.max(0.004,duration-0.004));
    gain.gain.linearRampToValueAtTime(0,when+duration);
    osc.connect(gain);gain.connect(ctx.destination);
    osc.start(when);osc.stop(when+duration+0.005);
    when+=duration+(i===symbols.length-1?0:unitMs/1000);
   }
   when+=3*unitMs/1000;
  }
 }
 newBtn.onclick=()=>{answer=Array.from({length:5},()=>pool[Math.floor(Math.random()*pool.length)]).join("");field.value="";status.textContent="Escucha la serie y escribe tu respuesta.";play()};
 repeatBtn.onclick=()=>{if(answer)play();else status.textContent="Primero pulsa Nueva serie."};
 checkBtn.onclick=()=>{
  if(!answer){status.textContent="Primero pulsa Nueva serie.";return}
  const submitted=field.value.toUpperCase().replace(/\s/g,"");
  if(!submitted){status.textContent="Escribe los caracteres escuchados.";return}
  count++;if(submitted===answer)correct++;
  localStorage.setItem("bohemio-morse-reception-v1",JSON.stringify({count,correct}));progress.textContent="Historial local: "+correct+" aciertos de "+count+" series.";
  status.textContent=(submitted===answer?"Correcto. ":"Respuesta incorrecta. ")+"Serie: "+answer+". Aciertos: "+correct+"/"+count;
  answer="";
 };
 field.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();checkBtn.click()}});
}

// Ejercicios de transmisión: teclado Morse con respuesta por secuencia.
if(lab){
 const box=el("section","bento-card p-8 mt-8");
 box.append(el("h3","text-xl text-blue-400 mb-3","Práctica de transmisión: convierte letras en pulsos"));
 box.append(el("p","guide-text","Selecciona una letra, pulsa el manipulador del laboratorio y compara tu secuencia. Usa Borrar buffer antes de empezar."));
 const target=el("p","text-4xl text-white mb-3 mono","?");
 const hint=el("p","text-sm text-slate-400 mb-3","Pulsa Nueva letra.");
 const controls=el("div","flex flex-wrap gap-3");
 const next=el("button","bento-card p-3","Nueva letra"),check=el("button","bento-card p-3","Comprobar manipulador");
 controls.append(next,check);box.append(target,hint,controls);lab.append(box);
 let letter="";
 next.onclick=()=>{const keys=Object.keys(alphabet).filter(c=>c!==" ");letter=keys[Math.floor(Math.random()*keys.length)];target.textContent=letter;hint.textContent="Transmite la letra con el manipulador y pulsa Comprobar.";if(typeof clearManual==="function")clearManual()};
 check.onclick=()=>{if(!letter){hint.textContent="Pulsa Nueva letra.";return}const received=typeof sequence==="string"?sequence:"";hint.textContent=received===alphabet[letter]?"¡Correcto! "+letter+" = "+received:"Tu secuencia: "+(received||"vacía")+" · esperado: "+alphabet[letter]};
}

// Tres escenarios históricos: estaciones ferroviarias, radio aeronáutica y señales marítimas.
if(document.getElementById("screen-guide")){
 const history=el("section","bento-card p-8 mt-8");
 history.id="morse-history";
 history.append(el("h3","text-2xl font-semibold mb-4","El Morse en tres mundos: trenes, aviación y mar"));
 const intro=el("p","guide-text","Un mismo lenguaje de puntos y rayas conectó estaciones de ferrocarril, operadores de radio aeronáutica y barcos. Cada escenario empleaba equipos y procedimientos diferentes.");
 history.append(intro);
 const scenes=[
  ["🚂","Despacho telegráfico ferroviario (siglo XIX)","El telégrafo permitió transmitir avisos y órdenes entre estaciones a distancia. Los operadores aprendían a reconocer el ritmo de los impulsos y a transcribir mensajes con precisión.","Actividad: escucha una serie de cinco caracteres y cópiala en Entrenamiento."],
  ["✈","Aeródromos y aviación militar (primera mitad del siglo XX)","Durante la Segunda Guerra Mundial, el Morse fue ampliamente utilizado en enlaces de radiotelegrafía aeronáutica y en determinadas ayudas de navegación e identificación. No toda comunicación aérea se hacía en Morse: también se empleaba radiotelefonía de voz.","Actividad: identifica de oído grupos de letras como si fueran distintivos de estación; después practica la copia escrita."],
  ["⚓","Buques y señales luminosas","En el mar se utilizó Morse por radiotelegrafía y también mediante destellos de luz, por ejemplo con lámparas de señales. La luz encendida durante un intervalo corto representa un punto; durante uno largo, una raya. El empleo de señales luminosas requiere tener en cuenta la visibilidad y los procedimientos aplicables.","Actividad: observa la señal SOS (... --- ...) y compara sus pulsos cortos y largos."]
 ];
 for(const [emoji,title,body,activity] of scenes){
  const card=el("div","p-5 my-4 rounded border border-amber-800/30");
  card.append(el("h4","text-lg font-semibold mb-2",emoji+" "+title),el("p","guide-text",body),el("p","guide-text",activity));history.append(card);
 }
 history.append(el("p","guide-text","Contexto histórico educativo: las comunicaciones marítimas modernas de socorro emplean principalmente sistemas GMDSS/SMSSM; esta práctica de Morse no autoriza ni sustituye procedimientos operativos actuales."));
 const guide=document.getElementById("screen-guide");guide.append(history);
}
const guide=document.getElementById("screen-guide");
if(guide){
 const box=el("article","bento-card p-8");
 box.append(el("h3","text-xl text-blue-400 mb-4","Manual práctico: del primer sonido al mensaje"));
 const sections=[
 ["01 · Código internacional","El código Morse internacional representa letras, números, signos y señales de procedimiento mediante pulsos cortos (puntos) y largos (rayas). Es un sistema común internacional, no un código diferente para cada idioma."],
 ["02 · Duraciones regladas","Punto: una unidad. Raya: tres unidades. Pausa dentro del carácter: una unidad. Entre letras: tres unidades. Entre palabras: siete unidades. En el aprendizaje importa reconocer el ritmo completo, no contar puntos."],
 ["03 · Recepción auditiva","Comienza con pocos caracteres. Escucha a velocidad de carácter suficiente para reconocer su sonido, con pausas amplias entre caracteres. Escribe lo oído y corrige tus errores; incorpora más caracteres cuando mantengas una precisión alta."],
 ["04 · Métodos Koch y Farnsworth","Koch incorpora caracteres gradualmente a velocidad de trabajo. Farnsworth mantiene los caracteres rápidos y amplía las pausas para facilitar la copia. Ambos métodos pueden combinarse en sesiones progresivas."],
 ["05 · Escritura y transmisión","Practica primero caracteres, luego grupos de cinco, números, palabras y mensajes. La claridad y la separación entre elementos son más importantes que transmitir deprisa."],
 ["06 · Castellano y caracteres especiales","El alfabeto internacional cubre A–Z y 0–9. En esta versión, el traductor de castellano elimina tildes y usa N para Ñ: es una simplificación didáctica, no una representación específica de todos los caracteres acentuados. Los signos adicionales deben distinguirse del alfabeto básico."],
 ["07 · Señales y procedimientos","SOS es una señal internacional de socorro (... --- ...). Los grupos AR y BT son señales de procedimiento: no deben confundirse con letras ordinarias separadas. QRS solicita transmitir más despacio y QTH se refiere a la ubicación en el contexto de los códigos Q."],
 ["08 · Plan de estudio","Primera etapa: reconocimiento de sonidos. Segunda: recepción de series escritas. Tercera: palabras y números. Cuarta: mensajes y práctica de transmisión. Evalúa exactitud y velocidad por separado."],
 ["Fuentes y alcance","Base técnica: Recomendación UIT-R M.1677-1 (Código Morse Internacional) y materiales de aprendizaje de ARRL. Esta guía es educativa; no sustituye procedimientos ni habilitaciones para operar una estación de radio."]
 ];
 for(const [title,body] of sections){box.append(el("h4","font-semibold text-white mt-5 mb-2",title),el("p","guide-text",body))}
 const a=el("a","text-blue-400 underline","Consultar recomendación oficial UIT-R M.1677-1");a.href="https://www.itu.int/rec/R-REC-M.1677-1-200910-I/es";a.target="_blank";a.rel="noopener noreferrer";box.append(a);guide.append(box);
}
})();