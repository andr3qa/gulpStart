export const showHideByScroll = (selector) => {
  let lastScroll = 0;
  const defaultOffset = 135;
  const scrollUp = document.querySelector(`.${selector}`);

  const scrollPosition = () => window.pageYOffset || document.documentElement.scrollTop;
  const containHide = () => scrollUp.classList.contains(`${selector}_active`);

  window.addEventListener('scroll', () => {
    if (scrollPosition() > lastScroll && !containHide() && scrollPosition() > defaultOffset) {
      //scroll down
      scrollUp.classList.add(`${selector}_active`);
    } else if (scrollPosition() < lastScroll && containHide()) {
      //scroll up
      scrollUp.classList.remove(`${selector}_active`);
    }

    lastScroll = scrollPosition();
  })
}
