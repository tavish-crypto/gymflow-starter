# AI implementation guide

AI is intentionally left unimplemented.

Recommended learning order:

1. Pick one provider (Gemini or OpenAI).
2. Learn server-side API-key handling.
3. Build one small endpoint: workout-plan generation.
4. Ask the model for JSON, not prose.
5. Validate model output with Zod.
6. Let the user review the plan before saving it.
7. Persist approved output through the normal service/repository layer.
8. Add nutrition suggestions only after workout generation is reliable.
9. Keep medical/therapeutic nutrition outside the product scope.

Suggested AI flow:

```text
Member data + goal + preferences
          ↓
     Service layer
          ↓
       AI provider
          ↓
   Structured JSON output
          ↓
      Zod validation
          ↓
  User review / adjustment
          ↓
       PostgreSQL
```
