import optGenerator from "otp-generator";

let generate = (fname) => {
  let password = optGenerator.generate(9, {
    lowerCaseAlphabets: true,
    upperCaseAlphabets: true,
    specialChars: false,
    digits: true,
  });

  let username =
    fname.toLowerCase() +
    optGenerator.generate(4, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
      digits: true,
    });
  return { username, password };
};

export default generate;
