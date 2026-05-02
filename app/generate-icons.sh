#!/bin/bash
# Génère les icônes iOS et Android depuis resources/icon.png
set -e

SRC="resources/icon.png"

if [ ! -f "$SRC" ]; then
  echo "Erreur : $SRC introuvable"
  exit 1
fi

IMG="magick"
if ! command -v magick &>/dev/null; then
  IMG="convert"
fi

# --- iOS ---
if [ -d "ios/App/App/Assets.xcassets/AppIcon.appiconset" ]; then
  ICONSET="ios/App/App/Assets.xcassets/AppIcon.appiconset"
  $IMG "$SRC" -resize 40x40    "$ICONSET/AppIcon-20@2x.png"
  $IMG "$SRC" -resize 60x60    "$ICONSET/AppIcon-20@3x.png"
  $IMG "$SRC" -resize 58x58    "$ICONSET/AppIcon-29@2x.png"
  $IMG "$SRC" -resize 87x87    "$ICONSET/AppIcon-29@3x.png"
  $IMG "$SRC" -resize 80x80    "$ICONSET/AppIcon-40@2x.png"
  $IMG "$SRC" -resize 120x120  "$ICONSET/AppIcon-40@3x.png"
  $IMG "$SRC" -resize 120x120  "$ICONSET/AppIcon-60@2x.png"
  $IMG "$SRC" -resize 180x180  "$ICONSET/AppIcon-60@3x.png"
  $IMG "$SRC" -resize 152x152  "$ICONSET/AppIcon-76@2x.png"
  $IMG "$SRC" -resize 167x167  "$ICONSET/AppIcon-83.5@2x.png"
  $IMG "$SRC" -resize 1024x1024 "$ICONSET/AppIcon-1024@1x.png"
  echo "✓ Icônes iOS générées"
else
  echo "⚠ ios/ non trouvé — lance d'abord : npx cap add ios"
fi

# --- Android ---
if [ -d "android/app/src/main/res" ]; then
  declare -A SIZES=(
    [mipmap-mdpi]=48
    [mipmap-hdpi]=72
    [mipmap-xhdpi]=96
    [mipmap-xxhdpi]=144
    [mipmap-xxxhdpi]=192
  )
  for FOLDER in "${!SIZES[@]}"; do
    SIZE=${SIZES[$FOLDER]}
    DIR="android/app/src/main/res/$FOLDER"
    $IMG "$SRC" -resize ${SIZE}x${SIZE} "$DIR/ic_launcher.png"
    $IMG "$SRC" -resize ${SIZE}x${SIZE} "$DIR/ic_launcher_round.png"
    # Foreground icône adaptative : canvas 108dp (SIZE*9/4), contenu dans la safe zone 72dp (SIZE*3/2)
    ADAPTIVE_SIZE=$(( SIZE * 9 / 4 ))
    CONTENT_SIZE=$(( SIZE * 3 / 2 ))
    $IMG "$SRC" -resize ${CONTENT_SIZE}x${CONTENT_SIZE} \
      -gravity center -background none \
      -extent ${ADAPTIVE_SIZE}x${ADAPTIVE_SIZE} \
      "$DIR/ic_launcher_foreground.png"
  done
  echo "✓ Icônes Android générées"
else
  echo "⚠ android/ non trouvé — lance d'abord : npx cap add android && npx cap sync android"
fi
