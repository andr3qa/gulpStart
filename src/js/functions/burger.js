import {
    disableScroll
} from '../functions/disable-scroll.js';
import {
    enableScroll
} from '../functions/enable-scroll.js';

export const burger = () => {
    const burger = document?.querySelector('.menu-btn');
    const menu = document?.querySelector('.nav__list');
    const menuItems = document?.querySelectorAll('.nav-close');
    const hero = document?.querySelector('.hero');
    const overlay = document?.querySelector('.hero');

    burger?.addEventListener('click', (e) => {
        burger?.classList.toggle('menu-btn_active');
        menu?.classList.toggle('nav__list_active');
        hero?.classList.toggle('hero_active');

        if (menu?.classList.contains('nav__list_active')) {
            burger?.setAttribute('aria-expanded', 'true');
            burger?.setAttribute('aria-label', 'Закрыть меню');
            disableScroll();
        } else {
            burger?.setAttribute('aria-expanded', 'false');
            burger?.setAttribute('aria-label', 'Открыть меню');
            enableScroll();
        }
    });

    overlay?.addEventListener('click', (e) => {
        burger?.setAttribute('aria-expanded', 'false');
        burger?.setAttribute('aria-label', 'Открыть меню');
        burger.classList.remove('menu-btn_active');
        menu.classList.remove('nav__list_active');
        hero.classList.remove('hero_active');
        enableScroll();
    });

    menuItems?.forEach(el => {
        el.addEventListener('click', () => {
            burger?.setAttribute('aria-expanded', 'false');
            burger?.setAttribute('aria-label', 'Открыть меню');
            burger.classList.remove('menu-btn_active');
            menu.classList.remove('nav__list_active');
            hero.classList.remove('hero_active');
            enableScroll();
        });
    });
};
