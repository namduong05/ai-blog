import { ZodError } from "zod";

const validate = (schema) => {
  return async (req, res, next) => {
    try {
      const data = await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      req.validated = data;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          code: 400,
          status: false,
          message: "Dữ liệu không hợp lệ",
          errors: error.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
            type: e.code,
            value: e.input,
          })),
        });
      }

      return res.status(500).json({
        code: 500,
        status: false,
        message: "Server error",
      });
    }
  };
};

export default validate;
