// music-feed.js - Лента музыкальных треков
class MusicFeed {
    constructor() {
        this.tracks = this.getPopularTracks();
        this.currentTrack = null;
        this.isPlaying = false;
        this.currentFilter = 'all';
        this.editedCount = 0;
        
        this.init();
    }
    
    init() {
        console.log("🎵 Инициализация музыкальной ленты...");
        
        // Загружаем данные пользователя
        this.loadUserData();
        
        // Отображаем треки
        this.displayTracks();
        
        // Настраиваем фильтры
        this.setupFilters();
        
        console.log("✅ Музыкальная лента готова");
    }
    
    getPopularTracks() {
        // Популярные треки для демонстрации
        return [
            {
                id: 1,
                title: "Blinding Lights",
                artist: "The Weeknd",
                genre: ["pop", "synthwave"],
                year: 2020,
                duration: "3:20",
                popularity: 95,
                cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
                description: "Знаменитый синтвейв-хит, который можно превратить в lo-fi версию",
                editable: true,
                trending: true
            },
            {
                id: 2,
                title: "Bad Guy",
                artist: "Billie Eilish",
                genre: ["pop", "electro"],
                year: 2019,
                duration: "3:14",
                popularity: 92,
                cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop",
                description: "Минималистичный поп-трек с глубоким басом",
                editable: true,
                trending: true
            },
            {
                id: 3,
                title: "Bohemian Rhapsody",
                artist: "Queen",
                genre: ["rock", "progressive"],
                year: 1975,
                duration: "5:55",
                popularity: 98,
                cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop",
                description: "Легендарная рок-баллада для экспериментов",
                editable: true,
                trending: false
            },
            {
                id: 4,
                title: "SICKO MODE",
                artist: "Travis Scott",
                genre: ["hiphop", "trap"],
                year: 2018,
                duration: "5:12",
                popularity: 90,
                cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
                description: "Многослойный трэп-трек для ремиксов",
                editable: true,
                trending: true
            },
            {
                id: 5,
                title: "Levitating",
                artist: "Dua Lipa",
                genre: ["pop", "disco"],
                year: 2020,
                duration: "3:23",
                popularity: 88,
                cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop",
                description: "Диско-поп хит для танцевального ремикса",
                editable: true,
                trending: false
            },
            {
                id: 6,
                title: "Shape of You",
                artist: "Ed Sheeran",
                genre: ["pop", "dancehall"],
                year: 2017,
                duration: "3:53",
                popularity: 94,
                cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
                description: "Поп-хит с карибским влиянием",
                editable: true,
                trending: false
            },
            {
                id: 7,
                title: "MIDDLE OF THE NIGHT",
                artist: "Elley Duhé",
                genre: ["pop", "electronic"],
                year: 2021,
                duration: "3:04",
                popularity: 87,
                cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop",
                description: "Эмоциональный поп-трек для переработки",
                editable: true,
                trending: true
            },
            {
                id: 8,
                title: "STAY",
                artist: "The Kid LAROI, Justin Bieber",
                genre: ["pop", "hiphop"],
                year: 2021,
                duration: "2:21",
                popularity: 96,
                cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
                description: "Поп-рэп коллаборация для экспериментов",
                editable: true,
                trending: true
            }
        ];
    }
    
    displayTracks() {
        const container = document.getElementById('tracksContainer');
        if (!container) return;
        
        // Фильтруем треки
        const filteredTracks = this.filterTracks();
        
        container.innerHTML = filteredTracks.map(track => this.createTrackCard(track)).join('');
        
        // Добавляем обработчики
        this.addTrackEventListeners();
    }
    
    filterTracks() {
        if (this.currentFilter === 'all') {
            return this.tracks;
        }
        
        if (this.currentFilter === 'trending') {
            return this.tracks.filter(track => track.trending);
        }
        
        if (this.currentFilter === 'new') {
            return this.tracks.filter(track => track.year >= 2020);
        }
        
        // Фильтр по жанру
        return this.tracks.filter(track => 
            track.genre.includes(this.currentFilter)
        );
    }
    
    createTrackCard(track) {
        const genreBadges = track.genre.map(genre => 
            `<span class="genre-badge">${genre}</span>`
        ).join('');
        
        const trendingBadge = track.trending ? 
            '<div class="trending-badge">🔥 Тренд</div>' : '';
        
        return `
            <div class="track-card" data-track-id="${track.id}">
                ${trendingBadge}
                <div class="track-header">
                    <img src="${track.cover}" class="track-cover" alt="${track.title}">
                    <div class="track-info">
                        <div class="track-title">${track.title}</div>
                        <div class="track-artist">${track.artist} • ${track.year} • ${track.duration}</div>
                        <div>${genreBadges}</div>
                        <div class="track-meta">
                            <span>🎵 ${track.description}</span>
                        </div>
                        <div class="popularity-bar">
                            <div class="popularity-fill" style="width: ${track.popularity}%;"></div>
                        </div>
                        <div style="font-size: 12px; color: rgba(255,255,255,0.5);">
                            Популярность: ${track.popularity}%
                        </div>
                    </div>
                    <div class="track-actions">
                        <button class="track-btn play-btn" data-track-id="${track.id}">
                            ▶️ Слушать
                        </button>
                        <button class="track-btn edit" data-track-id="${track.id}">
                            🎛️ Редактировать
                        </button>
                        <button class="track-btn remix" data-track-id="${track.id}">
                            🔄 Ремикс
                        </button>
                    </div>
                </div>
                
                <!-- Редактор (скрыт по умолчанию) -->
                <div class="track-editor" id="editor-${track.id}">
                    <h4 class="editor-title">🎚️ Редактировать "${track.title}"</h4>
                    <div class="editor-controls">
                        <div class="control-group">
                            <label>Громкость</label>
                            <input type="range" min="0" max="100" value="80" class="slider" 
                                   onchange="musicFeed.updateTrackParam(${track.id}, 'volume', this.value)">
                        </div>
                        <div class="control-group">
                            <label>Темп (BPM)</label>
                            <input type="range" min="60" max="180" value="120" class="slider"
                                   onchange="musicFeed.updateTrackParam(${track.id}, 'tempo', this.value)">
                        </div>
                        <div class="control-group">
                            <label>Басы</label>
                            <input type="range" min="0" max="100" value="50" class="slider"
                                   onchange="musicFeed.updateTrackParam(${track.id}, 'bass', this.value)">
                        </div>
                        <div class="control-group">
                            <label>Высокие</label>
                            <input type="range" min="0" max="100" value="50" class="slider"
                                   onchange="musicFeed.updateTrackParam(${track.id}, 'treble', this.value)">
                        </div>
                    </div>
                    <div class="editor-actions">
                        <button class="track-btn" onclick="musicFeed.saveEdit(${track.id})">
                            💾 Сохранить изменения
                        </button>
                        <button class="track-btn remix" onclick="musicFeed.createRemix(${track.id})">
                            🎵 Создать ремикс
                        </button>
                        <button class="track-btn" onclick="musicFeed.closeEditor(${track.id})">
                            ✕ Закрыть
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    addTrackEventListeners() {
        // Кнопки "Слушать"
        document.querySelectorAll('.play-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const trackId = parseInt(e.target.dataset.trackId);
                this.playTrack(trackId);
            });
        });
        
        // Кнопки "Редактировать"
        document.querySelectorAll('.track-btn.edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const trackId = parseInt(e.target.dataset.trackId);
                this.openEditor(trackId);
            });
        });
        
        // Кнопки "Ремикс"
        document.querySelectorAll('.track-btn.remix').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const trackId = parseInt(e.target.dataset.trackId);
                this.createRemix(trackId);
            });
        });
    }
    
    setupFilters() {
        document.querySelectorAll('.sidebar-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const filter = e.currentTarget.dataset.filter;
                if (filter) {
                    this.setFilter(filter);
                }
            });
        });
    }
    
    setFilter(filter) {
        this.currentFilter = filter;
        
        // Обновляем активный элемент
        document.querySelectorAll('.sidebar-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.filter === filter) {
                item.classList.add('active');
            }
        });
        
        // Обновляем треки
        this.displayTracks();
        
        console.log(`🎚️ Установлен фильтр: ${filter}`);
    }
    
    playTrack(trackId) {
        const track = this.tracks.find(t => t.id === trackId);
        if (!track) return;
        
        this.currentTrack = track;
        this.isPlaying = true;
        
        // Обновляем "Сейчас играет"
        document.getElementById('nowPlayingTitle').textContent = track.title;
        document.getElementById('nowPlayingArtist').textContent = track.artist;
        document.getElementById('popularityBar').style.width = `${track.popularity}%`;
        document.getElementById('popularityText').textContent = `${track.popularity}%`;
        
        // Обновляем кнопку воспроизведения
        document.getElementById('playBtn').textContent = '⏸️';
        
        // Визуальная обратная связь
        this.showMessage(`🎧 Слушаем: ${track.title} - ${track.artist}`, 'success');
        
        // В реальном приложении здесь будет запуск аудио
        console.log(`▶️ Воспроизведение: ${track.title}`);
    }
    
    togglePlay() {
        this.isPlaying = !this.isPlaying;
        
        const playBtn = document.getElementById('playBtn');
        if (this.isPlaying) {
            playBtn.textContent = '⏸️';
            this.showMessage('▶️ Воспроизведение продолжено', 'info');
        } else {
            playBtn.textContent = '▶️';
            this.showMessage('⏸️ Воспроизведение приостановлено', 'info');
        }
    }
    
    openEditor(trackId) {
        // Закрываем все открытые редакторы
        document.querySelectorAll('.track-editor').forEach(editor => {
            editor.classList.remove('active');
        });
        
        // Открываем нужный редактор
        const editor = document.getElementById(`editor-${trackId}`);
        if (editor) {
            editor.classList.add('active');
            editor.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            this.showMessage(`🎛️ Открыт редактор трека`, 'info');
        }
    }
    
    closeEditor(trackId) {
        const editor = document.getElementById(`editor-${trackId}`);
        if (editor) {
            editor.classList.remove('active');
        }
    }
    
    updateTrackParam(trackId, param, value) {
        console.log(`🎚️ Обновлен параметр ${param} трека ${trackId}: ${value}`);
        
        // В реальном приложении здесь будет обновление аудио
        // Сейчас просто показываем сообщение
        this.showMessage(`${param}: ${value}`, 'info');
    }
    
    saveEdit(trackId) {
        this.editedCount++;
        this.updateStats();
        
        this.showMessage('✅ Изменения сохранены! Трек добавлен в вашу библиотеку', 'success');
        this.closeEditor(trackId);
    }
    
    createRemix(trackId) {
        const track = this.tracks.find(t => t.id === trackId);
        if (!track) return;
        
        this.showMessage(`🎵 Создаем ремикс для "${track.title}"...`, 'info');
        
        // Имитация создания ремикса
        setTimeout(() => {
            this.showMessage(`🔥 Ремикс "${track.title} (SoundCollab Remix)" создан!`, 'success');
            this.editedCount++;
            this.updateStats();
        }, 1500);
    }
    
    loadUserData() {
        // Загружаем данные пользователя из Firebase/localStorage
        const user = firebase.auth().currentUser;
        if (user) {
            document.getElementById('userName').textContent = user.displayName || user.email;
        }
        
        // Загружаем статистику
        const savedStats = localStorage.getItem('soundcollab_music_stats');
        if (savedStats) {
            const stats = JSON.parse(savedStats);
            this.editedCount = stats.editedCount || 0;
        }
        
        this.updateStats();
    }
    
    updateStats() {
        document.getElementById('editedCount').textContent = this.editedCount;
        
        // Рассчитываем уровень
        let level = 'Новичок';
        if (this.editedCount >= 10) level = 'Любитель';
        if (this.editedCount >= 25) level = 'Профи';
        if (this.editedCount >= 50) level = 'Эксперт';
        if (this.editedCount >= 100) level = 'Маэстро';
        
        document.getElementById('userLevel').textContent = level;
        
        // Сохраняем статистику
        const stats = {
            editedCount: this.editedCount,
            lastUpdate: Date.now()
        };
        localStorage.setItem('soundcollab_music_stats', JSON.stringify(stats));
    }
    
    // AI помощник
    aiSuggest(action) {
        const actions = {
            'remix': 'Создаем AI-ремикс...',
            'mashup': 'Ищем трек для мэшапа...',
            'vocal': 'Генерируем AI-вокал...',
            'cover': 'Создаем обложку с помощью AI...'
        };
        
        this.showMessage(`🤖 ${actions[action] || 'Обрабатываем запрос...'}`, 'info');
        
        setTimeout(() => {
            this.showMessage('✅ Готово! Проверьте результат', 'success');
        }, 2000);
    }
    
    showMessage(text, type = 'info') {
        const message = document.createElement('div');
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
            bottom: 20px;
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
}

// Глобальные функции
function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = 'index.html';
    });
}

function createPlaylist() {
    const name = prompt('Название нового плейлиста:', 'Мой плейлист');
    if (name) {
        musicFeed.showMessage(`📝 Плейлист "${name}" создан`, 'success');
    }
}

function skipPrevious() {
    musicFeed.showMessage('⏮️ Предыдущий трек', 'info');
}

function skipNext() {
    musicFeed.showMessage('⏭️ Следующий трек', 'info');
}

// Инициализация
let musicFeed;

// Проверка авторизации
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // Пользователь вошел
        if (!musicFeed) {
            musicFeed = new MusicFeed();
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
`;
document.head.appendChild(style);
