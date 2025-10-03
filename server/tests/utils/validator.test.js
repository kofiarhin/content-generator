const { validateGeneration, validateOrThrow } = require('../../utils/validator');

describe('validator', () => {
  const validPayload = {
    meta: {
      type: 'youtube_idea',
      tone: 'casual',
      lang: 'en',
      brand: 'devkofi'
    },
    assets: [
      {
        id: '1',
        title: 'Title',
        body: 'Body'
      }
    ]
  };

  it('should validate a correct payload', () => {
    const isValid = validateGeneration(validPayload);
    expect(isValid).toBe(true);
  });

  it('should throw on invalid payload', () => {
    expect(() => validateOrThrow({})).toThrow('Generation response failed validation');
  });
});
