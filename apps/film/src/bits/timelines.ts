// The built story bits, in the story order (src/plans.ts FILM_ORDER). Pure timing modules only:
// the master timeline imports this list. Add a bit here and in ./registry.tsx when it is started.
// polyvalence sits right before ia-workflow; temoignage-metis and projets-perso are not built.
import type { BitTimeline } from '../lib/grid';
import casioCourse from './casio-course/timeline';
import titre from './titre/timeline';
import olympiades from './olympiades/timeline';
import arepCheckin from './arep-checkin/timeline';
import sncfCarte from './sncf-carte/timeline';
import copilotExtension from './copilot-extension/timeline';
import parisCalifornie from './paris-californie/timeline';
import rugby from './rugby/timeline';
import polyvalence from './polyvalence/timeline';
import frontAuCloud from './front-au-cloud/timeline';
import grapheRelationnel from './graphe-relationnel/timeline';
import iaWorkflow from './ia-workflow/timeline';
import contact from './contact/timeline';
import arrivee from './arrivee/timeline';
import { MOBILE } from '../lib/device';
import { MOBILE_BITS } from './mobile/timelines';

const DESKTOP_BITS: BitTimeline[] = [casioCourse, titre, olympiades, arepCheckin, sncfCarte, copilotExtension, parisCalifornie, rugby, frontAuCloud, grapheRelationnel, polyvalence, iaWorkflow, contact, arrivee];

export const BITS: BitTimeline[] = MOBILE ? MOBILE_BITS : DESKTOP_BITS;
