import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'compact' | 'full';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'compact',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showAndroidInfo, setShowAndroidInfo] = useState(false);
  const [activeTab, setActiveTab] = useState<'install' | 'host' | 'apk'>('install');
  const [copied, setCopied] = useState(false);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://ais-pre-chp4bbbolxth37xvcsqf5g-635458358533.asia-southeast1.run.app';

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Suppress if already launched from installed standalone PWA
  if (isInstalled) {
    return null;
  }

  // Chromium / Android flow (beforeinstallprompt is available)
  if (isInstallable) {
    return (
      <button
        id="pwa-install-btn"
        onClick={install}
        className={`group flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-amber-600/30 border border-amber-500/50 hover:border-amber-400 hover:bg-amber-500/30 text-amber-300 transition-all rounded text-xs font-orbitron font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(245,158,11,0.2)] ${className}`}
        title="Install BuildingBlocks directly on your Android device"
      >
        <i className="fa-brands fa-android text-sm text-green-400 group-hover:scale-110 transition-transform"></i>
        <span>{variant === 'full' ? 'Install Android App' : 'Install App'}</span>
        <i className="fa-solid fa-download text-[10px] opacity-70"></i>
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <>
        <button
          id="pwa-install-ios-btn"
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-2 px-3 py-1.5 bg-slate-900/60 border border-slate-700 hover:border-amber-400/60 text-slate-300 hover:text-white transition-all rounded text-xs font-orbitron uppercase tracking-wider ${className}`}
        >
          <i className="fa-brands fa-apple text-sm"></i>
          <span>Add to Home</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
            <div className="w-full max-w-sm rounded-lg bg-slate-950 border border-amber-500/40 p-6 shadow-2xl space-y-4 text-left">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <i className="fa-brands fa-apple text-xl text-amber-400"></i>
                  <h3 className="text-sm font-black font-orbitron text-white uppercase tracking-wider">Install on iOS</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-slate-500 hover:text-white text-xs px-2 py-1"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                To install BuildingBlocks as a standalone fullscreen app on your iPhone or iPad:
              </p>
              <ol className="text-xs text-slate-300 space-y-2.5 font-sans pl-1">
                <li className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-orbitron text-[10px] flex items-center justify-center font-bold">1</span>
                  <span>Tap the <strong className="text-white">Share</strong> button in Safari's toolbar.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-orbitron text-[10px] flex items-center justify-center font-bold">2</span>
                  <span>Scroll down and select <strong className="text-white">Add to Home Screen</strong>.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-orbitron text-[10px] flex items-center justify-center font-bold">3</span>
                  <span>Tap <strong className="text-amber-400">Add</strong> to launch with native app icons.</span>
                </li>
              </ol>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full bg-amber-600 hover:bg-amber-500 text-white font-orbitron font-bold py-2.5 text-xs uppercase tracking-widest rounded transition-all mt-4"
              >
                GOT IT
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback for browsers / desktop or before prompt triggers: provide Android/PWA guidance button
  return (
    <>
      <button
        id="pwa-install-generic-btn"
        onClick={() => setShowAndroidInfo(true)}
        className={`flex items-center gap-2 px-3 py-1.5 bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 text-slate-400 hover:text-amber-300 transition-all rounded text-[10px] font-orbitron uppercase tracking-wider ${className}`}
        title="Android App & PWA Installation Options"
      >
        <i className="fa-brands fa-android text-sm text-green-500/80"></i>
        <span>Android App</span>
        <i className="fa-solid fa-circle-info text-[9px] opacity-60"></i>
      </button>

      {showAndroidInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-full max-w-lg rounded-xl bg-slate-950 border border-amber-500/40 p-6 shadow-2xl space-y-5 text-left max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <i className="fa-brands fa-android text-2xl text-green-400"></i>
                <div>
                  <h3 className="text-sm sm:text-base font-black font-orbitron text-white uppercase tracking-wider">
                    Android & Hosting Hub
                  </h3>
                  <p className="text-[9px] text-slate-400 font-retro uppercase">
                    BuildingBlocks • WebAPK & Production Guide
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAndroidInfo(false)}
                className="w-7 h-7 rounded-lg border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-900"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-800 gap-2">
              <button
                onClick={() => setActiveTab('install')}
                className={`pb-2 text-[10px] font-orbitron uppercase tracking-wider font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                  activeTab === 'install'
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <i className="fa-solid fa-mobile-screen"></i>
                <span>1. Install on Phone</span>
              </button>
              <button
                onClick={() => setActiveTab('host')}
                className={`pb-2 text-[10px] font-orbitron uppercase tracking-wider font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                  activeTab === 'host'
                    ? 'border-cyan-400 text-cyan-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <i className="fa-solid fa-cloud-arrow-up"></i>
                <span>2. Hosting & URL</span>
              </button>
              <button
                onClick={() => setActiveTab('apk')}
                className={`pb-2 text-[10px] font-orbitron uppercase tracking-wider font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                  activeTab === 'apk'
                    ? 'border-green-400 text-green-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <i className="fa-brands fa-google-play"></i>
                <span>3. Build APK / AAB</span>
              </button>
            </div>

            {/* TAB 1: INSTALL DIRECTLY ON ANDROID */}
            {activeTab === 'install' && (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex flex-col sm:flex-row items-center gap-4">
                  <div className="bg-white p-2 rounded-lg shrink-0 shadow-md">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent(currentUrl)}`}
                      alt="Scan to open on Android"
                      className="w-28 h-28"
                      loading="lazy"
                    />
                  </div>
                  <div className="space-y-1.5 text-center sm:text-left">
                    <span className="text-[9px] bg-amber-500/20 text-amber-400 font-retro px-2 py-0.5 rounded uppercase">
                      Instant Mobile Access
                    </span>
                    <h4 className="font-orbitron font-bold text-white text-xs sm:text-sm">
                      Scan with Android Camera
                    </h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Point your phone's camera at this QR code to open the game in Chrome on Android.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-retro text-slate-400 uppercase tracking-wider block">
                    Public Web Link (Copy & Send to Phone)
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      readOnly 
                      value={currentUrl} 
                      className="flex-1 bg-black/60 border border-slate-800 px-3 py-2 text-[10px] font-mono text-slate-300 rounded-lg focus:outline-none"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="bg-amber-500 hover:bg-amber-400 text-black font-orbitron font-black px-3.5 py-2 text-[10px] uppercase rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`}></i>
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2 pt-1 border-t border-slate-800">
                  <div className="text-[10px] font-orbitron font-bold text-amber-400 uppercase">
                    Steps to Install as Native App:
                  </div>
                  <ol className="text-[11px] text-slate-300 space-y-1.5 list-decimal list-inside">
                    <li>Open this URL in <strong>Google Chrome</strong> on your Android phone.</li>
                    <li>Look for the bottom banner: <strong>"Add BuildingBlocks to Home screen"</strong>.</li>
                    <li>Or tap Chrome's 3-dot menu (<i className="fa-solid fa-ellipsis-vertical mx-1"></i>) and choose <strong>"Install app"</strong>.</li>
                    <li>Android installs a real <strong>WebAPK</strong> on your app drawer with fullscreen immersion and offline play!</li>
                  </ol>
                </div>
              </div>
            )}

            {/* TAB 2: HOSTING OPTIONS */}
            {activeTab === 'host' && (
              <div className="space-y-3.5 text-xs">
                <div className="p-3 bg-cyan-950/30 border border-cyan-500/30 rounded-lg space-y-1.5">
                  <div className="flex items-center gap-2 text-cyan-400 font-orbitron font-bold text-xs">
                    <i className="fa-solid fa-bolt"></i>
                    <span>Option A: Live Built-in Cloud Run (Currently Active)</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    This project is already hosted live on Google Cloud Run container infrastructure with HTTPS and WebSocket disabled for instant edge execution. Click the <strong>Share</strong> button in AI Studio top bar to generate a permanent shared URL for your friends!
                  </p>
                </div>

                <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-400 font-orbitron font-bold text-xs">
                    <i className="fa-solid fa-cloud-arrow-up"></i>
                    <span>Option B: Deploy to Cloud Run (AI Studio Menu)</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    In the AI Studio top navigation bar, click the <strong>Deploy</strong> button to deploy this app directly to your personal Google Cloud project via Cloud Run with custom domains and SSL.
                  </p>
                </div>

                <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg space-y-1.5">
                  <div className="flex items-center gap-2 text-purple-400 font-orbitron font-bold text-xs">
                    <i className="fa-brands fa-github"></i>
                    <span>Option C: Export to GitHub / Vercel / Netlify / Firebase</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    1. Go to <strong>Settings</strong> in AI Studio and choose <strong>"Export to GitHub"</strong> or <strong>"Download ZIP"</strong>.<br/>
                    2. In the repository, build command is <code className="text-amber-300 font-mono">npm run build</code> and publish directory is <code className="text-amber-300 font-mono">dist</code>.<br/>
                    3. Connect to Vercel, Netlify, or Firebase Hosting for free custom domains (<code className="text-cyan-300 font-mono">neontetris.yourdomain.com</code>).
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: GENERATE APK / PLAY STORE */}
            {activeTab === 'apk' && (
              <div className="space-y-3.5 text-xs">
                <div className="p-3 bg-green-950/30 border border-green-500/30 rounded-lg space-y-1.5">
                  <div className="flex items-center gap-2 text-green-400 font-orbitron font-bold text-xs">
                    <i className="fa-solid fa-cube"></i>
                    <span>Generate Play Store APK / AAB via PWABuilder</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Because this app has a 100% compliant Manifest, Service Worker, and icons, you can convert it to a native Android APK in 60 seconds:
                  </p>
                  <ol className="text-[11px] text-slate-300 space-y-1 list-decimal list-inside pl-1 pt-1">
                    <li>Go to <a href="https://www.pwabuilder.com" target="_blank" rel="noreferrer" className="text-amber-400 underline font-bold">pwabuilder.com</a>.</li>
                    <li>Paste your hosted app URL (<code className="text-slate-200 font-mono text-[10px]">https://ais-pre-...run.app</code>).</li>
                    <li>Click <strong>"Package for Stores"</strong> &rarr; <strong>"Android"</strong>.</li>
                    <li>Download your signed <strong>.apk</strong> (for direct sideloading on Android) or <strong>.aab</strong> (for Google Play Store upload)!</li>
                  </ol>
                </div>

                <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-200 font-orbitron font-bold text-xs">
                    <i className="fa-solid fa-terminal"></i>
                    <span>Or Build via Google Bubblewrap CLI (TWA)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono bg-black/60 p-2 rounded text-[10px]">
                    npm i -g @bubblewrap/cli<br/>
                    bubblewrap init --manifest={currentUrl}manifest.webmanifest<br/>
                    bubblewrap build
                  </p>
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-[9px] text-slate-500 font-retro uppercase">
                PWA Manifest & Service Worker: Active
              </span>
              <button
                onClick={() => setShowAndroidInfo(false)}
                className="bg-slate-800 hover:bg-slate-700 text-white font-orbitron font-bold py-2 px-5 text-[10px] uppercase tracking-widest rounded-lg transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default PWAInstallButton;
