export const scrollUp = () => {
    const offset = document.querySelector('.hero').offsetHeight;
    const scrollUpBtn = document.querySelector('.scroll-up');

    const getTop = () => window.pageYOffset || document.documentElement.scrollTop;

    window.addEventListener('scroll', () => {
        if (getTop() > offset) {
            scrollUpBtn.classList.add('scroll-up_active');
        } else {
            scrollUpBtn.classList.remove('scroll-up_active');
        }
    });
}
