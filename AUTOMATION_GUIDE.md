# Automation Guide for Gemini Agent

This document outlines the automated actions performed by the Gemini agent within this project.

## Automatic Commit and Push

After making any modifications to the codebase (e.g., writing files, replacing content, running shell commands that alter files), the Gemini agent will automatically perform the following Git operations:

1.  **Stage all changes:** `git add .`
2.  **Commit changes:** `git commit -m "[Automated] <Descriptive message of changes>"`
    *   The commit message will be descriptive of the changes made during the interaction.
3.  **Push to `origin main`:** `git push origin main`

This process ensures that changes are immediately reflected in the remote repository without requiring explicit user confirmation for each commit and push.

## Workflow for Code Modifications

When a code modification is requested or required:

1.  **Analyze:** Understand the request and relevant code context.
2.  **Plan:** Formulate a plan for the changes.
3.  **Implement:** Execute tool calls to make the changes.
4.  **Automated Commit & Push:** Perform the `git add .`, `git commit`, and `git push origin main` operations automatically.
5.  **Verify (if applicable):** Run tests or build commands to verify the changes.

This automation aims to streamline the development process and reduce repetitive interactions.
