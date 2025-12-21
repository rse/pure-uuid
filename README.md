
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

```
$ npm install pure-uuid
```

Using Pure-UUID
---------------

- global environment:

```js
const uuid = new UUID(3, "ns:URL", "http://example.com/");
```

- CommonJS environment:

```js
const UUID = require("pure-uuid");
const uuid = new UUID(3, "ns:URL", "http://example.com/");
```

- AMD environment:

```js
define(["pure-uuid"], function (UUID) {
    const uuid = new UUID(3, "ns:URL", "http://example.com/");
});
```

API
---

```ts
interface UUID {
    /**
     *  Generate a new UUID of a specific version.
     *  @param version - UUID version (1=time-based, 3=MD5-based, 4=random, 5=SHA-1-based)
     *  @param params - For v3/v5: namespace (string) and data (string). For v1/v4: no parameters needed
     *  @returns This UUID instance with the newly generated UUID
     */
    make(version: number, ...params: any[]): UUID

    /**
     *  Parse a UUID string representation and load it into this UUID instance.
     *  @param str - UUID string in standard format (e.g., "f81d4fae-7dec-11d0-a765-00a0c91e6bf6")
     *  @returns This UUID instance
     */
    parse(str: string): UUID

    /**
     *  Format the UUID as a string in the specified representation.
     *  @param type - Format type: "std" (standard, default), "b16" (Base16), or "z85" (ZeroMQ-Base85)
     *  @returns Formatted UUID string
     */
    format(type?: string): string

    /**
     *  Format the UUID as a string (alias for format()).
     *  @param type - Format type: "std" (standard, default), "b16" (Base16), or "z85" (ZeroMQ-Base85)
     *  @returns Formatted UUID string
     */
    toString(type?: string): string

    /**
     *  Serialize UUID to JSON as a standard format string.
     *  @returns UUID in standard string format
     */
    toJSON(): string

    /**
     *  Import UUID from a byte array.
     *  @param arr - Array of 16 bytes representing the UUID
     *  @returns This UUID instance
     */
    import(arr: number[]): UUID

    /**
     *  Export UUID to a byte array.
     *  @returns Array of 16 bytes representing the UUID
     */
    export(): number[]

    /**
     *  Compare this UUID with another UUID byte-wise.
     *  @param other - UUID to compare against
     *  @returns -1 if this < other, 0 if equal, +1 if this > other
     */
    compare(other: UUID): number

    /**
     *  Check if this UUID is equal to another UUID.
     *  @param other - UUID to compare against
     *  @returns true if UUIDs are equal, false otherwise
     */
    equal(other: UUID): boolean

    /**
     *  Fold UUID to a shorter representation by XOR-folding k times.
     *  @param k - Number of folding iterations (1-4), resulting in 8, 4, 2, or 1 byte(s)
     *  @returns Folded UUID as byte array
     */
    fold(k: number): number[]
}

interface UUIDConstructor {
  /**
   *  Create a new UUID instance with a random v4 UUID.
   */
  new(): UUID

  /**
   *  Create a new UUID instance by parsing a UUID string.
   *  @param uuid - UUID string in standard format (e.g., "f81d4fae-7dec-11d0-a765-00a0c91e6bf6")
   */
  new(uuid: string): UUID

  /**
   *  Create a new UUID instance of a specific version.
   *  @param version - UUID version (1=time-based or 4=random)
   */
  new(version: number): UUID

  /**
   *  Create a new UUID instance of a specific name-based version.
   *  @param version - UUID version (3=MD5-based or 5=SHA-1-based)
   *  @param ns - Namespace (e.g., "ns:URL", "ns:DNS", "ns:OID", "ns:X500" or a UUID string)
   *  @param data - Data to hash within the namespace
   */
  new(version: number, ns: string, data: string): UUID
}

declare const UUID: UUIDConstructor
export = UUID
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

//  format a UUID in standard format
str = uuid.format()
str = uuid.format("std")

//  format a UUID in Base16 format
str = uuid.format("b16")

//  format a UUID in ZeroMQ-Base85 format
str = uuid.format("z85")
```

License
-------

Copyright &copy; 2004-2025 Dr. Ralf S. Engelschall (http://engelschall.com/)

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

