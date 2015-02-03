
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
  `$ curl -O https://raw.github.com/rse/pure-uuid/master/uuid.js`

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
define([ "pure-uuid" ], function (UUID) {
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
    parse(string: String): UUID;

    /*  formatting  */
    format(): String;
}
```

License
-------

Copyright (c) 2004-2015 Ralf S. Engelschall (http://engelschall.com/)

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

