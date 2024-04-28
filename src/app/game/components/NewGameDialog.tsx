"use client";

import React from "react";
import {
  DialogFooter,
  DialogHeader,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";

import classNames from "classnames";
import { useMediaQuery } from "@/hooks/useMediaQuery.hook";

interface NewGameDialogProps {
  title: string;
  description: string;
  triggerText: string;
  onClick: () => void;
  onClickText: string;
}

export function NewGameDialog(props: NewGameDialogProps) {
  const { title, description, triggerText, onClick, onClickText } = props;
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  function handleOpen(isOpen: boolean) {
    setOpen(isOpen);
    const body = document.querySelector("body");
    // The drawer component sets the body to position fixed and it messes up the layout
    if (body) {
      body.style.removeProperty("position");
      body.style.removeProperty("left");
      body.style.removeProperty("right");
      body.style.removeProperty("top");
      body.style.removeProperty("bottom");
      body.style.removeProperty("height");
    }
    setTimeout(() => {
      if (body) {
        body.style.removeProperty("backgound");
      }
    }, 0);
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpen}>
        <DialogTrigger
          className={classNames(
            "px-4 py-2 text-sm font-light rounded-lg   hover:text-white hover:bg-blue-900  transition-all bg-gray-900/60 text-gray-500/80"
          )}
        >
          {triggerText}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <DialogDescription>{description}</DialogDescription>
          <DialogFooter>
            <DialogClose className="px-4 py-2 text-sm font-light rounded-lg hover:text-white hover:bg-gray-900 transition-all">
              Cancel
            </DialogClose>
            <DialogClose
              onClick={onClick}
              className="px-4 py-2 text-sm font-light rounded-lg bg-blue-900/70 text-slate-300 shadow-lg hover:bg-blue-900 transition-all"
            >
              {onClickText}
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={handleOpen}>
      <DrawerTrigger asChild>
        <DrawerTrigger
          className={classNames(
            "px-4 py-2 text-sm font-light rounded-lg   hover:text-white hover:bg-blue-900  transition-all bg-gray-900/60 text-gray-500/80"
          )}
        >
          {triggerText}
        </DrawerTrigger>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        <DrawerDescription>{description}</DrawerDescription>
        <DrawerFooter className="pt-2">
          <DrawerClose className="px-4 py-2 text-sm font-light rounded-lg hover:text-white hover:bg-gray-900 transition-all">
            Cancel
          </DrawerClose>
          <DrawerClose
            onClick={onClick}
            className="px-4 py-2 text-sm font-light rounded-lg bg-blue-900/70 text-slate-300 shadow-lg hover:bg-blue-900 transition-all"
          >
            {onClickText}
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
export default NewGameDialog;
