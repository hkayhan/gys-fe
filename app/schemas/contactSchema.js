import * as Yup from "yup";

const requiredMessage = "Lütfen bu alanı doldurunuz.";
const requiredEmailMessage = "Lütfen geçerli bir email giriniz.";
const requiredPhoneNumberMessage =
    "Lütfen 10 haneli boşluksuz telefon numaranızı giriniz.";

export const contactSchema = Yup.object().shape({
    fullName: Yup.string().required(requiredMessage),
    email: Yup.string().email(requiredEmailMessage).required(requiredMessage),
    phoneNumber: Yup.string()
        .matches(/^s*-?[0-9]{10,10}s*$/, requiredPhoneNumberMessage)
        .required(requiredMessage),
});