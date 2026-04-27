---
trigger: always_on
---

# Agent Guidelines

## 1. Execution Discipline (Existing Rules Refined)

- Always iterate on existing code before creating new code
- Do not introduce new patterns unless necessary
- Kill existing servers before starting new ones
- Restart server after changes
- Focus only on relevant code areas
- Do not touch unrelated code
- Never overwrite .env without confirmation

## 2. Code Quality Standards

- Code must be modular and readable
- No file should exceed 300 lines (refactor if needed)
- Avoid duplication (strict DRY enforcement)
- Use consistent naming conventions
- Remove unused or dead code immediately

## 3. Simplicity Rules (Clarified)

- Simple = fewer moving parts, not fewer features
- Avoid over-engineering
- But DO NOT sacrifice:
  - security
  - scalability
  - maintainability

## 4. Planning Enforcement (CRITICAL)

Before writing ANY code:

### Step 1: Understand the request
Extract:
- Goal
- User
- Expected outcome

### Step 2: Generate Q&A
Ask about:
- Features
- Constraints
- Tech preferences
- Edge cases
- Security needs

### Step 3: WAIT
Do NOT proceed until:
- All answers are provided
- User confirms: "Proceed"

## 5. Security (NON-NEGOTIABLE)

- Never trust user input
- Validate all inputs (frontend + backend)
- Use proper authentication & authorization
- Never expose sensitive data
- Use environment variables for secrets
- Prevent:
  - SQL injection
  - XSS
  - CSRF

If unsure → default to MORE secure option

## 6. Testing Requirements

- Every major feature must have tests
- Cover:
  - normal cases
  - edge cases
  - failure cases

- No fake data outside tests
- Tests must be runnable and meaningful

## 7. Performance Awareness

- Avoid unnecessary API calls
- Optimize database queries
- Avoid blocking operations
- Consider scalability from start

## 8. Architecture Stability

- Do not change working architecture without reason
- If replacing logic:
  - remove old implementation
  - avoid duplication

## 9. Environment Awareness

- Code must work in:
  - dev
  - test
  - prod

- No environment-specific hacks

## 10. Cleanliness & Organization

- Keep folder structure logical
- Group related logic
- Avoid clutter

## 11. Change Impact Awareness

Before making changes:
- Identify affected components
- Ensure no breaking changes
- Update related logic if needed

## 12. Design Awareness (NEW)

- UI must be:
  - clean
  - consistent
  - understandable

- No random styling decisions
- Follow consistent spacing, typography, and layout

## 13. Strict Behavior Rules

- Do not assume missing requirements
- Do not hallucinate features
- Ask when unclear
- Do not rush into coding

## Final Rule

Correctness > Speed
Clarity > Cleverness
Security > Convenience