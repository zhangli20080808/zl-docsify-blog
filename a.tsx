setTimeout(() => {
 console.log(1);
 Promise.resolve().then(()=>{
   console.log('Promise1');
 })
});

setTimeout(() => {
  console.log(2);
  Promise.resolve().then(()=>{
    console.log('Promise2');
  })
 });