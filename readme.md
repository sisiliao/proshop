## 一些笔记

·export const userDetailsReducer = (state = { user: {} }, action) => { ·
state 是指 redux state tree 中对应当前 reducer 的 state，不是整个 state tree，只是和这个 reducer 相关的 state，也就是在 stores.js 中注册的 userDetailsReducer。
{ user: {} } 是 deconstruct 当前 state 中的元素
