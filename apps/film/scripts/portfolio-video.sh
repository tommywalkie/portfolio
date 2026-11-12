#!/usr/bin/env bash
# Packages the films for the website: copies the mp4s into public/ and builds 3-rendition fMP4 HLS (VOD).
# Re-runnable; run from apps/film:  node scripts/gitbash.mjs scripts/portfolio-video.sh
# No arguments: the four films (fr/en x dark/light). Or pairs: scripts/portfolio-video.sh <mp4 name> <hls folder> ...
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FILM_DIR="$(cd "$HERE/.." && pwd)"
ROOT="$(cd "$FILM_DIR/../.." && pwd)"
SRC_DIR="$FILM_DIR/out/film"
PUBLIC="$ROOT/apps/website/public"

mkdir -p "$PUBLIC/videos"

package() {
  local src_name="$1" hls_name="$2"
  local src="$SRC_DIR/$src_name"
  local out="$PUBLIC/videos/$hls_name"
  [ -f "$src" ] || { echo "missing $src" >&2; exit 1; }

  echo "== copy $src_name"
  cp -f "$src" "$PUBLIC/$src_name"

  echo "== HLS $hls_name"
  rm -rf "$out"
  mkdir -p "$out/1080p" "$out/720p" "$out/480p"

  ffmpeg -hide_banner -loglevel warning -stats -y -i "$src" \
    -filter_complex "[0:v]split=3[a][b][c];[a]scale=1920:1080[v0];[b]scale=1280:720[v1];[c]scale=854:480[v2]" \
    -map "[v0]" -map "[v1]" -map "[v2]" -map 0:a:0 -map 0:a:0 -map 0:a:0 \
    -c:v libx264 -profile:v high -pix_fmt yuv420p -preset medium -r 60 \
    -g 120 -keyint_min 120 -sc_threshold 0 \
    -b:v:0 6000k -maxrate:v:0 6500k -bufsize:v:0 12000k \
    -b:v:1 3000k -maxrate:v:1 3300k -bufsize:v:1 6000k \
    -b:v:2 1200k -maxrate:v:2 1300k -bufsize:v:2 2400k \
    -c:a aac -b:a 128k -ac 2 -ar 48000 \
    -f hls -hls_time 4 -hls_playlist_type vod -hls_segment_type fmp4 \
    -hls_flags independent_segments \
    -hls_fmp4_init_filename init.mp4 \
    -hls_segment_filename "$out/%v/seg_%05d.m4s" \
    -master_pl_name master.m3u8 \
    -var_stream_map "v:0,a:0,name:1080p v:1,a:1,name:720p v:2,a:2,name:480p" \
    "$out/%v/index.m3u8"
}

if [ "$#" -gt 0 ]; then
  # pairs given on the command line (the CI render matrix packages one film per job)
  [ $(( $# % 2 )) -eq 0 ] || { echo "usage: portfolio-video.sh [<mp4 in out/film> <hls folder in public/videos>]..." >&2; exit 2; }
  while [ "$#" -gt 0 ]; do
    package "$1" "$2"
    shift 2
  done
else
  package "film__version-v1.1.mp4"    "film-fr-dark-desktop"
  package "film__version-v1.1__en.mp4" "film-en-dark-desktop"
  # the light builds (npm run film:v1.1:light), same 3 renditions
  package "film__version-v1.1__light.mp4"      "film-fr-light-desktop"
  package "film__version-v1.1__light__en.mp4"  "film-en-light-desktop"
fi

echo "done"
