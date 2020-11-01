document.querySelector('.burger',).addEventListener('click', () => {
    document.querySelector('.burger').classList.toggle('burger_active');
    document.querySelector('.m-nav').classList.toggle('m-nav_active');
});

document.querySelector('.m-nav').addEventListener('click', (e) => {
    if(e.target.classList.contains('m-nav__link')) {
        document.querySelector('.burger').classList.remove('burger_active');
        document.querySelector('.m-nav').classList.remove('m-nav_active');
    }
})
