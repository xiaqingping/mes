// import schema from 'async-validator';

export const basic = {
  name: {
    type: 'object',
    required: true,
    fields: {
      type: { type: 'number', required: true },
      name: { type: 'number', required: true },
    },
  },
};
