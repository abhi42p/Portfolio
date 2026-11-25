// Original, continuous ambient score. No recordings, external audio, or dependencies.
const HARMONY = [
  [48,55,59,64,67,71], [45,52,55,60,64,67],
  [41,48,52,57,60,64], [43,50,55,59,62,69],
  [48,55,59,64,67,74], [45,52,57,60,64,71],
  [41,48,53,57,60,67], [43,50,55,60,62,67]
];
const ORDER = [1,3,4,2,5,3,4,2];
const BEAT = 60/72, BAR = BEAT*4;
const hz = n => 440*2**((n-69)/12);
export class Sound {
  constructor(){this.on=false;this.ctx=null;this.pan=0;this.pending=null;this.bar=0;this.muted=false;try{this.muted=localStorage.getItem('beyond-audio-muted')==='1'}catch{}}
  remember(){try{localStorage.setItem('beyond-audio-muted',this.muted?'1':'0')}catch{}}
  setup(){
    const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return false;
    const c=this.ctx=new AC();
    this.master=c.createGain();this.master.gain.value=0;
    this.music=c.createGain();this.music.gain.value=.38;
    this.fx=c.createGain();this.fx.gain.value=.65;
    const limiter=c.createDynamicsCompressor();limiter.threshold.value=-18;limiter.ratio.value=3;
    this.music.connect(this.master);this.fx.connect(this.master);this.master.connect(limiter);limiter.connect(c.destination);
    // A short stereo room response gives the acoustic notes space without a heavy reverb tail.
    const room=c.createConvolver(),len=Math.floor(c.sampleRate*1.9),ir=c.createBuffer(2,len,c.sampleRate);
    for(let ch=0;ch<2;ch++){const d=ir.getChannelData(ch);let prev=0;for(let i=0;i<len;i++){prev=.48*prev+.52*(Math.random()*2-1);d[i]=prev*Math.pow(1-i/len,3)*.35}}
    room.buffer=ir;this.wet=c.createGain();this.wet.gain.value=.19;this.music.connect(room);room.connect(this.wet);this.wet.connect(this.master);
    return true;
  }
  async start(){
    if(this.muted)return false;
    if(this.on&&this.ctx?.state==='running')return true;
    if(this.pending){try{this.ctx.resume().catch(()=>{})}catch{}return this.pending}
    // Call resume directly in the user gesture; autoplay may be denied until then.
    try{if(!this.ctx&&!this.setup())return false;const c=this.ctx;
      const resume=c.resume();this.pending=Promise.race([resume.then(()=>c.state==='running'),new Promise(resolve=>setTimeout(()=>resolve(false),450))]).then(ok=>{
        if(!ok||this.muted)return false;this.on=true;this.master.gain.cancelScheduledValues(c.currentTime);this.master.gain.setTargetAtTime(.60,c.currentTime,.25);
        if(!this.timer){this.next=c.currentTime+.08;this.bar=0;this.schedule();this.timer=setInterval(()=>this.schedule(),100)}return true;
      }).catch(()=>false).finally(()=>{this.pending=null});return this.pending;
    }catch{return false}
  }
  async toggle(){if(this.on){this.muted=true;this.on=false;this.remember();if(this.ctx){this.master.gain.cancelScheduledValues(this.ctx.currentTime);this.master.gain.setTargetAtTime(0,this.ctx.currentTime,.12)}clearInterval(this.timer);this.timer=null;return false}this.muted=false;this.remember();return this.start()}
  schedule(){if(!this.on||this.ctx.state!=='running')return;const now=this.ctx.currentTime;if(this.next<now-.2)this.next=now+.05;while(this.next<now+.18){this.measure(this.next,this.bar++);this.next+=BAR}}
  measure(t,index){const notes=HARMONY[index%HARMONY.length];
    this.tone(hz(notes[0]),t,BAR+.7,.075,'sine',0,this.music,.45);
    [notes[1],notes[2],notes[3]].forEach((n,i)=>this.tone(hz(n),t,BAR+.9,.022,'sine',i*.48-.48,this.music,.85));
    ORDER.forEach((n,i)=>this.string(hz(notes[n]),t+i*BEAT/2,2.25,(i%2? .23:-.23),this.music,[.18,.11,.13,.09,.15,.1,.13,.08][i]));
  }
  tone(freq,t,dur,amp,type,pan,bus,attack=.018){let c=this.ctx,o=c.createOscillator(),g=c.createGain(),p=c.createStereoPanner();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(amp,t+attack);g.gain.exponentialRampToValueAtTime(.0001,t+dur);p.pan.value=Math.max(-1,Math.min(1,pan));o.connect(g);g.connect(p);p.connect(bus);o.start(t);o.stop(t+dur+.03);o.onended=()=>{o.disconnect();g.disconnect();p.disconnect()}}
  voice(freq,dur,amp,type='sine',pan=0,when=0){if(!this.on)return;this.tone(freq,this.ctx.currentTime+when,dur,amp,type,pan,this.fx)}
  tap(){this.voice(480,.12,.055,'sine',this.pan);this.voice(730,.08,.017,'triangle',this.pan)}
  string(f,t,dur,pan,bus,volume){const c=this.ctx,sr=c.sampleRate,n=Math.round(sr*dur),period=Math.max(2,Math.round(sr/f)),buf=c.createBuffer(1,n,sr),v=buf.getChannelData(0),ring=new Float32Array(period);let prev=0;
    for(let i=0;i<period;i++){prev=.30*prev+.70*(Math.random()*2-1);ring[i]=prev}
    for(let i=0;i<n;i++){let k=i%period;v[i]=ring[k]*Math.exp(-i/(sr*1.0))*.58*Math.min(1,i/(sr*.006));ring[k]=.499*(ring[k]+ring[(k+1)%period])}
    const s=c.createBufferSource(),g=c.createGain(),p=c.createStereoPanner(),lp=c.createBiquadFilter();s.buffer=buf;g.gain.value=volume;lp.type='lowpass';lp.frequency.value=2600;p.pan.value=pan;s.connect(lp);lp.connect(g);g.connect(p);p.connect(bus);s.start(t);s.onended=()=>{s.disconnect();lp.disconnect();g.disconnect();p.disconnect()};
  }
  pluck(f,pan=0,when=0){if(this.on)this.string(f,this.ctx.currentTime+when,1.65,pan,this.fx,.52)}
}
