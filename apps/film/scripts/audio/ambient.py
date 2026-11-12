#!/usr/bin/env python3
"""ambient.py: the calm groove beds for the film. Five styles, all code-made with scripts/audio/synth.py,
all in G major at the film's 100 BPM (a bar is 2.4 s, so every change lands on the picture's grid).

Each style is built like this:
  - a smooth START: two bars of pad only, swelling in (filter opening + a 3 s fade) before anything else enters;
  - the LOOP: 12 bars (28.8 s) of chords with a soft groove, repeated for as long as the film needs (no peaks: slow
    attacks, every drum low-passed and very quiet, a soft limiter at the end);
  - the ENDING: the last 5 bars land on the tonic (Am9 -> D6 -> Gmaj9), the groove drops out, a single soft bell rings
    and everything fades to silence by the last frame.
The length follows the film: --seconds, or --cues out/cues.json (total / fps). The 12-bar loop is also written on
its own (<style>__loop.wav) so its seam can be heard: it is cut from the middle of three cycles, so it loops cleanly.

Usage (from films/cinetic-resume):
  uv run python scripts/audio/ambient.py --all [--cues out/cues.json | --seconds 116.95] [--out audio/music]
  uv run python scripts/audio/ambient.py --style lofi --if-needed
Styles: warm (pad groove), kalimba (plucked arp), lofi (soft keys, vinyl hiss), retro (analog arp), drift (ambient bells).
"""
import argparse
import json
import os
import sys
import time

import numpy as np
import soundfile as sf

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import synth as S  # noqa: E402

SR = S.SR
BPM = 100
BEAT = 60.0 / BPM
BAR = 4 * BEAT  # 2.4 s
LOOP_BARS = 12  # 28.8 s
HEAD = 2  # intro bars: the pad alone
TAIL = 5  # ending bars
LEVEL_LUFS = -22.0  # the standalone files; the film mix scales them down under the effects

# chord -> bass root, pad voicing, keys voicing (MIDI). G major: Gmaj9, Em9, Cmaj9, D6, Am9, Bm7.
CH = {
    'G': dict(bass=43, pad=[55, 59, 62, 66, 69], keys=[59, 62, 66, 69]),
    'Em': dict(bass=40, pad=[59, 62, 64, 66, 67], keys=[62, 64, 67, 71]),
    'C': dict(bass=36, pad=[55, 59, 62, 64, 67], keys=[59, 62, 64, 67]),
    'D': dict(bass=38, pad=[57, 59, 62, 66, 69], keys=[57, 62, 66, 69]),
    'Am': dict(bass=45, pad=[55, 59, 60, 64, 67], keys=[60, 64, 67, 71]),
    'Bm': dict(bass=47, pad=[57, 59, 62, 66], keys=[57, 62, 66, 69]),
}
LOOP = ['G', 'Em', 'C', 'D', 'G', 'Em', 'Am', 'D', 'G', 'Bm', 'C', 'D']  # resolves back to its first chord
ENDING = ['Am', 'D', 'G', 'G', 'G']

STYLES = {
    'warm': dict(seed=1, voices=5, detune=0.14, cutoff=1500, pad_a=0.9, g_pad=1.0, g_bass=0.55, g_lead=0.0, g_drums=0.5, rev=0.30,
                 bass=[(0, 1.5, 1.0), (2.5, 1.0, 0.7)], kick=[(0, 1.0), (2.5, 0.7)], snare=[], hat='eighths', lead=None, air=0.0),
    'kalimba': dict(seed=2, voices=3, detune=0.10, cutoff=1100, pad_a=1.2, g_pad=0.7, g_bass=0.45, g_lead=0.6, g_drums=0.3, rev=0.38,
                    bass=[(0, 2.0, 0.9), (2, 2.0, 0.7)], kick=[], snare=[], hat='shaker', lead='pluck8', air=0.0),
    'lofi': dict(seed=3, voices=3, detune=0.08, cutoff=900, pad_a=1.0, g_pad=0.35, g_bass=0.6, g_lead=0.5, g_drums=0.6, rev=0.22,
                 bass=[(0, 1.0, 1.0), (1.5, 0.5, 0.6), (2, 1.0, 0.8), (3.5, 0.5, 0.5)], kick=[(0, 1.0), (1.5, 0.7), (2.5, 0.8)],
                 snare=[(1, 0.8), (3, 0.8)], hat='swing', lead='keys', air=0.012),
    'retro': dict(seed=4, voices=5, detune=0.18, cutoff=1900, pad_a=0.6, g_pad=0.7, g_bass=0.55, g_lead=0.45, g_drums=0.4, rev=0.28,
                  bass=[(i * 0.5, 0.45, 0.8 if i % 2 == 0 else 0.55) for i in range(8)], kick=[(0, 0.9), (1, 0.7), (2, 0.8), (3, 0.7)],
                  snare=[], hat='offbeats', lead='arp16', air=0.0),
    'drift': dict(seed=5, voices=5, detune=0.12, cutoff=1200, pad_a=1.6, g_pad=1.1, g_bass=0.35, g_lead=0.35, g_drums=0.25, rev=0.45,
                  bass=[(0, 4.0, 0.8)], kick=[(0, 0.8), (2, 0.55)], snare=[], hat=None, lead='bell', air=0.006),
}


def bar_plan(nbars, loop_mode):
    """One dict per bar: its chord, its position in the loop (seeds the random choices, so the loop is exactly periodic),
    whether the groove plays, and how many bars the pad note lasts (0: the previous bar's note is still ringing)."""
    bars = []
    for b in range(nbars):
        if loop_mode:
            bars.append(dict(chord=LOOP[b % LOOP_BARS], pos=b % LOOP_BARS, groove=True, pad=1, kind='body'))
        elif b < HEAD:
            bars.append(dict(chord='G', pos=200 + b, groove=False, pad=HEAD if b == 0 else 0, kind='intro'))
        elif b >= nbars - TAIL:
            k = b - (nbars - TAIL)
            bars.append(dict(chord=ENDING[k], pos=100 + k, groove=k < 2, pad={0: 1, 1: 1, 2: 3}.get(k, 0), kind=f'end{k}'))
        else:
            p = (b - HEAD) % LOOP_BARS
            bars.append(dict(chord=LOOP[p], pos=p, groove=True, pad=1, kind='body'))
    return bars


def render(style, nbars, loop_mode=False):
    P = STYLES[style]
    total = nbars * BAR + 7.0  # room for the reverb to ring out
    pad, bas, lead, drm, fx, air = (S.Bus(seconds=total) for _ in range(6))
    kick_s = S.filt(S.kick(52, 0.5, 0.35), S.lp(150, 2))
    brush = S.filt(S.noise(0.25, 31), S.bp(900, 4200)) * np.exp(-S.tt(0.25) / 0.07)
    hats = [S.filt(S.hat(0.1, 0.012, 7000, seed=40 + i), S.lp(9000, 1)) for i in range(4)]

    for b, B in enumerate(plan := bar_plan(nbars, loop_mode)):
        t0 = b * BAR
        c = CH[B['chord']]
        rnd = np.random.default_rng(P['seed'] * 1000 + B['pos'])
        jit = lambda: float(np.clip(rnd.normal(0, 0.004), -0.01, 0.01))  # noqa: E731
        vj = lambda: float(1 + rnd.uniform(-0.08, 0.08))  # noqa: E731

        if B['pad']:  # the pad: slow attack, long release, overlapping into the next chord
            d = B['pad'] * BAR + 1.6
            a = 3.4 if B['kind'] == 'intro' else (2.0 if B['kind'] == 'end2' else P['pad_a'])
            r = 2.6 if B['kind'] == 'end2' else 1.3
            for i, m in enumerate(c['pad']):
                pad.place(S.supersaw(S.mtof(m), d, P['voices'], P['detune'], P['cutoff'], a, r, 100 + B['pos'] * 7 + i), t0, 0.5)

        if B['kind'] == 'end2':  # the resolved chord: one long bass note and one soft bell, no groove
            bas.place(S.bass(S.mtof(c['bass']), 3 * BAR, 1.1, 0.4), t0, 0.8)
            fx.place(S.fm_bell(S.mtof(79), 6.0, 1.0, 2.0, 2.2), t0, 0.30)
        if not B['groove']:
            continue

        for pos, ln, vel in P['bass']:
            bas.place(S.bass(S.mtof(c['bass']), ln * BEAT, 1.1, 0.4), t0 + pos * BEAT + jit(), vel * vj())
        for pos, vel in P['kick']:
            drm.place(kick_s, t0 + pos * BEAT + jit(), 0.55 * vel * vj())
        for pos, vel in P['snare']:
            drm.place(brush, t0 + pos * BEAT + jit(), 0.5 * vel * vj())
        steps = {'eighths': 0.5, 'swing': 0.5, 'offbeats': 1.0, 'shaker': 0.25, None: None}[P['hat']]
        if steps:
            for i, pos in enumerate(np.arange(0, 4, steps)):
                if P['hat'] == 'offbeats':
                    pos += 0.5
                if P['hat'] == 'swing' and (pos % 1) == 0.5:
                    pos += 0.08
                accent = 1.0 if (pos % 1) in (0.0, 0.5) and P['hat'] != 'shaker' else 0.65
                drm.place(hats[i % 4], t0 + pos * BEAT + jit(), 0.10 * accent * vj())

        k = P['lead']
        keys = [m + 12 for m in c['keys']]
        if k == 'pluck8':  # a gentle plucked arpeggio on the eighths, a few rests
            for i, idx in enumerate([0, 2, 1, 3, 2, 1, 3, 2]):
                if rnd.random() < 0.2:
                    continue
                x = S.pluck(S.mtof(keys[idx]), 0.9, 3000, 450, 0.08, 0.28)
                lead.place(x, t0 + i * 0.5 * BEAT + jit(), (1.0 if i % 4 == 0 else 0.6) * vj(), pan=(-0.3, 0.3)[i % 2])
        elif k == 'arp16':  # an analog-style sixteenth arpeggio, low in the mix
            for i in range(16):
                idx = [0, 1, 2, 3, 2, 1, 2, 3][i % 8]
                x = S.pluck(S.mtof(keys[idx]), 0.35, 2000, 600, 0.06, 0.12)
                lead.place(x, t0 + i * 0.25 * BEAT + jit(), (1.0 if i % 4 == 0 else 0.7) * vj(), pan=(-0.25, 0.25)[i % 2])
        elif k == 'keys':  # soft electric-piano chord stabs, lightly strummed
            for pos, vel in ((0.0, 1.0), (1.5, 0.6), (2.5, 0.7)):
                for i, m in enumerate(c['keys']):
                    lead.place(S.keys(S.mtof(m), 1.6, 1.1, 0.7), t0 + pos * BEAT + i * 0.018 + jit(), 0.28 * vel * vj(), pan=-0.25 + 0.17 * i)
        elif k == 'bell' and B['pos'] % 2 == 0:  # a sparse bell every other bar
            lead.place(S.fm_bell(S.mtof(keys[-1]), 4.5, 0.9, 2.0, 1.8), t0, 0.5 * vj(), pan=float(rnd.uniform(-0.4, 0.4)))

    t = np.arange(len(pad.x)) / SR
    if not loop_mode:  # the smooth start: the pad opens from a muffled 350 Hz to full over the intro
        n0 = S.ns(HEAD * BAR + 1.5)
        fc = 350.0 * (20000.0 / 350.0) ** np.clip(t[:n0] / (HEAD * BAR + 0.5), 0, 1)
        pad.x[:n0] = S.sweep(pad.x[:n0], fc, 'low', 2, 256)
    if style == 'drift':  # the pad breathes: a 4-bar swell (divides the 12-bar loop)
        pad.x *= (0.8 + 0.2 * np.sin(2 * np.pi * t / (4 * BAR)))[:, None]
    if P['lead'] in ('pluck8', 'arp16'):
        lead.x = S.pingpong(lead.x, BEAT * 0.75, 0.35, 0.3, 3500)
    if P['air']:
        hiss = S.colored(total, 11, 1.0 if style == 'lofi' else 1.4)
        air.x[:, 0] = air.x[:, 1] = S.filt(hiss, S.lp(6000 if style == 'lofi' else 3000, 2)) * P['air']

    dry = S.filt(pad.x, S.hp(170, 2)) * P['g_pad'] + S.filt(bas.x, S.hp(40, 2)) * P['g_bass'] + lead.x * P['g_lead'] + drm.x * P['g_drums'] + fx.x + air.x
    wet = S.reverb(S.filt(pad.x * 0.5 + lead.x * 0.8 + fx.x, S.hp(250, 2)), 'hall') * P['rev']
    return S.filt(dry + wet, S.lp(9000, 2))


def finish(x, seconds=None, fades=True):
    """Trim to the film, fade in and out, normalise the loudness, soft-limit (no peaks)."""
    import pyloudnorm as pyln

    if seconds is not None:
        x = x[: S.ns(seconds)]
    if fades:
        t = np.arange(len(x)) / SR
        fin = np.sin(np.pi / 2 * np.clip(t / 3.0, 0, 1)) ** 2
        fout = np.cos(np.pi / 2 * np.clip((t - (len(x) / SR - 6.0)) / 6.0, 0, 1)) ** 2
        x = x * (fin * fout)[:, None]
    lufs = pyln.Meter(SR).integrated_loudness(x)
    x = x * 10 ** ((LEVEL_LUFS - lufs) / 20)
    return 0.8 * np.tanh(x / 0.8)


def build(style, seconds, out_dir):
    t0 = time.time()
    nbars = int(np.ceil(seconds / BAR))
    full = finish(render(style, nbars), seconds)
    sf.write(os.path.join(out_dir, f'{style}.wav'), full, SR, subtype='PCM_24')
    # the loop: three cycles rendered, the middle one kept, so its tails and its seam are the steady state
    three = finish(render(style, 3 * LOOP_BARS, loop_mode=True), None, fades=False)
    loop = three[S.ns(LOOP_BARS * BAR): S.ns(2 * LOOP_BARS * BAR)]
    sf.write(os.path.join(out_dir, f'{style}__loop.wav'), loop, SR, subtype='PCM_24')
    jump = float(np.max(np.abs(loop[0] - loop[-1])))
    typ = float(np.percentile(np.abs(np.diff(loop, axis=0)), 99))
    print(f'{style:8s} {len(full) / SR:7.2f}s  peak {np.max(np.abs(full)):.2f}  loop {len(loop) / SR:.1f}s seam jump {jump:.4f} (typical step {typ:.4f})  [{time.time() - t0:.0f}s]')


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--style', choices=list(STYLES))
    ap.add_argument('--all', action='store_true')
    ap.add_argument('--seconds', type=float)
    ap.add_argument('--cues', default='out/cues.json', help='the film length is read from its total / fps')
    ap.add_argument('--out', default='audio/music')
    ap.add_argument('--if-needed', action='store_true', help='skip a style whose file already has the film length')
    a = ap.parse_args()
    seconds = a.seconds
    if seconds is None:
        d = json.load(open(a.cues, encoding='utf-8'))
        seconds = d['total'] / d['fps']
    os.makedirs(a.out, exist_ok=True)
    for style in (STYLES if a.all else [a.style or 'warm']):
        f = os.path.join(a.out, f'{style}.wav')
        if a.if_needed and os.path.isfile(f) and abs(sf.info(f).duration - seconds) < 0.05:
            print(f'{style}: {f} already {seconds:.2f}s')
            continue
        build(style, seconds, a.out)


if __name__ == '__main__':
    main()
