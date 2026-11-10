# ADR 0002: Client-Side Safety and Zero-Evaluation Architecture

## Status
Accepted

## Context
Modules A (Exploratory Data Analysis) and Visualization produce Python scripts (`pandas`, `matplotlib`, `seaborn`) based on user-provided natural language specifications.

Executing arbitrary, LLM-generated Python code in a production backend introduces extreme security risks:
- Remote Code Execution (RCE) via `eval()`, `exec()`, or sub-shell invocation.
- Server-Side Request Forgery (SSRF) and data exfiltration through injected socket calls.
- Resource exhaustion (fork bombs, infinite loops, out-of-memory crashes).

## Decision
We enforce a strict **Zero-Evaluation Guarantee**:
1. Generated Python code is strictly treated as text/source-code payload.
2. The backend **never** passes generated code to Python's `eval()` or `exec()`.
3. The frontend displays the code inside a read-only monospace code viewer (`CodeResult.tsx`) with syntax highlighting and explicit copy / download actions.
4. Users review and execute scripts in their own isolated local environments against their local datasets.
5. All UI panels display a prominent safety notice: *"Generated code is not executed automatically. Inspect and test in your local Python environment."*

## Consequences

### Positive
- Completely neutralizes RCE and server compromise attack vectors from prompt injection.
- Zero server compute overhead for executing heavy data analysis or rendering plots.
- Complete transparency: developers see the exact script before running it.

### Negative
- Users who expect an in-browser sandbox runner (like JupyterLite) must manually run the script locally or copy it to their IDE.
