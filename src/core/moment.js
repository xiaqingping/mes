import Vue from 'vue';

import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

Vue.prototype.$moment = moment;
