// ai-images.js - AI Генератор изображений для SoundCollab
class AIImageGenerator {
    constructor() {
        this.currentModel = 'stable-diffusion-free';
        this.currentStyle = 'digital-art';
        this.generationHistory = [];
        this.isGenerating = false;
        
        this.init();
    }
    
    async init() {
        console.log("🎨 Инициализация AI генератора...");
        
        // Загружаем историю из localStorage
        this.loadHistory();
        
        // Настраиваем интерфейс
        this.setupStyles();
        this.setupModels();
        this.setupEventListeners();
        
        // Показываем историю
        this.displayHistory();
        
        console.log("✅ AI генератор готов");
    }
    
    setupStyles() {
        const styles = [
            { id: 'digital-art', name: 'Цифровое искусство', emoji: '🎨' },
            { id: 'photorealistic', name: 'Фотореализм', emoji: '📸' },
            { id: 'anime', name: 'Аниме', emoji: '🇯🇵' },
            { id: 'fantasy', name: 'Фэнтези', emoji: '🐉' },
            { id: 'cyberpunk', name: 'Киберпанк', emoji: '🤖' },
            { id: 'vintage', name: 'Винтаж', emoji: '📻' },
            { id: 'minimalist', name: 'Минимализм', emoji: '⬜' },
            { id: 'watercolor', name: 'Акварель', emoji: '🖌️' },
            { id: 'pixel-art', name: 'Пиксель-арт', emoji: '👾' },
            { id: 'abstract', name: 'Абстракция', emoji: '🌀' }
        ];
        
        const container = document.getElementById('stylesGrid');
        if (!container) return;
        
        container.innerHTML = styles.map(style => `
            <div class="style-option ${style.id === this.currentStyle ? 'active' : ''}" 
                 data-style="${style.id}"
                 onclick="aiGenerator.selectStyle('${style.id}')">
                ${style.emoji} ${style.name}
            </div>
        `).join('');
    }
    
    setupModels() {
        const models = [
            { 
                id: 'stable-diffusion-free', 
                name: 'Stable Diffusion', 
                type: 'free',
                description: 'Бесплатная модель, хорошее качество, ограничение 50 изображений в день',
                api: 'replicate'
            },
            { 
                id: 'dalle-mini', 
                name: 'DALL-E Mini', 
                type: 'free',
                description: 'Бесплатный аналог DALL-E от сообщества, быстрая генерация',
                api: 'huggingface'
            },
            { 
                id: 'midjourney-proxy', 
                name: 'Midjourney Pro', 
                type: 'premium',
                description: 'Высокое качество, художественный стиль. Требуется подписка',
                api: 'custom'
            },
            { 
                id: 'stable-diffusion-xl', 
                name: 'SD XL', 
                type: 'pro',
                description: 'Мощная модель, лучшее качество. Для коммерческого использования',
                api: 'replicate'
            }
        ];
        
        const tabsContainer = document.getElementById('modelTabs');
        const infoContainer = document.getElementById('modelInfo');
        
        if (!tabsContainer || !infoContainer) return;
        
        // Создаем вкладки
        tabsContainer.innerHTML = models.map(model => `
            <div class="model-tab ${model.id === this.currentModel ? 'active' : ''}" 
                 data-model="${model.id}"
                 onclick="aiGenerator.selectModel('${model.id}')">
                ${model.name}
                <span class="model-badge badge-${model.type}">
                    ${model.type === 'free' ? 'БЕСПЛАТНО' : model.type === 'premium' ? 'ПРЕМИУМ' : 'PRO'}
                </span>
            </div>
        `).join('');
        
        // Показываем информацию о текущей модели
        this.updateModelInfo();
    }
    
    selectStyle(styleId) {
        this.currentStyle = styleId;
        
        // Обновляем UI
        document.querySelectorAll('.style-option').forEach(el => {
            el.classList.remove('active');
            if (el.dataset.style === styleId) {
                el.classList.add('active');
            }
        });
        
        console.log(`🎨 Выбран стиль: ${styleId}`);
    }
    
    selectModel(modelId) {
        this.currentModel = modelId;
        
        // Обновляем UI
        document.querySelectorAll('.model-tab').forEach(el => {
            el.classList.remove('active');
            if (el.dataset.model === modelId) {
                el.classList.add('active');
            }
        });
        
        // Обновляем информацию о модели
        this.updateModelInfo();
        
        console.log(`🤖 Выбрана модель: ${modelId}`);
    }
    
    updateModelInfo() {
        const modelInfo = {
            'stable-diffusion-free': {
                name: 'Stable Diffusion',
                details: 'Открытая модель, отличное качество для большинства задач',
                credits: 'Бесплатно до 50 изображений в день',
                limitations: 'Может не справляться со сложными сценами'
            },
            'dalle-mini': {
                name: 'DALL-E Mini',
                details: 'Быстрая и бесплатная модель от сообщества',
                credits: 'Полностью бесплатно, без ограничений',
                limitations: 'Качество ниже, чем у коммерческих моделей'
            },
            'midjourney-proxy': {
                name: 'Midjourney Pro',
                details: 'Профессиональная модель для художников и дизайнеров',
                credits: 'Требуется API ключ от Midjourney',
                limitations: 'Платный, требуется настройка'
            },
            'stable-diffusion-xl': {
                name: 'Stable Diffusion XL',
                details: 'Самая мощная версия Stable Diffusion',
                credits: '$0.0025 за изображение',
                limitations: 'Требует оплаты через Replicate'
            }
        };
        
        const info = modelInfo[this.currentModel] || modelInfo['stable-diffusion-free'];
        const container = document.getElementById('modelInfo');
        
        if (container) {
            container.innerHTML = `
                <p><strong>${info.name}</strong></p>
                <p style="margin: 10px 0; color: #666;">${info.details}</p>
                <div class="model-info">
                    <p>💳 ${info.credits}</p>
                    <p>⚠️ ${info.limitations}</p>
                </div>
            `;
        }
    }
    
    setupEventListeners() {
        const generateBtn = document.getElementById('generateBtn');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.generateImage());
        }
        
        // Enter для генерации
        const promptInput = document.getElementById('promptInput');
        if (promptInput) {
            promptInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                    this.generateImage();
                }
            });
        }
    }
    
    async generateImage() {
        if (this.isGenerating) {
            this.showMessage('Подождите, идет генерация...', 'warning');
            return;
        }
        
        const prompt = document.getElementById('promptInput').value.trim();
        if (!prompt) {
            this.showMessage('Введите описание изображения', 'error');
            return;
        }
        
        // Начинаем генерацию
        this.isGenerating = true;
        this.showLoading(true);
        
        try {
            let imageUrl;
            
            // Выбираем API в зависимости от модели
            switch (this.currentModel) {
                case 'stable-diffusion-free':
                    imageUrl = await this.generateWithStableDiffusionFree(prompt);
                    break;
                    
                case 'dalle-mini':
                    imageUrl = await this.generateWithDalleMini(prompt);
                    break;
                    
                case 'midjourney-proxy':
                    imageUrl = await this.generateWithMidjourney(prompt);
                    break;
                    
                case 'stable-diffusion-xl':
                    imageUrl = await this.generateWithSDXL(prompt);
                    break;
                    
                default:
                    imageUrl = await this.generateWithMockAPI(prompt); // Демо-режим
            }
            
            // Показываем результат
            this.displayResult(imageUrl, prompt);
            
            // Сохраняем в историю
            this.saveToHistory(imageUrl, prompt);
            
            this.showMessage('🎉 Изображение сгенерировано!', 'success');
            
        } catch (error) {
            console.error('❌ Ошибка генерации:', error);
            this.showMessage(`Ошибка: ${error.message}`, 'error');
            
            // Показываем демо-изображение если API не работает
            this.displayResult(this.getDemoImage(), prompt);
        } finally {
            this.isGenerating = false;
            this.showLoading(false);
        }
    }
    
    // === БЕСПЛАТНЫЕ API ===
    
    async generateWithStableDiffusionFree(prompt) {
        // Используем Replicate API для Stable Diffusion
        // Нужен API ключ: https://replicate.com/
        
        const stylePrompts = {
            'digital-art': `digital art, ${prompt}, highly detailed, cinematic lighting`,
            'photorealistic': `photorealistic, ${prompt}, 8k, professional photography`,
            'anime': `anime style, ${prompt}, vibrant colors, detailed background`,
            'fantasy': `fantasy art, ${prompt}, magical, epic, detailed`,
            'cyberpunk': `cyberpunk, ${prompt}, neon lights, futuristic, detailed`
        };
        
        const fullPrompt = stylePrompts[this.currentStyle] || `${prompt}, ${this.currentStyle}`;
        
        // Демо-режим: возвращаем заглушку если нет API ключа
        return this.getMockImage(fullPrompt);
    }
    
    async generateWithDalleMini(prompt) {
        // DALL-E Mini через Hugging Face
        // API: https://huggingface.co/spaces/dalle-mini/dalle-mini
        
        this.updateProgress('Отправляем запрос в DALL-E Mini...');
        
        // В реальном проекте здесь будет fetch к API
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        return this.getMockImage(prompt);
    }
    
    // === ПРЕМИУМ API (требуют настройки) ===
    
    async generateWithMidjourney(prompt) {
        this.showMessage('Для Midjourney требуется настройка API ключа', 'info');
        return this.getMockImage(prompt);
    }
    
    async generateWithSDXL(prompt) {
        this.showMessage('SD XL требует API ключ от Replicate', 'info');
        return this.getMockImage(prompt);
    }
    
    // === ДЕМО-РЕЖИМ (если API не настроены) ===
    
    async generateWithMockAPI(prompt) {
        this.updateProgress('ИИ генерирует изображение...');
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        this.updateProgress('Добавляем детали...');
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        return this.getMockImage(prompt);
    }
    
    getMockImage(prompt) {
        // Создаем "фейковое" изображение на основе промпта
        // В реальном проекте здесь будет URL от API
        
        const colors = ['#667eea', '#764ba2', '#4CAF50', '#FF9800', '#9C27B0'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Создаем SVG с градиентом
        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
                <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#000;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect width="512" height="512" fill="url(#grad1)"/>
                <text x="256" y="256" font-family="Arial" font-size="24" fill="white" text-anchor="middle" opacity="0.7">
                    ${prompt.substring(0, 40)}${prompt.length > 40 ? '...' : ''}
                </text>
                <text x="256" y="300" font-family="Arial" font-size="16" fill="white" text-anchor="middle" opacity="0.5">
                    AI Generated Image
                </text>
            </svg>
        `;
        
        return 'data:image/svg+xml;base64,' + btoa(svg);
    }
    
    getDemoImage() {
        // Возвращает демо-изображение
        return 'https://images.unsplash.com/photo-1682686580391-615b1f28e5ee?w=512&h=512&fit=crop';
    }
    
    // === ОТОБРАЖЕНИЕ РЕЗУЛЬТАТА ===
    
    displayResult(imageUrl, prompt) {
        const resultContainer = document.getElementById('resultContainer');
        const imageActions = document.getElementById('imageActions');
        
        if (!resultContainer || !imageActions) return;
        
        resultContainer.innerHTML = `
            <img src="${imageUrl}" alt="${prompt}" class="generated-image" id="generatedImage">
            <p style="margin-top: 15px; color: #666; font-size: 14px;">"${prompt}"</p>
        `;
        
        imageActions.style.display = 'flex';
        
        // Сохраняем текущее изображение для скачивания
        this.currentImage = {
            url: imageUrl,
            prompt: prompt,
            timestamp: Date.now()
        };
    }
    
    showLoading(show) {
        const loadingIndicator = document.getElementById('loadingIndicator');
        const generateBtn = document.getElementById('generateBtn');
        
        if (loadingIndicator) {
            loadingIndicator.style.display = show ? 'flex' : 'none';
        }
        
        if (generateBtn) {
            generateBtn.disabled = show;
            generateBtn.textContent = show ? '⏳ Генерация...' : '🚀 Сгенерировать изображение';
        }
    }
    
    updateProgress(text) {
        const progressText = document.getElementById('progressText');
        if (progressText) {
            progressText.textContent = text;
        }
    }
    
    // === ИСТОРИЯ ===
    
    saveToHistory(imageUrl, prompt) {
        const historyItem = {
            id: 'img_' + Date.now(),
            url: imageUrl,
            prompt: prompt,
            model: this.currentModel,
            style: this.currentStyle,
            timestamp: Date.now(),
            date: new Date().toLocaleString('ru-RU')
        };
        
        this.generationHistory.unshift(historyItem);
        
        // Сохраняем в localStorage (максимум 20 записей)
        if (this.generationHistory.length > 20) {
            this.generationHistory = this.generationHistory.slice(0, 20);
        }
        
        localStorage.setItem('soundcollab_ai_history', JSON.stringify(this.generationHistory));
        
        // Обновляем отображение
        this.displayHistory();
    }
    
    loadHistory() {
        try {
            const saved = localStorage.getItem('soundcollab_ai_history');
            if (saved) {
                this.generationHistory = JSON.parse(saved);
            }
        } catch (error) {
            console.error('Ошибка загрузки истории:', error);
            this.generationHistory = [];
        }
    }
    
    displayHistory() {
        const container = document.getElementById('historyGrid');
        if (!container || this.generationHistory.length === 0) {
            if (container) {
                container.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; color: #666; padding: 40px;">
                        История генераций пуста<br>
                        <small>Создайте первое изображение!</small>
                    </div>
                `;
            }
            return;
        }
        
        container.innerHTML = this.generationHistory.map(item => `
            <div class="history-item" onclick="aiGenerator.loadFromHistory('${item.id}')">
                <img src="${item.url}" alt="${item.prompt}" class="history-img">
                <div class="history-prompt">
                    ${item.prompt.substring(0, 60)}${item.prompt.length > 60 ? '...' : ''}
                    <div style="font-size: 12px; color: #999; margin-top: 5px;">
                        ${item.date}
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    loadFromHistory(itemId) {
        const item = this.generationHistory.find(i => i.id === itemId);
        if (!item) return;
        
        // Загружаем в интерфейс
        document.getElementById('promptInput').value = item.prompt;
        this.selectStyle(item.style);
        this.selectModel(item.model);
        this.displayResult(item.url, item.prompt);
        
        this.showMessage('Загружено из истории', 'success');
    }
    
    // === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===
    
    showMessage(text, type = 'info') {
        const message = document.createElement('div');
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 10px;
            color: white;
            font-weight: bold;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            background: ${type === 'success' ? '#4CAF50' : 
                        type === 'error' ? '#f44336' : 
                        type === 'warning' ? '#FF9800' : '#2196F3'};
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }
}

// Глобальные функции для кнопок
function downloadImage() {
    if (!aiGenerator.currentImage) {
        aiGenerator.showMessage('Нет изображения для скачивания', 'error');
        return;
    }
    
    const link = document.createElement('a');
    link.href = aiGenerator.currentImage.url;
    link.download = `soundcollab_${Date.now()}.png`;
    link.click();
    
    aiGenerator.showMessage('Изображение скачивается', 'success');
}

function saveToProject() {
    aiGenerator.showMessage('Функция добавления в проект будет доступна после интеграции со студией', 'info');
}

function generateVariation() {
    const prompt = document.getElementById('promptInput').value;
    if (!prompt) {
        aiGenerator.showMessage('Введите промпт для вариации', 'error');
        return;
    }
    
    // Добавляем ключевое слово для вариации
    const variationPrompt = `${prompt}, variation, different angle`;
    document.getElementById('promptInput').value = variationPrompt;
    
    aiGenerator.generateImage();
}

// Инициализация
let aiGenerator;

document.addEventListener('DOMContentLoaded', () => {
    aiGenerator = new AIImageGenerator();
    window.aiGenerator = aiGenerator;
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
