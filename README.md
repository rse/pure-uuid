
Pure-UUID
=========

**Pure JavaScript Based Universally Unique Identifier (UUID)**

<p/>
<img src="https://nodei.co/npm/pure-uuid.png?downloads=true&stars=true" alt=""/>

<p/>
<img src="https://david-dm.org/rse/pure-uuid.png" alt=""/>

Abstract
--------

This is a pure JavaScript and dependency-free library for the generation
of DCE 1.1, ISO/IEC 11578:1996 and IETF RFC-4122 compliant Universally
Unique Identifier (UUID). It supports DCE 1.1 variant UUIDs of version
1 (time and node based), version 3 (name based, MD5), version 4 (random
number based) and version 5 (name based, SHA-1). It can be used in both
[Node.js](http://nodejs.org/) based server and browser based client
environments.

The essential points of this implementation (in contrast to the many
others) are: First, although internally 32/64 bit unsigned integer
arithmentic and MD5/SHA-1 digest algorithmic is required, this UUID
implementation is fully self-contained and dependency-free. Second,
this implementation wraps around either `Uint8Array`, `Buffer` or
`Array` standard classes and this way tries to represent UUIDs as best
as possible in the particular environment. Third, thanks to a Universal
Module Definition (UMD) wrapper, this library works out-of-the-box in
all important JavaScript run-time environments.

What is a UUID?
---------------

UUIDs are 128 bit numbers which are intended to have a high likelihood
of uniqueness over space and time and are computationally difficult to
guess. They are globally unique identifiers which can be locally
generated without contacting a global registration authority. UUIDs are
intended as unique identifiers for both mass tagging objects with an
extremely short lifetime and to reliably identifying very persistent
objects across a network.

### UUID Binary Representation

According to the DCE 1.1, ISO/IEC 11578:1996 and IETF RFC-4122
standards, a DCE 1.1 variant UUID is a 128 bit number defined out of 7
fields, each field a multiple of an octet in size and stored in network
byte order:

```txt
                                                    [4]
                                                   version
                                                 -->|  |<--
                                                    |  |
                                                    |  |  [16]
                [32]                      [16]      |  |time_hi
              time_low                  time_mid    | _and_version
    |<---------------------------->||<------------>||<------------>|
    | MSB                          ||              ||  |           |
    | /                            ||              ||  |           |
    |/                             ||              ||  |           |

    +------++------++------++------++------++------++------++------+~~
    |  15  ||  14  ||  13  ||  12  ||  11  ||  10  |####9  ||   8  |
    | MSO  ||      ||      ||      ||      ||      |####   ||      |
    +------++------++------++------++------++------++------++------+~~
    7654321076543210765432107654321076543210765432107654321076543210

  ~~+------++------++------++------++------++------++------++------+
    ##* 7  ||   6  ||   5  ||   4  ||   3  ||   2  ||   1  ||   0  |
    ##*    ||      ||      ||      ||      ||      ||      ||  LSO |
  ~~+------++------++------++------++------++------++------++------+
    7654321076543210765432107654321076543210765432107654321076543210

    | |    ||      ||                                             /|
    | |    ||      ||                                            / |
    | |    ||      ||                                          LSB |
    |<---->||<---->||<-------------------------------------------->|
    |clk_seq clk_seq                      node
    |_hi_res _low                         [48]
    |[5-6]    [8]
    | |
 -->| |<--
  variant
   [2-3]
```

An example of a UUID binary representation is the octet stream 0xF8
0x1D 0x4F 0xAE 0x7D 0xEC 0x11 0xD0 0xA7 0x65 0x00 0xA0 0xC9 0x1E 0x6B
0xF6.

### UUID ASCII String Representation

According to the DCE 1.1, ISO/IEC 11578:1996 and IETF RFC-4122
standards, a DCE 1.1 variant UUID is represented as an ASCII string
consisting of 8 hexadecimal digits followed by a hyphen, then three
groups of 4 hexadecimal digits each followed by a hyphen, then 12
hexadecimal digits.

Getting Pure-UUID
-----------------

You can conveniently get Pure-UUID in various ways:

- Git: directly clone the official repository:<br/>
  `$ git clone https://github.com/rse/pure-uuid.git`

- Bower: install as client component via the Bower component manager:<br/>
  `$ bower install pure-uuid`

- NPM: install as server component via the NPM package manager:<br/>
  `$ npm install pure-uuid`

- cURL: downloading only the main file from the repository:<br/>
  `$ curl -O https://raw.githubusercontent.com/rse/pure-uuid/master/uuid.js`

Using Pure-UUID
---------------

- global environment:

```js
var uuid = new UUID(3, "ns:URL", "http://example.com/");
```

- CommonJS environment:

```js
var UUID = require("pure-uuid");
var uuid = new UUID(3, "ns:URL", "http://example.com/");
```

- AMD environment:

```js
define(["pure-uuid"], function (UUID) {
    var uuid = new UUID(3, "ns:URL", "http://example.com/");
});
```

API
---

```ts
interface UUID {
    /*  default construction  */
    (): UUID;

    /*  parsing construction  */
    (uuid: String): UUID;

    /*  making construction  */
    (version: Number): UUID;
    (version: Number, ns: String, data: String): UUID;

    /*  making  */
    make(version: Number, ...params: any[]): UUID;

    /*  parsing  */
    parse(str: String, type?: String): UUID;

    /*  formatting  */
    format(type?: String): String;

    /*  importing  */
    import(arr: Number[]): UUID;

    /*  exporting  */
    export(): Number[];

    /*  byte-wise comparison  */
    compare(other: UUID): boolean;

    /*  folding k-times  */
    fold(k: number): Array[];
}
```

Examples
--------

```js
//  load a UUID
uuid = new UUID("0a300ee9-f9e4-5697-a51a-efc7fafaba67");

//  make a UUID version 1 (time and node based)
uuid = new UUID(1);

//  make a UUID version 3 (name-based, MD5)
uuid = new UUID(3, "ns:URL", "http://example.com/");

//  make a UUID version 4 (random number based)
uuid = new UUID(4);

//  make a UUID version 5 (name-based, SHA-1)
uuid = new UUID(5, "ns:URL", "http://example.com/");
```

License
-------

Copyright (c) 2004-2017 Ralf S. Engelschall (http://engelschall.com/)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

