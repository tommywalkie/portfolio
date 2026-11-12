"""Extras on top of the effects soundtrack, generated in code (the earshot bank has no nature sounds):
the sea under the sailboat retro (paris-californie, from its camera pan to the end of the slide) and a referee's
whistle as the rugby slide arrives. Times come from out/cues.json, so they follow the timeline.
usage: python scripts/audio/v1.1-extras.py CUES.json IN.wav OUT.wav [MUSIC.wav]
With MUSIC.wav (one of audio/music/*.wav, scripts/audio/ambient.py) the bed is mixed in under the effects at
MUSIC_LUFS (default -26; the effects soundtrack sits at -25, but its sounds are sparse, so they stand well above)."""
import json
import os
import sys

import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt

cues_path, src, dst = sys.argv[1:4]
cues = json.load(open(cues_path, encoding='utf-8'))
fps = float(cues['fps'])
acts, cue = cues['acts'], cues['cue']
whistle_at = acts['rugby']['from'] / fps + 0.2
sea = (cue['paris-californie.pan'] / fps, (acts['paris-californie']['from'] + acts['paris-californie']['dur']) / fps)

x, sr = sf.read(src, always_2d=True)
rng = np.random.default_rng(7)

# the whistle: a ~2.9 kHz pea whistle, its pitch and level trilling fast, plus breath
d = 0.75
t = np.arange(int(d * sr)) / sr
trill = np.sin(2 * np.pi * 34 * t)
phase = 2 * np.pi * np.cumsum(2900 + 120 * trill) / sr
tone = np.sin(phase) + 0.25 * np.sin(2 * phase)
amp = (0.75 + 0.25 * trill) * np.minimum(1, t / 0.02) * np.minimum(1, (d - t) / 0.12)
w = (tone * 0.6 + rng.standard_normal(t.size) * 0.08) * amp
w = w / np.max(np.abs(w)) * 0.22
i0 = int(whistle_at * sr)
i1 = min(x.shape[0], i0 + w.size)
x[i0:i1, :] += w[: i1 - i0, None]

# the sea: rolling surf (filtered noise swelling about every 3.8 s) and foam hiss on the crests, stereo
s0, s1 = sea
n = int((s1 - s0) * sr)
tt = np.arange(n) / sr
swell = 0.55 + 0.45 * np.sin(2 * np.pi * tt / 3.8 - np.pi / 2) ** 2
crest = np.clip(np.sin(2 * np.pi * tt / 3.8 - np.pi / 2), 0, 1) ** 6
fade = np.minimum(1, tt / 1.2) * np.minimum(1, (tt[-1] - tt) / 0.8)
out = np.zeros((n, 2))
for ch in range(2):
    body = sosfilt(butter(2, 650, 'low', fs=sr, output='sos'), rng.standard_normal(n))
    foam = sosfilt(butter(2, [2500, 7000], 'band', fs=sr, output='sos'), rng.standard_normal(n))
    out[:, ch] = (body / np.std(body) * swell + foam / np.std(foam) * crest * 0.35) * fade
out *= 0.06  # Lowered from 0.11 (about -5 dB), still clearly audible
j0 = int(s0 * sr)
j1 = min(x.shape[0], j0 + n)
x[j0:j1, :] += out[: j1 - j0, :]

if len(sys.argv) > 4:
    import pyloudnorm as pyln

    m, msr = sf.read(sys.argv[4], always_2d=True)
    if msr != sr:
        raise SystemExit(f'music is {msr} Hz, the soundtrack {sr} Hz')
    m = m[: x.shape[0]] if len(m) >= x.shape[0] else np.pad(m, ((0, x.shape[0] - len(m)), (0, 0)))
    m = m * 10 ** ((float(os.environ.get('MUSIC_LUFS', '-26')) - pyln.Meter(sr).integrated_loudness(m)) / 20)
    x += m

peak = np.max(np.abs(x))
if peak > 0.98:
    x *= 0.98 / peak
sf.write(dst, x, sr, subtype='PCM_24')
print(f'extras: whistle at {whistle_at:.2f}s, sea {s0:.2f}-{s1:.2f}s -> {dst}')
