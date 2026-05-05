// Frases del Guerrero de la Luz — banco inicial
// Fuente: Paulo Coelho, adaptaciones propias del espíritu de El Sendero

export const WISDOM = [
  {
    text: "El guerrero de la luz sabe que es necesario actuar. Pensar y actuar son partes del mismo camino.",
    source: "Coelho"
  },
  {
    text: "El camino no pregunta si estás listo. Solo existe para los que lo recorren.",
    source: "El Sendero"
  },
  {
    text: "Esta noche, mientras otros duermen, vos construís quién vas a ser mañana.",
    source: "El Sendero"
  },
  {
    text: "El guerrero de la luz no tiene miedo de parecer loco. Habla con sus sueños, cree que pueden realizarse.",
    source: "Coelho"
  },
  {
    text: "No existen errores, solo lecciones. No existen fracasos, solo pasos.",
    source: "El Sendero"
  },
  {
    text: "El camino se hace al andar. No al pensar, no al planear. Al andar.",
    source: "El Sendero"
  },
  {
    text: "Cada kilómetro recorrido en la oscuridad vale por diez corridos bajo el sol.",
    source: "El Sendero"
  },
  {
    text: "El guerrero respeta su cansancio y descansa. Pero nunca se rinde.",
    source: "Coelho"
  },
  {
    text: "Un guerrero no necesita que le aplaudan. Él sabe cuándo hizo algo bien.",
    source: "Coelho"
  },
  {
    text: "El sendero no es recto ni fácil. Pero es el tuyo. Nadie puede recorrerlo por vos.",
    source: "El Sendero"
  },
]

// Obtiene la frase del día (cambia cada día, consistente dentro del día)
export function getTodaysWisdom() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  )
  return WISDOM[dayOfYear % WISDOM.length]
}
