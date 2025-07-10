document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const $menu = document.getElementById('menu');
  const $menuItems = $menu ? $menu.querySelectorAll('li') : [];
  const $hue1 = document.querySelector('#h1');
  const $hue2 = document.querySelector('#h2');
  const pages = document.querySelectorAll('.page');
  const openBtn = document.querySelector('.open-btn');
  const heartsContainer = document.querySelector('.hearts-container');
  const flowersContainer = document.querySelector('.flowers-container');
  const heartShower = document.querySelector('.heart-shower');
  const vibrationBar = document.querySelector('.vibration-bar');
  const seal = document.querySelector('.seal');
  
  let currentPage = 0;
  let animationsActive = false;
  let clickCount = 0;
  const requiredClicks = 3;
  let maxRainInterval;
  let isDraggingProgress = false;

  // Initialize with romantic colors
  if ($hue1 && $hue2) {
    document.documentElement.style.setProperty('--hue1', $hue1.value);
    document.documentElement.style.setProperty('--hue2', $hue2.value);
    updateColorPreviews();
  }

  // Page Navigation
  function showPage(index) {
    pages.forEach((page, i) => {
      page.classList.toggle('active', i === index);
    });
    currentPage = index;
    
    $menuItems.forEach(item => {
      item.classList.remove('selected');
      if (parseInt(item.dataset.page) === currentPage) {
        item.classList.add('selected');
      }
    });
    
    if (currentPage === 2) {
      createHeartsBurst(15);
    }
    
    if (!animationsActive) {
      startContinuousAnimations();
      animationsActive = true;
    }
  }

  // Open Book Button with 3-click requirement
  if (openBtn) {
    openBtn.addEventListener('click', () => {
      clickCount++;
      
      // Visual feedback
      openBtn.textContent = clickCount === requiredClicks ? 
        "Opening..." : 
        `${requiredClicks - clickCount} more clicks...`;
      
      // Scale button with each click
      openBtn.style.transform = `scale(${1 + clickCount * 0.15})`;
      
      // Create intense bursts during clicks
      const heartCount = 5 + (clickCount * 5);
      const flowerCount = 3 + (clickCount * 3);
      createHeartsBurst(heartCount);
      createFlowersBurst(flowerCount);
      
      // Button pulse effect
      openBtn.style.animation = 'pulse 0.3s';
      setTimeout(() => {
        openBtn.style.animation = '';
      }, 300);

      // Final transition after 3 clicks
      if (clickCount >= requiredClicks) {
        openBtn.disabled = true;
        
        // Maximum intensity rain for 1 second
        maxRainInterval = setInterval(() => {
          createHeartsBurst(12);
          createFlowersBurst(8);
        }, 200);
        
        setTimeout(() => {
          clearInterval(maxRainInterval);
          const cover = document.getElementById('cover');
          if (cover) {
            cover.classList.add('flipping');
            
            setTimeout(() => {
              cover.classList.remove('active');
              showPage(1);
              cover.classList.remove('flipping');
              animationsActive = true;
            }, 700);
          }
        }, 1000);
      }
    });
  }

  // Context Menu Handling
  document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    if (!$menu) return;
    
    const menuRect = $menu.getBoundingClientRect();
    const viewport = { 
      width: window.innerWidth, 
      height: window.innerHeight 
    };
    
    let posX = event.clientX;
    let posY = event.clientY;
    
    if (posX + menuRect.width > viewport.width - 20) {
      posX = viewport.width - menuRect.width - 20;
    }
    if (posY + menuRect.height > viewport.height - 20) {
      posY = viewport.height - menuRect.height - 20;
    }
    
    $menu.style.left = `${posX}px`;
    $menu.style.top = `${posY}px`;
    $menu.classList.add('open');
  });

  document.addEventListener('pointerdown', (event) => {
    if ($menu && !$menu.contains(event.target)) {
      $menu.classList.remove('open');
    }
  });

  // Menu Item Click Handling
  $menuItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetPage = parseInt(item.dataset.page);
      showPage(targetPage);
      $menu.classList.remove('open');
    });
  });

  // Color Customization
  function updateColorPreviews() {
    document.querySelectorAll('.color-preview').forEach(preview => {
      if (preview.parentElement.querySelector('#h1')) {
        preview.style.color = `hsl(${$hue1.value}, 80%, 60%)`;
      } else {
        preview.style.color = `hsl(${$hue2.value}, 80%, 60%)`;
      }
    });
    
    document.documentElement.style.setProperty('--menu-glow', 
      `radial-gradient(circle at top right, 
       hsl(${$hue1.value} 80% 60% / 0.6), 
       transparent 70%)`);
  }

  if ($hue1) {
    $hue1.addEventListener('input', (e) => {
      document.documentElement.style.setProperty('--hue1', e.target.value);
      updateColorPreviews();
    });
  }

  if ($hue2) {
    $hue2.addEventListener('input', (e) => {
      document.documentElement.style.setProperty('--hue2', e.target.value);
      updateColorPreviews();
    });
  }

function createHeart() {
  if (!heartsContainer) return;
  
  const heart = document.createElement('div');
  heart.className = 'heart';
  
  // Position at random horizontal position above viewport
  heart.style.left = `${Math.random() * 100}vw`;
  heart.style.top = `-30px`;
  
  // Set color based on current hue
  heart.style.setProperty('--hue1', $hue1 ? $hue1.value : 330);
  
  // Randomize animation slightly
  const duration = 4 + Math.random() * 3;
  heart.style.animation = `float ${duration}s linear forwards`;
  
  // Create the heart parts
  heart.innerHTML = `
    <style>
      .heart::before, .heart::after {
        content: '';
        position: absolute;
        width: 20px;
        height: 20px;
        background: inherit;
        border-radius: 50%;
      }
      .heart::before { top: -10px; left: 0; }
      .heart::after { top: 0; left: -10px; }
    </style>
  `;

  heartsContainer.appendChild(heart);
  
  // Remove after animation completes
  setTimeout(() => {
    heart.remove();
  }, duration * 1000);
}

  function createFlower() {
    if (!flowersContainer) return;
    
    const flower = document.createElement('div');
    flower.className = 'flower';
    flower.innerHTML = '🌸';
    flower.style.left = `${Math.random() * 100}vw`;
    flower.style.top = `-30px`;
    flower.style.opacity = Math.random() * 0.7 + 0.3;
    flower.style.fontSize = `${25 + Math.random() * 30}px`;
    flower.style.animationDuration = `${3 + Math.random() * 3}s`;
    flower.style.animationDelay = `${Math.random() * 0.5}s`;
    
    flowersContainer.appendChild(flower);
    
    setTimeout(() => {
      flower.remove();
    }, 6000);
  }

  function createHeartsBurst(count) {
    for (let i = 0; i < count; i++) {
      setTimeout(createHeart, i * 30);
    }
  }

  function createFlowersBurst(count) {
    for (let i = 0; i < count; i++) {
      setTimeout(createFlower, i * 50);
    }
  }

  function startContinuousAnimations() {
    if (window.heartInterval) clearInterval(window.heartInterval);
    if (window.flowerInterval) clearInterval(window.flowerInterval);
    
    window.heartInterval = setInterval(() => {
      if (Math.random() > 0.7) createHeart();
    }, 1000);
    
    window.flowerInterval = setInterval(() => {
      if (Math.random() > 0.8) createFlower();
    }, 1500);
  }

  // Event Listeners
  if (heartShower) {
    heartShower.addEventListener('click', () => {
      createHeartsBurst(100);
    });
  }

  if (seal) {
    seal.addEventListener('click', () => {
      createHeartsBurst(50);
      seal.style.animation = 'seal-pop 0.5s';
      seal.addEventListener('animationend', () => {
        seal.style.animation = '';
      });
    });
  }

  // Letter unfolding interaction
  document.querySelector('.unfold-btn')?.addEventListener('click', function() {
    const envelope = document.querySelector('.envelope');
    const foldedLetter = document.querySelector('.letter-paper.folded');
    const fullLetter = document.querySelector('.full-letter');
    
    envelope.classList.add('open');
    foldedLetter.classList.add('unfolding');
    
    setTimeout(() => {
      foldedLetter.classList.add('hidden');
      fullLetter.classList.remove('hidden');
      fullLetter.classList.add('revealed');
      createHeartsBurst(10);
    }, 500);
  });

  // Reasons pages navigation
  document.querySelector('.next-reasons')?.addEventListener('click', () => {
    document.getElementById('reasons1').classList.remove('active');
    document.getElementById('reasons2').classList.add('active');
    createFlowersBurst(20);
  });

  document.querySelector('.prev-reasons')?.addEventListener('click', () => {
    document.getElementById('reasons2').classList.remove('active');
    document.getElementById('reasons1').classList.add('active');
    createHeartsBurst(20);
  });

  // Poem Book Navigation
  function setupPoemBook() {
    const poemPages = document.querySelectorAll('.poem-page');
    const prevBtn = document.querySelector('.prev-poem');
    const nextBtn = document.querySelector('.next-poem');
    const counter = document.querySelector('.poem-counter');
    let currentPage = 0;

    function showPage(index) {
      poemPages.forEach((page, i) => {
        page.classList.toggle('active', i === index);
      });
      currentPage = index;
      updateCounter();
      createHeartsBurst(3);
    }

    function updateCounter() {
      counter.textContent = `Poem ${currentPage + 1} of ${poemPages.length}`;
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentPage > 0) {
          showPage(currentPage - 1);
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentPage < poemPages.length - 1) {
          showPage(currentPage + 1);
        }
      });
    }

    // Initialize
    showPage(0);
  }

  // Music Player
  const audioPlayer = new Audio();
  let currentSongIndex = 0;
  let isPlaying = false;
  let isUserInteracted = false;

  const playlist = [
    {
      title: "Thank You - Dido",
      src: "https://dl.dropboxusercontent.com/scl/fi/u3vq6ya8kklyzh79uxmjg/SpotiDownloader.com-Thank-You-Dido.mp3?rlkey=z7q9s2k8rqnimffqo8qo1kph5&st=red4sea7"
    },
    {
      title: "Blinding Lights - The Weeknd",
      src: "https://dl.dropboxusercontent.com/scl/fi/c643o0xrexnvs8asvex3t/SpotiDownloader.com-Blinding-Lights-The-Weeknd.mp3?rlkey=uew0636l2s8vgorlw5udybxth&st=cus9r9vo"
    },
    {
      title: "daydreaming - Rebzyyx",
      src: "https://dl.dropboxusercontent.com/scl/fi/gxas0dt0iz8kjoyzabkf4/SpotiDownloader.com-daydreaming-Rebzyyx.mp3?rlkey=kk7x8qs5xbaprrgn52lkoy23h&st=9ni1rryo"
    },
    {
      title: "Falling for U - Peachy",
      src: "https://dl.dropboxusercontent.com/scl/fi/lwi89lsi2s0wq0wkukjfm/SpotiDownloader.com-Falling-for-U-Peachy.mp3?rlkey=ra9p6sho25jjt1919e0hlqqvx&st=t3jg0ub5"
    }
  ];

  // DOM Elements
  const playBtn = document.getElementById('play-btn');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const songTitle = document.getElementById('song-title');
  const progressBar = document.getElementById('progress');
  const playlistEl = document.getElementById('playlist');
  const playlistToggle = document.getElementById('playlist-toggle');
  const playlistContainer = document.querySelector('.playlist-container');

  // Initialize player
  function initMusicPlayer() {
    initPlaylist();
    setupEventListeners();
    playSong(0);
  }

  function initPlaylist() {
    if (!playlistEl) return;
    
    playlistEl.innerHTML = '';
    playlist.forEach((song, index) => {
      const li = document.createElement('li');
      li.textContent = song.title;
      li.addEventListener('click', () => {
        playSong(index);
        if (playlistContainer) playlistContainer.classList.remove('visible');
      });
      playlistEl.appendChild(li);
    });
  }

  function setupEventListeners() {
    if (!playBtn || !prevBtn || !nextBtn || !progressBar) return;
    
    // Play/Pause
    playBtn.addEventListener('click', () => {
      isUserInteracted = true;
      if (audioPlayer.paused) {
        audioPlayer.play().catch(e => showError("Playback failed: " + e.message));
      } else {
        audioPlayer.pause();
      }
    });

    // Previous/Next
    prevBtn.addEventListener('click', () => {
      isUserInteracted = true;
      prevSong();
    });
    nextBtn.addEventListener('click', () => {
      isUserInteracted = true;
      nextSong();
    });

    // Progress bar
    progressBar.addEventListener('input', () => {
      if (audioPlayer.duration) {
        audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration;
      }
    });

    // Playlist toggle
    if (playlistToggle) {
      playlistToggle.addEventListener('click', togglePlaylist);
    }
    document.querySelector('.close-playlist')?.addEventListener('click', togglePlaylist);
  }

  function playSong(index) {
    currentSongIndex = index;
    const song = playlist[currentSongIndex];
    
    showLoading(true);
    audioPlayer.src = song.src + '&_=' + Date.now();
    audioPlayer.load();
    
    audioPlayer.play()
      .then(() => {
        if (songTitle) songTitle.textContent = song.title;
        if (playBtn) playBtn.textContent = '⏸️';
        isPlaying = true;
        updatePlaylistUI();
      })
      .catch(error => {
        showError("Couldn't play song. Trying next...");
        setTimeout(() => nextSong(), 2000);
      });
  }

  function showLoading(loading) {
    if (!songTitle) return;
    
    if (loading) {
      songTitle.textContent = "Loading...";
      songTitle.classList.add('loading');
    } else {
      songTitle.classList.remove('loading');
    }
  }

  function showError(message) {
    const errorEl = document.getElementById('song-error');
    if (!errorEl) return;
    
    errorEl.textContent = message;
    errorEl.style.display = 'block';
    setTimeout(() => errorEl.style.display = 'none', 5000);
  }

  function togglePlaylist() {
    if (playlistContainer) playlistContainer.classList.toggle('visible');
  }

  function updatePlaylistUI() {
    if (!playlistEl) return;
    
    const items = playlistEl.querySelectorAll('li');
    items.forEach((item, index) => {
      item.classList.toggle('playing', index === currentSongIndex);
    });
  }

  function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    playSong(currentSongIndex);
  }

  function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    playSong(currentSongIndex);
  }

  // Time updates
  audioPlayer.addEventListener('timeupdate', () => {
    if (progressBar && !isNaN(audioPlayer.duration)) {
      progressBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    }
  });

  // Song ended
  audioPlayer.addEventListener('ended', nextSong);

  // Error handling
  audioPlayer.addEventListener('error', () => {
    showError("Error loading audio. Trying next song...");
    nextSong();
  });

  // Audio visualization
  function startVibration() {
    if (!vibrationBar) return;
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audioPlayer);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 32;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function updateVibration() {
      if (!isPlaying) return;
      
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / bufferLength;
      const intensity = Math.min(average / 255, 1);
      
      vibrationBar.style.height = `${3 + intensity * 5}px`;
      vibrationBar.style.opacity = intensity;
      
      requestAnimationFrame(updateVibration);
    }
    
    updateVibration();
  }

  // Initialize everything
  setupPoemBook();
  initMusicPlayer();
  showPage(0);
});
