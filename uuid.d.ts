/*!
**  Pure-UUID -- Pure JavaScript Based Universally Unique Identifier (UUID)
**  Copyright (c) 2004-2025 Dr. Ralf S. Engelschall <rse@engelschall.com>
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

