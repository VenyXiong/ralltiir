/**
 * @file unit test for underscore
 * @author harttle<yangjvn@126.com>
 */

/* eslint max-nested-callbacks: ["error", 5] */

/* globals sinon: true */

define(function (require) {
    var _ = require('lang/underscore');

    describe('underscore', function () {
        var obj = {
            foo: 'bar',
            bar: false,
            coo: {
                doo: 'cool',
                eww: ['wow']
            }
        };

        function func(a, b, c) {
            return a + '1' + b + '2' + c;
        }
        describe('.reduce()', function () {
            it('should call iteratee for Array type collection', function () {
                var spy = sinon.spy();
                var arr = ['a', 'b', 'c'];
                _.reduce(arr, spy);
                expect(spy).to.have.been.calledTwice;
                expect(spy.args[0]).to.deep.equal(['a', 'b', 1, arr]);
                expect(spy.args[1]).to.deep.equal([undefined, 'c', 2, arr]);
            });
            it('should call iteratee for Object type collection', function () {
                var spy = sinon.spy();
                var obj = {a: 'x', b: 'y', c: 'z'};
                _.reduce(obj, spy);
                expect(spy).to.have.been.calledTwice;
                expect(spy.args[0]).to.deep.equal(['x', 'y', 'b', obj]);
                expect(spy.args[1]).to.deep.equal([undefined, 'z', 'c', obj]);
            });
            it('should respect init value', function () {
                var spy = sinon.spy();
                var obj = {a: 'x'};
                _.reduce(obj, spy, 'b');
                expect(spy).to.have.been.calledOnce;
                expect(spy.args[0]).to.deep.equal(['b', 'x', 'a', obj]);
            });
            it('should pass return value', function () {
                var obj = {a: 'x'};
                var ret = _.reduce(obj, function (prev, curr) {
                    return prev + curr;
                }, 'b');
                expect(ret).to.equal('bx');
            });
        });
        describe('.keys()', function () {
            it('should return array of keys', function () {
                expect(_.keys(obj)).to.deep.equal(['foo', 'bar', 'coo']);
            });
            it('should not include inherited keys', function () {
                var foo = Object.create({bar: 'bar'});
                foo.coo = 'coo';
                expect(_.keys(foo)).to.deep.equal(['coo']);
            });
        });
        describe('.keysIn()', function () {
            it('should return array of keys', function () {
                expect(_.keysIn(obj)).to.deep.equal(['foo', 'bar', 'coo']);
            });
            it('should include inherited keys', function () {
                var foo = Object.create({bar: 'bar'});
                foo.coo = 'coo';
                expect(_.keysIn(foo)).to.deep.equal(['coo', 'bar']);
            });
        });
        describe('.has()', function () {
            it('should return true if direct property exists', function () {
                expect(_.has(obj, 'foo')).to.be.true;
            });
            it('should return true if value is ""', function () {
                expect(_.has({foo: ''}, 'foo')).to.be.true;
            });
            it('should return true if value is null', function () {
                expect(_.has({foo: null}, 'foo')).to.be.true;
            });
            it('should return false if value not defined', function () {
                expect(_.has({}, 'foo')).to.be.false;
            });
            it('should return false obj not defined', function () {
                expect(_.has(undefined, 'foo')).to.be.false;
            });
            it('should return true if deep property exists', function () {
                expect(_.has({foo: {bar: 'coo'}}, 'foo.bar')).to.be.true;
            });
            it('should return false if deep property not exists', function () {
                expect(_.has({foo: {bar: 'coo'}}, 'foo.bar.coo')).to.be.false;
            });
        });
        describe('.get()', function () {
            it('should get direct property', function () {
                expect(_.get(obj, 'foo')).to.equal('bar');
            });
            it('should get deep property', function () {
                expect(_.get(obj, 'coo.doo')).to.equal('cool');
            });
            it('should get array property', function () {
                expect(_.get(obj, 'coo.eww.0')).to.equal('wow');
            });
            it('should return undefined if not exist', function () {
                expect(_.get(obj, 'doo')).to.be.undefined;
            });
            it('should return undefined if deep property not exist', function () {
                expect(_.get(obj, 'coo.eww.2')).to.be.undefined;
            });
        });
        describe('.set()', function () {
            var obj;
            beforeEach(function () {
                obj = {foo: 'foo', bar: {haa: 'coo'}};
            });
            it('should set direct property', function () {
                _.set(obj, 'foo', 'bar');
                expect(obj.foo).to.equal('bar');
            });
            it('should not throw if obj undefined', function () {
                expect(function () {
                    _.set(undefined, 'foo', 'bar');
                }).to.not.throw();
            });
            it('should set deep property', function () {
                _.set(obj, 'bar.haa', 'COO');
                expect(obj.bar.haa).to.equal('COO');
            });
            it('should create if not exist', function () {
                _.set(obj, 'doo', 'DOO');
                expect(obj.doo).to.equal('DOO');
            });
            it('should create if deep property not exist', function () {
                _.set(obj, 'coo.eww.2', 3);
                expect(obj.coo.eww[2]).to.equal(3);
            });
        });
        describe('.isArrayLike()', function () {
            it('should return false for undefined', function () {
                expect(_.isArrayLike(undefined)).to.be.false;
            });
            it('should return false for null', function () {
                expect(_.isArrayLike(null)).to.be.false;
            });
            it('should return false for functions', function () {
                expect(_.isArrayLike(function () {})).to.be.false;
            });
            it('should return true for array', function () {
                expect(_.isArrayLike([])).to.be.true;
            });
            it('should return true for array-like object', function () {
                expect(_.isArrayLike({
                    length: 2
                })).to.be.true;
            });
        });
        describe('.isLength()', function () {
            it('should return false for -1', function () {
                expect(_.isLength(-1)).to.be.false;
            });
            it('should return true for 0', function () {
                expect(_.isLength(0)).to.be.true;
            });
            it('should return false for overflowed integer (which is treated as float)', function () {
                expect(_.isLength(99999999999999999999999999999999999999999999)).to.be.false;
            });
            it('should return false for float number', function () {
                expect(_.isLength(1.1)).to.be.false;
            });
        });
        describe('.contains()', function () {
            it('should return false when not exist in string', function () {
                expect(_.contains('abc', 'd')).to.be.false;
            });
            it('should return false when passed in string', function () {
                expect(_.contains('abc', 'a', 1)).to.be.false;
            });
            it('should return true when found in string', function () {
                expect(_.contains('abc', 'a')).to.be.true;
                expect(_.contains('abc', 'c')).to.be.true;
                expect(_.contains('abc', 'c', 1)).to.be.true;
            });
            it('should return false when not exist in array', function () {
                expect(_.contains([1, 2, 3], 4)).to.be.false;
            });
            it('should return false when passed in array', function () {
                expect(_.contains([1, 2, 3], 1, 1)).to.be.false;
            });
            it('should return true when found in array', function () {
                expect(_.contains([1, 2, 3], 1)).to.be.true;
                expect(_.contains([1, 2, 3], 3)).to.be.true;
                expect(_.contains([1, 2, 3], 3, 1)).to.be.true;
            });
        });
        describe('.assign', function () {
            it('should handle null dst', function () {
                expect(_.assign(null, {
                    foo: 'bar'
                })).to.deep.equal({
                    foo: 'bar'
                });
            });
            it('should assign 2 objects', function () {
                var src = {
                    foo: 'foo',
                    bar: 'bar'
                };
                var dst = {
                    foo: 'bar',
                    kaa: 'kaa'
                };
                expect(_.assign(dst, src)).to.deep.equal({
                    foo: 'foo',
                    bar: 'bar',
                    kaa: 'kaa'
                });
            });
            it('should assign 3 objects', function () {
                expect(_.assign({
                    foo: 'foo'
                }, {
                    bar: 'bar'
                }, {
                    car: 'car'
                })).to.deep.equal({
                    foo: 'foo',
                    bar: 'bar',
                    car: 'car'
                });
            });
            it('should only assign to the dst object', function () {
                var dst = {
                    foo: 'bar'
                };
                var src1 = {
                    bar: 'coo'
                };
                var src2 = {
                    coo: 'foo'
                };
                _.assign(dst, src1, src2);
                expect(src1).to.deep.equal({
                    bar: 'coo'
                });
            });
        });
        describe('.defaults()', function () {
            it('should handle null dst', function () {
                expect(_.defaults(null, {
                    foo: 'bar'
                })).to.deep.equal({
                    foo: 'bar'
                });
            });
            it('should merge 2 objects', function () {
                var src = {
                    foo: 'foo',
                    bar: 'bar'
                };
                var dst = {
                    foo: 'bar',
                    kaa: 'kaa'
                };
                expect(_.defaults(dst, src)).to.deep.equal({
                    kaa: 'kaa',
                    foo: 'bar',
                    bar: 'bar'
                });
            });
            it('should merge 3 objects', function () {
                expect(_.defaults({
                    foo: 'foo'
                }, {
                    bar: 'bar'
                }, {
                    car: 'car'
                })).to.deep.equal({
                    foo: 'foo',
                    bar: 'bar',
                    car: 'car'
                });
            });
        });
        describe('.defaultsDeep()', function () {
            it('should handle null dst', function () {
                expect(_.defaultsDeep(null, {
                    foo: 'bar'
                })).to.deep.equal({
                    foo: 'bar'
                });
            });
            it('should replace null value', function () {
                expect(_.defaultsDeep({
                    foo: {
                        foo: 'foo'
                    }
                }, {
                    foo: null
                })).to.deep.equal({
                    foo: {
                        foo: 'foo'
                    }
                });
            });
            it('should merge 2 objects', function () {
                expect(_.defaultsDeep({
                    foo: {
                        foo: 'foo'
                    }
                }, {
                    foo: {
                        bar: 'bar'
                    }
                })).to.deep.equal({
                    foo: {
                        foo: 'foo',
                        bar: 'bar'
                    }
                });
            });
        });
        describe('.findIndex()', function () {
            it('should find item with respect to the provided predicate', function () {
                expect(_.findIndex(['a', 'b', 'c'], function (item) {
                    return item === 'b';
                })).to.equal(1);
            });
            it('should find the first occurrance', function () {
                expect(_.findIndex(['a', 'b', 'b', 'c'], function (item) {
                    return item === 'b';
                })).to.equal(1);
            });
            it('should return -1 when not found', function () {
                expect(_.findIndex(['a', 'b', 'b', 'c'], function (item) {
                    return item === 'd';
                })).to.equal(-1);
            });
        });
        describe('.isEmpty()', function () {
            it('should return true for empty array', function () {
                expect(_.isEmpty([])).to.equal(true);
            });
            it('should return true for empty string', function () {
                expect(_.isEmpty('')).to.equal(true);
            });
        });
        describe('.split()', function () {
            it('should support string separator', function () {
                expect(_.split('abcb', 'b')).to.deep.equal(['a', 'c', '']);
            });
            it('should support RegExp separator', function () {
                expect(_.split('abcb', /b/)).to.deep.equal(['a', 'c', '']);
            });
        });
        describe('.partial()', function () {
            it('should support zero partials', function () {
                var g = _.partial(func);
                expect(g('a', 'b', 'c')).to.equal('a1b2c');
            });
            it('should support one partials', function () {
                var g = _.partial(func, 'a');
                expect(g('b', 'c')).to.equal('a1b2c');
            });
            it('should support two partials', function () {
                var g = _.partial(func, 'a', 'b');
                expect(g('c')).to.equal('a1b2c');
            });
        });
        describe('.partialRight()', function () {
            it('should support zero partials', function () {
                var g = _.partialRight(func);
                expect(g('a', 'b', 'c')).to.equal('a1b2c');
            });
            it('should support one partials', function () {
                var g = _.partialRight(func, 'c');
                expect(g('a', 'b')).to.equal('a1b2c');
            });
            it('should support two partials', function () {
                var g = _.partialRight(func, 'b', 'c');
                expect(g('a')).to.equal('a1b2c');
            });
        });
        describe('.format()', function () {
            it('should support multiple args', function () {
                expect(_.format('foo%sbar%s', 'a', 'b')).to.equal('fooabarb');
            });
            it('should support plain string', function () {
                expect(_.format('foo%sbar%s')).to.equal('foo%sbar%s');
            });
        });
        describe('.wrap', function () {
            it('should return a function', function () {
                expect(_.wrap(undefined, func)).to.be.a('function');
            });
            it('should pass arguments', function () {
                var wrapper = sinon.spy();
                _.wrap(obj, wrapper)(1, 2, 3);
                expect(wrapper).to.be.calledWith(obj, 1, 2, 3);
            });
            it('should pass context', function () {
                var wrapper = sinon.spy();
                var context = {};
                _.wrap(obj, wrapper).call(context);
                expect(wrapper).to.be.calledOn(context);
            });
            it('should pass return value', function () {
                var three = _.wrap(1, func)(0, 2);
                expect(three).to.equal('11022');
            });
            it('should throws unless passing a function as wrapper', function () {
                expect(_.wrap.bind(this, undefined, obj)).to.throw(/wrapper should be a function/);
            });
        });

        describe('.extend()', function () {
            var extend = _.extend;

            it('.extend(target, source)', function () {
                var a = {x: 1, y: 2};
                var b = {y: 3, z: 4};
                var c = extend(a, b);

                expect(a).to.equal(c);
                expect(a).to.deep.equal({x: 1, y: 3, z: 4});
            });

            it('.extend(target, ...source)', function () {
                var obj1 = {a: 1, b: 2};
                var obj2 = {b: 3, c: 4};
                var obj3 = {c: 4, d: 5};
                var obj = extend(obj1, obj2, obj3);

                expect(obj1).to.equal(obj);
                expect(obj1).to.deep.equal({a: 1, b: 3, c: 4, d: 5});
            });

            it('.extend: with prototype', function () {
                var a = {x: 1, y: 2};

                /**
                 * temporary class
                 *
                 * @class
                 */
                var B = function () {};
                B.prototype.hi = function () {};
                var b = new B();
                b.y = 3;
                b.z = 4;

                extend(a, b);
                expect(a).to.deep.equal({x: 1, y: 3, z: 4});
            });

            it('.extend: source is null', function () {
                var a = {x: 1, y: 2};

                extend(a, null);
                expect(a).to.deep.equal({x: 1, y: 2});
            });

        });
        describe('.inherits()', function () {
            var inherits = _.inherits;

            it('.inherits(subClass, superClass)', function () {

                // eslint-disable-next-line
                function Func1(name) {
                    this.name = name;
                }
                Func1.prototype.say = function () {
                    return 'hi, ' + this.name;
                };

                // eslint-disable-next-line
                function Func2(name) {
                    this.name = name + '!';
                }
                inherits(Func2, Func1);

                var instance1 = new Func1('saber');
                var instance2 = new Func2('baidu');

                expect(instance1.say()).to.equal('hi, saber');
                expect(instance2.say()).to.equal('hi, baidu!');

                expect(instance1.constructor).to.equal(Func1);
                expect(instance2.constructor).to.equal(Func2);

                expect(instance1 instanceof Func1).to.be.ok;
                expect(instance2 instanceof Func2).to.be.ok;
                expect(instance2 instanceof Func1).to.be.ok;
            });

        });
    });
});
