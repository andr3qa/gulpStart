document.querySelector('.burger', ).addEventListener('click', () => {
    document.querySelector('.burger').classList.toggle('burger_active');
    document.querySelector('.nav-mobile').classList.toggle('nav-mobile_active');
});

document.querySelector('.nav-mobile').addEventListener('click', (e) => {
    if (e.target.classList.contains('nav-mobile__link')) {
        document.querySelector('.burger').classList.remove('burger_active');
        document.querySelector('.nav-mobile').classList.remove('nav-mobile_active');
    }
})
