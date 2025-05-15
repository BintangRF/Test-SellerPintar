"use client";

import { CustomDialog } from "@/components/CustomDialog";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from "react";

interface DialogContextType {
  showDialog: (
    content: ReactNode,
    title?: string,
    description?: string
  ) => void;
  closeDialog: () => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<ReactNode>(null);
  const [title, setTitle] = useState<string>("Dialog");
  const [description, setDescription] = useState<string | undefined>();

  const showDialog = useCallback(
    (content: ReactNode, title?: string, description?: string) => {
      setContent(content);
      if (title) setTitle(title);
      if (description) setDescription(description);
      setOpen(true);
    },
    []
  );

  const closeDialog = useCallback(() => {
    setOpen(false);
    setContent(null);
  }, []);

  return (
    <DialogContext.Provider value={{ showDialog, closeDialog }}>
      {children}
      <CustomDialog
        open={open}
        onOpenChange={setOpen}
        title={title}
        description={description}
      >
        {content}
      </CustomDialog>
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  return useContext(DialogContext);
};
