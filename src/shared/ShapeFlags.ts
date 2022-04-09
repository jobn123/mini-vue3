export const enum ShapeFlags {
  ELEMENT = 1, // 0000
  STATEFUL_COMPONENT = 1 << 1, // 0010
  TEXT_CHILDREN = 1 << 2, // 0100
  ARRAY_CHILDREN = 1 << 3 // 1000
}

// 位运算符
// 或 | 两位都为0才为0
// 与 & 两位都为1才为1

// |
// 0000
// 0001
// 0001

// 0000
// 0101
// 0101

// &
// 0000
// 0010
// 0000

// 0010
// 0010
// 0010