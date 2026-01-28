// music-feed.js - Лента музыкальных треков
class MusicFeed {
    constructor() {
        this.tracks = this.getPopularTracks();
        this.currentTrack = null;
        this.isPlaying = false;
        this.currentFilter = 'all';
        this.detailedCount = 0;

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

        console.log('Музыкальная лента готова');
    }

    // МЕТОД ТЕПЕРЬ ВНУТРИ КЛАССА!
    getPopularTracks() {
        // Популярные треки для демонстрации
        return [
            {
                id: 1,
                title: "Blinding Lights",
                artist: "The Weeknd",
                genre: ["pop", "synthetic"],
                year: 2020
            },
            {
                id: 2,
                title: "Bad Guy",
                artist: "Billie Eilish",
                genre: ["pop", "electro"],
                year: 2019
            },
            {
                id: 3,
                title: "Levitating",
                artist: "Dua Lipa",
                genre: ["pop", "disco"],
                year: 2020
            }
        ];
    }

    loadUserData() {
        // Реализация загрузки данных пользователя
        console.log('Загрузка данных пользователя...');
    }

    displayTracks() {
        // Реализация отображения треков
        console.log('Отображение треков...');
    }

    setupFilters() {
        // Реализация настройки фильтров
        console.log('Настройка фильтров...');
    }
}

// Экспорт класса
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MusicFeed;
}
