// music-feed.js - Лента музыкальных треков
// music-feed.js - Лента музыкальных треков SoundCollab

class MusicFeed {
    constructor() {
        this.tracks = this.getPopularTracks();
        this.currentTrack = null;
        this.isPlaying = false;
        this.currentFilter = 'all';
        this.detailedCount = 0;
        this.audioContext = null;
        this.audioElement = null;
        this.analyser = null;

        this.init();
    }

    init() {
        console.log('Инициализация музыкальной ленты...');

        // Загружаем данные пользователя
        this.loadUserData();

        // Отображаем треки
        this.displayTracks();

        // Настраиваем фильтры
        this.setupFilters();

        // Настраиваем аудио
        this.setupAudio();

        // Настраиваем кнопки
        this.setupControls();

        console.log('Музыкальная лента готова');
    }

    // МЕТОД ВНУТРИ КЛАССА!
    getPopularTracks() {
        // Популярные треки для демонстрации
        return [
            {
                id: 1,
                title: "Blinding Lights",
                artist: "The Weeknd",
                genre: ["pop", "synthetic"],
                year: 2020,
                duration: "3:22",
                plays: "2.1M",
                likes: 150000,
                isPremium: false,
                color: "#FF6B6B"
            },
            {
                id: 2,
                title: "Bad Guy",
                artist: "Billie Eilish",
                genre: ["pop", "electro"],
                year: 2019,
                duration: "3:14",
                plays: "1.8M",
                likes: 120000,
                isPremium: true,
                color: "#4ECDC4"
            },
            {
                id: 3,
                title: "Levitating",
                artist: "Dua Lipa",
                genre: ["pop", "disco"],
                year: 2020,
                duration: "3:24",
                plays: "1.5M",
                likes: 98000,
                isPremium: false,
                color: "#FFD166"
            },
            {
                id: 4,
                title: "Save Your Tears",
                artist: "The Weeknd",
                genre: ["pop", "R&B"],
                year: 2020,
                duration: "3:35",
                plays: "1.3M",
                likes: 85000,
                isPremium: true,
                color: "#06D6A0"
            },
            {
                id: 5,
                title: "Stay",
                artist: "The Kid LAROI, Justin Bieber",
                genre: ["pop", "hip-hop"],
                year: 2021,
                duration: "2:23",
                plays: "1.9M",
                likes: 110000,
                isPremium: false,
                color: "#118AB2"
            },
            {
                id: 6,
                title: "Good 4 U",
                artist: "Olivia Rodrigo",
                genre: ["pop", "rock"],
                year: 2021,
                duration: "2:58",
                plays: "1.6M",
                likes: 95000,
                isPremium: true,
                color: "#EF476F"
            }
        ];
    }

    loadUserData() {
        // Проверяем авторизацию
        const userData = localStorage.getItem('soundcollab_user');
        this.user = userData ? JSON.parse(userData) : { isDemo: true };
        
        console.log('Пользователь загружен:', this.user.isDemo ? 'Демо-режим' : 'Авторизован');
    }

    displayTracks() {
        const feedContainer = document.getElementById('tracks-feed');
        if (!feedContainer) {
            console.error('Контейнер треков не найден');
            return;
        }

        // Фильтруем треки
        const filteredTracks = this.filterTracks(this.tracks, this.currentFilter);

        // Отображаем треки
        feedContainer.innerHTML = filteredTracks.map(track => this.createTrackCard(track)).join('');

        // Добавляем обработчики событий
        this.addTrackEventListeners();
    }

    filterTracks(tracks, filter) {
        if (filter === 'all') return tracks;
        if (filter === 'premium') return tracks.filter(t => t.isPremium);
        if (filter === 'free') return tracks.filter(t => !t.isPremium);
        
        // Фильтр по жанру
        return tracks.filter(t => t.genre.includes(filter));
    }

    createTrackCard(track) {
        const isLocked = track.isPremium && (!this.user || this.user.isDemo);
        
        return `
            <div class="track-card" data-id="${track.id}">
                <div class="track-header" style="background: ${track.color}20">
                    <div class="track-number">#${track.id}</div>
                    ${track.isPremium ? '<span class="premium-badge">PREMIUM</span>' : ''}
                    ${isLocked ? '<span class="locked-badge">🔒</span>' : ''}
                </div>
                <div class="track-content">
                    <div class="track-cover" style="background: ${track.color}"></div>
                    <div class="track-info">
                        <h4 class="track-title">${track.title}</h4>
                        <p class="track-artist">${track.artist}</p>
                        <div class="track-meta">
                            <span>🎵 ${track.genre.join(', ')}</span>
                            <span>📅 ${track.year}</span>
                            <span>⏱️ ${track.duration}</span>
                        </div>
                    </div>
                </div>
                <div class="track-stats">
                    <span>▶️ ${track.plays}</span>
                    <span>❤️ ${this.formatNumber(track.likes)}</span>
                </div>
                <div class="track-actions">
                    ${isLocked ? 
                        `<button class="btn-upgrade" onclick="musicFeed.upgradeToPremium()">⭐ Апгрейд</button>` : 
                        `<button class="btn-play" data-id="${track.id}">▶ Воспроизвести</button>`
                    }
                    <button class="btn-like" data-id="${track.id}">❤️</button>
                    <button class="btn-share" data-id="${track.id}">↗️</button>
                </div>
            </div>
        `;
    }

    setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Убираем активный класс у всех кнопок
                filterButtons.forEach(b => b.classList.remove('active'));
                
                // Добавляем активный класс текущей кнопке
                e.target.classList.add('active');
                
                // Меняем фильтр
                this.currentFilter = e.target.dataset.filter;
                
                // Обновляем ленту
                this.displayTracks();
            });
        });
    }

    setupAudio() {
        // Создаем скрытый audio элемент
        this.audioElement = document.createElement('audio');
        this.audioElement.style.display = 'none';
        document.body.appendChild(this.audioElement);

        // Создаем AudioContext для визуализации
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
        } catch (e) {
            console.warn('Web Audio API не поддерживается:', e);
        }
    }

    setupControls() {
        // Глобальные кнопки управления
        const playAllBtn = document.getElementById('play-all-btn');
        if (playAllBtn) {
            playAllBtn.addEventListener('click', () => this.playAllTracks());
        }

        const shuffleBtn = document.getElementById('shuffle-btn');
        if (shuffleBtn) {
            shuffleBtn.addEventListener('click', () => this.shuffleTracks());
        }
    }

    addTrackEventListeners() {
        // Кнопки воспроизведения
        document.querySelectorAll('.btn-play').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const trackId = parseInt(e.target.dataset.id);
                this.playTrack(trackId);
            });
        });

        // Кнопки лайков
        document.querySelectorAll('.btn-like').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const trackId = parseInt(e.target.dataset.id);
                this.likeTrack(trackId);
            });
        });

        // Кнопки поделиться
        document.querySelectorAll('.btn-share').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const trackId = parseInt(e.target.dataset.id);
                this.shareTrack(trackId);
            });
        });
    }

    playTrack(trackId) {
        const track = this.tracks.find(t => t.id === trackId);
        if (!track) return;

        console.log('Воспроизведение трека:', track.title);
        
        // Останавливаем текущий трек
        if (this.currentTrack && this.isPlaying) {
            this.audioElement.pause();
        }

        // Устанавливаем новый трек
        this.currentTrack = track;
        
        // В демо-режиме используем заглушку
        if (window.isDemoMode || !track.audioUrl) {
            this.showDemoPlayer(track);
        } else {
            // В реальном режиме загружаем аудио
            this.loadAndPlayAudio(track);
        }

        // Обновляем UI
        this.updatePlayerUI(track);
    }

    showDemoPlayer(track) {
        alert(`🎵 Демо-воспроизведение: ${track.title} - ${track.artist}\n\nВ реальном режиме здесь будет загружено аудио.`);
        
        // Создаем визуализацию
        this.createWaveform();
        
        // Устанавливаем статус воспроизведения
        this.isPlaying = true;
        
        // Автоматическая остановка через 5 секунд (демо)
        setTimeout(() => {
            this.isPlaying = false;
            const playBtn = document.querySelector('.player-play-btn');
            if (playBtn) playBtn.textContent = '▶';
        }, 5000);
    }

    loadAndPlayAudio(track) {
        // Здесь будет реальная загрузка аудио
        console.log('Загрузка аудио для трека:', track.title);
        // this.audioElement.src = track.audioUrl;
        // this.audioElement.play();
    }

    updatePlayerUI(track) {
        const player = document.getElementById('music-player');
        if (!player) return;

        player.innerHTML = `
            <div class="player-cover" style="background: ${track.color}"></div>
            <div class="player-info">
                <h3>${track.title}</h3>
                <p>${track.artist}</p>
            </div>
            <div class="player-controls">
                <button class="player-btn prev-btn">⏮</button>
                <button class="player-btn player-play-btn">${this.isPlaying ? '⏸' : '▶'}</button>
                <button class="player-btn next-btn">⏭</button>
            </div>
            <div class="player-progress">
                <div class="progress-bar">
                    <div class="progress" style="width: 50%"></div>
                </div>
                <div class="player-time">2:30 / ${track.duration}</div>
            </div>
            <div class="player-waveform" id="waveform"></div>
        `;

        // Добавляем обработчики для player кнопок
        this.setupPlayerControls();
    }

    setupPlayerControls() {
        const playBtn = document.querySelector('.player-play-btn');
        if (playBtn) {
            playBtn.addEventListener('click', () => this.togglePlayback());
        }

        const prevBtn = document.querySelector('.prev-btn');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.playPrevious());
        }

        const nextBtn = document.querySelector('.next-btn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.playNext());
        }
    }

    togglePlayback() {
        this.isPlaying = !this.isPlaying;
        
        const playBtn = document.querySelector('.player-play-btn');
        if (playBtn) {
            playBtn.textContent = this.isPlaying ? '⏸' : '▶';
        }
        
        if (this.isPlaying) {
            console.log('Воспроизведение');
        } else {
            console.log('Пауза');
        }
    }

    playPrevious() {
        if (!this.currentTrack) return;
        
        const currentIndex = this.tracks.findIndex(t => t.id === this.currentTrack.id);
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : this.tracks.length - 1;
        
        this.playTrack(this.tracks[prevIndex].id);
    }

    playNext() {
        if (!this.currentTrack) return;
        
        const currentIndex = this.tracks.findIndex(t => t.id === this.currentTrack.id);
        const nextIndex = currentIndex < this.tracks.length - 1 ? currentIndex + 1 : 0;
        
        this.playTrack(this.tracks[nextIndex].id);
    }

    playAllTracks() {
        console.log('Воспроизведение всех треков...');
        if (this.tracks.length > 0) {
            this.playTrack(this.tracks[0].id);
        }
    }

    shuffleTracks() {
        console.log('Перемешивание треков...');
        
        // Перемешиваем массив
        const shuffled = [...this.tracks].sort(() => Math.random() - 0.5);
        this.tracks = shuffled;
        
        // Обновляем отображение
        this.displayTracks();
        
        // Если играет трек, останавливаем
        if (this.isPlaying) {
            this.audioElement.pause();
            this.isPlaying = false;
            this.currentTrack = null;
        }
    }

    likeTrack(trackId) {
        const track = this.tracks.find(t => t.id === trackId);
        if (!track) return;

        track.likes += 1;
        console.log(`Лайк для "${track.title}": ${track.likes} лайков`);
        
        // Обновляем отображение
        this.displayTracks();
        
        // Показываем уведомление
        this.showNotification(`❤️ Вам понравился "${track.title}"`);
    }

    shareTrack(trackId) {
        const track = this.tracks.find(t => t.id === trackId);
        if (!track) return;

        const shareUrl = `${window.location.origin}/track.html?id=${trackId}`;
        const shareText = `Послушай "${track.title}" от ${track.artist} на SoundCollab!`;
        
        if (navigator.share) {
            navigator.share({
                title: track.title,
                text: shareText,
                url: shareUrl
            });
        } else {
            navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
            this.showNotification('📋 Ссылка скопирована в буфер обмена!');
        }
    }

    upgradeToPremium() {
        console.log('Переход на премиум...');
        alert('🎵 Апгрейд до SoundCollab Premium\n\nОткройте премиум функции:\n• Все треки без ограничений\n• AI генерация изображений\n• Расширенный редактор\n\nНажмите "Апгрейд" в шапке сайта.');
    }

    createWaveform() {
        const waveform = document.getElementById('waveform');
        if (!waveform) return;

        // Создаем простую демо-визуализацию
        waveform.innerHTML = '';
        for (let i = 0; i < 50; i++) {
            const bar = document.createElement('div');
            bar.className = 'wave-bar';
            bar.style.height = `${Math.random() * 60 + 20}px`;
            bar.style.animationDelay = `${i * 0.05}s`;
            waveform.appendChild(bar);
        }
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    showNotification(message) {
        // Создаем уведомление
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #667eea;
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Удаляем через 3 секунды
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.musicFeed = new MusicFeed();
    
    // Добавляем стили для уведомлений
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
        .wave-bar {
            width: 3px;
            background: linear-gradient(to top, #667eea, #764ba2);
            margin: 0 1px;
            animation: wave 1s ease-in-out infinite alternate;
        }
        @keyframes wave {
            from { height: 20px; }
            to { height: 80px; }
        }
    `;
    document.head.appendChild(style);
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MusicFeed;
}
