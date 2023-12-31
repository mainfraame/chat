import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Browser, chromium, Page } from 'playwright';

import { initialize } from './pgVectorStore';

const urls = [
  'https://js.langchain.com/docs/use_cases',
  'https://js.langchain.com/docs/integrations/platforms',
  'https://js.langchain.com/docs/get_started/introduction'
];

const splitter = new RecursiveCharacterTextSplitter({
  chunkOverlap: 0,
  chunkSize: 1000
});

(async () => {
  const pg = await initialize();

  const browser: Browser = await chromium.launch({
    headless: true
  });
  const page: Page = await browser.newPage();

  for (const url of urls) {
    await page.goto(url);

    const $items = await page.$$('.menu__link--sublist');

    for (const item of $items) {
      await item.click();
    }

    const $sublists = await page.$$(
      '.menu__link--sublist[aria-expanded="false"]'
    );

    for (const item of $sublists) {
      await item.click();
    }

    const $links = await page.$$('.menu__list a[href]');

    let texts = [];

    for (const element of $links) {
      const link = `https://js.langchain.com${await element.getAttribute(
        'href'
      )}`;

      try {
        const docs = await new CheerioWebBaseLoader(link, {
          selector: 'article'
        }).load();

        const splits = await splitter.splitDocuments(docs);

        texts = [...texts, ...splits];

        console.log(`loaded: ${link}`);
      } catch (e) {
        console.warn(`failed to load: ${link}`);
      }
    }

    console.log(texts.length);

    await pg.addDocuments(texts);
  }

  await pg.end();

  await browser.close();
})();
