import test from 'node:test';
import assert from 'node:assert/strict';
import { routeIntent } from './intentRouter.ts';
import { getMysteriesForDay } from './rosarioData.ts';

test('routeIntent correctly classifies EMERGENCY phrases with highest priority', () => {
  const r1 = routeIntent('¡Ayuda por favor me caí en el baño!');
  assert.equal(r1.type, 'EMERGENCIA');
  assert.equal(r1.confidence, 1.0);

  const r2 = routeIntent('me siento mal llama a mi hija');
  assert.equal(r2.type, 'EMERGENCIA');

  const r3 = routeIntent('socorro necesito un doctor');
  assert.equal(r3.type, 'EMERGENCIA');
});

test('routeIntent classifies medications, prayers and daily mass', () => {
  const rMed = routeIntent('¿Qué pastilla me toca tomar?');
  assert.equal(rMed.type, 'MEDICINAS');

  const rRosario = routeIntent('Quiero rezar el rosario con los misterios');
  assert.equal(rRosario.type, 'ROSARIO');

  const rMisa = routeIntent('Pon la misa de hoy de la basílica');
  assert.equal(rMisa.type, 'MISA');

  const rFotos = routeIntent('Quiero ver las fotos de mis nietos');
  assert.equal(rFotos.type, 'FOTOS');

  // Test specific grandchild photo requests
  const rMateo = routeIntent('Berna, muéstrame una foto de Mateo');
  assert.equal(rMateo.type, 'FOTO_ESPECIFICA');
  assert.equal(rMateo.targetPerson, 'Mateo');

  const rSofia = routeIntent('Quiero ver fotos de mi nieta Sofía');
  assert.equal(rSofia.type, 'FOTO_ESPECIFICA');
  assert.equal(rSofia.targetPerson, 'Sofía');

  const rValentina = routeIntent('Enséñame a Valentina por favor');
  assert.equal(rValentina.type, 'FOTO_ESPECIFICA');
  assert.equal(rValentina.targetPerson, 'Valentina');
});

test('getMysteriesForDay returns the exact liturgical mysteries for every day', () => {
  // Lunes: 2026-11-16 is Monday
  const monday = new Date('2026-11-16T12:00:00Z');
  const mRes = getMysteriesForDay(monday);
  assert.equal(mRes.mysteryType, 'Gozosos');
  assert.equal(mRes.mysteries.length, 5);

  // Martes: 2026-11-17 is Tuesday
  const tuesday = new Date('2026-11-17T12:00:00Z');
  const tRes = getMysteriesForDay(tuesday);
  assert.equal(tRes.mysteryType, 'Dolorosos');

  // Jueves: 2026-11-19 is Thursday
  const thursday = new Date('2026-11-19T12:00:00Z');
  const thRes = getMysteriesForDay(thursday);
  assert.equal(thRes.mysteryType, 'Luminosos');

  // Domingo: 2026-11-15 is Sunday
  const sunday = new Date('2026-11-15T12:00:00Z');
  const sRes = getMysteriesForDay(sunday);
  assert.equal(sRes.mysteryType, 'Gloriosos');
});
