"use client";

import { useState, KeyboardEvent } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export function CreateTaskModal({
  isOpen,
  onClose,
  onCreated,
}: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedAgentIds, setSelectedAgentIds] = useState<Id<"agents">[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const agents = useQuery(api.agents.getAll);
  const createTask = useMutation(api.tasks.create);

  const leadAgent = agents?.find(
    (a) => a.level === "lead" || a.name === "Jarvis"
  ) ?? agents?.[0];

  const handleAddTag = (e?: KeyboardEvent<HTMLInputElement>) => {
    const value = tagInput.trim();
    if (value && (e?.key === "Enter" || !e)) {
      if (!tags.includes(value)) setTags([...tags, value]);
      setTagInput("");
      e?.preventDefault();
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const toggleAssignee = (id: Id<"agents">) => {
    setSelectedAgentIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    if (!leadAgent) {
      setError("No agents available. Please seed agents first.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await createTask({
        title: title.trim(),
        description: description.trim(),
        createdBy: leadAgent._id,
        assigneeIds: selectedAgentIds,
        tags: tags.length > 0 ? tags : undefined,
      });
      
      // Cleanup on success
      setTitle("");
      setDescription("");
      setSelectedAgentIds([]);
      setTags([]);
      onClose();
      onCreated?.();
    } catch (err) {
      console.error("Failed to create task:", err);
      setError(err instanceof Error ? err.message : "Failed to create task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setSelectedAgentIds([]);
    setTags([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/40"
        onClick={handleClose}
        aria-hidden
      />
      <div className="fixed inset-x-4 top-8 z-50 mx-auto max-h-[calc(100vh-4rem)] w-full max-w-md overflow-y-auto rounded-xl border border-stone-200 bg-white shadow-xl">
        <form onSubmit={handleSubmit} className="p-6">
          <h2 className="mb-6 text-lg font-semibold text-stone-900">
            Create Task
          </h2>
          <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              required
              className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description"
              rows={2}
              className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700">
              Assignees
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {agents?.map((a) => (
                <button
                  key={a._id}
                  type="button"
                  onClick={() => toggleAssignee(a._id)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                    selectedAgentIds.includes(a._id)
                      ? "bg-amber-500 text-white"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {a.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700">
              Tags
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => handleAddTag(e)}
              onBlur={() => handleAddTag()}
              placeholder="Type and press Enter to add"
              className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <div className="mt-2 flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-700"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-stone-500 hover:text-stone-900"
                    aria-label={`Remove ${tag}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          </div>
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !leadAgent || isSubmitting}
              className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
