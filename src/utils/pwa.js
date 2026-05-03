// PWA Registration and Update Handler
export function registerSW() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            console.log('Service Worker update found!');
            
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New update available - show notification
                showUpdateNotification();
              }
            });
          });
        })
        .catch((error) => {
          console.log('SW registration failed: ', error);
        });
    });
  }
}

function showUpdateNotification() {
  // Create a non-intrusive notification
  const notification = document.createElement('div');
  notification.innerHTML = `
    <div style="
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #5b4cf5;
      color: white;
      padding: 12px 20px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10000;
      display: flex;
      align-items: center;
      gap: 12px;
      font-family: system-ui;
      animation: slideIn 0.3s ease;
    ">
      <span>🔄</span>
      <span>New version available!</span>
      <button onclick="window.location.reload()" style="
        background: white;
        color: #5b4cf5;
        border: none;
        padding: 4px 12px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
      ">Update</button>
    </div>
    <style>
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    </style>
  `;
  document.body.appendChild(notification);
  
  // Auto-remove after 10 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideIn 0.3s reverse';
      setTimeout(() => notification.remove(), 300);
    }
  }, 10000);
}

// Check if app is installed as PWA
export function isPWAInstalled() {
  return window.matchMedia('(display-mode: standalone)').matches || 
         window.navigator.standalone === true;
}

// Prompt user to install PWA (can be called on first visit)
export function promptInstall() {
  let deferredPrompt;
  
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install button if not installed
    if (!isPWAInstalled()) {
      showInstallButton(deferredPrompt);
    }
  });
}

function showInstallButton(deferredPrompt) {
  const installBtn = document.createElement('button');
  installBtn.innerHTML = '📱 Install App';
  installBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 20px;
    background: #5b4cf5;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 50px;
    cursor: pointer;
    z-index: 10000;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  `;
  
  installBtn.onclick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        installBtn.remove();
      }
      deferredPrompt = null;
    }
  };
  
  document.body.appendChild(installBtn);
  
  // Remove after user navigates away or after some time
  setTimeout(() => installBtn.remove(), 30000);
}