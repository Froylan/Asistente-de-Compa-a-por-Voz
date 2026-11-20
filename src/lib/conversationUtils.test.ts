import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseStructuredConversationResponse,
  getEnhancedLocalFallback,
  getSparkStarter,
  inferTopicFromText,
  CONVERSATION_TOPICS,
} from './conversationUtils.ts';

test('parseStructuredConversationResponse parses valid JSON with reply and suggestedReplies', () => {
  const raw = JSON.stringify({
    reply: 'Qué rico mole preparaba usted, doña Lupita. ¿Con quién aprendió esa receta?',
    suggestedReplies: ['Con mi mamá en casa', 'Fue secreto de la abuela', 'También hacía tamales'],
  });

  const result = parseStructuredConversationResponse(raw, 'me gustaba hacer mole');
  assert.equal(result.reply, 'Qué rico mole preparaba usted, doña Lupita. ¿Con quién aprendió esa receta?');
  assert.deepEqual(result.suggestedReplies, [
    'Con mi mamá en casa',
    'Fue secreto de la abuela',
    'También hacía tamales',
  ]);
  assert.equal(result.topic, 'cocina');
});

test('parseStructuredConversationResponse handles markdown-fenced JSON cleanly', () => {
  const raw = '```json\n{"reply":"¡Hola doña Lupita! ¿Cómo amaneció hoy?","suggestedReplies":["Muy bien gracias a Dios","Con ganas de platicar"]}\n```';
  const result = parseStructuredConversationResponse(raw);
  assert.equal(result.reply, '¡Hola doña Lupita! ¿Cómo amaneció hoy?');
  assert.equal(result.suggestedReplies.length, 2);
});

test('parseStructuredConversationResponse gracefully handles plain text and injects contextual suggestions', () => {
  const raw = 'La Virgen de Guadalupe siempre la cuida mucho, doña Lupita. ¿Gusta rezar un Ave María?';
  const result = parseStructuredConversationResponse(raw, 'háblame de la virgen');
  assert.equal(result.reply, raw);
  assert.equal(result.topic, 'fe');
  assert.ok(result.suggestedReplies.length >= 2);
});

test('getEnhancedLocalFallback always ends with a stimulating question and provides suggestions', () => {
  const queries = [
    'me siento un poco sola',
    'me gustaba cocinar mole los domingos',
    'cuéntame de Mateo y Sofía',
    'hola buenos días Berna',
    'sí, muy bien',
    'algo completamente distinto sin palabras clave largas',
  ];

  for (const q of queries) {
    const res = getEnhancedLocalFallback(q, 'Lupita');
    assert.ok(res.reply.includes('?'), `Expected fallback for "${q}" to include a follow-up question`);
    assert.ok(res.suggestedReplies.length >= 2 && res.suggestedReplies.length <= 3);
  }
});

test('getSparkStarter rotates unused conversation starters per topic and personalizes name', () => {
  const first = getSparkStarter('cocina', 'morning', 'Esperanza', []);
  assert.ok(first.reply.includes('Esperanza'));
  assert.ok(first.reply.includes('?'));
  assert.ok(first.suggestedReplies.length >= 2);

  const second = getSparkStarter('cocina', 'morning', 'Esperanza', [first.reply]);
  assert.notEqual(second.reply, first.reply);
});

test('inferTopicFromText classifies topics accurately and CONVERSATION_TOPICS covers all themes', () => {
  assert.equal(inferTopicFromText('extraño el mole de mi pueblo'), 'cocina');
  assert.equal(inferTopicFromText('qué está haciendo mi nieta Sofía'), 'familia');
  assert.equal(inferTopicFromText('platícame de San Judas Tadeo'), 'fe');
  assert.equal(inferTopicFromText('me gustan los boleros de Pedro Infante'), 'musica');
  assert.equal(inferTopicFromText('cuando era joven en el rancho'), 'recuerdos');
  assert.ok(CONVERSATION_TOPICS.length >= 5);
});
