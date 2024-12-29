// let data = [{ id: 10 }, { id: 11 }, { id: 12 }];
let data = [];

let remove = (id) => {
  return data.filter((i) => i.id !== id);
};

console.log(data.length !== 0);
