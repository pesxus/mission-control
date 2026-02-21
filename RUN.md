# How to Run Mission Control

## Prerequisites

✅ Convex configured and deployed
✅ Next.js project created
✅ All Convex functions uploaded

---

## Run Development Server

```bash
cd /data/.openclaw/workspace/mission-control
npm run dev
```

This will start the Next.js dev server at `http://localhost:3000`

---

## What You'll See

**1. Tasks List Page** (`/tasks`)
- List all tasks with status, description, creation date
- Click on any task to see details

**2. Task Details Page** (`/tasks/[id]`)
- Task title and description
- Current status badge
- Link to chat
- Update status button (coming soon)

**3. Task Chat Page** (`/tasks/[id]/chat`)
- All messages in the task
- Send new messages
- View conversation history

---

## Next Steps

### 1. Create Task
- Add a "Create Task" button on the tasks page
- Implement `api.tasks.create` mutation

### 2. Update Task Status
- Add status dropdown on task details
- Implement `api.tasks.updateStatus` mutation

### 3. Agent Integration
- Get real agent IDs from Convex agents collection
- Implement daemon process for notifications

---

## Configuration

**Convex URL:** https://terrific-meadowlark-70.convex.cloud
**Deployment Token:** In .env.local

---

*Last updated: 2026-02-19 20:00 PM*
