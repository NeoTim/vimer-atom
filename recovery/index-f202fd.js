'use strict';

const { open } = require('../actions/modal');

const isServer = typeof window === 'undefined';
const net = isServer ? { } : require('network');
const are = isServer ? { } : require('are');

const type = require('../constants');

exports.fetchRecords = () => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      net.get('records', null, res => {
        if (res.code !== 'OK') return reject(res);
        if (!res.data) {
          res.data = [ ];
        }
        dispatch({
          type: type.RECEIVE_RECORDS,
          records: res.data,
        });

        resolve(res.data);
      }, reject);
    });
  };
};

exports.loadPrize = () => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      net.get('queryWinPrizes', { }, res => {
        if (res.code !== 'OK') return reject(res);

        dispatch({
          type: type.RECEIVE_PRIZES,
          prizes: res.data,
        });
        resolve(res.data);
      }, reject);
    });
  };
};

exports.fetchingCard = id => {
  return { type: type.FETCHING_CARD, id };
};

exports.openCard = id => {
  const t1 = new Date().getTime();
  return dispatch => {
    dispatch({ type: 'FETCHING_START' });
    return new Promise((resolve, reject) => {
      net.get('openCard', { serial: id + 1 }, res => {
        if (res.code !== 'OK') {
          dispatch(open('MODAL_OPEN_CARD_FAIL'));
          return reject(res);
        }

        const t2 = new Date().getTime();
        const diff = t2 - t1;

        if (diff >= type.ANIMATION_DELAY) {
          dispatch(openCardSuccess(id, res.data));
          dispatch({ type: 'FETCHING_SUCCESS' });
        } else {
          setTimeout(() => {
            dispatch(openCardSuccess(id, res.data));
            dispatch({ type: 'FETCHING_SUCCESS' });
          // 加 100 毫秒，防止意外
          }, type.ANIMATION_DELAY - diff + 100);
        }

        // hack TODO
        dispatch(exports.fetchRecords());

        resolve(res.data);
      }, reject);
    });
  };
};

exports.redeem = () => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      net.get('redeem', null, res => {
        if (res.code !== 'OK') return reject(res);

        dispatch({
          type: type.REDEEM_SUCCESS,
          data: res.data,
        });
        resolve(res.data);
      }, reject);
    });
  };
};

function openCardSuccess(id, data) {
  return {
    type: type.OPEN_CARD_SUCCESS,
    data: Object.assign({ }, { id }, data),
  };
}

// 输入邀请码
exports.confirmInvited = data => {
  data._are_ = are.getParamStr();

  // TODO
  data.ctoken = readCookie('ctoken');
  return () => {
    return new Promise((resolve, reject) => {
      net.post('confirmInvited', data, res => {
        if (res.code === 'OK') {
          return resolve(res);
        }
        reject(res);
      }, reject);
    });
  };
};

// Read cookie
function readCookie(name) {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[ i ];
    while (c.charAt(0) === ' ') {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
}
