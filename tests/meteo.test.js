import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

import { 
  obtenInformacionMeteo, 
  procesaCodigoTiempo, 
  procesaViento, 
  direccionViento, 
  procesaTemperatura, 
  muestraInformacionMeteo 
} from '../meteo.mjs';

fetchMock.enableMocks();

beforeEach(() => {
  fetch.resetMocks();
});

describe('Pruebas para el programa meteorológico', () => {
  test('obtenInformacionMeteo devuelve datos correctos', async () => {
    fetch.mockResponseOnce(
      JSON.stringify({
        current_weather: {
          temperature: 15,
          windspeed: 10,
          winddirection: 270,
          weathercode: 1
        }
      })
    );

    const datosMeteo = await obtenInformacionMeteo(42.2576, -8.683);
    expect(datosMeteo.current_weather.temperature).toBeGreaterThanOrEqual(-50);
    expect(datosMeteo.current_weather.temperature).toBeLessThanOrEqual(50);
  
    expect(datosMeteo.current_weather.windspeed).toBeGreaterThanOrEqual(0);
    expect(datosMeteo.current_weather.windspeed).toBeLessThanOrEqual(500);
  
    expect(datosMeteo.current_weather.winddirection).toBeGreaterThanOrEqual(0);
    expect(datosMeteo.current_weather.winddirection).toBeLessThanOrEqual(360);
  
    expect(datosMeteo.current_weather.weathercode).toBeGreaterThanOrEqual(0);
    expect(datosMeteo.current_weather.weathercode).toBeLessThanOrEqual(99);
  });

  test('procesaCodigoTiempo convierte correctamente el código del tiempo', () => {
    const mockJSON = {
      current_weather: {
        weathercode: 1
      }
    };

    const descripcionTiempo = procesaCodigoTiempo(mockJSON);
    expect(descripcionTiempo).toBe('Mayormente despejado');
  });

  test('procesaViento extrae correctamente la velocidad y dirección del viento', () => {
    const mockJSON = {
      current_weather: {
        windspeed: 10,
        winddirection: 270
      }
    };

    const viento = procesaViento(mockJSON);
    expect(viento).toEqual([270, 10]);
  });

  test('direccionViento devuelve la dirección correcta basada en el ángulo', () => {
    expect(direccionViento(0)).toBe('N'); 
    expect(direccionViento(45)).toBe('NE');
    expect(direccionViento(90)).toBe('E');
    expect(direccionViento(180)).toBe('S');
    expect(direccionViento(270)).toBe('W'); 
    expect(direccionViento(315)).toBe('NW');
  });

  test('procesaTemperatura retorna la temperatura correctamente', () => {
    const mockJSON = {
      current_weather: {
        temperature: 20
      }
    };

    const temperatura = procesaTemperatura(mockJSON);
    expect(temperatura).toBe(20);
  });

  test('muestraInformacionMeteo muestra la información correctamente en consola', () => {
    const mockJSON = {
      current_weather: {
        temperature: 20,
        windspeed: 10,
        winddirection: 270,
        weathercode: 1
      }
    };

    console.log = jest.fn();

    const tiempo = procesaCodigoTiempo(mockJSON);
    const viento = procesaViento(mockJSON);
    const temperatura = procesaTemperatura(mockJSON);

    muestraInformacionMeteo(tiempo, viento, temperatura);

    expect(console.log).toHaveBeenCalledTimes(4); ///////////////

    expect(console.log).toHaveBeenCalledWith('Descripción del tiempo: Mayormente despejado');
    expect(console.log).toHaveBeenCalledWith('Temperatura actual: 20ºC');
    expect(console.log).toHaveBeenCalledWith('Velocidad del viento: 10Km/h');
    expect(console.log).toHaveBeenCalledWith('Dirección del viento: 270 (W)');
  });
});
