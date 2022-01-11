import React from 'react';
import { connect } from 'react-redux';
import store from '../redux/store';
import * as t from '../redux/type';
import { setLiveEdit, setLivePreview } from '../redux/action/action';

function Widget(props) {
  function updatedState(tag) {
    if (tag === t.SET_LIVE_EDIT) {
      props.setLiveEdit();
    } else if (tag === t.SET_LIVE_PREVIEW) {
      props.setLivePreview();
    }
  }

  return (
    <div className="widget">
      <div className="widget-action">
        <label className="switch">
          <input
            type="checkbox"
            // defaultChecked={liveEdit}
            onChange={() => updatedState('livePreview')}
          />
          <span className="slider round" />
        </label>
        <span className="widget-title">Live Preview</span>
      </div>
      <span className="divider">|</span>
      <div className="widget-action">
        <label className="switch">
          <input
            type="checkbox"
            // defaultChecked={liveEdit}
            onChange={() => updatedState('liveEdit')}
          />
          <span className="slider round" />
        </label>
        <span className="widget-title">Live Edit</span>
      </div>
      <span className="divider">|</span>
      <div
        className="widget-action"
        data-bs-toggle="modal"
        data-bs-target="#staticBackdrop"
      >
        <img src="/json-preview.svg" alt="JSON Preview icon" />
        <span className="widget-title">Json Preview</span>
      </div>
    </div>
  );
}

export default connect(null, { setLiveEdit, setLivePreview })(Widget);
