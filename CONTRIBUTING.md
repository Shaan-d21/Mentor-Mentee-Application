
# 🚀 Git Workflow & Branching Strategy

## 🔹 Branches

![image](https://github.com/user-attachments/assets/25bf9890-dab4-41dd-9a32-9e3ad6b8fab8)

![image](https://github.com/user-attachments/assets/08c786d2-51ab-420d-821f-4410b1d914ce)

## ✅ Branch Naming Conventions

- **Feature branch**: `feature/chat-module`
- **Bug fix branch**: `bugfix/api-response-error`

🔹 **No direct commits to `main` or `staging`!** Always use PRs.

---

## 🛠 Setting Up the Project

Clone the repository:

```sh
git clone https://github.com/your-org/Mentor-Mentee-Application.git
cd Mentor-Mentee-Application
```

Install dependencies (if applicable):

```sh
# For frontend  
npm install  

# For backend  
pip install -r requirements.txt  
```

---

## 🔄 Git Workflow

### Step 1: Pull Latest Changes

```sh
git checkout dev
git pull origin dev
```

### Step 2: Create a Feature Branch

```sh
git checkout -b feature/authentication
```

### Step 3: Work on Changes & Commit

```sh
git add .
git commit -m "feat: Add authentication module"
```

🔹 **Follow conventional commits for clear commit messages:**

- `feat: Add mentor profile page`  
- `fix: Resolve mentee login issue`  

### Step 4: Push Code & Create PR

```sh
git push origin feature/authentication
```

Go to GitHub and create a Pull Request (PR) from `feature/authentication` → `dev`.

#### PR Template:

```md
## Summary  
Briefly describe the changes made.  

## Related Issues  
Closes #12  

## Changes Made  
- Implemented X feature  
- Fixed Y bug  
- Refactored Z module  

## Testing Steps  
1. Run `npm start`  
2. Check `/api/mentor` endpoint  
3. Ensure no errors in logs  
```

---

## 🛡 Pull Request (PR) Guidelines

✔ All PRs must be reviewed before merging.  
✔ Ensure CI/CD checks pass before merging.  
✔ Add relevant labels (e.g., `bug`, `feature`).  

🔹 **Merging Process:**

- `feature/*` → `dev` _(After PR approval)_  
- `dev` → `staging` _(After full integration testing)_  
- `staging` → `main` _(Only by DevOps after final QA)_  

---

## 📦 CI/CD & Deployment Rules

🔹 **CI/CD Pipelines:**

- **Merging to `main`** → Deploys to **production**  
- **Merging to `staging`** → Deploys to **staging environment**  
- **Merging to `dev`** → Runs tests but doesn’t auto-deploy  

---

## 🔐 Security & Best Practices

✔ **Never commit API keys, passwords, or secrets.** Use `.env` files.
