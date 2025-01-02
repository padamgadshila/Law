import optGenerator from "otp-generator";

export let getOtp = () => {
  return optGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
    digits: true,
  });
};
