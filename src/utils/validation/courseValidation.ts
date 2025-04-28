import * as Yup from 'yup';

export const getCourseInfoValidationSchema = (t: (key: string) => string) => {
  return Yup.object({
    courseTitle: Yup.string().required(t("courseTitle.required")),
    status: Yup.string().required(t("status.required")),
    prerequisites: Yup.string().required(t("prerequisites.required")),
    validity: Yup.date()
      .required(t("validity.required"))
      .min(new Date(), t("validity.futureDate")),
    courseCover: Yup.string().required(t("courseCover.required")),
    level: Yup.string().required(t("level.required")),
    language: Yup.string().required(t("language.required")),
    maxAttendees: Yup.number()
      .required(t("maxAttendees.required"))
      .positive(t("maxAttendees.positive"))
      .integer(t("maxAttendees.integer")),
    medicalTest: Yup.string().required(t("medicalTest.required")),
    description: Yup.string().required(t("description.required")),
  });
};
export function getPricingValidationSchemaSingle(t: (key: string) => string) {
  return Yup.object().shape({
    price: Yup.number().required(t("price.required")).positive(t("price.positive")),
    discount: Yup.number().required(t("required")).min(0, t("discount.min")).max(100, t("discount.max")),
    isTheoreticalOnly: Yup.boolean(),
    type: Yup.string().required(t("required")),
    isCompanyTraining: Yup.boolean(),
  });
}
export const getPricingValidationSchema = (t: (key: string) => string) => {
  return Yup.object().shape({
    // Validate first pricing set (required)
    country_0: Yup.string()
      .required(t("country.required")),
    price_0: Yup.number()
      .required(t("price.required"))
      .positive(t("price.positive")),
    discount_0: Yup.number()
      .nullable()
      .transform((value) => (isNaN(value) ? null : value))
      .min(0, t("discount.min"))
      .max(50, t("discount.max")),

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...Array(10).reduce((acc: Record<string, Yup.ObjectSchema<any>>, _, index) => {
      if (index === 0) return acc;
      return {
        ...acc,
        [`country_${index}`]: Yup.string()
          .when(`price_${index}`, {
            is: (val: string | number | undefined) => val !== undefined && val !== '',
            then: (schema) => schema.required(t("country.required")),
          }),
        [`price_${index}`]: Yup.number()
          .transform((value) => (isNaN(value) ? undefined : value))
          .when(`country_${index}`, {
            is: (val: string | undefined) => val !== undefined && val !== '',
            then: (schema) => schema
              .required(t("price.required"))
              .positive(t("price.positive")),
          }),
        [`discount_${index}`]: Yup.number()
          .nullable()
          .transform((value) => (isNaN(value) ? null : value))
          .min(0, t("discount.min"))
          .max(100, t("discount.max")),
      };
    }, {}),
  });
};

export const getExamValidationSchema = (t: (key: string) => string) => {
  return Yup.object({
    examName: Yup.string().required(t("exam.name.required")),
    examType: Yup.string().required(t("exam.type.required")),
    instructions: Yup.string().required(t("exam.instructions.required")),
    examDuration: Yup.number()
      .required(t("exam.duration.required"))
      .positive(t("exam.duration.positive")),
    totalMarks: Yup.number()
      .required(t("exam.totalMarks.required"))
      .positive(t("exam.totalMarks.positive")),
    passMarks: Yup.number()
      .required(t("exam.passMarks.required"))
      .positive(t("exam.passMarks.positive"))
  });
};

export const getCertificateValidationSchema = (t: (key: string) => string) => {
  return Yup.object({
    certificateName: Yup.string().required(t("certificate.name.required")),
    validate_date_interval: Yup.array()
      .of(Yup.string().required())
      .min(2)
      .required(t("certificate.date_interval.required")),
    issue_date: Yup.string().required(t("certificate.issue_date.required")),
    displayScore: Yup.string().required(t("certificate.display_score.required")),
    watermark: Yup.string().required(t("certificate.watermark.required")),
  });
};

export const getSessionValidationSchema = (t: (key: string) => string) => {
  return Yup.object({
    sessionName: Yup.string().required(t("session.name.required")),
    description: Yup.string().required(t("session.description.required")),
    trainer: Yup.string().required(t("session.trainer.required")),
    assistant: Yup.string().required(t("session.assistant.required")),
    assessor: Yup.string().required(t("session.assessor.required")),
    scheduleType: Yup.string()
      .required(t("session.scheduleType.required"))
      .oneOf(["theoretical", "practical"], t("session.scheduleType.invalid")),
    session_date: Yup.string().required(t("session.date.required")),
    session_time: Yup.object({
      from: Yup.date().required(t("session.time.from.required")),
      to: Yup.date().required(t("session.time.to.required"))
    }).required(t("session.time.required"))
  });
};