# Testing on a phone (real Safari engine)

`playwright`'s WebKit build expects Ubuntu-20.04-era libraries. The sandbox is
Debian 13, so `webkit.launch()` fails with *"Host system is missing dependencies"*.
This is the full recipe that made it run — needed again after any container reset
(the browser cache and `/usr/local/lib` are **not** part of the workspace snapshot).

```bash
# 1 · system libs
sudo apt-get install -y libgtk-3-0t64 libgdk-pixbuf-2.0-0 libepoxy0 libwoff1 \
  libopus0 libwebpdemux2 libenchant-2-2 libhyphen0 libgstreamer1.0-0 \
  libgstreamer-plugins-base1.0-0 libharfbuzz-icu0 libmanette-0.2-0 libvpx9 \
  libx264-164 libjpeg62-turbo libsecret-1-0 libflite1 libjson-glib-1.0-0

# 2 · the four old libraries WebKit still links against (Ubuntu focal debs)
cd /tmp && curl -sfLO http://archive.ubuntu.com/ubuntu/pool/main/i/icu/libicu66_66.1-2ubuntu2.1_amd64.deb
curl -sfLO http://archive.ubuntu.com/ubuntu/pool/main/libj/libjpeg-turbo/libjpeg-turbo8_2.1.5-2ubuntu2_amd64.deb
curl -sfLO http://archive.ubuntu.com/ubuntu/pool/main/libw/libwebp/libwebp6_0.6.1-2ubuntu0.20.04.3_amd64.deb
curl -sfLO http://archive.ubuntu.com/ubuntu/pool/main/p/pcre3/libpcre3_8.39-12build1_amd64.deb
curl -sfLO http://archive.ubuntu.com/ubuntu/pool/main/libf/libffi/libffi7_3.3-4_amd64.deb
mkdir -p wklib && for d in libicu66_*.deb libjpeg-turbo8_*.deb libwebp6_*.deb libpcre3_*.deb libffi7_*.deb; do dpkg-deb -x $d wklib; done
sudo cp -a wklib/usr/lib/x86_64-linux-gnu/*.so* /usr/local/lib/ && sudo cp -a wklib/lib/x86_64-linux-gnu/* /usr/local/lib/ && sudo ldconfig

# 3 · the bundled glib is 2.72, the system libgudev wants 2.80 — give the bundle
#     the focal libgudev, and let Mesa use the system libwayland
W=~/.cache/ms-playwright/webkit-*/minibrowser-wpe/sys/lib
curl -sfLO http://archive.ubuntu.com/ubuntu/pool/main/libg/libgudev/libgudev-1.0-0_233-1_amd64.deb
dpkg-deb -x libgudev-1.0-0_233-1_amd64.deb gu && cp gu/usr/lib/x86_64-linux-gnu/libgudev-1.0.so.0* $W/
mkdir -p /tmp/wbak && mv $W/libwayland-client.so.0* $W/libwayland-egl.so.1* /tmp/wbak/

# 4 · verify
node -e "require('playwright').webkit.launch().then(b=>{console.log('WEBKIT OK');b.close()})"
```

Then:

```bash
python3 -m http.server 8099 --bind 0.0.0.0 &       # serve the workspace
node _lab/_phone.js http://127.0.0.1:8099/index.html?intro=0
```

## What this engine told us (and Chromium could not)

* Nothing throws in Safari. All the same code runs: canvas `filter`, `dvh`,
  `roundRect`, `IntersectionObserver`, `getUserMedia` — no feature gaps.
* Headless WPE renders at **~1 fps** (no GPU), so timing measurements from it are
  meaningless; geometry and event handling are not. Measure layout and taps here,
  measure speed in Chromium.
* `mouse.wheel()` is not supported in mobile WebKit — drive scrolling with
  `window.scrollTo()` or touch gestures.
