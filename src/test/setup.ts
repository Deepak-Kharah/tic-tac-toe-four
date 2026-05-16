import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock matchMedia for tests
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock framer-motion globally to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: new Proxy(
    {},
    {
      get: () => (props: any) => props.children || null,
    },
  ),
  AnimatePresence: (props: any) => props.children || null,
}));

// Mock confetti function
vi.mock("@/lib/confetti", () => ({
  launchFirework: vi.fn(),
}));

// Mock Next.js Link component
vi.mock("next/link", () => ({
  default: (props: any) => {
    // eslint-disable-next-line
    const React = require("react");
    return React.createElement(
      "a",
      { href: props.href, ...props },
      props.children,
    );
  },
}));

// Mock Next.js font
vi.mock("next/font/google", () => ({
  Satisfy: () => ({ className: "mock-satisfy-font" }),
}));

// Mock rough-notation to avoid annotation issues in tests
vi.mock("rough-notation", () => ({
  annotate: vi.fn(() => ({ show: vi.fn() })),
  annotationGroup: vi.fn(() => ({ show: vi.fn() })),
}));

// Mock UI components that use complex interactions
vi.mock("@/components/ui/dialog", () => ({
  Dialog: (props: any) => (props.open ? props.children : null),
  DialogTrigger: (props: any) => {
    const React = require("react");
    return React.createElement("button", { ...props }, props.children);
  },
  DialogContent: (props: any) => {
    const React = require("react");
    return React.createElement("div", { ...props }, props.children);
  },
  DialogHeader: (props: any) => {
    const React = require("react");
    return React.createElement("div", { ...props }, props.children);
  },
  DialogTitle: (props: any) => {
    const React = require("react");
    return React.createElement("h2", { ...props }, props.children);
  },
  DialogDescription: (props: any) => {
    const React = require("react");
    return React.createElement("p", { ...props }, props.children);
  },
  DialogFooter: (props: any) => {
    const React = require("react");
    return React.createElement("div", { ...props }, props.children);
  },
  DialogClose: (props: any) => {
    const React = require("react");
    return React.createElement("button", { ...props }, props.children);
  },
}));

vi.mock("@/components/ui/drawer", () => ({
  Drawer: (props: any) => (props.open ? props.children : null),
  DrawerTrigger: (props: any) => {
    const React = require("react");
    return React.createElement("button", { ...props }, props.children);
  },
  DrawerContent: (props: any) => {
    const React = require("react");
    return React.createElement("div", { ...props }, props.children);
  },
  DrawerHeader: (props: any) => {
    const React = require("react");
    return React.createElement("div", { ...props }, props.children);
  },
  DrawerTitle: (props: any) => {
    const React = require("react");
    return React.createElement("h2", { ...props }, props.children);
  },
  DrawerDescription: (props: any) => {
    const React = require("react");
    return React.createElement("p", { ...props }, props.children);
  },
  DrawerFooter: (props: any) => {
    const React = require("react");
    return React.createElement("div", { ...props }, props.children);
  },
  DrawerClose: (props: any) => {
    const React = require("react");
    return React.createElement("button", { ...props }, props.children);
  },
}));
