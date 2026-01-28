document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            alert('🎵 Функция будет добавлена в следующем обновлении!');
        });
    });
    
    console.log('SoundCollab загружен!');
});
