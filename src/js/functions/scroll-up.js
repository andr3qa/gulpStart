export const scrollUp = (selector) => {
  const offset = document.documentElement.clientHeight;
  const scrollUpBtn = document.querySelector(`.${selector}`);

  const getTop = () => window.pageYOffset || document.documentElement.scrollTop;

  window.addEventListener('scroll', () => {
    if (getTop() > offset) {
      scrollUpBtn.classList.add(`${selector}_active`);
    } else {
      scrollUpBtn.classList.remove(`${selector}_active`);
    }
  });
}
