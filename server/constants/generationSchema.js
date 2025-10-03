module.exports = {
  type: 'object',
  properties: {
    meta: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: [
            'youtube_idea',
            'youtube_script',
            'reel_hook',
            'carousel',
            'blog_outline',
            'email_newsletter'
          ]
        },
        tone: { type: 'string' },
        lang: { type: 'string', default: 'en' },
        brand: { type: 'string' },
        wordsTarget: { type: 'number' }
      },
      required: ['type', 'tone', 'lang', 'brand'],
      additionalProperties: true
    },
    assets: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          body: { type: 'string' },
          cta: { type: 'string' },
          tags: {
            type: 'array',
            items: { type: 'string' }
          }
        },
        required: ['id', 'title', 'body'],
        additionalProperties: true
      }
    },
    altIdeas: {
      type: 'array',
      items: { type: 'string' }
    },
    notes: { type: 'string' }
  },
  required: ['meta', 'assets'],
  additionalProperties: false
};
