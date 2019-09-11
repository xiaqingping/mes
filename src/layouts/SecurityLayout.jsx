import React from 'react';
import { connect } from 'dva';
import { Redirect } from 'umi';
import PageLoading from '@/components/PageLoading';

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
      // console.log(JSON.parse(localStorage.getItem('user')));
      // dispatch({
      //   type: 'user/saveCurrent',
      //   paylod: JSON.parse(localStorage.getItem('user')),
      // });
    }
  }

  render() {
    const { isReady } = this.state;
    const { children, loading, currentUser } = this.props;

    console.log(currentUser);

    if ((!currentUser.authorization && loading) || !isReady) {
      return <PageLoading />;
    }

    if (!currentUser.authorization) {
      return <Redirect to="/user/login"></Redirect>;
    }

    return children;
  }
}

export default connect(({ user, loading }) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(SecurityLayout);
