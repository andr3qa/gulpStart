const offset = document.querySelector('.hero').offsetHeight;
const scrollUp = document.querySelector('.scroll-up');

const getTop = () => window.pageYOffset || document.documentElement.scrollTop;

window.addEventListener('scroll', () => {
    if(getTop() > offset) {
        scrollUp.classList.add('scroll-up_active');
    } else {
        scrollUp.classList.remove('scroll-up_active');
    }
});

scrollUp.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});