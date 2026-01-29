// dashboard.js - Основная панель управления SoundCollab

// dashboard.js - Основная панель управления SoundCollab

class Dashboard {
    constructor() {
        this.user = null;
        this.projects = [];
        this.isPremium = false;
        this.stats = {};
        this.activity = [];
        this.loadingTimeout = null;
        
        this.init();
    }

    init() {
        console.log('🚀 Инициализация Dashboard...');
        
        // Проверяем авторизацию
        this.checkAuth();
        
        // Загружаем данные
        this.loadData();
        
        // Настраиваем UI
        this.setupUI();
        
        console.log('✅ Dashboard готов');
    }

    checkAuth() {
        // Проверяем есть ли данные пользователя в localStorage
        const userData = localStorage.getItem('soundcollab_user');
        
        if (userData) {
            try {
                this.user = JSON.parse(userData);
                console.log('👤 Пользователь найден:', this.user.email);
            } catch (e) {
                console.error('Ошибка парсинга пользователя:', e);
                this.user = this.createDemoUser();
            }
        } else {
            // Демо-пользователь
            this.user = this.createDemoUser();
        }
        
        // Проверяем премиум статус
        this.isPremium = localStorage.getItem('soundcollab_premium') === 'true';
    }

    createDemoUser() {
        return {
            uid: 'demo-user-' + Math.random().toString(36).substr(2, 9),
            email: 'demo@soundcollab.com',
            displayName: 'Демо Пользователь',
            photoURL: '',
            isDemo: true,
            createdAt: new Date().toISOString()
        };
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
                color: '#667eea',
                description: 'Летняя электронная музыка'
            },
            {
                id: 2,
                name: 'Lo-Fi Study',
                type: 'Альбом',
                created: '2024-01-10',
                collaborators: 1,
                lastModified: 'Вчера',
                color: '#764ba2',
                description: 'Расслабляющие биты для учебы'
            },
            {
                id: 3,
                name: 'Electronic Dreams',
                type: 'Трек',
                created: '2024-01-05',
                collaborators: 3,
                lastModified: '3 дня назад',
                color: '#f093fb',
                description: 'Экспериментальная электроника'
            },
            {
                id: 4,
                name: 'Morning Jazz',
                type: 'EP',
                created: '2024-01-01',
                collaborators: 0,
                lastModified: 'Неделю назад',
                color: '#4facfe',
                description: 'Утренние джазовые импровизации'
            }
        ];
    }

    loadStats() {
        // Демо-статистика
        this.stats = {
            tracksCreated: 12,
            totalTime: '4ч 30м',
            collaborations: 8,
            storageUsed: '2.4 GB',
            followers: 156,
            following: 89
        };
    }

    loadActivity() {
        // Демо-активность
        this.activity = [
            { 
                user: 'Алексей', 
                action: 'добавил новый трек "Night Drive"', 
                time: '10 минут назад',
                avatarColor: '#FF6B6B'
            },
            { 
                user: 'Мария', 
                action: 'отредактировала проект "Summer Vibes"', 
                time: '1 час назад',
                avatarColor: '#4ECDC4'
            },
            { 
                user: 'Вы', 
                action: 'сгенерировали обложку AI для проекта', 
                time: '3 часа назад',
                avatarColor: '#667eea'
            },
            { 
                user: 'Денис', 
                action: 'присоединился к вашей коллаборации', 
                time: 'Вчера',
                avatarColor: '#FFD166'
            },
            { 
                user: 'София', 
                action: 'лайкнула ваш трек "Morning Jazz"', 
                time: '2 дня назад',
                avatarColor: '#06D6A0'
            }
        ];
    }

    setupUI() {
        console.log('🎨 Настройка интерфейса...');
        
        // Устанавливаем имя пользователя
        this.updateUserName();
        
        // Устанавливаем аватар
        this.updateUserAvatar();
        
        // Показываем премиум бейдж
        this.updatePremiumBadge();
        
        // Заполняем статистику
        this.renderStats();
        
        // Заполняем проекты
        this.renderProjects();
        
        // Заполняем активность
        this.renderActivity();
        
        // Настраиваем кнопки
        this.setupButtons();
        
        // Скрываем loading через 2 секунды
        this.hideLoading();
        
        // Таймаут на загрузку (fallback)
        this.loadingTimeout = setTimeout(() => {
            this.forceDemoMode();
        }, 5000);
    }

    updateUserName() {
        const userNameEl = document.getElementById('username');
        if (userNameEl) {
            userNameEl.textContent = this.user.displayName || this.user.email;
        }
        
        const userEmailEl = document.getElementById('user-email');
        if (userEmailEl) {
            userEmailEl.textContent = this.user.email;
        }
    }

    updateUserAvatar() {
        const avatarEl = document.getElementById('user-avatar');
        if (!avatarEl) return;
        
        if (this.user.photoURL) {
            avatarEl.style.backgroundImage = `url(${this.user.photoURL})`;
            avatarEl.innerHTML = '';
        } else {
            // Градиент для демо
            const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const gradient = `linear-gradient(135deg, ${color}, ${this.lightenColor(color, 30)})`;
            
            avatarEl.style.background = gradient;
            avatarEl.innerHTML = this.user.displayName?.charAt(0)?.toUpperCase() || 'Д';
            avatarEl.style.display = 'flex';
            avatarEl.style.alignItems = 'center';
            avatarEl.style.justifyContent = 'center';
            avatarEl.style.color = 'white';
            avatarEl.style.fontWeight = 'bold';
            avatarEl.style.fontSize = '24px';
        }
    }

    updatePremiumBadge() {
        const premiumBadge = document.getElementById('premium-badge');
        if (premiumBadge) {
            premiumBadge.style.display = this.isPremium ? 'inline-flex' : 'none';
            premiumBadge.innerHTML = this.isPremium ? '⭐ PRO' : '🔓 FREE';
        }
    }

    renderStats() {
        const statsContainer = document.getElementById('stats-container');
        if (!statsContainer) return;

        statsContainer.innerHTML = `
            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #667eea, #764ba2);">🎵</div>
                <div class="stat-value">${this.stats.tracksCreated}</div>
                <div class="stat-label">Треков создано</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #FF6B6B, #FF8E53);">⏱️</div>
                <div class="stat-value">${this.stats.totalTime}</div>
                <div class="stat-label">В музыке</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #4ECDC4, #44A08D);">👥</div>
                <div class="stat-value">${this.stats.collaborations}</div>
                <div class="stat-label">Коллабораций</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #FFD166, #FFB347);">💾</div>
                <div class="stat-value">${this.stats.storageUsed}</div>
                <div class="stat-label">Хранилище</div>
            </div>
        `;
    }

    renderProjects() {
        const projectsContainer = document.getElementById('projects-container');
        if (!projectsContainer) return;

        projectsContainer.innerHTML = this.projects.map(project => `
            <div class="project-card" style="border-left: 4px solid ${project.color};">
                <div class="project-header">
                    <div class="project-color" style="background: ${project.color}"></div>
                    <div class="project-info">
                        <h4>${project.name}</h4>
                        <span class="project-type">${project.type}</span>
                        <p class="project-description">${project.description}</p>
                    </div>
                    <div class="project-menu" onclick="dashboard.showProjectMenu(${project.id})">⋯</div>
                </div>
                <div class="project-details">
                    <div class="project-meta">
                        <span title="Дата создания">📅 ${project.created}</span>
                        <span title="Коллабораторы">👥 ${project.collaborators}</span>
                        <span title="Статус">${project.collaborators > 0 ? '👑 Активная' : '💤 Черновик'}</span>
                    </div>
                    <div class="project-last">
                        📝 Изменен: ${project.lastModified}
                    </div>
                </div>
                <div class="project-actions">
                    <button class="btn-open" onclick="dashboard.openProject(${project.id})">
                        🎧 Открыть
                    </button>
                    <button class="btn-share" onclick="dashboard.shareProject(${project.id})">
                        ↗️ Поделиться
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderActivity() {
        const activityContainer = document.getElementById('activity-container');
        if (!activityContainer) return;

        activityContainer.innerHTML = this.activity.map(item => `
            <div class="activity-item">
                <div class="activity-avatar" style="background: ${item.avatarColor}">
                    ${item.user.charAt(0)}
                </div>
                <div class="activity-content">
                    <div class="activity-header">
                        <strong>${item.user}</strong> ${item.action}
                    </div>
                    <div class="activity-time">🕒 ${item.time}</div>
                </div>
            </div>
        `).join('');
    }

    setupButtons() {
        // Кнопка обновления
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refresh();
                this.showNotification('🔄 Данные обновлены');
            });
        }

        // Кнопка нового проекта
        const newProjectBtn = document.getElementById('new-project-btn');
        if (newProjectBtn) {
            newProjectBtn.addEventListener('click', () => {
                this.createNewProject();
            });
        }

        // Кнопка премиум
        const upgradeBtn = document.getElementById('upgrade-btn');
        if (upgradeBtn) {
            upgradeBtn.addEventListener('click', () => {
                this.upgradeToPremium();
            });
        }
    }

    hideLoading() {
        setTimeout(() => {
            const loadingEl = document.querySelector('.loading');
            if (loadingEl) {
                loadingEl.style.opacity = '0';
                loadingEl.style.transition = 'opacity 0.5s ease';
                setTimeout(() => {
                    loadingEl.style.display = 'none';
                }, 500);
            }
            
            const contentEl = document.querySelector('.dashboard-content');
            if (contentEl) {
                contentEl.style.opacity = '0';
                contentEl.style.display = 'block';
                setTimeout(() => {
                    contentEl.style.transition = 'opacity 0.5s ease';
                    contentEl.style.opacity = '1';
                }, 50);
            }
        }, 2000);
    }

    forceDemoMode() {
        console.log('⚠️ Включаем принудительный демо-режим');
        
        // Очищаем таймаут
        if (this.loadingTimeout) {
            clearTimeout(this.loadingTimeout);
            this.loadingTimeout = null;
        }
        
        // Скрываем loading
        const loadingEl = document.querySelector('.loading');
        if (loadingEl) {
            loadingEl.style.display = 'none';
        }
        
        // Показываем контент
        const contentEl = document.querySelector('.dashboard-content');
        if (contentEl) {
            contentEl.style.display = 'block';
            contentEl.style.opacity = '1';
        }
        
        // Устанавливаем демо-данные
        this.user = this.createDemoUser();
        this.isPremium = false;
        
        // Обновляем UI
        this.updateUserName();
        this.updateUserAvatar();
        this.updatePremiumBadge();
        this.renderStats();
        this.renderProjects();
        this.renderActivity();
        
        // Показываем уведомление
        this.showNotification('🎵 Включен демо-режим. Подключите Firebase для полного доступа.');
    }

    // Методы действий
    openProject(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            console.log('Открываем проект:', project.name);
            this.showNotification(`🎧 Открыт проект "${project.name}"`);
            // В будущем: window.location.href = `/project.html?id=${projectId}`;
        }
    }

    shareProject(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;

        const shareUrl = `${window.location.origin}/project.html?id=${projectId}`;
        const shareText = `Посмотри мой проект "${project.name}" на SoundCollab!`;
        
        if (navigator.share) {
            navigator.share({
                title: project.name,
                text: shareText,
                url: shareUrl
            });
        } else {
            navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
            this.showNotification('📋 Ссылка скопирована в буфер обмена!');
        }
    }

    createNewProject() {
        const projectName = prompt('Введите название нового проекта:', 'Мой новый трек');
        if (!projectName) return;
        
        const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#FF6B6B', '#4ECDC4'];
        const newProject = {
            id: this.projects.length + 1,
            name: projectName,
            type: 'Трек',
            created: new Date().toLocaleDateString('ru-RU'),
            collaborators: 0,
            lastModified: 'Только что',
            color: colors[Math.floor(Math.random() * colors.length)],
            description: 'Новый проект'
        };
        
        this.projects.unshift(newProject);
        this.renderProjects();
        this.showNotification(`✅ Создан проект "${projectName}"`);
    }

    upgradeToPremium() {
        const upgradeConfirmed = confirm(`🎵 Апгрейд до SoundCollab Premium\n\nПремиум функции:\n• Все треки без ограничений\n• AI генерация изображений\n• Расширенный редактор\n• Приоритетная поддержка\n\nХотите продолжить?`);
        
        if (upgradeConfirmed) {
            this.isPremium = true;
            localStorage.setItem('soundcollab_premium', 'true');
            this.updatePremiumBadge();
            this.showNotification('⭐ Поздравляем! Вы получили SoundCollab Premium!');
        }
    }

    showProjectMenu(projectId) {
        const menuItems = [
            { text: '📝 Переименовать', action: () => this.renameProject(projectId) },
            { text: '🎨 Сменить цвет', action: () => this.changeProjectColor(projectId) },
            { text: '👥 Пригласить', action: () => this.inviteToProject(projectId) },
            { text: '📊 Статистика', action: () => this.showProjectStats(projectId) },
            { text: '🗑️ Удалить', action: () => this.deleteProject(projectId) }
        ];
        
        // Простое меню через prompt
        const menuText = menuItems.map((item, i) => `${i + 1}. ${item.text}`).join('\n');
        const choice = prompt(`Выберите действие для проекта:\n\n${menuText}`);
        
        const index = parseInt(choice) - 1;
        if (index >= 0 && index < menuItems.length) {
            menuItems[index].action();
        }
    }

    renameProject(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;
        
        const newName = prompt('Введите новое название:', project.name);
        if (newName && newName.trim()) {
            project.name = newName.trim();
            project.lastModified = 'Только что';
            this.renderProjects();
            this.showNotification(`📝 Проект переименован в "${newName}"`);
        }
    }

    changeProjectColor(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;
        
        const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0'];
        const colorText = colors.map((c, i) => `${i + 1}. ${c}`).join('\n');
        
        const choice = prompt(`Выберите цвет (1-${colors.length}):\n\n${colorText}`);
        const index = parseInt(choice) - 1;
        
        if (index >= 0 && index < colors.length) {
            project.color = colors[index];
            project.lastModified = 'Только что';
            this.renderProjects();
            this.showNotification('🎨 Цвет проекта изменен');
        }
    }

    inviteToProject(projectId) {
        const email = prompt('Введите email для приглашения:');
        if (email) {
            this.showNotification(`📧 Приглашение отправлено на ${email}`);
        }
    }

    showProjectStats(projectId) {
        alert('📊 Статистика проекта\n\nВ реальном режиме здесь будет детальная статистика по прослушиваниям, лайкам и активности.');
    }

    deleteProject(projectId) {
        const confirmDelete = confirm('Вы уверены что хотите удалить этот проект?');
        if (confirmDelete) {
            this.projects = this.projects.filter(p => p.id !== projectId);
            this.renderProjects();
            this.showNotification('🗑️ Проект удален');
        }
    }

    refresh() {
        console.log('🔄 Обновление Dashboard...');
        
        // Показываем loading
        const loadingEl = document.querySelector('.loading');
        const contentEl = document.querySelector('.dashboard-content');
        
        if (loadingEl) loadingEl.style.display = 'block';
        if (contentEl) contentEl.style.display = 'none';
        
        // Обновляем данные
        setTimeout(() => {
            this.loadData();
            this.setupUI();
        }, 1000);
    }

    showNotification(message) {
        // Удаляем старые уведомления
        document.querySelectorAll('.notification').forEach(n => n.remove());
        
        // Создаем новое уведомление
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            max-width: 300px;
            font-size: 14px;
        `;
        
        document.body.appendChild(notification);
        
        // Удаляем через 3 секунды
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    lightenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        
        return "#" + (
            0x1000000 +
            (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)
        ).toString(16).slice(1);
    }
}

// Инициализация Dashboard при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 Страница dashboard загружена');
    
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
        
        .loading {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 300px;
            font-size: 18px;
            color: #667eea;
        }
        
        .dashboard-content {
            display: none;
        }
    `;
    document.head.appendChild(style);
    
    // Создаем экземпляр Dashboard
    window.dashboard = new Dashboard();
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Dashboard;
}
