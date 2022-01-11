import React, { useState, useEffect } from 'react';
import addEditableTags from '@contentstack/live-preview-utils';

import moment from 'moment';
import Link from 'next/link';

import parse from 'html-react-parser';
import Stack, { onEntryChange } from '../../sdk-plugin/index';

import RenderComponents from '../../components/render-components';
import ArchiveRelative from '../../components/archive-relative';

async function getPageData(entryUrl) {
  const entryRes = await Stack.getEntryByUrl({
    contentTypeUid: 'page',
    entryUrl,
  });
  const bloglist = await Stack.getEntry({
    contentTypeUid: 'blog_post',
    referenceFieldPath: ['author', 'related_post'],
    jsonRtePath: ['body'],
  });
  const headerRes = await Stack.getEntry({
    contentTypeUid: 'header',
    referenceFieldPath: ['navigation_menu.page_reference'],
    jsonRtePath: ['notification_bar.announcement_text'],
  });
  const footerRes = await Stack.getEntry({
    contentTypeUid: 'footer',
    jsonRtePath: ['copyright'],
  });
  const archivedRes = [];
  const blogListRes = [];
  bloglist[0].forEach((blogs) => {
    if (blogs.is_archived) {
      archivedRes.push(blogs);
    } else {
      blogListRes.push(blogs);
    }
  });
  return [headerRes, footerRes, entryRes, blogListRes, archivedRes];
}

export default function Blog({
  archived,
  result,
  blogList,
  header,
  footer,
  entryUrl,
}) {
  const [getHeader, setHeader] = useState(header);
  const [getFooter, setFooter] = useState(footer);
  const [getEntry, setEntry] = useState(result);
  const [getArchived, setArchived] = useState(archived);
  const [getBlogList, setBlogList] = useState(blogList);

  async function fetchData() {
    try {
      const [
        headerRes,
        footerRes,
        entryRes,
        blogListRes,
        archivedRes,
      ] = await getPageData(entryUrl);
      setHeader(headerRes[0][0]);
      setFooter(footerRes[0][0]);
      setEntry(entryRes[0]);
      setArchived(archivedRes);
      setBlogList(blogListRes);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    onEntryChange(() => fetchData());
  }, [onEntryChange]);

  useEffect(() => {
    addEditableTags(getEntry, "page", true);
    addEditableTags(getHeader, "header", true);
    addEditableTags(getFooter, "footer", true);
  }, [getEntry, getFooter, getHeader]);

  return (
    <>
      {getEntry.page_components && (
        <RenderComponents
          pageComponents={getEntry.page_components}
          blogsPage
          contentTypeUid="page"
          entryUid={getEntry.uid}
          locale={getEntry.locale}
        />
      )}
      <div className="blog-container">
        <div className="blog-column-left">
          {getBlogList?.map((bloglist, index) => (
            <div className="blog-list" key={index}>
              {bloglist.featured_image && (
                <Link href={bloglist.url}>
                  <a>
                    <img
                      alt="blog img"
                      className="blog-list-img"
                      src={bloglist.featured_image.url}
                      {...bloglist.featured_image.$?.url}
                    />
                  </a>
                </Link>
              )}
              <div className="blog-content" {...bloglist.$?.blog}>
                {bloglist.title && (
                  <Link href={bloglist.url}>
                    <h3 {...bloglist.$?.title}>{bloglist.title}</h3>
                  </Link>
                )}
                <p {...bloglist.$?.date}>
                  {moment(bloglist.date).format('ddd, MMM D YYYY')}
                  ,
                  {' '}
                  <strong {...bloglist.author[0].$?.title}>
                    {bloglist.author[0].title}
                  </strong>
                </p>
                {typeof bloglist.body === 'string' && (
                  <div {...bloglist.$?.body}>
                    {parse(bloglist.body.slice(0, 300))}
                  </div>
                )}
                {bloglist.url ? (
                  <Link href={bloglist.url}>
                    <a>
                      <span>{'Read more -->'}</span>
                    </a>
                  </Link>
                ) : (
                  ''
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="blog-column-right">
          {getEntry.page_components[1].widget && (
            <h2 {...getEntry.page_components[1].widget.$?.title_h2}>
              {getEntry.page_components[1].widget.title_h2}
              {' '}
            </h2>
          )}
          <ArchiveRelative blogs={getArchived} />
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    const [headerRes,
      footerRes,
      entryRes,
      blogList,
      archived,
    ] = await getPageData(context.resolvedUrl);
    return {
      props: {
        entryUrl: context.resolvedUrl,
        header: headerRes[0][0],
        footer: footerRes[0][0],
        result: entryRes[0],
        blogList,
        archived,
      },
    };
  } catch (error) {
    return { notFound: true };
  }
}
