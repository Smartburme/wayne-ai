document.addEventListener('DOMContentLoaded', () => {
    // Animate letters
    const letters = document.querySelectorAll('.letters span');
    letters.forEach((letter, index) => {
        letter.style.animation = `float ${2 + index * 0.2}s ease-in-out infinite alternate`;
    });

    // Redirect after animation
    setTimeout(() => {
        window.location.href = 'main.html';
    }, 4000);
});
