const cardItems = document.querySelectorAll('.card-item');

cardItems.forEach(item => {
    item.addEventListener('click', () => {
        const checkmark = item.querySelector('.checkmark');
        if (checkmark.textContent === '') {
            checkmark.textContent = '✓';
            checkmark.style.color = 'green';
        } else {
            checkmark.textContent = '';
            checkmark.style.color = '';
        }
    });
});