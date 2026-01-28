// music-feed-audio.js - Реальное аудио с премиум функциями
class MusicFeedAudio {
    constructor() {
        this.audioContext = null;
        this.audioElement = document.getElementById('audioPlayer');
        this.currentTrack = null;
        this.isPlaying = false;
        this.isPremium = false; // Измените на true если пользователь premium
        this.tracks = this.getDemoTracks();
        this.currentTime = 0;
        this.duration = 0;
        this.volume = 0.8;
        this.isMuted = false;
        
        this.init();
    }
    
    async init() {
        console.log("🎵 Инициализация аудио ленты...");
        
        // Создаем AudioContext (Web Audio API)
        this.setupAudioContext();
        
        // Загружаем данные пользователя
        this.loadUserData();
        
        // Отображаем треки
        this.displayTracks();
        
        // Настраиваем аудио плеер
        this.setupAudioPlayer();
        
        // Настраиваем контроллер
        this.setupAudioController();
        
        // Проверяем премиум статус
        this.checkPremiumStatus();
        
        console.log("✅ Аудио лента готова");
    }
    
    setupAudioContext() {
        try {
            // Создаем AudioContext для продвинутой обработки звука
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
            
            // Создаем ноды для обработки звука
            this.source = this.audioContext.createMediaElementSource(this.audioElement);
            this.gainNode = this.audioContext.createGain();
            this.analyser = this.audioContext.createAnalyser();
            
            // Подключаем цепочку: source -> analyser -> gain -> destination
            this.source.connect(this.analyser);
            this.analyser.connect(this.gainNode);
            this.gainNode.connect(this.audioContext.destination);
            
            // Настраиваем анализатор для визуализации
            this.analyser.fftSize = 256;
            this.bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(this.bufferLength);
            
            console.log("🔊 AudioContext создан");
            
        } catch (error) {
            console.error("❌ Ошибка создания AudioContext:", error);
        }
    }
    
    getDemoTracks() {
        return [
            {
                id: 1,
                title: "Summer Vibes",
                artist: "Lofi Producer",
                genre: ["lofi", "chill"],
                duration: 180,
                audioUrl: "https://assets.codepen.io/242518/SummerVibes.mp3",
                cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
                description: "Расслабляющий lofi-бит для работы",
                isPremium: false,
                waveform: [20, 40, 60, 80, 60, 40, 20, 40, 60, 80]
            },
            {
                id: 2,
                title: "Midnight Drive",
                artist: "Synthwave Artist",
                genre: ["synthwave", "electronic"],
                duration: 240,
                audioUrl: "https://assets.codepen.io/242518/MidnightDrive.mp3",
                cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop",
                description: "Синтвейв для ночной поездки",
                isPremium: false,
                waveform: [30, 50, 70, 90, 70, 50, 30, 50, 70, 90]
            },
            {
                id: 3,
                title: "Neon Dreams",
                artist: "Cyberpunk Collective",
                genre: ["cyberpunk", "electronic"],
                duration: 210,
                audioUrl: "https://assets.codepen.io/242518/NeonDreams.mp3",
                cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop",
                description: "Киберпанк атмосфера",
                isPremium: true,
                waveform: [40, 60, 80, 100, 80, 60, 40, 60, 80, 100]
            },
            {
                id: 4,
                title: "Ocean Waves",
                artist: "Ambient Creator",
                genre: ["ambient", "nature"],
                duration: 300,
                audioUrl: "https://assets.codepen.io/242518/OceanWaves.mp3",
                cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
                description: "Амбиент с звуками океана",
                isPremium: false,
                waveform: [10, 20, 30, 40, 30, 20, 10, 20, 30, 40]
            },
            {
                id: 5,
                title: "City Lights",
                artist: "Future Bass",
                genre: ["futurebass", "electronic"],
                duration: 195,
                audioUrl: "https://assets.codepen.io/242518/CityLights.mp3",
                cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop",
                description: "Энергичный future bass",
                isPremium: true,
                waveform: [50, 70, 90, 110, 90, 70, 50, 70, 90, 110]
            }
        ];
    }
    
    displayTracks() {
        const container = document.getElementById('tracksContainer');
        if (!container) return;
        
        container.innerHTML = this.tracks.map(track => this.createTrackCard(track)).join('');
        
        // Добавляем обработчики
        this.addTrackEventListeners();
        
        // Создаем визуализацию волны
        this.createWaveforms();
    }
    
    createTrackCard(track) {
        const premiumBadge = track.isPremium ? 
            '<div class="premium-label">⭐ PREMIUM</div>' : '';
        
        const lockIcon = track.isPremium && !this.isPremium ? '🔒 ' : '';
        
        return `
            <div class="track-card ${track.isPremium ? 'premium' : ''}" data-track-id="${track.id}">
                ${premiumBadge}
                <div class="track-content">
                    <div class="track-cover-container">
                        <img src="${track.cover}" class="track-cover" alt="${track.title}">
                        <div class="track-cover-overlay">
                            <button class="play-overlay-btn" data-track-id="${track.id}">
                                ▶️
                            </button>
                        </div>
                    </div>
                    
                    <div class="track-info">
                        <div class="track-title">
                            ${lockIcon}${track.title}
                            ${track.isPremium && !this.isPremium ? 
                                '<span style="font-size: 12px; color: gold; margin-left: 10px;">(Требуется Premium)</span>' : ''}
                        </div>
                        <div class="track-artist">${track.artist} • ${this.formatTime(track.duration)}</div>
                        <div style="margin: 15px 0;">
                            <span class="genre-badge">${track.genre[0]}</span>
                            <span class="genre-badge">${track.genre[1]}</span>
                        </div>
                        
                        <div class="audio-waveform" id="waveform-${track.id}">
                            <!-- Волна будет нарисована через JS -->
                        </div>
                        
                        <p style="color: rgba(255,255,255,0.7); margin: 10px 0;">${track.description}</p>
                        
                        <div class="track-actions">
                            <button class="track-btn play-btn" data-track-id="${track.id}">
                                ▶️ Слушать
                            </button>
                            
                            <button class="track-btn ${track.isPremium && !this.isPremium ? 'locked' : ''}" 
                                    data-track-id="${track.id}"
                                    onclick="${track.isPremium && !this.isPremium ? 'showPremiumModal()' : `musicFeed.editTrack(${track.id})`}">
                                🎛️ Редактировать
                            </button>
                            
                            <button class="track-btn ${track.isPremium && !this.isPremium ? 'locked' : ''}"
                                    onclick="${track.isPremium && !this.isPremium ? 'showPremiumModal()' : `musicFeed.downloadTrack(${track.id})`}">
                                📥 Скачать
                            </button>
                            
                            ${this.isPremium ? `
                                <button class="track-btn premium" onclick="musicFeed.aiMastering(${track.id})">
                                    ⭐ AI Мастеринг
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    createWaveforms() {
        this.tracks.forEach(track => {
            const container = document.getElementById(`waveform-${track.id}`);
            if (!container) return;
            
            container.innerHTML = '';
            
            // Создаем столбцы волны
            for (let i = 0; i < 50; i++) {
                const bar = document.createElement('div');
                bar.className = 'waveform-bar';
                
                // Случайная высота для демо
                const height = Math.random() * 100;
                bar.style.height = `${height}%`;
                bar.style.left = `${i * 2}%`;
                
                container.appendChild(bar);
            }
        });
    }
    
    setupAudioPlayer() {
        // События аудио элемента
        this.audioElement.addEventListener('timeupdate', () => {
            this.updateProgress();
        });
        
        this.audioElement.addEventListener('loadedmetadata', () => {
            this.duration = this.audioElement.duration;
            this.updateTimeDisplay();
        });
        
        this.audioElement.addEventListener('ended', () => {
            this.isPlaying = false;
            document.getElementById('playBtn').textContent = '▶️';
        });
        
        // Обновляем прогресс каждые 100ms
        setInterval(() => {
            this.updateVisualizer();
        }, 100);
    }
    
    setupAudioController() {
        // Ползунок громкости
        this.gainNode.gain.value = this.volume;
        
        // Обновляем время каждую секунду
        setInterval(() => {
            this.updateTimeDisplay();
        }, 1000);
    }
    
    playTrack(trackId) {
        const track = this.tracks.find(t => t.id === trackId);
        if (!track) return;
        
        // Проверяем премиум доступ
        if (track.isPremium && !this.isPremium) {
            this.showPremiumModal();
            return;
        }
        
        this.currentTrack = track;
        
        // Устанавливаем источник аудио
        this.audioElement.src = track.audioUrl;
        
        // Загружаем и воспроизводим
        this.audioElement.load();
        
        // Воспроизводим
        this.playAudio();
        
        // Обновляем UI
        this.updateNowPlaying(track);
        
        // Показываем сообщение
        this.showMessage(`🎧 Сейчас играет: ${track.title}`, 'success');
    }
    
    async playAudio() {
        try {
            // Возобновляем AudioContext если он приостановлен
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
            await this.audioElement.play();
            this.isPlaying = true;
            document.getElementById('playBtn').textContent = '⏸️';
            
        } catch (error) {
            console.error("Ошибка воспроизведения:", error);
            this.showMessage("Ошибка воспроизведения аудио", 'error');
        }
    }
    
    pauseAudio() {
        this.audioElement.pause();
        this.isPlaying = false;
        document.getElementById('playBtn').textContent = '▶️';
    }
    
    togglePlay() {
        if (!this.currentTrack) {
            // Если трек не выбран, играем первый
            if (this.tracks.length > 0) {
                this.playTrack(this.tracks[0].id);
            }
            return;
        }
        
        if (this.isPlaying) {
            this.pauseAudio();
        } else {
            this.playAudio();
        }
    }
    
    updateProgress() {
        if (!this.audioElement.duration) return;
        
        this.currentTime = this.audioElement.currentTime;
        const progress = (this.currentTime / this.audioElement.duration) * 100;
        
        document.getElementById('progressFill').style.width = `${progress}%`;
    }
    
    updateTimeDisplay() {
        const current = this.formatTime(this.currentTime);
        const duration = this.formatTime(this.duration || this.audioElement.duration || 0);
        
        document.getElementById('currentTime').textContent = current;
        document.getElementById('durationTime').textContent = duration;
    }
    
    updateNowPlaying(track) {
        document.getElementById('currentCover').src = track.cover;
        document.getElementById('currentTitle').textContent = track.title;
        document.getElementById('currentArtist').textContent = track.artist;
    }
    
    updateVisualizer() {
        if (!this.analyser || !this.isPlaying) return;
        
        // Получаем данные частот
        this.analyser.getByteFrequencyData(this.dataArray);
        
        // Обновляем волну текущего трека
        if (this.currentTrack) {
            const container = document.getElementById(`waveform-${this.currentTrack.id}`);
            if (container) {
                const bars = container.querySelectorAll('.waveform-bar');
                bars.forEach((bar, i) => {
                    const dataIndex = Math.floor(i * this.bufferLength / bars.length);
                    const height = this.dataArray[dataIndex] / 2;
                    bar.style.height = `${height}%`;
                });
            }
        }
    }
    
    seekAudio(event) {
        if (!this.audioElement.duration) return;
        
        const progressBar = event.currentTarget;
        const clickX = event.offsetX;
        const width = progressBar.clientWidth;
        const percent = clickX / width;
        
        this.audioElement.currentTime = percent * this.audioElement.duration;
    }
    
    changeVolume(value) {
        this.volume = value / 100;
        this.gainNode.gain.value = this.volume;
        
        // Обновляем иконку
        const muteBtn = document.getElementById('muteBtn');
        if (this.volume === 0) {
            muteBtn.textContent = '🔇';
        } else if (this.volume < 0.5) {
            muteBtn.textContent = '🔉';
        } else {
            muteBtn.textContent = '🔊';
        }
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.isMuted) {
            this.gainNode.gain.value = 0;
            document.getElementById('muteBtn').textContent = '🔇';
        } else {
            this.gainNode.gain.value = this.volume;
            document.getElementById('muteBtn').textContent = '🔊';
        }
    }
    
    skipPrevious() {
        if (!this.currentTrack) return;
        
        const currentIndex = this.tracks.findIndex(t => t.id === this.currentTrack.id);
        const prevIndex = (currentIndex - 1 + this.tracks.length) % this.tracks.length;
        
        this.playTrack(this.tracks[prevIndex].id);
    }
    
    skipNext() {
        if (!this.currentTrack) return;
        
        const currentIndex = this.tracks.findIndex(t => t.id === this.currentTrack.id);
        const nextIndex = (currentIndex + 1) % this.tracks.length;
        
        this.playTrack(this.tracks[nextIndex].id);
    }
    
    // Премиум функции
    aiMastering(trackId) {
        if (!this.isPremium) {
            this.showPremiumModal();
            return;
        }
        
        const track = this.tracks.find(t => t.id === trackId);
        this.showMessage(`⭐ AI мастеринг трека "${track.title}"...`, 'info');
        
        // Имитация AI обработки
        setTimeout(() => {
            this.showMessage(`✅ Трек "${track.title}" отмастерен AI!`, 'success');
        }, 2000);
    }
    
    editTrack(trackId) {
        const track = this.tracks.find(t => t.id === trackId);
        this.showMessage(`🎛️ Открываем редактор для "${track.title}"`, 'info');
        
        // Здесь будет открытие редактора
        setTimeout(() => {
            window.location.href = `studio.html?track=${trackId}`;
        }, 1000);
    }
    
    downloadTrack(trackId) {
        const track = this.tracks.find(t => t.id === trackId);
        
        if (track.isPremium && !this.isPremium) {
            this.showPremiumModal();
            return;
        }
        
        // Имитация скачивания
        const link = document.createElement('a');
        link.href = track.audioUrl;
        link.download = `${track.title} - ${track.artist}.mp3`;
        link.click();
        
        this.showMessage(`📥 Скачивание "${track.title}"...`, 'success');
    }
    
    uploadTrack() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'audio/*';
        
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            this.showMessage(`📁 Загружаем "${file.name}"...`, 'info');
            
            // Имитация загрузки
            setTimeout(() => {
                this.showMessage(`✅ Трек "${file.name}" загружен!`, 'success');
                
                // Добавляем в список треков
                const newTrack = {
                    id: Date.now(),
                    title: file.name.replace(/\.[^/.]+$/, ""),
                    artist: "Вы",
                    genre: ["custom"],
                    duration: 180,
                    audioUrl: URL.createObjectURL(file),
                    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
                    description: "Ваш загруженный трек",
                    isPremium: false
                };
                
                this.tracks.unshift(newTrack);
                this.displayTracks();
                
            }, 2000);
        };
        
        input.click();
    }
    
    // Премиум система
    checkPremiumStatus() {
        // Проверяем в localStorage или Firebase
        const premiumStatus = localStorage.getItem('soundcollab_premium');
        this.isPremium = premiumStatus === 'true';
        
        if (this.isPremium) {
            document.querySelector('.premium-badge').textContent = 'PRO';
            document.querySelector('.upgrade-btn').textContent = '⭐ PRO Аккаунт';
        }
    }
    
    showPremiumModal() {
        document.getElementById('premiumModal').classList.add('active');
    }
    
    hidePremiumModal() {
        document.getElementById('premiumModal').classList.remove('active');
    }
    
    subscribe(plan) {
        this.showMessage(`💳 Оформляем подписку ${plan}...`, 'info');
        
        // Имитация оплаты
        setTimeout(() => {
            this.isPremium = true;
            localStorage.setItem('soundcollab_premium', 'true');
            
            this.hidePremiumModal();
            this.showMessage('🎉 Поздравляем! Теперь у вас Premium аккаунт!', 'success');
            
            // Обновляем интерфейс
            this.checkPremiumStatus();
            this.displayTracks();
            
        }, 2000);
    }
    
    // Вспомогательные функции
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    
    loadUserData() {
        const user = firebase.auth().currentUser;
        if (user) {
            document.getElementById('userName').textContent = user.displayName || user.email;
        }
    }
    
    showMessage(text, type = 'info') {
        const message = document.createElement('div');
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 12px;
            color: white;
            font-weight: bold;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            background: ${type === 'success' ? '#1DB954' : 
                        type === 'error' ? '#ff4757' : 
                        type === 'warning' ? '#FF9800' : '#667eea'};
            box-shadow: 0 5px 20px rgba(0,0,0,0.5);
            border: 1px solid rgba(255,255,255,0.1);
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }
    
    addTrackEventListeners() {
        // Кнопки воспроизведения
        document.querySelectorAll('.play-btn, .play-overlay-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const trackId = parseInt(e.target.closest('button').dataset.trackId);
                this.playTrack(trackId);
            });
        });
    }
}

// Глобальные функции
function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = 'index.html';
    });
}

function showPremiumModal() {
    if (musicFeed) musicFeed.showPremiumModal();
}

function hidePremiumModal() {
    if (musicFeed) musicFeed.hidePremiumModal();
}

function togglePlay() {
    if (musicFeed) musicFeed.togglePlay();
}

function toggleMute() {
    if (musicFeed) musicFeed.toggleMute();
}

function changeVolume(value) {
    if (musicFeed) musicFeed.changeVolume(value);
}

function skipPrevious() {
    if (musicFeed) musicFeed.skipPrevious();
}

function skipNext() {
    if (musicFeed) musicFeed.skipNext();
}

function seekAudio(event) {
    if (musicFeed) musicFeed.seekAudio(event);
}

function uploadTrack() {
    if (musicFeed) musicFeed.uploadTrack();
}

function subscribe(plan) {
    if (musicFeed) musicFeed.subscribe(plan);
}

// Инициализация
let musicFeed;

// Проверка авторизации
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // Пользователь вошел
        if (!musicFeed) {
            musicFeed = new MusicFeedAudio();
            window.musicFeed = musicFeed;
        }
    } else {
        // Пользователь не вошел - перенаправляем
        window.location.href = 'index.html';
    }
});

// Добавляем стили для анимаций
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);
