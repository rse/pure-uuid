/*!
**  Pure-UUID -- Pure JavaScript Based Universally Unique Identifier (UUID)
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

/*  Universal Module Definition (UMD)  */
(function (root, factory) {
    /* global define: false */
    /* global module: false */
    if (typeof define === "function" && typeof define.amd !== "undefined")
        /*  AMD environment  */
        define(function () { return factory(root); });
    else if (typeof module === "object" && typeof module.exports === "object")
        /*  CommonJS environment  */
        module.exports = factory(root);
    else
        /*  Browser environment  */
        root.UUID = factory(root);
}(this, function (/* root */) {

    /*  utility function: minimal Pseudo Random Number Generator (PRNG)  */
    var prng = function (len, radix) {
        var bytes = [];
        for (var i = 0; i < len; i++)
            bytes[i] = Math.floor(Math.random() * radix + 1);
        return bytes;
    };

    /*  array to hex-string conversion  */
    var a2hs = function (bytes, begin, end, uppercase, str, pos) {
        var mkNum = function (num, uppercase) {
            var base16 = num.toString(16);
            if (base16.length < 2)
                base16 = "0" + base16;
            if (uppercase)
                base16 = base16.toUpperCase();
            return base16;
        };
        for (var i = begin; i <= end; i++)
            str[pos++] = mkNum(bytes[i], uppercase);
        return str;
    };

    /*  hex-string to array conversion  */
    var hs2a = function (str, begin, end, bytes, pos) {
        for (var i = begin; i <= end; i += 2)
            bytes[pos++] = parseInt(str.substr(i, 2), 16);
    };

    /*  This library provides conversions between 8/16/32-bit character
        strings and 8/16/32-bit big/little-endian word arrays.  */

    /*  string to array conversion  */
    var s2a = function (s, _options) {
        /*  determine options  */
        var options = { ibits: 8, obits: 8, obigendian: true };
        for (var opt in _options)
            if (typeof options[opt] !== "undefined")
                options[opt] = _options[opt];

        /*  convert string to array  */
        var a = [];
        var i = 0;
        var c, C;
        var ck = 0;
        var w;
        var wk = 0;
        var sl = s.length;
        for (;;) {
            /*  fetch next octet from string  */
            if (ck === 0)
                C = s.charCodeAt(i++);
            c = (C >> (options.ibits - (ck + 8))) & 0xFF;
            ck = (ck + 8) % options.ibits;

            /*  place next word into array  */
            if (options.obigendian) {
                if (wk === 0) w  = (c <<  (options.obits - 8));
                else          w |= (c << ((options.obits - 8) - wk));
            }
            else {
                if (wk === 0) w  = c;
                else          w |= (c << wk);
            }
            wk = (wk + 8) % options.obits;
            if (wk === 0) {
                a.push(w);
                if (i >= sl)
                    break;
            }
        }
        return a;
    };

    /*  array to string conversion  */
    var a2s = function (a, _options) {
        /*  determine options  */
        var options = { ibits: 32, ibigendian: true };
        for (var opt in _options)
            if (typeof options[opt] !== "undefined")
                options[opt] = _options[opt];

        /* convert array to string */
        var s = "";
        var imask = 0xFFFFFFFF;
        if (options.ibits < 32)
            imask = (1 << options.ibits) - 1;
        var al = a.length;
        for (var i = 0; i < al; i++) {
            /* fetch next word from array */
            var w = a[i] & imask;

            /* place next octet into string */
            for (var j = 0; j < options.ibits; j += 8) {
                if (options.ibigendian)
                    s += String.fromCharCode((w >> ((options.ibits - 8) - j)) & 0xFF);
                else
                    s += String.fromCharCode((w >> j) & 0xFF);
            }
        }
        return s;
    };

    /*  this is just a really minimal UI64 functionality,
        just sufficient enough for the UUID v1 generator!  */

    /*  UI64 constants  */
    var UI64_DIGITS     = 8;    /* number of digits */
    var UI64_DIGIT_BITS = 8;    /* number of bits in a digit */
    var UI64_DIGIT_BASE = 256;  /* the numerical base of a digit */

    /*  convert between individual digits and the UI64 representation  */
    var ui64_d2i = function (d7, d6, d5, d4, d3, d2, d1, d0) {
        return [ d0, d1, d2, d3, d4, d5, d6, d7 ];
    };

    /*  the zero represented as an UI64  */
    var ui64_zero = function () {
        return ui64_d2i(0, 0, 0, 0, 0, 0, 0, 0);
    };

    /*  convert between number and UI64 representation  */
    var ui64_n2i = function (n) {
        var ui64 = ui64_zero();
        for (var i = 0; i < UI64_DIGITS; i++) {
            ui64[i] = Math.floor(n % UI64_DIGIT_BASE);
            n /= UI64_DIGIT_BASE;
        }
        return ui64;
    };

    /*  convert between UI64 representation and number  */
    var ui64_i2n = function (x) {
        var n = 0;
        for (var i = UI64_DIGITS - 1; i >= 0; i--) {
            n *= UI64_DIGIT_BASE;
            n += x[i];
        }
        return Math.floor(n);
    };

    /*  add UI64 (y) to UI64 (x) and return overflow/carry as number  */
    var ui64_add = function (x, y) {
        var carry = 0;
        for (var i = 0; i < UI64_DIGITS; i++) {
            carry += x[i] + y[i];
            x[i]   = Math.floor(carry % UI64_DIGIT_BASE);
            carry  = Math.floor(carry / UI64_DIGIT_BASE);
        }
        return carry;
    };

    /*  multiply number (n) to UI64 (x) and return overflow/carry as number  */
    var ui64_muln = function (x, n) {
        var carry = 0;
        for (var i = 0; i < UI64_DIGITS; i++) {
            carry += x[i] * n;
            x[i]   = Math.floor(carry % UI64_DIGIT_BASE);
            carry  = Math.floor(carry / UI64_DIGIT_BASE);
        }
        return carry;
    };

    /*  rotate right UI64 (x) by a "s" bits and return overflow/carry as number  */
    var ui64_ror = function (x, s) {
        var ov = ui64_zero();
        if ((s % UI64_DIGIT_BITS) !== 0)
            throw new Error("ui64_ror: only bit rotations supported with a multiple of digit bits");
        var k = Math.floor(s / UI64_DIGIT_BITS);
        for (var i = 0; i < k; i++) {
            for (var j = UI64_DIGITS - 1 - 1; j >= 0; j--)
                ov[j + 1] = ov[j];
            ov[0] = x[0];
            for (j = 0; j < UI64_DIGITS - 1; j++)
                x[j] = x[j + 1];
            x[j] = 0;
        }
        return ui64_i2n(ov);
    };

    /*  this is just a really minimal UI32 functionality,
        just sufficient enough for the MD5 and SHA1 digests!  */

    /*  safely add two integers (with wrapping at 2^32)  */
    var ui32_add = function (x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    };

    /*  bitwise rotate 32-bit number to the left  */
    var ui32_rol = function (num, cnt) {
        return (
              ((num <<        cnt ) & 0xFFFFFFFF)
            | ((num >>> (32 - cnt)) & 0xFFFFFFFF)
        );
    };

    /* calculate the SHA-1 of an array of big-endian words, and a bit length */
    var sha1_core = function (x, len) {
        /*  perform the appropriate triplet combination function for the current iteration  */
        function sha1_ft (t, b, c, d) {
            if (t < 20) return (b & c) | ((~b) & d);
            if (t < 40) return b ^ c ^ d;
            if (t < 60) return (b & c) | (b & d) | (c & d);
            return b ^ c ^ d;
        }

        /*  determine the appropriate additive constant for the current iteration  */
        function sha1_kt (t) {
            return (t < 20) ?  1518500249 :
                   (t < 40) ?  1859775393 :
                   (t < 60) ? -1894007588 :
                               -899497514;
        }

        /*  append padding  */
        x[len >> 5] |= 0x80 << (24 - len % 32);
        x[((len + 64 >> 9) << 4) + 15] = len;

        var w = Array(80);
        var a =  1732584193;
        var b =  -271733879;
        var c = -1732584194;
        var d =   271733878;
        var e = -1009589776;

        for (var i = 0; i < x.length; i += 16) {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;
            var olde = e;
            for (var j = 0; j < 80; j++) {
                if (j < 16)
                    w[j] = x[i + j];
                else
                    w[j] = ui32_rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
                var t = ui32_add(
                    ui32_add(ui32_rol(a, 5), sha1_ft(j, b, c, d)),
                    ui32_add(ui32_add(e, w[j]), sha1_kt(j))
                );
                e = d;
                d = c;
                c = ui32_rol(b, 30);
                b = a;
                a = t;
            }
            a = ui32_add(a, olda);
            b = ui32_add(b, oldb);
            c = ui32_add(c, oldc);
            d = ui32_add(d, oldd);
            e = ui32_add(e, olde);
        }
        return [ a, b, c, d, e ];
    };

    /*  calculate the SHA-1 of an octet string  */
    var sha1 = function (s) {
        return a2s(
            sha1_core(
                s2a(s, { ibits: 8, obits: 32, obigendian: true }),
                s.length * 8),
            { ibits: 32, ibigendian: true });
    };

    /*  calculate the MD5 of an array of little-endian words, and a bit length  */
    var md5_core = function (x, len) {
        /*  basic operations the algorithm uses  */
        function md5_cmn (q, a, b, x, s, t) {
            return ui32_add(ui32_rol(ui32_add(ui32_add(a, q), ui32_add(x, t)), s), b);
        }
        function md5_ff (a, b, c, d, x, s, t) {
            return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
        }
        function md5_gg (a, b, c, d, x, s, t) {
            return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
        }
        function md5_hh (a, b, c, d, x, s, t) {
            return md5_cmn(b ^ c ^ d, a, b, x, s, t);
        }
        function md5_ii (a, b, c, d, x, s, t) {
            return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
        }

        /*  append padding  */
        x[len >> 5] |= 0x80 << ((len) % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;

        var a =  1732584193;
        var b =  -271733879;
        var c = -1732584194;
        var d =   271733878;

        for (var i = 0; i < x.length; i += 16) {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;

            a = md5_ff(a, b, c, d, x[i+ 0],  7,  -680876936);
            d = md5_ff(d, a, b, c, x[i+ 1], 12,  -389564586);
            c = md5_ff(c, d, a, b, x[i+ 2], 17,   606105819);
            b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
            a = md5_ff(a, b, c, d, x[i+ 4],  7,  -176418897);
            d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
            c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
            b = md5_ff(b, c, d, a, x[i+ 7], 22,   -45705983);
            a = md5_ff(a, b, c, d, x[i+ 8],  7,  1770035416);
            d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
            c = md5_ff(c, d, a, b, x[i+10], 17,      -42063);
            b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
            a = md5_ff(a, b, c, d, x[i+12],  7,  1804603682);
            d = md5_ff(d, a, b, c, x[i+13], 12,   -40341101);
            c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
            b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

            a = md5_gg(a, b, c, d, x[i+ 1],  5,  -165796510);
            d = md5_gg(d, a, b, c, x[i+ 6],  9, -1069501632);
            c = md5_gg(c, d, a, b, x[i+11], 14,   643717713);
            b = md5_gg(b, c, d, a, x[i+ 0], 20,  -373897302);
            a = md5_gg(a, b, c, d, x[i+ 5],  5,  -701558691);
            d = md5_gg(d, a, b, c, x[i+10],  9,    38016083);
            c = md5_gg(c, d, a, b, x[i+15], 14,  -660478335);
            b = md5_gg(b, c, d, a, x[i+ 4], 20,  -405537848);
            a = md5_gg(a, b, c, d, x[i+ 9],  5,   568446438);
            d = md5_gg(d, a, b, c, x[i+14],  9, -1019803690);
            c = md5_gg(c, d, a, b, x[i+ 3], 14,  -187363961);
            b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
            a = md5_gg(a, b, c, d, x[i+13],  5, -1444681467);
            d = md5_gg(d, a, b, c, x[i+ 2],  9,   -51403784);
            c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
            b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

            a = md5_hh(a, b, c, d, x[i+ 5],  4,     -378558);
            d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
            c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
            b = md5_hh(b, c, d, a, x[i+14], 23,   -35309556);
            a = md5_hh(a, b, c, d, x[i+ 1],  4, -1530992060);
            d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
            c = md5_hh(c, d, a, b, x[i+ 7], 16,  -155497632);
            b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
            a = md5_hh(a, b, c, d, x[i+13],  4,   681279174);
            d = md5_hh(d, a, b, c, x[i+ 0], 11,  -358537222);
            c = md5_hh(c, d, a, b, x[i+ 3], 16,  -722521979);
            b = md5_hh(b, c, d, a, x[i+ 6], 23,    76029189);
            a = md5_hh(a, b, c, d, x[i+ 9],  4,  -640364487);
            d = md5_hh(d, a, b, c, x[i+12], 11,  -421815835);
            c = md5_hh(c, d, a, b, x[i+15], 16,   530742520);
            b = md5_hh(b, c, d, a, x[i+ 2], 23,  -995338651);

            a = md5_ii(a, b, c, d, x[i+ 0],  6,  -198630844);
            d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
            c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
            b = md5_ii(b, c, d, a, x[i+ 5], 21,   -57434055);
            a = md5_ii(a, b, c, d, x[i+12],  6,  1700485571);
            d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
            c = md5_ii(c, d, a, b, x[i+10], 15,    -1051523);
            b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
            a = md5_ii(a, b, c, d, x[i+ 8],  6,  1873313359);
            d = md5_ii(d, a, b, c, x[i+15], 10,   -30611744);
            c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
            b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
            a = md5_ii(a, b, c, d, x[i+ 4],  6,  -145523070);
            d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
            c = md5_ii(c, d, a, b, x[i+ 2], 15,   718787259);
            b = md5_ii(b, c, d, a, x[i+ 9], 21,  -343485551);

            a = ui32_add(a, olda);
            b = ui32_add(b, oldb);
            c = ui32_add(c, oldc);
            d = ui32_add(d, oldd);
        }
        return [ a, b, c, d ];
    };

    /* calculate the MD5 of an octet string */
    var md5 = function (s) {
        return a2s(
            md5_core(
                s2a(s, { ibits: 8, obits: 32, obigendian: false }),
                s.length * 8),
            { ibits: 32, ibigendian: false });
    };

    /*  internal state  */
    var time_last = 0;
    var time_seq  = 0;

    /*  the API constructor  */
    var UUID = function () {
        if (arguments.length === 1 && typeof arguments[0] === "string")
            this.parse.apply(this, arguments);
        else if (arguments.length >= 1 && typeof arguments[0] === "number")
            this.make.apply(this, arguments);
        else if (arguments.length >= 1)
            throw new Error("UUID: constructor: invalid arguments");
        else
            for (var i = 0; i < 16; i++)
                this[i] = 0x00;
    };

    /*  inherit from a standard class which provides the
        best UUID representation in the particular environment  */
    /* global Uint8Array: false */
    /* global Buffer: false */
    if (typeof Uint8Array !== "undefined")
        /*  HTML5 TypedArray (browser environments: IE10, FF, CH, SF, OP)
            (http://caniuse.com/#feat=typedarrays)  */
        UUID.prototype = new Uint8Array(16);
    else if (Buffer)
        /*  Node Buffer (server environments: Node.js, IO.js)  */
        UUID.prototype = new Buffer(16);
    else
        /*  JavaScript (any environment)  */
        UUID.prototype = new Array(16);
    UUID.prototype.constructor = UUID;

    /*  API method: generate a particular UUID  */
    UUID.prototype.make = function (version) {
        var i;
        var uuid = this;
        if (version === 1) {
            /*  generate UUID version 1 (time and node based)  */

            /*  determine current time and time sequence counter  */
            var date = new Date();
            var time_now = date.getTime();
            if (time_now !== time_last)
                time_seq = 0;
            else
                time_seq++;
            time_last = time_now;

            /*  convert time to 100*nsec  */
            var t = ui64_n2i(time_now);
            ui64_muln(t, 1000 * 10);

            /*  adjust for offset between UUID and Unix Epoch time  */
            ui64_add(t, ui64_d2i(0x01, 0xB2, 0x1D, 0xD2, 0x13, 0x81, 0x40, 0x00));

            /*  compensate for low resolution system clock by adding
                the time/tick sequence counter  */
            if (time_seq > 0)
                ui64_add(t, ui64_n2i(time_seq));

            /*  store the 60 LSB of the time in the UUID  */
            var ov;
            ov = ui64_ror(t, 8); uuid[3] = (ov & 0xFF);
            ov = ui64_ror(t, 8); uuid[2] = (ov & 0xFF);
            ov = ui64_ror(t, 8); uuid[1] = (ov & 0xFF);
            ov = ui64_ror(t, 8); uuid[0] = (ov & 0xFF);
            ov = ui64_ror(t, 8); uuid[5] = (ov & 0xFF);
            ov = ui64_ror(t, 8); uuid[4] = (ov & 0xFF);
            ov = ui64_ror(t, 8); uuid[7] = (ov & 0xFF);
            ov = ui64_ror(t, 8); uuid[6] = (ov & 0x0F);

            /*  generate a random clock sequence  */
            var clock = prng(2, 255);
            uuid[8] = clock[0];
            uuid[9] = clock[1];

            /*  generate a random local multicast node address  */
            var node = prng(6, 255);
            node[0] |= 0x01;
            node[0] |= 0x02;
            for (i = 0; i < 6; i++)
                uuid[10 + i] = node[i];
        }
        else if (version === 4) {
            /*  generate UUID version 4 (random data based)  */
            var data = prng(16, 255);
            for (i = 0; i < 16; i++)
                 this[i] = data[i];
        }
        else if (version === 3 || version === 5) {
            /*  generate UUID version 3/5 (MD5/SHA-1 based)  */
            var input = "";
            var nsUUID = (
                typeof arguments[1] === "object" && arguments[1] instanceof UUID ?
                arguments[1] : new UUID().parse(arguments[1])
            );
            for (i = 0; i < 16; i++)
                 input += String.fromCharCode(nsUUID[i]);
            input += arguments[2];
            var s = version === 3 ? md5(input) : sha1(input);
            for (i = 0; i < 16; i++)
                 uuid[i] = s.charCodeAt(i);
        }
        else
            throw new Error("UUID: make: invalid version");

        /*  brand with particular UUID version  */
        uuid[6] &= 0x0F;
        uuid[6] |= (version << 4);

        /*  brand as UUID variant 2 (DCE 1.1)  */
        uuid[8] &= 0x3F;
        uuid[8] |= (0x02 << 6);

        return uuid;
    };

    /*  API method: format UUID into usual textual representation  */
    UUID.prototype.format = function () {
        var str = Array(32);
        a2hs(this,  0,  3, false, str,  0);
        str[ 8] = "-";
        a2hs(this,  4,  5, false, str,  9);
        str[13] = "-";
        a2hs(this,  6,  7, false, str, 14);
        str[18] = "-";
        a2hs(this,  8,  9, false, str, 19);
        str[23] = "-";
        a2hs(this, 10, 15, false, str, 24);
        return str.join("");
    };

    /*  API method: parse UUID from usual textual representation  */
    UUID.prototype.parse = function (str) {
        var map = {
            "nil":     "00000000-0000-0000-0000-000000000000",
            "ns:DNS":  "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
            "ns:URL":  "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
            "ns:OID":  "6ba7b812-9dad-11d1-80b4-00c04fd430c8",
            "ns:X500": "6ba7b814-9dad-11d1-80b4-00c04fd430c8"
        };
        if (map[str] !== undefined)
            str = map[str];
        hs2a(str,  0,  7, this,  0);
        hs2a(str,  9, 12, this,  4);
        hs2a(str, 14, 17, this,  6);
        hs2a(str, 19, 22, this,  8);
        hs2a(str, 24, 35, this, 10);
        return this;
    };

    /*  API method: export UUID into standard array of numbers  */
    UUID.prototype.export = function () {
        var arr = Array(16);
        for (var i = 0; i < 16; i++)
            arr[i] = this[i];
        return arr;
    };

    /*  API method: import UUID from standard array of numbers  */
    UUID.prototype.import = function (arr) {
        if (!(typeof arr === "object" && arr instanceof Array))
            throw new Error("UUID: import: invalid argument (type Array expected)");
        if (arr.length !== 16)
            throw new Error("UUID: import: invalid argument (Array of length 16 expected)");
        for (var i = 0; i < 16; i++) {
            if (typeof arr[i] !== "number")
                throw new Error("UUID: import: invalid array element #" + i +
                    " (type Number expected)");
            if (!(isFinite(arr[i]) && Math.floor(arr[i]) === arr[i]))
                throw new Error("UUID: import: invalid array element #" + i +
                    " (Number with integer value expected)");
            if (!(arr[i] >= 0 && arr[i] <= 255))
                throw new Error("UUID: import: invalid array element #" + i +
                    " (Number with integer value in range 0...255 expected)");
            this[i] = arr[i];
        }
        return this;
    };

    /*  export API  */
    return UUID;
}));

