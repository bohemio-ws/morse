/* Bohemio Academy · portada y aprendizaje progresivo, accesible y sin cuentas. */
(()=>{
"use strict";
const welcome=document.getElementById("academy-welcome");if(!welcome)return;
const style=document.createElement("style");style.textContent=`
.academy-brand-symbol{width:65px;height:65px;display:grid;place-items:center;background:#e8d1a4;color:#4a2d1a;border:3px double #987143;border-radius:6px;font:700 29px Georgia}
.academy-hero{background:linear-gradient(105deg,#f9edce,#e6cda1);border:2px solid #9d7646;border-radius:6px;padding:clamp(20px,4vw,40px);margin-bottom:25px;position:relative}
.academy-hero .eyebrow{font-size:13px;font-weight:bold;letter-spacing:.12em;text-transform:uppercase;color:#83512d}
.academy-hero h1{font:700 clamp(32px,5vw,57px) Georgia!important;color:#3e2919!important;line-height:1.08;margin:12px 0}
.academy-hero .lead{font:19px/1.6 Georgia;color:#60472d;max-width:65ch}
.academy-hero .academy-start{padding:15px 23px!important;font-size:18px!important;font-weight:bold!important;background:#634025!important;color:#fff4db!important;border:2px solid #634025!important;margin:16px 0 0}
.academy-hero .academy-start:hover{background:#3e2819!important}
.academy-steps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:15px;margin:18px 0 30px}
.academy-step{border:1px solid #b89664;background:#fff7e5;padding:19px;border-radius:6px}
.academy-step .num{font:bold 13px Georgia;color:#8c582d}
.academy-step h3{font:bold 22px Georgia;color:#432c1b;margin:10px 0}
.academy-step p{font:15px/1.6 Georgia;color:#624d37}
.academy-step button{margin-top:13px;padding:10px 15px!important;min-height:44px}
.academy-hint{background:#e9d7b3;border-left:5px solid #80542d;padding:14px 18px;color:#4e3926;margin-bottom:24px;font-size:15px;line-height:1.6}
.academy-path{padding:20px;margin:24px 0;background:#fff7e4;border:1px solid #bd9c6c}
.academy-path h3{font-size:23px;margin-bottom:10px}
.academy-path ol{padding-left:24px;list-style:decimal}
.academy-path li{padding:5px 0;line-height:1.5}
.academy-hero[hidden],.academy-steps[hidden],.academy-hint[hidden]{display:none!important}
#screen-guide .grid>div{min-width:0}
@media(max-width:700px){.academy-steps{grid-template-columns:1fr}.academy-hero .lead{font-size:17px}.academy-hero{padding:18px}.academy-step{padding:16px}}
`;document.head.append(style);
const hero=document.createElement("section");hero.className="academy-hero";hero.innerHTML='<div class="eyebrow">Bohemio Academy · Aula de comunicaciones históricas</div><h1>Aprende Morse.<br>Escucha. Comprende. Transmite.</h1><p class="lead">Viaja de una estación de ferrocarril del siglo XIX a una radio de aeródromo de 1940 y a las señales luminosas de un barco. Lecciones cortas, ejercicios prácticos y aprendizaje a tu ritmo.</p><button class="academy-start" type="button">Comenzar mi primera lección →</button>';
const steps=document.createElement("div");steps.className="academy-steps";steps.innerHTML='<article class="academy-step"><span class="num">PASO 01 · COMPRENDER</span><h3>¿Qué estoy escuchando?</h3><p>Descubre los puntos, las rayas y sus pausas antes de memorizar letras.</p><button type="button" data-go="guide">Leer el manual</button></article><article class="academy-step"><span class="num">PASO 02 · RECONOCER</span><h3>Entrena tu oído</h3><p>Escucha sonidos y comprueba tus respuestas. Empieza despacio y aumenta la dificultad.</p><button type="button" data-go="practice">Practicar recepción</button></article><article class="academy-step"><span class="num">PASO 03 · TRANSMITIR</span><h3>Tu primer mensaje</h3><p>Utiliza el manipulador y el traductor para convertir letras en señales.</p><button type="button" data-go="lab">Ir al laboratorio</button></article>';
const hint=document.createElement("div");hint.className="academy-hint";hint.textContent="Consejo para alumnos: dedica 10 minutos a una sola habilidad. Primero escucha; después escribe; finalmente compara. No necesitas aprender todo el alfabeto el primer día.";
welcome.append(hero,steps,hint);
const guide=document.getElementById("screen-guide");
const path=document.createElement("section");path.className="academy-path";path.innerHTML='<h3>Tu itinerario de aprendizaje</h3><ol><li>Aprende a distinguir un punto de una raya y a reconocer los silencios.</li><li>Escucha letras individuales y repítelas sin mirar el alfabeto.</li><li>Recibe grupos cortos y anota lo que oyes.</li><li>Entra en la estación, el aeródromo o el barco y resuelve mensajes.</li><li>Practica la transmisión con el manipulador; mejora claridad antes que velocidad.</li></ol>';
if(guide)guide.prepend(path);
function go(id){if(typeof showScreen==="function")showScreen(id);welcome.hidden=id!=="guide";if(id==="guide"){hero.hidden=false;steps.hidden=false;hint.hidden=false}else{hero.hidden=true;steps.hidden=true;hint.hidden=true}window.scrollTo({top:0,behavior:"smooth"})}
hero.querySelector("button").addEventListener("click",()=>go("learn"));
steps.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.go)));
document.querySelectorAll("header nav button").forEach(b=>b.addEventListener("click",()=>{const id=b.id.replace("nav-","");welcome.hidden=id!=="guide";hero.hidden=id!=="guide";steps.hidden=id!=="guide";hint.hidden=id!=="guide"}));
go("guide");
})();