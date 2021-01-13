document.querySelector('.burger',).addEventListener('click', () => {
    document.querySelector('.burger').classList.toggle('burger_active');
    document.querySelector('.mobile-nav').classList.toggle('mobile-nav_active');
});

document.querySelector('.mobile-nav').addEventListener('click', (e) => {
    if(e.target.classList.contains('mobile-nav__link')) {
        document.querySelector('.burger').classList.remove('burger_active');
        document.querySelector('.mobile-nav').classList.remove('mobile-nav_active');
    }
})
