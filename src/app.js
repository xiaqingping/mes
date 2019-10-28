export const dva = {
  config: {
    // onEffect(fn) {
    //   // console.log(123456)
    //   console.log(fn)
    // },
    onError(e) {
      console.log(e.message);
    },
    // onAction() {
    //   console.log(123456)
    // },
    // onStateChange(fn) {
    //   console.log(fn)
    // },
  },
  plugins: [],
};
