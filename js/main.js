// Конфигурация Airtable
const AIRTABLE_CONFIG = {
    BASE_ID: 'appBWg4C27WYIidvn',      // Заменить на реальный Base ID
    TABLE_NAME: 'tblU5ngVZGQsCCrhH',      // Название вашей таблицы
    PERSONAL_ACCESS_TOKEN: 'patesK9XUSduWCwDq.a49a22a975203e8376b53cafd13594d0ab4b3c69d96f10d07f1cd4e760a373b0' // Заменить на реальный токен
};

// Загрузка проектов
async function loadProjects() {
    const grid = document.getElementById('portfolio-grid');
    const error = document.getElementById('error-message');
    
    // Показываем загрузку
    grid.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Загружаем проекты...</p>
        </div>
    `;
    error.style.display = 'none';
    
    try {
        // Правильный запрос с Personal Access Token
        const response = await fetch(
          `https://api.airtable.com/v0/${AIRTABLE_CONFIG.BASE_ID}/${encodeURIComponent(AIRTABLE_CONFIG.TABLE_NAME)}`,
          {
            headers: {
              'Authorization': `Bearer ${AIRTABLE_CONFIG.PERSONAL_ACCESS_TOKEN}`,
            }
          }
        );
        
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.records && data.records.length > 0) {
            displayProjects(data.records);
        } else {
            showNoProjects();
        }
        
    } catch (error) {
        console.error('Ошибка загрузки проектов:', error);
        showError();
    }
}

// Отображение проектов
function displayProjects(projects) {
    const grid = document.getElementById('portfolio-grid');
    
    const projectsHTML = projects.map(project => {
        const fields = project.fields || {};
        
        // Получаем URL изображения
        const imageUrl = getImageUrl(fields);
        
        // Создаем slug для URL
        const slug = createSlug(fields.Title);
        
        return `
            <div class="project-card">
                <img src="${imageUrl}" alt="${fields.Title || 'Проект'}" class="project-image" loading="lazy">
                <div class="project-content">
                    <h3 class="project-title">${fields.Title || 'Проект скоро будет добавлен'}</h3>
                    <div class="project-details">
                        ${fields.Category ? `<div class="project-detail">Тип работ: ${fields.Category   }</div>` : ''}
                        ${fields.Area ? `<div class="project-detail">Площадь: ${fields.Area}</div>` : ''}
                        ${fields.Duration ? `<div class="project-detail">Время выполнения: ${fields.Duration}</div>` : ''}
                        ${fields.Year ? `<div class="project-detail">Год: ${fields.Year}</div>` : ''}
                        ${fields.Description ? `<div class="project-detail">${fields.Description}</div>` : ''}
                    </div>
                    <!--
                    <a href="https://airtable.com/appBWg4C27WYIidvn/shrM3ZL8ZGPJIeYVD/tblU5ngVZGQsCCrhH/viwHV99kfLN2Hj4KP/${project.id}" class="view-project">
                        Смотреть проект
                    </a>
                    -->
                    
                </div>
            </div>
        `;
    }).join('');
    
    grid.innerHTML = projectsHTML;
}

// Получение URL изображения
function getImageUrl(fields) {
    if (fields.Image && fields.Image.length > 0) {
        // Пробуем разные варианты получения URL
        return fields.Image[0].thumbnails?.large?.url || 
               fields.Image[0].thumbnails?.small?.url || 
               fields.Image[0].url;
    }
    
    // Заглушка если нет изображения
    return 'images/placeholder.jpg';
}

// Создание slug для URL
function createSlug(title) {
    if (!title) return 'project';
    
    return title
        .toLowerCase()
        .replace(/[^a-z0-9а-яё\s]/gi, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 50); // Ограничиваем длину
}

// Показать ошибку
function showError() {
    const grid = document.getElementById('portfolio-grid');
    const error = document.getElementById('error-message');
    
    grid.innerHTML = '';
    error.style.display = 'block';
}

// Показать сообщение "нет проектов"
function showNoProjects() {
    const grid = document.getElementById('portfolio-grid');
    
    grid.innerHTML = `
        <div class="loading">
            <i class="fas fa-folder-open"></i>
            <p>Проекты не найдены</p>
            <p style="font-size: 0.9rem; margin-top: 10px;">Добавьте проекты в Airtable</p>
        </div>
    `;
}

// Загружаем проекты при загрузке страницы
document.addEventListener('DOMContentLoaded', loadProjects);