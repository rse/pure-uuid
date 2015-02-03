/*
**  Pure-UUID -- Pure JavaScript Based Universally Unique Identifiers (UUID)
**  Copyright (c) 2004-2015 Ralf S. Engelschall <rse@engelschall.com>
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit persons to whom the Software is furnished to do so, subject to
**  the following conditions:
**
**  The above copyright notice and this permission notice shall be included
**  in all copies or substantial portions of the Software.
**
**  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
**  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
**  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
**  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
**  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
**  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
**  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/* global require: true */
/* global global: true */
/* global describe: true */
/* global it: true */
/* global expect: true */

global.chai = require("chai");
global.expect = global.chai.expect;
global.chai.config.includeStack = true;

var UUID = require("./uuid.js");

describe("UUID base functionality", function () {
    it("should provide basic object functionality", function () {
        var uuid = new UUID();
        expect(uuid).to.be.a("object");
        expect(uuid).to.respondTo("make");
        expect(uuid).to.respondTo("parse");
        expect(uuid).to.respondTo("format");
    });
    it("should parse and format standard UUIDs", function () {
        expect(new UUID().format()).to.be.equal("00000000-0000-0000-0000-000000000000");
        expect(new UUID().parse("nil").format()).to.be.equal("00000000-0000-0000-0000-000000000000");
        expect(new UUID().parse("ns:DNS").format()).to.be.equal("6ba7b810-9dad-11d1-80b4-00c04fd430c8");
        expect(new UUID().parse("ns:OID").format()).to.be.equal("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
        expect(new UUID().parse("ns:X500").format()).to.be.equal("6ba7b814-9dad-11d1-80b4-00c04fd430c8");
        expect(new UUID("7da78284-2f14-5e7f-95e1-baaa9027c26f").format()).to.be.equal("7da78284-2f14-5e7f-95e1-baaa9027c26f");
        expect(new UUID().parse("7da78284-2f14-5e7f-95e1-baaa9027c26f").format()).to.be.equal("7da78284-2f14-5e7f-95e1-baaa9027c26f");
    });
    it("should be able to make various UUID versions", function () {
        expect(new UUID(1).format()).to.be.not.empty();
        expect(new UUID(3, "ns:URL", "foo").format()).to.be.equal("a5bf60bd-fe2d-3fac-bbd7-404751e6ca66");
        expect(new UUID(4).format()).to.be.not.empty();
        expect(new UUID(5, "ns:URL", "foo").format()).to.be.equal("7da78284-2f14-5e7f-95e1-baaa9027c26f");
    });
});

