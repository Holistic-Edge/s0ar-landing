import { zodToJsonSchema } from 'zod-to-json-schema';
import { registrationSchema, buildRegistrationPayload } from '../src/lib/registration-submission';
import { REVIEW_CONTACT, REVIEW_CONSENT, REVIEW_VIBE } from '../src/lib/registration-review';
const schema = zodToJsonSchema(registrationSchema, {name:'SOARRegistration',effectStrategy:'input'});
const definition = schema.definitions?.['SOARRegistration'];
if (definition && typeof definition === 'object' && 'properties' in definition) {
 const vibe = definition.properties?.['vibe'];
 if (vibe && typeof vibe === 'object' && 'properties' in vibe) {
  const music = vibe.properties?.['music'];
  if (music && typeof music === 'object') Object.assign(music, {uniqueItems:true});
 }
}
await Bun.write('docs/registration.schema.json', JSON.stringify(schema,null,2));
await Bun.write('docs/registration.example.json', JSON.stringify(buildRegistrationPayload({contact:REVIEW_CONTACT, consent:REVIEW_CONSENT, vibe:{moment:REVIEW_VIBE.moment[0] ?? '', music:REVIEW_VIBE.music, move:REVIEW_VIBE.move[0] ?? '', group:REVIEW_VIBE.group[0] ?? '', occasion:'',occasionDate:''}, submissionId:'9a0ea1c7-7972-4cd3-9bdd-22546fb6e0ae',submittedAt:'2026-10-29T05:04:00.000Z',attribution:{utm_source:'',utm_medium:'',utm_campaign:'',referrer:'',landing_path:'/'}}),null,2));