import test from 'node:test';
import assert from 'node:assert/strict';
import {
  selectMatureMaleSpanishVoice,
  clampMalePitch,
  DEFAULT_MATURE_MALE_PITCH,
  MALE_GEMINI_VOICE_OPTIONS,
  type SpeechVoiceLike,
} from './voiceUtils';

test('selectMatureMaleSpanishVoice prefers Mexican male voice over female es-MX voices', () => {
  const voices: SpeechVoiceLike[] = [
    { name: 'Paulina (es-MX)', lang: 'es-MX', localService: true },
    { name: 'Microsoft Sabina - Spanish (Mexico)', lang: 'es-MX', localService: true },
    { name: 'Juan (es-MX)', lang: 'es-MX', localService: true },
    { name: 'Jorge (es-ES)', lang: 'es-ES', localService: true },
  ];

  const chosen = selectMatureMaleSpanishVoice(voices);
  assert.ok(chosen);
  assert.equal(chosen.name, 'Juan (es-MX)');
});

test('selectMatureMaleSpanishVoice picks Spanish male voice over Chrome Google español female voice', () => {
  const voices: SpeechVoiceLike[] = [
    { name: 'Google español de Estados Unidos', lang: 'es-US' },
    { name: 'Grandpa (Spanish (Mexico))', lang: 'es-MX', localService: true },
  ];

  const chosen = selectMatureMaleSpanishVoice(voices);
  assert.ok(chosen);
  assert.equal(chosen.name, 'Grandpa (Spanish (Mexico))');
});

test('selectMatureMaleSpanishVoice picks Microsoft Raul over female voices', () => {
  const voices: SpeechVoiceLike[] = [
    { name: 'Google español (Paulina)', lang: 'es-MX' },
    { name: 'Microsoft Raul - Spanish (Mexico)', lang: 'es-MX' },
  ];

  const chosen = selectMatureMaleSpanishVoice(voices);
  assert.ok(chosen);
  assert.equal(chosen.name, 'Microsoft Raul - Spanish (Mexico)');
});

test('selectMatureMaleSpanishVoice falls back cleanly when only non-named Spanish voices exist', () => {
  const voices: SpeechVoiceLike[] = [
    { name: 'English US', lang: 'en-US' },
    { name: 'Voz Español Genérica', lang: 'es-MX' },
  ];

  const chosen = selectMatureMaleSpanishVoice(voices);
  assert.ok(chosen);
  assert.equal(chosen.lang, 'es-MX');
});

test('selectMatureMaleSpanishVoice returns null when no Spanish voices are installed', () => {
  const voices: SpeechVoiceLike[] = [
    { name: 'Samantha', lang: 'en-US' },
  ];

  assert.equal(selectMatureMaleSpanishVoice(voices), null);
});

test('clampMalePitch bounds pitch around mature male baritone default', () => {
  assert.equal(DEFAULT_MATURE_MALE_PITCH, 0.78);
  assert.equal(clampMalePitch(0.4), 0.65);
  assert.equal(clampMalePitch(1.4), 1.05);
  assert.equal(clampMalePitch(0.8), 0.8);
  assert.ok(MALE_GEMINI_VOICE_OPTIONS.some((v) => v.id === 'Charon'));
});
