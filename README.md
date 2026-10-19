# Bohemio Academy · Curso de código Morse

Curso gratuito en castellano, independiente de RTC Academy.

## Módulos
- Guía maestra ampliada: fundamentos del código Morse internacional, temporización, métodos Koch/Farnsworth, señales y plan de estudio.
- Investigación: alfabeto Morse interactivo.
- Entrenamiento: reconocimiento por cuatro opciones y dictado de series de cinco caracteres con escritura, velocidad regulable e historial local de aciertos.
- Laboratorio: traductor castellano → Morse con reproducción, traductor Morse → castellano, manipulador manual y práctica de transmisión.

## Uso
Abre `index.html` desde un servidor HTTPS. La extensión `academy-extension.js` debe encontrarse en el mismo directorio. El sonido requiere interacción del usuario en algunos navegadores móviles.

## Limitaciones actuales
- El método Koch y el espaciado Farnsworth se explican, pero todavía no constituyen un itinerario adaptativo automatizado.
- La traducción simplifica tildes y no implementa una tabla internacional completa de signos extendidos.
- La interfaz utiliza Tailwind y fuentes remotas: aún no es completamente offline.
- Falta probar exhaustivamente en dispositivos Android y publicar el acceso desde RTC Academy y bohemio.ws.

## Referencia
[UIT-R M.1677-1, Código Morse Internacional](https://www.itu.int/rec/R-REC-M.1677-1-200910-I/es).
