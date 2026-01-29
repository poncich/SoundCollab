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
        this.loadData();
        
        // Настраиваем интерфейс
        this.setupUI();
        
        // Настраиваем события
        this.setupEvents();
        
        // Запускаем анимации
        this.startAnimations();
        
        console.log('✅ Dashboard готов');
    }

    loadData() {
        console.log('📊 Загрузка данных...');
        
        // Загружаем проекты
        this.loadProjects();
        
        // Загружаем статистику
        this.loadStatistics();
        
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
                created: '15 янв 2024',
                collaborators: 2,
                lastModified: '2 часа назад',
                color: '#667eea',
                description: 'Летняя электронная музыка с тропическими битами',
                tags: ['лето', 'электро', 'чилл'],
                progress: 85,
                status: 'active'
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
                tags: ['lo-fi', 'учеба', 'релакс'],
                progress: 60,
                status: 'active'
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
                tags: ['синтвейв', 'ночь', 'драйв'],
                progress: 45,
                status: 'paused'
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
                tags: ['джаз', 'утро', 'инструментал'],
                progress: 20,
                status: 'draft'
            }
        ];
        
        console.log('📁 Проекты загружены:', this.projects.length);
    }

    loadStatistics() {
        // Демо-статистика
        this.stats = {
            tracksCreated: this.user.stats?.tracks || 15,
            totalTime: '4ч 30м',
            collaborations: this.user.stats?.collaborations || 2,
            storageUsed: this.user.stats?.storageUsed || '1.2 GB',
            followers: 156,
            following: 89,
            likes: 1240,
            plays: 8920
        };
        
        console.log('📈 Статистика загружена');
    }

    loadActivity() {
        // Демо-активность
        this.activity = [
            { 
                id: 1,
                user: 'Алексей', 
                action: 'добавил новый трек "Neon Lights"', 
                time: '10 минут назад',
                avatarColor: '#FF6B6B',
                icon: '🎵',
                type: 'track_added'
            },
            { 
                id: 2,
                user: 'Мария', 
                action: 'прокомментировала ваш проект "Summer Vibes"', 
                time: '1 час назад',
                avatarColor: '#4ECDC4',
                icon: '💬',
                type: 'comment'
            },
            { 
                id: 3,
                user: 'Вы', 
                action: 'сгенерировали обложку AI для "Night Drive"', 
                time: '3 часа назад',
                avatarColor: '#667eea',
                icon: '🎨',
                type: 'ai_generated'
            },
            { 
                id: 4,
                user: 'Денис', 
                action: 'присоединился к коллаборации', 
                time: 'Вчера',
                avatarColor: '#FFD166',
                icon: '👥',
                type: 'collaboration'
            },
            { 
                id: 5,
                user: 'София', 
                action: 'лайкнула ваш трек "Morning Jazz"', 
                time: '2 дня назад',
                avatarColor: '#06D6A0',
                icon: '❤️',
                type: 'like'
            }
        ];
        
        console.log('📅 Активность загружена');
    }

    setupUI() {
        console.log('🎨 Настройка интерфейса...');
        
        // Обновляем информацию пользователя
        this.updateUserInfo();
        
        // Отображаем проекты
        this.renderProjects();
        
        // Отображаем статистику
        this.renderStatistics();
        
        // Отображаем активность
        this.renderActivity();
        
        console.log('✅ Интерфейс настроен');
    }

    updateUserInfo() {
        // Аватар
        const avatarLarge = document.getElementById('user-avatar-large');
        if (avatarLarge && this.user) {
            const firstLetter = this.user.displayName?.charAt(0)?.toUpperCase() || 'Д';
            avatarLarge.textContent = firstLetter;
            
            // Градиент на основе имени
            const colors = [
                ['#667eea', '#764ba2'],
                ['#f093fb', '#f5576c'],
                ['#4facfe', '#00f2fe'],
                ['#43e97b', '#38f9d7']
            ];
            
            const nameHash = this.hashString(this.user.displayName || '');
            const colorIndex = nameHash % colors.length;
            avatarLarge.style.background = `linear-gradient(135deg, ${colors[colorIndex][0]}, ${colors[colorIndex][1]})`;
        }
        
        // Имя пользователя
        const username = document.getElementById('username');
        if (username && this.user) {
            username.textContent = this.user.displayName;
        }
        
        // Email
        const userEmail = document.getElementById('user-email');
        if (userEmail && this.user) {
            userEmail.textContent = this.user.email;
        }
        
        // Статистика в шапке
        const statTracks = document.getElementById('stat-tracks');
        if (statTracks) {
            statTracks.textContent = this.stats.tracksCreated;
        }
        
        const statCollabs = document.getElementById('stat-collabs');
        if (statCollabs) {
            statCollabs.textContent = this.stats.collaborations;
        }
        
        const userTier = document.getElementById('user-tier');
        if (userTier) {
            userTier.textContent = this.isPremium ? '⭐ PRO Аккаунт' : '🎵 Бесплатный аккаунт';
            userTier.style.color = this.isPremium ? '#FFD700' : '#b0b0b0';
        }
    }

    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash);
    }

    renderProjects() {
        const container = document.getElementById('projects-container');
        if (!container) return;
        
        console.log('🎨 Рендеринг проектов...');
        
        const projectsHTML = this.projects.map(project => `
            <div class="project-card fade-in" 
                 style="border-left: 4px solid ${project.color}; 
                        animation-delay: ${Math.random() * 0.3}s;">
                <div class="project-header">
                    <div class="project-color" style="background: ${project.color}"></div>
                    <div class="project-info">
                        <h4>${project.name}</h4>
                        <div style="display: flex; gap: 10px; align-items: center; margin-top: 5px;">
                            <span class="project-type">${project.type}</span>
                            <div style="display: flex; gap: 5px;">
                                ${project.tags.map(tag => `
                                    <span style="
                                        background: rgba(255,255,255,0.1); 
                                        padding: 3px 10px; 
                                        border-radius: 12px; 
                                        font-size: 11px;
                                        color: ${project.color};
                                    ">${tag}</span>
                                `).join('')}
                            </div>
                        </div>
                        <p class="project-description" style="margin-top: 8px; color: #b0b0b0; font-size: 14px;">
                            ${project.description}
                        </p>
                    </div>
                    <div class="project-menu" onclick="dashboard.showProjectMenu(${project.id})" 
                         style="cursor: pointer; padding: 5px 10px; border-radius: 6px; transition: background 0.3s;"
                         onmouseover="this.style.background='rgba(255,255,255,0.1)'"
                         onmouseout="this.style.background='transparent'">
                        <span style="font-size: 20px; color: #b0b0b0;">⋯</span>
                    </div>
                </div>
                
                <div class="project-details">
                    <div class="project-meta">
                        <span title="Дата создания">📅 ${project.created}</span>
                        <span title="Коллабораторы">👥 ${project.collaborators}</span>
                        <span title="Статус" style="color: ${
                            project.status === 'active' ? '#10b981' :
                            project.status === 'paused' ? '#f59e0b' :
                            '#b0b0b0'
                        }">
                            ${project.status === 'active' ? '👑 Активная' :
                              project.status === 'paused' ? '⏸ На паузе' :
                              '💤 Черновик'}
                        </span>
                    </div>
                    
                    <!-- Прогресс-бар -->
                    <div style="margin: 15px 0;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 12px; color: #b0b0b0;">
                            <span>Прогресс</span>
                            <span>${project.progress}%</span>
                        </div>
                        <div style="height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden;">
                            <div style="
                                width: ${project.progress}%;
                                height: 100%;
                                background: ${project.color};
                                border-radius: 2px;
                                transition: width 1s ease;
                            "></div>
                        </div>
                    </div>
                    
                    <div class="project-last" style="font-size: 12px; color: #b0b0b0;">
                        📝 Изменен: ${project.lastModified}
                    </div>
                </div>
                
                <div class="project-actions">
                    <button class="btn btn-primary btn-small" onclick="dashboard.openProject(${project.id})"
                            style="flex: 1;">
                        🎧 Открыть
                    </button>
                    <button class="btn btn-secondary btn-small" onclick="dashboard.shareProject(${project.id})"
                            style="flex: 1;">
                        ↗️ Поделиться
                    </button>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = projectsHTML;
        
        console.log('✅ Проекты отображены');
    }

    renderStatistics() {
        const container = document.getElementById('stats-container');
        if (!container) return;
        
        console.log('📊 Рендеринг статистики...');
        
        const statsHTML = `
            <div class="stat-card fade-in" style="animation-delay: 0.1s;">
                <div class="stat-icon" style="background: linear-gradient(135deg, #667eea, #764ba2);">🎵</div>
                <div class="stat-value">${this.stats.tracksCreated}</div>
                <div class="stat-label">Треков создано</div>
            </div>
            <div class="stat-card fade-in" style="animation-delay: 0.2s;">
                <div class="stat-icon" style="background: linear-gradient(135deg, #FF6B6B, #FF8E53);">⏱️</div>
                <div class="stat-value">${this.stats.totalTime}</div>
                <div class="stat-label">В музыке</div>
            </div>
            <div class="stat-card fade-in" style="animation-delay: 0.3s;">
                <div class="stat-icon" style="background: linear-gradient(135deg, #4ECDC4, #44A08D);">👥</div>
                <div class="stat-value">${this.stats.collaborations}</div>
                <div class="stat-label">Коллабораций</div>
            </div>
            <div class="stat-card fade-in" style="animation-delay: 0.4s;">
                <div class="stat-icon" style="background: linear-gradient(135deg, #FFD166, #FFB347);">💾</div>
                <div class="stat-value">${this.stats.storageUsed}</div>
                <div class="stat-label">Хранилище</div>
            </div>
        `;
        
        container.innerHTML = statsHTML;
        
        console.log('✅ Статистика отображена');
    }

    renderActivity() {
        const container = document.getElementById('activity-container');
        if (!container) return;
        
        console.log('📅 Рендеринг активности...');
        
        const activityHTML = this.activity.map((item, index) => `
            <div class="activity-item fade-in" style="animation-delay: ${index * 0.05}s;">
                <div class="activity-avatar" style="background: ${item.avatarColor}">
                    ${item.icon}
                </div>
                <div class="activity-content">
                    <div class="activity-header">
                        <strong>${item.user}</strong> ${item.action}
                    </div>
                    <div class="activity-time">🕒 ${item.time}</div>
                </div>
                ${item.type === 'like' ? '<span style="color: #ef4444; font-size: 20px;">❤️</span>' : ''}
                ${item.type === 'comment' ? '<span style="color: #3b82f6; font-size: 20px;">💬</span>' : ''}
            </div>
        `).join('');
        
        container.innerHTML = activityHTML;
        
        console.log('✅ Активность отображена');
    }

    setupEvents() {
        console.log('🎯 Настройка событий...');
        
        // Кнопка нового проекта
        const newProjectBtn = document.getElementById('new-project-btn');
        if (newProjectBtn) {
            newProjectBtn.addEventListener('click', () => this.createNewProject());
        }
        
        // Кнопка апгрейда
        const upgradeBtn = document.getElementById('upgrade-btn');
        if (upgradeBtn) {
            upgradeBtn.addEventListener('click', () => this.upgradeToPremium());
        }
        
        // Кнопка обновления
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshDashboard());
        }
        
        console.log('✅ События настроены');
    }

    startAnimations() {
        // Анимация появления элементов
        setTimeout(() => {
            const elements = document.querySelectorAll('.fade-in');
            elements.forEach((el, index) => {
                el.style.animationDelay = `${index * 0.1}s`;
            });
        }, 100);
    }

    // Методы взаимодействия

    createNewProject() {
        const projectName = prompt('🎵 Введите название нового проекта:', 'Мой новый трек');
        if (!projectName || projectName.trim() === '') return;
        
        const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#FF6B6B', '#4ECDC4'];
        const types = ['Трек', 'Альбом', 'EP', 'Сингл', 'Микстейп'];
        const tags = ['новая', 'эксперимент', 'черновик'];
        
        const newProject = {
            id: this.projects.length > 0 ? Math.max(...this.projects.map(p => p.id)) + 1 : 1,
            name: projectName.trim(),
            type: types[Math.floor(Math.random() * types.length)],
            created: new Date().toLocaleDateString('ru-RU', { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric' 
            }),
            collaborators: 0,
            lastModified: 'Только что',
            color: colors[Math.floor(Math.random() * colors.length)],
            description: 'Новый музыкальный проект',
            tags: [tags[Math.floor(Math.random() * tags.length)]],
            progress: 10,
            status: 'draft'
        };
        
        this.projects.unshift(newProject);
        this.renderProjects();
        
        this.showNotification('Проект создан', `"${projectName}" добавлен в вашу библиотеку`, 'success');
        console.log(`✅ Создан проект: ${projectName}`);
    }

    openProject(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;
        
        console.log(`🎧 Открытие проекта: ${project.name}`);
        this.showNotification('Открытие проекта', `Загружаем "${project.name}"...`, 'info');
        
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
                this.showNotification('Успешно!', 'Проект отправлен', 'success');
            }).catch(error => {
                console.log('Ошибка отправки:', error);
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
            colorOptions += `${i + 1}. ${colorNames[i]}\n`;
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
            console.log(`📧 Приглашение отправлено на: ${email}`);
        }
    }

    showProjectStats(projectId) {
        const stats = {
            plays: Math.floor(Math.random() * 10000),
            likes: Math.floor(Math.random() * 1000),
            shares: Math.floor(Math.random() * 500),
            comments: Math.floor(Math.random() * 100),
            duration: '3:45'
        };
        
        alert(`📊 Статистика проекта\n\n▶️ Прослушиваний: ${stats.plays}\n❤️ Лайков: ${stats.likes}\n↗️ Репостов: ${stats.shares}\n💬 Комментариев: ${stats.comments}\n⏱️ Длительность: ${stats.duration}`);
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
        
        // Показываем загрузку
        this.showLoading();
        
        // Обновляем данные
        setTimeout(() => {
            this.loadData();
            this.setupUI();
            this.hideLoading();
            this.showNotification('Дашборд обновлен', 'Все данные загружены заново', 'success');
            console.log('✅ Дашборд обновлен');
        }, 1500);
    }

    showLoading() {
        const content = document.querySelector('.dashboard-content');
        const loading = document.getElementById('loading');
        
        if (content && loading) {
            content.style.display = 'none';
            loading.style.display = 'flex';
        }
    }

    hideLoading() {
        const content = document.querySelector('.dashboard-content');
        const loading = document.getElementById('loading');
        
        if (content && loading) {
            loading.style.display = 'none';
            content.style.display = 'block';
        }
    }

    showNotification(title, message, type = 'info') {
        // Удаляем старые уведомления
        document.querySelectorAll('.dashboard-notification').forEach(n => n.remove());
        
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
        notification.className = 'dashboard-notification';
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
}

// Инициализация Dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем авторизацию
    const user = localStorage.getItem('soundcollab_user');
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    // Создаем экземпляр Dashboard
    window.dashboard = new Dashboard();
    
    // Глобальные функции для кнопок
    window.openProject = (id) => window.dashboard?.openProject(id);
    window.shareProject = (id) => window.dashboard?.shareProject(id);
    
    console.log('🚀 Dashboard запущен');
});

// Экспорт для модулей
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Dashboard;
}
