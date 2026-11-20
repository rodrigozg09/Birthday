/* ARCHIVE ZERO — four independent mobile-first evidence nodes. */
(() => {
  'use strict';
  const nodeId = document.body.dataset.node;
  if (!['001','002','003','004'].includes(nodeId)) return;

  const $ = (id) => document.getElementById(id);
  const els = {
    title:$('node-title'), subtitle:$('node-subtitle'), classification:$('node-classification'),
    init:$('initialize-button'), intro:$('system-intro'), meter:$('boot-meter-fill'), bootStatus:$('boot-status'),
    challenge:$('challenge-area'), challengeTag:$('challenge-tag'), challengeTitle:$('challenge-title'),
    challengeCopy:$('challenge-copy'), content:$('challenge-content'), hintButton:$('hint-button'), hintText:$('hint-text'),
    evidence:$('evidence-area'), evidenceTitle:$('evidence-title'), evidenceCopy:$('evidence-copy'),
    evidenceNumber:$('evidence-number'), evidenceImage:$('evidence-image'), evidenceCaption:$('evidence-caption'),
    nextClue:$('next-clue'), transmission:$('transmission-box'), finalMessage:$('final-message'),
    audioNote:$('audio-note-text'), soundToggle:$('sound-toggle'), toast:$('toast'), connection:$('connection-label')
  };

  const CONFIG = {
    '001': {
      title:'INITIAL CONTACT', subtitle:'An encrypted fragment is waiting for an operator.', classification:'CIPHER ACCESS',
      tag:'CIPHER AUTHENTICATION', challengeTitle:'RECOVER THE ORIGINAL MESSAGE',
      copy:'La secuencia fue alterada durante la transmisión. Cada letra avanzó exactamente una posición en el alfabeto. Corrige el desplazamiento y recupera la palabra original.',
      hint:'No necesitas cambiar el orden de las letras. Para deshacer el cifrado, retrocede cada carácter una posición: F vuelve a E, T vuelve a S...',
      photo:'assets/foto-001.jpeg', caption:'RECOVERED IMAGE // 001', theme:'medieval',
      evidenceTitle:'MEMORY FOUND // 001', evidenceCopy:'EVIDENCE RECOVERED. El primer registro ha sido restaurado. Busca su equivalente en el archivo físico.',
      clue:'Hay una noche que nunca termina, aunque el día haya comenzado. Sus estrellas giran alrededor de un guardián silencioso, atrapado para siempre en un lienzo. Busca donde descansa ese guardián.'
    },
    '002': {
      title:'LOST COORDINATES', subtitle:'A silent signal is waiting to be reactivated.', classification:'MOTION ACCESS',
      tag:'MOTION AUTHORIZATION REQUIRED', challengeTitle:'WAKE THE DORMANT SIGNAL',
      copy:'Este archivo no responde a palabras ni contraseñas. La autorización debe provenir del propio dispositivo. Activa el sensor y completa tres movimientos firmes para estabilizar la señal.',
      hint:'No hace falta agitar el teléfono con fuerza. Sosténlo con seguridad y haz tres movimientos cortos y claros. Si tu navegador no admite el sensor, utiliza el modo de calibración manual.',
      photo:'assets/foto-002.jpeg', caption:'RECOVERED IMAGE // 002', theme:'playful',
      evidenceTitle:'COORDINATES RESTORED // 002', evidenceCopy:'La señal ha sido estabilizada. Un segundo recuerdo ha sido recuperado del archivo.',
      clue:'El siguiente mensaje fue enviado en papel. Sus palabras pueden leerse, pero el acceso permanece protegido por una antigua marca que certifica que nadie ha roto el cierre. No busques entre las palabras. Busca aquello que las mantiene selladas.'
    },
    '003': {
      title:'ENCRYPTED CORRESPONDENCE', subtitle:'A damaged circuit is blocking the recovered correspondence.', classification:'CIRCUIT ACCESS',
      tag:'SYSTEM RESTORATION REQUIRED', challengeTitle:'RECONNECT THE MEMORY CIRCUITS',
      copy:'Cuatro conexiones se perdieron durante el traslado del archivo. Selecciona un puerto del lado izquierdo y después su pareja del lado derecho. Conecta los cuatro circuitos para recuperar la transmisión.',
      hint:'Cada conexión tiene un color. Toca primero un puerto de salida y después el puerto del mismo color al otro lado. No importa el orden.',
      photo:'assets/foto-003.jpeg', caption:'RECOVERED IMAGE // 003', theme:'majestic',
      evidenceTitle:'CORRESPONDENCE RESTORED // 003', evidenceCopy:'La transmisión ha sido reconstruida. Una ubicación que alguna vez fue un destino soñado vuelve a aparecer en los registros.',
      clue:'El último registro no está encerrado en un marco ni protegido por un sello. Hay algo que se entrega sin palabras, que florece y guarda su belleza por un tiempo. Busca entre sus pétalos: allí descansa la última señal del archivo.'
    },
    '004': {
      title:'FINAL MEMORY', subtitle:'The final record requires an authorization from the original source.', classification:'FINAL AUTHORIZATION',
      tag:'MEMORY SEQUENCE REQUIRED', challengeTitle:'RESTORE THE ORIGINAL MEMORY',
      copy:'El último archivo está protegido por una secuencia de memoria. Observa el orden de los símbolos y repítelo. Después, responde la pregunta que abrió esta historia.',
      hint:'Primero memoriza la secuencia de cinco símbolos. No necesitas velocidad: puedes esperar a que termine y tocar los botones en el mismo orden.',
      photo:'assets/foto-004.jpeg', caption:'ORIGINAL MEMORY // 004', theme:'romantic',
      evidenceTitle:'ORIGINAL MEMORY RECOVERED', evidenceCopy:'La última imagen ha sido restaurada. El archivo que parecía perdido nunca dejó de formar parte de la historia.',
      clue:''
    }
  };

  const cfg = CONFIG[nodeId];
  let hintsUsed = 0;
  let recovered = false;
  let toastTimer = null;
  const recoveryKey = `archive-zero-node-${nodeId}-recovered`;

  document.documentElement.style.setProperty('--node-id', nodeId);
  els.title.textContent = cfg.title;
  els.subtitle.textContent = cfg.subtitle;
  els.classification.textContent = cfg.classification;
  document.title = `ARCHIVE ZERO // ${nodeId} ${cfg.title}`;

  function notify(message) {
    els.toast.textContent = message;
    els.toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => els.toast.classList.remove('show'), 2300);
  }
  function sound(name) { if (window.ArchiveAudio) window.ArchiveAudio.sfx(name); }
  function showChallenge() {
    els.intro.classList.add('hidden');
    els.evidence.classList.add('hidden');
    els.challenge.classList.remove('hidden');
    els.challengeTag.textContent = cfg.tag;
    els.challengeTitle.textContent = cfg.challengeTitle;
    els.challengeCopy.textContent = cfg.copy;
    renderChallenge();
  }
  function startSystem() {
    if (window.ArchiveAudio) window.ArchiveAudio.start();
    sound('scan');
    els.init.disabled = true;
    els.init.textContent = 'ESTABLISHING CONNECTION...';
    els.bootStatus.textContent = 'AUTHENTICATING OPERATOR';
    els.meter.style.width = '100%';
    els.connection.textContent = 'SECURE CONNECTION';
    setTimeout(() => {
      if (localStorage.getItem(recoveryKey) === '1') {
        showRecovered(true);
        notify('PREVIOUSLY RECOVERED RECORD RESTORED');
      } else {
        showChallenge();
        if (nodeId === '004') beginMemorySequence();
      }
    }, 850);
  }
  els.init.addEventListener('click', startSystem);

  if (els.soundToggle) {
    els.soundToggle.addEventListener('click', () => {
      const muted = window.ArchiveAudio ? window.ArchiveAudio.mute(!window.ArchiveAudio.muted) : false;
      els.soundToggle.innerHTML = muted ? '♫ <span>SILENCIO</span>' : '♫ <span>SONIDO</span>';
      notify(muted ? 'AUDIO MUTED' : 'AUDIO ENABLED');
    });
  }

  els.hintButton.addEventListener('click', () => {
    hintsUsed++;
    els.hintText.textContent = cfg.hint;
    els.hintText.classList.remove('hidden');
    sound('click');
    if (hintsUsed > 1) notify('HINT ALREADY DECLASSIFIED');
  });

  function showRecovered(fromStorage=false) {
    if (recovered) return;
    recovered = true;
    localStorage.setItem(recoveryKey, '1');
    els.challenge.classList.add('hidden');
    els.intro.classList.add('hidden');
    els.evidence.classList.remove('hidden');
    els.evidenceTitle.textContent = cfg.evidenceTitle;
    els.evidenceCopy.textContent = cfg.evidenceCopy;
    els.evidenceNumber.textContent = `FILE ${nodeId} / 004`;

    // Node 002 gets a short visual decryption: the recovered photo starts blurred
    // and resolves only after the shake sequence has been completed.
    const evidenceFrame = els.evidenceImage.closest('.evidence-frame');
    evidenceFrame.classList.remove('shake-decrypt', 'is-revealed');
    els.evidenceImage.onload = null;
    if (nodeId === '002' && !fromStorage) {
      evidenceFrame.classList.add('shake-decrypt');
      els.evidenceImage.onload = () => {
        window.requestAnimationFrame(() => {
          window.setTimeout(() => evidenceFrame.classList.add('is-revealed'), 1100);
        });
      };
    }

    // Prefer the user's real JPEG. If it has not been uploaded yet, show the SVG placeholder.
    els.evidenceImage.onerror = () => {
      els.evidenceImage.onerror = null;
      els.evidenceImage.src = `assets/evidence-${nodeId}.svg`;
    };
    els.evidenceImage.src = cfg.photo;
    els.evidenceCaption.textContent = cfg.caption;
    if (nodeId === '004') {
      els.transmission.classList.add('hidden');
      els.finalMessage.classList.remove('hidden');
    } else {
      els.nextClue.textContent = cfg.clue;
      els.transmission.classList.remove('hidden');
      els.finalMessage.classList.add('hidden');
    }
    els.audioNote.textContent = fromStorage ? 'MEMORY SOUNDTRACK READY' : 'MEMORY SOUNDTRACK LOADED';
    if (window.ArchiveAudio) {
      const playMemoryAudio = () => {
        window.ArchiveAudio.playTrack(cfg.theme);
        if (!fromStorage) window.ArchiveAudio.sfx('unlock');
      };
      if (nodeId === '002' && !fromStorage) window.setTimeout(playMemoryAudio, 1450);
      else playMemoryAudio();
    }
    els.connection.textContent = 'EVIDENCE RECOVERED';
    window.scrollTo({top:0,behavior:'smooth'});
  }

  function normalizeAnswer(value) {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/gi,'').toUpperCase();
  }

  function renderChallenge() {
    if (nodeId === '001') renderCipher();
    if (nodeId === '002') renderMotion();
    if (nodeId === '003') renderCircuits();
    if (nodeId === '004') renderMemoryGame();
  }

  function renderCipher() {
    els.content.innerHTML = `
      <div class="puzzle-card">
        <p class="puzzle-label">INTERCEPTED STRING // CAESAR SHIFT +1</p>
        <div class="cipher-string" aria-label="Texto cifrado">FTUBOEBSUF</div>
        <p class="puzzle-hint">El mensaje original fue desplazado una posición hacia adelante. Deshaz la operación para recuperar la palabra.</p>
      </div>
      <label class="field-label" for="cipher-answer">DECRYPTION KEY</label>
      <input class="text-input" id="cipher-answer" type="text" autocomplete="off" autocapitalize="characters" placeholder="ENTER RECOVERED WORD" maxlength="30">
      <div class="button-row"><button class="action-button" id="cipher-submit" type="button">AUTHENTICATE →</button></div>
      <p class="feedback" id="cipher-feedback" aria-live="polite"></p>`;
    const input = $('cipher-answer');
    const submit = () => {
      if (normalizeAnswer(input.value) === 'ESTANDARTE') {
        $('cipher-feedback').textContent = 'ACCESS GRANTED — ORIGINAL MESSAGE RESTORED';
        $('cipher-feedback').classList.add('ok');
        sound('confirm');
        setTimeout(() => showRecovered(), 550);
      } else {
        $('cipher-feedback').textContent = 'ACCESS DENIED — VERIFY THE SHIFT DIRECTION';
        sound('error');
      }
    };
    $('cipher-submit').addEventListener('click', submit);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
    input.focus({preventScroll:true});
  }

  function renderMotion() {
    els.content.innerHTML = `
      <div class="puzzle-card motion-card">
        <p class="puzzle-label">MOTION SENSOR // LIVE CALIBRATION</p>
        <div class="motion-orb" id="motion-orb"><span class="phone-glyph">▯</span><span class="motion-radar" aria-hidden="true"></span></div>
        <div class="motion-count"><span id="shake-count">0</span> <span class="motion-count-total">/ 3</span></div>
        <p class="motion-status" id="motion-status">SENSOR STANDBY</p>
        <div class="shake-progress" aria-label="Progreso de tres movimientos"><i></i><i></i><i></i></div>
        <p class="shake-instruction">SACUDE EL TELÉFONO TRES VECES</p>
        <p class="shake-subinstruction">Movimientos cortos y separados. No necesitas agitarlo con fuerza.</p>
      </div>
      <div class="button-row motion-actions"><button class="action-button" id="motion-enable" type="button">ACTIVATE MOTION SENSOR</button><button class="action-button secondary" id="motion-manual" type="button">USE MANUAL MODE</button></div>
      <p class="feedback" id="motion-feedback" aria-live="polite"></p>
      <p class="wire-note">Pulsa ACTIVATE y concede permiso si tu navegador lo solicita. Cuando registres tres movimientos, el archivo visual se descifrará. El modo manual está disponible si el sensor no funciona.</p>`;

    let count = 0;
    let lastShake = 0;
    let previous = null;
    let listening = false;
    let eventWatchdog = null;
    let sensorSamples = 0;
    const countEl = $('shake-count');
    const status = $('motion-status');
    const feedback = $('motion-feedback');
    const orb = $('motion-orb');
    const progressBars = [...document.querySelectorAll('.shake-progress i')];
    const enableButton = $('motion-enable');
    const manualButton = $('motion-manual');

    const updateCount = () => {
      countEl.textContent = String(count);
      progressBars.forEach((bar, index) => bar.classList.toggle('complete', index < count));
    };

    const stopListening = () => {
      if (listening) window.removeEventListener('devicemotion', onMotion);
      listening = false;
      if (eventWatchdog) window.clearTimeout(eventWatchdog);
      enableButton.disabled = false;
    };

    const registerShake = (source='sensor') => {
      const now = Date.now();
      if (now - lastShake < 720 || recovered || count >= 3) return;
      lastShake = now;
      count = Math.min(3, count + 1);
      updateCount();
      orb.classList.remove('shake-ready');
      void orb.offsetWidth;
      orb.classList.add('shake-ready');
      status.textContent = count < 3 ? 'MOVEMENT DETECTED // SIGNAL RISING' : 'SIGNAL STABILIZED';
      feedback.textContent = `MOVEMENT REGISTERED // ${count} OF 3`;
      feedback.classList.add('ok');
      sound('pulse');
      if (navigator.vibrate) navigator.vibrate(35);

      if (count >= 3) {
        status.textContent = 'VISUAL RECORD DECRYPTING';
        feedback.textContent = 'THREE MOVEMENTS VERIFIED — RECOVERING IMAGE';
        stopListening();
        sound('confirm');
        window.setTimeout(() => showRecovered(), 550);
      }
    };

    const onMotion = event => {
      const linear = event.acceleration;
      const gravity = event.accelerationIncludingGravity;
      let sample = linear;
      let usingGravity = false;

      // Some mobile browsers expose accelerationIncludingGravity only.
      if (!sample || sample.x == null || sample.y == null || sample.z == null ||
          (Math.abs(sample.x) + Math.abs(sample.y) + Math.abs(sample.z) < 0.2)) {
        sample = gravity;
        usingGravity = true;
      }
      if (!sample || sample.x == null || sample.y == null || sample.z == null) return;
      sensorSamples++;

      const vector = {x:Number(sample.x) || 0, y:Number(sample.y) || 0, z:Number(sample.z) || 0};
      const magnitude = Math.hypot(vector.x, vector.y, vector.z);
      let impulse = magnitude;
      if (previous) {
        const delta = Math.hypot(vector.x-previous.x, vector.y-previous.y, vector.z-previous.z);
        impulse = usingGravity ? delta : Math.max(magnitude, delta * 0.72);
      }
      previous = vector;

      // Require a deliberate movement peak; the cooldown prevents one long shake
      // from filling all three positions at once.
      const threshold = usingGravity ? 13.0 : 11.5;
      if (impulse >= threshold) registerShake('sensor');
    };

    enableButton.addEventListener('click', async () => {
      feedback.classList.remove('ok');
      feedback.textContent = '';
      enableButton.disabled = true;
      try {
        if (!window.isSecureContext) throw new Error('insecure');
        if (!('DeviceMotionEvent' in window)) throw new Error('unsupported');
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
          const permission = await DeviceMotionEvent.requestPermission();
          if (permission !== 'granted') throw new Error('denied');
        }
        window.addEventListener('devicemotion', onMotion, {passive:true});
        listening = true;
        status.textContent = 'SENSOR ACTIVE — SHAKE 3 TIMES';
        feedback.textContent = 'MOTION SENSOR CONNECTED — READY';
        feedback.classList.add('ok');
        sound('confirm');
        eventWatchdog = window.setTimeout(() => {
          if (listening && sensorSamples === 0) {
            stopListening();
            feedback.textContent = 'NO SENSOR DATA RECEIVED — TRY MANUAL MODE OR CHECK BROWSER PERMISSIONS';
            status.textContent = 'SENSOR SIGNAL NOT DETECTED';
            feedback.classList.remove('ok');
            enableButton.disabled = false;
          }
        }, 3500);
      } catch (error) {
        enableButton.disabled = false;
        const messages = {
          denied:'SENSOR PERMISSION NOT GRANTED — USE MANUAL MODE',
          insecure:'HTTPS REQUIRED — OPEN THE GITHUB PAGES LINK',
          unsupported:'MOTION SENSOR NOT SUPPORTED — USE MANUAL MODE'
        };
        feedback.textContent = messages[error.message] || 'SENSOR UNAVAILABLE — USE MANUAL MODE';
        status.textContent = 'MANUAL MODE AVAILABLE';
        sound('error');
      }
    });

    manualButton.addEventListener('click', () => {
      registerShake('manual');
      status.textContent = count < 3 ? `MANUAL CALIBRATION // ${count} OF 3` : 'VISUAL RECORD DECRYPTING';
      if (count < 3) feedback.textContent = `MANUAL MOVEMENT REGISTERED // ${count} OF 3`;
    });

    // Avoid leaving a sensor listener active if the page is sent to the background.
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopListening();
    }, {once:true});
  }

  function renderCircuits() {
    const colors = {
      red:'#ff6868', blue:'#67caff', yellow:'#f2cd62', green:'#69db98'
    };
    const left = ['red','blue','yellow','green'];
    const right = ['green','red','yellow','blue'];
    const leftLabels = ['PORT A','PORT B','PORT C','PORT D'];
    const rightLabels = ['PORT W','PORT X','PORT Y','PORT Z'];
    let selected = null;
    const matches = new Set();
    els.content.innerHTML = `
      <div class="puzzle-card">
        <p class="puzzle-label">POWER GRID // FOUR CONNECTIONS LOST</p>
        <div class="wire-progress" id="wire-progress">CONNECTIONS RESTORED: 0 / 4</div>
        <p class="wire-note">Toca un puerto de salida y después conecta el puerto del mismo color al otro lado.</p>
        <div class="circuit-board" id="circuit-board">
          <svg class="wire-svg" id="wire-svg" viewBox="0 0 600 284" preserveAspectRatio="none" aria-hidden="true"></svg>
          <div id="wire-left"></div><div id="wire-right"></div>
        </div>
        <p class="wire-note" id="wire-instruction" aria-live="polite">SELECT AN OUTPUT PORT TO BEGIN</p>
      </div>
      <p class="feedback" id="wire-feedback" aria-live="polite"></p>`;
    const leftWrap = $('wire-left');
    const rightWrap = $('wire-right');
    left.forEach((color,i) => {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'wire-node left'; button.dataset.color = color;
      button.style.top = `${14 + i*65}px`;
      button.innerHTML = `<span class="wire-port" style="--wire-color:${colors[color]}"></span><span>${leftLabels[i]}</span>`;
      button.addEventListener('click', () => chooseLeft(color, button));
      leftWrap.appendChild(button);
    });
    right.forEach((color,i) => {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'wire-node right'; button.dataset.color = color;
      button.style.top = `${14 + i*65}px`;
      button.innerHTML = `<span>${rightLabels[i]}</span><span class="wire-port" style="--wire-color:${colors[color]}"></span>`;
      button.addEventListener('click', () => chooseRight(color, button));
      rightWrap.appendChild(button);
    });
    function chooseLeft(color, button) {
      if (matches.has(color)) return;
      selected = color;
      document.querySelectorAll('.wire-node.left').forEach(b => b.classList.remove('selected'));
      button.classList.add('selected');
      $('wire-instruction').textContent = `OUTPUT SELECTED // CONNECT ${leftLabels[left.indexOf(color)]}`;
      sound('click');
    }
    function drawConnection(color) {
      const leftIndex = left.indexOf(color);
      const rightIndex = right.indexOf(color);
      const y1 = 14 + leftIndex*65 + 23;
      const y2 = 14 + rightIndex*65 + 23;
      const path = document.createElementNS('http://www.w3.org/2000/svg','path');
      path.setAttribute('d',`M 125 ${y1} C 230 ${y1}, 370 ${y2}, 475 ${y2}`);
      path.setAttribute('stroke',colors[color]); path.setAttribute('class','wire-line'); path.style.color = colors[color];
      $('wire-svg').appendChild(path);
    }
    function chooseRight(color, button) {
      if (!selected) { $('wire-instruction').textContent = 'SELECT AN OUTPUT PORT FIRST'; sound('error'); return; }
      if (matches.has(color)) return;
      if (selected === color) {
        matches.add(color); button.classList.add('matched');
        const leftButton = document.querySelector(`.wire-node.left[data-color="${color}"]`);
        leftButton.classList.remove('selected'); leftButton.classList.add('matched');
        drawConnection(color);
        selected = null;
        $('wire-progress').textContent = `CONNECTIONS RESTORED: ${matches.size} / 4`;
        $('wire-instruction').textContent = matches.size === 4 ? 'POWER GRID RESTORED' : 'CONNECTION ACCEPTED // SELECT ANOTHER PORT';
        $('wire-feedback').textContent = 'CIRCUIT MATCH CONFIRMED'; $('wire-feedback').classList.add('ok');
        sound('confirm');
        if (matches.size === 4) {
          $('wire-instruction').textContent = 'TRANSMISSION RECONSTRUCTED';
          setTimeout(() => showRecovered(), 850);
        }
      } else {
        $('wire-feedback').textContent = 'CONNECTION REJECTED — CHECK THE COLOR';
        $('wire-feedback').classList.remove('ok');
        sound('error');
        selected = null;
        document.querySelectorAll('.wire-node.left').forEach(b => b.classList.remove('selected'));
      }
    }
  }

  const memoryPattern = [2,0,3,1,2];
  let memoryInput = [];
  let memoryLocked = true;
  function renderMemoryGame() {
    const symbols = ['✦','◉','⌘','◇'];
    els.content.innerHTML = `
      <div class="puzzle-card">
        <p class="puzzle-label">NEURAL ARCHIVE // SEQUENCE 05</p>
        <p class="puzzle-hint">Observa los símbolos iluminados y repite exactamente el mismo orden.</p>
        <div class="memory-state" id="memory-state">PREPARING MEMORY SEQUENCE...</div>
        <div class="memory-grid" id="memory-grid">${symbols.map((s,i)=>`<button class="memory-pad" type="button" data-pad="${i}" aria-label="Símbolo ${i+1}" disabled>${s}</button>`).join('')}</div>
        <div class="memory-state" id="memory-progress">SEQUENCE LENGTH: 05</div>
      </div>
      <div class="puzzle-card hidden" id="final-question-card">
        <p class="puzzle-label">PERSONAL AUTHORIZATION // ORIGINAL SOURCE</p>
        <p class="puzzle-hint">La última autorización no está escrita en un documento. ¿Cuál fue la respuesta de dos letras que abrió el comienzo de esta historia?</p>
        <label class="field-label" for="final-answer">FINAL ACCESS KEY</label>
        <input class="text-input" id="final-answer" type="text" autocomplete="off" placeholder="ENTER TWO-LETTER RESPONSE" maxlength="12">
        <div class="button-row"><button class="action-button" id="final-submit" type="button">AUTHORIZE →</button></div>
        <p class="feedback" id="final-feedback" aria-live="polite"></p>
      </div>`;
    document.querySelectorAll('.memory-pad').forEach(btn => btn.addEventListener('click', () => handleMemoryInput(Number(btn.dataset.pad))));
  }
  function beginMemorySequence() {
    if (!document.getElementById('memory-grid')) return;
    memoryInput = []; memoryLocked = true;
    const status = $('memory-state');
    if (!status) return;
    status.textContent = 'OBSERVE THE SEQUENCE';
    const pads = [...document.querySelectorAll('.memory-pad')];
    pads.forEach(p => p.disabled = true);
    let i = 0;
    const showNext = () => {
      if (i >= memoryPattern.length) {
        setTimeout(() => {
          memoryLocked = false;
          pads.forEach(p => p.disabled = false);
          status.textContent = 'YOUR TURN — REPEAT THE SEQUENCE';
          sound('confirm');
        }, 330);
        return;
      }
      const pad = pads[memoryPattern[i]];
      pad.classList.add('active'); sound('pulse');
      setTimeout(() => { pad.classList.remove('active'); i++; setTimeout(showNext,230); }, 430);
    };
    setTimeout(showNext, 450);
  }
  function handleMemoryInput(index) {
    if (memoryLocked || recovered) return;
    const expected = memoryPattern[memoryInput.length];
    if (index !== expected) {
      memoryLocked = true;
      $('memory-state').textContent = 'SEQUENCE ERROR — RESETTING';
      sound('error');
      memoryInput = [];
      setTimeout(beginMemorySequence, 850);
      return;
    }
    memoryInput.push(index);
    const pad = document.querySelector(`.memory-pad[data-pad="${index}"]`);
    pad.classList.add('active'); setTimeout(() => pad.classList.remove('active'),160);
    sound('click');
    $('memory-progress').textContent = `SEQUENCE MATCH: ${memoryInput.length} / ${memoryPattern.length}`;
    if (memoryInput.length === memoryPattern.length) {
      memoryLocked = true;
      $('memory-state').textContent = 'SEQUENCE VERIFIED';
      sound('confirm');
      setTimeout(() => {
        $('final-question-card').classList.remove('hidden');
        $('final-answer').focus({preventScroll:true});
        $('final-submit').addEventListener('click', submitFinalAnswer);
        $('final-answer').addEventListener('keydown', e => { if (e.key === 'Enter') submitFinalAnswer(); });
      }, 500);
    }
  }
  function submitFinalAnswer() {
    if (normalizeAnswer($('final-answer').value) === 'SI') {
      $('final-feedback').textContent = 'FINAL AUTHORIZATION ACCEPTED';
      $('final-feedback').classList.add('ok'); sound('unlock');
      setTimeout(() => showRecovered(), 700);
    } else {
      $('final-feedback').textContent = 'AUTHORIZATION DENIED — RETURN TO THE BEGINNING';
      $('final-feedback').classList.remove('ok'); sound('error');
    }
  }
})();
