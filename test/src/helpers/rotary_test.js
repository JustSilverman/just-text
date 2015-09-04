var rotary = require('../../../helpers/rotary');

describe('Rotary', function() {
  it('should parse non-numeric characters', function() {
    assert.strictEqual('1234567890', rotary.parse('(123) 456-7890'));
    assert.strictEqual('1234567890', rotary.parse('123 456-7890'));
    assert.strictEqual('1234567890', rotary.parse('123.456.7890'));
    assert.strictEqual('1234567890', rotary.parse('.123.456.7890'));
    assert.strictEqual('1234567890', rotary.parse('123-456-7890'));
    assert.strictEqual('1234567890', rotary.parse('123 456 7890'));
  });
});
