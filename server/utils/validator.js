const Ajv = require('ajv');
const generationSchema = require('../constants/generationSchema');

const ajv = new Ajv({ allErrors: true, removeAdditional: true });

const validateGeneration = ajv.compile(generationSchema);

const validateOrThrow = (payload) => {
  const valid = validateGeneration(payload);
  if (!valid) {
    const error = new Error('Generation response failed validation');
    error.details = validateGeneration.errors;
    throw error;
  }
};

module.exports = {
  validateGeneration,
  validateOrThrow
};
