const { icon } = require('../util');

module.exports = {
  key: '404',
  path: '/404',
  file: '404.html',
  title: 'Page not found',
  description: 'This page could not be found.',
  render() {
    return `
  <section class="page-hero page-hero--404">
    <span class="page-hero__word" aria-hidden="true">404</span>
    <div class="container page-hero__inner">
      <p class="kicker">Error 404</p>
      <h1 class="page-hero__title">This page <span class="red">skipped leg day</span></h1>
      <p class="page-hero__sub">The page you're looking for doesn't exist or has moved.</p>
      <div class="hero__actions">
        <a href="/" class="btn btn--red btn--lg"><span>Back to home ${icon('arrow')}</span></a>
        <a href="/join" class="btn btn--outline btn--lg"><span>Book Free Trial</span></a>
      </div>
    </div>
  </section>`;
  },
};
