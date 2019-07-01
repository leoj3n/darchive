document.addEventListener('DOMContentLoaded', function(event) {
  const imageProxy = 'https://niklasvh-html2canvas-proxy-nodejs.glitch.me';
  const htmlProxy = 'https://rob--w-cors-anywhere-6.glitch.me';
  
  const gridEl = document.querySelector('.grid');
  const tabEls = document.querySelectorAll('nav ul li a');
  const urlEl = document.getElementById('url');
  const sourceEl = document.getElementById('source-textarea');
  const iframeEl = document.getElementById('browser-iframe');
  const iframeDoc = iframeEl.contentWindow.document;
  const screenshotEl = document.getElementById('screenshot-div');
  const btnFreshSourceEl = document.getElementById('btnFreshSource');
  const btnFreshScreenshotEl = document.getElementById('btnFreshScreenshot');
  const btnFreshLiveViewEl = document.getElementById('btnFreshLiveView');
  const btnThemeChangeEl = document.querySelector('.buzz3');
  
  const logoEl = document.querySelector('.svg-logo');
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
  
  function setIframeHtml(html) {
    iframeDoc.open();
    iframeDoc.innerHTML = '';
    iframeDoc.write(html);
    iframeDoc.close(); // triggers iframe onload
  }
  
  function processText(fetchedHtml) {
    setSourceValue(fetchedHtml)
    setIframeHtml(fetchedHtml);
    previousHtml = fetchedHtml;
  }
  
  function fetchPage() {
    setIframeHtml('');
    setSourceValue('');
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
    if (screenshotBusy === true) {
      alert('Already busy getting screenshot');
      return;
    }
    
    screenshotBusy = true;
    
    html2canvas(
      iframeEl.contentWindow.document.body,
      {
        scale: 2,
        allowTaint: false,
        proxy: imageProxy,
      },
    ).then(function(canvas) {
      screenshotEl.innerHTML = '';
      screenshotEl.appendChild(canvas);
    }).finally(function(error) {
      screenshotBusy = false;
    });
  }
  
  function startLogoAnimation() {
    btnBlinkingLight.classList.remove('blink');
    btnBlinkingLight.classList.remove('slow-repeat');
    btnBlinkingLight.classList.add('color');
    guardEl.setAttribute('style', 'filter:url(#shadow)');
    layerOneEl.classList.add('paper');
    animateEl.beginElement();
    animationPlaying = true;
  }
  
  function stopLogoAnimation() {
    // btnBlinkingLight.classList.add('blink');
    btnBlinkingLight.classList.add('slow-repeat');
    btnBlinkingLight.classList.remove('color');
    guardEl.setAttribute('style', '');
    layerOneEl.classList.remove('paper');
    animateEl.beginElement();
    animationPlaying = false;
  }
  
  function buzzPlay() {
    buzz.currentTime = 0.175;
    buzz.play();
  }
  
  tabEls.forEach((el) => {
    el.addEventListener('click', (e) => {
      tabEls.forEach((elem) => {
        elem.className = ' ';
      });
      console.log(e);
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

  urlEl.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      fetchPage();
    }
  });
  
  // fetchPage();

  iframeEl.onload = () => {
    setTimeout(getScreenshot, 300);
  };
});