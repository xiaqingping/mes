import config from './config';
import { merge } from 'lodash';

const prodConfig = merge({}, config, {
  define: {
    ENV: 'pre'
  }
});

export default prodConfig;
