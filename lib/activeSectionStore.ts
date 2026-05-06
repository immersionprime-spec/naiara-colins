// Store simples via event emitter — sem Redux/Zustand
type Listener = (section: string) => void;
const listeners: Set<Listener> = new Set();
let currentSection = "inicio";

export const activeSectionStore = {
  subscribe(fn: Listener) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
  set(section: string) {
    currentSection = section;
    listeners.forEach((fn) => fn(section));
  },
  get() {
    return currentSection;
  },
};

