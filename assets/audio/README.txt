THE SEVEN — score
=================

Four self-hosted ambient recordings. No YouTube embed, no third-party player,
no network request for audio: the files ship with the site and are crossfaded
by the small <audio> engine in _src/06_music.js.

  deep.mp3               "Deep" — Alex-Productions              CC BY 3.0
  zero-point.mp3         "Zero Point" — Dreamstate Logic        CC BY 3.0
  freezing-fog.mp3       "Lost in the Freezing Fog"
                         — Fingers In The Noise                CC BY 3.0
  alien-atmosphere.mp3   "Alien Spaceship Atmosphere"
                         — Kevin MacLeod (incompetech)         CC0 1.0

Playback order
--------------
Deep → Zero Point → Lost in the Freezing Fog → Alien Spaceship Atmosphere → repeat.
Playback starts only after the visitor presses ENTER on the landing veil (that
is the gesture browsers require). Prev / next in the dock skip tracks, the
equaliser button mutes, the slider sets volume, and the choice is remembered
in localStorage ("se7en:snd").

Mastering
---------
Loudness-normalised with ffmpeg to about −19 LUFS integrated, 80 kbps mono/
stereo MP3, so browsing does not burn through a mobile data plan.

Licensing
---------
CC BY 3.0 requires attribution; it is rendered twice in the page — in the
footer block (#musicCredits) and in the dock (#dockCredit, "CC ↗" links to the
Wikimedia Commons file page). CC0 requires nothing but is credited anyway.

Source files (Wikimedia Commons):
  https://commons.wikimedia.org/wiki/File:Alex-Productions_-_Deep_(Dark_Ambient_Background_music).oga
  https://commons.wikimedia.org/wiki/File:Dreamstate_Logic_-_Zero_Point_(space_ambient,_dark_ambient).ogg
  https://commons.wikimedia.org/wiki/File:Fingers_In_The_Noise_-_Lost_in_the_Freezing_Fog.ogg
  https://commons.wikimedia.org/wiki/File:Kevin_MacLeod_-_Alien_Spaceship_Atmosphere_(cc0).ogg

To swap a track, replace the file, keep the name, and update TRACKS in
_src/06_music.js (title, author, licence, link) — then run `bash build.sh`.
