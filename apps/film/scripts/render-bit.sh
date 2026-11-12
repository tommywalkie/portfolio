#!/usr/bin/env bash
# render-bit.sh: render one story bit for one or more seeds.
#
#   pnpm run bit <slug> [--seeds 1,2,3] [--locale fr|en] [--master]
#
#   pnpm run bit casio-course                       seed 1, French
#   pnpm run bit casio-course --seeds 1,2,3
#   pnpm run bit rugby --locale en
#   pnpm run bit casio-course --master              a sharp CRF 14 master instead of a preview
#   pnpm run bit casio-course --device mobile       the portrait bit (src/bits/mobile), files get __mobile
#
# Output: out/bits/<slug>/<slug>__seed-<n>.mp4 (silent preview, CRF 20, BT.709). --locale en adds __en (same timing
# as French). The seed and the locale go to Remotion as input props, through a small JSON file in tmp/ at the
# repository root (git-ignored). Run through scripts/gitbash.mjs, so it works from cmd, PowerShell and Git Bash.
set -euo pipefail
cd "$(dirname "$0")/.."

SLUG=""
SEEDS="1"
LOCALE="fr"
MODE="--preview"
DEVICE="desktop"
while [[ $# -gt 0 ]]; do
  case "$1" in
    --seeds) SEEDS=${2:?--seeds wants a list like 1,2,3}; shift ;;
    --locale) LOCALE=${2:?--locale wants fr or en}; shift ;;
    --master) MODE="" ;;
    --device) DEVICE=${2:?--device wants desktop or mobile}; shift ;;
    -*) echo "render-bit: unknown option '$1' (see the header of scripts/render-bit.sh)" >&2; exit 2 ;;
    *) [[ -z "$SLUG" ]] && SLUG=$1 || { echo "render-bit: one slug only (got '$SLUG' and '$1')" >&2; exit 2; } ;;
  esac
  shift
done
[[ -n "$SLUG" ]] || { echo "usage: pnpm run bit <slug> [--seeds 1,2,3] [--locale fr|en] [--master]" >&2; exit 2; }
[[ "$LOCALE" == fr || "$LOCALE" == en ]] || { echo "render-bit: --locale must be fr or en, got '$LOCALE'" >&2; exit 2; }
[[ "$SEEDS" =~ ^[0-9]+(,[0-9]+)*$ ]] || { echo "render-bit: --seeds must be numbers separated by commas, got '$SEEDS'" >&2; exit 2; }

[[ "$DEVICE" == desktop || "$DEVICE" == mobile ]] || { echo "render-bit: --device must be desktop or mobile, got '$DEVICE'" >&2; exit 2; }
SFX=""
[[ "$LOCALE" == en ]] && SFX="__en"
[[ "$DEVICE" == mobile ]] && SFX="${SFX}__mobile"

PROPS_DIR=../../tmp/render-bit
mkdir -p "$PROPS_DIR" "out/bits/$SLUG"

IFS=',' read -ra SEED_LIST <<< "$SEEDS"
for seed in "${SEED_LIST[@]}"; do
  TAG="seed-${seed}"
  PROPS="$PROPS_DIR/${SLUG}-${TAG}${SFX}.json"
  OUT="out/bits/$SLUG/${SLUG}__${TAG}${SFX}.mp4"
  printf '{"seed":%s,"locale":"%s"}' "$seed" "$LOCALE" > "$PROPS"
  echo "render-bit: $SLUG seed $seed -> $OUT" >&2
  bash scripts/render.sh "Bit-$SLUG" "$OUT" $MODE --device "$DEVICE" --no-audio -- "--props=$PROPS"
  [[ -s "$OUT" ]] || { echo "render-bit: NOT WRITTEN: $OUT" >&2; exit 1; }
done
echo "render-bit: done -> out/bits/$SLUG" >&2
