/* ARCHIVE ZERO — original procedural audio, generated locally with Web Audio API.
   No external music files or copyrighted recordings are used. Audio starts only after user interaction. */
(() => {
  let ctx = null;
  let master = null;
  let musicBus = null;
  let sequenceTimer = null;
  let isMuted = false;
  let currentMode = 'investigation';
  let noteIndex = 0;
  let trackOscillators = [];

  const TRACKS = {
    investigation: { notes:[110,164.81,146.83,196,164.81,130.81,174.61,146.83], root:55, fifth:82.41, beat:620, type:'sine' },
    medieval:      { notes:[196,220,261.63,293.66,261.63,220,174.61,196], root:98, fifth:146.83, beat:510, type:'triangle' },
    playful:       { notes:[261.63,329.63,392,440,392,329.63,293.66,349.23], root:130.81, fifth:196, beat:390, type:'triangle' },
    majestic:      { notes:[110,164.81,220,261.63,220,164.81,146.83,196], root:55, fifth:82.41, beat:760, type:'sine' },
    romantic:      { notes:[261.63,329.63,392,523.25,440,392,329.63,293.66], root:130.81, fifth:196, beat:690, type:'sine' }
  };

  function setup() {
    if (ctx) return true;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return false;
    ctx = new AudioCtx();
    master = ctx.createGain();
    master.gain.value = isMuted ? 0 : 0.72;
    master.connect(ctx.destination);
    return true;
  }

  function makeTone(freq, duration=0.25, options={}) {
    if (!ctx || !master) return;
    const when = ctx.currentTime + (options.delay || 0);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const type = options.type || 'sine';
    osc.type = type;
    osc.frequency.setValueAtTime(freq, when);
    if (options.slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(1, options.slideTo), when + duration);
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(options.volume || 0.06, when + Math.min(0.035, duration/3));
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
    osc.connect(gain); gain.connect(options.bus || master);
    osc.start(when); osc.stop(when + duration + 0.04);
  }

  function stopTrack() {
    if (sequenceTimer) clearInterval(sequenceTimer);
    sequenceTimer = null;
    if (musicBus && ctx) {
      const old = musicBus;
      const oldOscillators = trackOscillators;
      trackOscillators = [];
      old.gain.cancelScheduledValues(ctx.currentTime);
      old.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.28);
      setTimeout(() => {
        oldOscillators.forEach(osc => { try { osc.stop(); osc.disconnect(); } catch (_) {} });
        try { old.disconnect(); } catch (_) {}
      }, 1200);
    }
    musicBus = null;
  }

  function playTrack(mode='investigation') {
    if (!setup()) return;
    if (ctx.state === 'suspended') ctx.resume();
    currentMode = TRACKS[mode] ? mode : 'investigation';
    stopTrack();
    const track = TRACKS[currentMode];
    const bus = ctx.createGain();
    bus.gain.setValueAtTime(0.0001, ctx.currentTime);
    bus.gain.setTargetAtTime(0.52, ctx.currentTime + 0.05, 0.8);
    bus.connect(master);
    musicBus = bus;

    // Soft, sustained two-note bed.
    [track.root, track.fifth].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine'; osc.frequency.value = freq;
      g.gain.value = i === 0 ? 0.075 : 0.035;
      osc.connect(g); g.connect(bus); osc.start();
      trackOscillators.push(osc);
    });

    noteIndex = 0;
    const playNext = () => {
      const freq = track.notes[noteIndex % track.notes.length];
      makeTone(freq, currentMode === 'playful' ? 0.22 : 0.42, { type:track.type, volume:currentMode === 'romantic' ? 0.06 : 0.05, bus, delay:0.02 });
      if (noteIndex % 4 === 0) makeTone(track.root * 2, 0.12, { type:'sine', volume:0.022, bus, delay:0.01 });
      noteIndex++;
    };
    playNext();
    sequenceTimer = setInterval(playNext, track.beat);
  }

  function sfx(name='confirm') {
    if (!setup()) return;
    if (ctx.state === 'suspended') ctx.resume();
    const sounds = {
      confirm: () => { makeTone(660,.12,{volume:.075}); makeTone(880,.18,{volume:.055,delay:.11}); },
      error:   () => { makeTone(185,.25,{type:'square',volume:.035,slideTo:90}); },
      scan:    () => { makeTone(420,.45,{type:'sawtooth',volume:.025,slideTo:1050}); makeTone(840,.25,{volume:.018,delay:.12,slideTo:260}); },
      click:   () => makeTone(520,.045,{type:'square',volume:.018}),
      unlock:  () => { [523.25,659.25,783.99,1046.5].forEach((f,i)=>makeTone(f,.42,{volume:.045,delay:i*.12})); },
      shot:    () => makeTone(240,.09,{type:'square',volume:.025,slideTo:90}),
      hit:     () => makeTone(120,.16,{type:'sawtooth',volume:.03,slideTo:55}),
      pulse:   () => makeTone(340,.16,{volume:.025,slideTo:510})
    };
    (sounds[name] || sounds.confirm)();
  }

  function setMuted(value) {
    isMuted = Boolean(value);
    if (master && ctx) master.gain.setTargetAtTime(isMuted ? 0 : 0.72, ctx.currentTime, 0.08);
    return isMuted;
  }

  window.ArchiveAudio = {
    start: () => { if (setup() && ctx.state === 'suspended') ctx.resume(); playTrack('investigation'); },
    playTrack,
    sfx,
    mute: setMuted,
    get muted(){ return isMuted; },
    get available(){ return Boolean(window.AudioContext || window.webkitAudioContext); }
  };
})();
