// dashboard.js - Основная панель управления SoundCollab

// dashboard.js - Основная панель управления SoundCollab

// dashboard.js - Основная панель управления SoundCollab
// Версия с новым дизайном и исправлениями

class Dashboard {
    constructor() {
        console.log('🎵 Инициализация SoundCollab Dashboard...');
        
        this.user = null;
        this.projects = [];
        this.stats = {};
        this.activity = [];
        this.isPremium = false;
        this.loadingTimeout = null;
        
        // Инициализация
        this.init();
    }

    // ==================== ОСНОВНЫЕ МЕТОДЫ ====================

    init() {
        console.log('🚀 Запуск Dashboard...');
        
        // 1. Проверяем авторизацию
        this.checkAuth();
        
        // 2. Загружаем демо-данные
        this.loadDemoData();
        
        // 3. Настраиваем интерфейс
        this.setupUI();
        
        // 4. Настраиваем события
        this.setupEvents();
        
        console.log('✅ Dashboard готов к работе');
    }

    checkAuth() {
        console.log('🔐 Проверка авторизации...');
        
        // Проверяем localStorage
        const userData = localStorage.getItem('soundcollab_user');
        
        if (userData) {
            try {
                this.user = JSON.parse(userData);
                console.log('👤 Авторизован как:', this.user.email);
            } catch (error) {
                console.error('❌ Ошибка загрузки пользователя:', error);
                this.user = this.createDemoUser();
            }
        } else {
            // Демо-режим
            this.user = this.createDemoUser();
            console.log('👤 Демо-режим активирован');
        }
        
        // Проверяем премиум статус
        this.isPremium = localStorage.getItem('soundcollab_premium') === 'true';
        console.log('⭐ Премиум статус:', this.isPremium ? 'АКТИВЕН' : 'НЕ АКТИВЕН');
    }

    createDemoUser() {
        const names = ['Алексей', 'Мария', 'Денис', 'София', 'Максим'];
        const randomName = names[Math.floor(Math.random() * names.length)];
        
        return {
            uid: 'demo-' + Date.now(),
            email: 'demo@soundcollab.com',
            displayName: randomName + ' (Демо)',
            photoURL: '',
            isDemo: true,
            createdAt: new Date().toISOString()
        };
    }

    loadDemoData() {
        console.log('📊 Загрузка демо-данных...');
        
        // Статистика
        this.stats = {
            tracksCreated: Math.floor(Math.random() * 20) + 5,
            totalTime: this.formatTime(Math.floor(Math.random() * 300) + 60),
            collaborations: Math.floor(Math.random() * 15) + 2,
            storageUsed: (Math.random() * 3 + 1).toFixed(1) + ' GB',
            followers: Math.floor(Math.random() * 200) + 50,
            following: Math.floor(Math.random() * 100) + 20
        };
        
        // Проекты
        this.projects = [
            {
                id: 1,
                name: 'Summer Vibes',
                type: 'Трек',
                created: '15 янв 2024',
                collaborators: 2,
                lastModified: '2 часа назад',
                color: '#667eea',
                description: 'Летняя электронная музыка с тропическими битами',
                tags: ['лето', 'электро', 'чилл']
            },
            {
                id: 2,
                name: 'Lo-Fi Study',
                type: 'Альбом',
                created: '10 янв 2024',
                collaborators: 1,
                lastModified: 'Вчера',
                color: '#764ba2',
                description: 'Расслабляющие лупы для учебы и работы',
                tags: ['lo-fi', 'учеба', 'релакс']
            },
            {
                id: 3,
                name: 'Night Drive',
                type: 'Трек',
                created: '5 янв 2024',
                collaborators: 3,
                lastModified: '3 дня назад',
                color: '#4facfe',
                description: 'Синтвейв для ночных поездок',
                tags: ['синтвейв', 'ночь', 'драйв']
            },
            {
                id: 4,
                name: 'Morning Jazz',
                type: 'EP',
                created: '1 янв 2024',
                collaborators: 0,
                lastModified: 'Неделю назад',
                color: '#f093fb',
                description: 'Утренние джазовые импровизации',
                tags: ['джаз', 'утро', 'инструментал']
            }
        ];
        
        // Активность
        this.activity = [
            { 
                user: 'Алексей', 
                action: 'добавил новый трек "Neon Lights"', 
                time: '10 минут назад',
                avatarColor: '#FF6B6B',
                icon: '🎵'
            },
            { 
                user: 'Мария', 
                action: 'прокомментировала ваш проект', 
                time: '1 час назад',
                avatarColor: '#4ECDC4',
                icon: '💬'
            },
            { 
                user: 'Вы', 
                action: 'сгенерировали обложку AI', 
                time: '3 часа назад',
                avatarColor: '#667eea',
                icon: '🎨'
            },
            { 
                user: 'Денис', 
                action: 'присоединился к коллаборации', 
                time: 'Вчера',
                avatarColor: '#FFD166',
                icon: '👥'
            },
            { 
                user: 'София', 
                action: 'лайкнула "Morning Jazz"', 
                time: '2 дня назад',
                avatarColor: '#06D6A0',
                icon: '❤️'
            }
        ];
        
        console.log('✅ Демо-данные загружены');
    }

    // ==================== ИНТЕРФЕЙС ====================

    setupUI() {
        console.log('🎨 Настройка интерфейса...');
        
        // 1. Обновляем данные пользователя
        this.updateUserInfo();
        
        // 2. Заполняем статистику
        this.renderStats();
        
        // 3. Заполняем проекты
        this.renderProjects();
        
        // 4. Заполняем активность
        this.renderActivity();
        
        // 5. Настраиваем навигацию
        this.setupNavigation();
        
        // 6. Таймаут для автоматического скрытия loading
        this.setupLoadingTimeout();
        
        console.log('✅ Интерфейс настроен');
    }

    updateUserInfo() {
        console.log('👤 Обновление информации пользователя...');
        
        // Имя пользователя
        const userNameEl = document.getElementById('username');
        if (userNameEl) {
            userNameEl.textContent = this.user.displayName;
        }
        
        // Email
        const userEmailEl = document.getElementById('user-email');
        if (userEmailEl) {
            userEmailEl.textContent = this.user.email;
        }
        
        // Основной аватар
        const avatarEl = document.getElementById('user-avatar');
        if (avatarEl) {
            const firstLetter = this.user.displayName.charAt(0).toUpperCase();
            avatarEl.innerHTML = firstLetter;
            avatarEl.style.background = this.getUserGradient(this.user.displayName);
        }
        
        // Аватар в навигации
        const navAvatar = document.getElementById('user-avatar-nav');
        if (navAvatar) {
            const firstLetter = this.user.displayName.charAt(0).toUpperCase();
            navAvatar.innerHTML = firstLetter;
            navAvatar.style.background = this.getUserGradient(this.user.displayName);
            navAvatar.title = this.user.displayName;
        }
        
        // Премиум бейдж
        const premiumBadge = document.getElementById('premium-badge');
        if (premiumBadge) {
            if (this.isPremium) {
                premiumBadge.style.display = 'inline-flex';
                premiumBadge.innerHTML = '⭐ PRO';
            } else {
                premiumBadge.style.display = 'none';
            }
        }
    }

    getUserGradient(name) {
        // Создаем детерминированный градиент на основе имени
        const colors = [
            ['#667eea', '#764ba2'],
            ['#f093fb', '#f5576c'],
            ['#4facfe', '#00f2fe'],
            ['#43e97b', '#38f9d7'],
            ['#fa709a', '#fee140']
        ];
        
        // Хэш имени для выбора цвета
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % colors.length;
        
        return `linear-gradient(135deg, ${colors[index][0]}, ${colors[index][1]})`;
    }

    renderStats() {
        const statsContainer = document.getElementById('stats-container');
        if (!statsContainer) {
            console.error('❌ Контейнер статистики не найден');
            return;
        }
        
        console.log('📈 Рендеринг статистики...');
        
        const statsHTML = `
            <div class="stat-card fade-in" style="animation-delay: 0.1s;">
                <div class="stat-icon">🎵</div>
                <div class="stat-value">${this.stats.tracksCreated}</div>
                <div class="stat-label">Треков создано</div>
            </div>
            <div class="stat-card fade-in" style="animation-delay: 0.2s;">
                <div class="stat-icon">⏱️</div>
                <div class="stat-value">${this.stats.totalTime}</div>
                <div class="stat-label">В музыке</div>
            </div>
            <div class="stat-card fade-in" style="animation-delay: 0.3s;">
                <div class="stat-icon">👥</div>
                <div class="stat-value">${this.stats.collaborations}</div>
                <div class="stat-label">Коллабораций</div>
            </div>
            <div class="stat-card fade-in" style="animation-delay: 0.4s;">
                <div class="stat-icon">💾</div>
                <div class="stat-value">${this.stats.storageUsed}</div>
                <div class="stat-label">Хранилище</div>
            </div>
        `;
        
        statsContainer.innerHTML = statsHTML;
        console.log('✅ Статистика отображена');
    }

    renderProjects() {
        const projectsContainer = document.getElementById('projects-container');
        if (!projectsContainer) {
            console.error('❌ Контейнер проектов не найден');
            return;
        }
        
        console.log('📁 Рендеринг проектов...');
        
        const projectsHTML = this.projects.map((project, index) => `
            <div class="project-card fade-in" style="animation-delay: ${0.1 * index}s; border-left: 4px solid ${project.color};">
                <div class="project-header">
                    <div class="project-color" style="background: ${project.color}"></div>
                    <div class="project-info">
                        <h4>${project.name}</h4>
                        <div style="display: flex; gap: 10px; align-items: center; margin-top: 5px;">
                            <span class="project-type">${project.type}</span>
                            <div style="display: flex; gap: 5px;">
                                ${project.tags.map(tag => `<span style="background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 10px; font-size: 11px;">${tag}</span>`).join('')}
                            </div>
                        </div>
                        <p class="project-description">${project.description}</p>
                    </div>
                    <div class="project-menu" onclick="dashboard.showProjectMenu(${project.id})" title="Меню проекта">
                        <span style="font-size: 20px;">⋯</span>
                    </div>
                </div>
                <div class="project-details">
                    <div class="project-meta">
                        <span title="Дата создания">📅 ${project.created}</span>
                        <span title="Коллабораторы">👥 ${project.collaborators}</span>
                        <span title="Статус" style="color: ${project.collaborators > 0 ? '#10b981' : '#f59e0b'}">
                            ${project.collaborators > 0 ? '👑 Активная' : '💤 Черновик'}
                        </span>
                    </div>
                    <div class="project-last">
                        📝 Изменен: ${project.lastModified}
                    </div>
                </div>
                <div class="project-actions">
                    <button class="btn btn-primary btn-small" onclick="dashboard.openProject(${project.id})">
                        🎧 Открыть
                    </button>
                    <button class="btn btn-secondary btn-small" onclick="dashboard.shareProject(${project.id})">
                        ↗️ Поделиться
                    </button>
                </div>
            </div>
        `).join('');
        
        projectsContainer.innerHTML = projectsHTML;
        console.log('✅ Проекты отображены');
    }

    renderActivity() {
        const activityContainer = document.getElementById('activity-container');
        if (!activityContainer) {
            console.error('❌ Контейнер активности не найден');
            return;
        }
        
        console.log('📈 Рендеринг активности...');
        
        const activityHTML = this.activity.map((item, index) => `
            <div class="activity-item fade-in" style="animation-delay: ${0.05 * index}s;">
                <div class="activity-avatar" style="background: ${item.avatarColor}">
                    ${item.icon}
                </div>
                <div class="activity-content">
                    <div class="activity-header">
                        <strong>${item.user}</strong> ${item.action}
                    </div>
                    <div class="activity-time">🕒 ${item.time}</div>
                </div>
            </div>
        `).join('');
        
        activityContainer.innerHTML = activityHTML;
        console.log('✅ Активность отображена');
    }

    setupNavigation() {
        console.log('🧭 Настройка навигации...');
        
        // Активный пункт меню
        const currentPage = window.location.pathname.split('/').pop();
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        console.log('✅ Навигация настроена');
    }

    setupLoadingTimeout() {
        console.log('⏱️ Настройка таймаута загрузки...');
        
        this.loadingTimeout = setTimeout(() => {
            this.hideLoading();
        }, 2500); // 2.5 секунды
    }

    hideLoading() {
        console.log('👁️ Скрытие загрузки...');
        
        const loadingEl = document.getElementById('loading');
        const contentEl = document.querySelector('.dashboard-content');
        
        if (loadingEl) {
            loadingEl.style.opacity = '0';
            loadingEl.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                loadingEl.style.display = 'none';
                console.log('✅ Загрузка скрыта');
            }, 500);
        }
        
        if (contentEl) {
            contentEl.style.display = 'block';
            contentEl.style.opacity = '0';
            
            setTimeout(() => {
                contentEl.style.transition = 'opacity 0.5s ease';
                contentEl.style.opacity = '1';
                console.log('✅ Контент показан');
            }, 100);
        }
        
        // Показываем уведомление
        if (this.user.isDemo) {
            this.showNotification('🎵 Демо-режим SoundCollab', 'Подключите Firebase для полного доступа', 'info');
        }
    }

    // ==================== СОБЫТИЯ И КНОПКИ ====================

    setupEvents() {
        console.log('🎯 Настройка событий...');
        
        // Кнопка обновления
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshDashboard();
            });
        }
        
        // Кнопка нового проекта
        const newProjectBtn = document.getElementById('new-project-btn');
        if (newProjectBtn) {
            newProjectBtn.addEventListener('click', () => {
                this.createNewProject();
            });
        }
        
        // Кнопка апгрейда
        const upgradeBtn = document.getElementById('upgrade-btn');
        if (upgradeBtn) {
            upgradeBtn.addEventListener('click', () => {
                this.upgradeToPremium();
            });
        }
        
        console.log('✅ События настроены');
    }

    // ==================== ФУНКЦИОНАЛ ====================

    openProject(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;
        
        console.log(`🎧 Открытие проекта: ${project.name}`);
        this.showNotification('Открытие проекта', `Загружаем "${project.name}"...`, 'success');
        
        // В будущем: редирект на страницу проекта
        // window.location.href = `/project.html?id=${projectId}`;
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
            }).then(() => {
                console.log('✅ Проект успешно отправлен');
            }).catch(error => {
                console.log('❌ Ошибка отправки:', error);
                this.copyToClipboard(`${shareText}\n${shareUrl}`);
            });
        } else {
            this.copyToClipboard(`${shareText}\n${shareUrl}`);
        }
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('Ссылка скопирована', 'Теперь вы можете поделиться ей', 'success');
        }).catch(err => {
            console.error('Ошибка копирования:', err);
            this.showNotification('Ошибка', 'Не удалось скопировать ссылку', 'error');
        });
    }

    createNewProject() {
        const projectName = prompt('🎵 Введите название нового проекта:', 'Мой новый трек');
        if (!projectName || projectName.trim() === '') return;
        
        const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#FF6B6B', '#4ECDC4'];
        const types = ['Трек', 'Альбом', 'EP', 'Сингл', 'Микстейп'];
        const tags = ['новая', 'эксперимент', 'черновик', 'в процессе'];
        
        const newProject = {
            id: this.projects.length > 0 ? Math.max(...this.projects.map(p => p.id)) + 1 : 1,
            name: projectName.trim(),
            type: types[Math.floor(Math.random() * types.length)],
            created: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' }),
            collaborators: 0,
            lastModified: 'Только что',
            color: colors[Math.floor(Math.random() * colors.length)],
            description: 'Новый музыкальный проект',
            tags: [tags[Math.floor(Math.random() * tags.length)]]
        };
        
        this.projects.unshift(newProject);
        this.renderProjects();
        
        this.showNotification('Проект создан', `"${projectName}" добавлен в вашу библиотеку`, 'success');
        console.log(`✅ Создан проект: ${projectName}`);
    }

    upgradeToPremium() {
        const upgradeHTML = `
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 48px; margin-bottom: 20px;">⭐</div>
                <h3 style="margin-bottom: 10px;">SoundCollab Premium</h3>
                <p style="color: #b0b0b0; margin-bottom: 20px;">Полный доступ ко всем функциям</p>
                
                <div style="background: rgba(255,215,0,0.1); padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                    <h4 style="color: #FFD700; margin-bottom: 10px;">Что входит:</h4>
                    <ul style="text-align: left; padding-left: 20px;">
                        <li>🎵 Все треки без ограничений</li>
                        <li>🎨 Неограниченная AI генерация</li>
                        <li>👥 Расширенные коллаборации</li>
                        <li>💾 10GB хранилища</li>
                        <li>🎧 Продвинутый редактор треков</li>
                    </ul>
                </div>
                
                <div style="font-size: 24px; font-weight: bold; color: #FFD700; margin: 20px 0;">
                    $9.99/месяц
                </div>
            </div>
        `;
        
        const upgradeConfirmed = confirm(`Хотите перейти на SoundCollab Premium?\n\nВ демо-режиме это имитация.\nВ реальном режиме будет подключение к платежной системе.`);
        
        if (upgradeConfirmed) {
            this.isPremium = true;
            localStorage.setItem('soundcollab_premium', 'true');
            this.updateUserInfo();
            
            this.showNotification('Добро пожаловать в Premium!', 'Теперь вам доступны все функции SoundCollab', 'success');
            console.log('✅ Пользователь перешел на Premium');
        }
    }

    showProjectMenu(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;
        
        const actions = [
            { name: '📝 Переименовать', action: 'rename' },
            { name: '🎨 Сменить цвет', action: 'color' },
            { name: '👥 Пригласить', action: 'invite' },
            { name: '📊 Статистика', action: 'stats' },
            { name: '🗑️ Удалить', action: 'delete' }
        ];
        
        const actionList = actions.map((a, i) => `${i + 1}. ${a.name}`).join('\n');
        const choice = prompt(`Действия для "${project.name}":\n\n${actionList}\n\nВведите номер действия:`);
        
        const index = parseInt(choice) - 1;
        if (index >= 0 && index < actions.length) {
            this.handleProjectAction(projectId, actions[index].action);
        }
    }

    handleProjectAction(projectId, action) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;
        
        switch (action) {
            case 'rename':
                this.renameProject(projectId);
                break;
            case 'color':
                this.changeProjectColor(projectId);
                break;
            case 'invite':
                this.inviteToProject(projectId);
                break;
            case 'stats':
                this.showProjectStats(projectId);
                break;
            case 'delete':
                this.deleteProject(projectId);
                break;
        }
    }

    renameProject(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;
        
        const newName = prompt('Введите новое название:', project.name);
        if (newName && newName.trim()) {
            const oldName = project.name;
            project.name = newName.trim();
            project.lastModified = 'Только что';
            this.renderProjects();
            
            this.showNotification('Проект переименован', `"${oldName}" → "${newName}"`, 'info');
        }
    }

    changeProjectColor(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;
        
        const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0'];
        const colorNames = ['Синий', 'Фиолетовый', 'Розовый', 'Голубой', 'Красный', 'Бирюзовый', 'Желтый', 'Зеленый'];
        
        let colorOptions = '';
        colors.forEach((color, i) => {
            colorOptions += `${i + 1}. ${colorNames[i]} (${color})\n`;
        });
        
        const choice = prompt(`Выберите цвет:\n\n${colorOptions}`);
        const index = parseInt(choice) - 1;
        
        if (index >= 0 && index < colors.length) {
            project.color = colors[index];
            project.lastModified = 'Только что';
            this.renderProjects();
            
            this.showNotification('Цвет изменен', `Проект теперь ${colorNames[index].toLowerCase()}`, 'info');
        }
    }

    inviteToProject(projectId) {
        const email = prompt('Введите email для приглашения:');
        if (email && email.includes('@')) {
            this.showNotification('Приглашение отправлено', `Приглашение отправлено на ${email}`, 'success');
            
            // В реальном режиме здесь будет отправка email
            console.log(`📧 Приглашение отправлено на: ${email}`);
        }
    }

    showProjectStats(projectId) {
        const stats = {
            plays: Math.floor(Math.random() * 10000),
            likes: Math.floor(Math.random() * 1000),
            shares: Math.floor(Math.random() * 500),
            comments: Math.floor(Math.random() * 100)
        };
        
        alert(`📊 Статистика проекта\n\n▶️ Прослушиваний: ${stats.plays}\n❤️ Лайков: ${stats.likes}\n↗️ Репостов: ${stats.shares}\n💬 Комментариев: ${stats.comments}`);
    }

    deleteProject(projectId) {
        const confirmDelete = confirm('Вы уверены, что хотите удалить этот проект?\nЭто действие нельзя отменить.');
        
        if (confirmDelete) {
            const projectName = this.projects.find(p => p.id === projectId)?.name;
            this.projects = this.projects.filter(p => p.id !== projectId);
            this.renderProjects();
            
            this.showNotification('Проект удален', `"${projectName}" перемещен в корзину`, 'warning');
            console.log(`🗑️ Удален проект: ${projectName}`);
        }
    }

    refreshDashboard() {
        console.log('🔄 Обновление дашборда...');
        
        // Показываем loading
        const loadingEl = document.getElementById('loading');
        const contentEl = document.querySelector('.dashboard-content');
        
        if (loadingEl) {
            loadingEl.style.display = 'flex';
            loadingEl.style.opacity = '1';
        }
        
        if (contentEl) {
            contentEl.style.display = 'none';
        }
        
        // Обновляем данные
        setTimeout(() => {
            this.loadDemoData();
            this.setupUI();
            this.showNotification('Дашборд обновлен', 'Все данные загружены заново', 'success');
            console.log('✅ Дашборд обновлен');
        }, 1000);
    }

    // ==================== УТИЛИТЫ ====================

    showNotification(title, message, type = 'info') {
        // Удаляем старые уведомления
        document.querySelectorAll('.custom-notification').forEach(n => n.remove());
        
        // Цвета для типов
        const colors = {
            info: 'linear-gradient(135deg, #667eea, #764ba2)',
            success: 'linear-gradient(135deg, #10b981, #059669)',
            warning: 'linear-gradient(135deg, #f59e0b, #d97706)',
            error: 'linear-gradient(135deg, #ef4444, #dc2626)'
        };
        
        // Иконки для типов
        const icons = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };
        
        // Создаем уведомление
        const notification = document.createElement('div');
        notification.className = 'custom-notification';
        notification.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 12px;">
                <div style="font-size: 20px;">${icons[type]}</div>
                <div>
                    <div style="font-weight: 600; margin-bottom: 4px;">${title}</div>
                    <div style="font-size: 13px; opacity: 0.9;">${message}</div>
                </div>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            max-width: 350px;
            min-width: 300px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        `;
        
        document.body.appendChild(notification);
        
        // Удаляем через 4 секунды
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    formatTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        
        if (hours > 0) {
            return `${hours}ч ${mins}м`;
        } else {
            return `${mins}м`;
        }
    }
}

// ==================== ИНИЦИАЛИЗАЦИЯ ====================

// Добавляем CSS анимации
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Страница загружена');
    
    // Добавляем стили для анимаций
    if (!document.querySelector('#dashboard-animations')) {
        const style = document.createElement('style');
        style.id = 'dashboard-animations';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .fade-in {
                animation: fadeIn 0.5s ease-out forwards;
                opacity: 0;
            }
            
            .loading {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 300px;
                gap: 20px;
            }
            
            .loading .spinner {
                width: 50px;
                height: 50px;
                border: 3px solid rgba(255, 255, 255, 0.1);
                border-top-color: #667eea;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Инициализируем Dashboard
    window.dashboard = new Dashboard();
    
    // Глобальные функции для кнопок
    window.openProject = (id) => window.dashboard?.openProject(id);
    window.shareProject = (id) => window.dashboard?.shareProject(id);
    
    console.log('🚀 SoundCollab Dashboard запущен');
});

// Экспорт для модулей
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Dashboard;
}
