'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  articleTag: Handlebars.compile(document.querySelector('#template-article-tag').innerHTML),
  articleAuthor: Handlebars.compile(document.querySelector('#template-article-author').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML)
};

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post .post-author',
  optCloudClassCount = 5,
  optCloudClassPrefix = 'tag-size-',
  optAuthorsListSelector = '.authors';

function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  // console.log(event);

  /* remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a');
  // console.log(activeLinks);

  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }
  /* add class 'active' to the clicked link */
  // console.log('clickedElement:', clickedElement);
  clickedElement.classList.add('active');

  /* remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts .active');
  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }
  /* get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');
  // console.log(articleSelector);

  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);
  // console.log(targetArticle);

  /* add class 'active' to the correct article */
  targetArticle.classList.add('active');
}


function generateTitleLinks(customSelector = '') {
  // console.log(customSelector);
  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  // titleList.innerHTML = '';
  /* for each article */
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  // console.log(articles);

  let html = '';

  for (let article of articles) {

    /* get the article id */
    const articleId = article.getAttribute('id');
    // console.log(articleId);

    /* find the title element */
    /* get the title from the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;

    /* create HTML of the link */
    const linkHTMLData = { id: articleId, title: articleTitle };
    const linkHTML = templates.articleLink(linkHTMLData);

    /* insert link into titleList */

    //titleList.innerHTML = titleList.innerHTML + linkHTML;
    //titleList.insertAdjacentHTML('beforeend', linkHTML);
    html = html + linkHTML;
  }

  titleList.innerHTML = html;
  // console.log(html);

  const links = document.querySelectorAll('.titles a');

  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

function calculateTagsParams(tags) {
  const params = { max: 0, min: 999999 };
  for (let tag in tags) {
    // console.log(tag + ' is used ' + tags[tag] + ' times');
    if (tags[tag] > params.max) {
      params.max = tags[tag];
    } else (tags[tag] > params.min); {
      params.min = tags[tag];
    }
  }

  return params;
}
//return params;

function calculateTagClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);
  // console.log(classNumber);
  return optCloudClassPrefix + classNumber;
}


function generateTags() {
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  // console.log(articles);
  /* START LOOP: for every article: */
  for (let article of articles) {
    /* find tags wrapper */
    const wrapperTags = article.querySelector(optArticleTagsSelector);
    // console.log(wrapperTags);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    // console.log(articleTags);
    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    // console.log(articleTagsArray);
    /* START LOOP: for each tag */
    for (let tag of articleTagsArray) {
      /* generate HTML of the link */
      const linkHTMLData = { id: tag, title: tag };
      const linkHTML = templates.articleTag(linkHTMLData);
      /* add generated code to html variable */
      html += linkHTML;
      /* [NEW] check if this link is NOT already in allTags */
      // eslint-disable-next-line no-prototype-builtins
      if (!Object.prototype.hasOwnProperty.call(allTags, tag)) {
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    }
    /* END LOOP: for each tag */
    /* insert HTML of all the links into the tags wrapper */
    wrapperTags.innerHTML = html;
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector('.tags');
  /*[NEW] calculate number of used tags */
  const tagsParams = calculateTagsParams(allTags);
  // console.log('tagsParams:', tagsParams);
  const allTagsData = { tags: [] };
  //let html = '';
  /*[New] Start loop: for each tag in all tags */
  for (let tag in allTags) {
    /*[New] generate code of a link and add it to allTagsHTML*/
    //allTagsHTML += '<li><a href="#tag-' + tag + '" class="' + calculateTagClass(allTags[tag], tagsParams) + '">' + tag + '</a></li>';
    //const linkHTMLData = {id: tag, tag: tag};
    //const linkHTML = templates.tagCloudLink(linkHTMLData);
    //html = linkHTML;
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
  }
  /*[New] End loop: for each tag in allTags: */
  /*[New] add html from allTagsHTML to tagList */
  //tagList.innerHTML = templates.tagCloudLink(allTagsData) + html;
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
}
/* END LOOP: for every article: */

generateTags();



function tagClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();
  // console.log(event);
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  // console.log(href);
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  // console.log(tag);
  /* find all tag links with class active */
  const tagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  // console.log(tagLinks);
  /* START LOOP: for each active tag link */
  for (let tagLink of tagLinks) {
    /* remove class active */
    tagLink.classList.remove('active');
  }
  /* END LOOP: for each active tag link */

  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagLinksHref = document.querySelectorAll('a[href="' + href + '"]');
  /* START LOOP: for each found tag link */
  for (let tagLinkHref of tagLinksHref) {
    console.log(tagLinkHref);
    /* add class active */
    tagLinkHref.classList.add('active');
  }
  /* END LOOP: for each found tag link */
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks(`[data-tags~=${tag}]`);

}

function addClickListenersToTags() {
  /* find all links to tags */
  const linksTags = document.querySelectorAll('a[href^="#tag-"]');
  console.log('klick', linksTags);
  /* START LOOP: for each link */
  for (let linkTag of linksTags) {
    /* add tagClickHandler as event listener for that link */
    linkTag.addEventListener('click', tagClickHandler);
  }
  /* END LOOP: for each link */
}
addClickListenersToTags();





//Authors List


function calculateAuthorsParams(author) {
  const paramsAuthors = { max: 0, min: 999999 };
  for (let authorTags in author) {
    // console.log(authorTags + ' is used ' + author[authorTags] + ' times');
    if (author[authorTags] > paramsAuthors.max) {
      paramsAuthors.max = author[authorTags];
    } else (author[authorTags] > paramsAuthors.min); {
      paramsAuthors.min = author[authorTags];
    }
  }
  return paramsAuthors;
}

function generateAuthors() {
  /* [NEW] create a new variable allAuthors with an empty object */
  let allAuthors = {};
  //find all authors
  const authorLists = document.querySelectorAll(optArticleSelector);
  // console.log(authorLists);
  //Start loop :for every authors
  for (let authorList of authorLists) {
    let html = '';
    //find tag author
    const wrapperTag = authorList.querySelector(optArticleAuthorSelector);
    // console.log(wrapperTag);
    // get tags from author-tags attribute 
    let authorTags = authorList.getAttribute('data-author');
    // console.log(authorTags);
    /* generate HTML of the link */
    const linkHTMLData = { id: authorTags, title: authorTags };
    const linkHTML = templates.articleAuthor(linkHTMLData);
    html += linkHTML;
    /* [NEW] check if this link is NOT already in allAuthors*/

    if (!Object.prototype.hasOwnProperty.call(allAuthors, authorTags)) {
      /* [NEW] add generated code to allTags object */
      allAuthors[authorTags] = 1;
    } else {
      allAuthors[authorTags]++;
    }
    wrapperTag.innerHTML = html;
  }
  //end loop for every authors
  /* [NEW] find list of authors in right column */
  const listAuthors = document.querySelector(optAuthorsListSelector);
  /*[NEW] calculate number of used tags */
  const authorsParams = calculateAuthorsParams(allAuthors);
  console.log('authorsParams:', authorsParams);
  //let authorName = '';
  const allAuthorData = { author: [] };
  /*[New] Start loop: for each author in all authors */
  for (let authorTags in allAuthors) {
    /*[New] generate code of a link and add it to authorName*/
    //authorName += '<li><a href="#author-' + authorTags + '">' + authorTags + '(' + allAuthors[authorTags] + ') </a></li>';
    allAuthorData.author.push({
      author: authorTags,
      count: allAuthors[authorTags],
    });
  }
  /*[New] add html from authorName to listAuthors */
  listAuthors.innerHTML = templates.authorCloudLink(allAuthorData);

}
generateAuthors();



function authorClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "tag" and extract tag from the "href" constant */
  const author = href.replace('#author-', '');
  /* find all tag links with class active */
  const authorLinks = document.querySelectorAll('a.active[href^="#author-"]');
  /* START LOOP: for each active tag link */
  for (let authorLink of authorLinks) {
    /* remove class active */
    authorLink.classList.remove('active');
  }
  /* END LOOP: for each active tag link */

  /* find all tag links with "href" attribute equal to the "href" constant */
  const authorLinksHref = document.querySelectorAll('a[href="' + href + '"]');
  /* START LOOP: for each found tag link */
  for (let authorLinkHref of authorLinksHref) {
    /* add class active */
    authorLinkHref.classList.add('active');
  }
  /* END LOOP: for each found tag link */
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author="' + author + '"]');

}

function addClickListenersToAuthors() {
  /* find all links to tags */
  const linksTags = document.querySelectorAll('a[href^="#author-"]');

  /* START LOOP: for each link */
  for (let linkTag of linksTags) {
    /* add tagClickHandler as event listener for that link */
    linkTag.addEventListener('click', authorClickHandler);
  }
  /* END LOOP: for each link */
}
addClickListenersToAuthors();
