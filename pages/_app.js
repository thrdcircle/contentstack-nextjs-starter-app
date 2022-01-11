/* eslint-disable prefer-destructuring */
import App from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';
import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';
// import ContentstackLivePreview from '@contentstack/live-preview-utils';
import { getHeaderRes, getFooterRes } from '../helper';
import store from '../redux/store';
import Layout from '../components/layout';

import 'nprogress/nprogress.css';
import '../styles/third-party.css';
import '../styles/style.css';
import '@contentstack/live-preview-utils/dist/main.css';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp(props) {
  const {
    Component, pageProps, header, footer,
  } = props;
  const { result, blogList, archived } = pageProps;
  const List = blogList ? blogList.concat(archived) : undefined;

  // ContentstackLivePreview.init({ enable: true });

  return (
    <Provider store={store}>
      <Layout
        header={header}
        footer={footer}
        page={result}
        blogpost={List || undefined}
      >
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

const makeStore = () => store;
MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  const header = await getHeaderRes();
  const footer = await getFooterRes();
  return { ...appProps, header, footer };
};

export default withRedux(makeStore)(MyApp);
