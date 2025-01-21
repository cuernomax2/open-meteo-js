import fetch from 'node-fetch'; //importar node-fetch

const codigosTiempo = { //diccionario hecho con chatgpt para asociar un valor legible al valor umérico retornado por open-meteo
  0: "Cielo despejado",
  1: "Mayormente despejado",
  2: "Parcialmente nublado",
  3: "Nublado",
  45: "Niebla",
  48: "Niebla con depósito de escarcha",
  51: "Lluvia ligera: Intensidad baja",
  53: "Lluvia moderada: Intensidad media",
  55: "Lluvia intensa: Alta intensidad",
  56: "Lluvia congelada: Intensidad baja",
  57: "Lluvia congelada: Alta intensidad",
  61: "Lluvia: Intensidad ligera",
  63: "Lluvia: Intensidad moderada",
  65: "Lluvia: Intensidad fuerte",
  66: "Lluvia congelada: Intensidad ligera",
  67: "Lluvia congelada: Intensidad fuerte",
  71: "Nevada: Intensidad ligera",
  73: "Nevada: Intensidad moderada",
  75: "Nevada: Intensidad fuerte",
  77: "Granos de nieve",
  80: "Chubascos de lluvia: Intensidad ligera",
  81: "Chubascos de lluvia: Intensidad moderada",
  82: "Chubascos de lluvia: Intensidad violenta",
  85: "Chubascos de nieve: Intensidad ligera",
  86: "Chubascos de nieve: Intensidad fuerte",
  95: "Tormenta: Intensidad ligera o moderada",
  96: "Tormenta con granizo ligero",
  99: "Tormenta con granizo fuerte"
};

export async function obtenInformacionMeteo(latitud, longitud) { //función que recoge los datos de open-meteo, los convierte en JSON y los retorna
  const apiURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitud}&longitude=${longitud}&current_weather=true`;
  try {
    const respuestaAPI = await fetch(apiURL);
    const respuestaAPIenJSON = await respuestaAPI.json();
    return respuestaAPIenJSON;    
  } catch (error) {
    console.error("Error fetcheando la información meteorológica", error);
    return false;
  }
}

export function procesaCodigoTiempo(JSON){ //utiliza el json retornado de obtenerInformacionMeteo y, usando el código numérico weathercode lo contrasta con el diccionario definido al principio del programa. Retorna un string
  if (JSON != false){
    const codigoTiempo = JSON.current_weather.weathercode;
    const tiempoDescripcion = codigosTiempo[codigoTiempo] || "Código meteorológico no registrado";
    return tiempoDescripcion;
  } else {
    console.log("Error fetcheando la información meteorológica")
    process.exit(1);
  }
}

export function procesaViento(JSON){ //utiliza el json retornado de obtenerInformacionMeteo y retorna una matriz (velocidad posición 0, dirección posición 1)
  const vientoVelocidad = JSON.current_weather.winddirection;
  const vientoDireccion = JSON.current_weather.windspeed;
  return [vientoVelocidad, vientoDireccion];
}

export function direccionViento(viento) { //función creada con chatgpt para definir la dirección del viento según el valor introducido (de 0 a 360)
  const grados = viento;
  let direccion = "";

  if (grados >= 0 && grados < 22.5) {
    direccion = "N";
  } else if (grados >= 22.5 && grados < 67.5) {
    direccion = "NE";
  } else if (grados >= 67.5 && grados < 112.5) {
    direccion = "E";
  } else if (grados >= 112.5 && grados < 157.5) {
    direccion = "SE";
  } else if (grados >= 157.5 && grados < 202.5) {
    direccion = "S";
  } else if (grados >= 202.5 && grados < 247.5) {
    direccion = "SW";
  } else if (grados >= 247.5 && grados < 292.5) {
    direccion = "W";
  } else if (grados >= 292.5 && grados < 337.5) {
    direccion = "NW";
  } else if (grados >= 337.5 && grados < 360) {
    direccion = "N";
  }
  return direccion;
}

export function procesaTemperatura(JSON) { //función que comprueba que la temperatura no esté por debajo del 0 kelvin y retorna la temperatura actual
  const temperatura = JSON.current_weather.temperature;
  if (temperatura < -273.15) {
    throw new Error('Temperatura inválida');
  }
  return temperatura;
}

export function muestraInformacionMeteo(tiempo, viento, temperatura){ //función que muestra por pantalla todos los valores relevantes, teniendo como entrada variables cuyos datos fueron retornos de las funciones anteriores
  console.log(`Descripción del tiempo: ${tiempo}`);
  console.log(`Temperatura actual: ${temperatura}ºC`);
  console.log(`Velocidad del viento: ${viento[0]}Km/h`);
  console.log(`Dirección del viento: ${viento[1]}º (${direccionViento(viento[1])})`);
}


async function main() {
  const teisLatitud = 42.2576;
  const teisLongitud = -8.683;

  const JSON = await obtenInformacionMeteo(teisLatitud, teisLongitud);
  const tiempo = procesaCodigoTiempo(JSON);
  const viento = procesaViento(JSON);
  const temperatura = procesaTemperatura(JSON);
  muestraInformacionMeteo(tiempo, viento, temperatura);
}

main();