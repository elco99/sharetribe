import { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import r, { div, p } from 'r-dom';
import classNames from 'classnames';
import Immutable from 'immutable';

import { t } from '../../../utils/i18n';
import { className as classNameProp } from '../../../utils/PropTypes';

import closeIcon from './images/closeIcon.svg';
import css from './FlashMessage.css';


const FlashError = function FlashError({ message, closeHandler, customColor, errorRef }) {

  return div({
    className: classNames('FlashMessage_error', css.error),
    ref: errorRef,
    'data-msg': message,
  }, [
    p({
      className: css.message,
      dangerouslySetInnerHTML: {
        __html: message,
      },
    }),
    div({
      className: css.closeButton,
      onClick: closeHandler,
      dangerouslySetInnerHTML: {
        __html: closeIcon,
      },
    }),
  ]);
};

const FlashNotice = function FlashNotice({ message, closeHandler, customColor, noticeRef }) {

  return div({
    className: classNames('FlashMessage_notice', css.notice),
    ref: noticeRef,
    'data-msg': message,
  }, [
    p({
      className: css.noticeMessage,
      dangerouslySetInnerHTML: {
        __html: message,
      },
    }),
    div({
      className: css.closeIcon,
      onClick: closeHandler,
      dangerouslySetInnerHTML: {
        __html: closeIcon,
      },
    }),
  ]);
};


class FlashMessage extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      errors: new Immutable.List(),
      notices: new Immutable.List(),
    };

    this.closeHandler = this.closeHandler.bind(this);
  }

  componentDidMount() {
    this.setState({
      errors: new Immutable.List([
        new Immutable.Map({ msg: 'This is a drill!', ref: null }),
        new Immutable.Map({ msg: this.props.notifications['error'], ref: null }),
      ]),
      notices: new Immutable.List([
        new Immutable.Map({ msg: 'Blaa blaa', ref: null }),
        new Immutable.Map({ msg: this.props.notifications['warning'], ref: null }),
        new Immutable.Map({ msg: this.props.notifications['notice'], ref: null }),
      ]),
    });
  }

  closeHandler(event) {
    let error = null;
    let notice = null;

    // // TODO get rid of these two lists and combine them to some map
    // this.errorMessageRefs.forEach((errorMessage) => {
    //   if (errorMessage && errorMessage.contains(event.currentTarget)) {
    //     error = this.state.errors.find((e) => e.msg === errorMessage.dataset.msg);
    //   }
    // });

    // // TODO get rid of these two lists and combine them to some map
    // this.noticeMessageRefs.forEach((noticeMessage) => {
    //   if (noticeMessage && noticeMessage.contains(event.currentTarget)) {
    //     notice = this.state.notices.find((e) => e.msg === noticeMessage.dataset.msg);
    //   }
    // });

    const openErrors = this.state.errors.filterNot((error) => {
      return error.ref.contains(event.currentTarget);
    })
    debugger;
    this.setState({ errors: openErrors, notices });
  }

  render() {
    const { customColor, className } = this.props;
    let errors = this.state.errors;
    this.errorMessageRefs = [];

    const notices = this.state.notices;
    this.noticeMessageRefs = [];

    const errorMessages = r(ReactCSSTransitionGroup,
      {
        className: css.cssTransitionGroup,
        component: 'div',
        transitionName: {
          enter: css.enterTop,
          enterActive: css.enterTopActive,
          leave: css.leaveTop,
          leaveActive: css.leaveTopActive,
        },
        transitionEnterTimeout: 1000,
        transitionLeaveTimeout: 1000,
      },
      errors.size > 0 ?
        div(
          {
            className: classNames('FlashMessage', css.errors, className),
          },
          errors.map((error, index) => {
            return r(FlashError, {
              key: error.get('msg'),
              message: error.get('msg'),
              customColor,
              closeHandler: this.closeHandler,
              errorRef: (c) => {
                debugger;
                //this.setState({ errors: errors.setIn([index, 'ref'], c) });
                errors = errors.setIn([index, 'ref'], c)
                //this.errorMessageRefs.push(c);
              },
            })
          }).toArray()
        ) :
        []
      );

    const noticeMessages = r(ReactCSSTransitionGroup,
      {
        className: css.cssTransitionGroup,
        component: 'div',
        transitionName: {
          enter: css.enterRight,
          enterActive: css.enterRightActive,
          leave: css.leaveRight,
          leaveActive: css.leaveRightActive,
        },
        transitionEnterTimeout: 1000,
        transitionLeaveTimeout: 1000,
      },
      notices.size > 0 ?
        div({
          className: classNames('FlashMessage', css.notices, className),
          }, notices.map((notice) => {
            return r(FlashNotice, {
              key: notice.get('msg'),
              message: notice.get('msg'),
              customColor,
              closeHandler: this.closeHandler,
              noticeRef: (c) => {
                this.noticeMessageRefs.push(c);
              },
            })
          }).toArray()
        ) :
        []
      );

    return  div({ style: { position: 'absolute', top: 0, left: '50vw' } },
      [
        errorMessages,
        noticeMessages,
      ]
    );
  }
};

FlashMessage.propTypes = {
  notifications: PropTypes.object.isRequired,
  customColor: PropTypes.string,
  className: classNameProp,
};

export default FlashMessage;