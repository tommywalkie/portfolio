import type { BitTimeline } from '../../lib/grid';
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

export const MOBILE_BITS: BitTimeline[] = [casioCourse, titre, olympiades, arepCheckin, sncfCarte, copilotExtension, parisCalifornie, rugby, frontAuCloud, grapheRelationnel, polyvalence, iaWorkflow, contact, arrivee];
