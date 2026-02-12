import{T as a,U as o,A as r}from"./B412Jlrp.js";const i=a(async(s,u)=>{let t,e;try{[t,e]=o(()=>$fetch("/api/auth/me")),await t,e()}catch{return r("/auth/login")}});export{i as default};
