import React, { useState, useEffect } from 'react';
import addEditableTags from '@contentstack/live-preview-utils';
import moment from 'moment';
import parse from 'html-react-parser';
import Stack, { onEntryChange } from '../../sdk-plugin/index';

import RenderComponents from '../../components/render-components';
import ArchiveRelative from '../../components/archive-relative';

async function getPageData(entryUrl) {
  const bannerRes = await Stack.getEntryByUrl({
    contentTypeUid: 'page',
    entryUrl: '/blog',
  });
  const entryRes = await Stack.getEntryByUrl({
    contentTypeUid: 'blog_post',
    entryUrl,
    referenceFieldPath: ['author', 'related_post'],
    jsonRtePath: ['body', 'related_post.body'],
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
  return [headerRes, footerRes, entryRes, bannerRes];
}

export default function BlogPost({
  header, banner, footer, result, entryUrl,
}) {
  const [getHeader, setHeader] = useState(header);
  const [getFooter, setFooter] = useState(footer);
  const [getBanner, setBanner] = useState(banner);
  const [getEntry, setEntry] = useState(result);

  async function fetchData() {
    try {
      const [headerRes, footerRes, entryRes, bannerRes] = await getPageData(
        entryUrl,
      );
      setHeader(headerRes[0][0]);
      setFooter(footerRes[0][0]);
      setEntry(entryRes[0]);
      setBanner(bannerRes[0]);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    onEntryChange(() => fetchData());
  }, [onEntryChange]);

  useEffect(() => {
    addEditableTags(getEntry, 'blog_post', true);
    addEditableTags(getBanner, 'page', true);
    addEditableTags(getHeader, 'header', true);
    addEditableTags(getFooter, 'footer', true);
  }, [getEntry, getFooter, getHeader, getBanner]);

  return (
    <>
      {banner.page_components && (
        <RenderComponents
          pageComponents={getBanner.page_components}
          blogsPage
          contentTypeUid="blog_post"
          entryUid={getEntry.uid}
          locale={getEntry.locale}
        />
      )}
      <div className="blog-container">
        <div className="blog-detail">
          <h2 {...getEntry.$?.title}>{getEntry.title ? getEntry.title : ''}</h2>
          <p {...getEntry.$?.date}>
            {moment(getEntry.date).format('ddd, MMM D YYYY')}
            ,
            <strong {...getEntry.author[0].$?.title}>
              {getEntry.author[0].title}
            </strong>
          </p>
          {typeof getEntry.body === 'string' && (
            <div {...getEntry.$?.body}>{parse(getEntry.body)}</div>
          )}
        </div>
        <div className="blog-column-right">
          <div className="related-post">
            {getBanner.page_components[2].widget && (
              <h2>
                {getBanner.page_components[2].widget.title_h2}
              </h2>
            )}
            {result.related_post && (
              <ArchiveRelative
                {...getEntry.$?.related_post}
                blogs={getEntry.related_post}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export async function getServerSideProps(context) {
  try {
    const [headerRes, footerRes, entryRes, bannerRes] = await getPageData(
      context.resolvedUrl,
    );
    return {
      props: {
        entryUrl: context.resolvedUrl,
        header: headerRes[0][0],
        footer: footerRes[0][0],
        result: entryRes[0],
        banner: bannerRes[0],
      },
    };
  } catch (error) {
    return { notFound: true };
  }
}
