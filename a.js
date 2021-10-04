let bb = function () {
  let arr = [1, 2, 3, 4, 5];
  try {
    arr.forEach((item) => {
      console.log(item);
      if (item == 3) {
        console.log('item');
        // return
        // break // 语法报错
        throw new error(); // 主动去抛出一个错误
        console.log('return');
      }
    });
  } catch {
    console.log('跳出来了');
  }
};
bb(); // 1 2 3 item 跳出来了
