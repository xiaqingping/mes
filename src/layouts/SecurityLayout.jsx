import React from 'react';
import { connect } from 'dva';
import { PageLoading } from '@ant-design/pro-layout';
import { Redirect } from 'umi';
import { basic } from '@/api';

const mouses = {
  x: undefined,
  y: undefined,
  acter: undefined,
  timer: undefined,
  inter: undefined,
  active(e, call) {
    clearTimeout(mouses.acter);
    mouses.acter = setTimeout(() => {
      mouses.x = undefined;
      mouses.y = undefined;
    }, 1000);
    if (!mouses.x || !mouses.y) {
      mouses.x = e.pageX;
      mouses.y = e.pageY;
    }
    const l = Math.abs(e.pageX - mouses.x) + Math.abs(e.pageY - mouses.y);
    if (e.type === 'click' || (e.type === 'mousemove' && l > 100)) {
      mouses.execute(call);
    }
  },
  execute(call) {
    clearTimeout(mouses.timer);
    mouses.timer = setTimeout(() => {
      clearTimeout(mouses.timer);
      clearInterval(mouses.inter);
      mouses.inter = undefined;
    }, 1000 * 60 * 5);
    if (!mouses.inter) {
      mouses.inter = setInterval(call, 1000 * 60 * 2);
      call();
    }
  },
};

class SecurityLayout extends React.Component {
  state = {
    isReady: false,
  };

  componentDidMount() {
    this.setState({
      isReady: true,
    });
    const { dispatch } = this.props;

    if (dispatch) {
      // TODO: 获取当前用户信息
      dispatch({
        type: 'user/fetchCurrent',
      });
    }

    window.addEventListener('click', this.getNotice);
    window.addEventListener('mousemove', this.getNotice);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.getNotice);
    window.removeEventListener('mousemove', this.getNotice);
  }

  getNotice = e => {
    mouses.active(e, () => {
      // TODO: 这里的接口换为消息通知接口
      basic.getPlants();
    });
  };

  render() {
    const { isReady } = this.state;
    // const { children, loading, currentUser } = this.props;
    // // You can replace it to your authentication rule (such as check token exists)
    // // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）

    // const isLogin = currentUser && currentUser.userid;
    // const queryString = stringify({
    //   redirect: window.location.href,
    // });

    // if ((!isLogin && loading) || !isReady) {
    //   return <PageLoading />;
    // }

    // if (!isLogin) {
    //   return <Redirect to={`/user/login?${queryString}`} />;
    // }

    const { children, loading } = this.props;
    const authorization = localStorage.getItem('token');

    if ((!authorization && loading) || !isReady) {
      return <PageLoading />;
    }

    if (!authorization) {
      return <Redirect to="/user/login" />;
    }

    return children;
  }
}

export default connect(({ user, loading }) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(SecurityLayout);
