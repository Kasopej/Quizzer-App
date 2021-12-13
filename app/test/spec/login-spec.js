describe("Login", function () {
  it("gives an error if any paramters are undefined", function () {
    let entries = [
      [undefined, undefined],
      ["kasope@gmail.com", undefined],
      [undefined, "Pshfgh5t55"],
    ];
    entries.forEach((entry) => login(entry));
  });
});
