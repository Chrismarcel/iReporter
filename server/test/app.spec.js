import { expect } from 'chai';

describe('test', () => {
  it('should return a string', () => {
    expect('ci with travis').to.equal('ci with travis');
  });
});

export default function hello() {
  return 'hello';
}
