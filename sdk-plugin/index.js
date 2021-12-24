import * as contentstack from 'contentstack';
import * as Utils from '@contentstack/utils';

import ContentstackLivePreview from '@contentstack/live-preview-utils';

const Stack = contentstack.Stack({
  api_key: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY,
  delivery_token: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN,
  environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT,
  region: process.env.NEXT_PUBLIC_CONTENTSTACK_REGION
    ? process.env.NEXT_PUBLIC_CONTENTSTACK_REGION
    : 'us',
  live_preview: {
    enable: true,
    management_token: process.env.NEXT_PUBLIC_CONTENTSTACK_MANAGEMENT_TOKEN,
    host: process.env.NEXT_PUBLIC_CONTENTSTACK_CUSTOM_HOST,
    ssr: true,
    debug: true,
  },
  stackDetails: {
    apiKey: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY,
    environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT,
  },
  clientUrlParams: {
    protocol: 'https',
    host: 'app.contentstack.com',
    port: 443,
  },
});

Stack.setHost(process.env.NEXT_PUBLIC_CONTENTSTACK_CUSTOM_HOST);
ContentstackLivePreview.init(Stack);
const renderOption = {
  ['span']: (node, next) => {
    return next(node.children);
  },
};
export const onEntryChange = ContentstackLivePreview.onEntryChange;

export default {
  /**
   *
   * fetches all the entries from specific content-type
   * @param {* content-type uid} contentTypeUid
   * @param {* reference field name} referenceFieldPath
   * @param {* Json RTE path} jsonRtePath
   *
   */
  getEntry({ contentTypeUid, referenceFieldPath, jsonRtePath }) {
    return new Promise((resolve, reject) => {
      const query = Stack.ContentType(contentTypeUid).Query();
      if (referenceFieldPath) query.includeReference(referenceFieldPath);
      query
        .includeOwner()
        .toJSON()
        .find()
        .then(
          (result) => {
            jsonRtePath &&
              Utils.jsonToHTML({
                entry: result,
                paths: jsonRtePath,
                renderOption,
              });
            resolve(result);
          },
          (error) => {
            reject(error);
          }
        );
    });
  },

  /**
   *fetches specific entry from a content-type
   *
   * @param {* content-type uid} contentTypeUid
   * @param {* url for entry to be fetched} entryUrl
   * @param {* reference field name} referenceFieldPath
   * @param {* Json RTE path} jsonRtePath
   * @returns
   */
  getEntryByUrl({ contentTypeUid, entryUrl, referenceFieldPath, jsonRtePath }) {
    return new Promise((resolve, reject) => {
      const blogQuery = Stack.ContentType(contentTypeUid).Query();
      if (referenceFieldPath) blogQuery.includeReference(referenceFieldPath);
      blogQuery.includeOwner().toJSON();
      const data = blogQuery.where('url', `${entryUrl}`).find();
      data.then(
        (result) => {
          jsonRtePath &&
            Utils.jsonToHTML({
              entry: result,
              paths: jsonRtePath,
              renderOption,
            });
          resolve(result[0]);
        },
        (error) => {
          reject(error);
        }
      );
    });
  },
};
