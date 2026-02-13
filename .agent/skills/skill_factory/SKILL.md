# Skill Factory

This skill is designed to create other standardized skills for the Antigravity agent. It ensures all new skills follow the correct structure and include necessary sections for optimal performance.

## When to use
Use this skill when the user requests a new reusable ability or when you identify a repetitive process that should be encapsulated into a skill.

## Input requirements
- **Skill Name**: Descriptive name for the new ability.
- **Description**: What the skill does.
- **Goal**: What the skill aims to achieve.
- **Rules/Steps**: Specific instructions or constraints.

## Output Structure
Every skill must be created in `.agent/skills/[skill_name]/` and contain:
1. `SKILL.md`: The main instruction file with YAML frontmatter.
2. `resources/` (optional): Additional context or data files.

## Checklist for New Skills
- [ ] Unique and descriptive name.
- [ ] Clear "When to use" section.
- [ ] Step-by-step instructions.
- [ ] Format/Output requirements.
- [ ] Error handling/What to avoid.
