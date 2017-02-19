/*!
**  Pure-UUID -- Pure JavaScript Based Universally Unique Identifier (UUID)
**  Copyright (c) 2004-2017 Ralf S. Engelschall <rse@engelschall.com>
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
    parse(str: String): UUID;

    /*  formatting  */
    format(type?: String): String;

    /*  formatting (alias)  */
    toString(type?: String): String;

    /*  importing  */
    import(arr: Number[]): UUID;

    /*  exporting  */
    export(): Number[];

    /*  byte-wise comparison  */
    compare(other: UUID): boolean;
}

