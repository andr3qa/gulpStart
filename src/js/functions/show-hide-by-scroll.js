import vars from '../_vars.js';

export const showHideByScroll = () => {
    let lastScroll = 0;
    const defaultOffset = 100;
    const burger = document.querySelector('.burger');

    const scrollPosition = () => window.pageYOffset || document.documentElement.scrollTop;
    const containHide = () => burger.classList.contains(`burger_hide`);

    window.addEventListener('scroll', () => {
        if (scrollPosition() > lastScroll && !containHide() && scrollPosition() > defaultOffset) {
            //scroll down
            burger.classList.add(`burger_hide`);
        } else if (scrollPosition() < lastScroll && containHide()) {
            //scroll up
            burger.classList.remove(`burger_hide`);
        }

        lastScroll = scrollPosition();
    })
}
