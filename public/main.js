document.addEventListener('DOMContentLoaded', function(event) {
  const imageProxy = 'https://niklasvh-html2canvas-proxy-nodejs.glitch.me';
  const htmlProxy = 'https://rob--w-cors-anywhere-6.glitch.me';
  
  const gridEl = document.querySelector('.grid');
  const tabEls = document.querySelectorAll('nav ul li a');
  const urlEl = document.getElementById('url');
  const urlFormEl = document.getElementById('url-form');
  const sourceEl = document.getElementById('source-textarea');
  const iframeEl = document.getElementById('browser-iframe');
  const screenshotEl = document.getElementById('screenshot-div');
  const btnFreshSourceEl = document.getElementById('btnFreshSource');
  const btnFreshScreenshotEl = document.getElementById('btnFreshScreenshot');
  const btnFreshLiveViewEl = document.getElementById('btnFreshLiveView');
  const btnThemeChangeEl = document.querySelector('.buzz3');
  
  const logoEl = document.querySelector('.svg-logo');
  const btnBlinkingLightEl = document.getElementById('btnBlinkingLight');
  const guardEl = document.querySelector('.the-guard');
  const layerOneEl = document.querySelector('.layer1');
  const animateEl = document.getElementById('animate');
  
  const buzz = document.createElement('audio');
  buzz.src = 'https://res.cloudinary.com/cloudinary-composer/video/upload/v1561313151/buzz.mp3';

  let buzzTimeouts;
  let animationTimeout;
  let previousHtml = '';
  let screenshotBusy = false;
  let animationPlaying = false;

  function setSourceValue(val) {
    sourceEl.value = val;
  }
  
  function setIframeHtml(html, keepOpen) {
    iframeEl.contentWindow.document.open();
    iframeEl.contentWindow.document.innerHTML = '';
    let url = new URL(urlEl.value);
    html = html.replace('</head>', `<base href="${url.origin}"></head>`);
    iframeEl.contentWindow.document.write(html);
    if (!keepOpen) {
      iframeEl.contentWindow.document.close(); // triggers iframe onload
    }
  }
  
  function processText(fetchedHtml) {
    setSourceValue(fetchedHtml)
    setIframeHtml(fetchedHtml);
    previousHtml = fetchedHtml;
  }
  
  function fetchPage() {
    setSourceValue('');
    setIframeHtml('', true);
    screenshotEl.innerHTML = '';
    
    fetch(
      `${htmlProxy}/${urlEl.value}`,
      {
        mode: 'cors',
        cache: 'no-store',
      },
    ).then(r => {
      r.text().then(processText);
    });
  }

  function getScreenshot() {
    if (!verifyOrigin()) {
      return;
    }

    if (screenshotBusy === true) {
      alert('Already busy getting screenshot');
      return;
    }
    
    screenshotBusy = true;
    
    html2canvas(
      iframeEl.contentWindow.document.documentElement,
      {
        scale: 2,
        allowTaint: false,
        proxy: imageProxy,
        onclone: (document) => {
          let images = document.getElementsByTagName('img');
          let links = document.getElementsByTagName('link');

          function absoluteUrl(url) {
            const link = document.createElement('a');
            link.href = url;
            return link.origin + link.pathname + link.search + link.hash;
          };;

          Array.from(images).forEach((el) => {
            el.src = absoluteUrl(el.getAttribute('src'));
          });

          Array.from(links).forEach(function(el){
            el.href = absoluteUrl(el.getAttribute('href'));
          });
        },
      },
    ).then((canvas) => {
      screenshotEl.innerHTML = '';
      screenshotEl.appendChild(canvas);
    }).finally((error) => {
      screenshotBusy = false;
    });
  }
  
  function startLogoAnimation() {
    btnBlinkingLightEl.classList.remove('blink');
    btnBlinkingLightEl.classList.remove('slow-repeat');
    btnBlinkingLightEl.classList.add('color');
    guardEl.setAttribute('style', 'filter:url(#shadow)');
    layerOneEl.classList.add('paper');
    animateEl.beginElement();
    animationPlaying = true;
  }
  
  function stopLogoAnimation() {
    // btnBlinkingLight.classList.add('blink');
    btnBlinkingLightEl.classList.add('slow-repeat');
    btnBlinkingLightEl.classList.remove('color');
    guardEl.setAttribute('style', '');
    layerOneEl.classList.remove('paper');
    animateEl.beginElement();
    animationPlaying = false;
  }
  
  function buzzPlay() {
    buzz.currentTime = 0.175;
    buzz.play();
  }

  function verifyOrigin() {
    try {
      iframeEl.contentWindow['try'] = true;
      return iframeEl.contentWindow['try'];
    } catch(e) {
      alert('Cross-origin error: Please open links in a new tab and/or use the form input to navigate.');
      iframeEl.src = 'about:blank';
      return false;
    }
  }

  tabEls.forEach((el) => {
    el.addEventListener('click', (e) => {
      tabEls.forEach((elem) => {
        elem.className = ' ';
      });
      e.target.className = 'active';
      e.target.blur();
      e.preventDefault();
    });
  });
  
  btnFreshSourceEl.addEventListener('click', (event) => {
    fetchPage();
  });
  
  btnFreshScreenshotEl.addEventListener('click', (event) => {
    screenshotEl.innerHTML = '';
    getScreenshot();
  });
  
  btnFreshLiveViewEl.addEventListener('click', (event) => {
    setIframeHtml(previousHtml);
  });
  
  btnThemeChangeEl.addEventListener('click', (event) => {
    gridEl.scroll(0,0);
    startLogoAnimation();
    setTimeout(stopLogoAnimation, 3000);
    buzzPlay();
    buzzTimeouts = [
        setTimeout(buzzPlay, 1000),
        setTimeout(buzzPlay, 2000),
      ];
  });
  
  logoEl.addEventListener('click', (event) => {
    if (animationPlaying) {
      buzz.pause();
      stopLogoAnimation();
      clearTimeout(animationTimeout);
      buzzTimeouts.forEach((to) => {
        clearTimeout(to);
      });
    } else {
      buzzPlay();
      startLogoAnimation();
      animationTimeout = setTimeout(stopLogoAnimation, 1000);
    }
  });

  urlFormEl.addEventListener('submit', (event) => {
    fetchPage();
    event.preventDefault();
  }, true);
  
  fetchPage();

  iframeEl.onload = () => {
    if (verifyOrigin()) {
      setTimeout(getScreenshot, 300);
    }
  };
});

window.onbeforeunload = function() {
  return 'confirm leave onbeforeunload';
};
