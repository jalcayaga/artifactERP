---
name: systematic_troubleshooter
description: Expert in investigative debugging, identifying root causes, and planning fixes before code modification.
---

# Systematic Troubleshooter Skill

This skill embodies the "Systematic Debugging" capability: fixing the *cause*, not just the *symptom*.

## Core Methodology

### Phase 1: Cause Investigation
*   **Log Analysis**: Examine terminal logs, browser console, and server logs.
*   **Traceability**: Track the data flow from the UI through the API into the Database.
*   **Isolation**: Determine if the error is Frontend, Backend, or Infrastructure (Env vars, Permissions).

### Phase 2: Hypothesis & Replication
*   **Form Hypothesis**: "The error is likely caused by X missing property in the Y DTO."
*   **Replication**: Attempt to replicate the error using a script, a terminal command (curl/httpie), or a browser action.
*   **Observation**: Document the exact state that triggers the failure.

### Phase 3: Planning the Fix
*   **Assessment**: Does the fix require a schema change? A middleware? A simple guard?
*   **Phased Approach**: If the fix is complex, break it down:
    1.  Fix the underlying logic.
    2.  Update the UI to handle the state.
    3.  Add verification tests.

### Phase 4: Verification
*   **Regression Check**: Ensure the fix doesn't break related functionality.
*   **Proof**: Show the logs or browser state confirming the fix.

## Workflow Integration
1.  **Stop**: Don't immediately edit code when an error occurs.
2.  **Investigate**: Use `grep`, `find`, and `ls` to understand the affected area.
3.  **Propose**: Tell the user the cause and the plan.

## Debugging Checklist
*   [ ] Have I identified the EXACT line causing the error?
*   [ ] Do I have the full stack trace or error message?
*   [ ] Can I replicate this error reliably?
*   [ ] Have I checked related environment variables?
*   [ ] Is the planned fix addressing the root cause or just hiding the error?
