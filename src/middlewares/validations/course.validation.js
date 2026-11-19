// * ARCHIVO A COMPLETAR
// * Imports y courseIdValidation ya resueltos
import { body, param } from "express-validator";
import Course from "../../models/course.model.js";
import Topic from "../../models/topic.model.js";
import User from "../../models/user.model.js";

export const courseIdValidation = [
  param("id").isMongoId().withMessage("El ID del curso no es válido"),
];

export const createCourseValidation = [
  body("title") // TODO 1: de 3 a 100 caracteres y único (custom con una consulta a la base).
    .trim()
    .notEmpty()
    .withMessage("El titulo es obligatorio")
    .bail()
    .isLength({ min: 3, max: 100 })
    .withMessage("El título debe tener entre 2 y 50 caracteres")
    .bail()
    .custom(async (value) => {
      const course = await Course.findOne({ name: value });
      if (course) {
        throw new Error("Ya existe un curso con ese titulo");
      }
      return true;
    }),

  body("description") // TODO 2: de 10 a 500 caracteres.
    .trim()
    .isLength({ min: 10 })
    .withMessage("La descripción debe tener al menos 10 caracteres")
    .isLength({ max: 500 })
    .withMessage("La descripción no puede superar los 500 caracteres"),

  body("level") // TODO 3: opcional; valores permitidos: ["beginner", "intermediate", "advanced"].
    .optional()
    .isIn(["beginner", "intermediate", "advanced"])
    .withMessage("El nivel no es válido"),

  body("price") // TODO 4: opcional; número mayor o igual a 0.
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El precio debe ser un número mayor o igual a 0"),

  body("schedule.day") // TODO 5: valores permitidos: ["monday", "tuesday", "wednesday", "thursday", "friday"].
    .isIn(["monday", "tuesday", "wednesday", "thursday", "friday"])
    .withMessage("El dia no es valido"),

  body("schedule.startTime") // TODO 6: fecha válida (Date), obligatoria.
    .notEmpty()
    .isDate()
    .withMessage("La fecha de inicio no es válida")
    .bail()
    .custom((value, { req }) => {
      const start = new Date(req.body.schedule.startTime);
      const end = new Date(value);

      if (end <= start) {
        throw new Error("La fecha de fin debe ser posterior al inicio");
      }

      return true;
    }),

  body("schedule.endTime") // TODO 7: fecha válida (Date), obligatoria, y posterior a startTime (custom).
    .notEmpty()
    .isISO8601()
    .custom((value, { req }) => {
      const start = new Date(req.body.schedule.startTime);
      const end = new Date(value);

      if (end <= start) {
        throw new Error("La fecha de fin debe ser posterior al inicio");
      }

      return true;
    }),

  body("teacher") // TODO 8: obligatorio; ID de MongoDB válido y el teacher debe existir y estar activo, es decir, con deletedAt null (custom).
    .isMongoId()
    .withMessage("El ID del profesor no es válido")
    .bail()
    .custom(async (value) => {
      const user = await User.findOne({
        _id: value,
        deletedAt: null,
      });

      if (!user) {
        throw new Error("El profesor no existe o está eliminado");
      }

      return true;
    }),

  body("topics")// TODO 9: opcional; array cuyos IDs existan en la base (custom).
  .optional()
  .isArray()
  .withMessage("Los tópicos deben ser un arreglo"),

body("topics.*")
  .isMongoId()
  .withMessage("El ID del tópico no es válido")
  .bail()
  .custom(async (value) => {
    const topic = await Topic.findById(value);

    if (!topic) {
      throw new Error("El tópico no existe");
    }

    return true;
  }),
];

export const updateCourseValidation = [
  param("id") // TODO 10: validar con isMongoId().
    .isEmpty()
    .isMongoId(),

  body("title") // TODO 11: igual que en la creación, pero opcional. La unicidad debe excluir al propio curso.
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El titulo es obligatorio")
    .bail()
    .isLength({ min: 3, max: 100 })
    .withMessage("El título debe tener entre 2 y 50 caracteres")
    .bail()
    .custom(async (value) => {
      const course = await Course.findOne({ name: value });
      if (course) {
        throw new Error("Ya existe un curso con ese titulo");
      }
      return true;
    }),

  body("description") // TODO 12: igual que en la creación, pero opcional.
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage("La descripción debe tener entre 10 y 500 caracteres"),

  body("level") // TODO 13: igual que en la creación, pero opcional (valores permitidos: ["beginner", "intermediate", "advanced"]).
    .optional()
    .isIn(["beginner", "intermediate", "advanced"])
    .withMessage("El nivel no es válido"),

  body("price") // TODO 14: igual que en la creación, pero opcional.
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El precio debe ser mayor o igual a 0"),

  body("schedule.day") // TODO 15: igual que en la creación, pero opcional (valores permitidos: ["monday", "tuesday", "wednesday", "thursday", "friday"]).
    .optional()
    .isIn(["monday", "tuesday", "wednesday", "thursday", "friday"])
    .withMessage("El día no es válido"),

  body("schedule.startTime") // TODO 16: igual que en la creación, pero opcional.
    .optional()
    .isISO8601()
    .withMessage("La fecha de inicio no es válida"),

  body("schedule.endTime")// TODO 17: igual que en la creación, pero opcional (y posterior a startTime si ambos llegan).
   .optional()
    .isISO8601()
    .withMessage("La fecha de finalización no es válida")
    .bail()
    .custom((value, { req }) => {
      if (!req.body.schedule?.startTime) {
        return true;
      }

      const start = new Date(req.body.schedule.startTime);
      const end = new Date(value);

      if (end <= start) {
        throw new Error("La fecha de fin debe ser posterior al inicio");
      }

      return true;
    }),


  body("teacher") // TODO 18: igual que en la creación, pero opcional.
    .optional()
    .isMongoId()
    .withMessage("El ID del profesor no es válido")
    .bail()
    .custom(async (value) => {
      const user = await User.findOne({
        _id: value,
        deletedAt: null,
      });

      if (!user) {
        throw new Error("El profesor no existe o está eliminado");
      }

      return true;
    }),

  body("topics") // TODO 19: igual que en la creación, pero opcional.
  .isMongoId()
    .withMessage("El ID del tópico no es válido")
    .bail()
    .custom(async (value) => {
      const topic = await Topic.findById(value);

      if (!topic) {
        throw new Error("El tópico no existe");
      }

      return true;
    }),
];
