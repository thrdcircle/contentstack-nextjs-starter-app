import React, { useState, useEffect } from 'react';
import addEditableTags from '@contentstack/live-preview-utils';
import Stack, { onEntryChange } from '../sdk-plugin/index';
import RenderComponents from '../components/render-components';

async function getPageData(entryUrl) {
  const entryRes = await Stack.getEntryByUrl({
    contentTypeUid: 'page',
    entryUrl,
    jsonRtePath: ['page_components.section_with_buckets.buckets.description'],
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

  return [headerRes, footerRes, entryRes];
}

export default function About({
  header, footer, result, entryUrl,
}) {
  const [getHeader, setHeader] = useState(header);
  const [getFooter, setFooter] = useState(footer);
  const [getEntry, setEntry] = useState(result);

  async function fetchData() {
    try {
      const [headerRes, footerRes, entryRes] = await getPageData(entryUrl);
      setHeader(headerRes[0][0]);
      setFooter(footerRes[0][0]);
      setEntry(entryRes[0]);
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
    getEntry.page_components && (
    <RenderComponents
      pageComponents={getEntry.page_components}
      about
      contentTypeUid="page"
      entryUid={getEntry.uid}
      locale={getEntry.locale}
    />
    )
  );
}

export async function getServerSideProps(context) {
  try {
    const [headerRes, footerRes, entryRes] = await getPageData(
      context.resolvedUrl,
    );
    return {
      props: {
        entryUrl: context.resolvedUrl,
        result: entryRes[0],
      },
    };
  } catch (error) {
    return { notFound: true };
  }
}
