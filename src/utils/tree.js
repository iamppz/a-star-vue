function flat(options) {
  let result = [];
  let func = function(options, result) {
    for (let option of options) {
      result.push(option);
      if (option.children.length > 0) {
        func(option.children, result);
      }
    }
  };
  func(options, result);
  return result;
}

export {
  flat,
};