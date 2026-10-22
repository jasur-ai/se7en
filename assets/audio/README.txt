THE SEVEN — audio slots
=======================

Master bed (plays on entry):
  red-sex.mp3        ← put your own licensed copy here, named exactly this.

Per-sin masters (optional; each one swaps in automatically when a sin is opened):
  01-pride.mp3
  02-envy.mp3
  03-gluttony.mp3
  04-lust.mp3
  05-wrath.mp3
  06-greed.mp3
  07-sloth.mp3

How it works
------------
* If red-sex.mp3 exists and the browser allows playback, it becomes the bed.
* If it is missing, the site falls back to a synthesised ambient bed built in
  the Web Audio API (three detuned oscillators + filtered noise), retuned per
  sin: Pride A, Envy D#, Gluttony F, Lust G, Wrath B, Greed D, Sloth C.
* Per-sin files, when present, replace the bed while that entry is open.

Licensing note
--------------
"Red Sex — Vessel" is a copyrighted recording. It is not bundled with this
build on purpose. Use a file you have the right to use.

Supported: mp3, ogg, m4a, wav (change the filenames in index.html → MUSIC).
