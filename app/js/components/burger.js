document.querySelector('.burger',).addEventListener('click', () => {
    document.querySelector('.burger').classList.toggle('burger_active');
    document.querySelector('.nav').classList.toggle('nav_active');
});

document.querySelector('.nav').addEventListener('click', (e) => {
    if(e.target.classList.contains('nav__link')) {
        document.querySelector('.burger').classList.remove('burger_active');
        document.querySelector('.nav').classList.remove('nav_active');
    }
})
