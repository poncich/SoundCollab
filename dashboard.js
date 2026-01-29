// dashboard.js - Полная логика Dashboard SoundCollab

class Dashboard {
    constructor() {
        console.log('🎵 Инициализация Dashboard...');
        
        // Проверяем авторизацию
        if (!this.checkAuth()) {
            return;
        }
        
        this.user = null;
        this.projects = [];
        this.stats = {};
        this.activity = [];
        this.isPremium = false;
        
        this.loadUserData();
        this.init();
    }

    checkAuth() {
        const userData = localStorage.getItem('soundcollab_user');
        if (!userData) {
            console.error('❌ Пользователь не авторизован');
            window.location.href = 'login.html';
            return false;
        }
        
        return true;
    }

    loadUserData() {
        try {
            const userData = localStorage.getItem('soundcollab_user');
            this.user = JSON.parse(userData);
            this.isPremium = localStorage.getItem('soundcollab_premium') === 'true';
            
            console.log('👤 Пользователь загружен:', this.user.displayName);
        } catch (error) {
            console.error('❌ Ошибка загрузки пользователя:', error);
            this.user = this.createDemoUser();
        }
    }

    createDemoUser() {
        return {
            uid: 'demo-fallback',
            email: 'demo@example.com',
            displayName: 'Демо Пользователь',
            isDemo: true,
            stats: {
                projects: 3,
                tracks: 15,
                collaborations: 2,
                storageUsed: '1.2 GB'
            }
        };
    }

    init() {
        console.log('🚀 Запуск Dashboard...');
        
        // Загружаем данные
