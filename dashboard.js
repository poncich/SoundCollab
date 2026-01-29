// dashboard.js - Основная панель управления SoundCollab

class Dashboard {
    constructor() {
        this.user = null;
        this.projects = [];
        this.isPremium = false;
        
        this.init();
    }

    init() {
        console.log('Инициализация Dashboard...');
        
        // Проверяем авторизацию
        this.checkAuth();
        
        // Загружаем данные
        this.loadData();
        
        // Настраиваем UI
        this.setupUI();
        
        console.log('Dashboard готов');
    }

    checkAuth() {
        // Проверяем есть ли данные пользователя в localStorage
        const userData = localStorage.getItem('soundcollab_user');
        
        if (userData) {
            this.user = JSON.parse(userData);
            console.log('Пользователь найден:', this.user.email);
        } else {
            // Демо-пользователь
            this.user = {
                uid: 'demo-user-123',
                email: 'demo@soundcollab.com',
                displayName: 'Демо Пользователь',
                photoURL: '',
                isDemo: true
            };
            console.log('Демо-режим активирован');
        }
        
        // Проверяем премиум статус
        this.isPremium = localStorage.getItem('soundcollab_premium') === 'true';
    }

    loadData() {
        // Загружаем проекты
        this.loadProjects();
        
        // Загружаем статистику
        this.loadStats();
        
        // Загружаем активность
        this.loadActivity();
    }

    loadProjects() {
        // Демо-проекты
        this.projects = [
            {
                id: 1,
                name: 'Summer Vibes',
                type: 'Трек',
                created: '2024-01-15',
                collaborators: 2,
                lastModified: '2 часа назад',
                color: '#667eea'
            },
            {
                id: 2,
                name: 'Lo-Fi Study',
                type: 'Альбом',
                created: '2024-01-10',
                collaborators: 1,
                lastModified: 'Вчера',
                color: '#764ba2'
            },
            {
                id: 3,
                name: 'Electronic Dreams',
                type: 'Трек',
                created: '2024-01-05',
                collaborators: 3,
                lastModified: '3 дня назад',
                color: '#f093fb'
            },
            {
                id: 4,
                name: 'Morning Jazz',
                type: 'EP',
                created: '2024-01-01',
                collaborators: 0,
                lastModified: 'Неделю назад',
                color: '#4facfe'
            }
        ];
    }

    loadStats() {
        // Демо-статистика
        this.stats = {
            tracksCreated: 12,
            totalTime: '4ч 30м',
            collaborations: 8,
            storageUsed: '2.4 GB'
        };
    }

    loadActivity() {
        // Демо-активность
        this.activity = [
            { user: 'Алексей', action: 'добавил новый трек', time: '10 минут назад' },
            { user: 'Мария', action: 'отредактировала проект "Summer Vibes"', time: '1 час назад' },
            { user: 'Вы', action: 'сгенерировали обложку AI', time: '3 часа назад' },
            { user: 'Денис', action: 'присоединился к коллаборации', time: 'Вчера' }
        ];
    }

    setupUI() {
        // Устанавливаем имя пользователя
        const userNameEl = document.getElementById('username');
        if (userNameEl) {
            userNameEl.textContent = this.user.displayName || this.user.email;
        }

        // Устанавливаем аватар
        const avatarEl = document.getElementById('user-avatar');
        if (avatarEl) {
            if (this.user.photoURL) {
                avatarEl.style.backgroundImage = `url(${this.user.photoURL})`;
            } else {
                // Градиент для демо
                const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe'];
                const color = colors[Math.floor(Math.random() * colors.length)];
                avatarEl.style.background = `linear-gradient(45deg, ${color}, #${Math.random().toString(16).slice(2, 8)})`;
                avatarEl.innerHTML = this.user.displayName?.charAt(0) || 'Д';
            }
        }

        // Показываем премиум бейдж
        const premiumBadge = document.getElementById('premium-badge');
        if (premiumBadge) {
            premiumBadge.style.display = this.isPremium ? 'block' : 'none';
        }

        // Заполняем статистику
        this.renderStats();
        
        // Заполняем проекты
        this.renderProjects();
        
        // Заполняем активность
        this.renderActivity();
        
        // Скрываем loading
        setTimeout(() => {
            const loadingEl = document.querySelector('.loading');
            if (loadingEl) {
                loadingEl.style.display = 'none';
            }
            
            const contentEl = document.querySelector('.dashboard-content');
            if (contentEl) {
                contentEl.style.display = 'block';
            }
        }, 500);
    }

    renderStats() {
        const statsContainer = document.getElementById('stats-container');
        if (!statsContainer) return;

        statsContainer.innerHTML = `
            <div class="stat-card">
                <div class="stat-icon">🎵</div>
                <div class="stat-value">${this.stats.tracksCreated}</div>
                <div class="stat-label">Треков создано</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">⏱️</div>
                <div class="stat-value">${this.stats.totalTime}</div>
                <div class="stat-label">В музыке</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">👥</div>
                <div class="stat-value">${this.stats.collaborations}</div>
                <div class="stat-label">Коллабораций</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">💾</div>
                <div class="stat-value">${this.stats.storageUsed}</div>
                <div class="stat-label">Хранилище</div>
            </div>
        `;
    }

    renderProjects() {
        const projectsContainer = document.getElementById('projects-container');
        if (!projectsContainer) return;

        projectsContainer.innerHTML = this.projects.map(project => `
            <div class="project-card">
                <div class="project-header">
                    <div class="project-color" style="background: ${project.color}"></div>
                    <div class="project-info">
                        <h4>${project.name}</h4>
                        <span class="project-type">${project.type}</span>
                    </div>
                    <div class="project-menu">⋯</div>
                </div>
                <div class="project-details">
                    <div class="project-meta">
                        <span>📅 ${project.created}</span>
                        <span>👥 ${project.collaborators}</span>
                    </div>
                    <div class="project-last">
                        Изменен: ${project.lastModified}
                    </div>
                </div>
                <div class="project-actions">
                    <button class="btn-open">Открыть</button>
                    <button class="btn-share">Поделиться</button>
                </div>
            </div>
        `).join('');

        // Добавляем обработчики кнопок
        this.setupProjectButtons();
    }

    renderActivity() {
        const activityContainer = document.getElementById('activity-container');
        if (!activityContainer) return;

        activityContainer.innerHTML = this.activity.map(item => `
            <div class="activity-item">
                <div class="activity-avatar">${item.user.charAt(0)}</div>
                <div class="activity-content">
                    <strong>${item.user}</strong> ${item.action}
                    <div class="activity-time">${item.time}</div>
                </div>
            </div>
        `).join('');
    }

    setupProjectButtons() {
        // Кнопки открытия проектов
        document.querySelectorAll('.btn-open').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const project = this.projects[index];
                alert(`Открываем проект: ${project.name}`);
                // Здесь будет навигация к проекту
            });
        });

        // Кнопки поделиться
        document.querySelectorAll('.btn-share').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const project = this.projects[index];
                this.shareProject(project);
            });
        });
    }

    shareProject(project) {
        const shareUrl = `${window.location.origin}/project.html?id=${project.id}`;
        
        if (navigator.share) {
            navigator.share({
                title: project.name,
                text: `Посмотри мой проект на SoundCollab: ${project.name}`,
                url: shareUrl
            });
        } else {
            // Fallback
            navigator.clipboard.writeText(shareUrl);
            alert('Ссылка скопирована в буфер обмена!');
        }
    }

    // Метод для обновления данных (можно вызывать извне)
    refresh() {
        console.log('Обновление Dashboard...');
        this.loadData();
        this.setupUI();
    }
}

// Инициализация Dashboard при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
    
    // Обновление по кнопке (если есть)
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            window.dashboard.refresh();
        });
    }
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Dashboard;
}
