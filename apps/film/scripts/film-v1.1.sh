#!/usr/bin/env bash
# film-v1.1.sh: the whole build in one command.
#   npm run film:v1.1            fr + en, full render          npm run film:v1.1:fr / :en     one language
#   npm run film:v1.1:sound      new sound onto the existing videos (30 s, no picture render)
#   npm run film:v1.1:sound -- lofi      the same with another music bed (warm | kalimba | lofi | retro | drift | none)
#   npm run film:v1.1:music      the five beds, each on its own French video: out/film/film__version-v1.1__music-<style>.mp4
# Steps: 1 sound cues (out/cues.json) 2 earshot kit (audio/kit) 3 effects soundtrack (audio/score-v1.1.json)
#        4 music bed (audio/music/<style>.wav, scripts/audio/ambient.py) + sea + referee whistle (v1.1-extras.py)
#        5 renders out/film/film__version-v1.1.mp4 (fr) and/or film__version-v1.1__en.mp4 (en), text gate included
# The bed defaults to "warm" (MUSIC=<style> or the second argument). TEXT_GATE=0 skips the text audit (~2 min a render).
# Levels: effects at -25 LUFS (audio/score-v1.1.json master.lufs; typing lower still, audio/kit.json),
# the bed at MUSIC_LUFS (default -26). The effects are sparse, so their sounds stand well above the continuous bed.
#
# --theme dark|light (default dark) is the only addition: it exports FILM_THEME, which remotion.config.ts
# bakes into the bundle (src/brand/theme.ts), and puts __light in the output names so a light build never
# overwrites a dark deliverable. Everything else below is the original flow, unchanged.
# --device desktop|mobile: one device only (FILM_DEVICE); mobile renders 1080x1920 with __mobile names.
# Without --device, the same build runs for desktop, then for mobile.
set -euo pipefail
cd "$(dirname "$0")/.."
ARGS=("$@")
WHICH=${1:-all}
MUSIC=${MUSIC:-warm}
THEME=dark
DEVICE=""
shift $(( $# > 0 ? 1 : 0 )) || true
# the optional music name comes second, but only if it is not an option (`en --theme light` has no music name:
# reading `--theme` as the music broke every light build)
if [[ $# -gt 0 && "$1" != --* ]]; then MUSIC=$1; shift; fi
while [[ $# -gt 0 ]]; do
  case "$1" in
    --theme) THEME=${2:?--theme wants dark or light}; shift ;;
    --device) DEVICE=${2:?--device wants desktop or mobile}; shift ;;
    *) echo "film-v1.1: unexpected argument '$1' (see the header)" >&2; exit 2 ;;
  esac
  shift
done
[[ "$THEME" == dark || "$THEME" == light ]] || { echo "film-v1.1: --theme must be dark or light, got '$THEME'" >&2; exit 2; }
# no --device: the desktop build, then the mobile one (each has its own cues and soundtrack)
if [[ -z "$DEVICE" ]]; then
  bash "$0" ${ARGS[@]+"${ARGS[@]}"} --device desktop
  bash "$0" ${ARGS[@]+"${ARGS[@]}"} --device mobile
  exit 0
fi
export FILM_THEME=$THEME
# light writes __light-suffixed files; dark keeps the original names exactly
if [[ "$THEME" == light ]]; then SFX=__light; else SFX=; fi
[[ "$DEVICE" == desktop || "$DEVICE" == mobile ]] || { echo "film-v1.1: --device must be desktop or mobile, got '$DEVICE'" >&2; exit 2; }
export FILM_DEVICE=$DEVICE
[[ "$DEVICE" == mobile ]] && SFX=${SFX}__mobile
command -v uv >/dev/null || { echo "film-v1.1: uv not found (https://docs.astral.sh/uv/)" >&2; exit 1; }
# Python is the film's uv project (pyproject.toml + uv.lock): every call is `uv run python`. earshot, the sound-kit
# engine, is a uv tool in its own environment (uv tool install earshot); kit.py finds its interpreter here.
py() { uv run python "$@"; }
if [[ -z "${EARSHOT_PYTHON:-}" ]]; then
  TOOLS=$(uv tool dir | tr -d '\r')
  for c in "$TOOLS/earshot/Scripts/python.exe" "$TOOLS/earshot/bin/python"; do
    [[ -x "$c" ]] && { EARSHOT_PYTHON=$c; break; }
  done
fi
[[ -x "${EARSHOT_PYTHON:-}" ]] || { echo "film-v1.1: earshot not found (uv tool install \"earshot[mcp] @ git+https://github.com/Leonxlnx/earshot\")" >&2; exit 1; }
export EARSHOT_PYTHON
STYLES="warm kalimba lofi retro drift"
if [[ "$MUSIC" != none && " $STYLES " != *" $MUSIC "* ]]; then echo "film-v1.1: unknown music '$MUSIC' (have: $STYLES none)" >&2; exit 1; fi
T0=$(date +%s)
step() { echo "[film-v1.1 $(( $(date +%s) - T0 ))s] $*" >&2; }

mkdir -p out/audio out/film audio/music
step "1/5 sound cues"
npx tsx scripts/export-cues.ts
step "2/5 kit"
py scripts/audio/kit.py render
step "3/5 effects soundtrack"
py scripts/audio/score.py --cues out/cues.json --score audio/score-v1.1.json \
  --out out/audio/v1.1-effects.wav --stems out/stems-v1.1 --json out/qa/score-v1.1.json

# $1 style (or none), $2 output wav: the music bed (made if missing / the wrong length), the sea and the whistle on top
soundtrack() {
  local style=$1 out=$2 args=()
  if [[ "$style" != none ]]; then
    py scripts/audio/ambient.py --style "$style" --if-needed >&2
    args=("audio/music/$style.wav")
  fi
  py scripts/audio/v1.1-extras.py out/cues.json out/audio/v1.1-effects.wav "$out" ${args[@]+"${args[@]}"}
}
# $1 video in, $2 soundtrack wav, $3 video out: the soundtrack onto an existing picture (no re-render)
mux() {
  local dur
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$1" | tr -d '\r')
  ffmpeg -v error -y -i "$1" -i "$2" -map 0:v:0 -map 1:a:0 -c:v copy -af apad -c:a aac -b:a 320k -ar 48000 -ac 2 -t "$dur" -movflags +faststart "$3"
}

if [[ "$WHICH" == music ]]; then
  # the five beds, each on its own copy of the French video, to listen and pick
  [[ -f out/film/film__version-v1.1${SFX}.mp4 ]] || { echo "film-v1.1: render the French film once first (npm run film:v1.1:fr)" >&2; exit 1; }
  for s in $STYLES; do
    step "4/5 music bed: $s"
    soundtrack "$s" "out/audio/v1.1-soundtrack${SFX}__$s.wav"
    mux out/film/film__version-v1.1${SFX}.mp4 "out/audio/v1.1-soundtrack${SFX}__$s.wav" "out/film/film__version-v1.1${SFX}__music-$s.mp4"
  done
  step "done: the five videos, and the beds alone in audio/music/ (<style>.wav, <style>__loop.wav)"
  ls -la out/film/film__version-v1.1${SFX}__music-*.mp4 audio/music/*.wav >&2
  exit 0
fi

step "4/5 music bed ($MUSIC), sea, whistle"
soundtrack "$MUSIC" "out/audio/v1.1-soundtrack${SFX}.wav"
AUDIO="$(pwd -W 2>/dev/null || pwd)/out/audio/v1.1-soundtrack${SFX}.wav"

if [[ "$WHICH" == sound ]]; then
  # sound only: the new soundtrack onto the existing videos, picture untouched. Only valid when nothing visible changed
  # since those videos were rendered.
  for f in out/film/film__version-v1.1${SFX}.mp4 out/film/film__version-v1.1${SFX}__en.mp4; do
    [[ -f "$f" ]] || { echo "film-v1.1: $f does not exist yet: run npm run film:v1.1 once first" >&2; exit 1; }
    step "muxing the new soundtrack onto $f"
    mux "$f" "$AUDIO" "${f%.mp4}.sound-tmp.mp4"
    mv -f "${f%.mp4}.sound-tmp.mp4" "$f"
  done
  step "done (sound only)"
  ls -la out/film/film__version-v1.1*.mp4 >&2
  exit 0
fi

render() { # $1 output, rest: extra args
  local out=$1; shift
  step "5/5 render $out"
  bash scripts/render.sh Film "$out" --preview --audio "$AUDIO" "$@"
}
[[ "$WHICH" == all || "$WHICH" == fr ]] && render out/film/film__version-v1.1${SFX}.mp4
[[ "$WHICH" == all || "$WHICH" == en ]] && render out/film/film__version-v1.1${SFX}__en.mp4 -- '--props={"locale":"en"}'
step "done ($THEME)"
ls -la out/film/film__version-v1.1*.mp4 >&2
