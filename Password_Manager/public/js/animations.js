document.getElementById('toggleButton').addEventListener('click', function() {
    const element = document.getElementById('slidingElement');

    if (element.classList.contains('visible')) {
        element.classList.remove('visible');
        setTimeout(() => {
            element.classList.add('hidden');
        }, 500); 
    } else {
        element.classList.remove('hidden');
        setTimeout(() => {
            element.classList.add('visible');
        }, 10); 
    }
});
