interface Bird {
  fly: Boolean;
  sing: () => {};
}

interface Dog {
  fly: Boolean;
  dark: () => {};
}
function trainAnamial(animal: Bird | Dog) {
  if (animal.fly) {
    (animal as Bird).sing;
  } else {
    (animal as Dog).dark;
  }
}
