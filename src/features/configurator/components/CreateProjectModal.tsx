"use client";

import { Dialog } from "@/ui/Dialog";

export interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateProjectModal({ open, onClose }: CreateProjectModalProps) {
  return (
    <Dialog open={open} onClose={onClose} size="lg">
      <Dialog.Header>
        <Dialog.Title>Create Project</Dialog.Title>
        <Dialog.Description>
          Modal implementation will replace this stub in the UI execution phase.
        </Dialog.Description>
      </Dialog.Header>
    </Dialog>
  );
}
