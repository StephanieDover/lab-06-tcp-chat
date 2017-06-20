'use strict';

const expect = require('expect');
const handleTroll = require('../index.js');

describe('testing /troll', () => {
  it('should update user nickname', () => {
    let data = '/troll cat 5';
    expect(handleTroll(data.split('/troll')[1].trim(), data.split('')[1].trim())).toEqual(`cat 5 \ncat 5 \ncat 5 \ncat 5 \ncat 5 \n`);
  });
});
