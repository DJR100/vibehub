import type { ProfileData } from "@/types"

interface EditProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProfileData) => void;
  initialData: ProfileData;
}

export function EditProfileDialog({ isOpen, onClose, onSave, initialData }: EditProfileDialogProps) {
  // ... component implementation ...
} 