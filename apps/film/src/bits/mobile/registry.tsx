import casioCourse from './casio-course';
import titre from './titre';
import olympiades from './olympiades';
import arepCheckin from './arep-checkin';
import sncfCarte from './sncf-carte';
import copilotExtension from './copilot-extension';
import parisCalifornie from './paris-californie';
import rugby from './rugby';
import polyvalence from './polyvalence';
import frontAuCloud from './front-au-cloud';
import grapheRelationnel from './graphe-relationnel';
import iaWorkflow from './ia-workflow';
import contact from './contact';
import arrivee from './arrivee';
import type { BitModule } from '../types';

export const MOBILE_BIT_MODULES: BitModule[] = [casioCourse, titre, olympiades, arepCheckin, sncfCarte, copilotExtension, parisCalifornie, rugby, frontAuCloud, grapheRelationnel, polyvalence, iaWorkflow, contact, arrivee];

export const MOBILE_FILM_SEED: Record<string, number> = {
  'casio-course': 1,
  titre: 1,
  olympiades: 1,
  'arep-checkin': 1,
  'sncf-carte': 1,
  'copilot-extension': 1,
  'paris-californie': 1,
  polyvalence: 3,
  'front-au-cloud': 1,
  'graphe-relationnel': 1,
  'ia-workflow': 1,
  rugby: 1,
  contact: 1,
  arrivee: 1,
};
