import * as Yup from 'yup';

export const getCourseInfoValidationSchema = (t: (key: string) => string) => {
  return Yup.object({
    courseTitle: Yup.string().required(t("validation.courseTitle.required")),
    status: Yup.string().required(t("validation.status.required")),
    prerequisites: Yup.string().required(t("validation.prerequisites.required")),
    validity: Yup.date()
      .required(t("validation.validity.required"))
      .min(new Date(), t("validation.validity.futureDate")),
    courseCover: Yup.string().required(t("validation.courseCover.required")),
    level: Yup.string().required(t("validation.level.required")),
    language: Yup.string().required(t("validation.language.required")),
    maxAttendees: Yup.number()
      .required(t("validation.maxAttendees.required"))
      .positive(t("validation.maxAttendees.positive"))
      .integer(t("validation.maxAttendees.integer")),
    medicalTest: Yup.string().required(t("validation.medicalTest.required")),
    description: Yup.string().required(t("validation.description.required")),
  });
};

export const getPricingValidationSchema = (t: (key: string) => string) => {
  return Yup.object().shape({
    // Validate first pricing set (required)
    country_0: Yup.string()
      .required(t("validation.country.required")),
    price_0: Yup.number()
      .required(t("validation.price.required"))
      .positive(t("validation.price.positive")),
    discount_0: Yup.number()
      .nullable()
      .transform((value) => (isNaN(value) ? null : value))
      .min(0, t("validation.discount.min"))
      .max(100, t("validation.discount.max")),

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...Array(10).reduce((acc: Record<string, Yup.ObjectSchema<any>>, _, index) => {
      if (index === 0) return acc;
      return {
        ...acc,
        [`country_${index}`]: Yup.string()
          .when(`price_${index}`, {
            is: (val: string | number | undefined) => val !== undefined && val !== '',
            then: (schema) => schema.required(t("validation.country.required")),
          }),
        [`price_${index}`]: Yup.number()
          .transform((value) => (isNaN(value) ? undefined : value))
          .when(`country_${index}`, {
            is: (val: string | undefined) => val !== undefined && val !== '',
            then: (schema) => schema
              .required(t("validation.price.required"))
              .positive(t("validation.price.positive")),
          }),
        [`discount_${index}`]: Yup.number()
          .nullable()
          .transform((value) => (isNaN(value) ? null : value))
          .min(0, t("validation.discount.min"))
          .max(100, t("validation.discount.max")),
      };
    }, {}),
  });
};

export const getExamValidationSchema = (t: (key: string) => string) => {
  return Yup.object({
    examName: Yup.string().required(t("validation.exam.name.required")),
    examType: Yup.string().required(t("validation.exam.type.required")),
    instructions: Yup.string().required(t("validation.exam.instructions.required")),
    examDuration: Yup.number()
      .required(t("validation.exam.duration.required"))
      .positive(t("validation.exam.duration.positive")),
    totalMarks: Yup.number()
      .required(t("validation.exam.totalMarks.required"))
      .positive(t("validation.exam.totalMarks.positive")),
    passMarks: Yup.number()
      .required(t("validation.exam.passMarks.required"))
      .positive(t("validation.exam.passMarks.positive"))
  });
};

export const getCertificateValidationSchema = (t: (key: string) => string) => {
  return Yup.object({
    certificateName: Yup.string().required(t("validation.certificate.name.required")),
    validate_date_interval: Yup.array()
      .of(Yup.string().required())
      .min(2)
      .required(t("validation.certificate.date_interval.required")),
    issue_date: Yup.string().required(t("validation.certificate.issue_date.required")),
    displayScore: Yup.string().required(t("validation.certificate.display_score.required")),
    watermark: Yup.string().required(t("validation.certificate.watermark.required")),
  });
};

export const getSessionValidationSchema = (t: (key: string) => string) => {
  return Yup.object({
    sessionName: Yup.string().required(t("validation.session.name.required")),
    description: Yup.string().required(t("validation.session.description.required")),
    trainer: Yup.string().required(t("validation.session.trainer.required")),
    assistant: Yup.string().required(t("validation.session.assistant.required")),
    assessor: Yup.string().required(t("validation.session.assessor.required")),
    scheduleType: Yup.string()
      .required(t("validation.session.scheduleType.required"))
      .oneOf(["theoretical", "practical"], t("validation.session.scheduleType.invalid")),
    session_date: Yup.string().required(t("validation.session.date.required")),
    session_time: Yup.object({
      from: Yup.date().required(t("validation.session.time.from.required")),
      to: Yup.date().required(t("validation.session.time.to.required"))
    }).required(t("validation.session.time.required"))
  });
};