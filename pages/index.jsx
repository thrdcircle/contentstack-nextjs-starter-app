import React, { useState, useEffect, useReducer } from 'react';
import { addEditableTags } from '@contentstack/utils';
import { connect } from 'react-redux';
import { onEntryChange } from '../sdk-plugin/index';
import { getHeaderRes, getFooterRes, getHomeRes } from '../helper/index';
import RenderComponents from '../components/render-components';
import { setFooter, setHeader, setPage } from '../redux/action/action';
import store from '../redux/store';

function Home(props) {
  const { result, entryUrl } = props;
  const {
    main: {
      header, footer, livePreview, liveEdit,
    },
  } = store.getState();
  const [getEntry, setEntry] = useState(result);
  const [getLivePreview, setLivePreview] = useState(livePreview);
  const [getLiveEdit, setLiveEdit] = useState(liveEdit);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  async function fetchData() {
    try {
      const entryRes = await getHomeRes(entryUrl);
      const headerRes = await getHeaderRes();
      const footerRes = await getFooterRes();
      console.log("live preview resp", entryRes);
      setHeader(headerRes);
      setFooter(footerRes);
      // setPage(entryRes);
      setEntry(entryRes);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    setPage(result);
  }, []);

  // fot live Preview option
  useEffect(() => {
    console.log("enable live preview", getLivePreview);
    onEntryChange(() => {
      console.info('Enabling live preview ', getLivePreview);
      if (getLivePreview) {
        return fetchData();
      }
    });
  }, [getLivePreview]);

  store.subscribe(() => {
    const check = store.getState().main;
    console.log(check.livePreview !== getLivePreview);
    console.log("state will be set", check.livePreview, getLivePreview);
    if (check.livePreview !== getLivePreview) {
      setLivePreview(check.livePreview);
    }
    if (check.liveEdit !== getLiveEdit) {
      setLiveEdit(check.liveEdit);
    }
  });
  console.log("check state for live preview", getLivePreview);
  // for live Edit option
  useEffect(() => {
    if (getLiveEdit) {
      console.info("Enabling live edit");
      addEditableTags(getEntry, 'page', true);
      addEditableTags(header, 'header', true);
      addEditableTags(footer, 'footer', true);
      forceUpdate();
    } else {
      console.info("Disabling live edit");
      addEditableTags(getEntry, 'page', false);
      addEditableTags(header, 'header', false);
      addEditableTags(footer, 'footer', false);
      forceUpdate();
    }
  }, [getLiveEdit]);

  console.log(getEntry);

  return (
    getEntry.page_components && (
      <RenderComponents
        pageComponents={getEntry.page_components}
        contentTypeUid="page"
        entryUid={getEntry.uid}
        locale={getEntry.locale}
      />
    )
  );
}

export async function getServerSideProps(context) {
  try {
    const entryRes = await getHomeRes(context.resolvedUrl);
    return {
      props: {
        entryUrl: context.resolvedUrl,
        result: entryRes,
      },
    };
  } catch (error) {
    return { notFound: false };
  }
}

export default connect(null, { setHeader, setFooter, setPage })(Home);
